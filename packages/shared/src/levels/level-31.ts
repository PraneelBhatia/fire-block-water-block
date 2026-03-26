import { BlockOrientation, LevelData, TileType } from '../types.js';

const _ = TileType.Empty;
const S = TileType.Stone;
const L = TileType.Lava;
const W = TileType.Water;
const F = TileType.Fragile;
const EF = TileType.ExitFire;
const EW = TileType.ExitWater;

export const level31: LevelData = {
  id: 31,
  name: 'Lock and Key',
  width: 15,
  height: 10,
  tiles: [
    /* y= 0 */ [_, F, W, F, F, F, _, _, F, F, F, F, S, _, _],
    /* y= 1 */ [EW,  F,  F,  F,  F,  F,  F,  F,  F,  F,  F,  F,  S,  S,  _],
    /* y= 2 */ [ F,  F,  F,  S,  F,  S,  F,  F,  S,  F,  _,  _, EF,  S,  _],
    /* y= 3 */ [F, F, F, F, _, _, _, S, L, S, _, _, S, S, S],
    /* y= 4 */ [_, S, S, F, _, _, _, F, F, _, _, _, _, _, S],
    /* y= 5 */ [_, _, S, _, _, _, _, F, F, _, _, _, _, _, S],
    /* y= 6 */ [_, _, _, _, _, _, _, F, S, S, S, S, S, S, S],
    /* y= 7 */ [_, _, _, S, S, S, _, _, _, _, _, _, _, S, S],
    /* y= 8 */ [_, _, _, S, S, S, S, _, _, _, _, _, _, S, _],
    /* y= 9 */ [_, _, _, S, S, S, S, S, F, F, S, S, S, S, _],
  ],
  switchEffects: {},
  fireStart: { position: { x: 2, y: 5 }, orientation: BlockOrientation.Standing },
  waterStart: { position: { x: 14, y: 3 }, orientation: BlockOrientation.Standing },
};
