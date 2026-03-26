import * as THREE from 'three';
import { TileType } from '@fbwb/shared';
import type { GameRenderer } from '../renderer/scene.js';
import { lavaTilePulse, waterTileShimmer } from './effects.js';

const TILE_COLORS: Partial<Record<TileType, { color: number; emissive?: number }>> = {
  [TileType.Stone]:      { color: 0x666677 },
  [TileType.Lava]:       { color: 0xff4500, emissive: 0xff6600 },
  [TileType.Water]:      { color: 0x0277bd, emissive: 0x004488 },
  [TileType.Toxic]:      { color: 0x44aa00 },
  [TileType.Fragile]:    { color: 0x555555 },
  [TileType.SwitchFire]: { color: 0xff8c00 },
  [TileType.SwitchWater]:{ color: 0x4fc3f7 },
  [TileType.ExitFire]:   { color: 0xff6b35 },
  [TileType.ExitWater]:  { color: 0x29b6f6 },
};

export class GridMesh {
  private group: THREE.Group;
  private renderer: GameRenderer;
  private lavaMaterials: THREE.MeshStandardMaterial[] = [];
  private waterMaterials: THREE.MeshStandardMaterial[] = [];

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

    for (let y = 0; y < tiles.length; y++) {
      const row = tiles[y];
      for (let x = 0; x < row.length; x++) {
        const tileType = row[x];
        if (tileType === TileType.Empty) continue;

        const tileConfig = TILE_COLORS[tileType];
        if (!tileConfig) continue;

        const geometry = new THREE.BoxGeometry(0.95, 0.2, 0.95);
        const material = new THREE.MeshStandardMaterial({
          color: tileConfig.color,
          emissive: tileConfig.emissive ?? 0x000000,
          emissiveIntensity: tileConfig.emissive ? 0.3 : 0,
        });

        // Track lava and water tile materials for animation
        if (tileType === TileType.Lava) {
          this.lavaMaterials.push(material);
        } else if (tileType === TileType.Water) {
          this.waterMaterials.push(material);
        }

        const mesh = new THREE.Mesh(geometry, material);
        const worldPos = this.renderer.gridToWorld(x, y);
        mesh.position.set(worldPos.x, -0.1, worldPos.z);
        mesh.receiveShadow = true;
        this.group.add(mesh);
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
  }
}
