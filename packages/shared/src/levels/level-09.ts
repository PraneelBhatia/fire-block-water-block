import { BlockOrientation, LevelData, TileType } from '../types.js';

const _ = TileType.Empty;
const S = TileType.Stone;
const L = TileType.Lava;
const EF = TileType.ExitFire;
const EW = TileType.ExitWater;

export const level09: LevelData = {
  id: 9,
  name: 'Bridgework',
  width: 15,
  height: 9,
  tiles: [
    /* y= 0 */ [_, _, _, _, _, _, _, _, _, S, S, S, _, _, _],
    /* y= 1 */ [_, _, _, _, _, _, _, _, _, S, S, S, _, _, _],
    /* y= 2 */ [_, _, _, _, _, _, _, _, _, S, S, S, _, _, _],
    /* y= 3 */ [ S,  S,  S,  L, EF,  S,  _,  _,  _,  S,  S,  S,  S,  S,  S],
    /* y= 4 */ [S, S, S, S, S, S, _, _, _, S, S, S, S, S, S],
    /* y= 5 */ [ S, EW,  S,  S,  S,  S,  _,  _,  _,  S,  S,  S,  S,  S,  S],
    /* y= 6 */ [_, _, _, _, _, _, _, _, _, S, S, S, _, _, _],
    /* y= 7 */ [_, _, _, _, _, _, _, _, _, S, S, S, _, _, _],
    /* y= 8 */ [_, _, _, _, _, _, _, _, _, S, S, S, _, _, _],
  ],
  switchEffects: {},
  fireStart: { position: { x: 0, y: 5 }, orientation: BlockOrientation.Standing },
  waterStart: { position: { x: 5, y: 3 }, orientation: BlockOrientation.Standing },
};
