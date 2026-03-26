import { BlockOrientation, LevelData, TileType } from '../types.js';

const _ = TileType.Empty;
const S = TileType.Stone;
const EF = TileType.ExitFire;
const EW = TileType.ExitWater;

export const level10: LevelData = {
  id: 10,
  name: 'Double Cross',
  width: 15,
  height: 5,
  tiles: [
    /* y= 0 */ [_, _, _, _, _, _, S, S, S, _, _, _, _, _, _],
    /* y= 1 */ [_, _, _, _, _, _, S, S, S, _, _, _, _, _, _],
    /* y= 2 */ [ S,  S,  S,  S,  S,  S,  S,  S,  S,  S,  S,  S,  S, EF,  S],
    /* y= 3 */ [S, S, S, S, _, _, _, S, _, _, _, S, S, S, S],
    /* y= 4 */ [ S, EW,  S,  S,  _,  _,  _,  S,  _,  _,  _,  S,  S,  S,  S],
  ],
  switchEffects: {},
  fireStart: { position: { x: 0, y: 4 }, orientation: BlockOrientation.Standing },
  waterStart: { position: { x: 14, y: 2 }, orientation: BlockOrientation.Standing },
};
