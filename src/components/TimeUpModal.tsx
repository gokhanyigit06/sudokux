import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from 'react-native';
import {useThemeStore} from '../store/themeStore';

interface TimeUpModalProps {
  visible: boolean;
  onRetry: () => void;
  onLevelSelect: () => void;
  onWatchAd?: () => void;
  hasAds?: boolean;
}

export const TimeUpModal: React.FC<TimeUpModalProps> = ({
  visible,
  onRetry,
  onLevelSelect,
  onWatchAd,
  hasAds = false,
}) => {
  const {theme} = useThemeStore();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onLevelSelect}>
      <View style={styles.overlay}>
        <View style={[styles.modalContent, {backgroundColor: theme.colors.surface}]}>
          <Text style={[styles.title, {color: theme.colors.text}]}>⏰ Süre Doldu!</Text>
          <Text style={[styles.message, {color: theme.colors.textSecondary}]}>
            Maalesef süre bitti. Tekrar denemek ister misiniz?
          </Text>

          <View style={styles.buttons}>
            {hasAds && onWatchAd && (
              <TouchableOpacity
                style={[styles.button, {backgroundColor: '#9C27B0'}]}
                onPress={onWatchAd}>
                <Text style={styles.buttonText}>📺 Reklam İzle</Text>
                <Text style={styles.buttonSubtext}>+5 Dakika</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity
              style={[styles.button, {backgroundColor: theme.colors.success}]}
              onPress={onRetry}>
              <Text style={styles.buttonText}>🔄 Tekrar Dene</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, {backgroundColor: theme.colors.primary}]}
              onPress={onLevelSelect}>
              <Text style={styles.buttonText}>📋 Level Seç</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    borderRadius: 20,
    padding: 30,
    width: '85%',
    maxWidth: 400,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 25,
  },
  buttons: {
    gap: 12,
  },
  button: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonSubtext: {
    color: '#fff',
    fontSize: 12,
    marginTop: 2,
  },
});
