import { BlockOrientation, LevelData, TileType } from '../types.js';

const _ = TileType.Empty;
const S = TileType.Stone;
const EF = TileType.ExitFire;
const EW = TileType.ExitWater;

export const level21: LevelData = {
  id: 21,
  name: 'Toggle Maze',
  width: 15,
  height: 10,
  tiles: [
    /* y= 0 */ [_, _, _, _, _, _, _, _, _, _, _, _, S, S, S],
    /* y= 1 */ [ _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  S, EF,  S],
    /* y= 2 */ [S, S, _, _, _, _, _, _, _, _, _, _, S, S, S],
    /* y= 3 */ [S, S, S, S, _, _, _, S, S, S, S, S, S, S, S],
    /* y= 4 */ [_, _, S, S, S, _, _, S, S, S, _, _, _, _, _],
    /* y= 5 */ [_, _, S, S, S, _, _, S, S, S, _, _, _, _, _],
    /* y= 6 */ [_, _, S, S, S, _, _, S, S, S, _, _, _, _, _],
    /* y= 7 */ [_, _, S, S, S, _, _, S, S, S, _, _, S, S, S],
    /* y= 8 */ [ _,  _, EW,  S,  S,  S,  S,  S,  S,  S,  S,  S,  S,  S,  S],
    /* y= 9 */ [_, _, _, _, _, _, _, _, _, _, _, _, S, S, S],
  ],
  switchEffects: {},
  fireStart: { position: { x: 8, y: 7 }, orientation: BlockOrientation.Standing },
  waterStart: { position: { x: 14, y: 0 }, orientation: BlockOrientation.Standing },
};
