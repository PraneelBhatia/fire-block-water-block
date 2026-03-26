import { BlockOrientation, LevelData, TileType } from '../types.js';

const _ = TileType.Empty;
const S = TileType.Stone;
const EF = TileType.ExitFire;
const EW = TileType.ExitWater;

export const level13: LevelData = {
  id: 13,
  name: 'Toggle Trouble',
  width: 13,
  height: 10,
  tiles: [
    /* y= 0 */ [_, _, _, _, _, S, S, S, _, _, _, _, _],
    /* y= 1 */ [_, _, _, _, _, S, S, S, _, _, _, _, _],
    /* y= 2 */ [EW,  S,  S,  S,  _,  _,  S,  S,  S,  S,  S,  _,  _],
    /* y= 3 */ [S, S, S, S, _, _, _, _, _, S, S, S, S],
    /* y= 4 */ [_, S, S, S, S, S, _, _, _, S, S, S, S],
    /* y= 5 */ [ _,  _,  _,  S, EF,  S,  S,  _,  _,  _,  S,  S,  _],
    /* y= 6 */ [_, _, _, S, S, S, S, S, _, _, S, S, _],
    /* y= 7 */ [_, _, _, _, _, S, S, S, S, S, S, S, S],
    /* y= 8 */ [_, _, _, _, _, S, S, S, _, _, S, S, S],
    /* y= 9 */ [_, _, _, _, _, _, _, _, _, _, _, _, S],
  ],
  switchEffects: {},
  fireStart: { position: { x: 2, y: 3 }, orientation: BlockOrientation.Standing },
  waterStart: { position: { x: 12, y: 9 }, orientation: BlockOrientation.Standing },
};
