import { describe, it, expect } from 'vitest';
import {
  checkHazard,
  getFootprintTiles,
  activateSwitch,
  checkWinCondition,
} from '../mechanics.js';
import { BlockOrientation, Element, TileType } from '../types.js';
import { createBlock } from '../block.js';

// Helpers
function makeGrid(width: number, height: number, fill: TileType = TileType.Stone): TileType[][] {
  return Array.from({ length: height }, () => Array(width).fill(fill));
}

// ─── checkHazard ────────────────────────────────────────────────────────────

describe('checkHazard', () => {
  it('Fire on Lava is safe (returns false)', () => {
    const block = createBlock(Element.Fire, { x: 0, y: 0 });
    expect(checkHazard(block, [TileType.Lava])).toBe(false);
  });

  it('Water on Lava dies (returns true)', () => {
    const block = createBlock(Element.Water, { x: 0, y: 0 });
    expect(checkHazard(block, [TileType.Lava])).toBe(true);
  });

  it('Fire on Water tile dies', () => {
    const block = createBlock(Element.Fire, { x: 0, y: 0 });
    expect(checkHazard(block, [TileType.Water])).toBe(true);
  });

  it('Water on Water tile is safe', () => {
    const block = createBlock(Element.Water, { x: 0, y: 0 });
    expect(checkHazard(block, [TileType.Water])).toBe(false);
  });

  it('Toxic kills Fire', () => {
    const block = createBlock(Element.Fire, { x: 0, y: 0 });
    expect(checkHazard(block, [TileType.Toxic])).toBe(true);
  });

  it('Toxic kills Water', () => {
    const block = createBlock(Element.Water, { x: 0, y: 0 });
    expect(checkHazard(block, [TileType.Toxic])).toBe(true);
  });

  it('Fragile kills only when Standing', () => {
    const standing = createBlock(Element.Fire, { x: 0, y: 0 }, BlockOrientation.Standing);
    expect(checkHazard(standing, [TileType.Fragile])).toBe(true);
  });

  it('Fragile is safe when LyingX', () => {
    const lying = createBlock(Element.Fire, { x: 0, y: 0 }, BlockOrientation.LyingX);
    expect(checkHazard(lying, [TileType.Fragile, TileType.Fragile])).toBe(false);
  });

  it('Fragile is safe when LyingY', () => {
    const lying = createBlock(Element.Water, { x: 0, y: 0 }, BlockOrientation.LyingY);
    expect(checkHazard(lying, [TileType.Fragile, TileType.Fragile])).toBe(false);
  });

  it('Safe tile (Stone) does not kill', () => {
    const block = createBlock(Element.Fire, { x: 0, y: 0 });
    expect(checkHazard(block, [TileType.Stone])).toBe(false);
  });

  it('Mixed footprint: if any tile kills, block dies (lava under water)', () => {
    const block = createBlock(Element.Water, { x: 0, y: 0 }, BlockOrientation.LyingX);
    // one lava, one stone
    expect(checkHazard(block, [TileType.Lava, TileType.Stone])).toBe(true);
  });
});

// ─── getFootprintTiles ───────────────────────────────────────────────────────

describe('getFootprintTiles', () => {
  it('returns the tile types under each footprint cell', () => {
    const tiles = makeGrid(5, 5, TileType.Stone);
    tiles[0][0] = TileType.Lava;
    tiles[0][1] = TileType.Water;
    const block = createBlock(Element.Fire, { x: 0, y: 0 }, BlockOrientation.LyingX);
    expect(getFootprintTiles(block, tiles)).toEqual([TileType.Lava, TileType.Water]);
  });

  it('Standing returns a single tile type', () => {
    const tiles = makeGrid(5, 5, TileType.Stone);
    tiles[2][3] = TileType.Toxic;
    const block = createBlock(Element.Fire, { x: 3, y: 2 }, BlockOrientation.Standing);
    expect(getFootprintTiles(block, tiles)).toEqual([TileType.Toxic]);
  });
});

// ─── activateSwitch ──────────────────────────────────────────────────────────

