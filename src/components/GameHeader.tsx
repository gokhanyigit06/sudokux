import React from 'react';
import {Alert, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Difficulty} from '../types';
import {translations} from '../utils/translations';
import {useThemeStore} from '../store/themeStore';

interface GameHeaderProps {
  difficulty: Difficulty;
  timeElapsed: number;
  onNewGame: () => void;
  onChangeDifficulty: () => void;
  onSettings: () => void;
  onUndo?: () => void;
  onPause?: () => void;
  onHint?: () => void;
  onPencilToggle?: () => void;
  canUndo?: boolean;
  isPaused?: boolean;
  isPencilMode?: boolean;
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
  onPencilToggle,
  canUndo = false,
  isPaused = false,
  isPencilMode = false,
  language,
}) => {
  const {theme} = useThemeStore();
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
      <View style={[styles.infoContainer, {backgroundColor: theme.colors.surface}]}>
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Text style={[styles.label, {color: theme.colors.textSecondary}]}>{t.difficulty}</Text>
            <Text style={[styles.value, {color: theme.colors.text}]}>{getDifficultyText()}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={[styles.label, {color: theme.colors.textSecondary}]}>{t.time}</Text>
            <Text style={[styles.value, {color: theme.colors.text}]}>{formatTime(timeElapsed)}</Text>
          </View>
        </View>
      </View>
      <View style={styles.buttonRow}>
        <TouchableOpacity 
          style={[styles.button, {backgroundColor: theme.colors.success}]} 
          onPress={onNewGame}
          activeOpacity={0.7}>
          <Text style={styles.buttonText}>{t.newGame}</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.button, {backgroundColor: theme.colors.success}]} 
          onPress={onChangeDifficulty}
          activeOpacity={0.7}>
          <Text style={styles.buttonText}>{t.changeDifficulty}</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.settingsButton, {backgroundColor: '#FF9800'}]} 
          onPress={onSettings}
          activeOpacity={0.7}>
          <Text style={styles.settingsText}>⚙️</Text>
        </TouchableOpacity>
      </View>
      {(onUndo || onPause || onHint || onPencilToggle) && (
        <View style={[styles.buttonRow, {marginTop: 10}]}>
          {onPencilToggle && (
            <TouchableOpacity 
              style={[styles.controlButton, {backgroundColor: isPencilMode ? '#9C27B0' : theme.colors.primary}]} 
              onPress={onPencilToggle}
              activeOpacity={0.7}>
              <Text style={styles.controlButtonText}>✏️ {isPencilMode ? 'Normal' : 'Kalem'}</Text>
            </TouchableOpacity>
          )}
          {onUndo && (
            <TouchableOpacity 
              style={[styles.controlButton, {backgroundColor: canUndo ? theme.colors.primary : theme.colors.textSecondary, opacity: canUndo ? 1 : 0.5}]} 
              onPress={onUndo}
              disabled={!canUndo}
              activeOpacity={0.7}>
              <Text style={styles.controlButtonText}>↶ {t.undo}</Text>
            </TouchableOpacity>
          )}
          {onPause && (
            <TouchableOpacity 
              style={[styles.controlButton, {backgroundColor: theme.colors.primary}]} 
              onPress={onPause}
              activeOpacity={0.7}>
              <Text style={styles.controlButtonText}>{isPaused ? '▶ ' + t.resume : '⏸ ' + t.pause}</Text>
            </TouchableOpacity>
          )}
          {onHint && (
            <TouchableOpacity 
              style={[styles.controlButton, {backgroundColor: theme.colors.primary}]} 
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
    marginBottom: 5,
  },
  value: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
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
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  settingsText: {
    fontSize: 20,
  },
  controlButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  controlButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
