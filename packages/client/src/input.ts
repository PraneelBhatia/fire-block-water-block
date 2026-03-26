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

/** Online mode: both WASD and arrows control the same (your) block */
export function setupOnlineInput(onMove: MoveCallback) {
  window.addEventListener('keydown', (e: KeyboardEvent) => {
    const direction = ARROW_MAP[e.code] ?? WASD_MAP[e.code];
    if (direction) {
      e.preventDefault();
      onMove(direction);
    }
  });
}

/** Local co-op mode: WASD = fire block, Arrows = water block */
export function setupLocalInput(onMove: LocalMoveCallback) {
  window.addEventListener('keydown', (e: KeyboardEvent) => {
    const wasd = WASD_MAP[e.code];
    if (wasd) {
      e.preventDefault();
      onMove('fire', wasd);
      return;
    }
    const arrow = ARROW_MAP[e.code];
    if (arrow) {
      e.preventDefault();
      onMove('water', arrow);
    }
  });
}
