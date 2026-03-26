import { Element, BlockOrientation, TileType } from '@fbwb/shared';
import { GameRenderer } from './renderer/scene.js';
import { GridMesh } from './entities/gridMesh.js';
import { BlockMesh } from './entities/blockMesh.js';
import { setupInput } from './input.js';
import { NetworkClient, GameState } from './network.js';

// --- Renderer ---
const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
const renderer = new GameRenderer(canvas);

// --- Entities ---
const gridMesh = new GridMesh(renderer);
const fireBlock = new BlockMesh(renderer, Element.Fire);
const waterBlock = new BlockMesh(renderer, Element.Water);
fireBlock.setVisible(false);
waterBlock.setVisible(false);

// --- Network ---
const network = new NetworkClient();

// --- Lobby UI ---
const lobbyDiv = document.getElementById('lobby')!;
const hudDiv = document.getElementById('hud')!;
const levelCompleteDiv = document.getElementById('level-complete')!;

function buildLobbyUI() {
  // Container styling
  const container = document.createElement('div');
  container.style.cssText =
    'display:flex;flex-direction:column;align-items:center;justify-content:center;' +
    'height:100%;gap:16px;font-family:system-ui,sans-serif;';

  // Title
  const title = document.createElement('h1');
  title.textContent = 'Fire Block & Water Block';
  title.style.cssText = 'color:#ff6b35;font-size:2.5rem;text-shadow:0 0 20px rgba(255,107,53,0.5);';
  container.appendChild(title);

  // Subtitle
  const subtitle = document.createElement('p');
  subtitle.textContent = 'A cooperative puzzle game for two players';
  subtitle.style.cssText = 'color:#aaa;font-size:1.1rem;margin-bottom:16px;';
  container.appendChild(subtitle);

  // Room code display (hidden initially)
  const roomCodeDisplay = document.createElement('div');
  roomCodeDisplay.id = 'room-code-display';
  roomCodeDisplay.style.cssText =
    'display:none;background:#222;padding:16px 32px;border-radius:8px;' +
    'border:2px solid #ff6b35;text-align:center;';
  container.appendChild(roomCodeDisplay);

  // Create Room button
  const createBtn = document.createElement('button');
  createBtn.textContent = 'Create Room';
  createBtn.style.cssText = buttonStyle('#ff6b35');
  createBtn.addEventListener('click', async () => {
    createBtn.disabled = true;
    createBtn.textContent = 'Creating...';
    try {
      const code = await network.createRoom();
      roomCodeDisplay.style.display = 'block';

      // Clear and rebuild room code display with DOM methods
      while (roomCodeDisplay.firstChild) {
        roomCodeDisplay.removeChild(roomCodeDisplay.firstChild);
      }
      const label = document.createElement('div');
      label.textContent = 'Room Code:';
      label.style.cssText = 'color:#aaa;font-size:0.9rem;margin-bottom:4px;';
      roomCodeDisplay.appendChild(label);

      const codeEl = document.createElement('div');
      codeEl.textContent = code;
      codeEl.style.cssText = 'color:#ff6b35;font-size:2rem;font-weight:bold;letter-spacing:4px;';
      roomCodeDisplay.appendChild(codeEl);

      const waitMsg = document.createElement('div');
      waitMsg.textContent = 'Waiting for player 2...';
      waitMsg.style.cssText = 'color:#aaa;font-size:0.85rem;margin-top:8px;';
      roomCodeDisplay.appendChild(waitMsg);

      createBtn.textContent = 'Room Created';
    } catch (err) {
      createBtn.disabled = false;
      createBtn.textContent = 'Create Room';
      console.error('Failed to create room:', err);
    }
  });
  container.appendChild(createBtn);

  // Divider
  const divider = document.createElement('div');
  divider.style.cssText =
    'display:flex;align-items:center;gap:12px;width:260px;margin:4px 0;';
  const line1 = document.createElement('hr');
  line1.style.cssText = 'flex:1;border:none;border-top:1px solid #444;';
  const orText = document.createElement('span');
  orText.textContent = 'or';
  orText.style.cssText = 'color:#666;font-size:0.9rem;';
  const line2 = document.createElement('hr');
  line2.style.cssText = 'flex:1;border:none;border-top:1px solid #444;';
  divider.appendChild(line1);
  divider.appendChild(orText);
  divider.appendChild(line2);
  container.appendChild(divider);

  // Join by code
  const joinRow = document.createElement('div');
  joinRow.style.cssText = 'display:flex;gap:8px;align-items:center;';

  const codeInput = document.createElement('input');
  codeInput.type = 'text';
  codeInput.placeholder = 'Enter room code';
  codeInput.style.cssText =
    'padding:10px 14px;border-radius:6px;border:2px solid #444;background:#222;' +
    'color:#eee;font-size:1rem;text-transform:uppercase;width:180px;outline:none;';
  codeInput.addEventListener('focus', () => {
    codeInput.style.borderColor = '#4fc3f7';
  });
  codeInput.addEventListener('blur', () => {
    codeInput.style.borderColor = '#444';
  });
  joinRow.appendChild(codeInput);

  const joinBtn = document.createElement('button');
  joinBtn.textContent = 'Join';
  joinBtn.style.cssText = buttonStyle('#4fc3f7');
  joinRow.appendChild(joinBtn);
  container.appendChild(joinRow);

  // Error display
  const errorMsg = document.createElement('div');
  errorMsg.style.cssText = 'color:#ff4444;font-size:0.9rem;min-height:1.2em;';
  container.appendChild(errorMsg);

  joinBtn.addEventListener('click', async () => {
    const code = codeInput.value.trim();
    if (!code) return;
    joinBtn.disabled = true;
    joinBtn.textContent = 'Joining...';
    errorMsg.textContent = '';
    try {
      await network.joinByCode(code);
    } catch (err) {
      errorMsg.textContent = 'Room not found. Check the code and try again.';
      joinBtn.disabled = false;
      joinBtn.textContent = 'Join';
    }
  });

  // Allow Enter key to join
  codeInput.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      joinBtn.click();
    }
  });

  lobbyDiv.appendChild(container);
}

