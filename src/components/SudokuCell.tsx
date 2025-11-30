import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Cell} from '../types';

interface SudokuCellProps {
  cell: Cell;
  row: number;
  col: number;
  selectedCell: {row: number; col: number} | null;
  onCellPress: (row: number, col: number) => void;
}

export const SudokuCell: React.FC<SudokuCellProps> = ({
  cell,
  row,
  col,
  selectedCell,
  onCellPress,
}) => {
  const isSelected = selectedCell?.row === row && selectedCell?.col === col;
  const isSameRow = selectedCell?.row === row;
  const isSameCol = selectedCell?.col === col;
  const isSameBox =
    selectedCell &&
    Math.floor(selectedCell.row / 3) === Math.floor(row / 3) &&
    Math.floor(selectedCell.col / 3) === Math.floor(col / 3);

  return (
    <TouchableOpacity
      style={[
        styles.cell,
        col % 3 === 2 && col !== 8 && styles.rightBorder,
        row % 3 === 2 && row !== 8 && styles.bottomBorder,
        isSelected && styles.selectedCell,
        (isSameRow || isSameCol || isSameBox) && styles.highlightedCell,
        !cell.isValid && styles.invalidCell,
      ]}
      onPress={() => onCellPress(row, col)}
      disabled={cell.isFixed}>
      <Text
        style={[
          styles.cellText,
          cell.isFixed && styles.fixedCellText,
          !cell.isValid && styles.invalidCellText,
        ]}>
        {cell.value || ''}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cell: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: '#999',
    backgroundColor: '#fff',
  },
  cellText: {
    fontSize: 20,
    fontWeight: '400',
    color: '#2196F3',
  },
  fixedCellText: {
    color: '#000',
    fontWeight: '700',
  },
  rightBorder: {
    borderRightWidth: 2,
    borderRightColor: '#333',
  },
  bottomBorder: {
    borderBottomWidth: 2,
    borderBottomColor: '#333',
  },
  selectedCell: {
    backgroundColor: '#BBDEFB',
  },
  highlightedCell: {
    backgroundColor: '#E3F2FD',
  },
  invalidCell: {
    backgroundColor: '#FFCDD2',
  },
  invalidCellText: {
    color: '#D32F2F',
  },
});
