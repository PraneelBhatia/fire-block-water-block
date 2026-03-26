import { BlockOrientation, LevelData, TileType } from '../types.js';

const S = TileType.Stone;
const _ = TileType.Empty;
const L = TileType.Lava;
const SF = TileType.SwitchFire;
const SW = TileType.SwitchWater;
const EF = TileType.ExitFire;
const EW = TileType.ExitWater;

/**
 * Level 7: "One at a Time"
 * Sequential switches: fire hits switch1 to clear water's path to switch2.
 * Water hits switch2 to clear fire's exit.
 *
 * Solution:
 * 1. Fire: (1,0) N->N->Standing(1,3)=SF. Clears (6,4)&(6,5) L->S for water.
 * 2. Water: (6,0) N->N->Standing(6,3) N->LyingY(6,4) [now S] N->Standing(6,6)=SW. Clears (1,7)&(1,8) L->S.
 * 3. Fire continues: (1,3) N->LyingY(1,4) N->Standing(1,6) N->LyingY(1,7) [now S] N->Standing(1,9)=EF.
 * 4. Water: (6,6) N->LyingY(6,7) N->Standing(6,9)=EW.
 */
export const level07: LevelData = {
  id: 7,
  name: 'One at a Time',
  width: 8,
  height: 10,
  tiles: [
    /* y=0 */ [_, S, _, _, _, _, S, _],
    /* y=1 */ [_, S, _, _, _, _, S, _],
    /* y=2 */ [_, S, _, _, _, _, S, _],
    /* y=3 */ [_, SF, _, _, _, _, S, _],
    /* y=4 */ [_, S, _, _, _, _, L, _],
    /* y=5 */ [_, S, _, _, _, _, L, _],
    /* y=6 */ [_, S, _, _, _, _, SW, _],
    /* y=7 */ [_, L, _, _, _, _, S, _],
    /* y=8 */ [_, L, _, _, _, _, S, _],
    /* y=9 */ [_, EF, _, _, _, _, EW, _],
  ],
  switchEffects: {
    '1,3': {
      targets: [{ x: 6, y: 4 }, { x: 6, y: 5 }],
      fromType: TileType.Lava,
      toType: TileType.Stone,
      toggle: false,
    },
    '6,6': {
      targets: [{ x: 1, y: 7 }, { x: 1, y: 8 }],
      fromType: TileType.Lava,
      toType: TileType.Stone,
      toggle: false,
    },
  },
  fireStart: { position: { x: 1, y: 0 }, orientation: BlockOrientation.Standing },
  waterStart: { position: { x: 6, y: 0 }, orientation: BlockOrientation.Standing },
};
