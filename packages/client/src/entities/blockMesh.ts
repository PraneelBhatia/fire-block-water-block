import * as THREE from 'three';
import { Element, BlockOrientation } from '@fbwb/shared';
import type { GameRenderer } from '../renderer/scene.js';
import {
  createFireParticles,
  createWaterParticles,
  updateFireParticles,
  updateWaterParticles,
} from './effects.js';

// Bright, punchy block styles — Minecraft-ish
const BLOCK_STYLES: Record<Element, {
  color: number;
  emissive: number;
  emissiveIntensity: number;
  roughness: number;
  metalness: number;
}> = {
  [Element.Fire]: {
    color: 0xff6d3a,
    emissive: 0xff4500,
    emissiveIntensity: 0.4,
    roughness: 0.6,
    metalness: 0.05,
  },
  [Element.Water]: {
    color: 0x42a5f5,
    emissive: 0x2196f3,
    emissiveIntensity: 0.35,
    roughness: 0.5,
    metalness: 0.05,
  },
};

const ROLL_DURATION = 0.3; // seconds

// Block half-dimensions (geometry is 0.9 x 1.8 x 0.9)
const HALF_W = 0.45;   // half of 0.9 (x and z)
const HALF_H = 0.9;    // half of 1.8 (tall axis)

interface BlockPose {
  position: { x: number; y: number };
  orientation: BlockOrientation;
}

enum RollDirection {
  North,
  South,
  East,
  West,
}

interface RollSpec {
  pivotWorld: THREE.Vector3;
  rotationAxis: THREE.Vector3;
  rotationAngle: number;
}

interface PivotAnimation {
  spec: RollSpec;
  from: BlockPose;
  to: BlockPose;
  startTime: number;
  startLocalPos: THREE.Vector3;
  startLocalQuat: THREE.Quaternion;
}

function poseToWorld(
  renderer: GameRenderer,
  pose: BlockPose,
): { pos: THREE.Vector3; rot: THREE.Euler } {
  const worldPos = renderer.gridToWorld(pose.position.x, pose.position.y);
  switch (pose.orientation) {
    case BlockOrientation.Standing:
      return {
        pos: new THREE.Vector3(worldPos.x, HALF_H, worldPos.z),
        rot: new THREE.Euler(0, 0, 0),
      };
    case BlockOrientation.LyingX:
      return {
        pos: new THREE.Vector3(worldPos.x + 0.5, HALF_W, worldPos.z),
        rot: new THREE.Euler(0, 0, Math.PI / 2),
      };
    case BlockOrientation.LyingY:
      return {
        pos: new THREE.Vector3(worldPos.x, HALF_W, worldPos.z - 0.5),
        rot: new THREE.Euler(Math.PI / 2, 0, 0),
      };
  }
}

function inferDirection(from: BlockPose, to: BlockPose): RollDirection {
  const dx = to.position.x - from.position.x;
  const dy = to.position.y - from.position.y;

  if (dx > 0) return RollDirection.East;
  if (dx < 0) return RollDirection.West;
  if (dy > 0) return RollDirection.North;
  return RollDirection.South;
}

