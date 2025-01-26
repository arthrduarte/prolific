import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'

interface MultipleChoiceProps {
  options: string[]
  selectedOption: string | null
  correctAnswer: string
  isAnswered: boolean
  onSelect: (option: string) => void
}

export const MultipleChoice: React.FC<MultipleChoiceProps> = ({
  options,
  selectedOption,
  correctAnswer,
  isAnswered,
  onSelect,
}) => {
  return (
    <View style={styles.optionsContainer}>
      {options.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.optionButton,
            selectedOption === option && !isAnswered && styles.selectedOption,
            isAnswered && option === correctAnswer && styles.correctOption,
            isAnswered && selectedOption === option && option !== correctAnswer && styles.incorrectOption,
          ]}
          onPress={() => onSelect(option)}
          disabled={isAnswered}
          activeOpacity={0.9}
        >
          <Text style={[
            styles.optionText,
            selectedOption === option && !isAnswered && styles.selectedOptionText,
            isAnswered && option === correctAnswer && styles.correctOptionText,
            isAnswered && selectedOption === option && option !== correctAnswer && styles.incorrectOptionText,
          ]}>
            {option}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  optionsContainer: {
    marginBottom: 24,
    gap: 12,
  },
  optionButton: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#f1f3f5',
  },
  selectedOption: {
    backgroundColor: '#ffd43b',
  },
  correctOption: {
    backgroundColor: '#ffd43b',
  },
  incorrectOption: {
    backgroundColor: '#868e96',
  },
  optionText: {
    fontSize: 16,
    color: '#495057',
    fontWeight: '600',
  },
  selectedOptionText: {
    color: '#000',
  },
  correctOptionText: {
    color: '#000',
  },
  incorrectOptionText: {
    color: '#fff',
  },
});
