import * as THREE from 'three';
import { TileType } from '@fbwb/shared';
import type { GameRenderer } from '../renderer/scene.js';
import { lavaTilePulse, waterTileShimmer } from './effects.js';

// Earthy Minecraft-ish tile palette
const TILE_STYLES: Partial<Record<TileType, {
  color: number;
  emissive?: number;
  emissiveIntensity?: number;
  roughness?: number;
  metalness?: number;
}>> = {
  [TileType.Stone]:      { color: 0x8b9a6b, roughness: 0.85, metalness: 0.05 },   // Mossy grass-stone
  [TileType.Lava]:       { color: 0xff6b2b, emissive: 0xff4500, emissiveIntensity: 0.6, roughness: 0.3, metalness: 0.1 },
  [TileType.Water]:      { color: 0x3ba3d0, emissive: 0x2196f3, emissiveIntensity: 0.25, roughness: 0.15, metalness: 0.2 },
  [TileType.Toxic]:      { color: 0x6abf40, emissive: 0x7ccc00, emissiveIntensity: 0.3, roughness: 0.5, metalness: 0.05 },
  [TileType.Fragile]:    { color: 0xa0937b, roughness: 0.95, metalness: 0.02 },    // Sandy/cracked earth
  [TileType.SwitchFire]: { color: 0xe07030, emissive: 0xff8c42, emissiveIntensity: 0.35, roughness: 0.6, metalness: 0.1 },
  [TileType.SwitchWater]:{ color: 0x3898b8, emissive: 0x4fc3f7, emissiveIntensity: 0.3, roughness: 0.5, metalness: 0.1 },
  [TileType.ExitFire]:   { color: 0xff5722, emissive: 0xff6d3a, emissiveIntensity: 0.8, roughness: 0.15, metalness: 0.1 },
  [TileType.ExitWater]:  { color: 0x1e88e5, emissive: 0x42a5f5, emissiveIntensity: 0.7, roughness: 0.1, metalness: 0.15 },
};

// Edge/gap color for tile separation
const GAP_SIZE = 0.04;
const TILE_VISUAL = 0.95 - GAP_SIZE;
const TILE_HEIGHT = 0.38; // Thicker tiles for chunky depth

export class GridMesh {
  private group: THREE.Group;
  private renderer: GameRenderer;
  private lavaMaterials: THREE.MeshStandardMaterial[] = [];
  private waterMaterials: THREE.MeshStandardMaterial[] = [];
  private exitFireMaterials: THREE.MeshStandardMaterial[] = [];
  private exitWaterMaterials: THREE.MeshStandardMaterial[] = [];
  private exitParticles: Array<{ sprites: THREE.Sprite[]; element: 'fire' | 'water'; wx: number; wz: number }> = [];
  private exitRingMaterials: THREE.MeshBasicMaterial[] = [];

  constructor(renderer: GameRenderer) {
    this.renderer = renderer;
    this.group = new THREE.Group();
    renderer.scene.add(this.group);
  }

  buildFromTiles(tiles: TileType[][]) {
    // Clear existing meshes
    while (this.group.children.length > 0) {
      const child = this.group.children[0];
      this.group.remove(child);
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();
        if (child.material instanceof THREE.Material) {
          child.material.dispose();
        }
      }
    }
    this.lavaMaterials = [];
    this.waterMaterials = [];
    this.exitFireMaterials = [];
    this.exitWaterMaterials = [];
    this.exitParticles = [];
    this.exitRingMaterials = [];

