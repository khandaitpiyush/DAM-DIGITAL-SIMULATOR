import * as THREE from 'three';
import { KOYNA_WORLD_SCALE } from '../../../data/koynaConfig';
import { createWaterFlowTexture } from './ThreeUtils';

export interface SpillwayGatesSystem {
  group: THREE.Group;
  update: (gateOpenings: number[], delta: number, elapsed?: number, isValleyFlood?: boolean) => void;
}

interface SingleGateItem {
  id: number;
  pivotGroup: THREE.Group;
  gateLeaf: THREE.Mesh;
  currentOpeningPct: number;
  targetOpeningPct: number;
  chuteMesh: THREE.Mesh;
  chuteGeo: THREE.BufferGeometry;
}

// Generates 16 profile stations dynamically following the concrete chute face exactly
function getChuteProfile(crestHeight: number) {
  const stations: { z: number; y: number }[] = [];
  const count = 16;
  for (let i = 0; i < count; i++) {
    const u = i / (count - 1);
    const z = 1.4 + u * (31.2 - 1.4);
    let yConcrete = 0.4;

    if (z <= 8.4) {
      // Quadratic Bezier of Ogee crest: from (0, 26.5) with control (4.5, 26.5) to (8.4, 19.61)
      const t = Math.max(0, Math.min(1, z / 8.4));
      yConcrete = (1 - t) * (1 - t) * 26.5 + 2 * (1 - t) * t * 26.5 + t * t * 19.61;
    } else {
      // Straight glacis chute slope down to apron toe: from (8.4, 19.61) to (31.0, 0.4)
      const t = (z - 8.4) / (31.0 - 8.4);
      yConcrete = Math.max(0.4, 19.61 - t * (19.61 - 0.4));
    }

    // Water bed sits 0.15m above the concrete face so it never clips inside the dam
    stations.push({ z, y: yConcrete + 0.15 });
  }

  const normals: { nz: number; ny: number }[] = [];
  for (let i = 0; i < count; i++) {
    let dz = 0;
    let dy = 0;
    if (i === 0) {
      dz = stations[1].z - stations[0].z;
      dy = stations[1].y - stations[0].y;
    } else if (i === count - 1) {
      dz = stations[i].z - stations[i - 1].z;
      dy = stations[i].y - stations[i - 1].y;
    } else {
      dz = stations[i + 1].z - stations[i - 1].z;
      dy = stations[i + 1].y - stations[i - 1].y;
    }
    const len = Math.hypot(dz, dy) || 1;
    // Outward pointing normal (up and outward into the air)
    normals.push({ nz: -dy / len, ny: dz / len });
  }

  return { stations, normals, count };
}

// Creates solid volumetric 3D water chute prism with bed, top, side walls & toe face
function createVolumetricChuteGeometry(
  width: number,
  stations: { z: number; y: number }[],
  normals: { nz: number; ny: number }[]
): THREE.BufferGeometry {
  const halfW = (width * 0.96) / 2;
  const count = stations.length;
  const numVertices = count * 4;
  const positions = new Float32Array(numVertices * 3);
  const uvs = new Float32Array(numVertices * 2);
  const indices: number[] = [];

  for (let i = 0; i < count; i++) {
    const st = stations[i];
    const n = normals[i];
    const t = 1.6;
    const v = (i / (count - 1)) * 4.0;

    // 0: Bed Left
    positions[i * 12 + 0] = -halfW;
    positions[i * 12 + 1] = st.y;
    positions[i * 12 + 2] = st.z;
    uvs[i * 8 + 0] = 0.0;
    uvs[i * 8 + 1] = v;

    // 1: Bed Right
    positions[i * 12 + 3] = halfW;
    positions[i * 12 + 4] = st.y;
    positions[i * 12 + 5] = st.z;
    uvs[i * 8 + 2] = 1.0;
    uvs[i * 8 + 3] = v;

    // 2: Top Left
    positions[i * 12 + 6] = -halfW;
    positions[i * 12 + 7] = st.y + n.ny * t;
    positions[i * 12 + 8] = st.z + n.nz * t;
    uvs[i * 8 + 4] = 0.0;
    uvs[i * 8 + 5] = v;

    // 3: Top Right
    positions[i * 12 + 9] = halfW;
    positions[i * 12 + 10] = st.y + n.ny * t;
    positions[i * 12 + 11] = st.z + n.nz * t;
    uvs[i * 8 + 6] = 1.0;
    uvs[i * 8 + 7] = v;

    if (i < count - 1) {
      const bl0 = i * 4;
      const br0 = i * 4 + 1;
      const tl0 = i * 4 + 2;
      const tr0 = i * 4 + 3;

      const bl1 = (i + 1) * 4;
      const br1 = (i + 1) * 4 + 1;
      const tl1 = (i + 1) * 4 + 2;
      const tr1 = (i + 1) * 4 + 3;

      // Top surface
      indices.push(tl0, tr0, tl1);
      indices.push(tr0, tr1, tl1);

      // Left sidewall
      indices.push(bl0, tl0, bl1);
      indices.push(tl0, tl1, bl1);

      // Right sidewall
      indices.push(br0, br1, tr0);
      indices.push(tr0, br1, tr1);
    }
  }

  // Front plunge face at toe
  const blEnd = (count - 1) * 4;
  const brEnd = (count - 1) * 4 + 1;
  const tlEnd = (count - 1) * 4 + 2;
  const trEnd = (count - 1) * 4 + 3;
  indices.push(blEnd, brEnd, tlEnd);
  indices.push(brEnd, trEnd, tlEnd);

  const geom = new THREE.BufferGeometry();
  geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geom.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
  geom.setIndex(indices);
  geom.computeVertexNormals();
  return geom;
}

