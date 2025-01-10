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
            selectedOption === option && styles.selectedOption,
            isAnswered && option === correctAnswer && styles.correctOption,
            isAnswered && selectedOption === option && option !== correctAnswer && styles.incorrectOption,
          ]}
          onPress={() => onSelect(option)}
          disabled={isAnswered}
          activeOpacity={0.7}
        >
          <Text style={[
            styles.optionText,
            selectedOption === option && styles.selectedOptionText,
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
  },
  optionButton: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#e9ecef',
  },
  selectedOption: {
    backgroundColor: '#e7f5ff',
    borderColor: '#339af0',
  },
  correctOption: {
    backgroundColor: '#d3f9d8',
    borderColor: '#40c057',
  },
  incorrectOption: {
    backgroundColor: '#ffe3e3',
    borderColor: '#fa5252',
  },
  optionText: {
    fontSize: 16,
    color: '#495057',
    fontWeight: '500',
  },
  selectedOptionText: {
    color: '#1971c2',
    fontWeight: '600',
  },
  correctOptionText: {
    color: '#2b8a3e',
    fontWeight: '600',
  },
  incorrectOptionText: {
    color: '#c92a2a',
    fontWeight: '600',
  },
})
