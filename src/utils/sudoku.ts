import {Board, CellValue, Difficulty} from '../types';

// Check if a number is valid in a specific position
export const isValidMove = (
  board: Board,
  row: number,
  col: number,
  num: number,
): boolean => {
  // Check row
  for (let x = 0; x < 9; x++) {
    if (board[row][x] === num) {
      return false;
    }
  }

  // Check column
  for (let x = 0; x < 9; x++) {
    if (board[x][col] === num) {
      return false;
    }
  }

  // Check 3x3 box
  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[startRow + i][startCol + j] === num) {
        return false;
      }
    }
  }

  return true;
};

// Solve the Sudoku puzzle using backtracking
const solveSudoku = (board: Board): boolean => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === null) {
        for (let num = 1; num <= 9; num++) {
          if (isValidMove(board, row, col, num)) {
            board[row][col] = num;

            if (solveSudoku(board)) {
              return true;
            }

            board[row][col] = null;
          }
        }
        return false;
      }
    }
  }
  return true;
};

// Generate a complete Sudoku board
const generateCompleteBoard = (): Board => {
  const board: Board = Array(9)
    .fill(null)
    .map(() => Array(9).fill(null));

  // Fill diagonal 3x3 boxes first
  for (let box = 0; box < 9; box += 3) {
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const randomIndex = Math.floor(Math.random() * numbers.length);
        board[box + i][box + j] = numbers[randomIndex];
        numbers.splice(randomIndex, 1);
      }
    }
  }

  solveSudoku(board);
  return board;
};

// Remove cells from the board based on difficulty
export const generatePuzzle = (difficulty: Difficulty): {puzzle: Board; solution: Board} => {
  const completeBoard = generateCompleteBoard();
  const solution = completeBoard.map(row => [...row]);
  const puzzle = completeBoard.map(row => [...row]);

  const cellsToRemove = {
    beginner: 25,
    easy: 35,
    medium: 45,
    hard: 55,
    expert: 60,
    evil: 65,
  }[difficulty];

  let removed = 0;
  while (removed < cellsToRemove) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);

    if (puzzle[row][col] !== null) {
      puzzle[row][col] = null;
      removed++;
    }
  }

  return {puzzle, solution};
};

// Check if the puzzle is complete and correct
export const isPuzzleComplete = (
  board: Board,
  solution: Board,
): boolean => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] !== solution[row][col]) {
        return false;
      }
    }
  }
  return true;
};

// Create a deep copy of the board
export const copyBoard = (board: Board): Board => {
  return board.map(row => [...row]);
};

// Get a hint - returns a random empty cell with its solution value
export const getHint = (
  board: Board,
  solution: Board,
): {row: number; col: number; value: number} | null => {
  const emptyCells: {row: number; col: number}[] = [];

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === null) {
        emptyCells.push({row, col});
      }
    }
  }

  if (emptyCells.length === 0) {
    return null;
  }

  const randomIndex = Math.floor(Math.random() * emptyCells.length);
  const {row, col} = emptyCells[randomIndex];

  return {
    row,
    col,
    value: solution[row][col] as number,
  };
};

// Find conflicts in the current board state
export const findConflicts = (board: Board): {row: number; col: number}[] => {
  const conflicts: {row: number; col: number}[] = [];

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const value = board[row][col];
      if (value === null) continue;

      // Temporarily remove the value to check if it conflicts
      const temp = board[row][col];
      board[row][col] = null;

      if (!isValidMove(board, row, col, value)) {
        conflicts.push({row, col});
      }

      board[row][col] = temp;
    }
  }

  return conflicts;
};

// Get remaining count for a specific number (1-9)
export const getRemainingCount = (board: Board, num: number): number => {
  let count = 0;
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === num) {
        count++;
      }
    }
  }
  return 9 - count; // Return how many more can be placed
};
