import * as THREE from 'three';

// ---- Fire Particles ----
// More particles, warmer color spread, faster rise

export function createFireParticles(parent: THREE.Object3D): THREE.Points {
  const count = 36;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  const fireColors = [
    new THREE.Color(0xff5625), // core orange
    new THREE.Color(0xff7943), // bright orange
    new THREE.Color(0xffb5a0), // hot white-pink
    new THREE.Color(0xff3300), // deep red
  ];

  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 0.7;
    positions[i * 3 + 1] = Math.random() * 1.0;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 0.7;

    const c = fireColors[Math.floor(Math.random() * fireColors.length)];
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 0.09,
    vertexColors: true,
    blending: THREE.AdditiveBlending,
    transparent: true,
    opacity: 0.85,
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
    // Float upward with variable speed
    arr[i * 3 + 1] += dt * (0.6 + Math.random() * 0.5);
    // Wider horizontal drift
    arr[i * 3] += (Math.random() - 0.5) * dt * 0.35;
    arr[i * 3 + 2] += (Math.random() - 0.5) * dt * 0.35;

    // Reset when too high
    if (arr[i * 3 + 1] > 1.8) {
      arr[i * 3] = (Math.random() - 0.5) * 0.7;
      arr[i * 3 + 1] = -0.1;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 0.7;
    }
  }

  positions.needsUpdate = true;
}

// ---- Water Particles ----
// Orbital with vertical bob, blue-teal spread

export function createWaterParticles(parent: THREE.Object3D): THREE.Points {
  const count = 24;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  const waterColors = [
    new THREE.Color(0x00cdd0), // teal
    new THREE.Color(0x46eaed), // light teal
    new THREE.Color(0x77dfff), // sky blue
    new THREE.Color(0x009a9d), // deep teal
  ];

  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    const radius = 0.38;
    positions[i * 3] = Math.cos(angle) * radius;
    positions[i * 3 + 1] = Math.random() * 0.9;
    positions[i * 3 + 2] = Math.sin(angle) * radius;

    const c = waterColors[Math.floor(Math.random() * waterColors.length)];
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 0.07,
    vertexColors: true,
    blending: THREE.AdditiveBlending,
    transparent: true,
    opacity: 0.8,
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
    const angle = (i / count) * Math.PI * 2 + time * 0.7;
    const radius = 0.32 + Math.sin(time * 1.2 + i * 0.8) * 0.12;
    const verticalOffset = Math.sin(time * 1.8 + i * 0.6) * 0.35;

    arr[i * 3] = Math.cos(angle) * radius;
    arr[i * 3 + 1] = 0.25 + verticalOffset;
    arr[i * 3 + 2] = Math.sin(angle) * radius;
  }

  positions.needsUpdate = true;
}

// ---- Steam Burst Effect ----
// One-shot burst of white/gray particles that rise and fade — used for
// water-on-lava, fire-on-water, and block collisions.

// Steam burst is a Group of sprite "puffs" that rise, expand, and fade.
export function createSteamBurst(scene: THREE.Scene, worldPos: THREE.Vector3): THREE.Group {
  const group = new THREE.Group();
  group.position.copy(worldPos);
  group.position.y += 0.5;
  group.userData.age = 0;
  group.userData.puffs = [] as Array<{
    sprite: THREE.Sprite;
    vx: number; vy: number; vz: number;
    startSize: number;
  }>;

  const count = 18;
  for (let i = 0; i < count; i++) {
    const gray = 0.55 + Math.random() * 0.35;
    const material = new THREE.SpriteMaterial({
      color: new THREE.Color(gray, gray, gray + 0.03),
      transparent: true,
      opacity: 0.7 + Math.random() * 0.2,
      depthWrite: false,
    });
    const sprite = new THREE.Sprite(material);
    const startSize = 0.25 + Math.random() * 0.2;
    sprite.scale.set(startSize, startSize, 1);
    sprite.position.set(
      (Math.random() - 0.5) * 0.4,
      Math.random() * 0.3,
      (Math.random() - 0.5) * 0.4,
    );
    group.add(sprite);
    (group.userData.puffs as Array<unknown>).push({
      sprite,
      vx: (Math.random() - 0.5) * 1.2,
      vy: 1.5 + Math.random() * 2.5,
      vz: (Math.random() - 0.5) * 1.2,
      startSize,
    });
  }

  scene.add(group);
  return group;
}

