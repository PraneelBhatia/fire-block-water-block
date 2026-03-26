import { BlockOrientation, LevelData, TileType } from '../types.js';

const _ = TileType.Empty;
const S = TileType.Stone;
const EF = TileType.ExitFire;
const EW = TileType.ExitWater;

export const level16: LevelData = {
  id: 16,
  name: 'Chain Reaction',
  width: 15,
  height: 10,
  tiles: [
    /* y= 0 */ [EW,  S,  S,  _,  _,  _,  S,  S,  S,  _,  _,  S,  S,  S,  _],
    /* y= 1 */ [ S,  S,  S,  S,  S,  S,  S,  S,  S,  S,  S,  S, EF,  S,  _],
    /* y= 2 */ [S, S, S, _, _, _, S, S, S, _, _, S, S, S, _],
    /* y= 3 */ [_, S, _, _, _, _, _, S, _, _, _, _, _, _, _],
    /* y= 4 */ [_, S, _, _, _, _, _, S, _, _, _, _, _, _, _],
    /* y= 5 */ [S, S, _, _, _, _, _, _, _, _, _, _, _, _, _],
    /* y= 6 */ [S, S, S, S, S, _, _, _, S, _, _, _, _, _, _],
    /* y= 7 */ [S, S, S, S, S, _, _, S, S, S, _, _, S, S, S],
    /* y= 8 */ [_, _, _, _, S, S, S, S, S, S, S, S, S, S, S],
    /* y= 9 */ [_, _, _, _, _, _, _, S, S, S, _, _, S, S, S],
  ],
  switchEffects: {},
  fireStart: { position: { x: 1, y: 1 }, orientation: BlockOrientation.Standing },
  waterStart: { position: { x: 14, y: 9 }, orientation: BlockOrientation.Standing },
};
