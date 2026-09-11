import * as THREE from 'three';

/**
 * ThreeUtils — Memory management and realistic textures for Koyna 3D Digital Twin
 */

// Procedural architectural concrete texture with monolith joints and vertical weathering
export function createConcreteTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    // Weathered basalt concrete base color matching real Koyna photograph
    ctx.fillStyle = '#788290';
    ctx.fillRect(0, 0, 512, 512);

    // Subtle horizontal concrete lift pour lines
    ctx.strokeStyle = 'rgba(70, 78, 90, 0.5)';
    ctx.lineWidth = 2;
    for (let y = 0; y < 512; y += 32) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(512, y);
      ctx.stroke();
    }

    // Prominent vertical contraction monolith joints
    ctx.strokeStyle = 'rgba(45, 52, 62, 0.85)';
    ctx.lineWidth = 4;
    for (let x = 0; x < 512; x += 64) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 512);
      ctx.stroke();

      // Vertical water runoff streaks down from the joints
      const grad = ctx.createLinearGradient(x - 12, 0, x + 12, 0);
      grad.addColorStop(0, 'rgba(50, 58, 68, 0)');
      grad.addColorStop(0.5, 'rgba(40, 48, 58, 0.45)');
      grad.addColorStop(1, 'rgba(50, 58, 68, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(x - 12, 0, 24, 512);
    }

    // Concrete aggregate texture noise
    const imgData = ctx.getImageData(0, 0, 512, 512);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 28;
      data[i] = Math.min(255, Math.max(0, data[i] + noise));
      data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
      data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
    }
    ctx.putImageData(imgData, 0, 0);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(8, 2);
  return texture;
}

// Procedural pure sapphire water flow texture with organic fluid streamlines
export function createWaterFlowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    // Deep sapphire water base
    const baseGrad = ctx.createLinearGradient(0, 0, 512, 512);
    baseGrad.addColorStop(0, '#0284C7');
    baseGrad.addColorStop(0.5, '#0369A1');
    baseGrad.addColorStop(1, '#0284C7');
    ctx.fillStyle = baseGrad;
    ctx.fillRect(0, 0, 512, 512);

    // Organic fluid streamlines and subtle velocity striations (pure blue tonal variations)
    for (let i = 0; i < 90; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const len = 60 + Math.random() * 120;
      const alpha = 0.15 + Math.random() * 0.25;

      ctx.strokeStyle = Math.random() > 0.4 ? `rgba(56, 189, 248, ${alpha})` : `rgba(14, 116, 144, ${alpha})`;
      ctx.lineWidth = 2 + Math.random() * 4;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.bezierCurveTo(
        x + (Math.random() - 0.5) * 12,
        y + len * 0.33,
        x + (Math.random() - 0.5) * 12,
        y + len * 0.66,
        x + (Math.random() - 0.5) * 8,
        y + len
      );
      ctx.stroke();
    }

    // Soft fluid noise for natural water refraction
    const imgData = ctx.getImageData(0, 0, 512, 512);
    const data = imgData.data;
    for (let p = 0; p < data.length; p += 4) {
      const noise = (Math.random() - 0.5) * 12;
      data[p] = Math.min(255, Math.max(0, data[p] + noise));
      data[p + 1] = Math.min(255, Math.max(0, data[p + 1] + noise));
      data[p + 2] = Math.min(255, Math.max(0, data[p + 2] + noise));
    }
    ctx.putImageData(imgData, 0, 0);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 2);
  return texture;
}

// Procedural intense white-water froth & churning rapids texture
export function createTurbulentFoamTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    // Frothing white-water base with aerated light-cyan tint
    ctx.fillStyle = '#E0F2FE';
    ctx.fillRect(0, 0, 512, 512);

    // Chaotic swirling foam patterns
    ctx.fillStyle = '#FFFFFF';
    for (let i = 0; i < 280; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const rx = 4 + Math.random() * 18;
      const ry = 2 + Math.random() * 8;
      const rot = (Math.random() - 0.5) * Math.PI;
      ctx.beginPath();
      ctx.ellipse(x, y, rx, ry, rot, 0, Math.PI * 2);
      ctx.fill();
    }

    // High-speed aeration streaks
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.lineWidth = 3;
    for (let s = 0; s < 100; s++) {
      const sx = Math.random() * 512;
      const sy = Math.random() * 512;
      const slen = 30 + Math.random() * 90;
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(sx + (Math.random() - 0.5) * 6, sy + slen);
      ctx.stroke();
    }

    // Fine bubble noise
    const imgData = ctx.getImageData(0, 0, 512, 512);
    const data = imgData.data;
    for (let p = 0; p < data.length; p += 4) {
      if (Math.random() > 0.4) {
        const v = 220 + Math.random() * 35;
        data[p] = v;
        data[p + 1] = v;
        data[p + 2] = v;
      }
    }
    ctx.putImageData(imgData, 0, 0);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 4);
  return texture;
}

// Memory cleanup utility
export function disposeThreeHierarchy(obj: THREE.Object3D): void {
  obj.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      if (child.geometry) {
        child.geometry.dispose();
      }
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((mat) => mat.dispose());
        } else {
          child.material.dispose();
        }
      }
    }
  });
}
