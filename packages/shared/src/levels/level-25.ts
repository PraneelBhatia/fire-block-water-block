import { BlockOrientation, LevelData, TileType } from '../types.js';

const _ = TileType.Empty;
const S = TileType.Stone;
const EF = TileType.ExitFire;
const EW = TileType.ExitWater;

export const level25: LevelData = {
  id: 25,
  name: 'Bridge of Peril',
  width: 14,
  height: 8,
  tiles: [
    /* y= 0 */ [_, _, _, _, _, S, S, S, _, _, S, S, S, _],
    /* y= 1 */ [ S,  S,  S,  _,  _,  S,  S,  S,  S,  S,  S,  S, EF,  _],
    /* y= 2 */ [S, S, S, S, S, _, _, _, _, _, S, S, S, _],
    /* y= 3 */ [S, S, _, _, S, _, _, _, _, _, _, _, S, _],
    /* y= 4 */ [EW,  S,  _,  _,  S,  S,  _,  _,  _,  _,  _,  _,  S,  _],
    /* y= 5 */ [_, S, S, S, S, S, S, _, _, _, S, S, S, S],
    /* y= 6 */ [_, _, _, S, S, S, S, S, S, S, S, S, S, S],
    /* y= 7 */ [_, _, _, _, _, _, _, _, _, _, S, S, S, S],
  ],
  switchEffects: {},
  fireStart: { position: { x: 1, y: 5 }, orientation: BlockOrientation.Standing },
  waterStart: { position: { x: 12, y: 0 }, orientation: BlockOrientation.Standing },
};
