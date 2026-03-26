import { BlockOrientation, LevelData, TileType } from '../types.js';

const S = TileType.Stone;
const _ = TileType.Empty;
const L = TileType.Lava;
const W = TileType.Water;
const EF = TileType.ExitFire;
const EW = TileType.ExitWater;

/**
 * Level 2: "Hot & Cold"
 * Introduces lava and water tiles as safe terrain for respective elements.
 * Fire walks through lava, water walks through water. Parallel lanes.
 *
 * Fire solution: Standing(1,0) N-> LyingY(1,1) N-> Standing(1,3) N-> LyingY(1,4) N-> Standing(1,6)=EF
 * Water solution: Standing(6,0) N-> LyingY(6,1) N-> Standing(6,3) N-> LyingY(6,4) N-> Standing(6,6)=EW
 */
export const level02: LevelData = {
  id: 2,
  name: 'Hot & Cold',
  width: 8,
  height: 7,
  tiles: [
    /* y=0 */ [_, S, _, _, _, _, S, _],
    /* y=1 */ [_, L, _, _, _, _, W, _],
    /* y=2 */ [_, L, _, _, _, _, W, _],
    /* y=3 */ [_, L, _, _, _, _, W, _],
    /* y=4 */ [_, L, _, _, _, _, W, _],
    /* y=5 */ [_, L, _, _, _, _, W, _],
    /* y=6 */ [_, EF, _, _, _, _, EW, _],
  ],
  switchEffects: {},
  fireStart: { position: { x: 1, y: 0 }, orientation: BlockOrientation.Standing },
  waterStart: { position: { x: 6, y: 0 }, orientation: BlockOrientation.Standing },
};
