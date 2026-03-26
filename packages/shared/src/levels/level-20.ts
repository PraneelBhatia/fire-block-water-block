import { BlockOrientation, LevelData, TileType } from '../types.js';

const _ = TileType.Empty;
const S = TileType.Stone;
const EF = TileType.ExitFire;
const EW = TileType.ExitWater;

export const level20: LevelData = {
  id: 20,
  name: 'Crossfire',
  width: 15,
  height: 10,
  tiles: [
    /* y= 0 */ [_, S, S, S, S, S, S, S, S, S, S, S, S, S, _],
    /* y= 1 */ [_, S, S, _, _, S, S, _, _, _, _, _, _, _, _],
    /* y= 2 */ [S, S, S, _, _, S, S, _, _, _, _, _, _, _, _],
    /* y= 3 */ [ S, EF,  S,  _,  _,  S,  S,  _,  _,  _,  _,  _,  _,  _,  _],
    /* y= 4 */ [S, S, S, _, _, S, S, S, S, S, S, S, S, S, S],
    /* y= 5 */ [_, _, _, _, _, _, _, _, _, _, _, _, _, S, S],
    /* y= 6 */ [_, _, _, _, _, _, _, _, _, _, _, _, _, S, S],
    /* y= 7 */ [_, _, _, _, _, S, S, _, _, _, _, _, _, S, S],
    /* y= 8 */ [_, _, _, _, _, S, S, _, _, _, _, _, _, S, S],
    /* y= 9 */ [ _,  S,  S,  S,  S,  S,  S,  S,  S,  S,  S,  S,  S,  S, EW],
  ],
  switchEffects: {},
  fireStart: { position: { x: 1, y: 9 }, orientation: BlockOrientation.Standing },
  waterStart: { position: { x: 13, y: 0 }, orientation: BlockOrientation.Standing },
};
