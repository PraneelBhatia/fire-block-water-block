import { describe, it, expect } from 'vitest';
import { createBlock, getFootprint } from '../block.js';
import { BlockOrientation, Element } from '../types.js';

describe('createBlock', () => {
  it('returns a block with the given element and position', () => {
    const block = createBlock(Element.Fire, { x: 2, y: 3 });
    expect(block.element).toBe(Element.Fire);
    expect(block.position).toEqual({ x: 2, y: 3 });
  });

  it('defaults orientation to Standing', () => {
    const block = createBlock(Element.Water, { x: 0, y: 0 });
    expect(block.orientation).toBe(BlockOrientation.Standing);
  });

  it('accepts an explicit orientation', () => {
    const block = createBlock(Element.Fire, { x: 1, y: 1 }, BlockOrientation.LyingX);
    expect(block.orientation).toBe(BlockOrientation.LyingX);
  });

  it('starts alive', () => {
    const block = createBlock(Element.Fire, { x: 0, y: 0 });
    expect(block.alive).toBe(true);
  });
});

describe('getFootprint', () => {
  it('Standing: occupies exactly one cell at position', () => {
    const block = createBlock(Element.Fire, { x: 3, y: 4 }, BlockOrientation.Standing);
    expect(getFootprint(block)).toEqual([{ x: 3, y: 4 }]);
  });

  it('LyingX: occupies anchor and one cell to the east', () => {
    const block = createBlock(Element.Fire, { x: 2, y: 1 }, BlockOrientation.LyingX);
    expect(getFootprint(block)).toEqual([{ x: 2, y: 1 }, { x: 3, y: 1 }]);
  });

  it('LyingY: occupies anchor and one cell to the north (y+1)', () => {
    const block = createBlock(Element.Water, { x: 1, y: 0 }, BlockOrientation.LyingY);
    expect(getFootprint(block)).toEqual([{ x: 1, y: 0 }, { x: 1, y: 1 }]);
  });
});