    for (let y = 0; y < tiles.length; y++) {
      const row = tiles[y];
      for (let x = 0; x < row.length; x++) {
        const tileType = row[x];
        if (tileType === TileType.Empty) continue;

        const style = TILE_STYLES[tileType];
        if (!style) continue;

        // Main tile face
        const geometry = new THREE.BoxGeometry(TILE_VISUAL, TILE_HEIGHT, TILE_VISUAL);
        const material = new THREE.MeshStandardMaterial({
          color: style.color,
          emissive: style.emissive ?? 0x000000,
          emissiveIntensity: style.emissiveIntensity ?? 0,
          roughness: style.roughness ?? 0.7,
          metalness: style.metalness ?? 0.1,
        });

        // Track animated materials
        if (tileType === TileType.Lava) {
          this.lavaMaterials.push(material);
        } else if (tileType === TileType.Water) {
          this.waterMaterials.push(material);
        } else if (tileType === TileType.ExitFire) {
          this.exitFireMaterials.push(material);
        } else if (tileType === TileType.ExitWater) {
          this.exitWaterMaterials.push(material);
        }

        const mesh = new THREE.Mesh(geometry, material);
        const worldPos = this.renderer.gridToWorld(x, y);
        mesh.position.set(worldPos.x, -TILE_HEIGHT / 2, worldPos.z);
        mesh.receiveShadow = true;
        mesh.castShadow = false;
        this.group.add(mesh);

        // Earthy dirt base layer under the tile for depth
        const baseGeometry = new THREE.BoxGeometry(0.98, 0.18, 0.98);
        const baseMaterial = new THREE.MeshStandardMaterial({
          color: 0x6b5344, // Dirt brown
          roughness: 0.95,
          metalness: 0.0,
        });
        const baseMesh = new THREE.Mesh(baseGeometry, baseMaterial);
        baseMesh.position.set(worldPos.x, -TILE_HEIGHT - 0.09, worldPos.z);
        baseMesh.receiveShadow = true;
        baseMesh.castShadow = true;
        this.group.add(baseMesh);

        // Fragile tiles get subtle crack lines (darker surface)
        if (tileType === TileType.Fragile) {
          material.roughness = 0.95;
          // Add a slightly different colored top accent
          const crackGeometry = new THREE.BoxGeometry(TILE_VISUAL * 0.6, TILE_HEIGHT + 0.005, 0.02);
          const crackMaterial = new THREE.MeshStandardMaterial({
            color: 0x7a6a58, // Darker earth crack
            roughness: 1,
            metalness: 0,
          });
          const crack = new THREE.Mesh(crackGeometry, crackMaterial);
          crack.position.set(worldPos.x, -TILE_HEIGHT / 2, worldPos.z);
          crack.rotation.y = Math.PI * 0.3;
          this.group.add(crack);
        }

        // Exit tiles — concentric rings + floating sprite particles
        if (tileType === TileType.ExitFire || tileType === TileType.ExitWater) {
          const isFire = tileType === TileType.ExitFire;
          const coreColor = isFire ? 0xff6d3a : 0x42a5f5;
          const midColor = isFire ? 0xffab91 : 0x90caf9;
          const outerColor = isFire ? 0xff8a50 : 0x64b5f6;

          // Concentric rings — inner core, mid ring, outer ring
          const ringDefs = [
            { inner: 0.00, outer: 0.15, color: coreColor, opacity: 0.7, yOff: 0.025 },
            { inner: 0.16, outer: 0.26, color: midColor,  opacity: 0.5, yOff: 0.022 },
            { inner: 0.27, outer: 0.35, color: outerColor, opacity: 0.35, yOff: 0.019 },
            { inner: 0.36, outer: 0.42, color: midColor,  opacity: 0.2, yOff: 0.016 },
          ];
          for (const rd of ringDefs) {
            const geo = rd.inner === 0
              ? new THREE.CircleGeometry(rd.outer, 24)
              : new THREE.RingGeometry(rd.inner, rd.outer, 24);
            const mat = new THREE.MeshBasicMaterial({
              color: rd.color,
              transparent: true,
              opacity: rd.opacity,
              side: THREE.DoubleSide,
            });
            const mesh = new THREE.Mesh(geo, mat);
            mesh.position.set(worldPos.x, rd.yOff, worldPos.z);
            mesh.rotation.x = -Math.PI / 2;
            this.group.add(mesh);
            // Track outermost ring for pulsing
            if (rd.inner === 0.36) this.exitRingMaterials.push(mat);
          }

          // Point light for glow
          const light = new THREE.PointLight(coreColor, 1.0, 3.5, 2);
          light.position.set(worldPos.x, 0.6, worldPos.z);
          this.group.add(light);

          // Floating sprite particles (visible!)
          const pCount = isFire ? 8 : 6;
          const pColors = isFire
            ? [0xff6d3a, 0xff8a65, 0xffcc80, 0xff3d00]
            : [0xffffff, 0xe0f7fa, 0xb2ebf2, 0xe1f5fe];

          const sprites: THREE.Sprite[] = [];
          for (let p = 0; p < pCount; p++) {
            const color = pColors[Math.floor(Math.random() * pColors.length)];
            const sMat = new THREE.SpriteMaterial({
              color,
              transparent: true,
              opacity: 0.8,
              depthWrite: false,
            });
            const sprite = new THREE.Sprite(sMat);
            const size = 0.08 + Math.random() * 0.08;
            sprite.scale.set(size, size, 1);
            const angle = (p / pCount) * Math.PI * 2;
            const r = 0.1 + Math.random() * 0.15;
            sprite.position.set(
              worldPos.x + Math.cos(angle) * r,
              0.15 + Math.random() * 0.5,
              worldPos.z + Math.sin(angle) * r,
            );
            sprite.userData.baseAngle = angle;
            sprite.userData.baseR = r;
            sprite.userData.idx = p;
            this.group.add(sprite);
            sprites.push(sprite);
          }
          this.exitParticles.push({ sprites, element: isFire ? 'fire' : 'water', wx: worldPos.x, wz: worldPos.z });
        }
      }
    }
  }

  updateTiles(tiles: TileType[][]) {
    this.buildFromTiles(tiles);
  }

  update(time: number) {
    for (const mat of this.lavaMaterials) {
      lavaTilePulse(mat, time);
    }
    for (const mat of this.waterMaterials) {
      waterTileShimmer(mat, time);
    }
    // Exit tile emissive pulse
    for (const mat of this.exitFireMaterials) {
      mat.emissiveIntensity = 0.6 + Math.sin(time * 3.0) * 0.25 + Math.sin(time * 5.5) * 0.1;
    }
    for (const mat of this.exitWaterMaterials) {
      mat.emissiveIntensity = 0.5 + Math.sin(time * 2.5) * 0.25 + Math.cos(time * 4.3) * 0.1;
    }
    // Pulsing exit rings
    for (const mat of this.exitRingMaterials) {
      mat.opacity = 0.3 + Math.sin(time * 4.0) * 0.2;
    }
    // Animate exit tile floating sprite particles
    for (const ep of this.exitParticles) {
      for (const sprite of ep.sprites) {
        const idx = sprite.userData.idx as number;
        const count = ep.sprites.length;
        if (ep.element === 'fire') {
          // Embers: rise and reset
          sprite.position.y += 0.012;
          sprite.position.x += (Math.random() - 0.5) * 0.004;
          if (sprite.position.y > 1.2) {
            sprite.position.y = 0.1;
            const angle = Math.random() * Math.PI * 2;
            const r = 0.08 + Math.random() * 0.15;
            sprite.position.x = ep.wx + Math.cos(angle) * r;
            sprite.position.z = ep.wz + Math.sin(angle) * r;
          }
          (sprite.material as THREE.SpriteMaterial).opacity = 0.9 - (sprite.position.y - 0.1) * 0.7;
        } else {
          // Water: orbital bob
          const angle = (idx / count) * Math.PI * 2 + time * 1.2;
          const r = 0.12 + Math.sin(time * 1.5 + idx) * 0.06;
          sprite.position.x = ep.wx + Math.cos(angle) * r;
          sprite.position.y = 0.2 + Math.sin(time * 2.0 + idx * 0.8) * 0.25;
          sprite.position.z = ep.wz + Math.sin(angle) * r;
          (sprite.material as THREE.SpriteMaterial).opacity = 0.6 + Math.sin(time * 3.0 + idx) * 0.3;
        }
      }
    }
  }
}
