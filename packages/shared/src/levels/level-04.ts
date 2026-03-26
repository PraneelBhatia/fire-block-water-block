import { BlockOrientation, LevelData, TileType } from '../types.js';

const S = TileType.Stone;
const _ = TileType.Empty;
const W = TileType.Water;
const L = TileType.Lava;
const SF = TileType.SwitchFire;
const SW = TileType.SwitchWater;
const EF = TileType.ExitFire;
const EW = TileType.ExitWater;

/**
 * Level 4: "Give & Take"
 * Both players must cooperate. Fire switch opens water's path,
 * water switch opens fire's path. Water must go first.
 *
 * Fire's direct path blocked by Water tiles at (1,4)&(1,5) (deadly to fire).
 * Water's direct path blocked by Lava tiles at (6,4)&(6,5) (deadly to water).
 *
 * Solution order:
 * 1. Water goes to SW at (6,3): Standing(6,0) N-> LyingY(6,1) N-> Standing(6,3)=SW
 *    Switch converts (1,4)&(1,5) from Water to Stone.
 * 2. Fire goes to SF at (1,3): Standing(1,0) N-> LyingY(1,1) N-> Standing(1,3)=SF
 *    Switch converts (6,4)&(6,5) from Lava to Stone.
 * 3. Fire: Standing(1,3) N-> LyingY(1,4) on S&S N-> Standing(1,6)=EF
 * 4. Water: Standing(6,3) N-> LyingY(6,4) on S&S N-> Standing(6,6)=EW
 */
export const level04: LevelData = {
  id: 4,
  name: 'Give & Take',
  width: 8,
  height: 7,
  tiles: [
    /* y=0 */ [_, S, _, _, _, _, S, _],
    /* y=1 */ [_, S, _, _, _, _, S, _],
    /* y=2 */ [_, S, _, _, _, _, S, _],
    /* y=3 */ [_, SF, _, _, _, _, SW, _],
    /* y=4 */ [_, W, _, _, _, _, L, _],
    /* y=5 */ [_, W, _, _, _, _, L, _],
    /* y=6 */ [_, EF, _, _, _, _, EW, _],
  ],
  switchEffects: {
    '1,3': {
      targets: [{ x: 6, y: 4 }, { x: 6, y: 5 }],
      fromType: TileType.Lava,
      toType: TileType.Stone,
      toggle: false,
    },
    '6,3': {
      targets: [{ x: 1, y: 4 }, { x: 1, y: 5 }],
      fromType: TileType.Water,
      toType: TileType.Stone,
      toggle: false,
    },
  },
  fireStart: { position: { x: 1, y: 0 }, orientation: BlockOrientation.Standing },
  waterStart: { position: { x: 6, y: 0 }, orientation: BlockOrientation.Standing },
};
