import * as THREE from 'three';
import { KOYNA_WORLD_SCALE } from '../../../data/koynaConfig';
import { createWaterFlowTexture, createTurbulentFoamTexture } from './ThreeUtils';

export interface TerrainDataProvider {
  getElevationAt: (x: number, z: number) => number;
}

export interface DownstreamTerrainSystem {
  group: THREE.Group;
  riverMesh: THREE.Mesh;
  update: (delta: number, elapsed: number, outflowM3s: number, isValleyFlood?: boolean) => void;
}

export const getKoynaRiverCenter = (worldZ: number): number => {
  if (worldZ < 60) return 0;
  const s = worldZ - 60; // 0 to 180
  // Satellite-accurate Koyna horseshoe oxbow loop seen on Google Maps
  if (s < 35) {
    return -(s / 35) * 12.0;
  } else if (s < 105) {
    const t = (s - 35) / 70;
    return -12.0 - Math.sin(t * Math.PI) * 20.0 + t * 18.0;
  } else {
    const t = (s - 105) / 75;
    return 6.0 + Math.sin(t * Math.PI * 0.9) * 16.0 + t * 6.0;
  }
};

export function createDownstreamTerrain(): DownstreamTerrainSystem {
  const group = new THREE.Group();
  group.name = 'DownstreamTerrainGroup';

  const { terrainWidth, terrainLength, crestLength } = KOYNA_WORLD_SCALE;
  const segmentsX = 96;
  const segmentsZ = 96;

  const terrainGeo = new THREE.PlaneGeometry(terrainWidth, terrainLength, segmentsX, segmentsZ);
  terrainGeo.rotateX(-Math.PI / 2);

  const posAttr = terrainGeo.attributes.position;
  const terrainOffsetZ = terrainLength / 2 + 10; // 130.0

  // Western Ghats Canyon Elevation Profile (Satellite Calibrated)
  const getElevation = (x: number, zLocal: number): number => {
    const worldZ = zLocal + terrainOffsetZ; // World Z coordinate from 10 to 250
    const distFromCenter = Math.abs(x);

    // River meanders downstream following Koyna's authentic horseshoe loop
    const riverCenter = getKoynaRiverCenter(worldZ);
    const distFromRiver = Math.abs(x - riverCenter);

    // Stilling basin floor clearance (worldZ between 18 and 60, x between -19.5 and 19.5)
    if (distFromCenter < 19.5 && worldZ >= 18 && worldZ <= 60) {
      return 0.2; // Flat stilling basin bed
    }

    // Powerhouse foundation platform clearance on left toe (X between -44 and -18, Z between 18 and 55)
    if (x >= -44.0 && x <= -18.0 && worldZ >= 18 && worldZ <= 55) {
      return 0.35; // Powerhouse flat terrace
    }

    // River trench bed downstream of Koyna Bridge (worldZ >= 60)
    if (worldZ >= 60 && distFromRiver < 9.5) {
      return 0.25; // Deep carved riverbed
    }

    // Base canyon floor
    let baseH = 0.55;

    // Sloping riverbanks
    if (worldZ >= 60 && distFromRiver >= 9.5 && distFromRiver < 22.0) {
      baseH = 0.55 + (distFromRiver - 9.5) * 0.38;
    } else if (distFromCenter < 52.0) {
      baseH = 1.4;
    }

    // Central rounded forested knoll inside the river's horseshoe loop (from satellite photo)
    const knollDist = Math.hypot(x - (-8.0), worldZ - 118.0);
    if (knollDist < 16.0) {
      const knollH = Math.cos((knollDist / 16.0) * (Math.PI / 2)) * 7.5;
      baseH += knollH;
    }

    // Mountain ridges meeting the dam wings (Western Ghats slopes)
    if (distFromCenter >= 52.0) {
      const ridgeDist = distFromCenter - 52.0;
      const mountainSlope = Math.pow(ridgeDist * 0.11, 1.75);
      baseH = Math.max(baseH, 4.0 + mountainSlope);

      // Connect seamlessly with dam crest elevation (Y = 32.0) at the abutment contact (|x| >= 75)
      if (distFromCenter >= 75.0 && worldZ < 35) {
        const abutmentContact = 28.0 + (distFromCenter - 75.0) * 0.35;
        baseH = Math.max(baseH, Math.min(35.0, abutmentContact));
      }
    }

    // Natural Deccan trap stepped basalt geology noise
    const terrainNoise =
      Math.sin(x * 0.05) * 1.5 +
      Math.cos(worldZ * 0.04) * 1.3 +
      Math.sin(x * 0.12 + worldZ * 0.08) * 0.5;

    let totalHeight = baseH + terrainNoise;
    if (worldZ >= 60 && distFromRiver < 9.0) {
      totalHeight = Math.min(totalHeight, 0.35); // Keep trench flat for river
    }

    return Math.max(0.2, totalHeight);
  };

  for (let i = 0; i < posAttr.count; i++) {
    const x = posAttr.getX(i);
    const z = posAttr.getZ(i);
    posAttr.setY(i, getElevation(x, z));
  }
  terrainGeo.computeVertexNormals();

  // Natural Western Ghats forested terrain material (deep rainforest canopy green)
  const terrainMat = new THREE.MeshStandardMaterial({
    color: 0x224229, // Deep Western Ghats forest canopy green
    roughness: 0.88,
    metalness: 0.06,
    flatShading: true,
  });

  const terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
  terrainMesh.position.set(0, 0, terrainOffsetZ);
  terrainMesh.receiveShadow = true;
  group.add(terrainMesh);

  // 2. DOWNSTREAM RIVER CHANNEL WATER (Follows the Horseshoe Loop)
  const riverLength = 180.0;
  const riverGeo = new THREE.PlaneGeometry(17.0, riverLength, 16, 96);
  riverGeo.rotateX(-Math.PI / 2);

  const riverPos = riverGeo.attributes.position;
  for (let r = 0; r < riverPos.count; r++) {
    const rz = riverPos.getZ(r);
    const worldZ = rz + 60.0 + riverLength / 2; // World Z from 60 to 240
    // Follow the satellite-calibrated horseshoe loop
    const rCenter = getKoynaRiverCenter(worldZ);
    riverPos.setX(r, riverPos.getX(r) + rCenter);
  }
  riverGeo.computeVertexNormals();

  // Pure daylight sapphire flow texture
  const riverFlowTexture = createWaterFlowTexture();
  riverFlowTexture.wrapS = THREE.RepeatWrapping;
  riverFlowTexture.wrapT = THREE.RepeatWrapping;
  riverFlowTexture.repeat.set(1, 8);

  // Deep daylight river water material with animated currents
  const riverMat = new THREE.MeshStandardMaterial({
    map: riverFlowTexture,
    color: 0x0284C7, // Unified deep daylight sapphire blue water
    roughness: 0.08,
    metalness: 0.28,
    transparent: true,
    opacity: 0.92,
  });

  const riverMesh = new THREE.Mesh(riverGeo, riverMat);
  riverMesh.position.set(0, 0.48, 60.0 + riverLength / 2);
  riverMesh.receiveShadow = true;
  group.add(riverMesh);

  // 3. Winding Mountain Ghat Roads ("Koyna Dam Road" from Satellite Photo)
  // Snaking switchbacks with hairpin curves along the left mountain ridge
  const roadMat = new THREE.MeshStandardMaterial({
    color: 0x27272A, // Dark asphalt
    roughness: 0.85,
    metalness: 0.1,
  });

  const roadWaypoints = [
    new THREE.Vector3(-95.0, 32.2, 2.4), // Connects seamlessly with the 32m crest
    new THREE.Vector3(-98.0, 26.0, 15.0),
    new THREE.Vector3(-104.0, 20.5, 28.0),
    new THREE.Vector3(-92.0, 15.0, 42.0),
    new THREE.Vector3(-98.0, 9.5, 58.0),
    new THREE.Vector3(-75.0, 5.0, 72.0),
    new THREE.Vector3(-45.0, 2.5, 68.0),
    new THREE.Vector3(-22.0, 1.8, 63.0), // Approaches Koyna Bridge
  ];

  const roadCurve = new THREE.CatmullRomCurve3(roadWaypoints);
  const roadTubeGeo = new THREE.TubeGeometry(roadCurve, 64, 1.4, 6, false);
  const roadMesh = new THREE.Mesh(roadTubeGeo, roadMat);
  roadMesh.scale.set(1, 0.15, 1); // Flatten into a ribbon road
  roadMesh.position.y += 0.15;
  roadMesh.receiveShadow = true;
  group.add(roadMesh);

  return {
    group,
    riverMesh,
    update: (delta: number, elapsed: number, outflowM3s: number, isValleyFlood: boolean = false) => {
      // Hydrodynamic stage-discharge relation:
      // When 5 or 6 doors are opened (isValleyFlood), river swells massively to flood the valley
      const flowRatio = Math.min(1.0, Math.max(0, outflowM3s / 3640));
      const widthScale = isValleyFlood ? 3.6 : 1.0 + flowRatio * 0.8;
      const riverElevation = isValleyFlood ? 2.15 : 0.48 + flowRatio * 0.45;

      riverMesh.scale.set(widthScale, 1, 1);
      riverMesh.position.y = riverElevation;

      // Water flowing DOWNSTREAM (away from dam, into distance):
      const riverSpeed = 1.2 + flowRatio * 12.0;
      riverFlowTexture.offset.y += delta * riverSpeed;
      riverMat.color.setHex(0x0284C7);
    },
  };
}
