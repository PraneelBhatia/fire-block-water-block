import { BlockOrientation, LevelData, TileType } from '../types.js';

const _ = TileType.Empty;
const S = TileType.Stone;
const L = TileType.Lava;
const W = TileType.Water;
const F = TileType.Fragile;
const EF = TileType.ExitFire;
const EW = TileType.ExitWater;

export const level05: LevelData = {
  id: 5,
  name: 'The Crossing',
  width: 15,
  height: 9,
  tiles: [
    /* y= 0 */ [_, _, _, _, _, _, S, S, S, _, _, F, F, F, F],
    /* y= 1 */ [ _,  _,  _,  _,  _,  _,  W, EF,  S,  _,  _,  F,  F,  S,  F],
    /* y= 2 */ [S, S, S, _, _, _, S, S, S, S, F, F, F, F, F],
    /* y= 3 */ [S, S, S, _, _, _, S, S, S, S, F, F, F, F, F],
    /* y= 4 */ [S, L, S, _, _, _, _, _, _, _, _, S, S, _, _],
    /* y= 5 */ [EW,  S,  S,  _,  _,  _,  _,  _,  _,  _,  _,  S,  S,  _,  _],
    /* y= 6 */ [S, S, S, S, _, _, _, _, _, _, S, S, S, _, _],
    /* y= 7 */ [_, _, _, F, F, F, F, F, F, F, F, _, _, _, _],
    /* y= 8 */ [_, _, _, F, F, F, F, F, F, F, F, _, _, _, _],
  ],
  switchEffects: {},
  fireStart: { position: { x: 0, y: 2 }, orientation: BlockOrientation.Standing },
  waterStart: { position: { x: 10, y: 6 }, orientation: BlockOrientation.Standing },
};
