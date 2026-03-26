import { BlockOrientation, LevelData, TileType } from '../types.js';

const _ = TileType.Empty;
const S = TileType.Stone;
const F = TileType.Fragile;
const EF = TileType.ExitFire;
const EW = TileType.ExitWater;

export const level14: LevelData = {
  id: 14,
  name: 'Narrow Escape',
  width: 14,
  height: 10,
  tiles: [
    /* y= 0 */ [ _,  _,  _,  S,  S,  S,  _,  _,  S, EW,  _,  _,  _,  _],
    /* y= 1 */ [_, _, _, S, S, F, F, F, F, F, F, _, _, _],
    /* y= 2 */ [_, _, S, S, S, F, F, S, F, F, F, _, _, _],
    /* y= 3 */ [_, _, S, _, _, F, F, F, F, F, S, S, _, _],
    /* y= 4 */ [S, S, S, _, _, F, S, S, S, _, _, S, _, _],
    /* y= 5 */ [ S,  S,  S,  F,  F,  F,  S, EF,  S,  _,  _,  S,  S,  S],
    /* y= 6 */ [S, S, S, _, _, _, S, S, S, _, _, S, S, S],
    /* y= 7 */ [S, S, _, _, _, _, _, _, _, _, _, S, S, S],
    /* y= 8 */ [S, S, _, _, _, _, _, _, _, _, S, S, S, _],
    /* y= 9 */ [S, S, S, F, S, S, S, S, F, S, S, S, S, _],
  ],
  switchEffects: {},
  fireStart: { position: { x: 12, y: 6 }, orientation: BlockOrientation.Standing },
  waterStart: { position: { x: 0, y: 9 }, orientation: BlockOrientation.Standing },
};
