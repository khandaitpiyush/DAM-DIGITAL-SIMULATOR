import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { KoynaSimulationState } from '../../../data/koynaConfig';
import { setupLightingAndEffects } from './Effects';
import { createDamModel } from './DamModel';
import { createSpillwayGates } from './SpillwayGates';
import { createReservoirWater } from './ReservoirWater';
import { createDownstreamTerrain } from './DownstreamTerrain';
import { createFloodSimulation } from './FloodSimulation';
import { createCameraController, CameraPreset, CameraTelemetry } from './CameraController';
import { disposeThreeHierarchy } from './ThreeUtils';

interface Koyna3DSceneProps {
  simulationState: KoynaSimulationState;
  activePreset?: CameraPreset;
  onCameraUpdate?: (telemetry: CameraTelemetry) => void;
  showTerrainLayer?: boolean;
  showFloodLayer?: boolean;
}

export const Koyna3DScene: React.FC<Koyna3DSceneProps> = ({
  simulationState,
  activePreset = 'RESET',
  onCameraUpdate,
  showTerrainLayer = true,
  showFloodLayer = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cameraControllerRef = useRef<ReturnType<typeof createCameraController> | null>(null);

  // Keep latest React state in mutable refs so the animation loop runs at 60 FPS
  // with instant, zero-latency response to live slider and toggle inputs without re-mounting the scene.
  const simulationStateRef = useRef(simulationState);
  simulationStateRef.current = simulationState;

  const showTerrainLayerRef = useRef(showTerrainLayer);
  showTerrainLayerRef.current = showTerrainLayer;

  const showFloodLayerRef = useRef(showFloodLayer);
  showFloodLayerRef.current = showFloodLayer;

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    // 1. Scene setup with daylight sky background
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x93C5FD); // Bright daylight sky blue

    // 2. Camera & Controls
    const cameraController = createCameraController(container, width / height);
    cameraControllerRef.current = cameraController;

    // 3. WebGL Renderer with ACESFilmic tone mapping
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15; // Natural daytime exposure
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    container.appendChild(renderer.domElement);

    // 4. Subsystems
    const effects = setupLightingAndEffects(scene);
    const dam = createDamModel();
    scene.add(dam.group);

    const gates = createSpillwayGates();
    scene.add(gates.group);

    const reservoir = createReservoirWater();
    scene.add(reservoir.mesh);

    const terrain = createDownstreamTerrain();
    scene.add(terrain.group);

    const flood = createFloodSimulation();
    scene.add(flood.group);

    // 4b. Live 3D Rainfall Particle System (Fine, fast realistic droplets without blocky squares)
    const rainCount = 7000;
    const rainGeo = new THREE.BufferGeometry();
    const rainPos = new Float32Array(rainCount * 3);
    const rainVel = new Float32Array(rainCount);
    for (let i = 0; i < rainCount; i++) {
      rainPos[i * 3 + 0] = (Math.random() - 0.5) * 280;
      rainPos[i * 3 + 1] = Math.random() * 75;
      rainPos[i * 3 + 2] = (Math.random() - 0.5) * 280;
      rainVel[i] = 55 + Math.random() * 40;
    }
    rainGeo.setAttribute('position', new THREE.BufferAttribute(rainPos, 3));
    const rainMat = new THREE.PointsMaterial({
      color: 0xCBEAFE,
      size: 0.18,
      transparent: true,
      opacity: 0,
      depthWrite: false,
    });
    const rainPoints = new THREE.Points(rainGeo, rainMat);
    scene.add(rainPoints);

    // 5. Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Read current state from refs (live slider updates without stale closures)
      const state = simulationStateRef.current;
      const showTerrain = showTerrainLayerRef.current;
      const showFlood = showFloodLayerRef.current;

      // Update camera & controls
      const telemetry = cameraController.update(delta);
      if (onCameraUpdate) {
        onCameraUpdate(telemetry);
      }

      // Update daylight effects & warning strobes (crisp daylight, no fogging)
      const isCritical = state.breach.enabled || state.simulationStatus === 'RUNNING';
      effects.update(elapsed, isCritical, state.rainfallIntensity);

      // Update live rainfall particles: pure rain increase with zero fog haze
      const rainTargetOpacity = state.rainfallIntensity > 0 ? Math.min(0.88, 0.2 + (state.rainfallIntensity / 150) * 0.68) : 0;
      rainMat.opacity += (rainTargetOpacity - rainMat.opacity) * Math.min(1, delta * 6.5);
      rainPoints.visible = rainMat.opacity > 0.01;
      if (rainPoints.visible) {
        const pArr = rainGeo.attributes.position.array as Float32Array;
        const speedMult = 1 + (state.rainfallIntensity / 80);
        for (let i = 0; i < rainCount; i++) {
          pArr[i * 3 + 1] -= rainVel[i] * speedMult * delta;
          // Natural wind angle
          pArr[i * 3 + 0] -= delta * 5.5;
          if (pArr[i * 3 + 1] < 0) {
            pArr[i * 3 + 1] = 70 + Math.random() * 10;
            pArr[i * 3 + 0] = (Math.random() - 0.5) * 280;
          }
        }
        rainGeo.attributes.position.needsUpdate = true;
      }

      // Count open doors (gates with opening > 15% are counted)
      const openDoorsCount = state.gateOpenings.filter((pct) => (pct ?? 0) > 15).length;
      // Catastrophic valley flood occurs when 5 or all 6 doors are opened, or in a breach
      const isValleyFlood = openDoorsCount >= 5 || state.breach.enabled;

      // Live update dam breach opening
      dam.updateBreachVisuals(
        state.breach.enabled,
        state.breach.width,
        state.breach.depth
      );

      // Live update 6 radial spillway gates & physical water discharge (with dynamic boiling stilling basin)
      gates.update(state.gateOpenings, delta, elapsed, isValleyFlood);

      // Live update upstream reservoir water elevation & ripples
      reservoir.update(state.reservoirLevelMeters, delta, elapsed, state.inflow, state.rainfallIntensity);

      // Live update downstream river channel & terrain
      terrain.update(delta, elapsed, state.outflow, isValleyFlood);
      terrain.group.visible = showTerrain;

      // Live update flood propagation wave (drives immediately when 5+ gates open or breach occurs)
      flood.update(
        state.timelineStep,
        state.breach.enabled,
        state.breach.width,
        delta,
        elapsed,
        state.outflow,
        isValleyFlood
      );
      flood.group.visible = isValleyFlood || (showFlood && state.breach.enabled);

      // Render
      renderer.render(scene, cameraController.camera);
    };

    animate();

    // 6. Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: newW, height: newH } = entry.contentRect;
        if (newW > 0 && newH > 0) {
          cameraController.camera.aspect = newW / newH;
          cameraController.camera.updateProjectionMatrix();
          renderer.setSize(newW, newH);
        }
      }
    });
    resizeObserver.observe(container);

    // 7. Cleanup on Unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      cameraController.dispose();

      rainGeo.dispose();
      rainMat.dispose();

      disposeThreeHierarchy(scene);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Respond to camera preset changes
  useEffect(() => {
    if (cameraControllerRef.current && activePreset) {
      cameraControllerRef.current.setPreset(activePreset);
    }
  }, [activePreset]);

  return <div ref={containerRef} className="w-full h-full relative cursor-grab active:cursor-grabbing" />;
};
