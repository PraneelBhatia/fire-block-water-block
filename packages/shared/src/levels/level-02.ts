import { BlockOrientation, LevelData, TileType } from '../types.js';

const _ = TileType.Empty;
const S = TileType.Stone;
const L = TileType.Lava;
const W = TileType.Water;
const EF = TileType.ExitFire;
const EW = TileType.ExitWater;

export const level02: LevelData = {
  id: 2,
  name: 'Stepping Out',
  width: 10,
  height: 6,
  tiles: [
    /* y= 0 */ [ _,  _,  _,  _,  _,  _,  S,  S, EW,  _],
    /* y= 1 */ [ _,  _,  _,  _,  _,  W,  S, EF,  S,  S],
    /* y= 2 */ [_, S, S, S, S, S, S, S, S, S],
    /* y= 3 */ [S, S, L, S, S, S, S, S, S, _],
    /* y= 4 */ [S, S, S, S, S, S, _, _, _, _],
    /* y= 5 */ [S, S, S, _, _, _, _, _, _, _],
  ],
  switchEffects: {},
  fireStart: { position: { x: 5, y: 2 }, orientation: BlockOrientation.Standing },
  waterStart: { position: { x: 0, y: 5 }, orientation: BlockOrientation.Standing },
};
