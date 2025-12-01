import React, {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  StatusBar,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../navigation/AppNavigator';
import {useLevelStore} from '../store/levelStore';
import {useThemeStore} from '../store/themeStore';

type LevelSelectScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'LevelSelect'
>;

type Props = {
  navigation: LevelSelectScreenNavigationProp;
};

const LevelSelectScreen = ({navigation}: Props) => {
  const {levels, initializeLevels} = useLevelStore();
  const {theme, mode} = useThemeStore();

  useEffect(() => {
    initializeLevels();
  }, []);

  const renderLevelCard = ({item}: {item: any}) => {
    const getCardColor = () => {
      if (!item.isUnlocked) return '#2a2a3e';
      if (item.stars === 3) return '#FFD700'; // Gold
      if (item.stars === 2) return '#C0C0C0'; // Silver
      if (item.stars === 1) return '#CD7F32'; // Bronze
      if (item.isCompleted) return '#4CAF50';
      return '#2196F3';
    };

    const getStars = () => {
      if (item.stars === 0) return '';
      return '⭐'.repeat(item.stars);
    };

    return (
      <TouchableOpacity
        style={[
          styles.levelCard,
          {
            backgroundColor: getCardColor(),
            opacity: item.isUnlocked ? 1 : 0.4,
          },
        ]}
        onPress={() => {
          if (item.isUnlocked) {
            navigation.navigate('Game', {levelId: item.id});
          }
        }}
        disabled={!item.isUnlocked}>
        <Text style={styles.levelNumber}>{item.id}</Text>
        {item.stars > 0 && <Text style={styles.stars}>{getStars()}</Text>}
        {!item.isUnlocked && <Text style={styles.lockIcon}>🔒</Text>}
        {item.bestTime && (
          <Text style={styles.bestTime}>
            {Math.floor(item.bestTime / 60)}:{(item.bestTime % 60).toString().padStart(2, '0')}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  const completedCount = levels.filter(l => l.isCompleted).length;
  const totalStars = levels.reduce((sum, l) => sum + l.stars, 0);

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <StatusBar barStyle={mode === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={theme.colors.background} />
      
      <View style={[styles.header, {borderBottomColor: theme.colors.border}]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Text style={[styles.backButtonText, {color: theme.colors.text}]}>← Geri</Text>
        </TouchableOpacity>
        <Text style={[styles.title, {color: theme.colors.text}]}>Level Seçimi</Text>
        <View style={styles.stats}>
          <Text style={[styles.statsText, {color: theme.colors.success}]}>{completedCount}/500</Text>
          <Text style={[styles.statsText, {color: theme.colors.success}]}>⭐ {totalStars}</Text>
        </View>
      </View>

      <FlatList
        data={levels}
        renderItem={renderLevelCard}
        keyExtractor={item => item.id.toString()}
        numColumns={5}
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  stats: {
    alignItems: 'flex-end',
  },
  statsText: {
    fontSize: 14,
    fontWeight: '600',
  },
  grid: {
    padding: 10,
  },
  levelCard: {
    width: 65,
    height: 65,
    margin: 5,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  levelNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  stars: {
    fontSize: 10,
    marginTop: 2,
  },
  lockIcon: {
    position: 'absolute',
    fontSize: 20,
  },
  bestTime: {
    fontSize: 9,
    color: '#fff',
    marginTop: 2,
  },
});

export default LevelSelectScreen;
