import { describe, it, expect } from 'vitest';
import { computeRoll, isValidMove } from '../moves.js';
import { BlockOrientation, Direction, Element, TileType } from '../types.js';
import { createBlock } from '../block.js';

// Build a simple tile grid helper
function makeGrid(width: number, height: number, fill: TileType = TileType.Stone): TileType[][] {
  return Array.from({ length: height }, () => Array(width).fill(fill));
}

describe('computeRoll — all 12 combinations', () => {
  const pos = { x: 3, y: 3 };

  // Standing
  it('Standing → North: LyingY at (x, y+1)', () => {
    const r = computeRoll(pos, BlockOrientation.Standing, Direction.North);
    expect(r).toEqual({ position: { x: 3, y: 4 }, orientation: BlockOrientation.LyingY });
  });

  it('Standing → South: LyingY at (x, y-2)', () => {
    const r = computeRoll(pos, BlockOrientation.Standing, Direction.South);
    expect(r).toEqual({ position: { x: 3, y: 1 }, orientation: BlockOrientation.LyingY });
  });

  it('Standing → East: LyingX at (x+1, y)', () => {
    const r = computeRoll(pos, BlockOrientation.Standing, Direction.East);
    expect(r).toEqual({ position: { x: 4, y: 3 }, orientation: BlockOrientation.LyingX });
  });

  it('Standing → West: LyingX at (x-2, y)', () => {
    const r = computeRoll(pos, BlockOrientation.Standing, Direction.West);
    expect(r).toEqual({ position: { x: 1, y: 3 }, orientation: BlockOrientation.LyingX });
  });

  // LyingX
  it('LyingX → East: Standing at (x+2, y)', () => {
    const r = computeRoll(pos, BlockOrientation.LyingX, Direction.East);
    expect(r).toEqual({ position: { x: 5, y: 3 }, orientation: BlockOrientation.Standing });
  });

  it('LyingX → West: Standing at (x-1, y)', () => {
    const r = computeRoll(pos, BlockOrientation.LyingX, Direction.West);
    expect(r).toEqual({ position: { x: 2, y: 3 }, orientation: BlockOrientation.Standing });
  });

  it('LyingX → North: LyingX at (x, y+1)', () => {
    const r = computeRoll(pos, BlockOrientation.LyingX, Direction.North);
    expect(r).toEqual({ position: { x: 3, y: 4 }, orientation: BlockOrientation.LyingX });
  });

  it('LyingX → South: LyingX at (x, y-1)', () => {
    const r = computeRoll(pos, BlockOrientation.LyingX, Direction.South);
    expect(r).toEqual({ position: { x: 3, y: 2 }, orientation: BlockOrientation.LyingX });
  });

  // LyingY
  it('LyingY → North: Standing at (x, y+2)', () => {
    const r = computeRoll(pos, BlockOrientation.LyingY, Direction.North);
    expect(r).toEqual({ position: { x: 3, y: 5 }, orientation: BlockOrientation.Standing });
  });

  it('LyingY → South: Standing at (x, y-1)', () => {
    const r = computeRoll(pos, BlockOrientation.LyingY, Direction.South);
    expect(r).toEqual({ position: { x: 3, y: 2 }, orientation: BlockOrientation.Standing });
  });

  it('LyingY → East: LyingY at (x+1, y)', () => {
    const r = computeRoll(pos, BlockOrientation.LyingY, Direction.East);
    expect(r).toEqual({ position: { x: 4, y: 3 }, orientation: BlockOrientation.LyingY });
  });

  it('LyingY → West: LyingY at (x-1, y)', () => {
    const r = computeRoll(pos, BlockOrientation.LyingY, Direction.West);
    expect(r).toEqual({ position: { x: 2, y: 3 }, orientation: BlockOrientation.LyingY });
  });
});

describe('isValidMove', () => {
  it('returns true when all footprint cells after roll are on stone tiles', () => {
    const tiles = makeGrid(10, 10, TileType.Stone);
    const block = createBlock(Element.Fire, { x: 3, y: 3 }, BlockOrientation.Standing);
    expect(isValidMove(block, Direction.North, tiles)).toBe(true);
  });

  it('returns false when the rolled footprint lands on an empty tile', () => {
    const tiles = makeGrid(10, 10, TileType.Stone);
    // Put empty at y=4 for the roll target
    tiles[4][3] = TileType.Empty;
    const block = createBlock(Element.Fire, { x: 3, y: 3 }, BlockOrientation.Standing);
    // Standing → North → LyingY anchor (3,4) + (3,5): (3,4) is empty
    expect(isValidMove(block, Direction.North, tiles)).toBe(false);
  });

  it('returns false when the rolled footprint goes out of grid bounds (negative)', () => {
    const tiles = makeGrid(10, 10, TileType.Stone);
    const block = createBlock(Element.Fire, { x: 0, y: 0 }, BlockOrientation.Standing);
    // Standing → South → LyingY at (0, -2) — out of bounds
    expect(isValidMove(block, Direction.South, tiles)).toBe(false);
  });

  it('returns false when the rolled footprint goes out of grid bounds (positive)', () => {
    const tiles = makeGrid(5, 5, TileType.Stone);
    const block = createBlock(Element.Fire, { x: 4, y: 2 }, BlockOrientation.Standing);
    // Standing → East → LyingX at (5,2)+(6,2) — out of bounds
    expect(isValidMove(block, Direction.East, tiles)).toBe(false);
  });

  it('returns true for non-stone but non-empty tile (lava, water, etc. are valid positions)', () => {
    const tiles = makeGrid(10, 10, TileType.Stone);
    tiles[4][3] = TileType.Lava;
    tiles[5][3] = TileType.Stone;
    const block = createBlock(Element.Fire, { x: 3, y: 3 }, BlockOrientation.Standing);
    // Standing → North → LyingY (3,4)+(3,5): (3,4)=Lava not Empty, valid position
    expect(isValidMove(block, Direction.North, tiles)).toBe(true);
  });

  it('returns true when LyingX rolls East onto standing (valid bounds)', () => {
    const tiles = makeGrid(10, 10, TileType.Stone);
    const block = createBlock(Element.Fire, { x: 3, y: 3 }, BlockOrientation.LyingX);
    // LyingX → East → Standing at (5,3)
    expect(isValidMove(block, Direction.East, tiles)).toBe(true);
  });
});
