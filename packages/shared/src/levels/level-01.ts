import { BlockOrientation, LevelData, TileType } from '../types.js';

const S = TileType.Stone;
const _ = TileType.Empty;
const EF = TileType.ExitFire;
const EW = TileType.ExitWater;

export const level01: LevelData = {
  id: 1,
  name: 'First Steps',
  width: 8,
  height: 6,
  tiles: [
    /* y=0 */ [_, S, _, _, _, S, _, _],
    /* y=1 */ [_, S, _, _, _, S, _, _],
    /* y=2 */ [_, S, S, S, _, S, S, _],
    /* y=3 */ [_, _, _, S, _, _, S, _],
    /* y=4 */ [_, _, _, EF, _, _, EW, _],
    /* y=5 */ [_, _, _, _, _, _, _, _],
  ],
  switchEffects: {},
  fireStart: { position: { x: 1, y: 0 }, orientation: BlockOrientation.Standing },
  waterStart: { position: { x: 5, y: 0 }, orientation: BlockOrientation.Standing },
};
