import { BlockOrientation, BlockState, Direction, Position, TileType } from './types.js';
import { getFootprint } from './block.js';

export interface RollResult {
  position: Position;
  orientation: BlockOrientation;
}

export function computeRoll(
  position: Position,
  orientation: BlockOrientation,
  direction: Direction,
): RollResult {
  const { x, y } = position;

  switch (orientation) {
    case BlockOrientation.Standing:
      switch (direction) {
        case Direction.North: return { position: { x, y: y + 1 }, orientation: BlockOrientation.LyingY };
        case Direction.South: return { position: { x, y: y - 2 }, orientation: BlockOrientation.LyingY };
        case Direction.East:  return { position: { x: x + 1, y }, orientation: BlockOrientation.LyingX };
        case Direction.West:  return { position: { x: x - 2, y }, orientation: BlockOrientation.LyingX };
      }
      break;

    case BlockOrientation.LyingX:
      switch (direction) {
        case Direction.East:  return { position: { x: x + 2, y }, orientation: BlockOrientation.Standing };
        case Direction.West:  return { position: { x: x - 1, y }, orientation: BlockOrientation.Standing };
        case Direction.North: return { position: { x, y: y + 1 }, orientation: BlockOrientation.LyingX };
        case Direction.South: return { position: { x, y: y - 1 }, orientation: BlockOrientation.LyingX };
      }
      break;

    case BlockOrientation.LyingY:
      switch (direction) {
        case Direction.North: return { position: { x, y: y + 2 }, orientation: BlockOrientation.Standing };
        case Direction.South: return { position: { x, y: y - 1 }, orientation: BlockOrientation.Standing };
        case Direction.East:  return { position: { x: x + 1, y }, orientation: BlockOrientation.LyingY };
        case Direction.West:  return { position: { x: x - 1, y }, orientation: BlockOrientation.LyingY };
      }
      break;
  }

  // TypeScript exhaustiveness — never reached
  throw new Error(`Unhandled roll: ${orientation} ${direction}`);
}

export function isValidMove(
  block: BlockState,
  direction: Direction,
  tiles: TileType[][],
): boolean {
  const rolled = computeRoll(block.position, block.orientation, direction);
  const rolledBlock: BlockState = { ...block, position: rolled.position, orientation: rolled.orientation };
  const footprint = getFootprint(rolledBlock);
  const height = tiles.length;
  const width = tiles[0]?.length ?? 0;

  for (const cell of footprint) {
    if (cell.x < 0 || cell.y < 0 || cell.x >= width || cell.y >= height) {
      return false;
    }
    if (tiles[cell.y][cell.x] === TileType.Empty) {
      return false;
    }
  }
  return true;
}
