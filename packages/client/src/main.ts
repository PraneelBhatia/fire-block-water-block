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

  const restartBtn = document.createElement('button');
  restartBtn.textContent = 'Play Again';
  restartBtn.style.cssText = buttonStyle('#4caf50');
  restartBtn.addEventListener('click', () => {
    network.sendRestart();
  });
  levelCompleteDiv.appendChild(restartBtn);
}

// --- State sync ---
let currentPhase = 'waiting';

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
    fireBlock.setPositionImmediate(
      { x: state.fireBlock.position.x, y: state.fireBlock.position.y },
      state.fireBlock.orientation as BlockOrientation,
    );
  }

  // Update water block
  if (state.waterBlock) {
    waterBlock.setVisible(state.waterBlock.alive);
    waterBlock.setPositionImmediate(
      { x: state.waterBlock.position.x, y: state.waterBlock.position.y },
      state.waterBlock.orientation as BlockOrientation,
    );
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
renderer.startLoop(() => {
  // Update loop — currently driven by state sync callbacks
  // Future: add animation interpolation here
});
