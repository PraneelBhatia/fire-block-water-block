import { BlockOrientation, LevelData, TileType } from '../types.js';

const _ = TileType.Empty;
const S = TileType.Stone;
const F = TileType.Fragile;
const EF = TileType.ExitFire;
const EW = TileType.ExitWater;

export const level24: LevelData = {
  id: 24,
  name: 'Winding Road',
  width: 15,
  height: 10,
  tiles: [
    /* y= 0 */ [ _,  _,  _, EW,  S,  S,  S,  S,  S,  _,  _,  _,  _,  _,  _],
    /* y= 1 */ [_, _, _, S, S, S, F, F, F, F, F, S, S, S, _],
    /* y= 2 */ [_, _, _, S, S, S, F, F, F, F, F, S, S, S, _],
    /* y= 3 */ [S, S, S, S, S, S, F, F, F, F, F, S, S, S, S],
    /* y= 4 */ [S, _, _, _, S, _, _, F, F, F, _, _, _, _, S],
    /* y= 5 */ [S, _, _, _, S, _, _, S, S, S, _, _, _, _, S],
    /* y= 6 */ [ S,  S,  S,  S,  S,  _,  _,  S, EF,  S,  _,  _,  S,  S,  S],
    /* y= 7 */ [_, S, S, S, _, _, _, S, S, S, S, S, S, S, S],
    /* y= 8 */ [_, S, S, S, _, _, _, _, _, _, _, _, S, S, S],
    /* y= 9 */ [_, S, S, S, _, _, _, _, _, _, _, _, S, S, S],
  ],
  switchEffects: {},
  fireStart: { position: { x: 4, y: 2 }, orientation: BlockOrientation.Standing },
  waterStart: { position: { x: 14, y: 9 }, orientation: BlockOrientation.Standing },
};
