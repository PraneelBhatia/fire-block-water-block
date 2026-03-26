import { BlockOrientation, BlockState, Element, Position } from './types.js';

export function createBlock(
  element: Element,
  position: Position,
  orientation: BlockOrientation = BlockOrientation.Standing,
): BlockState {
  return { element, position, orientation, alive: true };
}

export function getFootprint(block: BlockState): Position[] {
  const { x, y } = block.position;
  switch (block.orientation) {
    case BlockOrientation.Standing:
      return [{ x, y }];
    case BlockOrientation.LyingX:
      return [{ x, y }, { x: x + 1, y }];
    case BlockOrientation.LyingY:
      return [{ x, y }, { x, y: y + 1 }];
  }
}
