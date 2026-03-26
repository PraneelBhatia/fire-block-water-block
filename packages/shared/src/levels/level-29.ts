import { BlockOrientation, LevelData, TileType } from '../types.js';

const _ = TileType.Empty;
const S = TileType.Stone;
const F = TileType.Fragile;
const EF = TileType.ExitFire;
const EW = TileType.ExitWater;

export const level29: LevelData = {
  id: 29,
  name: 'Firewall',
  width: 15,
  height: 10,
  tiles: [
    /* y= 0 */ [_, _, S, _, _, S, S, S, S, S, S, S, S, _, _],
    /* y= 1 */ [_, _, S, _, _, S, S, _, _, _, S, S, S, _, _],
    /* y= 2 */ [ _,  S,  S,  S,  S,  S,  S,  _,  _,  _,  S,  S,  S,  S, EF],
    /* y= 3 */ [_, S, S, S, _, _, _, _, _, _, S, S, S, S, S],
    /* y= 4 */ [F, S, S, S, _, _, _, _, _, S, S, S, _, _, _],
    /* y= 5 */ [F, F, _, _, _, _, _, _, S, S, S, _, _, _, _],
    /* y= 6 */ [F, F, _, _, _, _, _, S, S, S, _, _, _, _, _],
    /* y= 7 */ [F, F, S, _, _, S, S, S, S, _, _, _, _, _, _],
    /* y= 8 */ [_, S, S, _, _, S, S, S, _, _, _, _, _, _, _],
    /* y= 9 */ [ _, EW,  S,  S,  S,  S,  S,  _,  _,  _,  _,  _,  _,  _,  _],
  ],
  switchEffects: {},
  fireStart: { position: { x: 2, y: 7 }, orientation: BlockOrientation.Standing },
  waterStart: { position: { x: 12, y: 0 }, orientation: BlockOrientation.Standing },
};
