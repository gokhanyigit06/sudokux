import React, {useEffect, useState} from 'react';
import {
  Alert,
  ImageBackground,
  Modal,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {launchImageLibrary} from 'react-native-image-picker';
import {GameHeader} from '../components/GameHeader';
import {DraggableNumberPad} from '../components/DraggableNumberPad';
import {SudokuBoard} from '../components/SudokuBoard';
import {Cell, Difficulty, GameState} from '../types';
import {isPuzzleComplete, generatePuzzle, getHint} from '../utils/sudoku';
import {
  loadGameState,
  saveGameState,
  loadSettings,
  saveSettings,
} from '../utils/storage';
import {translations} from '../utils/translations';
import {RootStackParamList} from '../navigation/AppNavigator';
import {useLevelStore} from '../store/levelStore';
import {useLivesStore} from '../store/livesStore';
import {useThemeStore} from '../store/themeStore';
import {useAdsStore} from '../store/adsStore';
import {useStatisticsStore} from '../store/statisticsStore';
import {CountdownTimer} from '../components/CountdownTimer';
import {LivesIndicator} from '../components/LivesIndicator';
import {TimeUpModal} from '../components/TimeUpModal';
import {NoLivesModal} from '../components/NoLivesModal';
import {showRewardedAd, preloadAds, isRewardedAdReady, showInterstitialAd, isInterstitialAdReady} from '../utils/ads';

type Language = 'tr' | 'en';

type GameScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Game'
>;
type GameScreenRouteProp = RouteProp<RootStackParamList, 'Game'>;

type Props = {
  navigation: GameScreenNavigationProp;
  route: GameScreenRouteProp;
};

const GameScreen = ({navigation, route}: Props) => {
  const levelId = route.params?.levelId;
  const {getLevelById, completeLevel, getPuzzleForLevel} = useLevelStore();
  const {lives, loseLife, getNextLifeTime, updateLives} = useLivesStore();
  const {rewardedAdLoaded, incrementLevelsCompleted, shouldShowInterstitial, resetLevelCounter} = useAdsStore();
  const {recordGameStart, recordGameComplete, updateStreak, addPlayTime} = useStatisticsStore();
  const {theme, mode} = useThemeStore();
  const currentLevel = levelId ? getLevelById(levelId) : null;

  const [language, setLanguage] = useState<Language>('tr');
  const [difficulty, setDifficulty] = useState<Difficulty>(
    currentLevel?.difficulty || 'medium'
  );
  const [board, setBoard] = useState<Cell[][]>([]);
  const [solution, setSolution] = useState<(number | null)[][]>([]);
  const [selectedCell, setSelectedCell] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [timeLimit, setTimeLimit] = useState(600); // 10 minutes
  const [isComplete, setIsComplete] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showNewGameDialog, setShowNewGameDialog] = useState(false);
  const [showDifficultyDialog, setShowDifficultyDialog] = useState(false);
  const [showTimeUpModal, setShowTimeUpModal] = useState(false);
  const [showNoLivesModal, setShowNoLivesModal] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [history, setHistory] = useState<Cell[][][]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [isPencilMode, setIsPencilMode] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [boardLayout, setBoardLayout] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);

  const t = translations[language];

  // Load saved game and settings on mount
  useEffect(() => {
    const loadSavedData = async () => {
      try {
        // Preload ads
        preloadAds();
        
        const savedSettings = await loadSettings();
        if (savedSettings) {
          if (savedSettings.language) setLanguage(savedSettings.language);
          if (savedSettings.backgroundImage)
            setBackgroundImage(savedSettings.backgroundImage);
        }

        // If level ID is provided, load that level
        if (levelId && currentLevel) {
          const {puzzle, solution: sol} = getPuzzleForLevel(levelId);
          const cellBoard: Cell[][] = puzzle.map(row =>
            row.map(value => ({
              value,
              isFixed: value !== null,
              isValid: true,
              notes: [],
            }))
          );
          setBoard(cellBoard);
          setSolution(sol);
          setDifficulty(currentLevel.difficulty);
          setTimeElapsed(0);
          setHistory([]);
          setHintsUsed(0);
          setIsComplete(false);
        } else {
          // Load saved game or start new one
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
            initializeGame('medium');
          }
        }
      } catch (error) {
        console.error('Error loading saved data:', error);
        initializeGame('medium');
      }
    };
    loadSavedData();
  }, [levelId]);

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

  useEffect(() => {
    saveSettings({language, backgroundImage});
  }, [language, backgroundImage]);

  const initializeGame = (diff: Difficulty) => {
    const {puzzle, solution: sol} = generatePuzzle(diff);

    const cellBoard: Cell[][] = puzzle.map(row =>
      row.map(value => ({
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
    
    // Record game start in statistics
    recordGameStart(diff);
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

  // Auto-update notes: remove number from same row/column/box
  const autoUpdateNotes = (newBoard: Cell[][], row: number, col: number, num: number) => {
    for (let i = 0; i < 9; i++) {
      // Same row
      if (i !== col && newBoard[row][i].notes) {
        newBoard[row][i].notes = newBoard[row][i].notes!.filter(n => n !== num);
      }
      // Same column
      if (i !== row && newBoard[i][col].notes) {
        newBoard[i][col].notes = newBoard[i][col].notes!.filter(n => n !== num);
      }
    }
    
    // Same 3x3 box
    const boxStartRow = Math.floor(row / 3) * 3;
    const boxStartCol = Math.floor(col / 3) * 3;
    for (let r = boxStartRow; r < boxStartRow + 3; r++) {
      for (let c = boxStartCol; c < boxStartCol + 3; c++) {
        if ((r !== row || c !== col) && newBoard[r][c].notes) {
          newBoard[r][c].notes = newBoard[r][c].notes!.filter(n => n !== num);
        }
      }
    }
  };

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

    setHistory(prev => [...prev, board.map(r => r.map(cell => ({...cell})))]);

    const newBoard = board.map(r => r.map(cell => ({...cell})));
    
    // Pencil mode: toggle notes
    if (isPencilMode) {
      const currentNotes = newBoard[row][col].notes || [];
      if (currentNotes.includes(num)) {
        // Remove note
        newBoard[row][col].notes = currentNotes.filter(n => n !== num);
      } else {
        // Add note
        newBoard[row][col].notes = [...currentNotes, num].sort();
      }
    } else {
      // Normal mode: set value and clear notes
      newBoard[row][col].value = num;
      newBoard[row][col].notes = [];

      const isCorrectValue = solution[row][col] === num;
      newBoard[row][col].isValid = isCorrectValue;
      
      // Auto-update: Remove this number from notes in same row/col/box
      autoUpdateNotes(newBoard, row, col, num);
    }

    setBoard(newBoard);

    // Check completion only in normal mode
    if (!isPencilMode) {
      const boardValues = newBoard.map(r => r.map(c => c.value));
      const complete = isPuzzleComplete(boardValues, solution);
      if (complete) {
        setIsComplete(true);
        
        // Calculate stars based on time
        let stars = 1;
        if (timeElapsed < 180) stars = 3; // Under 3 minutes
        else if (timeElapsed < 300) stars = 2; // Under 5 minutes
        
        // Record statistics
        recordGameComplete(difficulty, timeElapsed);
        updateStreak(true);
        addPlayTime(timeElapsed);
        
        // Save level completion
        if (levelId) {
          completeLevel(levelId, timeElapsed, stars);
          
          // Track level completion for ads
          incrementLevelsCompleted();
          
          // Show interstitial ad if threshold reached
          if (shouldShowInterstitial() && isInterstitialAdReady()) {
            showInterstitialAd(() => {
              console.log('Interstitial ad closed after level completion');
            });
          }
        }
        
        const starText = '⭐'.repeat(stars);
        Alert.alert(
          t.congratulations,
          `${t.puzzleSolved}\n\nZaman: ${Math.floor(timeElapsed / 60)}:${(timeElapsed % 60).toString().padStart(2, '0')}\n${starText}`,
          [
            {text: 'Level Seç', onPress: () => navigation.navigate('LevelSelect')},
            {text: t.newGame, onPress: () => initializeGame(difficulty)},
          ]
        );
      }
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

    setHistory(prev => [...prev, board.map(r => r.map(cell => ({...cell})))]);

    const newBoard = board.map(r => r.map(cell => ({...cell})));
    
    if (isPencilMode) {
      // Clear all notes in pencil mode
      newBoard[row][col].notes = [];
    } else {
      // Clear value in normal mode
      newBoard[row][col].value = null;
      newBoard[row][col].isValid = true;
    }
    
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

    const boardValues = board.map(r => r.map(c => c.value));
    const hint = getHint(boardValues, solution);

    if (hint) {
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

    const cellSize = boardLayout.width / 9;
    const relativeX = x - boardLayout.x;
    const relativeY = y - boardLayout.y;

    if (
      relativeX >= 0 &&
      relativeY >= 0 &&
      relativeX < boardLayout.width &&
      relativeY < boardLayout.height
    ) {
      const col = Math.floor(relativeX / cellSize);
      const row = Math.floor(relativeY / cellSize);

      if (row >= 0 && row < 9 && col >= 0 && col < 9) {
        setSelectedCell({row, col});

        if (!board[row][col].isFixed) {
          setHistory(prev => [
            ...prev,
            board.map(r => r.map(cell => ({...cell}))),
          ]);

          const newBoard = board.map(r => r.map(cell => ({...cell})));
          newBoard[row][col].value = num;

          const isCorrectValue = solution[row][col] === num;
          newBoard[row][col].isValid = isCorrectValue;

          setBoard(newBoard);

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
    navigation.navigate('Settings');
  };

  const handleTimeUp = () => {
    setIsPaused(true);
    loseLife();
    setShowTimeUpModal(true);
  };

  const handleRetryAfterTimeUp = () => {
    if (lives <= 0) {
      setShowTimeUpModal(false);
      setShowNoLivesModal(true);
      return;
    }
    setShowTimeUpModal(false);
    if (levelId) {
      const {puzzle, solution: sol} = getPuzzleForLevel(levelId);
      const cellBoard: Cell[][] = puzzle.map(row =>
        row.map(value => ({
          value,
          isFixed: value !== null,
          isValid: true,
          notes: [],
        }))
      );
      setBoard(cellBoard);
      setSolution(sol);
    } else {
      initializeGame(difficulty);
    }
    setTimeElapsed(0);
    setTimeLimit(600); // Reset to 10 minutes
    setIsPaused(false);
    setHistory([]);
    setHintsUsed(0);
  };

  const handleWatchAdForTime = () => {
    showRewardedAd(
      () => {
        // Reward: Add 5 minutes (300 seconds) to time limit
        setTimeLimit(prev => prev + 300);
        setShowTimeUpModal(false);
        setIsPaused(false);
        Alert.alert('Başarılı!', '5 dakika eklendi!');
      },
      () => {
        // Ad closed
        console.log('Time extension ad closed');
      }
    );
  };

  const handleWatchAdForLife = () => {
    showRewardedAd(
      () => {
        // Reward: Add 1 life using addLife
        const {addLife} = useLivesStore.getState();
        addLife();
        setShowNoLivesModal(false);
        Alert.alert('Başarılı!', '1 can eklendi!');
      },
      () => {
        // Ad closed
        console.log('Life ad closed');
      }
    );
  };

  const formatNextLifeTime = () => {
    const seconds = getNextLifeTime();
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
    <SafeAreaView style={[styles.safeArea, {backgroundColor: theme.colors.background}]}>
      <StatusBar barStyle={mode === 'dark' ? 'light-content' : 'dark-content'} />
      {backgroundImage && (
        <ImageBackground
          source={{uri: backgroundImage}}
          style={styles.backgroundImage}
          resizeMode="cover"
          imageStyle={{opacity: 0.7}}
        />
      )}
      <View style={styles.content}>
        <Text style={[styles.title, {color: theme.colors.text}]}>{t.title}</Text>
        
        <View style={styles.topBar}>
          <LivesIndicator />
          {levelId && (
            <CountdownTimer
              initialTime={timeLimit}
              onTimeUp={handleTimeUp}
              isPaused={isPaused}
              isComplete={isComplete}
            />
          )}
        </View>

        <GameHeader
          difficulty={difficulty}
          timeElapsed={timeElapsed}
          onNewGame={handleNewGame}
          onChangeDifficulty={handleChangeDifficulty}
          onSettings={handleSettings}
          onUndo={handleUndo}
          onPause={handlePause}
          onHint={handleHint}
          onPencilToggle={() => setIsPencilMode(!isPencilMode)}
          canUndo={history.length > 0}
          isPaused={isPaused}
          isPencilMode={isPencilMode}
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
          <View style={[styles.pauseBox, {backgroundColor: theme.colors.surface}]}>
            <Text style={[styles.pauseText, {color: theme.colors.text}]}>{t.pause.toUpperCase()}</Text>
            <TouchableOpacity style={[styles.resumeButton, {backgroundColor: theme.colors.success}]} onPress={handlePause}>
              <Text style={[styles.resumeButtonText, {color: '#fff'}]}>{t.resume}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <Modal
        visible={showNewGameDialog}
        transparent
        animationType="fade"
        onRequestClose={() => setShowNewGameDialog(false)}>
        <View style={styles.modalOverlay} pointerEvents="auto">
          <View style={[styles.dialogContent, {backgroundColor: theme.colors.surface}]}>
            <Text style={[styles.dialogTitle, {color: theme.colors.text}]}>{t.newGame}</Text>
            <Text style={[styles.dialogMessage, {color: theme.colors.textSecondary}]}>{t.confirmNewGame}</Text>
            <View style={styles.dialogButtons}>
              <TouchableOpacity
                style={[styles.dialogButton, styles.cancelButton, {backgroundColor: theme.colors.card, borderColor: theme.colors.border}]}
                onPress={() => setShowNewGameDialog(false)}>
                <Text style={[styles.cancelButtonText, {color: theme.colors.text}]}>{t.cancel}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.dialogButton, styles.confirmButton, {backgroundColor: theme.colors.success}]}
                onPress={() => {
                  setShowNewGameDialog(false);
                  initializeGame(difficulty);
                }}>
                <Text style={[styles.confirmButtonText, {color: '#fff'}]}>{t.yes}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showDifficultyDialog}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDifficultyDialog(false)}>
        <View style={styles.modalOverlay} pointerEvents="auto">
          <View style={[styles.dialogContent, {backgroundColor: theme.colors.surface}]}>
            <Text style={[styles.dialogTitle, {color: theme.colors.text}]}>{t.selectDifficulty}</Text>
            {['beginner', 'easy', 'medium', 'hard', 'expert', 'evil'].map(diff => (
              <TouchableOpacity
                key={diff}
                style={[styles.difficultyButton, {backgroundColor: theme.colors.primary}]}
                onPress={() => {
                  setShowDifficultyDialog(false);
                  initializeGame(diff as Difficulty);
                }}>
                <Text style={[styles.difficultyButtonText, {color: '#fff'}]}>
                  {t[diff as keyof typeof t]}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={[
                styles.cancelButton,
                {marginTop: 15, padding: 15, borderRadius: 10, alignItems: 'center', backgroundColor: theme.colors.card, borderColor: theme.colors.border},
              ]}
              onPress={() => setShowDifficultyDialog(false)}>
              <Text style={[styles.cancelButtonText, {color: theme.colors.text}]}>{t.cancel}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <TimeUpModal
        visible={showTimeUpModal}
        onRetry={handleRetryAfterTimeUp}
        onLevelSelect={() => {
          setShowTimeUpModal(false);
          navigation.goBack();
        }}
        onWatchAd={handleWatchAdForTime}
        hasAds={rewardedAdLoaded}
      />

      <NoLivesModal
        visible={showNoLivesModal}
        nextLifeTime={formatNextLifeTime()}
        onClose={() => setShowNoLivesModal(false)}
        onWatchAd={handleWatchAdForLife}
        hasAds={rewardedAdLoaded}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
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
    padding: 40,
    borderRadius: 20,
    alignItems: 'center',
  },
  pauseText: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  resumeButton: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  resumeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  dialogContent: {
    borderRadius: 20,
    padding: 25,
    width: '85%',
    maxWidth: 350,
    elevation: 5,
  },
  dialogTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  dialogMessage: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
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
    borderWidth: 1,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButton: {
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  difficultyButton: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  difficultyButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default GameScreen;
