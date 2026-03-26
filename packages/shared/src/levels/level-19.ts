import { BlockOrientation, LevelData, TileType } from '../types.js';

const _ = TileType.Empty;
const S = TileType.Stone;
const EF = TileType.ExitFire;
const EW = TileType.ExitWater;

export const level19: LevelData = {
  id: 19,
  name: 'Gauntlet',
  width: 15,
  height: 9,
  tiles: [
    /* y= 0 */ [S, S, S, S, _, _, _, _, _, _, S, S, S, S, _],
    /* y= 1 */ [ S,  _,  _,  _,  _,  _,  _,  _,  _,  _,  S,  S, EF,  S,  _],
    /* y= 2 */ [S, _, _, _, _, _, _, _, S, _, _, S, S, S, _],
    /* y= 3 */ [S, S, S, S, _, _, _, _, S, _, _, _, S, _, _],
    /* y= 4 */ [S, S, S, S, S, S, _, _, S, _, _, _, S, _, _],
    /* y= 5 */ [S, S, S, S, S, S, S, S, S, S, S, S, S, S, S],
    /* y= 6 */ [S, S, S, S, S, _, _, S, _, _, _, _, _, _, _],
    /* y= 7 */ [EW,  S,  S,  S,  _,  _,  _,  S,  _,  _,  _,  _,  _,  _,  _],
    /* y= 8 */ [_, _, _, _, _, _, _, S, _, _, _, _, _, _, _],
  ],
  switchEffects: {},
  fireStart: { position: { x: 2, y: 5 }, orientation: BlockOrientation.Standing },
  waterStart: { position: { x: 13, y: 0 }, orientation: BlockOrientation.Standing },
};
