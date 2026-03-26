import { BlockOrientation, LevelData, TileType } from '../types.js';

const S = TileType.Stone;
const _ = TileType.Empty;
const L = TileType.Lava;
const SF = TileType.SwitchFire;
const EF = TileType.ExitFire;
const EW = TileType.ExitWater;

/**
 * Level 3: "Open Sesame"
 * Fire must step on a SwitchFire tile to convert lava to stone, opening
 * a path for the water block.
 *
 * Fire solution:
 *   Standing(1,0) N-> LyingY(1,1) N-> Standing(1,3)=SF (switch activates!)
 *   Switch converts (6,4)&(6,5) from Lava to Stone.
 *   Standing(1,3) N-> LyingY(1,4) N-> Standing(1,6)=EF
 *
 * Water solution (after switch):
 *   Standing(6,0) N-> LyingY(6,1) N-> Standing(6,3)
 *   N-> LyingY(6,4) on (6,4)S&(6,5)S (was Lava, now Stone). Safe!
 *   N-> Standing(6,6)=EW
 */
export const level03: LevelData = {
  id: 3,
  name: 'Open Sesame',
  width: 8,
  height: 7,
  tiles: [
    /* y=0 */ [_, S, _, _, _, _, S, _],
    /* y=1 */ [_, S, _, _, _, _, S, _],
    /* y=2 */ [_, S, _, _, _, _, S, _],
    /* y=3 */ [_, SF, _, _, _, _, S, _],
    /* y=4 */ [_, S, _, _, _, _, L, _],
    /* y=5 */ [_, S, _, _, _, _, L, _],
    /* y=6 */ [_, EF, _, _, _, _, EW, _],
  ],
  switchEffects: {
    '1,3': {
      targets: [{ x: 6, y: 4 }, { x: 6, y: 5 }],
      fromType: TileType.Lava,
      toType: TileType.Stone,
      toggle: false,
    },
  },
  fireStart: { position: { x: 1, y: 0 }, orientation: BlockOrientation.Standing },
  waterStart: { position: { x: 6, y: 0 }, orientation: BlockOrientation.Standing },
};