/** Returns true when the steam burst is finished and should be removed. */
export function updateSteamBurst(group: THREE.Group, dt: number): boolean {
  group.userData.age += dt;
  const age = group.userData.age as number;
  const duration = 2.0;
  const puffs = group.userData.puffs as Array<{
    sprite: THREE.Sprite;
    vx: number; vy: number; vz: number;
    startSize: number;
  }>;

  const t = age / duration; // 0→1

  for (const p of puffs) {
    p.sprite.position.x += p.vx * dt;
    p.sprite.position.y += p.vy * dt;
    p.sprite.position.z += p.vz * dt;
    // Decelerate
    p.vx *= 0.97;
    p.vz *= 0.97;
    p.vy -= dt * 1.0;
    // Grow (billowing)
    const size = p.startSize + age * 0.5;
    p.sprite.scale.set(size, size, 1);
    // Fade out
    (p.sprite.material as THREE.SpriteMaterial).opacity = Math.max(0, 0.8 * (1 - t));
  }

  return age > duration;
}

// ---- Goal Dissolve Effect ----
// Satisfying particle burst when a block reaches its exit tile.
// Fire: upward ember shower. Water: outward splash ring.

export function createDissolveBurst(
  scene: THREE.Scene,
  worldPos: THREE.Vector3,
  element: 'fire' | 'water',
): THREE.Group {
  const group = new THREE.Group();
  group.position.copy(worldPos);
  group.position.y += 0.5;
  group.userData.age = 0;
  group.userData.element = element;
  group.userData.puffs = [] as Array<{
    sprite: THREE.Sprite;
    vx: number; vy: number; vz: number;
    startSize: number;
  }>;

  const count = 24;
  const isFire = element === 'fire';

  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    const hue = isFire
      ? new THREE.Color().setHSL(0.05 + Math.random() * 0.07, 0.9, 0.5 + Math.random() * 0.3)
      : new THREE.Color().setHSL(0.55 + Math.random() * 0.08, 0.7, 0.5 + Math.random() * 0.3);

    const mat = new THREE.SpriteMaterial({
      color: hue,
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
    });
    const sprite = new THREE.Sprite(mat);
    const startSize = 0.15 + Math.random() * 0.15;
    sprite.scale.set(startSize, startSize, 1);
    sprite.position.set(
      (Math.random() - 0.5) * 0.3,
      Math.random() * 0.5,
      (Math.random() - 0.5) * 0.3,
    );
    group.add(sprite);

    const speed = 1.0 + Math.random() * 2.0;
    (group.userData.puffs as Array<unknown>).push({
      sprite,
      vx: Math.cos(angle) * speed * (isFire ? 0.5 : 1.2),
      vy: isFire ? (2.0 + Math.random() * 3.0) : (0.8 + Math.random() * 1.5),
      vz: Math.sin(angle) * speed * (isFire ? 0.5 : 1.2),
      startSize,
    });
  }

  scene.add(group);
  return group;
}

/** Returns true when done. */
export function updateDissolveBurst(group: THREE.Group, dt: number): boolean {
  group.userData.age += dt;
  const age = group.userData.age as number;
  const duration = 1.8;
  const t = age / duration;

  const puffs = group.userData.puffs as Array<{
    sprite: THREE.Sprite;
    vx: number; vy: number; vz: number;
    startSize: number;
  }>;

  for (const p of puffs) {
    p.sprite.position.x += p.vx * dt;
    p.sprite.position.y += p.vy * dt;
    p.sprite.position.z += p.vz * dt;
    p.vx *= 0.96;
    p.vz *= 0.96;
    p.vy -= dt * 1.2;
    // Shrink as they fade
    const size = p.startSize * Math.max(0, 1 - t * 0.7);
    p.sprite.scale.set(size, size, 1);
    (p.sprite.material as THREE.SpriteMaterial).opacity = Math.max(0, 0.9 * (1 - t));
  }

  return age > duration;
}

// ---- Tile Effects ----
// More dramatic pulsing

export function lavaTilePulse(material: THREE.MeshStandardMaterial, time: number): void {
  // Multi-frequency pulse for organic feel
  material.emissiveIntensity =
    0.4 +
    Math.sin(time * 2.0) * 0.15 +
    Math.sin(time * 3.7) * 0.08;
}

export function waterTileShimmer(material: THREE.MeshStandardMaterial, time: number): void {
  material.emissiveIntensity =
    0.25 +
    Math.sin(time * 2.5) * 0.1 +
    Math.cos(time * 4.1) * 0.05;
}
