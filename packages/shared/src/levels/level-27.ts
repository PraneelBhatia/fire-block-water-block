import { BlockOrientation, LevelData, TileType } from '../types.js';

const _ = TileType.Empty;
const S = TileType.Stone;
const EF = TileType.ExitFire;
const EW = TileType.ExitWater;

export const level27: LevelData = {
  id: 27,
  name: 'Splitter',
  width: 14,
  height: 9,
  tiles: [
    /* y= 0 */ [_, _, _, _, _, _, S, S, S, _, _, _, _, _],
    /* y= 1 */ [_, S, _, _, _, _, S, S, S, S, _, _, _, _],
    /* y= 2 */ [_, S, _, _, _, _, S, S, S, _, _, _, _, _],
    /* y= 3 */ [S, S, S, _, _, _, S, _, _, _, S, _, _, _],
    /* y= 4 */ [S, S, S, S, _, _, S, _, _, _, S, S, _, _],
    /* y= 5 */ [ S, EF,  S,  S,  S,  S,  S,  S,  _,  _,  S,  S,  S,  S],
    /* y= 6 */ [_, _, _, _, S, S, S, S, S, S, S, _, _, S],
    /* y= 7 */ [_, _, _, _, _, S, S, S, S, S, S, _, _, S],
    /* y= 8 */ [ _,  _,  _,  _,  _,  S,  S,  S,  S,  _,  _,  _,  _, EW],
  ],
  switchEffects: {},
  fireStart: { position: { x: 10, y: 3 }, orientation: BlockOrientation.Standing },
  waterStart: { position: { x: 0, y: 5 }, orientation: BlockOrientation.Standing },
};
