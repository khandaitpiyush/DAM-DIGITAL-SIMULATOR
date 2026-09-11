import * as THREE from 'three';

export interface SceneEffects {
  sunLight: THREE.DirectionalLight;
  hemiLight: THREE.HemisphereLight;
  ambientLight: THREE.AmbientLight;
  beacons: THREE.PointLight[];
  update: (time: number, isCritical: boolean, rainfallIntensity?: number) => void;
}

export function setupLightingAndEffects(scene: THREE.Scene): SceneEffects {
  // 1. Natural daylight atmospheric sky fog (crisp, subtle horizon haze - will not obscure dam)
  scene.fog = new THREE.FogExp2(0x93C5FD, 0.0018);

  // 2. Clear sunny daylight sky ambient reflection
  // Sky color: bright sky blue (0xBAE6FD), Ground bounce: warm earth/rock (0x475569)
  const hemiLight = new THREE.HemisphereLight(0xBAE6FD, 0x475569, 1.2);
  hemiLight.position.set(0, 150, 0);
  scene.add(hemiLight);

  // 3. Ambient light to ensure natural daytime visibility in shadow areas
  const ambientLight = new THREE.AmbientLight(0xE0F2FE, 0.7);
  scene.add(ambientLight);

  // 4. Primary Directional Sunlight
  // Warm bright sunlight from high sun angle
  const sunLight = new THREE.DirectionalLight(0xFFFBEB, 2.5);
  sunLight.position.set(-60, 100, -40); // Shines from upstream-left across crest & downstream face
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.width = 2048;
  sunLight.shadow.mapSize.height = 2048;
  sunLight.shadow.camera.near = 5;
  sunLight.shadow.camera.far = 350;
  sunLight.shadow.camera.left = -100;
  sunLight.shadow.camera.right = 100;
  sunLight.shadow.camera.top = 100;
  sunLight.shadow.camera.bottom = -100;
  sunLight.shadow.bias = -0.0003;
  scene.add(sunLight);

  // 5. Downstream valley bounce light (sun reflection from river & valley floor)
  const valleyBounceLight = new THREE.DirectionalLight(0x7DD3FC, 0.5);
  valleyBounceLight.position.set(30, 20, 90);
  scene.add(valleyBounceLight);

  // 6. Dam crest emergency beacons (audible/visible alert on dam crest at Y=32.6)
  const beacons: THREE.PointLight[] = [];
  const beaconPositions = [-45, 0, 45];

  beaconPositions.forEach((xPos) => {
    const beacon = new THREE.PointLight(0xF59E0B, 0, 35);
    beacon.position.set(xPos, 32.6, 0);
    scene.add(beacon);
    beacons.push(beacon);

    // Strobe housing mesh
    const bulbGeo = new THREE.SphereGeometry(0.35, 8, 8);
    const bulbMat = new THREE.MeshBasicMaterial({ color: 0xF59E0B });
    const bulbMesh = new THREE.Mesh(bulbGeo, bulbMat);
    bulbMesh.position.copy(beacon.position);
    scene.add(bulbMesh);
  });

  return {
    sunLight,
    hemiLight,
    ambientLight,
    beacons,
    update: (time: number, isCritical: boolean, rainfallIntensity: number = 0) => {
      const flashSpeed = isCritical ? 8.0 : 3.0;
      const intensity = Math.sin(time * flashSpeed) > 0.3 ? (isCritical ? 3.5 : 1.5) : 0.2;
      const color = isCritical ? 0xEF4444 : 0xF59E0B;

      beacons.forEach((b) => {
        b.intensity = intensity;
        b.color.setHex(color);
      });

      // Keep scene crystal clear: do NOT increase fog density when rain increases
      // Sun remains bright and clear, only beacons flash on alert
    },
  };
}
