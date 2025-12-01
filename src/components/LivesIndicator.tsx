import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useLivesStore} from '../store/livesStore';
import {useThemeStore} from '../store/themeStore';

export const LivesIndicator = () => {
  const {theme} = useThemeStore();
  const {lives, maxLives, getNextLifeTime, updateLives} = useLivesStore();
  const [nextLifeTime, setNextLifeTime] = useState(0);

  useEffect(() => {
    updateLives();
    
    const interval = setInterval(() => {
      updateLives();
      setNextLifeTime(getNextLifeTime());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderHearts = () => {
    const hearts = [];
    for (let i = 0; i < maxLives; i++) {
      hearts.push(
        <Text key={i} style={styles.heart}>
          {i < lives ? '❤️' : '🖤'}
        </Text>
      );
    }
    return hearts;
  };

  return (
    <View style={styles.container}>
      <View style={styles.heartsContainer}>{renderHearts()}</View>
      {lives < maxLives && nextLifeTime > 0 && (
        <Text style={[styles.timer, {color: theme.colors.success}]}>+1 {formatTime(nextLifeTime)}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  heartsContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  heart: {
    fontSize: 20,
  },
  timer: {
    fontSize: 10,
    marginTop: 2,
    fontWeight: '600',
  },
});
