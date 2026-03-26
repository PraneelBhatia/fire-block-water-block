import { BlockOrientation, LevelData, TileType } from '../types.js';

const _ = TileType.Empty;
const S = TileType.Stone;
const L = TileType.Lava;
const W = TileType.Water;
const EF = TileType.ExitFire;
const EW = TileType.ExitWater;

export const level34: LevelData = {
  id: 34,
  name: 'Final Frontier',
  width: 15,
  height: 10,
  tiles: [
    /* y= 0 */ [S, S, S, _, _, _, _, _, _, _, _, _, L, S, S],
    /* y= 1 */ [L, S, S, _, _, W, S, W, _, _, _, W, S, L, W],
    /* y= 2 */ [ S, EF,  L,  S,  S,  L,  L,  S,  _,  _,  S,  S,  S,  S,  S],
    /* y= 3 */ [S, S, S, _, _, S, S, S, S, S, S, L, S, S, S],
    /* y= 4 */ [_, _, _, _, _, S, S, S, S, L, S, S, S, S, _],
    /* y= 5 */ [_, _, _, _, _, S, S, S, S, S, S, S, S, S, _],
    /* y= 6 */ [S, S, S, S, S, S, S, S, W, S, S, S, S, S, _],
    /* y= 7 */ [S, S, S, _, _, S, S, S, S, S, S, S, S, S, _],
    /* y= 8 */ [_, _, _, _, _, S, S, W, S, S, S, W, _, _, _],
    /* y= 9 */ [ _,  _,  _,  _,  _,  W,  S, EW,  S,  S,  S,  _,  _,  _,  _],
  ],
  switchEffects: {},
  fireStart: { position: { x: 1, y: 6 }, orientation: BlockOrientation.Standing },
  waterStart: { position: { x: 14, y: 0 }, orientation: BlockOrientation.Standing },
};
