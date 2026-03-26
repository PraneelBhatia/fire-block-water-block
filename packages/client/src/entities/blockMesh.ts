import * as THREE from 'three';
import { Element, BlockOrientation } from '@fbwb/shared';
import type { GameRenderer } from '../renderer/scene.js';

const BLOCK_STYLES: Record<Element, { color: number; emissive: number }> = {
  [Element.Fire]:  { color: 0xff6b35, emissive: 0xff2200 },
  [Element.Water]: { color: 0x4fc3f7, emissive: 0x0066cc },
};

export class BlockMesh {
  private mesh: THREE.Mesh;
  private renderer: GameRenderer;

  constructor(renderer: GameRenderer, element: Element) {
    this.renderer = renderer;

    const style = BLOCK_STYLES[element];
    const geometry = new THREE.BoxGeometry(0.9, 1.8, 0.9);
    const material = new THREE.MeshStandardMaterial({
      color: style.color,
      emissive: style.emissive,
      emissiveIntensity: 0.3,
    });

    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    renderer.scene.add(this.mesh);
  }

  setPositionImmediate(
    position: { x: number; y: number },
    orientation: BlockOrientation,
  ) {
    // Reset rotation
    this.mesh.rotation.set(0, 0, 0);

    const worldPos = this.renderer.gridToWorld(position.x, position.y);

    switch (orientation) {
      case BlockOrientation.Standing:
        this.mesh.position.set(worldPos.x, 0.9, worldPos.z);
        break;

      case BlockOrientation.LyingX:
        // Block extends in the +x direction: anchor at (x,y), extends to (x+1,y)
        // Center is offset by +0.5 in x, height is halved
        this.mesh.rotation.z = Math.PI / 2;
        this.mesh.position.set(worldPos.x + 0.5, 0.45, worldPos.z);
        break;

      case BlockOrientation.LyingY:
        // Block extends in the +y direction (grid), which is -z in world space
        // Center is offset by -0.5 in z, height is halved
        this.mesh.rotation.x = Math.PI / 2;
        this.mesh.position.set(worldPos.x, 0.45, worldPos.z - 0.5);
        break;
    }
  }

  setVisible(visible: boolean) {
    this.mesh.visible = visible;
  }
}
