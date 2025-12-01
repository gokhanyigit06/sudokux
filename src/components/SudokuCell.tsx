import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Cell, Difficulty} from '../types';
import {useThemeStore} from '../store/themeStore';

interface SudokuCellProps {
  cell: Cell;
  row: number;
  col: number;
  selectedCell: {row: number; col: number} | null;
  onCellPress: (row: number, col: number) => void;
  difficulty: Difficulty;
}

export const SudokuCell: React.FC<SudokuCellProps> = ({
  cell,
  row,
  col,
  selectedCell,
  onCellPress,
  difficulty,
}) => {
  const {theme} = useThemeStore();
  const isSelected = selectedCell?.row === row && selectedCell?.col === col;
  const isSameRow = selectedCell?.row === row;
  const isSameCol = selectedCell?.col === col;
  const isSameBox =
    selectedCell &&
    Math.floor(selectedCell.row / 3) === Math.floor(row / 3) &&
    Math.floor(selectedCell.col / 3) === Math.floor(col / 3);

  // Kolay ve orta seviyede anında geri bildirim
  const showColorFeedback = difficulty === 'beginner' || difficulty === 'easy' || difficulty === 'medium';
  const showInvalidBackground = showColorFeedback && !cell.isValid && cell.value !== null && !cell.isFixed;
  const showValidBackground = showColorFeedback && cell.isValid && cell.value !== null && !cell.isFixed;

  // Render notes in 3x3 grid
  const renderNotes = () => {
    if (!cell.notes || cell.notes.length === 0 || cell.value !== null) {
      return null;
    }

    return (
      <View style={styles.notesContainer}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
          <Text
            key={num}
            style={[
              styles.noteText,
              {color: theme.colors.textSecondary},
              !cell.notes?.includes(num) && styles.noteTextHidden,
            ]}>
            {num}
          </Text>
        ))}
      </View>
    );
  };

  return (
    <TouchableOpacity
      style={[
        styles.cell,
        {
          backgroundColor: theme.colors.cellBackground,
          borderColor: theme.colors.cellBorder,
        },
        col % 3 === 2 && col !== 8 && [styles.rightBorder, {borderRightColor: theme.colors.border}],
        row % 3 === 2 && row !== 8 && [styles.bottomBorder, {borderBottomColor: theme.colors.border}],
        isSelected && {backgroundColor: theme.colors.cellSelected},
        (isSameRow || isSameCol || isSameBox) && !isSelected && {backgroundColor: theme.colors.cellHighlight},
        showInvalidBackground && {backgroundColor: theme.colors.cellInvalid},
        showValidBackground && {backgroundColor: theme.colors.cellValid},
      ]}
      onPress={() => onCellPress(row, col)}
      disabled={cell.isFixed}>
      {cell.value !== null ? (
        <Text
          style={[
            styles.cellText,
            {color: theme.colors.userCell},
            cell.isFixed && {color: theme.colors.fixedCell, fontWeight: '700'},
            !cell.isFixed && cell.value !== null && styles.userEnteredText,
          ]}>
          {cell.value}
        </Text>
      ) : (
        renderNotes()
      )}
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
  },
  cellText: {
    fontSize: 20,
    fontWeight: '400',
  },
  userEnteredText: {
    fontWeight: '600',
  },
  rightBorder: {
    borderRightWidth: 2,
  },
  bottomBorder: {
    borderBottomWidth: 2,
  },
  notesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    height: '100%',
    padding: 2,
  },
  noteText: {
    width: '33.33%',
    height: '33.33%',
    fontSize: 10,
    textAlign: 'center',
  },
  noteTextHidden: {
    opacity: 0,
  },
});
