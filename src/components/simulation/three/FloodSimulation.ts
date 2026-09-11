import * as THREE from 'three';
import { getKoynaRiverCenter } from './DownstreamTerrain';
import { createWaterFlowTexture } from './ThreeUtils';

export interface FloodSimulationSystem {
  group: THREE.Group;
  update: (
    timelineStep: string,
    breachEnabled: boolean,
    breachWidthM: number,
    delta: number,
    elapsed: number,
    outflowM3s?: number,
    isValleyFlood?: boolean
  ) => void;
}

export function createFloodSimulation(): FloodSimulationSystem {
  const group = new THREE.Group();
  group.name = 'FloodSimulationGroup';

  const length = 180.0;
  // Wide valley inundation mesh (60.0 units wide to submerge the full canyon floor)
  const floodGeo = new THREE.PlaneGeometry(60.0, length, 32, 96);
  floodGeo.rotateX(-Math.PI / 2);

  // Align precisely with world Z meander formula following Koyna's oxbow loop
  const floodPos = floodGeo.attributes.position;
  for (let i = 0; i < floodPos.count; i++) {
    const rz = floodPos.getZ(i); // in [-90, 90]
    const worldZ = rz + 60.0 + length / 2; // from 60 to 240
    const riverCenter = getKoynaRiverCenter(worldZ);
    floodPos.setX(i, floodPos.getX(i) + riverCenter);
  }
  floodGeo.computeVertexNormals();

  // Pure deep daylight blue water texture with dynamic rushing ripples
  const floodFlowTexture = createWaterFlowTexture();
  floodFlowTexture.wrapS = THREE.RepeatWrapping;
  floodFlowTexture.wrapT = THREE.RepeatWrapping;
  floodFlowTexture.repeat.set(3, 8);

  const floodMat = new THREE.MeshStandardMaterial({
    map: floodFlowTexture,
    color: 0x0284C7, // Vibrant deep daylight sapphire blue water
    roughness: 0.08,
    metalness: 0.28,
    transparent: true,
    opacity: 0.88,
    side: THREE.DoubleSide,
  });

  const floodMesh = new THREE.Mesh(floodGeo, floodMat);
  // Positioned directly at world Z = 150 (starts at Z = 60, ends at Z = 240)
  floodMesh.position.set(0, 0.8, 60.0 + length / 2);
  floodMesh.visible = false;
  group.add(floodMesh);

  let currentScaleZ = 0.05;
  let currentScaleX = 0.4;
  let currentElevation = 0.8;

  return {
    group,
    update: (
      timelineStep: string,
      breachEnabled: boolean,
      breachWidthM: number,
      delta: number,
      elapsed: number,
      outflowM3s: number = 0,
      isValleyFlood: boolean = false
    ) => {
      // Catastrophic valley-wide flood triggers ONLY when 5 or 6 doors are opened or during a breach
      const activeFlood = isValleyFlood || breachEnabled;

      if (!activeFlood) {
        // Less than 5 doors open & no breach: dry valley floor (normal flow stays inside the river bed)
        currentScaleZ = 0.05;
        currentScaleX = 0.4;
        currentElevation = 0.8;
        floodMesh.visible = false;
        return;
      }

      floodMesh.visible = true;

      // Target flood propagation extent and depth
      const breachMultiplier = breachEnabled ? 1.35 + (breachWidthM / 100) * 0.5 : 1.0;
      const targetScaleZ = Math.min(1.0, 0.95 * breachMultiplier);
      const targetScaleX = Math.min(1.2, 0.9 + (outflowM3s / 3640) * 0.3 * breachMultiplier);
      const targetElevation = breachEnabled ? 2.6 : 2.15;

      // Rapid, responsive surge wave progression down the valley
      currentScaleZ += (targetScaleZ - currentScaleZ) * Math.min(1, delta * 3.5);
      currentScaleX += (targetScaleX - currentScaleX) * Math.min(1, delta * 3.5);
      currentElevation += (targetElevation - currentElevation) * Math.min(1, delta * 3.5);

      floodMesh.scale.set(currentScaleX, 1, Math.max(0.1, currentScaleZ));
      floodMesh.position.y = currentElevation;

      // Rushing flow texture velocity along oxbow channel flowing DOWNSTREAM (positive offset.y)
      const rushSpeed = breachEnabled ? 18.0 : 6.0 + (outflowM3s / 3640) * 12.0;
      floodFlowTexture.offset.y += delta * rushSpeed;

      // Dynamic wave undulations across the flood surface (traveling downstream)
      const pos = floodGeo.attributes.position;
      for (let p = 0; p < pos.count; p++) {
        const xLocal = pos.getX(p);
        const zLocal = pos.getZ(p);
        const wave =
          Math.sin(xLocal * 0.35 + elapsed * 7.0) *
          Math.cos(zLocal * 0.45 - elapsed * 6.5) *
          0.22;
        pos.setY(p, wave);
      }
      pos.needsUpdate = true;
      floodGeo.computeVertexNormals();

      // Dynamic water color: crimson for breach disaster, daylight sapphire blue for spillway flood
      if (breachEnabled) {
        floodMat.color.setHex(0xDC2626);
        floodMat.opacity = 0.92;
      } else {
        floodMat.color.setHex(0x0284C7);
        floodMat.opacity = 0.88;
      }
    },
  };
}
