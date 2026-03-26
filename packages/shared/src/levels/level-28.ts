import { BlockOrientation, LevelData, TileType } from '../types.js';

const _ = TileType.Empty;
const S = TileType.Stone;
const L = TileType.Lava;
const W = TileType.Water;
const F = TileType.Fragile;
const EF = TileType.ExitFire;
const EW = TileType.ExitWater;

export const level28: LevelData = {
  id: 28,
  name: 'Convergence',
  width: 15,
  height: 10,
  tiles: [
    /* y= 0 */ [ _,  _,  _,  _,  _,  _,  S,  L,  S, EW,  _,  _,  _,  _,  _],
    /* y= 1 */ [_, _, _, _, _, F, F, F, F, F, F, F, S, S, S],
    /* y= 2 */ [S, S, L, F, F, F, F, F, F, F, F, F, S, S, S],
    /* y= 3 */ [ S, EF,  S,  F,  F,  F,  F,  F,  F,  F,  _,  _,  S,  L,  S],
    /* y= 4 */ [S, S, L, _, _, F, F, F, F, S, _, _, W, S, _],
    /* y= 5 */ [_, _, _, _, _, _, _, _, _, _, _, _, S, S, _],
    /* y= 6 */ [_, _, _, _, _, _, _, _, _, _, _, _, S, S, S],
    /* y= 7 */ [S, W, S, _, _, _, _, S, S, _, _, _, _, W, S],
    /* y= 8 */ [S, L, S, S, S, S, S, S, S, S, S, _, _, S, S],
    /* y= 9 */ [S, S, S, _, _, _, _, S, S, S, S, S, W, S, S],
  ],
  switchEffects: {},
  fireStart: { position: { x: 1, y: 4 }, orientation: BlockOrientation.Standing },
  waterStart: { position: { x: 14, y: 9 }, orientation: BlockOrientation.Standing },
};
