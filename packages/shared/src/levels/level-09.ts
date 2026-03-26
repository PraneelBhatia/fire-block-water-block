import { BlockOrientation, LevelData, TileType } from '../types.js';

const S = TileType.Stone;
const _ = TileType.Empty;
const T = TileType.Toxic;
const L = TileType.Lava;
const W = TileType.Water;
const EF = TileType.ExitFire;
const EW = TileType.ExitWater;

/**
 * Level 9: "No Safe Ground"
 * Toxic tiles in the center that kill both elements. Players must navigate
 * around the toxic zone using narrow paths.
 *
 * Fire solution (left side around toxic):
 *   Standing(0,0) N->LyingY(0,1) on S&S. N->Standing(0,3)=S.
 *   E->LyingX(1,3) on S&S. E->Standing(3,3)=S.
 *   N->LyingY(3,4) on L&L [fire safe]. N->Standing(3,6)=S.
 *   N->LyingY(3,7) on S&S. N->Standing(3,9)=EF.
 *
 * Water solution (right side around toxic):
 *   Standing(8,0) N->LyingY(8,1) on S&S. N->Standing(8,3)=S.
 *   W->LyingX(6,3) on S&S. W->Standing(5,3)=S.
 *   N->LyingY(5,4) on W&W [water safe]. N->Standing(5,6)=S.
 *   N->LyingY(5,7) on S&S. N->Standing(5,9)=EW.
 */
export const level09: LevelData = {
  id: 9,
  name: 'No Safe Ground',
  width: 9,
  height: 10,
  tiles: [
    /* y=0 */ [S, _, _, _, _, _, _, _, S],
    /* y=1 */ [S, _, _, _, _, _, _, _, S],
    /* y=2 */ [S, _, _, _, _, _, _, _, S],
    /* y=3 */ [S, S, S, S, T, S, S, S, S],
    /* y=4 */ [_, _, _, L, T, W, _, _, _],
    /* y=5 */ [_, _, _, L, T, W, _, _, _],
    /* y=6 */ [_, _, _, S, T, S, _, _, _],
    /* y=7 */ [_, _, _, S, _, S, _, _, _],
    /* y=8 */ [_, _, _, S, _, S, _, _, _],
    /* y=9 */ [_, _, _, EF, _, EW, _, _, _],
  ],
  switchEffects: {},
  fireStart: { position: { x: 0, y: 0 }, orientation: BlockOrientation.Standing },
  waterStart: { position: { x: 8, y: 0 }, orientation: BlockOrientation.Standing },
};
