import { BlockOrientation, LevelData, TileType } from '../types.js';

const _ = TileType.Empty;
const S = TileType.Stone;
const L = TileType.Lava;
const W = TileType.Water;
const EF = TileType.ExitFire;
const EW = TileType.ExitWater;

export const level04: LevelData = {
  id: 4,
  name: 'Pathfinder',
  width: 15,
  height: 6,
  tiles: [
    /* y= 0 */ [_, _, _, _, _, _, _, _, _, _, _, _, S, S, S],
    /* y= 1 */ [S, S, S, S, _, _, _, _, _, _, _, L, S, S, S],
    /* y= 2 */ [ L,  S,  S,  S,  _,  _,  _,  _,  _,  _,  _,  S,  S, EF,  S],
    /* y= 3 */ [S, W, S, S, S, S, S, S, S, _, _, S, S, S, S],
    /* y= 4 */ [EW,  S,  S,  S,  _,  _,  S,  S,  S,  _,  _,  S,  S,  _,  _],
    /* y= 5 */ [_, _, _, _, _, _, S, S, S, S, S, S, S, _, _],
  ],
  switchEffects: {},
  fireStart: { position: { x: 0, y: 3 }, orientation: BlockOrientation.Standing },
  waterStart: { position: { x: 14, y: 0 }, orientation: BlockOrientation.Standing },
};
