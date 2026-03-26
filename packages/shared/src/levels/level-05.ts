import { BlockOrientation, LevelData, TileType } from '../types.js';

const S = TileType.Stone;
const _ = TileType.Empty;
const F = TileType.Fragile;
const EF = TileType.ExitFire;
const EW = TileType.ExitWater;

/**
 * Level 5: "Watch Your Step"
 * Fragile tiles collapse under a standing block. Must cross while lying.
 * Blocks start standing and need room to tip over before crossing the fragile bridge.
 *
 * Grid layout: two 3-wide corridors with fragile sections in the middle rows.
 *
 * Fire solution (left side, columns 0-2):
 *   Standing(0,0) E-> LyingX(1,0) on (1,0)S&(2,0)S
 *   LyingX(1,0) N-> LyingX(1,1) on (1,1)S&(2,1)S
 *   LyingX(1,1) N-> LyingX(1,2) on (1,2)S&(2,2)S
 *   LyingX(1,2) N-> LyingX(1,3) on (1,3)F&(2,3)F  -- lying, safe on fragile!
 *   LyingX(1,3) N-> LyingX(1,4) on (1,4)F&(2,4)F  -- lying, safe on fragile!
 *   LyingX(1,4) N-> LyingX(1,5) on (1,5)S&(2,5)S
 *   LyingX(1,5) N-> LyingX(1,6) on (1,6)S&(2,6)S
 *   LyingX(1,6) N-> LyingX(1,7) on (1,7)S&(2,7)S
 *   LyingX(1,7) W-> Standing(0,7) S
 *   Standing(0,7) N-> LyingY(0,8) on (0,8)S&(0,9)EF
 *   No wait, LyingY on EF doesn't win. Need Standing on EF.
 *
 * Actually I need Standing on the exit tile. Let me use a simpler layout.
 *
 * Revised: just have a straight north path with a fragile section in the middle.
 * Use 2-wide columns so blocks can tip to LyingX.
 *
 * Fire: cols 0-2, Water: cols 5-7
 *
 *          0  1  2  3  4  5  6  7
 * y=0:     S  S  S  _  _  S  S  S     <- start row
 * y=1:     S  S  S  _  _  S  S  S
 * y=2:     S  S  S  _  _  S  S  S
 * y=3:     _  F  F  _  _  F  F  _     <- fragile bridge
 * y=4:     _  F  F  _  _  F  F  _     <- fragile bridge
 * y=5:     S  S  S  _  _  S  S  S
 * y=6:     S  S  S  _  _  S  S  S
 * y=7:     S  S  S  _  _  S  S  S
 * y=8:     _ EF  _  _  _  _  EW _
 *
 * Fire solution:
 *   Standing(0,0) E-> LyingX(1,0) on (1,0)S&(2,0)S. OK.
 *   LyingX(1,0) N-> LyingX(1,1) on (1,1)S&(2,1)S. OK.
 *   LyingX(1,1) N-> LyingX(1,2) on (1,2)S&(2,2)S. OK.
 *   LyingX(1,2) N-> LyingX(1,3) on (1,3)F&(2,3)F. Lying=safe! OK.
 *   LyingX(1,3) N-> LyingX(1,4) on (1,4)F&(2,4)F. Lying=safe! OK.
 *   LyingX(1,4) N-> LyingX(1,5) on (1,5)S&(2,5)S. OK.
 *   LyingX(1,5) W-> Standing(0,5). S. OK.
 *   Standing(0,5) N-> LyingY(0,6) on (0,6)S&(0,7)S. OK.
 *   LyingY(0,6) E-> LyingY(1,6) on (1,6)S&(1,7)S. OK.
 *   LyingY(1,6) N-> Standing(1,8)=EF. Win!
 *
 * Water solution (mirror on right):
 *   Standing(7,0) W-> LyingX(5,0) on (5,0)S&(6,0)S. OK.
 *   LyingX(5,0) N-> LyingX(5,1)... N-> LyingX(5,2)... N-> LyingX(5,3) F&F...
 *   N-> LyingX(5,4) F&F... N-> LyingX(5,5) S&S.
 *   LyingX(5,5) E-> Standing(7,5). S. OK.
 *   Standing(7,5) N-> LyingY(7,6) on (7,6)S&(7,7)S. OK.
 *   LyingY(7,6) W-> LyingY(6,6) on (6,6)S&(6,7)S. OK.
 *   LyingY(6,6) N-> Standing(6,8)=EW. Win!
 */
export const level05: LevelData = {
  id: 5,
  name: 'Watch Your Step',
  width: 8,
  height: 9,
  tiles: [
    /* y=0 */ [S, S, S, _, _, S, S, S],
    /* y=1 */ [S, S, S, _, _, S, S, S],
    /* y=2 */ [S, S, S, _, _, S, S, S],
    /* y=3 */ [_, F, F, _, _, F, F, _],
    /* y=4 */ [_, F, F, _, _, F, F, _],
    /* y=5 */ [S, S, S, _, _, S, S, S],
    /* y=6 */ [S, S, S, _, _, S, S, S],
    /* y=7 */ [S, S, S, _, _, S, S, S],
    /* y=8 */ [_, EF, _, _, _, _, EW, _],
  ],
  switchEffects: {},
  fireStart: { position: { x: 0, y: 0 }, orientation: BlockOrientation.Standing },
  waterStart: { position: { x: 7, y: 0 }, orientation: BlockOrientation.Standing },
};