function buttonStyle(color: string): string {
  return (
    `padding:10px 24px;border-radius:6px;border:2px solid ${color};` +
    `background:transparent;color:${color};font-size:1rem;font-weight:bold;` +
    `cursor:pointer;transition:all 0.2s;`
  );
}

// --- HUD ---
let hudMoveCounter: HTMLElement;
let hudRoomCode: HTMLElement;

function buildHUD() {
  hudDiv.style.cssText = 'position:absolute;top:16px;left:16px;display:flex;flex-direction:column;gap:8px;';

  // Room code
  hudRoomCode = document.createElement('div');
  hudRoomCode.style.cssText =
    'background:rgba(0,0,0,0.6);padding:8px 14px;border-radius:6px;' +
    'color:#aaa;font-size:0.85rem;';
  hudDiv.appendChild(hudRoomCode);

  // Move counter
  hudMoveCounter = document.createElement('div');
  hudMoveCounter.style.cssText =
    'background:rgba(0,0,0,0.6);padding:8px 14px;border-radius:6px;' +
    'color:#eee;font-size:1rem;';
  hudDiv.appendChild(hudMoveCounter);

  // Level select button
  const levelSelectBtn = document.createElement('button');
  levelSelectBtn.textContent = 'Levels';
  levelSelectBtn.style.cssText =
    'background:rgba(0,0,0,0.6);padding:8px 14px;border-radius:6px;' +
    'color:#ff6b35;font-size:0.9rem;border:1px solid #ff6b35;cursor:pointer;' +
    'font-family:system-ui,sans-serif;';
  levelSelectBtn.addEventListener('click', () => {
    showLevelSelect();
  });
  hudDiv.appendChild(levelSelectBtn);
}

