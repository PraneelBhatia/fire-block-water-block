import { BlockOrientation, LevelData, TileType } from '../types.js';

const S = TileType.Stone;
const _ = TileType.Empty;
const L = TileType.Lava;
const W = TileType.Water;
const EF = TileType.ExitFire;
const EW = TileType.ExitWater;

/**
 * Level 8: "Fork in the Road"
 * Multiple routes through the grid. Players must pick complementary paths.
 * Fire has lava routes, water has water routes, and they share stone passages.
 *
 * Solution: Fire takes lava path (left/center), water takes water path (right/center).
 *
 * Fire: Standing(1,0) N->LyingY(1,1) N->Standing(1,3) E->LyingX(2,3) on S&S
 *   E->Standing(4,3) N->LyingY(4,4) on L&L [safe for fire]
 *   N->Standing(4,6) N->LyingY(4,7) on S&S N->Standing(4,9)=EF
 *
 * Water: Standing(8,0) N->LyingY(8,1) N->Standing(8,3) W->LyingX(6,3) on S&S
 *   W->Standing(5,3) N->LyingY(5,4) on W&W [safe for water]
 *   N->Standing(5,6) N->LyingY(5,7) on S&S N->Standing(5,9)=EW
 */
export const level08: LevelData = {
  id: 8,
  name: 'Fork in the Road',
  width: 10,
  height: 10,
  tiles: [
    /* y=0 */ [_, S, _, _, _, _, _, _, S, _],
    /* y=1 */ [_, S, _, _, _, _, _, _, S, _],
    /* y=2 */ [_, S, _, _, _, _, _, _, S, _],
    /* y=3 */ [_, S, S, S, S, S, S, S, S, _],
    /* y=4 */ [_, _, _, _, L, W, _, _, _, _],
    /* y=5 */ [_, _, _, _, L, W, _, _, _, _],
    /* y=6 */ [_, _, _, _, S, S, _, _, _, _],
    /* y=7 */ [_, _, _, _, S, S, _, _, _, _],
    /* y=8 */ [_, _, _, _, S, S, _, _, _, _],
    /* y=9 */ [_, _, _, _, EF, EW, _, _, _, _],
  ],
  switchEffects: {},
  fireStart: { position: { x: 1, y: 0 }, orientation: BlockOrientation.Standing },
  waterStart: { position: { x: 8, y: 0 }, orientation: BlockOrientation.Standing },
};
