import { BlockOrientation, LevelData, TileType } from '../types.js';

const _ = TileType.Empty;
const S = TileType.Stone;
const EF = TileType.ExitFire;
const EW = TileType.ExitWater;

export const level18: LevelData = {
  id: 18,
  name: 'Tightrope',
  width: 15,
  height: 10,
  tiles: [
    /* y= 0 */ [S, S, S, _, _, _, _, _, _, _, _, S, S, _, _],
    /* y= 1 */ [S, S, S, _, _, _, _, _, _, _, _, S, S, _, _],
    /* y= 2 */ [S, S, S, S, S, S, S, S, S, _, _, S, S, _, _],
    /* y= 3 */ [S, S, S, _, _, _, S, S, S, S, S, S, S, _, _],
    /* y= 4 */ [S, S, S, _, _, _, _, _, _, _, _, _, _, _, _],
    /* y= 5 */ [S, S, S, _, _, _, _, _, _, _, _, _, _, _, _],
    /* y= 6 */ [S, S, S, _, _, _, _, _, _, _, _, _, S, S, S],
    /* y= 7 */ [ S,  S,  S,  _,  _,  _,  _,  S,  S,  S,  S,  S,  S, EF,  S],
    /* y= 8 */ [S, S, S, S, S, S, S, S, S, S, _, _, S, S, S],
    /* y= 9 */ [EW,  S,  S,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _],
  ],
  switchEffects: {},
  fireStart: { position: { x: 1, y: 8 }, orientation: BlockOrientation.Standing },
  waterStart: { position: { x: 12, y: 0 }, orientation: BlockOrientation.Standing },
};