function buildLevelComplete() {
  levelCompleteDiv.style.cssText =
    'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);' +
    'text-align:center;display:none;';

  const heading = document.createElement('h2');
  heading.textContent = 'LEVEL COMPLETE!';
  heading.style.cssText =
    'color:#4caf50;font-size:3rem;text-shadow:0 0 30px rgba(76,175,80,0.5);margin-bottom:16px;';
  levelCompleteDiv.appendChild(heading);

  const btnRow = document.createElement('div');
  btnRow.style.cssText = 'display:flex;gap:12px;justify-content:center;margin-bottom:16px;';

  const restartBtn = document.createElement('button');
  restartBtn.textContent = 'Play Again';
  restartBtn.style.cssText = buttonStyle('#4caf50');
  restartBtn.addEventListener('click', () => {
    network.sendRestart();
  });
  btnRow.appendChild(restartBtn);

  const nextLevelBtn = document.createElement('button');
  nextLevelBtn.textContent = 'Next Level';
  nextLevelBtn.style.cssText = buttonStyle('#ff6b35');
  nextLevelBtn.addEventListener('click', () => {
    const nextId = currentLevelId + 1;
    if (nextId <= 10) {
      network.sendSelectLevel(nextId);
    }
  });
  btnRow.appendChild(nextLevelBtn);

  levelCompleteDiv.appendChild(btnRow);

  const selectBtn = document.createElement('button');
  selectBtn.textContent = 'Level Select';
  selectBtn.style.cssText = buttonStyle('#aaa');
  selectBtn.addEventListener('click', () => {
    showLevelSelect();
  });
  levelCompleteDiv.appendChild(selectBtn);
}

// --- Level Select UI ---
let levelSelectDiv: HTMLDivElement | null = null;

function showLevelSelect() {
  if (levelSelectDiv) {
    levelSelectDiv.style.display = 'flex';
    return;
  }

  levelSelectDiv = document.createElement('div');
  levelSelectDiv.style.cssText =
    'position:absolute;top:0;left:0;width:100%;height:100%;' +
    'display:flex;align-items:center;justify-content:center;' +
    'background:rgba(0,0,0,0.85);z-index:100;';

  const panel = document.createElement('div');
  panel.style.cssText =
    'background:#1a1a2e;border:2px solid #444;border-radius:12px;' +
    'padding:32px;text-align:center;';

  const title = document.createElement('h2');
  title.textContent = 'Select Level';
  title.style.cssText = 'color:#eee;font-size:1.8rem;margin-bottom:20px;font-family:system-ui,sans-serif;';
  panel.appendChild(title);

  const grid = document.createElement('div');
  grid.style.cssText =
    'display:grid;grid-template-columns:repeat(5,1fr);gap:10px;margin-bottom:20px;';

  for (let i = 1; i <= 10; i++) {
    const btn = document.createElement('button');
    btn.textContent = String(i);
    btn.style.cssText =
      'width:56px;height:56px;border-radius:8px;border:2px solid #ff6b35;' +
      'background:transparent;color:#ff6b35;font-size:1.3rem;font-weight:bold;' +
      'cursor:pointer;font-family:system-ui,sans-serif;transition:all 0.2s;';
    btn.addEventListener('mouseenter', () => {
      btn.style.background = '#ff6b35';
      btn.style.color = '#fff';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.background = 'transparent';
      btn.style.color = '#ff6b35';
    });
    btn.addEventListener('click', () => {
      network.sendSelectLevel(i);
      hideLevelSelect();
    });
    grid.appendChild(btn);
  }
  panel.appendChild(grid);

  const closeBtn = document.createElement('button');
  closeBtn.textContent = 'Close';
  closeBtn.style.cssText = buttonStyle('#aaa');
  closeBtn.addEventListener('click', () => {
    hideLevelSelect();
  });
  panel.appendChild(closeBtn);

  levelSelectDiv.appendChild(panel);
  document.body.appendChild(levelSelectDiv);
}

function hideLevelSelect() {
  if (levelSelectDiv) {
    levelSelectDiv.style.display = 'none';
  }
}

// --- State sync ---
let currentPhase = 'waiting';
let currentLevelId = 1;

// Track the last server-authoritative pose for each block so we can
// detect changes and feed them into the rolling animation.
interface TrackedPose {
  x: number;
  y: number;
  orientation: BlockOrientation;
}
let lastFirePose: TrackedPose | null = null;
let lastWaterPose: TrackedPose | null = null;

