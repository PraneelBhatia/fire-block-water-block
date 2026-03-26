import { BlockOrientation, BlockState, Element, SwitchEffect, TileType } from './types.js';
import { getFootprint } from './block.js';

/**
 * Returns true if the block dies given the tiles under its footprint.
 */
export function checkHazard(block: BlockState, footprintTiles: TileType[]): boolean {
  for (const tile of footprintTiles) {
    if (tile === TileType.Toxic) return true;

    if (tile === TileType.Lava) {
      if (block.element === Element.Water) return true;
      // Fire on Lava is safe
    }

    if (tile === TileType.Water) {
      if (block.element === Element.Fire) return true;
      // Water on Water is safe
    }

    if (tile === TileType.Fragile) {
      if (block.orientation === BlockOrientation.Standing) return true;
      // Lying orientations are safe on fragile
    }
  }
  return false;
}

/**
 * Returns the tile types under each footprint cell of the block.
 */
export function getFootprintTiles(block: BlockState, tiles: TileType[][]): TileType[] {
  return getFootprint(block).map(({ x, y }) => tiles[y][x]);
}

/**
 * Returns a new tile grid after applying a switch effect (immutable).
 */
export function activateSwitch(tiles: TileType[][], effect: SwitchEffect): TileType[][] {
  // Deep-copy the grid
  const newTiles = tiles.map((row) => [...row]);

  for (const { x, y } of effect.targets) {
    const current = newTiles[y][x];
    if (effect.toggle && current === effect.toType) {
      newTiles[y][x] = effect.fromType;
    } else {
      newTiles[y][x] = effect.toType;
    }
  }

  return newTiles;
}

/**
 * Returns true if the two blocks' footprints overlap (collision).
 */
export function checkCollision(a: BlockState, b: BlockState): boolean {
  if (!a.alive || !b.alive) return false;
  const fpA = getFootprint(a);
  const fpB = getFootprint(b);
  for (const cellA of fpA) {
    for (const cellB of fpB) {
      if (cellA.x === cellB.x && cellA.y === cellB.y) return true;
    }
  }
  return false;
}

/**
 * Returns true when both blocks are Standing on their matching exit tiles.
 */
export function checkWinCondition(
  fireBlock: BlockState,
  waterBlock: BlockState,
  tiles: TileType[][],
): boolean {
  if (!fireBlock.alive || !waterBlock.alive) return false;
  if (fireBlock.orientation !== BlockOrientation.Standing) return false;
  if (waterBlock.orientation !== BlockOrientation.Standing) return false;

  const fireTile = tiles[fireBlock.position.y][fireBlock.position.x];
  const waterTile = tiles[waterBlock.position.y][waterBlock.position.x];

  return fireTile === TileType.ExitFire && waterTile === TileType.ExitWater;
}
