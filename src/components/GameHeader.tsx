import React from 'react';
import {Alert, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Difficulty} from '../types';
import {translations} from '../utils/translations';

interface GameHeaderProps {
  difficulty: Difficulty;
  timeElapsed: number;
  onNewGame: () => void;
  onChangeDifficulty: () => void;
  onSettings: () => void;
  onUndo?: () => void;
  onPause?: () => void;
  onHint?: () => void;
  canUndo?: boolean;
  isPaused?: boolean;
  language: 'tr' | 'en';
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  difficulty,
  timeElapsed,
  onNewGame,
  onChangeDifficulty,
  onSettings,
  onUndo,
  onPause,
  onHint,
  canUndo = false,
  isPaused = false,
  language,
}) => {
  const t = translations[language];
  
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyText = () => {
    const diffMap = {
      beginner: t.beginner,
      easy: t.easy,
      medium: t.medium,
      hard: t.hard,
      expert: t.expert,
      evil: t.evil,
    };
    return diffMap[difficulty]?.toUpperCase() || difficulty.toUpperCase();
  };

  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Text style={styles.label}>{t.difficulty}</Text>
            <Text style={styles.value}>{getDifficultyText()}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.label}>{t.time}</Text>
            <Text style={styles.value}>{formatTime(timeElapsed)}</Text>
          </View>
        </View>
      </View>
      <View style={styles.buttonRow}>
        <TouchableOpacity 
          style={styles.button} 
          onPress={onNewGame}
          activeOpacity={0.7}>
          <Text style={styles.buttonText}>{t.newGame}</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.button} 
          onPress={onChangeDifficulty}
          activeOpacity={0.7}>
          <Text style={styles.buttonText}>{t.changeDifficulty}</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.settingsButton} 
          onPress={onSettings}
          activeOpacity={0.7}>
          <Text style={styles.settingsText}>⚙️</Text>
        </TouchableOpacity>
      </View>
      {(onUndo || onPause || onHint) && (
        <View style={[styles.buttonRow, {marginTop: 10}]}>
          {onUndo && (
            <TouchableOpacity 
              style={[styles.controlButton, !canUndo && styles.controlButtonDisabled]} 
              onPress={onUndo}
              disabled={!canUndo}
              activeOpacity={0.7}>
              <Text style={styles.controlButtonText}>↶ {t.undo}</Text>
            </TouchableOpacity>
          )}
          {onPause && (
            <TouchableOpacity 
              style={styles.controlButton} 
              onPress={onPause}
              activeOpacity={0.7}>
              <Text style={styles.controlButtonText}>{isPaused ? '▶ ' + t.resume : '⏸ ' + t.pause}</Text>
            </TouchableOpacity>
          )}
          {onHint && (
            <TouchableOpacity 
              style={styles.controlButton} 
              onPress={onHint}
              activeOpacity={0.7}>
              <Text style={styles.controlButtonText}>💡 {t.hint}</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  infoContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  infoItem: {
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  value: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 5,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  settingsButton: {
    backgroundColor: '#FF9800',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  settingsText: {
    fontSize: 20,
  },
  controlButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  controlButtonDisabled: {
    backgroundColor: '#BDBDBD',
    opacity: 0.5,
  },
  controlButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
