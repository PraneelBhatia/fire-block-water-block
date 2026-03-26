import { BlockOrientation, LevelData, TileType } from '../types.js';

const _ = TileType.Empty;
const S = TileType.Stone;
const EF = TileType.ExitFire;
const EW = TileType.ExitWater;

export const level06: LevelData = {
  id: 6,
  name: 'Switch Play',
  width: 15,
  height: 10,
  tiles: [
    /* y= 0 */ [S, S, S, S, _, _, _, _, _, _, _, _, _, _, _],
    /* y= 1 */ [ S, EF,  S,  S,  S,  S,  S,  S,  S,  S,  S,  S,  S,  _,  _],
    /* y= 2 */ [S, S, S, _, _, _, _, _, _, _, S, S, S, S, S],
    /* y= 3 */ [_, _, _, _, _, _, _, _, _, _, S, S, S, S, S],
    /* y= 4 */ [_, _, _, S, S, S, S, S, S, S, S, S, S, _, _],
    /* y= 5 */ [_, S, S, S, S, _, _, _, _, _, _, _, _, _, _],
    /* y= 6 */ [_, S, S, S, S, _, _, _, _, _, _, _, _, _, _],
    /* y= 7 */ [_, S, S, S, S, _, _, _, _, _, _, _, S, S, S],
    /* y= 8 */ [_, S, S, S, S, S, S, S, S, S, S, S, S, S, S],
    /* y= 9 */ [ _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  S,  S, EW,  S],
  ],
  switchEffects: {},
  fireStart: { position: { x: 14, y: 9 }, orientation: BlockOrientation.Standing },
  waterStart: { position: { x: 0, y: 0 }, orientation: BlockOrientation.Standing },
};
