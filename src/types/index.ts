export type CellValue = number | null;
export type Board = CellValue[][];
export type Difficulty = 'beginner' | 'easy' | 'medium' | 'hard' | 'expert' | 'evil';

export interface Cell {
  value: CellValue;
  isFixed: boolean;
  isValid: boolean;
  notes: number[]; // Pencil marks for note-taking
  isConflict?: boolean; // For conflict highlighting
}

export interface GameState {
  board: Cell[][];
  solution: (number | null)[][];
  difficulty: Difficulty;
  timeElapsed: number;
  isComplete: boolean;
  isPaused?: boolean;
  selectedCell?: {row: number; col: number} | null;
  history?: Cell[][][];
  hintsUsed?: number;
}

export interface GameHistory {
  board: Cell[][];
  timestamp: number;
}

export interface Settings {
  language: 'tr' | 'en';
  darkMode?: boolean;
  soundEnabled?: boolean;
  hapticEnabled?: boolean;
  autoErrorCheck?: boolean;
  showTimer?: boolean;
  backgroundImage?: string | null;
  isPencilMode?: boolean; // Pencil/pen mode toggle
}

export interface Statistics {
  gamesPlayed: Record<Difficulty, number>;
  gamesCompleted: Record<Difficulty, number>;
  bestTimes: Record<Difficulty, number>;
  averageTimes: Record<Difficulty, number>;
  currentStreak: number;
  longestStreak: number;
  totalPlayTime: number; // in seconds
}
