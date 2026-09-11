import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export type CameraPreset = 'RESET' | 'TOP' | 'SPILLWAY' | 'DOWNSTREAM';

export interface CameraTelemetry {
  azimuthDeg: number;
  pitchDeg: number;
  fov: number;
  position: { x: number; y: number; z: number };
}

export interface CameraControllerInstance {
  camera: THREE.PerspectiveCamera;
  controls: OrbitControls;
  setPreset: (preset: CameraPreset) => void;
  update: (delta: number) => CameraTelemetry;
  dispose: () => void;
}

export function createCameraController(
  domElement: HTMLElement,
  aspectRatio: number
): CameraControllerInstance {
  const camera = new THREE.PerspectiveCamera(46, aspectRatio, 0.5, 1500);
  // Default camera: aerial composition showcasing the 32m tall dam anchored into mountains
  camera.position.set(-55, 46, 92);

  const controls = new OrbitControls(camera, domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.maxPolarAngle = Math.PI / 2 - 0.02; // Prevent camera sinking underground
  controls.minDistance = 10;
  controls.maxDistance = 750;
  controls.target.set(0, 16, 18);
  controls.update();

  let targetPosition = camera.position.clone();
  let targetLookAt = controls.target.clone();
  let isTransitioning = false;

  const presets: Record<CameraPreset, { pos: THREE.Vector3; target: THREE.Vector3 }> = {
    RESET: {
      // Aerial view inspired by real Koyna photograph (dam dominates, wings embedded into mountains)
      pos: new THREE.Vector3(-55, 46, 92),
      target: new THREE.Vector3(0, 16, 18),
    },
    TOP: {
      // High bird's eye view over reservoir, 32m crest and downstream channel
      pos: new THREE.Vector3(0, 185, 30),
      target: new THREE.Vector3(0, 14, 30),
    },
    SPILLWAY: {
      // Close-up inspection view of the 6 radial gates, piers & cascading chute
      pos: new THREE.Vector3(0, 36, 46),
      target: new THREE.Vector3(0, 24, 14),
    },
    DOWNSTREAM: {
      // Low angle looking up from the river bed at the towering dam face & stilling basin
      pos: new THREE.Vector3(28, 12, 115),
      target: new THREE.Vector3(0, 18, 24),
    },
  };

  return {
    camera,
    controls,
    setPreset: (preset: CameraPreset) => {
      const p = presets[preset];
      if (p) {
        targetPosition.copy(p.pos);
        targetLookAt.copy(p.target);
        isTransitioning = true;
      }
    },
    update: (delta: number): CameraTelemetry => {
      if (isTransitioning) {
        camera.position.lerp(targetPosition, Math.min(1, delta * 4.5));
        controls.target.lerp(targetLookAt, Math.min(1, delta * 4.5));
        if (camera.position.distanceTo(targetPosition) < 0.2) {
          isTransitioning = false;
        }
      }

      controls.update();

      // Compute telemetry
      const dir = new THREE.Vector3();
      camera.getWorldDirection(dir);
      const azimuth = Math.atan2(dir.x, dir.z) * (180 / Math.PI);
      const pitch = Math.asin(dir.y) * (180 / Math.PI);

      return {
        azimuthDeg: +((azimuth + 360) % 360).toFixed(1),
        pitchDeg: +(pitch).toFixed(1),
        fov: camera.fov,
        position: {
          x: +camera.position.x.toFixed(1),
          y: +camera.position.y.toFixed(1),
          z: +camera.position.z.toFixed(1),
        },
      };
    },
    dispose: () => {
      controls.dispose();
    },
  };
}
