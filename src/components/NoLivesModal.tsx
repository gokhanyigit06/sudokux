import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from 'react-native';
import {useThemeStore} from '../store/themeStore';

interface NoLivesModalProps {
  visible: boolean;
  onWatchAd?: () => void;
  onClose: () => void;
  nextLifeTime: string;
  hasAds?: boolean;
}

export const NoLivesModal: React.FC<NoLivesModalProps> = ({
  visible,
  onWatchAd,
  onClose,
  nextLifeTime,
  hasAds = false,
}) => {
  const {theme} = useThemeStore();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.modalContent, {backgroundColor: theme.colors.surface}]}>
          <Text style={[styles.title, {color: theme.colors.text}]}>💔 Canınız Bitti!</Text>
          <Text style={[styles.message, {color: theme.colors.textSecondary}]}>
            Maalesef canınız kalmadı. Yeni can kazanmak için bekleyin veya reklam izleyin.
          </Text>

          <View style={[styles.livesInfo, {backgroundColor: theme.colors.card}]}>
            <Text style={[styles.infoText, {color: theme.colors.textSecondary}]}>Sonraki can:</Text>
            <Text style={[styles.timer, {color: theme.colors.success}]}>{nextLifeTime}</Text>
          </View>

          <View style={styles.buttons}>
            {hasAds && onWatchAd && (
              <TouchableOpacity
                style={[styles.button, {backgroundColor: '#9C27B0'}]}
                onPress={onWatchAd}>
                <Text style={styles.buttonText}>📺 Reklam İzle</Text>
                <Text style={styles.buttonSubtext}>+1 Can</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.button, {backgroundColor: theme.colors.textSecondary}]}
              onPress={onClose}>
              <Text style={styles.buttonText}>Tamam</Text>
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
    marginBottom: 20,
  },
  livesInfo: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  infoText: {
    fontSize: 14,
    marginBottom: 5,
  },
  timer: {
    fontSize: 24,
    fontWeight: 'bold',
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