describe('activateSwitch', () => {
  it('changes target tiles from fromType to toType', () => {
    const tiles = makeGrid(5, 5, TileType.Stone);
    tiles[1][1] = TileType.Empty;
    tiles[2][2] = TileType.Empty;
    const effect = {
      targets: [{ x: 1, y: 1 }, { x: 2, y: 2 }],
      fromType: TileType.Empty,
      toType: TileType.Stone,
      toggle: false,
    };
    const newTiles = activateSwitch(tiles, effect);
    expect(newTiles[1][1]).toBe(TileType.Stone);
    expect(newTiles[2][2]).toBe(TileType.Stone);
  });

  it('does not mutate the original grid', () => {
    const tiles = makeGrid(5, 5, TileType.Stone);
    tiles[0][0] = TileType.Empty;
    const effect = {
      targets: [{ x: 0, y: 0 }],
      fromType: TileType.Empty,
      toType: TileType.Stone,
      toggle: false,
    };
    activateSwitch(tiles, effect);
    expect(tiles[0][0]).toBe(TileType.Empty); // original unchanged
  });

  it('toggle=true: reverts to fromType if tile is already toType', () => {
    const tiles = makeGrid(5, 5, TileType.Stone);
    // tile is already the toType
    tiles[1][1] = TileType.Stone;
    const effect = {
      targets: [{ x: 1, y: 1 }],
      fromType: TileType.Empty,
      toType: TileType.Stone,
      toggle: true,
    };
    const newTiles = activateSwitch(tiles, effect);
    expect(newTiles[1][1]).toBe(TileType.Empty);
  });

  it('toggle=true: sets toType when tile is fromType', () => {
    const tiles = makeGrid(5, 5, TileType.Stone);
    tiles[1][1] = TileType.Empty;
    const effect = {
      targets: [{ x: 1, y: 1 }],
      fromType: TileType.Empty,
      toType: TileType.Stone,
      toggle: true,
    };
    const newTiles = activateSwitch(tiles, effect);
    expect(newTiles[1][1]).toBe(TileType.Stone);
  });
});

// ─── checkWinCondition ───────────────────────────────────────────────────────

describe('checkWinCondition', () => {
  it('returns true when both blocks are Standing on their matching exit', () => {
    const tiles = makeGrid(5, 5, TileType.Stone);
    tiles[0][1] = TileType.ExitFire;
    tiles[0][3] = TileType.ExitWater;
    const fire = createBlock(Element.Fire, { x: 1, y: 0 }, BlockOrientation.Standing);
    const water = createBlock(Element.Water, { x: 3, y: 0 }, BlockOrientation.Standing);
    expect(checkWinCondition(fire, water, tiles)).toBe(true);
  });

  it('returns false when fire is not on exit', () => {
    const tiles = makeGrid(5, 5, TileType.Stone);
    tiles[0][3] = TileType.ExitWater;
    const fire = createBlock(Element.Fire, { x: 1, y: 0 }, BlockOrientation.Standing);
    const water = createBlock(Element.Water, { x: 3, y: 0 }, BlockOrientation.Standing);
    expect(checkWinCondition(fire, water, tiles)).toBe(false);
  });

  it('returns false when water is not on exit', () => {
    const tiles = makeGrid(5, 5, TileType.Stone);
    tiles[0][1] = TileType.ExitFire;
    const fire = createBlock(Element.Fire, { x: 1, y: 0 }, BlockOrientation.Standing);
    const water = createBlock(Element.Water, { x: 3, y: 0 }, BlockOrientation.Standing);
    expect(checkWinCondition(fire, water, tiles)).toBe(false);
  });

  it('returns false when fire block is not Standing', () => {
    const tiles = makeGrid(5, 5, TileType.Stone);
    tiles[0][1] = TileType.ExitFire;
    tiles[0][3] = TileType.ExitWater;
    const fire = createBlock(Element.Fire, { x: 1, y: 0 }, BlockOrientation.LyingX);
    const water = createBlock(Element.Water, { x: 3, y: 0 }, BlockOrientation.Standing);
    expect(checkWinCondition(fire, water, tiles)).toBe(false);
  });

  it('returns false when water block is not Standing', () => {
    const tiles = makeGrid(5, 5, TileType.Stone);
    tiles[0][1] = TileType.ExitFire;
    tiles[0][3] = TileType.ExitWater;
    const fire = createBlock(Element.Fire, { x: 1, y: 0 }, BlockOrientation.Standing);
    const water = createBlock(Element.Water, { x: 3, y: 0 }, BlockOrientation.LyingY);
    expect(checkWinCondition(fire, water, tiles)).toBe(false);
  });

  it('returns false when fire is on water exit and water is on fire exit (swapped)', () => {
    const tiles = makeGrid(5, 5, TileType.Stone);
    tiles[0][1] = TileType.ExitWater;
    tiles[0][3] = TileType.ExitFire;
    const fire = createBlock(Element.Fire, { x: 1, y: 0 }, BlockOrientation.Standing);
    const water = createBlock(Element.Water, { x: 3, y: 0 }, BlockOrientation.Standing);
    expect(checkWinCondition(fire, water, tiles)).toBe(false);
  });

  it('returns false when either block is dead', () => {
    const tiles = makeGrid(5, 5, TileType.Stone);
    tiles[0][1] = TileType.ExitFire;
    tiles[0][3] = TileType.ExitWater;
    const fire = { ...createBlock(Element.Fire, { x: 1, y: 0 }, BlockOrientation.Standing), alive: false };
    const water = createBlock(Element.Water, { x: 3, y: 0 }, BlockOrientation.Standing);
    expect(checkWinCondition(fire, water, tiles)).toBe(false);
  });
});
