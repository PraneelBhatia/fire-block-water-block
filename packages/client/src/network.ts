import { Client, Room } from 'colyseus.js';
import { Direction } from '@fbwb/shared';

// In production, server and client are on the same host.
// In dev, client is on :3000 and server on :2567.
const isDev = window.location.port === '3000';
const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
const SERVER_URL = isDev
  ? 'ws://localhost:2567'
  : `${wsProtocol}//${window.location.host}`;
const HTTP_URL = isDev
  ? 'http://localhost:2567'
  : `${window.location.protocol}//${window.location.host}`;

export interface GameState {
  phase: string;
  levelId: number;
  roomCode: string;
  fireBlock: {
    position: { x: number; y: number };
    orientation: string;
    element: string;
    alive: boolean;
  };
  waterBlock: {
    position: { x: number; y: number };
    orientation: string;
    element: string;
    alive: boolean;
  };
  moveCount: number;
  tilesJson: string;
  player1: { sessionId: string; assignedElement: string; connected: boolean };
  player2: { sessionId: string; assignedElement: string; connected: boolean };
  settings: { fallOffEdge: boolean };
  deathCause: string;
}

export class NetworkClient {
  private client: Client;
  private room: Room | null = null;
  onStateChange: ((state: GameState) => void) | null = null;

  constructor() {
    this.client = new Client(SERVER_URL);
  }

  async createRoom(): Promise<string> {
    this.room = await this.client.create('game');
    this.setupListeners();
    // Wait for 'welcome' message from server with room code
    return new Promise<string>((resolve) => {
      this.room!.onMessage('welcome', (data: { roomCode: string; element: string }) => {
        resolve(data.roomCode);
      });
    });
  }

  async joinByCode(code: string): Promise<void> {
    const response = await fetch(`${HTTP_URL}/api/room-by-code/${code.toUpperCase()}`);
    if (!response.ok) {
      throw new Error('Room not found');
    }
    const data = await response.json();
    this.room = await this.client.joinById(data.roomId);
    this.setupListeners();
  }

  private setupListeners() {
    if (!this.room) return;
    this.room.onMessage('state', (state: GameState) => {
      if (this.onStateChange) {
        this.onStateChange(state);
      }
    });
  }

  sendMove(direction: Direction) {
    this.room?.send('move', { direction });
  }

  sendRestart() {
    this.room?.send('restart', {});
  }

  sendSelectLevel(levelId: number) {
    this.room?.send('selectLevel', { levelId });
  }

  toggleFallOff() {
    this.room?.send('toggleFallOff', {});
  }

  sendLocalMove(player: 'fire' | 'water', direction: string) {
    this.room?.send('localMove', { player, direction });
  }

  async startLocal(): Promise<string> {
    this.room = await this.client.create('game');
    this.setupListeners();
    this.room.send('startLocal', {});
    return new Promise<string>((resolve) => {
      this.room!.onMessage('welcome', (data: { roomCode: string }) => {
        resolve(data.roomCode);
      });
    });
  }

  getSessionId(): string | undefined {
    return this.room?.sessionId;
  }
}
