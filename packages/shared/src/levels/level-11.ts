import { BlockOrientation, LevelData, TileType } from '../types.js';

const _ = TileType.Empty;
const S = TileType.Stone;
const L = TileType.Lava;
const W = TileType.Water;
const EF = TileType.ExitFire;
const EW = TileType.ExitWater;

export const level11: LevelData = {
  id: 11,
  name: 'Split Decision',
  width: 14,
  height: 10,
  tiles: [
    /* y= 0 */ [_, _, _, _, S, S, _, _, S, L, S, S, S, _],
    /* y= 1 */ [_, _, _, _, S, S, S, S, S, _, _, S, S, _],
    /* y= 2 */ [_, _, _, _, _, _, _, _, _, _, _, S, S, _],
    /* y= 3 */ [_, _, _, _, _, _, _, _, _, _, _, _, S, _],
    /* y= 4 */ [_, _, _, _, _, _, _, _, _, _, _, _, S, _],
    /* y= 5 */ [_, _, _, _, _, _, _, _, _, _, _, S, S, _],
    /* y= 6 */ [_, _, _, _, _, _, _, _, _, S, S, S, S, _],
    /* y= 7 */ [S, S, S, _, _, _, _, _, S, S, S, S, W, _],
    /* y= 8 */ [ S, EF,  S,  S,  S,  S,  S,  S,  S,  S,  S,  S,  S,  S],
    /* y= 9 */ [ S,  S,  S,  _,  _,  _,  _,  _,  S,  S,  L,  S,  S, EW],
  ],
  switchEffects: {},
  fireStart: { position: { x: 8, y: 9 }, orientation: BlockOrientation.Standing },
  waterStart: { position: { x: 12, y: 0 }, orientation: BlockOrientation.Standing },
};
