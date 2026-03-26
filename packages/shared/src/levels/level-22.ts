import { BlockOrientation, LevelData, TileType } from '../types.js';

const _ = TileType.Empty;
const S = TileType.Stone;
const EF = TileType.ExitFire;
const EW = TileType.ExitWater;

export const level22: LevelData = {
  id: 22,
  name: 'Crystal Cavern',
  width: 15,
  height: 10,
  tiles: [
    /* y= 0 */ [_, _, _, S, S, S, S, S, S, S, _, _, _, _, _],
    /* y= 1 */ [_, _, _, S, S, S, _, _, S, S, _, _, _, _, _],
    /* y= 2 */ [_, _, S, S, S, S, _, _, S, S, _, _, _, _, _],
    /* y= 3 */ [_, _, S, _, _, _, _, _, S, S, _, _, S, S, S],
    /* y= 4 */ [ _,  S,  S,  _,  _,  _,  _,  _,  S,  S,  S,  S,  S, EF,  S],
    /* y= 5 */ [S, S, S, S, _, _, _, _, S, _, _, _, S, S, S],
    /* y= 6 */ [EW,  S,  S,  S,  S,  S,  _,  _,  S,  _,  _,  _,  _,  _,  _],
    /* y= 7 */ [S, S, _, _, S, S, S, S, S, S, _, _, _, _, _],
    /* y= 8 */ [_, _, _, _, _, _, _, S, S, S, _, _, _, _, _],
    /* y= 9 */ [_, _, _, _, _, _, _, _, S, S, _, _, _, _, _],
  ],
  switchEffects: {},
  fireStart: { position: { x: 1, y: 6 }, orientation: BlockOrientation.Standing },
  waterStart: { position: { x: 14, y: 3 }, orientation: BlockOrientation.Standing },
};
