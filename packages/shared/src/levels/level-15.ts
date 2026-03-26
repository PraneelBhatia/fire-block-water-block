import { BlockOrientation, LevelData, TileType } from '../types.js';

const _ = TileType.Empty;
const S = TileType.Stone;
const EF = TileType.ExitFire;
const EW = TileType.ExitWater;

export const level15: LevelData = {
  id: 15,
  name: 'Switcheroo',
  width: 14,
  height: 10,
  tiles: [
    /* y= 0 */ [_, _, S, S, S, _, _, _, S, S, S, S, S, S],
    /* y= 1 */ [ _,  S,  S, EF,  S,  _,  _,  _,  S,  S,  S,  _,  _,  _],
    /* y= 2 */ [S, S, S, S, S, _, _, _, S, S, S, _, _, _],
    /* y= 3 */ [S, _, _, _, _, _, _, _, S, S, S, S, S, S],
    /* y= 4 */ [S, _, _, _, _, _, _, _, _, _, _, _, S, S],
    /* y= 5 */ [S, _, _, _, _, _, _, _, _, _, _, _, S, S],
    /* y= 6 */ [S, S, S, S, S, S, _, _, _, _, _, _, S, S],
    /* y= 7 */ [EW,  S,  S,  S,  S,  S,  S,  S,  S,  S,  S,  S,  S,  S],
    /* y= 8 */ [_, _, _, S, S, S, _, _, S, S, S, _, _, _],
    /* y= 9 */ [_, _, _, _, _, _, _, _, S, S, S, _, _, _],
  ],
  switchEffects: {},
  fireStart: { position: { x: 4, y: 8 }, orientation: BlockOrientation.Standing },
  waterStart: { position: { x: 13, y: 0 }, orientation: BlockOrientation.Standing },
};
