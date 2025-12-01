import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../navigation/AppNavigator';
import {useThemeStore} from '../store/themeStore';

type HowToPlayScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'HowToPlay'
>;

type Props = {
  navigation: HowToPlayScreenNavigationProp;
};

const HowToPlayScreen = ({navigation}: Props) => {
  const {theme, mode} = useThemeStore();
  
  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <StatusBar 
        barStyle={mode === 'dark' ? 'light-content' : 'dark-content'} 
        backgroundColor={theme.colors.background} 
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}>
        <Text style={[styles.title, {color: theme.colors.text}]}>❓ Nasıl Oynanır</Text>

        <View style={[styles.section, {backgroundColor: theme.colors.surface}]}>
          <Text style={[styles.sectionTitle, {color: theme.colors.success}]}>🎯 Amaç</Text>
          <Text style={[styles.text, {color: theme.colors.textSecondary}]}>
            9x9'luk ızgarayı, her satır, sütun ve 3x3'lük bölgede 1-9 arası
            rakamların sadece bir kez geçecek şekilde doldurun.
          </Text>
        </View>

        <View style={[styles.section, {backgroundColor: theme.colors.surface}]}>
          <Text style={[styles.sectionTitle, {color: theme.colors.success}]}>🎮 Nasıl Oynanır</Text>
          <Text style={[styles.text, {color: theme.colors.textSecondary}]}>
            • Bir hücreye dokunarak seçin{'\n'}
            • Alt kısımdaki sayılardan birini seçerek yerleştirin{'\n'}
            • Veya sayıyı sürükleyip hücreye bırakın{'\n'}
            • Doğru yerleştirmeler yeşil, yanlışlar kırmızı olur
          </Text>
        </View>

        <View style={[styles.section, {backgroundColor: theme.colors.surface}]}>
          <Text style={[styles.sectionTitle, {color: theme.colors.success}]}>🛠️ Araçlar</Text>
          <Text style={[styles.text, {color: theme.colors.textSecondary}]}>
            ↩️ Geri Al: Son hamleni geri al{'\n'}
            ⏸️ Duraklat: Oyunu duraklat{'\n'}
            💡 İpucu: Rastgele bir hücre için ipucu al{'\n'}
            🎯 Yeni Oyun: Yeni bir oyun başlat{'\n'}
            🎚️ Zorluk: Zorluk seviyesini değiştir
          </Text>
        </View>

        <View style={[styles.section, {backgroundColor: theme.colors.surface}]}>
          <Text style={[styles.sectionTitle, {color: theme.colors.success}]}>⭐ Zorluk Seviyeleri</Text>
          <Text style={[styles.text, {color: theme.colors.textSecondary}]}>
            Başlangıç: 50-55 ipucu{'\n'}
            Kolay: 45-50 ipucu{'\n'}
            Orta: 35-40 ipucu{'\n'}
            Zor: 30-35 ipucu{'\n'}
            Uzman: 25-28 ipucu{'\n'}
            Şeytan: 22-25 ipucu
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.playButton, {backgroundColor: theme.colors.success}]}
          onPress={() => {
            navigation.goBack();
            navigation.navigate('LevelSelect');
          }}>
          <Text style={[styles.playButtonText, {color: theme.colors.text}]}>Oynamaya Başla! 🎮</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.backButton, {backgroundColor: theme.colors.surface}]}
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
  section: {
    marginBottom: 25,
    padding: 20,
    borderRadius: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
  },
  playButton: {
    padding: 18,
    borderRadius: 12,
    marginBottom: 15,
    marginTop: 10,
  },
  playButtonText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  backButton: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  backButtonText: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default HowToPlayScreen;
