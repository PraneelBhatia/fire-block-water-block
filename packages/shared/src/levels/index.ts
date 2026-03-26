import { LevelData } from '../types.js';
import { level01 } from './level-01.js';
import { level02 } from './level-02.js';
import { level03 } from './level-03.js';
import { level04 } from './level-04.js';
import { level05 } from './level-05.js';
import { level06 } from './level-06.js';
import { level07 } from './level-07.js';
import { level08 } from './level-08.js';
import { level09 } from './level-09.js';
import { level10 } from './level-10.js';
import { level11 } from './level-11.js';
import { level12 } from './level-12.js';
import { level13 } from './level-13.js';
import { level14 } from './level-14.js';
import { level15 } from './level-15.js';
import { level16 } from './level-16.js';
import { level17 } from './level-17.js';
import { level18 } from './level-18.js';
import { level19 } from './level-19.js';
import { level20 } from './level-20.js';
import { level21 } from './level-21.js';
import { level22 } from './level-22.js';
import { level23 } from './level-23.js';
import { level24 } from './level-24.js';
import { level25 } from './level-25.js';
import { level26 } from './level-26.js';
import { level27 } from './level-27.js';
import { level28 } from './level-28.js';
import { level29 } from './level-29.js';
import { level30 } from './level-30.js';
import { level31 } from './level-31.js';
import { level32 } from './level-32.js';
import { level33 } from './level-33.js';
import { level34 } from './level-34.js';

const levels: LevelData[] = [
  level01,
  level02,
  level03,
  level04,
  level05,
  level06,
  level07,
  level08,
  level09,
  level10,
  level11,
  level12,
  level13,
  level14,
  level15,
  level16,
  level17,
  level18,
  level19,
  level20,
  level21,
  level22,
  level23,
  level24,
  level25,
  level26,
  level27,
  level28,
  level29,
  level30,
  level31,
  level32,
  level33,
  level34,
];

export function getLevel(id: number): LevelData | undefined {
  return levels.find((l) => l.id === id);
}

export function getAllLevels(): LevelData[] {
  return levels;
}
