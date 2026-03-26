import { BlockOrientation, LevelData, TileType } from '../types.js';

const _ = TileType.Empty;
const S = TileType.Stone;
const EF = TileType.ExitFire;
const EW = TileType.ExitWater;

export const level26: LevelData = {
  id: 26,
  name: 'Ember Trail',
  width: 14,
  height: 10,
  tiles: [
    /* y= 0 */ [_, _, _, _, _, _, _, _, _, _, _, S, S, S],
    /* y= 1 */ [EW,  S,  S,  _,  _,  _,  S,  S,  S,  S,  S,  S,  S,  S],
    /* y= 2 */ [S, S, S, _, _, _, S, S, _, _, _, S, S, S],
    /* y= 3 */ [S, S, S, S, S, S, S, S, _, _, _, _, _, _],
    /* y= 4 */ [_, S, S, _, _, _, S, S, _, _, _, _, _, _],
    /* y= 5 */ [_, _, _, _, _, _, S, S, S, S, S, S, S, _],
    /* y= 6 */ [ _,  _,  _,  S,  S,  S,  S,  S,  _,  _,  S, EF,  S,  S],
    /* y= 7 */ [_, _, S, S, S, _, _, _, _, _, S, S, S, S],
    /* y= 8 */ [_, _, S, S, S, _, _, _, _, _, _, _, _, _],
    /* y= 9 */ [_, _, S, S, _, _, _, _, _, _, _, _, _, _],
  ],
  switchEffects: {},
  fireStart: { position: { x: 1, y: 2 }, orientation: BlockOrientation.Standing },
  waterStart: { position: { x: 13, y: 7 }, orientation: BlockOrientation.Standing },
};
