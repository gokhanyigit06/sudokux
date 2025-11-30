import React, {useEffect, useState} from 'react';
import {
  Alert,
  ImageBackground,
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import {GameHeader} from './src/components/GameHeader';
import {DraggableNumberPad} from './src/components/DraggableNumberPad';
import {SudokuBoard} from './src/components/SudokuBoard';
import {Cell, Difficulty, GameState} from './src/types';
import {
  copyBoard,
  generatePuzzle,
  getHint,
  isPuzzleComplete,
  isValidMove,
} from './src/utils/sudoku';
import {loadGameState, saveGameState, clearGameState, loadSettings, saveSettings} from './src/utils/storage';
import {translations} from './src/utils/translations';

type Language = 'tr' | 'en';

function App() {
  const [language, setLanguage] = useState<Language>('tr');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [board, setBoard] = useState<Cell[][]>([]);
  const [solution, setSolution] = useState<(number | null)[][]>([]);
  const [selectedCell, setSelectedCell] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showNewGameDialog, setShowNewGameDialog] = useState(false);
  const [showDifficultyDialog, setShowDifficultyDialog] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [history, setHistory] = useState<Cell[][][]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [boardLayout, setBoardLayout] = useState<{x: number; y: number; width: number; height: number} | null>(null);

  const t = translations[language];

  // Load saved game and settings on mount
  useEffect(() => {
    const loadSavedData = async () => {
      try {
        // Load settings
        const savedSettings = await loadSettings();
        if (savedSettings) {
          if (savedSettings.language) setLanguage(savedSettings.language);
          if (savedSettings.backgroundImage) setBackgroundImage(savedSettings.backgroundImage);
        }

        // Load game state
        const savedGame = await loadGameState();
        if (savedGame && savedGame.board && savedGame.board.length > 0) {
          setBoard(savedGame.board);
          setSolution(savedGame.solution);
          setDifficulty(savedGame.difficulty);
          setTimeElapsed(savedGame.timeElapsed || 0);
          setHistory(savedGame.history || []);
          setHintsUsed(savedGame.hintsUsed || 0);
          setIsComplete(savedGame.isComplete || false);
        } else {
          // No saved game, start new one
          initializeGame('medium');
        }
      } catch (error) {
        console.error('Error loading saved data:', error);
        initializeGame('medium');
      }
    };
    loadSavedData();
  }, []);

  // Auto-save game state whenever it changes
  useEffect(() => {
    if (board.length > 0) {
      const gameState: GameState = {
        board,
        solution,
        difficulty,
        timeElapsed,
        history,
        hintsUsed,
        isComplete,
      };
      saveGameState(gameState);
    }
  }, [board, solution, difficulty, timeElapsed, history, hintsUsed, isComplete]);

  // Auto-save settings
  useEffect(() => {
    saveSettings({language, backgroundImage});
  }, [language, backgroundImage]);

  const initializeGame = (diff: Difficulty) => {
    const {puzzle, solution: sol} = generatePuzzle(diff);

    // Create Cell objects for the board
    const cellBoard: Cell[][] = puzzle.map((row) =>
      row.map((value) => ({
        value,
        isFixed: value !== null,
        isValid: true,
        notes: [],
      })),
    );

    setBoard(cellBoard);
    setSolution(sol);
    setSelectedCell(null);
    setTimeElapsed(0);
    setIsComplete(false);
    setDifficulty(diff);
    setHistory([]);
    setHintsUsed(0);
    setIsPaused(false);
  };

  useEffect(() => {
    if (isComplete || isPaused) {
      return;
    }

    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isComplete, isPaused]);

  const handleCellPress = (row: number, col: number) => {
    if (!board[row][col].isFixed) {
      setSelectedCell({row, col});
    }
  };

  const handleNumberPress = (num: number) => {
    if (!selectedCell || isPaused) {
      return;
    }

    const {row, col} = selectedCell;
    if (board[row][col].isFixed) {
      return;
    }

    // Save current state to history
    setHistory(prev => [...prev, board.map(r => r.map(cell => ({...cell})))]);

    const newBoard = board.map(r => r.map(cell => ({...cell})));
    newBoard[row][col].value = num;

    // Validate the move - check correct solution
    const isCorrectValue = solution[row][col] === num;
    
    // isValid = true if it matches the solution
    newBoard[row][col].isValid = isCorrectValue;

    setBoard(newBoard);

    // Check if puzzle is complete
    const boardValues = newBoard.map(r => r.map(c => c.value));
    const complete = isPuzzleComplete(
      boardValues,
      solution,
    );
    if (complete) {
      setIsComplete(true);
      Alert.alert(t.congratulations, t.puzzleSolved, [
        {text: t.newGame, onPress: () => initializeGame(difficulty)},
      ]);
    }
  };

  const handleClear = () => {
    if (!selectedCell || isPaused) {
      return;
    }

    const {row, col} = selectedCell;
    if (board[row][col].isFixed) {
      return;
    }

    // Save current state to history
    setHistory(prev => [...prev, board.map(r => r.map(cell => ({...cell})))]);

    const newBoard = board.map(r => r.map(cell => ({...cell})));
    newBoard[row][col].value = null;
    newBoard[row][col].isValid = true;
    setBoard(newBoard);
  };

  const handleUndo = () => {
    if (history.length === 0 || isPaused) {
      return;
    }
    const previousBoard = history[history.length - 1];
    setBoard(previousBoard);
    setHistory(prev => prev.slice(0, -1));
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleHint = () => {
    if (isPaused || isComplete) {
      return;
    }
    
    const {getHint} = require('./src/utils/sudoku');
    const boardValues = board.map(r => r.map(c => c.value));
    
    const hint = getHint(boardValues, solution);
    
    if (hint) {
      // Save current state to history
      setHistory(prev => [...prev, board.map(r => r.map(cell => ({...cell})))]);
      
      const newBoard = board.map(r => r.map(cell => ({...cell})));
      newBoard[hint.row][hint.col].value = hint.value;
      newBoard[hint.row][hint.col].isValid = true;
      setBoard(newBoard);
      setHintsUsed(prev => prev + 1);
      setSelectedCell({row: hint.row, col: hint.col});
      
      Alert.alert(t.hint, `${hint.value}`);
    } else {
      Alert.alert(t.hint, 'Tüm hücreler dolu!');
    }
  };

  const handleDragNumber = (num: number, x: number, y: number) => {
    if (isPaused || isComplete || !boardLayout) {
      return;
    }

    // Use real board layout
    const cellSize = boardLayout.width / 9;

    // Calculate which cell was hit
    const relativeX = x - boardLayout.x;
    const relativeY = y - boardLayout.y;

    if (relativeX >= 0 && relativeY >= 0 && relativeX < boardLayout.width && relativeY < boardLayout.height) {
      const col = Math.floor(relativeX / cellSize);
      const row = Math.floor(relativeY / cellSize);

      if (row >= 0 && row < 9 && col >= 0 && col < 9) {
        // Select the cell and place the number
        setSelectedCell({row, col});
        
        // Place the number if cell is not fixed
        if (!board[row][col].isFixed) {
          // Save current state to history
          setHistory(prev => [...prev, board.map(r => r.map(cell => ({...cell})))]);

          const newBoard = board.map(r => r.map(cell => ({...cell})));
          newBoard[row][col].value = num;

          // Validate the move - check correct solution
          const isCorrectValue = solution[row][col] === num;
          
          newBoard[row][col].isValid = isCorrectValue;

          setBoard(newBoard);

          // Check if puzzle is complete
          const boardValues = newBoard.map(r => r.map(c => c.value));
          const complete = isPuzzleComplete(boardValues, solution);
          if (complete) {
            setIsComplete(true);
          }
        }
      }
    }
  };

  const handleNewGame = () => {
    setShowNewGameDialog(true);
  };

  const handleChangeDifficulty = () => {
    setShowDifficultyDialog(true);
  };

  const handleSettings = () => {
    setShowSettings(true);
  };

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    setShowSettings(false);
  };

  const handleChangeBackground = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.8,
      },
      response => {
        if (response.assets && response.assets[0]?.uri) {
          setBackgroundImage(response.assets[0].uri);
        }
      },
    );
  };

  const handleRemoveBackground = () => {
    setBackgroundImage(null);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      {backgroundImage && (
        <ImageBackground
          source={{uri: backgroundImage}}
          style={styles.backgroundImage}
          resizeMode="cover"
          imageStyle={{opacity: 0.7}}
        />
      )}
      <View style={styles.content}>
        <Text style={styles.title}>{t.title}</Text>
        <GameHeader
          difficulty={difficulty}
          timeElapsed={timeElapsed}
          onNewGame={handleNewGame}
          onChangeDifficulty={handleChangeDifficulty}
          onSettings={handleSettings}
          onUndo={handleUndo}
          onPause={handlePause}
          onHint={handleHint}
          canUndo={history.length > 0}
          isPaused={isPaused}
          language={language}
        />
        <SudokuBoard
          board={board}
          selectedCell={selectedCell}
          onCellPress={handleCellPress}
          onLayout={setBoardLayout}
          difficulty={difficulty}
        />
        <DraggableNumberPad
          onNumberPress={handleNumberPress}
          onClear={handleClear}
          language={language}
          onDragNumber={handleDragNumber}
        />
      </View>
      {isPaused && (
        <View style={styles.pauseOverlay}>
          <View style={styles.pauseBox}>
            <Text style={styles.pauseText}>{t.pause.toUpperCase()}</Text>
            <TouchableOpacity 
              style={styles.resumeButton}
              onPress={handlePause}>
              <Text style={styles.resumeButtonText}>{t.resume}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* New Game Dialog */}
      <Modal
        visible={showNewGameDialog}
        transparent
        animationType="fade"
        onRequestClose={() => setShowNewGameDialog(false)}>
        <View style={styles.modalOverlay} pointerEvents="auto">
          <View style={styles.dialogContent}>
            <Text style={styles.dialogTitle}>{t.newGame}</Text>
            <Text style={styles.dialogMessage}>{t.confirmNewGame}</Text>
            <View style={styles.dialogButtons}>
              <TouchableOpacity
                style={[styles.dialogButton, styles.cancelButton]}
                onPress={() => setShowNewGameDialog(false)}>
                <Text style={styles.cancelButtonText}>{t.cancel}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.dialogButton, styles.confirmButton]}
                onPress={() => {
                  setShowNewGameDialog(false);
                  initializeGame(difficulty);
                }}>
                <Text style={styles.confirmButtonText}>{t.yes}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Difficulty Selection Dialog */}
      <Modal
        visible={showDifficultyDialog}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDifficultyDialog(false)}>
        <View style={styles.modalOverlay} pointerEvents="auto">
          <View style={styles.dialogContent}>
            <Text style={styles.dialogTitle}>{t.selectDifficulty}</Text>
            <TouchableOpacity
              style={styles.difficultyButton}
              onPress={() => {
                setShowDifficultyDialog(false);
                initializeGame('beginner');
              }}>
              <Text style={styles.difficultyButtonText}>{t.beginner}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.difficultyButton}
              onPress={() => {
                setShowDifficultyDialog(false);
                initializeGame('easy');
              }}>
              <Text style={styles.difficultyButtonText}>{t.easy}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.difficultyButton}
              onPress={() => {
                setShowDifficultyDialog(false);
                initializeGame('medium');
              }}>
              <Text style={styles.difficultyButtonText}>{t.medium}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.difficultyButton}
              onPress={() => {
                setShowDifficultyDialog(false);
                initializeGame('hard');
              }}>
              <Text style={styles.difficultyButtonText}>{t.hard}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.difficultyButton}
              onPress={() => {
                setShowDifficultyDialog(false);
                initializeGame('expert');
              }}>
              <Text style={styles.difficultyButtonText}>{t.expert}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.difficultyButton}
              onPress={() => {
                setShowDifficultyDialog(false);
                initializeGame('evil');
              }}>
              <Text style={styles.difficultyButtonText}>{t.evil}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.cancelButton, {marginTop: 15, padding: 15, borderRadius: 10, alignItems: 'center'}]}
              onPress={() => setShowDifficultyDialog(false)}>
              <Text style={styles.cancelButtonText}>{t.cancel}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showSettings}
        transparent
        animationType="slide"
        onRequestClose={() => setShowSettings(false)}>
        <View style={styles.modalOverlay} pointerEvents="auto">
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t.settings}</Text>
            <Text style={styles.modalLabel}>{t.background}</Text>
            <TouchableOpacity
              style={styles.backgroundButton}
              onPress={handleChangeBackground}>
              <Text style={styles.backgroundButtonText}>
                {t.changeBackground}
              </Text>
            </TouchableOpacity>
            {backgroundImage && (
              <TouchableOpacity
                style={styles.removeBackgroundButton}
                onPress={handleRemoveBackground}>
                <Text style={styles.removeBackgroundButtonText}>
                  {t.removeBackground}
                </Text>
              </TouchableOpacity>
            )}

            <Text style={[styles.modalLabel, {marginTop: 20}]}>{t.language}</Text>
            <TouchableOpacity
              style={[
                styles.languageButton,
                language === 'tr' && styles.languageButtonActive,
              ]}
              onPress={() => handleLanguageChange('tr')}>
              <Text
                style={[
                  styles.languageButtonText,
                  language === 'tr' && styles.languageButtonTextActive,
                ]}>
                Türkçe
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.languageButton,
                language === 'en' && styles.languageButtonActive,
              ]}
              onPress={() => handleLanguageChange('en')}>
              <Text
                style={[
                  styles.languageButtonText,
                  language === 'en' && styles.languageButtonTextActive,
                ]}>
                English
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowSettings(false)}>
              <Text style={styles.closeButtonText}>{t.cancel}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  imageOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    pointerEvents: 'none' as const,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    elevation: 1000,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    width: '80%',
    maxWidth: 400,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  modalLabel: {
    fontSize: 16,
    marginBottom: 10,
    color: '#666',
  },
  languageButton: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  languageButtonActive: {
    backgroundColor: '#2196F3',
    borderColor: '#1976D2',
  },
  languageButtonText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
    fontWeight: '600',
  },
  languageButtonTextActive: {
    color: '#fff',
  },
  closeButton: {
    backgroundColor: '#f44336',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  backgroundButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  backgroundButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  removeBackgroundButton: {
    backgroundColor: '#FF9800',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  removeBackgroundButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  pauseOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pauseBox: {
    backgroundColor: '#fff',
    padding: 40,
    borderRadius: 20,
    alignItems: 'center',
  },
  pauseText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  resumeButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  resumeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  dialogContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    width: '85%',
    maxWidth: 350,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  dialogTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
  },
  dialogMessage: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: '#666',
  },
  dialogButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  dialogButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#e0e0e0',
    borderWidth: 1,
    borderColor: '#999',
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  difficultyButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  difficultyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default App;