network.onStateChange = (state: GameState) => {
  // Phase transitions
  if (state.phase !== currentPhase) {
    currentPhase = state.phase;

    if (currentPhase === 'playing' || currentPhase === 'completed') {
      lobbyDiv.style.display = 'none';
      hudDiv.style.display = 'flex';
    }

    if (currentPhase === 'completed') {
      levelCompleteDiv.style.display = 'block';
    } else {
      levelCompleteDiv.style.display = 'none';
    }
  }

  // Update grid from tiles JSON
  if (state.tilesJson) {
    try {
      const tiles: TileType[][] = JSON.parse(state.tilesJson);
      gridMesh.updateTiles(tiles);
    } catch {
      // Ignore JSON parse errors
    }
  }

  // Update fire block
  if (state.fireBlock) {
    fireBlock.setVisible(state.fireBlock.alive);
    const newFireOri = state.fireBlock.orientation as BlockOrientation;
    const newFireX = state.fireBlock.position.x;
    const newFireY = state.fireBlock.position.y;

    if (lastFirePose === null) {
      // First time — snap without animation
      fireBlock.setPositionImmediate({ x: newFireX, y: newFireY }, newFireOri);
    } else if (
      newFireX !== lastFirePose.x ||
      newFireY !== lastFirePose.y ||
      newFireOri !== lastFirePose.orientation
    ) {
      // Position or orientation changed — animate the roll
      const now = performance.now() / 1000;
      fireBlock.animateRoll(
        { x: lastFirePose.x, y: lastFirePose.y },
        lastFirePose.orientation,
        { x: newFireX, y: newFireY },
        newFireOri,
        now,
      );
    }

    lastFirePose = { x: newFireX, y: newFireY, orientation: newFireOri };
  }

  // Update water block
  if (state.waterBlock) {
    waterBlock.setVisible(state.waterBlock.alive);
    const newWaterOri = state.waterBlock.orientation as BlockOrientation;
    const newWaterX = state.waterBlock.position.x;
    const newWaterY = state.waterBlock.position.y;

    if (lastWaterPose === null) {
      // First time — snap without animation
      waterBlock.setPositionImmediate({ x: newWaterX, y: newWaterY }, newWaterOri);
    } else if (
      newWaterX !== lastWaterPose.x ||
      newWaterY !== lastWaterPose.y ||
      newWaterOri !== lastWaterPose.orientation
    ) {
      // Position or orientation changed — animate the roll
      const now = performance.now() / 1000;
      waterBlock.animateRoll(
        { x: lastWaterPose.x, y: lastWaterPose.y },
        lastWaterPose.orientation,
        { x: newWaterX, y: newWaterY },
        newWaterOri,
        now,
      );
    }

    lastWaterPose = { x: newWaterX, y: newWaterY, orientation: newWaterOri };
  }

  // Track current level; reset poses on level change so the new start
  // position snaps rather than animating from the old level's position.
  if (state.levelId && state.levelId !== currentLevelId) {
    currentLevelId = state.levelId;
    lastFirePose = null;
    lastWaterPose = null;
  } else if (state.levelId) {
    currentLevelId = state.levelId;
  }

  // Hide level select when a new level starts playing
  if (state.phase === 'playing') {
    hideLevelSelect();
  }

  // Update HUD
  if (hudMoveCounter) {
    hudMoveCounter.textContent = 'Moves: ' + state.moveCount;
  }
  if (hudRoomCode && state.roomCode) {
    hudRoomCode.textContent = 'Room: ' + state.roomCode;
  }
};

// --- Input ---
setupInput((direction) => {
  network.sendMove(direction);
});

// --- Build UI ---
buildLobbyUI();
buildHUD();
buildLevelComplete();

// --- Render loop ---
let lastTime = performance.now() / 1000;

renderer.startLoop(() => {
  const now = performance.now() / 1000;
  const dt = Math.min(now - lastTime, 0.1); // Cap dt to avoid large jumps
  lastTime = now;

  // Update particle effects on blocks
  fireBlock.update(dt, now);
  waterBlock.update(dt, now);

  // Update tile visual effects (lava pulse, water shimmer)
  gridMesh.update(now);
});
