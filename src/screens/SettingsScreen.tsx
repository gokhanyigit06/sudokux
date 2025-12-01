import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Switch,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../navigation/AppNavigator';
import {launchImageLibrary} from 'react-native-image-picker';
import {useThemeStore} from '../store/themeStore';

type SettingsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Settings'
>;

type Props = {
  navigation: SettingsScreenNavigationProp;
};

const SettingsScreen = ({navigation}: Props) => {
  const [language, setLanguage] = useState<'tr' | 'en'>('tr');
  const {theme, mode, toggleTheme} = useThemeStore();

  const handleChangeBackground = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.8,
      },
      response => {
        if (response.assets && response.assets[0]?.uri) {
          // Save to storage
          console.log('Background selected:', response.assets[0].uri);
        }
      },
    );
  };

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <StatusBar barStyle={mode === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={theme.colors.background} />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Text style={[styles.title, {color: theme.colors.text}]}>⚙️ Ayarlar</Text>

        {/* Theme Section */}
        <View style={[styles.section, {backgroundColor: theme.colors.surface}]}>
          <Text style={[styles.sectionTitle, {color: theme.colors.text}]}>🌙 Tema</Text>
          <View style={styles.languageButtons}>
            <TouchableOpacity
              style={[
                styles.languageButton,
                {borderColor: theme.colors.border},
                mode === 'light' && {backgroundColor: theme.colors.primary},
              ]}
              onPress={() => mode !== 'light' && toggleTheme()}>
              <Text
                style={[
                  styles.languageButtonText,
                  {color: theme.colors.text},
                  mode === 'light' && {color: '#fff'},
                ]}>
                ☀️ Açık
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.languageButton,
                {borderColor: theme.colors.border},
                mode === 'dark' && {backgroundColor: theme.colors.primary},
              ]}
              onPress={() => mode !== 'dark' && toggleTheme()}>
              <Text
                style={[
                  styles.languageButtonText,
                  {color: theme.colors.text},
                  mode === 'dark' && {color: '#fff'},
                ]}>
                🌙 Koyu
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Language Section */}
        <View style={[styles.section, {backgroundColor: theme.colors.surface}]}>
          <Text style={[styles.sectionTitle, {color: theme.colors.text}]}>🌍 Dil</Text>
          <View style={styles.languageButtons}>
            <TouchableOpacity
              style={[
                styles.languageButton,
                {borderColor: theme.colors.border},
                language === 'tr' && {backgroundColor: theme.colors.primary},
              ]}
              onPress={() => setLanguage('tr')}>
              <Text
                style={[
                  styles.languageButtonText,
                  {color: theme.colors.text},
                  language === 'tr' && {color: '#fff'},
                ]}>
                Türkçe
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.languageButton,
                {borderColor: theme.colors.border},
                language === 'en' && {backgroundColor: theme.colors.primary},
              ]}
              onPress={() => setLanguage('en')}>
              <Text
                style={[
                  styles.languageButtonText,
                  {color: theme.colors.text},
                  language === 'en' && {color: '#fff'},
                ]}>
                English
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Background Section */}
        <View style={[styles.section, {backgroundColor: theme.colors.surface}]}>
          <Text style={[styles.sectionTitle, {color: theme.colors.text}]}>🎨 Arkaplan</Text>
          <TouchableOpacity
            style={[styles.settingButton, {backgroundColor: theme.colors.card, borderColor: theme.colors.border}]}
            onPress={handleChangeBackground}>
            <Text style={[styles.settingButtonText, {color: theme.colors.text}]}>Arkaplan Değiştir</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.settingButton, styles.removeButton, {backgroundColor: theme.colors.card, borderColor: theme.colors.border}]}>
            <Text style={[styles.settingButtonText, {color: theme.colors.error}]}>Arkaplanı Kaldır</Text>
          </TouchableOpacity>
        </View>

        {/* Sound & Vibration Section */}
        <View style={[styles.section, {backgroundColor: theme.colors.surface}]}>
          <Text style={[styles.sectionTitle, {color: theme.colors.text}]}>🔊 Ses & Titreşim</Text>
          <Text style={[styles.comingSoon, {color: theme.colors.textSecondary}]}>Yakında...</Text>
        </View>

        <TouchableOpacity
          style={[styles.backButton, {backgroundColor: theme.colors.primary}]}
          onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>← Geri Dön</Text>
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
    marginBottom: 30,
    padding: 15,
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
  },
  languageButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  languageButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    borderWidth: 2,
  },
  languageButtonText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  settingButton: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
  },
  removeButton: {
    marginBottom: 0,
  },
  settingButtonText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  comingSoon: {
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  backButton: {
    padding: 16,
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 40,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
});

export default SettingsScreen;
