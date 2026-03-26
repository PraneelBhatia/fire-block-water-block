import { LevelData } from '../types.js';
import { level01 } from './level-01.js';

const levels: LevelData[] = [level01];

export function getLevel(id: number): LevelData | undefined {
  return levels.find((l) => l.id === id);
}

export function getAllLevels(): LevelData[] {
  return levels;
}
