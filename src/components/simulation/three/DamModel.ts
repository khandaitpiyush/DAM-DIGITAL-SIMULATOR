import * as THREE from 'three';
import { KOYNA_WORLD_SCALE } from '../../../data/koynaConfig';
import { createConcreteTexture } from './ThreeUtils';

export interface DamModelInstance {
  group: THREE.Group;
  updateBreachVisuals: (enabled: boolean, widthM: number, depthM: number) => void;
}

export function createDamModel(): DamModelInstance {
  const group = new THREE.Group();
  group.name = 'KoynaDamGroup';

  const {
    damHeight,
    crestLength,
    crestWidth,
    baseWidth,
    spillwayWidth,
    pierCount,
    pierWidth,
    basinLength,
    basinWallHeight,
  } = KOYNA_WORLD_SCALE;

  const concreteTexture = createConcreteTexture();

  // Weathered rubble-concrete material matching Koyna photograph
  const concreteMaterial = new THREE.MeshStandardMaterial({
    map: concreteTexture,
    color: 0x9AA5B4, // Weathered slate-grey concrete
    roughness: 0.76,
    metalness: 0.14,
  });

  // Darker water-patinated concrete for spillway chute and stilling basin
  const spillwayConcreteMat = new THREE.MeshStandardMaterial({
    map: concreteTexture,
    color: 0x64748B, // Darker wet concrete
    roughness: 0.68,
    metalness: 0.18,
  });

  // Dense structural pier and bridge concrete
  const pierMaterial = new THREE.MeshStandardMaterial({
    map: concreteTexture,
    color: 0xB0BCC9, // Light architectural concrete
    roughness: 0.65,
    metalness: 0.15,
  });

  // Dark asphalt roadway surface
  const roadMaterial = new THREE.MeshStandardMaterial({
    color: 0x1E2530, // Asphalt black
    roughness: 0.92,
    metalness: 0.05,
  });

  // White safety parapet railing
  const parapetMaterial = new THREE.MeshStandardMaterial({
    color: 0xE2E8F0, // Bright stone parapet
    roughness: 0.52,
    metalness: 0.08,
  });

  // 1. GRAVITY PROFILE CROSS SECTION (1:0.725 downstream batter slope)
  const damProfileShape = new THREE.Shape();
  damProfileShape.moveTo(0, 0); // Bottom upstream toe
  damProfileShape.lineTo(0, damHeight); // Vertical upstream face
  damProfileShape.lineTo(crestWidth, damHeight); // Crest road deck
  damProfileShape.lineTo(baseWidth, 0); // Downstream slope face
  damProfileShape.closePath();

  // 2. MONOLITH BLOCKS FOR NON-OVERFLOW SECTIONS (LEFT & RIGHT ABUTMENTS)
  // Recreates the iconic vertical monolith block segmentation visible in the photograph
  const leftLength = (crestLength - spillwayWidth) / 2;
  const monolithCount = 16;
  const monolithWidth = (leftLength - 0.5) / monolithCount;

  // Left Monolith Group
  const leftAbutmentGroup = new THREE.Group();
  for (let m = 0; m < monolithCount; m++) {
    const monoExtrude = {
      steps: 1,
      depth: monolithWidth - 0.12, // 0.12 gap creates physical contraction joint
      bevelEnabled: false,
    };
    const monoGeo = new THREE.ExtrudeGeometry(damProfileShape, monoExtrude);
    monoGeo.rotateY(-Math.PI / 2);
    monoGeo.translate(monoExtrude.depth, 0, 0);
    const monoMesh = new THREE.Mesh(monoGeo, concreteMaterial);
    monoMesh.castShadow = true;
    monoMesh.receiveShadow = true;
    monoMesh.position.set(-crestLength / 2 + m * monolithWidth, 0, 0);
    leftAbutmentGroup.add(monoMesh);
  }
  group.add(leftAbutmentGroup);

  // Right Monolith Group
  const rightAbutmentGroup = new THREE.Group();
  for (let m = 0; m < monolithCount; m++) {
    const monoExtrude = {
      steps: 1,
      depth: monolithWidth - 0.12,
      bevelEnabled: false,
    };
    const monoGeo = new THREE.ExtrudeGeometry(damProfileShape, monoExtrude);
    monoGeo.rotateY(-Math.PI / 2);
    monoGeo.translate(monoExtrude.depth, 0, 0);
    const monoMesh = new THREE.Mesh(monoGeo, concreteMaterial);
    monoMesh.castShadow = true;
    monoMesh.receiveShadow = true;
    monoMesh.position.set(spillwayWidth / 2 + m * monolithWidth, 0, 0);
    rightAbutmentGroup.add(monoMesh);
  }
  group.add(rightAbutmentGroup);

  // 3. CENTRAL OVERFLOW SPILLWAY (Ogee profile chute)
  const spillwayCrestHeight = damHeight - 5.5; // ~26.5m
  const spillwayShape = new THREE.Shape();
  spillwayShape.moveTo(0, 0);
  spillwayShape.lineTo(0, spillwayCrestHeight);
  // Ogee crest curve transition into downstream glacis chute
  spillwayShape.quadraticCurveTo(
    crestWidth * 0.75,
    spillwayCrestHeight,
    crestWidth * 1.4,
    spillwayCrestHeight * 0.74
  );
  spillwayShape.lineTo(baseWidth + 6.5, 0); // Extended chute apron
  spillwayShape.closePath();

  const spillwayExtrudeSettings = {
    steps: 2,
    depth: spillwayWidth,
    bevelEnabled: false,
  };

  const spillwayGeo = new THREE.ExtrudeGeometry(spillwayShape, spillwayExtrudeSettings);
  spillwayGeo.rotateY(-Math.PI / 2);
  spillwayGeo.translate(spillwayWidth, 0, 0);
  const spillwayMesh = new THREE.Mesh(spillwayGeo, spillwayConcreteMat);
  spillwayMesh.castShadow = true;
  spillwayMesh.receiveShadow = true;
  spillwayMesh.position.set(-spillwayWidth / 2, 0, 0);
  group.add(spillwayMesh);

  // 4. SPILLWAY PIERS (7 concrete piers supporting the crest bridge & gate trunnions)
  const baySpacing = (spillwayWidth - pierCount * pierWidth) / (pierCount - 1);
  const pierHeight = damHeight - spillwayCrestHeight + 2.8;
  const pierLength = 9.2;
  const pierGeo = new THREE.BoxGeometry(pierWidth, pierHeight, pierLength);

  for (let i = 0; i < pierCount; i++) {
    const pierX = -spillwayWidth / 2 + pierWidth / 2 + i * (baySpacing + pierWidth);
    const pierMesh = new THREE.Mesh(pierGeo, pierMaterial);
    pierMesh.castShadow = true;
    pierMesh.receiveShadow = true;
    pierMesh.position.set(
      pierX,
      spillwayCrestHeight + pierHeight / 2,
      pierLength / 2
    );
    group.add(pierMesh);

    // Aerodynamic rounded upstream pier bullnose
    const noseGeo = new THREE.CylinderGeometry(pierWidth / 2, pierWidth / 2, pierHeight, 12);
    const noseMesh = new THREE.Mesh(noseGeo, pierMaterial);
    noseMesh.position.set(pierX, spillwayCrestHeight + pierHeight / 2, 0.0);
    noseMesh.castShadow = true;
    group.add(noseMesh);

    // Downstream Chute Splitter Walls: Concrete guide walls sloping down the Ogee face
    const splitterShape = new THREE.Shape();
    splitterShape.moveTo(crestWidth * 0.9, spillwayCrestHeight);
    splitterShape.lineTo(crestWidth * 1.5, spillwayCrestHeight * 0.72);
    splitterShape.lineTo(baseWidth + 5.5, 2.0);
    splitterShape.lineTo(baseWidth + 5.5, 0.4);
    splitterShape.lineTo(crestWidth * 1.1, spillwayCrestHeight * 0.6);
    splitterShape.lineTo(crestWidth * 0.75, spillwayCrestHeight);
    splitterShape.closePath();

    const splitterExtrude = { steps: 1, depth: pierWidth * 0.75, bevelEnabled: false };
    const splitterGeo = new THREE.ExtrudeGeometry(splitterShape, splitterExtrude);
    splitterGeo.rotateY(-Math.PI / 2);
    splitterGeo.translate(splitterExtrude.depth, 0, 0);
    const splitterMesh = new THREE.Mesh(splitterGeo, pierMaterial);
    splitterMesh.position.set(pierX - splitterExtrude.depth / 2, 0, 0);
    splitterMesh.castShadow = true;
    splitterMesh.receiveShadow = true;
    group.add(splitterMesh);

    // Trunnion support pedestals on pier sidewalls where gate arms pivot (Z=6.2 matches gate pivot axis)
    const trunnionBoxGeo = new THREE.BoxGeometry(0.32, 1.4, 1.6);
    const leftTrunnion = new THREE.Mesh(trunnionBoxGeo, pierMaterial);
    leftTrunnion.position.set(pierX - pierWidth / 2 - 0.16, spillwayCrestHeight + 1.2, 6.2);
    group.add(leftTrunnion);
    const rightTrunnion = new THREE.Mesh(trunnionBoxGeo, pierMaterial);
    rightTrunnion.position.set(pierX + pierWidth / 2 + 0.16, spillwayCrestHeight + 1.2, 6.2);
    group.add(rightTrunnion);
  }

  // Spillway Hoist Deck / Machinery Bridge across the top of the piers
  const hoistDeckGeo = new THREE.BoxGeometry(spillwayWidth + pierWidth, 0.6, 3.4);
  const hoistDeck = new THREE.Mesh(hoistDeckGeo, pierMaterial);
  hoistDeck.position.set(0, spillwayCrestHeight + pierHeight + 0.3, 4.6);
  hoistDeck.castShadow = true;
  group.add(hoistDeck);

  // Chute Aerator Deflector Step (prevents cavitation along high-velocity chute)
  const aeratorGeo = new THREE.BoxGeometry(spillwayWidth - 0.4, 0.7, 1.1);
  const aeratorMesh = new THREE.Mesh(aeratorGeo, pierMaterial);
  aeratorMesh.position.set(0, spillwayCrestHeight * 0.52, crestWidth * 2.3);
  group.add(aeratorMesh);

  // Chute Blocks at the toe of each bay (energy dissipators before basin floor)
  const chuteBlockGeo = new THREE.BoxGeometry(0.7, 1.3, 1.4);
  for (let i = 0; i < 6; i++) {
    const bayLeftX = -spillwayWidth / 2 + pierWidth + i * (baySpacing + pierWidth);
    for (let b = 0; b < 3; b++) {
      const bX = bayLeftX + 0.7 + b * 1.45;
      const bMesh = new THREE.Mesh(chuteBlockGeo, pierMaterial);
      bMesh.position.set(bX, 0.85, baseWidth + 5.0);
      bMesh.castShadow = true;
      group.add(bMesh);
    }
  }

  // 5. ROADWAY BRIDGE ACROSS THE ENTIRE CREST
  const roadDeckGeo = new THREE.BoxGeometry(crestLength, 0.4, crestWidth - 0.3);
  const roadDeckMesh = new THREE.Mesh(roadDeckGeo, roadMaterial);
  roadDeckMesh.position.set(0, damHeight + 0.2, crestWidth * 0.5);
  roadDeckMesh.castShadow = true;
  group.add(roadDeckMesh);

  // 6. CREST PARAPET SAFETY WALLS (Upstream & Downstream light stone parapets)
  const parapetGeo = new THREE.BoxGeometry(crestLength, 0.9, 0.25);
  const usParapet = new THREE.Mesh(parapetGeo, parapetMaterial);
  usParapet.position.set(0, damHeight + 0.65, 0.15);
  usParapet.castShadow = true;
  group.add(usParapet);

  const dsParapet = new THREE.Mesh(parapetGeo, parapetMaterial);
  dsParapet.position.set(0, damHeight + 0.65, crestWidth - 0.15);
  dsParapet.castShadow = true;
  group.add(dsParapet);

  // 6b. DOWNSTREAM DAM FACE INSPECTION WALKWAYS (At mid-height Y=17.3, Z=14.1 on sloping face)
  const walkLeftGeo = new THREE.BoxGeometry(monolithCount * monolithWidth, 0.35, 1.4);
  const walkLeft = new THREE.Mesh(walkLeftGeo, pierMaterial);
  walkLeft.position.set(-spillwayWidth / 2 - (monolithCount * monolithWidth) / 2, 17.3, 14.1);
  walkLeft.castShadow = true;
  group.add(walkLeft);

  const walkRight = new THREE.Mesh(walkLeftGeo, pierMaterial);
  walkRight.position.set(spillwayWidth / 2 + (monolithCount * monolithWidth) / 2, 17.3, 14.1);
  walkRight.castShadow = true;
  group.add(walkRight);

  const railGeo = new THREE.BoxGeometry(monolithCount * monolithWidth, 0.8, 0.08);
  const railLeft = new THREE.Mesh(railGeo, parapetMaterial);
  railLeft.position.set(-spillwayWidth / 2 - (monolithCount * monolithWidth) / 2, 17.85, 14.75);
  group.add(railLeft);

  const railRight = new THREE.Mesh(railGeo, parapetMaterial);
  railRight.position.set(spillwayWidth / 2 + (monolithCount * monolithWidth) / 2, 17.85, 14.75);
  group.add(railRight);

  // 7. STILLING BASIN & MASSIVE CONCRETE TRAINING WALLS
  const basinTotalWidth = spillwayWidth + 2.0;
  const basinStart = baseWidth + 6.5;

  // Stilling basin depressed floor slab
  const basinGeo = new THREE.BoxGeometry(basinTotalWidth, 0.8, basinLength);
  const basinFloor = new THREE.Mesh(basinGeo, spillwayConcreteMat);
  basinFloor.position.set(0, 0.4, basinStart + basinLength / 2);
  basinFloor.receiveShadow = true;
  // Stilling basin floor is managed dynamically by SpillwayGates (Boiling Cauldron & Hydraulic Jump)

  // Staggered USBR Type III Baffle Piers in the Stilling Basin Floor
  // Smashes high kinetic energy water jet into violent hydraulic jump
  const baffleHeight = 1.9;
  const baffleGeo = new THREE.BoxGeometry(1.1, baffleHeight, 1.5);

  // Row 1
  for (let x = -spillwayWidth / 2 + 1.8; x < spillwayWidth / 2 - 1.0; x += 2.8) {
    const baffleMesh = new THREE.Mesh(baffleGeo, pierMaterial);
    baffleMesh.position.set(x, 0.4 + baffleHeight / 2, basinStart + 9.0);
    baffleMesh.castShadow = true;
    baffleMesh.receiveShadow = true;
    group.add(baffleMesh);
  }

  // Row 2 (Staggered offset)
  for (let x = -spillwayWidth / 2 + 3.2; x < spillwayWidth / 2 - 2.0; x += 2.8) {
    const baffleMesh = new THREE.Mesh(baffleGeo, pierMaterial);
    baffleMesh.position.set(x, 0.4 + baffleHeight / 2, basinStart + 14.5);
    baffleMesh.castShadow = true;
    baffleMesh.receiveShadow = true;
    group.add(baffleMesh);
  }

  // Left & Right Massive Training Walls extending from dam slope to end sill
  const trainingWallLength = basinLength + 16.0;
  const trainingWallGeo = new THREE.BoxGeometry(1.2, basinWallHeight, trainingWallLength);

  const leftTrainingWall = new THREE.Mesh(trainingWallGeo, pierMaterial);
  leftTrainingWall.position.set(
    -basinTotalWidth / 2,
    basinWallHeight / 2,
    basinStart + basinLength / 2 - 4.0
  );
  leftTrainingWall.castShadow = true;
  group.add(leftTrainingWall);

  const rightTrainingWall = new THREE.Mesh(trainingWallGeo, pierMaterial);
  rightTrainingWall.position.set(
    basinTotalWidth / 2,
    basinWallHeight / 2,
    basinStart + basinLength / 2 - 4.0
  );
  rightTrainingWall.castShadow = true;
  group.add(rightTrainingWall);

  // Stilling basin End Sill with dentated baffle blocks
  const endSillGeo = new THREE.BoxGeometry(basinTotalWidth, 2.2, 1.4);
  const endSillMesh = new THREE.Mesh(endSillGeo, pierMaterial);
  endSillMesh.position.set(0, 1.1, basinStart + basinLength);
  endSillMesh.castShadow = true;
  group.add(endSillMesh);

  // Dentated teeth along the top of the end sill
  const dentateGeo = new THREE.BoxGeometry(1.1, 0.8, 1.4);
  for (let x = -basinTotalWidth / 2 + 1.2; x < basinTotalWidth / 2 - 1.0; x += 2.2) {
    const dMesh = new THREE.Mesh(dentateGeo, pierMaterial);
    dMesh.position.set(x, 2.2 + 0.4, basinStart + basinLength);
    dMesh.castShadow = true;
    group.add(dMesh);
  }

  // 8. KOYNA BRIDGE & APPROACH ROADWAY (Directly from Satellite Photo)
  // Crosses the river channel at the end of the stilling basin (Z = 61.5)
  const bridgeZ = basinStart + basinLength + 4.5;
  const bridgeWidth = basinTotalWidth + 20.0;
  const bridgeDeckGeo = new THREE.BoxGeometry(bridgeWidth, 0.7, 3.6);
  const bridgeDeck = new THREE.Mesh(bridgeDeckGeo, roadMaterial);
  bridgeDeck.position.set(-2.0, 3.2, bridgeZ);
  bridgeDeck.castShadow = true;
  group.add(bridgeDeck);

  // White safety railings on both sides of Koyna Bridge
  const bRailGeo = new THREE.BoxGeometry(bridgeWidth, 0.8, 0.12);
  const bRailUS = new THREE.Mesh(bRailGeo, parapetMaterial);
  bRailUS.position.set(-2.0, 3.8, bridgeZ - 1.65);
  group.add(bRailUS);

  const bRailDS = new THREE.Mesh(bRailGeo, parapetMaterial);
  bRailDS.position.set(-2.0, 3.8, bridgeZ + 1.65);
  group.add(bRailDS);

  // Bridge support piers rooted in the riverbed
  const bPierGeo = new THREE.CylinderGeometry(0.9, 0.9, 3.2, 12);
  const leftBPier = new THREE.Mesh(bPierGeo, pierMaterial);
  leftBPier.position.set(-bridgeWidth * 0.35, 1.6, bridgeZ);
  group.add(leftBPier);

  const centerBPier = new THREE.Mesh(bPierGeo, pierMaterial);
  centerBPier.position.set(0, 1.6, bridgeZ);
  group.add(centerBPier);

  const rightBPier = new THREE.Mesh(bPierGeo, pierMaterial);
  rightBPier.position.set(bridgeWidth * 0.35, 1.6, bridgeZ);
  group.add(rightBPier);

  // 9. KOYNA HYDROELECTRIC POWER PLANT (Directly from Satellite Photo)
  // Located on the Left Toe of the dam (North-West)
  const powerhouseGroup = new THREE.Group();
  powerhouseGroup.position.set(-spillwayWidth / 2 - 14.0, 0, baseWidth + 8.0);

  // 9a. Main Generator Hall Building (Long pale industrial roof structure)
  const phHallGeo = new THREE.BoxGeometry(22.0, 5.8, 11.0);
  const phWallMat = new THREE.MeshStandardMaterial({
    color: 0x64748B, // Slate industrial concrete
    roughness: 0.7,
  });
  const phHall = new THREE.Mesh(phHallGeo, phWallMat);
  phHall.position.set(0, 2.9, 0);
  phHall.castShadow = true;
  powerhouseGroup.add(phHall);

  // Pale reflective industrial roof matching satellite view
  const phRoofGeo = new THREE.BoxGeometry(22.6, 0.6, 11.6);
  const phRoofMat = new THREE.MeshStandardMaterial({
    color: 0xD1D5DB, // Pale off-white/aluminum industrial roof
    roughness: 0.45,
    metalness: 0.3,
  });
  const phRoof = new THREE.Mesh(phRoofGeo, phRoofMat);
  phRoof.position.set(0, 5.9, 0);
  phRoof.castShadow = true;
  powerhouseGroup.add(phRoof);

  // 9b. Four Massive Heavy Steel Penstock Tubes descending the dam slope into the powerhouse
  const penstockGeo = new THREE.CylinderGeometry(0.9, 0.9, 19.5, 12);
  penstockGeo.rotateX(-Math.PI / 3.4);
  const penstockMat = new THREE.MeshStandardMaterial({
    color: 0x334155, // Heavy dark steel penstocks
    roughness: 0.4,
    metalness: 0.8,
  });

  for (let p = 0; p < 4; p++) {
    const penstockMesh = new THREE.Mesh(penstockGeo, penstockMat);
    penstockMesh.position.set(-6.5 + p * 4.3, 7.8, -8.5);
    penstockMesh.castShadow = true;
    powerhouseGroup.add(penstockMesh);
  }

  // 9c. Outdoor Transformer Switchyard (Transformers & Gantries)
  const switchyardPlatform = new THREE.Mesh(
    new THREE.BoxGeometry(18.0, 0.4, 8.0),
    roadMaterial
  );
  switchyardPlatform.position.set(0, 0.2, 10.0);
  powerhouseGroup.add(switchyardPlatform);

  // Transformer units
  const transformerGeo = new THREE.BoxGeometry(1.6, 2.2, 1.6);
  const transformerMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.6 });
  for (let t = 0; t < 5; t++) {
    const tMesh = new THREE.Mesh(transformerGeo, transformerMat);
    tMesh.position.set(-7.0 + t * 3.5, 1.3, 10.0);
    tMesh.castShadow = true;
    powerhouseGroup.add(tMesh);
  }

  // Tailrace discharge canal returning water to the river
  const tailraceWater = new THREE.Mesh(
    new THREE.PlaneGeometry(6.0, 16.0),
    new THREE.MeshStandardMaterial({ color: 0x0369A1, roughness: 0.1, transparent: true, opacity: 0.9 })
  );
  tailraceWater.rotateX(-Math.PI / 2);
  tailraceWater.position.set(12.0, 0.5, 4.0);
  powerhouseGroup.add(tailraceWater);

  group.add(powerhouseGroup);

  // 10. DYNAMIC BREACH VISUAL CAVITY
  const breachGroup = new THREE.Group();
  breachGroup.name = 'BreachCavityGroup';
  breachGroup.visible = false;

  const breachMat = new THREE.MeshStandardMaterial({
    color: 0x7F1D1D, // Ruptured rock/concrete
    roughness: 0.95,
  });

  const breachGeo = new THREE.CylinderGeometry(3.5, 5.5, damHeight * 0.96, 16);
  const breachMesh = new THREE.Mesh(breachGeo, breachMat);
  breachMesh.position.set(38.0, damHeight * 0.48, crestWidth * 0.6);
  breachMesh.rotation.z = 0.12;
  breachGroup.add(breachMesh);

  // Flashing red warning beacon ring around breach
  const beaconRingGeo = new THREE.TorusGeometry(4.8, 0.3, 8, 24);
  const beaconRingMat = new THREE.MeshBasicMaterial({ color: 0xEF4444, wireframe: true });
  const beaconRing = new THREE.Mesh(beaconRingGeo, beaconRingMat);
  beaconRing.rotation.x = Math.PI / 2;
  beaconRing.position.set(38.0, damHeight + 1.2, crestWidth * 0.6);
  breachGroup.add(beaconRing);

  group.add(breachGroup);

  return {
    group,
    updateBreachVisuals: (enabled: boolean, widthM: number, depthM: number) => {
      breachGroup.visible = enabled;
      if (enabled) {
        const scaledWidth = Math.max(2.4, (widthM * 0.23) * 0.85);
        const scaledDepth = Math.max(3.2, depthM * 0.23);
        breachMesh.scale.set(scaledWidth, scaledDepth / (damHeight * 0.96), scaledWidth);
        beaconRing.scale.set(scaledWidth * 0.8, scaledWidth * 0.8, 1);
      }
    },
  };
}