function computeRollSpec(
  renderer: GameRenderer,
  from: BlockPose,
  to: BlockPose,
  direction: RollDirection,
): RollSpec {
  const fromWorld = poseToWorld(renderer, from);
  const centerPos = fromWorld.pos;

  let pivotWorld: THREE.Vector3;
  let rotationAxis: THREE.Vector3;
  let rotationAngle: number;

  switch (from.orientation) {
    case BlockOrientation.Standing:
      switch (direction) {
        case RollDirection.North:
          pivotWorld = new THREE.Vector3(centerPos.x, 0, centerPos.z - HALF_W);
          rotationAxis = new THREE.Vector3(1, 0, 0);
          rotationAngle = -Math.PI / 2;
          break;
        case RollDirection.South:
          pivotWorld = new THREE.Vector3(centerPos.x, 0, centerPos.z + HALF_W);
          rotationAxis = new THREE.Vector3(1, 0, 0);
          rotationAngle = Math.PI / 2;
          break;
        case RollDirection.East:
          pivotWorld = new THREE.Vector3(centerPos.x + HALF_W, 0, centerPos.z);
          rotationAxis = new THREE.Vector3(0, 0, 1);
          rotationAngle = -Math.PI / 2;
          break;
        case RollDirection.West:
          pivotWorld = new THREE.Vector3(centerPos.x - HALF_W, 0, centerPos.z);
          rotationAxis = new THREE.Vector3(0, 0, 1);
          rotationAngle = Math.PI / 2;
          break;
      }
      break;

    case BlockOrientation.LyingX:
      switch (direction) {
        case RollDirection.East:
          pivotWorld = new THREE.Vector3(centerPos.x + HALF_H, 0, centerPos.z);
          rotationAxis = new THREE.Vector3(0, 0, 1);
          rotationAngle = -Math.PI / 2;
          break;
        case RollDirection.West:
          pivotWorld = new THREE.Vector3(centerPos.x - HALF_H, 0, centerPos.z);
          rotationAxis = new THREE.Vector3(0, 0, 1);
          rotationAngle = Math.PI / 2;
          break;
        case RollDirection.North:
          pivotWorld = new THREE.Vector3(centerPos.x, 0, centerPos.z - HALF_W);
          rotationAxis = new THREE.Vector3(1, 0, 0);
          rotationAngle = -Math.PI / 2;
          break;
        case RollDirection.South:
          pivotWorld = new THREE.Vector3(centerPos.x, 0, centerPos.z + HALF_W);
          rotationAxis = new THREE.Vector3(1, 0, 0);
          rotationAngle = Math.PI / 2;
          break;
      }
      break;

    case BlockOrientation.LyingY:
      switch (direction) {
        case RollDirection.North:
          pivotWorld = new THREE.Vector3(centerPos.x, 0, centerPos.z - HALF_H);
          rotationAxis = new THREE.Vector3(1, 0, 0);
          rotationAngle = -Math.PI / 2;
          break;
        case RollDirection.South:
          pivotWorld = new THREE.Vector3(centerPos.x, 0, centerPos.z + HALF_H);
          rotationAxis = new THREE.Vector3(1, 0, 0);
          rotationAngle = Math.PI / 2;
          break;
        case RollDirection.East:
          pivotWorld = new THREE.Vector3(centerPos.x + HALF_W, 0, centerPos.z);
          rotationAxis = new THREE.Vector3(0, 0, 1);
          rotationAngle = -Math.PI / 2;
          break;
        case RollDirection.West:
          pivotWorld = new THREE.Vector3(centerPos.x - HALF_W, 0, centerPos.z);
          rotationAxis = new THREE.Vector3(0, 0, 1);
          rotationAngle = Math.PI / 2;
          break;
      }
      break;
  }

  return { pivotWorld: pivotWorld!, rotationAxis: rotationAxis!, rotationAngle: rotationAngle! };
}

