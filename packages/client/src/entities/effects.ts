import * as THREE from 'three';

// ---- Fire Particles ----

export function createFireParticles(parent: THREE.Object3D): THREE.Points {
  const count = 20;
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 0.6;
    positions[i * 3 + 1] = Math.random() * 0.8;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 0.6;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    color: 0xff6b35,
    size: 0.08,
    blending: THREE.AdditiveBlending,
    transparent: true,
    depthWrite: false,
  });

  const points = new THREE.Points(geometry, material);
  parent.add(points);
  return points;
}

export function updateFireParticles(points: THREE.Points, dt: number): void {
  const positions = points.geometry.getAttribute('position');
  const arr = positions.array as Float32Array;

  for (let i = 0; i < positions.count; i++) {
    // Float upward
    arr[i * 3 + 1] += dt * (0.5 + Math.random() * 0.3);
    // Slight horizontal drift
    arr[i * 3] += (Math.random() - 0.5) * dt * 0.2;
    arr[i * 3 + 2] += (Math.random() - 0.5) * dt * 0.2;

    // Reset when too high
    if (arr[i * 3 + 1] > 1.5) {
      arr[i * 3] = (Math.random() - 0.5) * 0.6;
      arr[i * 3 + 1] = 0;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 0.6;
    }
  }

  positions.needsUpdate = true;
}

// ---- Water Particles ----

export function createWaterParticles(parent: THREE.Object3D): THREE.Points {
  const count = 15;
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    const radius = 0.4;
    positions[i * 3] = Math.cos(angle) * radius;
    positions[i * 3 + 1] = Math.random() * 0.8;
    positions[i * 3 + 2] = Math.sin(angle) * radius;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    color: 0x4fc3f7,
    size: 0.06,
    blending: THREE.AdditiveBlending,
    transparent: true,
    depthWrite: false,
  });

  const points = new THREE.Points(geometry, material);
  parent.add(points);
  return points;
}

export function updateWaterParticles(points: THREE.Points, time: number): void {
  const positions = points.geometry.getAttribute('position');
  const arr = positions.array as Float32Array;
  const count = positions.count;

  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 + time * 0.8;
    const radius = 0.35 + Math.sin(time * 1.5 + i) * 0.1;
    arr[i * 3] = Math.cos(angle) * radius;
    arr[i * 3 + 1] = 0.2 + Math.sin(time * 2 + i * 0.5) * 0.3;
    arr[i * 3 + 2] = Math.sin(angle) * radius;
  }

  positions.needsUpdate = true;
}

// ---- Tile Effects ----

export function lavaTilePulse(material: THREE.MeshStandardMaterial, time: number): void {
  material.emissiveIntensity = 0.3 + Math.sin(time * 2.0) * 0.15;
}

export function waterTileShimmer(material: THREE.MeshStandardMaterial, time: number): void {
  material.emissiveIntensity = 0.2 + Math.sin(time * 3.0) * 0.1;
}
