/**
 * Convert 33 single-player Bloxorz levels (Tiled JSON) into 2-player co-op format.
 *
 * Usage:  npx tsx scripts/convert-levels.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

// ── We import the solver and types from the shared package ──────────────────

import { solveLevelCoOp } from '../packages/shared/src/solver.js';
import {
  BlockOrientation,
  LevelData,
  SwitchEffect,
  TileType,
} from '../packages/shared/src/types.js';

// ── Paths ───────────────────────────────────────────────────────────────────

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MAPS_DIR = path.join(ROOT, 'reference', 'quick_bloxorz', 'maps');
const LEVELS_DIR = path.join(ROOT, 'packages', 'shared', 'src', 'levels');

// ── Tiled JSON shape (only what we need) ────────────────────────────────────

interface TiledObject {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  properties?: Record<string, unknown>;
  propertytypes?: Record<string, string>;
}

interface TiledLayer {
  name: string;
  type: string;
  objects?: TiledObject[];
}

interface TiledMap {
  layers: TiledLayer[];
  properties?: Record<string, unknown>;
}

// ── Seeded PRNG (Mulberry32) ────────────────────────────────────────────────

function mulberry32(seed: number): () => number {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ── BFS reachability for standing block ─────────────────────────────────────

/**
 * Compute the set of tiles a standing block can reach from `start`,
 * considering all orientations and the rolling mechanics. This checks
 * that the block doesn't fall off the grid or land on empty tiles.
 *
 * Returns a Set of "x,y" strings for positions the block can STAND on.
 */
function computeStandingReachable(
  tiles: TileType[][],
  start: { x: number; y: number },
  width: number,
  height: number,
): Set<string> {
  // State = (x, y, orientation)
  // orientation: 0=Standing, 1=LyingX, 2=LyingY
  const visited = new Set<string>();
  const standingPositions = new Set<string>();
  const queue: Array<[number, number, number]> = [];

  function key(x: number, y: number, ori: number): string {
    return `${x},${y},${ori}`;
  }

  function isNonEmpty(x: number, y: number): boolean {
    return x >= 0 && y >= 0 && x < width && y < height && tiles[y][x] !== TileType.Empty;
  }

  // Check if a cell is valid for the given orientation
  // Standing blocks die on Fragile tiles
  function isValidCell(x: number, y: number, ori: number): boolean {
    if (!isNonEmpty(x, y)) return false;
    if (ori === 0 && tiles[y][x] === TileType.Fragile) return false;
    return true;
  }

  const startKey = key(start.x, start.y, 0);
  if (!isValidCell(start.x, start.y, 0)) return standingPositions;
  visited.add(startKey);
  queue.push([start.x, start.y, 0]);
  standingPositions.add(`${start.x},${start.y}`);

  // Roll transitions: [dx, dy, newOri] for each (ori, direction) pair
  // Directions: 0=North(+y), 1=South(-y), 2=East(+x), 3=West(-x)
  // Standing -> North: LyingY at (x, y+1) occupies (x,y+1) and (x,y+2)
  // Standing -> South: LyingY at (x, y-2) occupies (x,y-2) and (x,y-1)
  // Standing -> East:  LyingX at (x+1, y) occupies (x+1,y) and (x+2,y)
  // Standing -> West:  LyingX at (x-2, y) occupies (x-2,y) and (x-1,y)
  // LyingX -> East:  Standing at (x+2, y)
  // LyingX -> West:  Standing at (x-1, y)
  // LyingX -> North: LyingX at (x, y+1) occupies (x,y+1) and (x+1,y+1)
  // LyingX -> South: LyingX at (x, y-1) occupies (x,y-1) and (x+1,y-1)
  // LyingY -> North: Standing at (x, y+2)
  // LyingY -> South: Standing at (x, y-1)
  // LyingY -> East:  LyingY at (x+1, y) occupies (x+1,y) and (x+1,y+1)
  // LyingY -> West:  LyingY at (x-1, y) occupies (x-1,y) and (x-1,y+1)

  while (queue.length > 0) {
    const [cx, cy, cori] = queue.shift()!;

    // Generate all 4 moves
    const moves: Array<{ nx: number; ny: number; nori: number; cells: Array<[number, number]> }> = [];

    if (cori === 0) {
      // Standing
      moves.push({ nx: cx, ny: cy + 1, nori: 2, cells: [[cx, cy + 1], [cx, cy + 2]] });     // North
      moves.push({ nx: cx, ny: cy - 2, nori: 2, cells: [[cx, cy - 2], [cx, cy - 1]] });     // South
      moves.push({ nx: cx + 1, ny: cy, nori: 1, cells: [[cx + 1, cy], [cx + 2, cy]] });     // East
      moves.push({ nx: cx - 2, ny: cy, nori: 1, cells: [[cx - 2, cy], [cx - 1, cy]] });     // West
    } else if (cori === 1) {
      // LyingX: anchor at (cx,cy), extends to (cx+1,cy)
      moves.push({ nx: cx + 2, ny: cy, nori: 0, cells: [[cx + 2, cy]] });                   // East
      moves.push({ nx: cx - 1, ny: cy, nori: 0, cells: [[cx - 1, cy]] });                   // West
      moves.push({ nx: cx, ny: cy + 1, nori: 1, cells: [[cx, cy + 1], [cx + 1, cy + 1]] }); // North
      moves.push({ nx: cx, ny: cy - 1, nori: 1, cells: [[cx, cy - 1], [cx + 1, cy - 1]] }); // South
    } else {
      // LyingY: anchor at (cx,cy), extends to (cx,cy+1)
      moves.push({ nx: cx, ny: cy + 2, nori: 0, cells: [[cx, cy + 2]] });                   // North
      moves.push({ nx: cx, ny: cy - 1, nori: 0, cells: [[cx, cy - 1]] });                   // South
      moves.push({ nx: cx + 1, ny: cy, nori: 2, cells: [[cx + 1, cy], [cx + 1, cy + 1]] }); // East
      moves.push({ nx: cx - 1, ny: cy, nori: 2, cells: [[cx - 1, cy], [cx - 1, cy + 1]] }); // West
    }

    for (const { nx, ny, nori, cells } of moves) {
      // Check all cells the block would occupy
      let valid = true;
      for (const [cx2, cy2] of cells) {
        if (!isValidCell(cx2, cy2, nori)) {
          valid = false;
          break;
        }
      }
      if (!valid) continue;

      const nk = key(nx, ny, nori);
      if (visited.has(nk)) continue;
      visited.add(nk);
      queue.push([nx, ny, nori]);

      if (nori === 0) {
        standingPositions.add(`${nx},${ny}`);
      }
    }
  }

  return standingPositions;
}

