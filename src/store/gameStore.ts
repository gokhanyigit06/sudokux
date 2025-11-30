import {create} from 'zustand';
import {Cell, Difficulty, GameHistory} from '../types';
import {
  copyBoard,
  generatePuzzle,
  isPuzzleComplete,
  isValidMove,
} from '../utils/sudoku';
import {loadGameState, saveGameState, clearGameState} from '../utils/storage';

interface GameStore {
  // State
  board: Cell[][];
  solution: number[][];
  difficulty: Difficulty;
  timeElapsed: number;
  isComplete: boolean;
  isPaused: boolean;
  selectedCell: {row: number; col: number} | null;
  history: GameHistory[];
  historyIndex: number;

  // Actions - Game Control
  initializeGame: (difficulty: Difficulty) => void;
  pauseGame: () => void;
  resumeGame: () => void;
  togglePause: () => void;

  // Actions - Cell Interaction
  selectCell: (row: number, col: number) => void;
  setCellValue: (row: number, col: number, value: number) => void;
  setCellNotes: (row: number, col: number, notes: number[]) => void;
  toggleCellNote: (row: number, col: number, note: number) => void;
  clearCell: (row: number, col: number) => void;

  // Actions - History
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  addToHistory: () => void;

  // Actions - Timer
  incrementTime: () => void;
  resetTimer: () => void;

  // Actions - Persistence
  loadGame: () => Promise<boolean>;
  saveGame: () => Promise<void>;
  clearSavedGame: () => Promise<void>;

  // Actions - Completion
  checkCompletion: () => void;
  setComplete: (complete: boolean) => void;
}

const createEmptyBoard = (): Cell[][] => {
  return Array(9)
    .fill(null)
    .map(() =>
      Array(9)
        .fill(null)
        .map(() => ({
          value: null,
          isFixed: false,
          isValid: true,
          notes: [],
          isConflict: false,
        })),
    );
};

export const useGameStore = create<GameStore>((set, get) => ({
  // Initial State
  board: createEmptyBoard(),
  solution: [],
  difficulty: 'medium',
  timeElapsed: 0,
  isComplete: false,
  isPaused: false,
  selectedCell: null,
  history: [],
  historyIndex: -1,

  // Game Control
  initializeGame: (diff) => {
    const {puzzle, solution: sol} = generatePuzzle(diff);

    const cellBoard: Cell[][] = puzzle.map((row) =>
      row.map((value) => ({
        value,
        isFixed: value !== null,
        isValid: true,
        notes: [],
        isConflict: false,
      })),
    );

    set({
      board: cellBoard,
      solution: sol as number[][],
      difficulty: diff,
      timeElapsed: 0,
      isComplete: false,
      isPaused: false,
      selectedCell: null,
      history: [{board: cellBoard, timestamp: Date.now()}],
      historyIndex: 0,
    });

    get().saveGame();
  },

  pauseGame: () => set({isPaused: true}),
  resumeGame: () => set({isPaused: false}),
  togglePause: () => set((state) => ({isPaused: !state.isPaused})),

  // Cell Interaction
  selectCell: (row, col) => {
    const {board} = get();
    if (!board[row][col].isFixed) {
      set({selectedCell: {row, col}});
    }
  },

  setCellValue: (row, col, value) => {
    const {board, solution} = get();
    if (board[row][col].isFixed) return;

    const newBoard = board.map((r) => r.map((cell) => ({...cell})));
    newBoard[row][col].value = value;
    newBoard[row][col].notes = []; // Clear notes when setting value

    // Validate the move
    const boardValues = newBoard.map((r) => r.map((c) => c.value));
    newBoard[row][col].isValid = isValidMove(boardValues, row, col, value);

    set({board: newBoard});
    get().addToHistory();
    get().checkCompletion();
    get().saveGame();
  },

  setCellNotes: (row, col, notes) => {
    const {board} = get();
    if (board[row][col].isFixed) return;

    const newBoard = board.map((r) => r.map((cell) => ({...cell})));
    newBoard[row][col].notes = notes;

    set({board: newBoard});
    get().saveGame();
  },

  toggleCellNote: (row, col, note) => {
    const {board} = get();
    if (board[row][col].isFixed || board[row][col].value !== null) return;

    const newBoard = board.map((r) => r.map((cell) => ({...cell})));
    const currentNotes = newBoard[row][col].notes;

    if (currentNotes.includes(note)) {
      newBoard[row][col].notes = currentNotes.filter((n) => n !== note);
    } else {
      newBoard[row][col].notes = [...currentNotes, note].sort();
    }

    set({board: newBoard});
    get().saveGame();
  },

  clearCell: (row, col) => {
    const {board} = get();
    if (board[row][col].isFixed) return;

    const newBoard = board.map((r) => r.map((cell) => ({...cell})));
    newBoard[row][col].value = null;
    newBoard[row][col].notes = [];
    newBoard[row][col].isValid = true;

    set({board: newBoard});
    get().addToHistory();
    get().saveGame();
  },

  // History
  addToHistory: () => {
    const {board, history, historyIndex} = get();
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({
      board: board.map((r) => r.map((c) => ({...c}))),
      timestamp: Date.now(),
    });

    // Keep only last 50 moves
    const trimmedHistory = newHistory.slice(-50);

    set({
      history: trimmedHistory,
      historyIndex: trimmedHistory.length - 1,
    });
  },

  undo: () => {
    const {history, historyIndex} = get();
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      set({
        board: history[newIndex].board.map((r) => r.map((c) => ({...c}))),
        historyIndex: newIndex,
      });
      get().saveGame();
    }
  },

  redo: () => {
    const {history, historyIndex} = get();
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      set({
        board: history[newIndex].board.map((r) => r.map((c) => ({...c}))),
        historyIndex: newIndex,
      });
      get().saveGame();
    }
  },

  canUndo: () => {
    const {historyIndex} = get();
    return historyIndex > 0;
  },

  canRedo: () => {
    const {history, historyIndex} = get();
    return historyIndex < history.length - 1;
  },

  // Timer
  incrementTime: () => {
    set((state) => ({timeElapsed: state.timeElapsed + 1}));
  },

  resetTimer: () => set({timeElapsed: 0}),

  // Persistence
  loadGame: async () => {
    const savedState = await loadGameState();
    if (savedState) {
      set({
        board: savedState.board,
        solution: savedState.solution,
        difficulty: savedState.difficulty,
        timeElapsed: savedState.timeElapsed,
        isComplete: savedState.isComplete,
        isPaused: savedState.isPaused,
        selectedCell: savedState.selectedCell,
        history: [{board: savedState.board, timestamp: Date.now()}],
        historyIndex: 0,
      });
      return true;
    }
    return false;
  },

  saveGame: async () => {
    const state = get();
    await saveGameState({
      board: state.board,
      solution: state.solution,
      difficulty: state.difficulty,
      timeElapsed: state.timeElapsed,
      isComplete: state.isComplete,
      isPaused: state.isPaused,
      selectedCell: state.selectedCell,
    });
  },

  clearSavedGame: async () => {
    await clearGameState();
  },

  // Completion
  checkCompletion: () => {
    const {board, solution} = get();
    const boardValues = board.map((r) => r.map((c) => c.value));
    const complete = isPuzzleComplete(boardValues, solution);

    if (complete) {
      set({isComplete: true});
    }
  },

  setComplete: (complete) => set({isComplete: complete}),
}));
