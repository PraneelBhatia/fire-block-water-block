import * as THREE from 'three';
import { Element, BlockOrientation } from '@fbwb/shared';
import type { GameRenderer } from '../renderer/scene.js';
import {
  createFireParticles,
  createWaterParticles,
  updateFireParticles,
  updateWaterParticles,
} from './effects.js';

const BLOCK_STYLES: Record<Element, { color: number; emissive: number }> = {
  [Element.Fire]:  { color: 0xff6b35, emissive: 0xff2200 },
  [Element.Water]: { color: 0x4fc3f7, emissive: 0x0066cc },
};

const ROLL_DURATION = 0.3; // seconds

interface BlockPose {
  position: { x: number; y: number };
  orientation: BlockOrientation;
}

interface RollAnimation {
  from: BlockPose;
  to: BlockPose;
  startTime: number;
}

/**
 * Returns the world-space position and euler rotation for a given grid pose,
 * matching the logic in setPositionImmediate.
 */
function poseToWorld(
  renderer: GameRenderer,
  pose: BlockPose,
): { pos: THREE.Vector3; rot: THREE.Euler } {
  const worldPos = renderer.gridToWorld(pose.position.x, pose.position.y);
  switch (pose.orientation) {
    case BlockOrientation.Standing:
      return {
        pos: new THREE.Vector3(worldPos.x, 0.9, worldPos.z),
        rot: new THREE.Euler(0, 0, 0),
      };
    case BlockOrientation.LyingX:
      return {
        pos: new THREE.Vector3(worldPos.x + 0.5, 0.45, worldPos.z),
        rot: new THREE.Euler(0, 0, Math.PI / 2),
      };
    case BlockOrientation.LyingY:
      return {
        pos: new THREE.Vector3(worldPos.x, 0.45, worldPos.z - 0.5),
        rot: new THREE.Euler(Math.PI / 2, 0, 0),
      };
  }
}

export class BlockMesh {
  private mesh: THREE.Mesh;
  private renderer: GameRenderer;
  private particles: THREE.Points;
  private element: Element;

  // Animation state
  private currentAnimation: RollAnimation | null = null;
  private moveQueue: Array<{ from: BlockPose; to: BlockPose }> = [];

  // The settled pose — updated when an animation completes
  private settledPose: BlockPose | null = null;

  constructor(renderer: GameRenderer, element: Element) {
    this.renderer = renderer;
    this.element = element;

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

    // Create element-specific particles attached to the mesh
    if (element === Element.Fire) {
      this.particles = createFireParticles(this.mesh);
    } else {
      this.particles = createWaterParticles(this.mesh);
    }
  }

  setPositionImmediate(
    position: { x: number; y: number },
    orientation: BlockOrientation,
  ) {
    // Cancel any in-flight animation and queue
    this.currentAnimation = null;
    this.moveQueue = [];

    const pose: BlockPose = { position, orientation };
    this.settledPose = pose;
    this._applyPose(pose);
  }

  /**
   * Enqueue a roll from fromPos/fromOri to toPos/toOri.
   * If nothing is currently animating, start immediately.
   */
  animateRoll(
    fromPos: { x: number; y: number },
    fromOri: BlockOrientation,
    toPos: { x: number; y: number },
    toOri: BlockOrientation,
    now: number,
  ) {
    const from: BlockPose = { position: fromPos, orientation: fromOri };
    const to: BlockPose = { position: toPos, orientation: toOri };

    if (this.currentAnimation === null) {
      this._startAnimation(from, to, now);
    } else {
      this.moveQueue.push({ from, to });
    }
  }

  /** Returns true if there is an active animation or queued moves. */
  isAnimating(): boolean {
    return this.currentAnimation !== null || this.moveQueue.length > 0;
  }

  setVisible(visible: boolean) {
    this.mesh.visible = visible;
  }

  update(dt: number, time: number) {
    // Drive rolling animation
    if (this.currentAnimation !== null) {
      const anim = this.currentAnimation;
      const rawT = (time - anim.startTime) / ROLL_DURATION;
      const t = Math.min(rawT, 1);

      const fromWorld = poseToWorld(this.renderer, anim.from);
      const toWorld = poseToWorld(this.renderer, anim.to);

      // Lerp position
      const px = fromWorld.pos.x + (toWorld.pos.x - fromWorld.pos.x) * t;
      const pz = fromWorld.pos.z + (toWorld.pos.z - fromWorld.pos.z) * t;

      // Arc: lerp the base Y then add a sine bump so the block rises mid-roll
      const py = fromWorld.pos.y + (toWorld.pos.y - fromWorld.pos.y) * t
        + Math.sin(t * Math.PI) * 0.3;

      this.mesh.position.set(px, py, pz);

      // Slerp rotation via quaternions
      const qFrom = new THREE.Quaternion().setFromEuler(fromWorld.rot);
      const qTo = new THREE.Quaternion().setFromEuler(toWorld.rot);
      const q = qFrom.clone().slerp(qTo, t);
      this.mesh.quaternion.copy(q);

      if (t >= 1) {
        // Snap to exact final state
        this._applyPose(anim.to);
        this.settledPose = anim.to;
        this.currentAnimation = null;

        // Start next queued move if any
        if (this.moveQueue.length > 0) {
          const next = this.moveQueue.shift()!;
          this._startAnimation(next.from, next.to, time);
        }
      }
    }

    // Update particle effects
    if (this.element === Element.Fire) {
      updateFireParticles(this.particles, dt);
    } else {
      updateWaterParticles(this.particles, time);
    }
  }

  // ---- private helpers ----

  private _startAnimation(from: BlockPose, to: BlockPose, now: number) {
    this.currentAnimation = { from, to, startTime: now };
    // Immediately place mesh at the from pose so there's no flicker
    this._applyPose(from);
  }

  private _applyPose(pose: BlockPose) {
    const { pos, rot } = poseToWorld(this.renderer, pose);
    this.mesh.position.copy(pos);
    this.mesh.rotation.copy(rot);
  }
}
