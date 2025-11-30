import React, {useRef, useState} from 'react';
import {
  Animated,
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';
import {translations} from '../utils/translations';

interface DraggableNumberPadProps {
  onNumberPress: (num: number) => void;
  onClear: () => void;
  language: 'tr' | 'en';
  onDragNumber?: (num: number, x: number, y: number) => void;
}

export const DraggableNumberPad: React.FC<DraggableNumberPadProps> = ({
  onNumberPress,
  onClear,
  language,
  onDragNumber,
}) => {
  const t = translations[language];
  const [draggedNumber, setDraggedNumber] = useState<number | null>(null);
  const pan = useRef(new Animated.ValueXY()).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const createPanResponder = (num: number) => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Start dragging if moved more than 5 pixels
        return Math.abs(gestureState.dx) > 5 || Math.abs(gestureState.dy) > 5;
      },
      onPanResponderGrant: () => {
        setDraggedNumber(num);
        Animated.spring(opacity, {
          toValue: 0.7,
          useNativeDriver: false,
        }).start();
      },
      onPanResponderMove: Animated.event(
        [null, {dx: pan.x, dy: pan.y}],
        {useNativeDriver: false}
      ),
      onPanResponderRelease: (_, gestureState) => {
        const {moveX, moveY, dx, dy} = gestureState;
        
        // Reset animation
        Animated.parallel([
          Animated.spring(pan, {
            toValue: {x: 0, y: 0},
            useNativeDriver: false,
          }),
          Animated.spring(opacity, {
            toValue: 1,
            useNativeDriver: false,
          }),
        ]).start();

        const wasDragged = Math.abs(dx) > 10 || Math.abs(dy) > 10;

        if (wasDragged && onDragNumber) {
          // Call drag handler with coordinates
          onDragNumber(num, moveX, moveY);
        } else {
          // If not dragged far, treat as normal press
          onNumberPress(num);
        }
        
        setDraggedNumber(null);
      },
    });
  };

  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <View style={styles.container}>
      <View style={styles.numberRow}>
        {numbers.slice(0, 5).map((num) => {
          const panResponder = createPanResponder(num);
          return (
            <Animated.View
              key={num}
              {...panResponder.panHandlers}
              style={[
                styles.numberButton,
                {
                  transform: draggedNumber === num ? pan.getTranslateTransform() : [],
                  opacity: draggedNumber === num ? opacity : 1,
                },
              ]}>
              <Text style={styles.numberText}>{num}</Text>
            </Animated.View>
          );
        })}
      </View>
      <View style={styles.numberRow}>
        {numbers.slice(5).map((num) => {
          const panResponder = createPanResponder(num);
          return (
            <Animated.View
              key={num}
              {...panResponder.panHandlers}
              style={[
                styles.numberButton,
                {
                  transform: draggedNumber === num ? pan.getTranslateTransform() : [],
                  opacity: draggedNumber === num ? opacity : 1,
                },
              ]}>
              <Text style={styles.numberText}>{num}</Text>
            </Animated.View>
          );
        })}
        <TouchableOpacity style={styles.clearButton} onPress={onClear}>
          <Text style={styles.clearText}>{t.clear}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    width: '100%',
    paddingHorizontal: 10,
  },
  numberRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  numberButton: {
    backgroundColor: '#fff',
    width: 60,
    height: 60,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  numberText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  clearButton: {
    backgroundColor: '#f44336',
    width: 60,
    height: 60,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  clearText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
});
