import { BlockOrientation, LevelData, TileType } from '../types.js';

const _ = TileType.Empty;
const S = TileType.Stone;
const EF = TileType.ExitFire;
const EW = TileType.ExitWater;

export const level17: LevelData = {
  id: 17,
  name: 'Labyrinth',
  width: 13,
  height: 8,
  tiles: [
    /* y= 0 */ [ _,  _,  S, EW,  S,  _,  _,  _,  S,  S,  S,  _,  _],
    /* y= 1 */ [ _,  _,  S,  S,  S,  S,  S,  S,  S,  S, EF,  _,  _],
    /* y= 2 */ [_, _, S, S, S, _, _, _, S, S, S, _, _],
    /* y= 3 */ [_, _, _, _, _, _, _, _, _, _, _, _, _],
    /* y= 4 */ [_, _, _, _, _, _, _, _, _, _, _, _, _],
    /* y= 5 */ [_, S, _, _, _, _, _, _, _, _, S, S, S],
    /* y= 6 */ [S, S, S, S, S, S, S, S, S, S, S, S, S],
    /* y= 7 */ [_, S, _, _, _, _, _, _, _, _, S, S, S],
  ],
  switchEffects: {},
  fireStart: { position: { x: 2, y: 0 }, orientation: BlockOrientation.Standing },
  waterStart: { position: { x: 10, y: 2 }, orientation: BlockOrientation.Standing },
};
