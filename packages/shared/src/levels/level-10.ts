import { BlockOrientation, LevelData, TileType } from '../types.js';

const S = TileType.Stone;
const _ = TileType.Empty;
const L = TileType.Lava;
const W = TileType.Water;
const T = TileType.Toxic;
const F = TileType.Fragile;
const SF = TileType.SwitchFire;
const SW = TileType.SwitchWater;
const EF = TileType.ExitFire;
const EW = TileType.ExitWater;

/**
 * Level 10: "The Gauntlet"
 * Uses ALL mechanics: lava, water, toxic, fragile, fire switch, water switch.
 * Fragile tiles must be crossed lying. Toxic center forces side paths.
 * Switches must be activated to clear hazards blocking exits.
 *
 * Solution order:
 * 1. Water: tip LyingX, slide north across fragile at y=3, land on SW at (8,3). Clears fire's W tiles.
 * 2. Fire: tip LyingX, slide north across fragile at y=3, land on SF at (1,3). Clears water's L tiles.
 * 3. Both proceed south through cleared paths to exits.
 */
export const level10: LevelData = {
  id: 10,
  name: 'The Gauntlet',
  width: 10,
  height: 10,
  tiles: [
    /* y=0 */ [_, S, S, S, _, _, S, S, S, _],
    /* y=1 */ [_, S, S, S, _, _, S, S, S, _],
    /* y=2 */ [_, S, S, S, _, _, S, S, S, _],
    /* y=3 */ [_, SF, F, F, T, T, F, F, SW, _],
    /* y=4 */ [_, S, F, F, T, T, F, F, S, _],
    /* y=5 */ [_, S, S, S, _, _, S, S, S, _],
    /* y=6 */ [_, S, S, S, _, _, S, S, S, _],
    /* y=7 */ [_, W, S, S, _, _, S, S, L, _],
    /* y=8 */ [_, W, S, S, _, _, S, S, L, _],
    /* y=9 */ [_, EF, _, _, _, _, _, _, EW, _],
  ],
  switchEffects: {
    '1,3': {
      targets: [{ x: 8, y: 7 }, { x: 8, y: 8 }],
      fromType: TileType.Lava,
      toType: TileType.Stone,
      toggle: false,
    },
    '8,3': {
      targets: [{ x: 1, y: 7 }, { x: 1, y: 8 }],
      fromType: TileType.Water,
      toType: TileType.Stone,
      toggle: false,
    },
  },
  fireStart: { position: { x: 1, y: 0 }, orientation: BlockOrientation.Standing },
  waterStart: { position: { x: 8, y: 0 }, orientation: BlockOrientation.Standing },
};
