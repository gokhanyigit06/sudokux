import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useThemeStore} from '../store/themeStore';

interface CountdownTimerProps {
  initialTime: number; // seconds
  onTimeUp: () => void;
  isPaused: boolean;
  isComplete: boolean;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  initialTime,
  onTimeUp,
  isPaused,
  isComplete,
}) => {
  const {theme} = useThemeStore();
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    setTimeLeft(initialTime);
  }, [initialTime]);

  useEffect(() => {
    if (isComplete || isPaused || timeLeft <= 0) {
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, isComplete, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    if (timeLeft < 60) return theme.colors.error; // Red - under 1 min
    if (timeLeft < 180) return '#FF9800'; // Orange - under 3 min
    return theme.colors.success; // Green
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.timer, {color: getTimerColor()}]}>
        ⏱️ {formatTime(timeLeft)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  timer: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