// ── Level names ─────────────────────────────────────────────────────────────

const LEVEL_NAMES: Record<number, string> = {
  1: 'Stepping Out',
  2: 'Bridge Builder',
  3: 'Pathfinder',
  4: 'The Crossing',
  5: 'Switch Play',
  6: 'Island Hop',
  7: 'Zigzag',
  8: 'Bridgework',
  9: 'Double Cross',
  10: 'Split Decision',
  11: 'Pressure Plates',
  12: 'Toggle Trouble',
  13: 'Narrow Escape',
  14: 'Switcheroo',
  15: 'Chain Reaction',
  16: 'Labyrinth',
  17: 'Tightrope',
  18: 'Gauntlet',
  19: 'Crossfire',
  20: 'Toggle Maze',
  21: 'Crystal Cavern',
  22: 'Dual Switch',
  23: 'Winding Road',
  24: 'Bridge of Peril',
  25: 'Ember Trail',
  26: 'Splitter',
  27: 'Convergence',
  28: 'Firewall',
  29: 'Tidal Wave',
  30: 'Lock and Key',
  31: 'Inferno Path',
  32: 'Arctic Drift',
  33: 'Final Frontier',
};

// ── Parsing ─────────────────────────────────────────────────────────────────

function parseBloxorzLevel(filePath: string, bloxorzNum: number): LevelData | null {
  const raw = fs.readFileSync(filePath, 'utf-8');
  const map: TiledMap = JSON.parse(raw);

  // Index layers by name
  const layersByName: Record<string, TiledLayer> = {};
  for (const layer of map.layers) {
    if (layer.type === 'objectgroup') {
      layersByName[layer.name] = layer;
    }
  }

  // Collect all tile objects across relevant layers
  const normalObjs = layersByName['normal']?.objects ?? [];
  const bridgeObjs = layersByName['bridge']?.objects ?? [];
  const goalObjs = layersByName['goal']?.objects ?? [];
  const buttonObjs = layersByName['button']?.objects ?? [];
  const weakObjs = layersByName['weak']?.objects ?? [];
  const splitterObjs = layersByName['splitter']?.objects ?? [];

  // Build an ID-to-object map for start position lookup
  const allObjects: TiledObject[] = [
    ...normalObjs, ...bridgeObjs, ...goalObjs,
    ...buttonObjs, ...weakObjs, ...splitterObjs,
  ];
  const objectById = new Map<number, TiledObject>();
  for (const obj of allObjects) {
    objectById.set(obj.id, obj);
  }

  // Determine pixel bounds across all tile objects (not border)
  let minPx = Infinity, minPy = Infinity;
  let maxPx = -Infinity, maxPy = -Infinity;

  for (const obj of allObjects) {
    const px = obj.x;
    const py = obj.y;
    if (px < minPx) minPx = px;
    if (py < minPy) minPy = py;
    if (px + 50 > maxPx) maxPx = px + 50;
    if (py + 50 > maxPy) maxPy = py + 50;
  }

  if (!isFinite(minPx)) {
    console.warn(`  [bloxorz${bloxorzNum}] No tile objects found, skipping.`);
    return null;
  }

  // Normalize: grid coords = (pixelX - minPx) / 50, (pixelY - minPy) / 50
  const gridWidth = Math.round((maxPx - minPx) / 50);
  const gridHeight = Math.round((maxPy - minPy) / 50);

  function toGrid(px: number, py: number): { gx: number; gy: number } {
    const gx = Math.round((px - minPx) / 50);
    // Tiled Y goes down, our Y goes up. Flip vertically.
    const tiledRow = Math.round((py - minPy) / 50);
    const gy = gridHeight - 1 - tiledRow;
    return { gx, gy };
  }

  // Initialize tiles as Empty
  const tiles: TileType[][] = [];
  for (let y = 0; y < gridHeight; y++) {
    tiles.push(new Array(gridWidth).fill(TileType.Empty));
  }

  // Helper: safely set a tile
  function setTile(gx: number, gy: number, type: TileType): void {
    if (gy >= 0 && gy < gridHeight && gx >= 0 && gx < gridWidth) {
      tiles[gy][gx] = type;
    }
  }

  // Place normal tiles
  for (const obj of normalObjs) {
    const { gx, gy } = toGrid(obj.x, obj.y);
    setTile(gx, gy, TileType.Stone);
  }

  // Place weak tiles
  for (const obj of weakObjs) {
    const { gx, gy } = toGrid(obj.x, obj.y);
    setTile(gx, gy, TileType.Fragile);
  }

  // Place splitter tiles as Stone (we don't implement splitting)
  for (const obj of splitterObjs) {
    const { gx, gy } = toGrid(obj.x, obj.y);
    setTile(gx, gy, TileType.Stone);
  }

  // Place bridge tiles - ALL bridges activated as Stone for co-op.
  // Bridge-based switching was designed for single-player and creates
  // disconnected islands that break co-op traversal.
  // Instead, we "open all bridges" and make the map fully traversable.
  for (const obj of bridgeObjs) {
    const { gx, gy } = toGrid(obj.x, obj.y);
    setTile(gx, gy, TileType.Stone);
  }

  // Place button tiles as Stone (we'll selectively convert some to switches below)
  for (const obj of buttonObjs) {
    const { gx, gy } = toGrid(obj.x, obj.y);
    setTile(gx, gy, TileType.Stone);
  }

  // Place goal tile
  let goalPos: { x: number; y: number } | null = null;
  for (const obj of goalObjs) {
    const { gx, gy } = toGrid(obj.x, obj.y);
    setTile(gx, gy, TileType.Stone); // Will convert to ExitFire below
    goalPos = { x: gx, y: gy };
  }

  // Determine start position
  let startPos: { x: number; y: number };
  const centerObjId = map.properties?.['center'];
  if (centerObjId != null && objectById.has(Number(centerObjId))) {
    const startObj = objectById.get(Number(centerObjId))!;
    const { gx, gy } = toGrid(startObj.x, startObj.y);
    startPos = { x: gx, y: gy };
  } else {
    // Default: use the first normal tile object
    if (normalObjs.length > 0) {
      const { gx, gy } = toGrid(normalObjs[0].x, normalObjs[0].y);
      startPos = { x: gx, y: gy };
    } else {
      startPos = { x: 0, y: 0 };
    }
  }

  // ── Co-op adaptation ──────────────────────────────────────────────────

  const levelId = bloxorzNum + 1; // bloxorz1 -> level 2, etc.

  // Determine difficulty tier
  let hazardDensity: number;
  if (levelId <= 11) {
    hazardDensity = 0.075; // 7.5% — easy tier
  } else if (levelId <= 21) {
    hazardDensity = 0.125; // 12.5% — medium tier
  } else {
    hazardDensity = 0.175; // 17.5% — hard tier
  }

  const manhattan = (a: { x: number; y: number }, b: { x: number; y: number }) =>
    Math.abs(a.x - b.x) + Math.abs(a.y - b.y);

  // Compute reachability from start position with all bridges open.
  // If the start is on a Fragile tile (can't stand), or reachability is poor,
  // we find the best Stone tile to start from.
  let fireStart = { x: startPos.x, y: startPos.y };

  // Ensure fireStart is on a Stone tile (not Fragile, not Empty)
  if (tiles[fireStart.y]?.[fireStart.x] !== TileType.Stone) {
    // Find the nearest Stone tile
    let bestDist = Infinity;
    for (let y = 0; y < gridHeight; y++) {
      for (let x = 0; x < gridWidth; x++) {
        if (tiles[y][x] === TileType.Stone) {
          const d = manhattan({ x, y }, startPos);
          if (d < bestDist) {
            bestDist = d;
            fireStart = { x, y };
          }
        }
      }
    }
  }

  let reachableFromFire = computeStandingReachable(tiles, fireStart, gridWidth, gridHeight);

  // If reachability is poor, try other Stone tiles to find the largest component
  if (reachableFromFire.size < 4) {
    let bestSet = reachableFromFire;
    let bestStart = fireStart;
    for (let y = 0; y < gridHeight; y++) {
      for (let x = 0; x < gridWidth; x++) {
        if (tiles[y][x] === TileType.Stone) {
          const r = computeStandingReachable(tiles, { x, y }, gridWidth, gridHeight);
          if (r.size > bestSet.size) {
            bestSet = r;
            bestStart = { x, y };
          }
        }
      }
    }
    fireStart = bestStart;
    reachableFromFire = bestSet;
    if (reachableFromFire.size < 4) {
      console.warn(`  Largest connected component has only ${reachableFromFire.size} standing positions`);
    }
  }

  // Collect all reachable standing positions (these are Stone/non-Fragile tiles)
  const reachableStones: Array<{ x: number; y: number }> = [];
  for (const posStr of reachableFromFire) {
    const [x, y] = posStr.split(',').map(Number);
    reachableStones.push({ x, y });
  }

  // WaterStart = reachable tile with maximum Manhattan distance from FireStart
  let waterStart = reachableStones[0] ?? { x: 0, y: 0 };
  let maxDist = -1;
  for (const t of reachableStones) {
    if (t.x === fireStart.x && t.y === fireStart.y) continue;
    const d = manhattan(t, fireStart);
    if (d > maxDist) {
      maxDist = d;
      waterStart = { x: t.x, y: t.y };
    }
  }

  // ExitFire: use original goal if reachable, otherwise pick farthest reachable tile
  if (goalPos && reachableFromFire.has(`${goalPos.x},${goalPos.y}`)) {
    // Keep goal position
  } else {
    // Pick a reachable tile far from fireStart that isn't waterStart
    let bestDist = -1;
    let bestPos = fireStart;
    for (const t of reachableStones) {
      if (t.x === waterStart.x && t.y === waterStart.y) continue;
      if (t.x === fireStart.x && t.y === fireStart.y) continue;
      const d = manhattan(t, fireStart);
      if (d > bestDist) {
        bestDist = d;
        bestPos = t;
      }
    }
    goalPos = bestPos;
  }
  tiles[goalPos!.y][goalPos!.x] = TileType.ExitFire;

  // ExitWater: reachable tile maximizing (distance from ExitFire + distance from WaterStart),
  // not adjacent to ExitFire, not on other critical positions
  let exitWaterPos: { x: number; y: number } | null = null;
  let bestExitWaterScore = -1;

  for (const t of reachableStones) {
    if (t.x === fireStart.x && t.y === fireStart.y) continue;
    if (t.x === waterStart.x && t.y === waterStart.y) continue;
    if (t.x === goalPos!.x && t.y === goalPos!.y) continue;
    // Not adjacent to ExitFire
    if (manhattan(t, goalPos!) <= 1) continue;
    const score = manhattan(t, goalPos!) + manhattan(t, waterStart);
    if (score > bestExitWaterScore) {
      bestExitWaterScore = score;
      exitWaterPos = { x: t.x, y: t.y };
    }
  }

  // Fallback: if no valid position found, relax adjacency constraint
  if (!exitWaterPos) {
    for (const t of reachableStones) {
      if (t.x === fireStart.x && t.y === fireStart.y) continue;
      if (t.x === waterStart.x && t.y === waterStart.y) continue;
      if (t.x === goalPos!.x && t.y === goalPos!.y) continue;
      const score = manhattan(t, goalPos!) + manhattan(t, waterStart);
      if (score > bestExitWaterScore) {
        bestExitWaterScore = score;
        exitWaterPos = { x: t.x, y: t.y };
      }
    }
  }

  // Last resort fallback
  if (!exitWaterPos) {
    exitWaterPos = { x: waterStart.x, y: waterStart.y };
    // Swap water start to fire start
    waterStart = { x: fireStart.x, y: fireStart.y };
  }

  tiles[exitWaterPos.y][exitWaterPos.x] = TileType.ExitWater;

  // ── Switch effects (no bridge-based switches) ─────────────────────────
  // We drop all original bridge/button mechanics for co-op since they were
  // designed for single-player. The map is already fully traversable with
  // all bridges open. switchEffects remains empty.
  const switchEffects: Record<string, SwitchEffect> = {};

  // ── Critical positions ────────────────────────────────────────────────
  const criticalSet = new Set<string>();
  criticalSet.add(`${fireStart.x},${fireStart.y}`);
  criticalSet.add(`${waterStart.x},${waterStart.y}`);
  criticalSet.add(`${goalPos!.x},${goalPos!.y}`);
  criticalSet.add(`${exitWaterPos.x},${exitWaterPos.y}`);

  // ── Hazards ───────────────────────────────────────────────────────────
  const rng = mulberry32(levelId);
  const hazardCandidates = reachableStones.filter(t =>
    !criticalSet.has(`${t.x},${t.y}`) &&
    tiles[t.y][t.x] === TileType.Stone
  );

  // Shuffle candidates
  for (let i = hazardCandidates.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [hazardCandidates[i], hazardCandidates[j]] = [hazardCandidates[j], hazardCandidates[i]];
  }

  const hazardCount = Math.floor(hazardCandidates.length * hazardDensity);
  const hazardPositions: Array<{ x: number; y: number; type: TileType }> = [];
  for (let i = 0; i < hazardCount && i < hazardCandidates.length; i++) {
    const t = hazardCandidates[i];
    if (tiles[t.y][t.x] !== TileType.Stone) continue;
    const hazardType = i % 2 === 0 ? TileType.Lava : TileType.Water;
    tiles[t.y][t.x] = hazardType;
    hazardPositions.push({ x: t.x, y: t.y, type: hazardType });
  }

  // Build the level
  const levelData: LevelData = {
    id: levelId,
    name: LEVEL_NAMES[bloxorzNum] ?? `Level ${levelId}`,
    width: gridWidth,
    height: gridHeight,
    tiles,
    switchEffects,
    fireStart: { position: fireStart, orientation: BlockOrientation.Standing },
    waterStart: { position: waterStart, orientation: BlockOrientation.Standing },
  };

  return levelData;
}

