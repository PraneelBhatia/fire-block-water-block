import { Direction } from '@fbwb/shared';

export function setupInput(onMove: (direction: Direction) => void) {
  const keyMap: Record<string, Direction> = {
    ArrowUp:    Direction.North,
    ArrowDown:  Direction.South,
    ArrowRight: Direction.East,
    ArrowLeft:  Direction.West,
    KeyW:       Direction.North,
    KeyS:       Direction.South,
    KeyD:       Direction.East,
    KeyA:       Direction.West,
  };

  window.addEventListener('keydown', (e: KeyboardEvent) => {
    const direction = keyMap[e.code];
    if (direction) {
      e.preventDefault();
      onMove(direction);
    }
  });
}