function easeInOutQuad(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

export class BlockMesh {
  private mesh: THREE.Mesh;
  private renderer: GameRenderer;
  private particles: THREE.Points;
  private element: Element;
  private glowLight: THREE.PointLight;

  // Animation state
  private currentAnimation: PivotAnimation | null = null;
  private moveQueue: Array<{ from: BlockPose; to: BlockPose }> = [];
  private fallAnim: { velocity: number; active: boolean } | null = null;

  // The settled pose
  private settledPose: BlockPose | null = null;

  constructor(renderer: GameRenderer, element: Element) {
    this.renderer = renderer;
    this.element = element;

    const style = BLOCK_STYLES[element];
    const geometry = new THREE.BoxGeometry(0.9, 1.8, 0.9);

    // Beveled edges via edge geometry
    const edgesGeo = new THREE.EdgesGeometry(geometry, 15);
    const edgesMat = new THREE.LineBasicMaterial({
      color: element === Element.Fire ? 0xff8a65 : 0x64b5f6,
      transparent: true,
      opacity: 0.25,
    });
    const edges = new THREE.LineSegments(edgesGeo, edgesMat);

    const material = new THREE.MeshStandardMaterial({
      color: style.color,
      emissive: style.emissive,
      emissiveIntensity: style.emissiveIntensity,
      roughness: style.roughness,
      metalness: style.metalness,
      flatShading: true, // Chunky MC look
    });

    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.add(edges);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    renderer.scene.add(this.mesh);

    // Subtle point light attached to block for ground glow
    const lightColor = element === Element.Fire ? 0xff6d3a : 0x42a5f5;
    this.glowLight = new THREE.PointLight(lightColor, 0.6, 4, 2);
    this.glowLight.castShadow = false;
    this.mesh.add(this.glowLight);
    this.glowLight.position.set(0, -0.5, 0);

    // Create element-specific particles
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
    this.currentAnimation = null;
    this.moveQueue = [];

    const pose: BlockPose = { position, orientation };
    this.settledPose = pose;
    this._applyPose(pose);
  }

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

  isAnimating(): boolean {
    return this.currentAnimation !== null || this.moveQueue.length > 0;
  }

  setVisible(visible: boolean) {
    this.mesh.visible = visible;
    this.glowLight.visible = visible;
  }

  /** Animate the block falling downward (off-edge death). */
  startFallAnimation() {
    this.fallAnim = { velocity: 0, active: true };
  }

  getWorldPosition(): THREE.Vector3 {
    return this.mesh.position.clone();
  }

  update(dt: number, time: number) {
    // Drive rolling animation
    if (this.currentAnimation !== null) {
      const anim = this.currentAnimation;
      const rawT = (time - anim.startTime) / ROLL_DURATION;
      const t = Math.min(rawT, 1);
      const easedT = easeInOutQuad(t);

      const currentAngle = anim.spec.rotationAngle * easedT;
      const pivotQuat = new THREE.Quaternion().setFromAxisAngle(
        anim.spec.rotationAxis,
        currentAngle,
      );

      const rotatedLocalPos = anim.startLocalPos.clone().applyQuaternion(pivotQuat);
      this.mesh.position.copy(anim.spec.pivotWorld).add(rotatedLocalPos);
      this.mesh.quaternion.copy(pivotQuat).multiply(anim.startLocalQuat);

      if (t >= 1) {
        this._applyPose(anim.to);
        this.settledPose = anim.to;
        this.currentAnimation = null;

        if (this.moveQueue.length > 0) {
          const next = this.moveQueue.shift()!;
          this._startAnimation(next.from, next.to, time);
        }
      }
    }

    // Fall animation (gravity drop when block falls off edge)
    if (this.fallAnim?.active) {
      this.fallAnim.velocity += dt * 12; // gravity
      this.mesh.position.y -= this.fallAnim.velocity * dt;
      // Slight tumble rotation
      this.mesh.rotation.x += dt * 1.5;
      this.mesh.rotation.z += dt * 0.8;
      if (this.mesh.position.y < -10) {
        this.fallAnim.active = false;
        this.mesh.visible = false;
      }
    }

    // Pulse the glow light subtly
    const pulseFreq = this.element === Element.Fire ? 2.5 : 1.8;
    this.glowLight.intensity = 0.5 + Math.sin(time * pulseFreq) * 0.2;

    // Update particle effects
    if (this.element === Element.Fire) {
      updateFireParticles(this.particles, dt);
    } else {
      updateWaterParticles(this.particles, time);
    }
  }

  // ---- private helpers ----

  private _startAnimation(from: BlockPose, to: BlockPose, now: number) {
    this._applyPose(from);

    const direction = inferDirection(from, to);
    const spec = computeRollSpec(this.renderer, from, to, direction);

    const startLocalPos = this.mesh.position.clone().sub(spec.pivotWorld);
    const startLocalQuat = this.mesh.quaternion.clone();

    this.currentAnimation = {
      spec,
      from,
      to,
      startTime: now,
      startLocalPos,
      startLocalQuat,
    };
  }

  private _applyPose(pose: BlockPose) {
    const { pos, rot } = poseToWorld(this.renderer, pose);
    this.mesh.position.copy(pos);
    this.mesh.rotation.copy(rot);
  }
}
