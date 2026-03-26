import { Direction } from '@fbwb/shared';

export type MoveCallback = (direction: Direction) => void;
export type LocalMoveCallback = (player: 'fire' | 'water', direction: Direction) => void;

const ARROW_MAP: Record<string, Direction> = {
  ArrowUp:    Direction.North,
  ArrowDown:  Direction.South,
  ArrowRight: Direction.East,
  ArrowLeft:  Direction.West,
};

const WASD_MAP: Record<string, Direction> = {
  KeyW: Direction.North,
  KeyS: Direction.South,
  KeyD: Direction.East,
  KeyA: Direction.West,
};

// Minimum time between moves per block (matches roll animation duration)
const MOVE_COOLDOWN_MS = 280;

/** Online mode: both WASD and arrows control the same (your) block */
export function setupOnlineInput(onMove: MoveCallback) {
  let lastMoveTime = 0;

  window.addEventListener('keydown', (e: KeyboardEvent) => {
    const direction = ARROW_MAP[e.code] ?? WASD_MAP[e.code];
    if (!direction) return;
    e.preventDefault();

    const now = performance.now();
    if (now - lastMoveTime < MOVE_COOLDOWN_MS) return;
    lastMoveTime = now;
    onMove(direction);
  });
}

/** Local co-op mode: WASD = fire block, Arrows = water block */
export function setupLocalInput(onMove: LocalMoveCallback) {
  let lastFireTime = 0;
  let lastWaterTime = 0;

  window.addEventListener('keydown', (e: KeyboardEvent) => {
    const now = performance.now();

    const wasd = WASD_MAP[e.code];
    if (wasd) {
      e.preventDefault();
      if (now - lastFireTime < MOVE_COOLDOWN_MS) return;
      lastFireTime = now;
      onMove('fire', wasd);
      return;
    }

    const arrow = ARROW_MAP[e.code];
    if (arrow) {
      e.preventDefault();
      if (now - lastWaterTime < MOVE_COOLDOWN_MS) return;
      lastWaterTime = now;
      onMove('water', arrow);
    }
  });
}
