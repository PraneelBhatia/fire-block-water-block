import { BlockOrientation, LevelData, TileType } from '../types.js';

const _ = TileType.Empty;
const S = TileType.Stone;
const EF = TileType.ExitFire;
const EW = TileType.ExitWater;

export const level08: LevelData = {
  id: 8,
  name: 'Zigzag',
  width: 15,
  height: 8,
  tiles: [
    /* y= 0 */ [_, _, S, S, S, S, S, S, _, _, _, _, _, _, _],
    /* y= 1 */ [_, S, S, S, _, _, _, S, _, _, _, _, _, _, _],
    /* y= 2 */ [S, S, S, _, _, _, _, S, S, S, _, _, S, S, S],
    /* y= 3 */ [S, S, S, _, _, _, _, S, S, S, _, _, S, S, S],
    /* y= 4 */ [ S,  S,  S,  S,  S,  S,  S,  S,  S,  _,  _,  _,  S, EF,  S],
    /* y= 5 */ [EW,  S,  S,  _,  _,  _,  _,  _,  S,  _,  _,  S,  S,  S,  S],
    /* y= 6 */ [_, _, _, _, _, _, _, _, S, S, S, S, _, _, _],
    /* y= 7 */ [_, _, _, _, _, _, _, _, S, S, S, S, _, _, _],
  ],
  switchEffects: {},
  fireStart: { position: { x: 1, y: 5 }, orientation: BlockOrientation.Standing },
  waterStart: { position: { x: 14, y: 2 }, orientation: BlockOrientation.Standing },
};