// ── Generate TypeScript source for a level ──────────────────────────────────

function tileTypeToCode(t: TileType): string {
  switch (t) {
    case TileType.Empty: return '_';
    case TileType.Stone: return 'S';
    case TileType.Lava: return 'L';
    case TileType.Water: return 'W';
    case TileType.Toxic: return 'T';
    case TileType.Fragile: return 'F';
    case TileType.SwitchFire: return 'SF';
    case TileType.SwitchWater: return 'SW';
    case TileType.ExitFire: return 'EF';
    case TileType.ExitWater: return 'EW';
    default: return '_';
  }
}

function tileTypeName(t: TileType): string {
  switch (t) {
    case TileType.Empty: return 'Empty';
    case TileType.Stone: return 'Stone';
    case TileType.Lava: return 'Lava';
    case TileType.Water: return 'Water';
    case TileType.Toxic: return 'Toxic';
    case TileType.Fragile: return 'Fragile';
    case TileType.SwitchFire: return 'SwitchFire';
    case TileType.SwitchWater: return 'SwitchWater';
    case TileType.ExitFire: return 'ExitFire';
    case TileType.ExitWater: return 'ExitWater';
    default: return 'Empty';
  }
}

function generateLevelSource(level: LevelData): string {
  // Determine which tile type aliases are needed
  const usedTypes = new Set<TileType>();
  for (const row of level.tiles) {
    for (const t of row) {
      usedTypes.add(t);
    }
  }

  for (const effect of Object.values(level.switchEffects)) {
    usedTypes.add(effect.fromType);
    usedTypes.add(effect.toType);
  }

  const allAliases: Array<{ alias: string; type: TileType; enumName: string }> = [
    { alias: '_', type: TileType.Empty, enumName: 'Empty' },
    { alias: 'S', type: TileType.Stone, enumName: 'Stone' },
    { alias: 'L', type: TileType.Lava, enumName: 'Lava' },
    { alias: 'W', type: TileType.Water, enumName: 'Water' },
    { alias: 'T', type: TileType.Toxic, enumName: 'Toxic' },
    { alias: 'F', type: TileType.Fragile, enumName: 'Fragile' },
    { alias: 'SF', type: TileType.SwitchFire, enumName: 'SwitchFire' },
    { alias: 'SW', type: TileType.SwitchWater, enumName: 'SwitchWater' },
    { alias: 'EF', type: TileType.ExitFire, enumName: 'ExitFire' },
    { alias: 'EW', type: TileType.ExitWater, enumName: 'ExitWater' },
  ];

  const aliasLines: string[] = [];
  for (const entry of allAliases) {
    if (usedTypes.has(entry.type)) {
      aliasLines.push(`const ${entry.alias} = TileType.${entry.enumName};`);
    }
  }

  // Generate tiles array
  const tileRows: string[] = [];
  for (let y = 0; y < level.height; y++) {
    const cells = level.tiles[y].map(t => tileTypeToCode(t));
    const maxLen = Math.max(...cells.map(c => c.length));
    const padded = cells.map(c => c.padStart(maxLen));
    tileRows.push(`    /* y=${String(y).padStart(2)} */ [${padded.join(', ')}],`);
  }

  // Generate switchEffects
  let switchEffectsStr = '{}';
  const switchKeys = Object.keys(level.switchEffects);
  if (switchKeys.length > 0) {
    const entries: string[] = [];
    for (const key of switchKeys) {
      const effect = level.switchEffects[key];
      const targetsStr = effect.targets
        .map(t => `{ x: ${t.x}, y: ${t.y} }`)
        .join(', ');
      entries.push(
        `    '${key}': {\n` +
        `      targets: [${targetsStr}],\n` +
        `      fromType: TileType.${tileTypeName(effect.fromType)},\n` +
        `      toType: TileType.${tileTypeName(effect.toType)},\n` +
        `      toggle: ${effect.toggle},\n` +
        `    },`
      );
    }
    switchEffectsStr = `{\n${entries.join('\n')}\n  }`;
  }

  const nn = String(level.id).padStart(2, '0');
  const varName = `level${nn}`;

  return `import { BlockOrientation, LevelData, TileType } from '../types.js';

${aliasLines.join('\n')}

export const ${varName}: LevelData = {
  id: ${level.id},
  name: '${level.name.replace(/'/g, "\\'")}',
  width: ${level.width},
  height: ${level.height},
  tiles: [
${tileRows.join('\n')}
  ],
  switchEffects: ${switchEffectsStr},
  fireStart: { position: { x: ${level.fireStart.position.x}, y: ${level.fireStart.position.y} }, orientation: BlockOrientation.Standing },
  waterStart: { position: { x: ${level.waterStart.position.x}, y: ${level.waterStart.position.y} }, orientation: BlockOrientation.Standing },
};
`;
}

