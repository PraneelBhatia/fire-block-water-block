import { BlockOrientation, LevelData, TileType } from '../types.js';

const _ = TileType.Empty;
const S = TileType.Stone;
const EF = TileType.ExitFire;
const EW = TileType.ExitWater;

export const level12: LevelData = {
  id: 12,
  name: 'Pressure Plates',
  width: 12,
  height: 10,
  tiles: [
    /* y= 0 */ [_, _, _, _, _, _, _, _, S, S, S, _],
    /* y= 1 */ [_, _, _, _, _, S, S, S, S, S, S, S],
    /* y= 2 */ [_, _, _, _, _, S, S, S, S, _, _, S],
    /* y= 3 */ [_, _, _, _, _, S, S, _, _, _, _, S],
    /* y= 4 */ [S, S, S, S, S, S, S, _, _, S, S, S],
    /* y= 5 */ [_, S, _, _, _, S, S, _, _, S, S, _],
    /* y= 6 */ [_, S, _, _, _, S, S, S, S, S, S, _],
    /* y= 7 */ [_, S, S, S, _, _, _, _, _, _, _, _],
    /* y= 8 */ [ _,  S, EF,  S,  S,  _,  _,  _,  _,  _,  _,  _],
    /* y= 9 */ [ _, EW,  S,  S,  S,  _,  _,  _,  _,  _,  _,  _],
  ],
  switchEffects: {},
  fireStart: { position: { x: 0, y: 4 }, orientation: BlockOrientation.Standing },
  waterStart: { position: { x: 11, y: 1 }, orientation: BlockOrientation.Standing },
};
