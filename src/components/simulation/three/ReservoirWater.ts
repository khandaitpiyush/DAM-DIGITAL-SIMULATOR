import * as THREE from 'three';
import { KOYNA_WORLD_SCALE } from '../../../data/koynaConfig';

export interface ReservoirWaterSystem {
  mesh: THREE.Mesh;
  update: (
    waterLevelMeters: number,
    delta: number,
    elapsed: number,
    inflowM3s?: number,
    rainfallIntensity?: number
  ) => void;
}

export function createReservoirWater(): ReservoirWaterSystem {
  const { reservoirWidth, reservoirLength, mapWaterLevelToY } = KOYNA_WORLD_SCALE;

  // Vast Shivsagar Lake plane extending into the distant Western Ghats valleys
  const segmentsX = 72;
  const segmentsY = 64;
  const geometry = new THREE.PlaneGeometry(reservoirWidth, reservoirLength, segmentsX, segmentsY);
  geometry.rotateX(-Math.PI / 2);

  // Deep daylight azure lake water matching consistent digital twin palette
  const material = new THREE.MeshStandardMaterial({
    color: 0x0284C7, // Consistent deep daylight sapphire blue
    emissive: 0x024E79,
    emissiveIntensity: 0.08,
    roughness: 0.08,
    metalness: 0.28,
    transparent: true,
    opacity: 0.92,
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = 'ShivsagarReservoirWater';
  mesh.receiveShadow = true;

  // Upstream water rests directly against the vertical upstream face of the dam (z <= 0)
  mesh.position.set(0, 21.8, -reservoirLength / 2);

  let currentElevation = 21.8;

  return {
    mesh,
    update: (
      waterLevelMeters: number,
      delta: number,
      elapsed: number,
      inflowM3s: number = 420,
      rainfallIntensity: number = 15
    ) => {
      // Map water level meters (620.0m - 665.0m) to Three.js Y elevation
      const targetElevation = mapWaterLevelToY(waterLevelMeters);

      // Smooth hydraulic stage transition (responsive to live slider movement)
      currentElevation += (targetElevation - currentElevation) * Math.min(1, delta * 4.5);
      mesh.position.y = currentElevation;

      // Surface chop scales dynamically with inflow and rainfall
      const chopFactor = 1.0 + Math.min(1.8, (inflowM3s / 1000) * 0.8 + (rainfallIntensity / 100) * 0.6);
      const waveSpeed = 1.6 * chopFactor;

      // Multi-harmonic natural surface ripples
      const posAttr = geometry.attributes.position;
      for (let i = 0; i < posAttr.count; i++) {
        const u = posAttr.getX(i);
        const v = posAttr.getZ(i);

        // Wind-generated progressive gravity waves
        const wave =
          Math.sin(u * 0.08 + elapsed * waveSpeed) * 0.18 * chopFactor +
          Math.cos(v * 0.09 + elapsed * (waveSpeed * 1.2)) * 0.14 * chopFactor +
          Math.sin((u + v) * 0.12 + elapsed * waveSpeed * 0.8) * 0.09;

        posAttr.setY(i, wave);
      }
      posAttr.needsUpdate = true;
      geometry.computeVertexNormals();
    },
  };
}
