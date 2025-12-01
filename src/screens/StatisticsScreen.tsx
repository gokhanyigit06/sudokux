import React, {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../navigation/AppNavigator';
import {useStatisticsStore} from '../store/statisticsStore';
import {useLevelStore} from '../store/levelStore';
import {useThemeStore} from '../store/themeStore';

type StatisticsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Statistics'
>;

type Props = {
  navigation: StatisticsScreenNavigationProp;
};

const StatisticsScreen = ({navigation}: Props) => {
  const {
    gamesPlayed,
    gamesCompleted,
    bestTimes,
    currentStreak,
    longestStreak,
    totalPlayTime,
    loadStatistics,
    resetStatistics,
  } = useStatisticsStore();
  
  const {levels} = useLevelStore();
  const {theme, mode} = useThemeStore();

  useEffect(() => {
    loadStatistics();
  }, []);

  // Calculate totals
  const totalGamesPlayed = Object.values(gamesPlayed).reduce((a, b) => a + b, 0);
  const totalGamesCompleted = Object.values(gamesCompleted).reduce((a, b) => a + b, 0);
  
  // Count completed levels and total stars from levelStore
  const completedLevelsCount = levels.filter(l => l.isCompleted).length;
  const totalStars = levels.reduce((sum, l) => sum + (l.stars || 0), 0);
  
  // Calculate completion percentage
  const completionPercentage = ((completedLevelsCount / 500) * 100).toFixed(1);

  // Format play time
  const formatPlayTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  // Format time
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Get best time across all difficulties
  const getBestOverallTime = (): string => {
    const times = Object.values(bestTimes).filter(t => t !== Infinity);
    if (times.length === 0) return '-';
    return formatTime(Math.min(...times));
  };

  const handleReset = () => {
    Alert.alert(
      'İstatistikleri Sıfırla',
      'Tüm istatistikleriniz silinecek. Emin misiniz?',
      [
        {text: 'İptal', style: 'cancel'},
        {
          text: 'Sıfırla',
          style: 'destructive',
          onPress: () => {
            resetStatistics();
            Alert.alert('Başarılı', 'İstatistikler sıfırlandı');
          },
        },
      ]
    );
  };
  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <StatusBar barStyle={mode === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={theme.colors.background} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}>
        <Text style={[styles.title, {color: theme.colors.text}]}>📊 İstatistikler</Text>

        <View style={styles.statsGrid}>
          <View style={[styles.statCard, {backgroundColor: theme.colors.card}]}>
            <Text style={[styles.statValue, {color: theme.colors.success}]}>{totalGamesPlayed}</Text>
            <Text style={[styles.statLabel, {color: theme.colors.textSecondary}]}>Başlanan Oyun</Text>
          </View>

          <View style={[styles.statCard, {backgroundColor: theme.colors.card}]}>
            <Text style={[styles.statValue, {color: theme.colors.success}]}>{totalGamesCompleted}</Text>
            <Text style={[styles.statLabel, {color: theme.colors.textSecondary}]}>Tamamlanan</Text>
          </View>

          <View style={[styles.statCard, {backgroundColor: theme.colors.card}]}>
            <Text style={[styles.statValue, {color: theme.colors.success}]}>{totalStars}⭐</Text>
            <Text style={[styles.statLabel, {color: theme.colors.textSecondary}]}>Toplam Yıldız</Text>
          </View>

          <View style={[styles.statCard, {backgroundColor: theme.colors.card}]}>
            <Text style={[styles.statValue, {color: theme.colors.success}]}>{currentStreak}🔥</Text>
            <Text style={[styles.statLabel, {color: theme.colors.textSecondary}]}>Güncel Seri</Text>
          </View>

          <View style={[styles.statCard, {backgroundColor: theme.colors.card}]}>
            <Text style={[styles.statValue, {color: theme.colors.success}]}>{longestStreak}🏆</Text>
            <Text style={[styles.statLabel, {color: theme.colors.textSecondary}]}>En Uzun Seri</Text>
          </View>

          <View style={[styles.statCard, {backgroundColor: theme.colors.card}]}>
            <Text style={[styles.statValue, {color: theme.colors.success}]}>{formatPlayTime(totalPlayTime)}</Text>
            <Text style={[styles.statLabel, {color: theme.colors.textSecondary}]}>Toplam Süre</Text>
          </View>

          <View style={[styles.statCard, {backgroundColor: theme.colors.card}]}>
            <Text style={[styles.statValue, {color: theme.colors.success}]}>{getBestOverallTime()}</Text>
            <Text style={[styles.statLabel, {color: theme.colors.textSecondary}]}>En İyi Zaman</Text>
          </View>

          <View style={[styles.statCard, {backgroundColor: theme.colors.card}]}>
            <Text style={[styles.statValue, {color: theme.colors.success}]}>{completedLevelsCount}/500</Text>
            <Text style={[styles.statLabel, {color: theme.colors.textSecondary}]}>Level İlerlemesi</Text>
          </View>
        </View>

        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, {backgroundColor: theme.colors.card}]}>
            <View style={[styles.progressFill, {width: `${completionPercentage}%` as any, backgroundColor: theme.colors.success}]} />
          </View>
          <Text style={[styles.progressText, {color: theme.colors.textSecondary}]}>%{completionPercentage} Tamamlandı</Text>
        </View>

        <TouchableOpacity style={[styles.resetButton, {backgroundColor: theme.colors.error}]} onPress={handleReset}>
          <Text style={styles.resetButtonText}>🗑️ İstatistikleri Sıfırla</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.backButton, {backgroundColor: theme.colors.card}]}
          onPress={() => navigation.goBack()}>
          <Text style={[styles.backButtonText, {color: theme.colors.text}]}>← Geri Dön</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    alignItems: 'center',
    width: '48%',
  },
  statValue: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 16,
  },
  progressContainer: {
    marginTop: 20,
    marginBottom: 30,
  },
  progressBar: {
    height: 20,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
  },
  progressText: {
    textAlign: 'center',
    fontSize: 14,
  },
  resetButton: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginBottom: 15,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  backButton: {
    padding: 15,
    borderRadius: 10,
  },
  backButtonText: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default StatisticsScreen;
