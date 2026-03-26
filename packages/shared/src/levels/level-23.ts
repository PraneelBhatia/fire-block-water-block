import { BlockOrientation, LevelData, TileType } from '../types.js';

const _ = TileType.Empty;
const S = TileType.Stone;
const EF = TileType.ExitFire;
const EW = TileType.ExitWater;

export const level23: LevelData = {
  id: 23,
  name: 'Dual Switch',
  width: 14,
  height: 10,
  tiles: [
    /* y= 0 */ [ _,  _, EW,  _,  _,  _,  _,  _,  _,  S,  _,  _,  _,  _],
    /* y= 1 */ [_, S, S, _, _, _, _, _, _, S, S, _, _, _],
    /* y= 2 */ [_, S, S, _, _, _, _, _, _, S, S, _, _, _],
    /* y= 3 */ [_, S, _, _, _, _, _, _, _, _, S, _, _, _],
    /* y= 4 */ [_, S, _, _, _, _, _, _, _, _, S, _, _, _],
    /* y= 5 */ [S, S, S, _, _, _, _, _, _, S, S, S, _, _],
    /* y= 6 */ [S, S, S, S, S, _, _, S, S, S, S, S, S, _],
    /* y= 7 */ [S, S, S, S, S, S, S, S, S, S, S, S, S, S],
    /* y= 8 */ [ _,  _,  _,  S,  S,  S,  S,  S,  S,  _,  _,  S, EF,  S],
    /* y= 9 */ [_, _, _, _, _, S, S, _, _, _, _, S, S, S],
  ],
  switchEffects: {},
  fireStart: { position: { x: 1, y: 6 }, orientation: BlockOrientation.Standing },
  waterStart: { position: { x: 13, y: 9 }, orientation: BlockOrientation.Standing },
};
