export enum Element {
  Fire = 'fire',
  Water = 'water',
}

export enum TileType {
  Empty = 'empty',
  Stone = 'stone',
  Lava = 'lava',
  Water = 'water',
  Toxic = 'toxic',
  Fragile = 'fragile',
  SwitchFire = 'switch_fire',
  SwitchWater = 'switch_water',
  ExitFire = 'exit_fire',
  ExitWater = 'exit_water',
}

export enum Direction {
  North = 'north',
  South = 'south',
  East = 'east',
  West = 'west',
}

export enum BlockOrientation {
  Standing = 'standing',
  LyingX = 'lying_x',      // extends east: anchor (x,y) to (x+1,y)
  LyingY = 'lying_y',      // extends north: anchor (x,y) to (x,y+1)
}

export interface Position { x: number; y: number; }

export interface BlockState {
  position: Position;
  orientation: BlockOrientation;
  element: Element;
  alive: boolean;
}

export interface SwitchEffect {
  targets: Position[];
  fromType: TileType;
  toType: TileType;
  toggle: boolean;
}

export interface LevelData {
  id: number;
  name: string;
  width: number;
  height: number;
  tiles: TileType[][];           // [y][x]
  switchEffects: Record<string, SwitchEffect>;  // key = "x,y"
  fireStart: { position: Position; orientation: BlockOrientation };
  waterStart: { position: Position; orientation: BlockOrientation };
}

export type GamePhase = 'waiting' | 'playing' | 'completed';
