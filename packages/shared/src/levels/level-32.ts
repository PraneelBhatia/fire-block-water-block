import { BlockOrientation, LevelData, TileType } from '../types.js';

const _ = TileType.Empty;
const S = TileType.Stone;
const F = TileType.Fragile;
const EF = TileType.ExitFire;
const EW = TileType.ExitWater;

export const level32: LevelData = {
  id: 32,
  name: 'Inferno Path',
  width: 15,
  height: 10,
  tiles: [
    /* y= 0 */ [EW,  S,  S,  S,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _],
    /* y= 1 */ [S, S, S, S, _, _, S, _, _, _, _, S, S, S, _],
    /* y= 2 */ [S, S, S, S, S, S, S, S, S, S, S, S, S, S, _],
    /* y= 3 */ [_, _, S, _, _, _, S, S, S, _, _, S, S, S, _],
    /* y= 4 */ [_, _, F, _, _, _, S, S, S, _, _, F, F, F, _],
    /* y= 5 */ [_, F, F, F, _, _, S, S, S, _, _, _, F, _, _],
    /* y= 6 */ [_, S, S, S, _, _, S, S, S, _, _, _, S, _, _],
    /* y= 7 */ [_, S, S, S, S, S, S, S, S, S, S, S, S, S, S],
    /* y= 8 */ [ _,  S,  S,  S,  _,  _,  _,  _,  S,  _,  _,  S, EF,  S,  S],
    /* y= 9 */ [_, _, _, _, _, _, _, _, _, _, _, S, S, S, S],
  ],
  switchEffects: {},
  fireStart: { position: { x: 12, y: 2 }, orientation: BlockOrientation.Standing },
  waterStart: { position: { x: 1, y: 8 }, orientation: BlockOrientation.Standing },
};
