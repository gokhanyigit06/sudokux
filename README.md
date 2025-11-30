# Sudoku Mobile Game

A beautiful and interactive Sudoku puzzle game built with React Native and TypeScript.

## Features

- 🎮 Three difficulty levels: Easy, Medium, and Hard
- ⏱️ Built-in timer to track your solving time
- ✨ Smart cell highlighting for better gameplay
- ✅ Real-time move validation
- 🎯 Automatic puzzle completion detection
- 📱 Clean and intuitive mobile UI

## Game Components

- **Sudoku Board**: Interactive 9x9 grid with visual feedback
- **Number Pad**: Easy number input interface
- **Game Header**: Difficulty selector and timer
- **Smart Validation**: Real-time checking for valid moves

## Prerequisites

Before running this project, ensure you have completed the [React Native Environment Setup](https://reactnative.dev/docs/set-up-your-environment).

### Required Tools

- Node.js (v18 or higher)
- npm or Yarn
- For Android: Android Studio and Android SDK
- For iOS: Xcode (macOS only)
- For Android: JDK 17

## Installation

1. Clone the repository and navigate to the project directory
2. Install dependencies:

```sh
npm install
```

## Running the App

### Step 1: Start Metro

Start the Metro bundler:

```sh
npm start
```

### Step 2: Run on your platform

#### Android

```sh
npm run android
```

#### iOS

First, install CocoaPods dependencies:

```sh
cd ios
bundle install
bundle exec pod install
cd ..
```

Then run the app:

```sh
npm run ios
```

## How to Play

1. **Select a Cell**: Tap on any empty cell in the grid
2. **Enter a Number**: Use the number pad to fill in the cell
3. **Clear a Cell**: Select a cell and tap "Clear"
4. **New Game**: Start a fresh puzzle anytime
5. **Change Difficulty**: Switch between Easy, Medium, and Hard modes

## Project Structure

```
src/
├── components/
│   ├── SudokuBoard.tsx    # Main game board
│   ├── SudokuCell.tsx     # Individual cell component
│   ├── NumberPad.tsx      # Number input interface
│   └── GameHeader.tsx     # Game info and controls
├── utils/
│   └── sudoku.ts          # Puzzle generation and validation logic
└── types/
    └── index.ts           # TypeScript type definitions
```

## Technologies Used

- React Native 0.82
- TypeScript
- React Hooks for state management

## Development

The app uses:
- **Fast Refresh** for instant updates during development
- **TypeScript** for type safety
- **ESLint** and **Prettier** for code quality

## Troubleshooting

If you encounter issues:

1. Clean the build:
   ```sh
   cd android && ./gradlew clean
   cd ios && xcodebuild clean
   ```

2. Reset Metro cache:
   ```sh
   npm start --reset-cache
   ```

3. Reinstall dependencies:
   ```sh
   rm -rf node_modules
   npm install
   ```

For more help, see the [React Native Troubleshooting Guide](https://reactnative.dev/docs/troubleshooting).

## License

MIT
