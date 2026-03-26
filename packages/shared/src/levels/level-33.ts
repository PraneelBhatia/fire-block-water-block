import { BlockOrientation, LevelData, TileType } from '../types.js';

const _ = TileType.Empty;
const S = TileType.Stone;
const EF = TileType.ExitFire;
const EW = TileType.ExitWater;

export const level33: LevelData = {
  id: 33,
  name: 'Arctic Drift',
  width: 14,
  height: 9,
  tiles: [
    /* y= 0 */ [ S,  S,  S,  S,  S,  S,  S,  S,  S,  S, EW,  _,  _,  _],
    /* y= 1 */ [S, S, S, S, S, S, S, _, _, S, S, _, _, _],
    /* y= 2 */ [_, _, _, _, S, S, S, _, _, S, S, _, _, _],
    /* y= 3 */ [_, _, _, _, _, _, _, _, _, S, S, _, _, _],
    /* y= 4 */ [_, S, S, S, _, _, _, _, S, S, S, _, _, _],
    /* y= 5 */ [ _,  S, EF,  S,  _,  _,  _,  S,  S,  S,  S,  S,  _,  _],
    /* y= 6 */ [_, S, S, S, S, S, S, S, _, _, S, S, S, S],
    /* y= 7 */ [_, _, S, S, S, S, S, S, _, _, _, S, S, S],
    /* y= 8 */ [_, _, _, _, _, _, _, _, _, _, _, _, S, S],
  ],
  switchEffects: {},
  fireStart: { position: { x: 10, y: 2 }, orientation: BlockOrientation.Standing },
  waterStart: { position: { x: 2, y: 7 }, orientation: BlockOrientation.Standing },
};