export function createSpillwayGates(): SpillwayGatesSystem {
  const group = new THREE.Group();
  group.name = 'SpillwayGatesSystem';

  const {
    damHeight,
    spillwayWidth,
    pierCount,
    pierWidth,
    gateWidth,
    baseWidth,
    basinLength,
  } = KOYNA_WORLD_SCALE;

  const spillwayCrestHeight = damHeight - 5.5; // ~26.5m
  const baySpacing = (spillwayWidth - pierCount * pierWidth) / (pierCount - 1);
  const armRadius = 5.2;

  // Stilling basin dimensions
  const basinTotalWidth = spillwayWidth + 2.0; // 36.0m
  const basinStart = baseWidth + 6.5; // 31.0m
  const basinCenterZ = basinStart + basinLength / 2; // 49.0m

  const { stations, normals, count: numStations } = getChuteProfile(spillwayCrestHeight);

  // 1. GATE MATERIALS
  const gateMaterial = new THREE.MeshStandardMaterial({
    color: 0xDC2626, // Vivid crimson red steel
    roughness: 0.35,
    metalness: 0.65,
    side: THREE.DoubleSide,
  });

  const trunnionArmMaterial = new THREE.MeshStandardMaterial({
    color: 0x1E293B, // Heavy structural dark steel
    roughness: 0.45,
    metalness: 0.85,
  });

  // 2. CLEAN BLUE FLOW TEXTURE
  const flowTexture = createWaterFlowTexture();
  flowTexture.wrapS = THREE.RepeatWrapping;
  flowTexture.wrapT = THREE.RepeatWrapping;
  flowTexture.repeat.set(1, 4);

  // Deep daylight pure blue water material
  const blueTorrentMaterial = new THREE.MeshStandardMaterial({
    map: flowTexture,
    color: 0x0284C7, // Deep turquoise torrential blue water
    roughness: 0.12,
    metalness: 0.25,
    transparent: true,
    opacity: 0.92,
    side: THREE.DoubleSide,
  });

  // 3. CREATE 6 INDIVIDUAL RADIAL GATES & VOLUMETRIC CHUTES
  const gates: SingleGateItem[] = [];
  const chuteWidth = baySpacing * 0.94;

  for (let i = 0; i < 6; i++) {
    const bayLeftX = -spillwayWidth / 2 + pierWidth + i * (baySpacing + pierWidth);
    const bayCenterX = bayLeftX + baySpacing / 2;

    // Pivot group positioned at the trunnion pin axis (Z=6.2, Y=27.7)
    const pivotZ = 6.2;
    const pivotY = spillwayCrestHeight + 1.2;
    const pivotGroup = new THREE.Group();
    pivotGroup.position.set(bayCenterX, pivotY, pivotZ);

    // Tainter gate cylindrical skin plate
    const skinGeo = new THREE.CylinderGeometry(
      armRadius,
      armRadius,
      chuteWidth,
      20,
      1,
      true,
      -Math.PI / 4.2,
      Math.PI / 2.1
    );
    skinGeo.rotateZ(Math.PI / 2);

    const gateLeaf = new THREE.Mesh(skinGeo, gateMaterial);
    gateLeaf.castShadow = true;
    gateLeaf.position.set(0, -0.6, -armRadius * 0.85);
    pivotGroup.add(gateLeaf);

    // Twin structural trunnion arms
    const armLength = armRadius * 0.92;
    const armGeo = new THREE.CylinderGeometry(0.18, 0.18, armLength, 8);
    armGeo.rotateX(Math.PI / 2);

    const leftArm = new THREE.Mesh(armGeo, trunnionArmMaterial);
    leftArm.position.set(-chuteWidth * 0.46, -0.3, -armLength / 2);
    pivotGroup.add(leftArm);

    const rightArm = new THREE.Mesh(armGeo, trunnionArmMaterial);
    rightArm.position.set(chuteWidth * 0.46, -0.3, -armLength / 2);
    pivotGroup.add(rightArm);

    // Arm cross brace
    const braceGeo = new THREE.CylinderGeometry(0.14, 0.14, chuteWidth * 0.92, 8);
    braceGeo.rotateZ(Math.PI / 2);
    const braceMesh = new THREE.Mesh(braceGeo, trunnionArmMaterial);
    braceMesh.position.set(0, -0.3, -armLength * 0.55);
    pivotGroup.add(braceMesh);

    group.add(pivotGroup);

    // Volumetric 3D Water Chute Group
    const chuteGroup = new THREE.Group();
    chuteGroup.position.set(bayCenterX, 0, 0);

    const chuteGeo = createVolumetricChuteGeometry(chuteWidth, stations, normals);
    const chuteMesh = new THREE.Mesh(chuteGeo, blueTorrentMaterial);
    chuteMesh.castShadow = true;
    chuteMesh.receiveShadow = true;
    chuteGroup.add(chuteMesh);

    chuteGroup.visible = false;
    group.add(chuteGroup);

    gates.push({
      id: i + 1,
      pivotGroup,
      gateLeaf,
      currentOpeningPct: 0,
      targetOpeningPct: 0,
      chuteMesh,
      chuteGeo,
    });
  }

  // 4. UNIFIED STILLING BASIN BLUE WATER POOL & SURGE
  const basinSegments = 40;
  const basinGeo = new THREE.PlaneGeometry(
    basinTotalWidth - 0.6,
    basinLength,
    basinSegments,
    basinSegments
  );
  basinGeo.rotateX(-Math.PI / 2);

  const basinMaterial = new THREE.MeshStandardMaterial({
    map: flowTexture,
    color: 0x0369A1, // Deep sapphire blue stilling basin water
    roughness: 0.14,
    metalness: 0.3,
    transparent: true,
    opacity: 0.94,
    side: THREE.DoubleSide,
  });

  const basinWaterMesh = new THREE.Mesh(basinGeo, basinMaterial);
  basinWaterMesh.position.set(0, 1.2, basinCenterZ);
  basinWaterMesh.receiveShadow = true;
  group.add(basinWaterMesh);

  // 5. END SILL BLUE WATERFALL CASCADE
  const cascadeWidth = basinTotalWidth - 0.8;
  const cascadeLength = 5.6;
  const cascadeGeo = new THREE.PlaneGeometry(cascadeWidth, cascadeLength, 16, 20);
  cascadeGeo.rotateX(-Math.PI / 2);

  const cascadePos = cascadeGeo.attributes.position;
  for (let c = 0; c < cascadePos.count; c++) {
    const zLocal = cascadePos.getZ(c);
    const u = (zLocal + 2.8) / 5.6;
    const yCurve = -Math.pow(u, 1.8) * 2.2;
    cascadePos.setY(c, yCurve);
  }
  cascadeGeo.computeVertexNormals();

  const waterfallCascade = new THREE.Mesh(cascadeGeo, blueTorrentMaterial);
  waterfallCascade.position.set(0, 1.8, basinStart + basinLength + 2.2);
  waterfallCascade.visible = false;
  group.add(waterfallCascade);

  let internalClock = 0;

  return {
    group,
    update: (gateOpenings: number[], delta: number, elapsed?: number, isValleyFlood: boolean = false) => {
      internalClock += delta;
      const curElapsed = elapsed ?? internalClock;

      // Count open doors
      const openDoorsCount = gateOpenings.filter((pct) => pct > 15).length;
      const totalGates = gateOpenings.length || 1;
      const sumOpening = gateOpenings.reduce((sum, v) => sum + (v ?? 0), 0);
      const avgOpening = sumOpening / totalGates;
      const avgFlowFraction = avgOpening / 100;

      // Flow velocity scales with discharge
      const flowSpeed = 2.5 + avgFlowFraction * 12.0;
      flowTexture.offset.y -= delta * flowSpeed;

      // A. UPDATE EACH RADIAL GATE & CHUTE
      gates.forEach((gate, idx) => {
        gate.targetOpeningPct = gateOpenings[idx] ?? 0;

        // Smooth servo gate positioning
        gate.currentOpeningPct +=
          (gate.targetOpeningPct - gate.currentOpeningPct) * Math.min(1, delta * 4.5);

        // Positive lift rotation opens radial gate leaf cleanly upward
        const liftAngle = (gate.currentOpeningPct / 100) * 0.45;
        gate.pivotGroup.rotation.x = liftAngle;

        const isOpen = gate.currentOpeningPct > 1.2;
        const chuteGroup = gate.chuteMesh.parent;
        if (chuteGroup) chuteGroup.visible = isOpen;

        if (isOpen) {
          const flowFraction = gate.currentOpeningPct / 100;
          const halfW = chuteWidth / 2;

          // Water thickness: swells with opening percentage (up to 2.8m thick torrent)
          const thicknessMultiplier = isValleyFlood ? 1.45 : 1.0;
          const posAttr = gate.chuteGeo.attributes.position;

          for (let s = 0; s < numStations; s++) {
            const st = stations[s];
            const n = normals[s];
            const baseT = (2.4 - (s / (numStations - 1)) * 0.7) * thicknessMultiplier;
            const thickness = Math.max(0.32, baseT * flowFraction);
            const wave =
              Math.sin(st.z * 1.8 - curElapsed * 18.0 + idx * 0.8) *
              (0.22 * flowFraction);

            // Bed vertices (resting right on top of concrete chute face)
            posAttr.setXYZ(s * 4 + 0, -halfW, st.y, st.z);
            posAttr.setXYZ(s * 4 + 1, halfW, st.y, st.z);

            // Top surface vertices (swells high above concrete with roaring waves)
            const topY = st.y + n.ny * thickness + wave;
            const topZ = st.z + n.nz * thickness;
            posAttr.setXYZ(s * 4 + 2, -halfW, topY, topZ);
            posAttr.setXYZ(s * 4 + 3, halfW, topY, topZ);
          }
          posAttr.needsUpdate = true;
          gate.chuteGeo.computeVertexNormals();
        }
      });

      // B. UPDATE STILLING BASIN BLUE WATER
      const isAnyOpen = avgFlowFraction > 0.015;
      waterfallCascade.visible = isAnyOpen;

      if (isAnyOpen) {
        // Basin water level surges: if 5 or 6 doors open, surges high to Y=2.9
        const basinBaseY = 1.2 + avgFlowFraction * (isValleyFlood ? 1.7 : 1.2);
        basinWaterMesh.position.y = basinBaseY;

        // Dynamic surface waves across the stilling basin (clean deep blue water ripples)
        const basinPos = basinGeo.attributes.position;
        for (let p = 0; p < basinPos.count; p++) {
          const bx = basinPos.getX(p);
          const bzLocal = basinPos.getZ(p);
          const worldZ = bzLocal + basinCenterZ;

          // Hydraulic jump mound over baffle blocks
          const zRel = (worldZ - (basinStart + 12.0)) / 7.0;
          const jumpHump = Math.exp(-zRel * zRel) * (1.6 * avgFlowFraction);

          // Deep blue water waves
          const wave =
            (Math.sin(bx * 0.45 + curElapsed * 8.0) * Math.cos(bzLocal * 0.55 - curElapsed * 7.0) +
              Math.sin((bx + bzLocal) * 0.7 + curElapsed * 10.0) * 0.4) *
            (0.35 * avgFlowFraction);

          basinPos.setY(p, jumpHump + wave);
        }
        basinPos.needsUpdate = true;
        basinGeo.computeVertexNormals();

        // Waterfall cascade over end sill
        waterfallCascade.position.y = basinBaseY;
        waterfallCascade.scale.set(1, 0.6 + avgFlowFraction * 0.7, 1);
      } else {
        // Calm emerald-blue pool when closed
        basinWaterMesh.position.y = 1.2;
        const basinPos = basinGeo.attributes.position;
        for (let p = 0; p < basinPos.count; p++) {
          basinPos.setY(p, 0);
        }
        basinPos.needsUpdate = true;
        basinGeo.computeVertexNormals();
      }
    },
  };
}
