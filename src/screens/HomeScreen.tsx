import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../navigation/AppNavigator';
import {useThemeStore} from '../store/themeStore';

type HomeScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Home'
>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

const HomeScreen = ({navigation}: Props) => {
  const {theme, mode} = useThemeStore();
  
  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <StatusBar barStyle={mode === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={theme.colors.background} />
      
      <View style={styles.header}>
          <Text style={styles.logo}>🎯</Text>
          <Text style={[styles.title, {color: theme.colors.text}]}>SUDOKU CHALLENGE X</Text>
          <Text style={[styles.tagline, {color: theme.colors.success}]}>500 Levels • Master the Grid</Text>
        </View>

        <View style={styles.menuContainer}>
          <MenuButton
            title="🎮 Oyuna Başla"
            onPress={() => navigation.navigate('LevelSelect')}
            color="#4CAF50"
          />
          <MenuButton
            title="📊 İstatistikler"
            onPress={() => navigation.navigate('Statistics')}
            color="#2196F3"
          />
          <MenuButton
            title="⚙️ Ayarlar"
            onPress={() => navigation.navigate('Settings')}
            color="#FF9800"
          />
          <MenuButton
            title="❓ Nasıl Oynanır"
            onPress={() => navigation.navigate('HowToPlay')}
            color="#9C27B0"
          />
        </View>

      <Text style={[styles.version, {color: theme.colors.textSecondary}]}>v1.0.0</Text>
    </View>
  );
};

type MenuButtonProps = {
  title: string;
  onPress: () => void;
  color: string;
};

const MenuButton = ({title, onPress, color}: MenuButtonProps) => (
  <TouchableOpacity
    style={[styles.button, {backgroundColor: color}]}
    onPress={onPress}
    activeOpacity={0.8}>
    <Text style={styles.buttonText}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 60,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
  },
  logo: {
    fontSize: 80,
    marginBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 2,
  },
  tagline: {
    fontSize: 16,
    marginTop: 8,
    letterSpacing: 1,
  },
  menuContainer: {
    paddingHorizontal: 40,
    gap: 16,
  },
  button: {
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    letterSpacing: 1,
  },
  version: {
    textAlign: 'center',
    fontSize: 12,
  },
});

export default HomeScreen;
