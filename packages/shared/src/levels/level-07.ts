import { BlockOrientation, LevelData, TileType } from '../types.js';

const _ = TileType.Empty;
const S = TileType.Stone;
const EF = TileType.ExitFire;
const EW = TileType.ExitWater;

export const level07: LevelData = {
  id: 7,
  name: 'Island Hop',
  width: 15,
  height: 10,
  tiles: [
    /* y= 0 */ [_, _, _, _, _, _, _, S, S, S, _, _, _, _, _],
    /* y= 1 */ [_, _, _, _, _, _, S, S, S, S, S, _, _, _, _],
    /* y= 2 */ [_, _, _, _, _, _, S, S, S, S, S, _, _, _, _],
    /* y= 3 */ [_, _, _, _, _, _, S, _, _, S, S, _, _, _, _],
    /* y= 4 */ [_, _, _, _, S, S, S, _, _, _, _, _, S, S, S],
    /* y= 5 */ [ _,  _,  _,  _,  S,  S,  S,  _,  _,  _,  _,  S,  S, EF,  S],
    /* y= 6 */ [ S, EW,  S,  S,  S,  S,  _,  _,  _,  _,  _,  S,  S,  S,  S],
    /* y= 7 */ [_, _, _, _, _, S, _, _, S, S, S, S, S, _, _],
    /* y= 8 */ [_, _, _, _, _, S, _, _, S, S, S, _, _, _, _],
    /* y= 9 */ [_, _, _, _, _, S, S, S, S, S, S, _, _, _, _],
  ],
  switchEffects: {},
  fireStart: { position: { x: 0, y: 6 }, orientation: BlockOrientation.Standing },
  waterStart: { position: { x: 14, y: 4 }, orientation: BlockOrientation.Standing },
};
