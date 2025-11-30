import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Cell as CellType} from '../types';
import {SudokuCell} from './SudokuCell';

interface SudokuBoardProps {
  board: CellType[][];
  selectedCell: {row: number; col: number} | null;
  onCellPress: (row: number, col: number) => void;
  onLayout?: (layout: {x: number; y: number; width: number; height: number}) => void;
}

export const SudokuBoard: React.FC<SudokuBoardProps> = ({
  board,
  selectedCell,
  onCellPress,
  onLayout,
}) => {
  const handleLayout = (event: any) => {
    const {x, y, width, height} = event.nativeEvent.layout;
    if (onLayout) {
      onLayout({x, y, width, height});
    }
  };

  return (
    <View style={styles.board} onLayout={handleLayout}>
      {board.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((cell, colIndex) => (
            <SudokuCell
              key={`${rowIndex}-${colIndex}`}
              cell={cell}
              row={rowIndex}
              col={colIndex}
              selectedCell={selectedCell}
              onCellPress={onCellPress}
            />
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  board: {
    borderWidth: 2,
    borderColor: '#333',
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
  },
});
