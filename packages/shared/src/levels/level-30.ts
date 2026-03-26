import { BlockOrientation, LevelData, TileType } from '../types.js';

const _ = TileType.Empty;
const S = TileType.Stone;
const EF = TileType.ExitFire;
const EW = TileType.ExitWater;

export const level30: LevelData = {
  id: 30,
  name: 'Tidal Wave',
  width: 15,
  height: 10,
  tiles: [
    /* y= 0 */ [S, S, S, S, _, _, _, _, _, S, S, S, S, _, _],
    /* y= 1 */ [ S, EF,  S,  S,  S,  S,  _,  _,  _,  S,  _,  _,  _,  _,  _],
    /* y= 2 */ [S, S, S, _, _, S, S, _, _, S, _, _, _, _, _],
    /* y= 3 */ [_, _, _, _, _, S, S, _, _, S, S, S, S, _, _],
    /* y= 4 */ [_, _, _, _, _, S, S, _, _, S, _, _, _, _, _],
    /* y= 5 */ [_, _, _, _, _, S, S, S, S, S, _, _, _, _, _],
    /* y= 6 */ [S, S, S, S, S, S, S, S, S, S, S, S, S, S, S],
    /* y= 7 */ [_, _, _, _, _, S, S, S, S, S, _, _, _, _, _],
    /* y= 8 */ [_, _, _, _, _, S, _, _, _, S, _, _, _, _, _],
    /* y= 9 */ [ _,  _,  S,  S,  S,  S,  _,  _,  _,  S,  S,  S, EW,  _,  _],
  ],
  switchEffects: {},
  fireStart: { position: { x: 7, y: 6 }, orientation: BlockOrientation.Standing },
  waterStart: { position: { x: 0, y: 0 }, orientation: BlockOrientation.Standing },
};
