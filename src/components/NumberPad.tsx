import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Language, translations} from '../utils/translations';
import {useThemeStore} from '../store/themeStore';

interface NumberPadProps {
  onNumberPress: (num: number) => void;
  onClear: () => void;
  language: Language;
}

export const NumberPad: React.FC<NumberPadProps> = ({
  onNumberPress,
  onClear,
  language,
}) => {
  const {theme} = useThemeStore();
  const t = translations[language];
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <View style={styles.container}>
      <View style={styles.numberGrid}>
        {numbers.map(num => (
          <TouchableOpacity
            key={num}
            style={[styles.numberButton, {backgroundColor: theme.colors.surface}]}
            onPress={() => onNumberPress(num)}>
            <Text style={[styles.numberText, {color: theme.colors.text}]}>{num}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity style={[styles.clearButton, {backgroundColor: theme.colors.error}]} onPress={onClear}>
        <Text style={styles.clearText}>{t.clear}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  numberGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  numberButton: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    margin: 5,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  numberText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  clearButton: {
    marginTop: 15,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignSelf: 'center',
  },
  clearText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});
