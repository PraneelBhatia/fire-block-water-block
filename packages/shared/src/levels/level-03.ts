import { BlockOrientation, LevelData, TileType } from '../types.js';

const _ = TileType.Empty;
const S = TileType.Stone;
const L = TileType.Lava;
const W = TileType.Water;
const EF = TileType.ExitFire;
const EW = TileType.ExitWater;

export const level03: LevelData = {
  id: 3,
  name: 'Bridge Builder',
  width: 15,
  height: 6,
  tiles: [
    /* y= 0 */ [EW,  L,  S,  S,  _,  _,  S,  S,  S,  S,  _,  _,  _,  _,  _],
    /* y= 1 */ [S, S, S, S, S, S, S, S, S, S, S, S, S, W, S],
    /* y= 2 */ [S, S, S, S, _, _, S, S, S, S, _, _, S, S, S],
    /* y= 3 */ [S, S, S, S, _, _, S, W, S, S, _, _, S, S, S],
    /* y= 4 */ [ S,  S,  S,  S,  _,  _,  S,  S,  S,  S,  _,  _,  S, EF,  S],
    /* y= 5 */ [_, _, _, _, _, _, L, S, S, S, _, _, S, S, S],
  ],
  switchEffects: {},
  fireStart: { position: { x: 0, y: 2 }, orientation: BlockOrientation.Standing },
  waterStart: { position: { x: 14, y: 5 }, orientation: BlockOrientation.Standing },
};