// ── Generate index file ─────────────────────────────────────────────────────

function generateIndexSource(levelCount: number): string {
  const imports: string[] = [];
  const entries: string[] = [];
  for (let i = 1; i <= levelCount; i++) {
    const nn = String(i).padStart(2, '0');
    imports.push(`import { level${nn} } from './level-${nn}.js';`);
    entries.push(`  level${nn},`);
  }

  return `import { LevelData } from '../types.js';
${imports.join('\n')}

const levels: LevelData[] = [
${entries.join('\n')}
];

export function getLevel(id: number): LevelData | undefined {
  return levels.find((l) => l.id === id);
}

export function getAllLevels(): LevelData[] {
  return levels;
}
`;
}

// ── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log('=== Bloxorz Level Converter ===\n');

  const results: Array<{
    levelId: number;
    name: string;
    solvable: boolean;
    moveCount: number;
    hazards: number;
    retriedWithoutHazards: boolean;
  }> = [];

  for (let bloxorzNum = 1; bloxorzNum <= 33; bloxorzNum++) {
    const filePath = path.join(MAPS_DIR, `bloxorz${bloxorzNum}.json`);
    const levelId = bloxorzNum + 1;
    const nn = String(levelId).padStart(2, '0');

    console.log(`Processing bloxorz${bloxorzNum}.json -> level-${nn}.ts ...`);

    if (!fs.existsSync(filePath)) {
      console.warn(`  File not found: ${filePath}`);
      continue;
    }

    let levelData = parseBloxorzLevel(filePath, bloxorzNum);
    if (!levelData) continue;

    // Run solver
    let solverResult = solveLevelCoOp(levelData);
    let retriedWithoutHazards = false;

    if (!solverResult.solvable) {
      console.log(`  Not solvable with hazards. Removing hazards and retrying...`);
      // Remove all hazards (set back to Stone)
      for (let y = 0; y < levelData.height; y++) {
        for (let x = 0; x < levelData.width; x++) {
          if (levelData.tiles[y][x] === TileType.Lava || levelData.tiles[y][x] === TileType.Water) {
            levelData.tiles[y][x] = TileType.Stone;
          }
        }
      }
      solverResult = solveLevelCoOp(levelData);
      retriedWithoutHazards = true;

      if (!solverResult.solvable) {
        console.warn(`  WARNING: Level ${levelId} is NOT solvable even without hazards!`);
      }
    }

    if (solverResult.solvable) {
      console.log(`  Solvable in ${solverResult.moveCount} moves${retriedWithoutHazards ? ' (no hazards)' : ''}`);
    }

    // Count hazard tiles
    let hazardCount = 0;
    for (const row of levelData.tiles) {
      for (const t of row) {
        if (t === TileType.Lava || t === TileType.Water) hazardCount++;
      }
    }

    results.push({
      levelId,
      name: levelData.name,
      solvable: solverResult.solvable,
      moveCount: solverResult.moveCount,
      hazards: hazardCount,
      retriedWithoutHazards,
    });

    // Write level file
    const source = generateLevelSource(levelData);
    const outPath = path.join(LEVELS_DIR, `level-${nn}.ts`);
    fs.writeFileSync(outPath, source, 'utf-8');
    console.log(`  Written: level-${nn}.ts`);
  }

  // Update index.ts
  const indexSource = generateIndexSource(34);
  fs.writeFileSync(path.join(LEVELS_DIR, 'index.ts'), indexSource, 'utf-8');
  console.log(`\nUpdated index.ts (34 levels)`);

  // Print solvability report
  console.log('\n=== Solvability Report ===\n');
  console.log('Level | Name                  | Solvable | Moves | Hazards | Notes');
  console.log('------|-----------------------|----------|-------|---------|------');
  for (const r of results) {
    const nn = String(r.levelId).padStart(2, '0');
    const name = r.name.padEnd(21);
    const solvable = r.solvable ? 'YES' : 'NO ';
    const moves = String(r.moveCount).padStart(5);
    const hazards = String(r.hazards).padStart(7);
    const notes = r.retriedWithoutHazards
      ? (r.solvable ? 'hazards removed' : 'UNSOLVABLE')
      : '';
    console.log(`  ${nn}  | ${name} | ${solvable}      | ${moves} | ${hazards} | ${notes}`);
  }

  const solvableCount = results.filter(r => r.solvable).length;
  console.log(`\nTotal solvable: ${solvableCount}/${results.length}`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
