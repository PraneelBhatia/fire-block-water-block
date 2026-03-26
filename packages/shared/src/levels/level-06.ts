import { BlockOrientation, LevelData, TileType } from '../types.js';

const S = TileType.Stone;
const _ = TileType.Empty;
const L = TileType.Lava;
const SF = TileType.SwitchFire;
const EF = TileType.ExitFire;
const EW = TileType.ExitWater;

/**
 * Level 6: "Flip the Script"
 * Toggle switch! SwitchFire converts Lava tiles to Water (toggle: true).
 * Fire hits the switch on its stone path, converting lava to water for water block.
 * Fire's path is entirely stone, unaffected by the toggle.
 *
 * Fire: Standing(1,0) N->N->Standing(1,3)=SF [toggle!] N->...->Standing(1,9)=EF
 * Water: Standing(7,0) N->N->Standing(7,3) N->LyingY(7,4) on W&W [safe] N->...->Standing(7,9)=EW
 */
export const level06: LevelData = {
  id: 6,
  name: 'Flip the Script',
  width: 9,
  height: 10,
  tiles: [
    /* y=0 */ [_, S, S, _, _, _, S, S, _],
    /* y=1 */ [_, S, S, _, _, _, S, S, _],
    /* y=2 */ [_, S, S, _, _, _, S, S, _],
    /* y=3 */ [_, SF, S, S, S, S, S, S, _],
    /* y=4 */ [_, S, S, _, _, _, L, L, _],
    /* y=5 */ [_, S, S, _, _, _, L, L, _],
    /* y=6 */ [_, S, S, _, _, _, S, S, _],
    /* y=7 */ [_, S, S, _, _, _, S, S, _],
    /* y=8 */ [_, S, S, _, _, _, S, S, _],
    /* y=9 */ [_, EF, _, _, _, _, _, EW, _],
  ],
  switchEffects: {
    '1,3': {
      targets: [
        { x: 6, y: 4 }, { x: 7, y: 4 },
        { x: 6, y: 5 }, { x: 7, y: 5 },
      ],
      fromType: TileType.Lava,
      toType: TileType.Water,
      toggle: true,
    },
  },
  fireStart: { position: { x: 1, y: 0 }, orientation: BlockOrientation.Standing },
  waterStart: { position: { x: 7, y: 0 }, orientation: BlockOrientation.Standing },
};
