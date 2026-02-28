export type GameMode = "solo" | "versus";
export type Screen = "menu" | "config" | "game" | "results";
export type GridSize = 5 | 10 | 15;

export interface Card {
  id: string;
  icon: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export interface GameConfig {
  mode: GameMode;
  gridSize: GridSize;
}

export interface Player {
  name: string;
  score: number;
  moves: number;
}

export interface GameState {
  cards: Card[];
  selectedCards: string[];
  currentPlayer: number;
  players: Player[];
  moves: number;
  time: number;
  isGameOver: boolean;
}
