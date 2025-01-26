import React from 'react'
import { View, TextInput, StyleSheet } from 'react-native'

interface InputProps {
  value: string
  isAnswered: boolean
  isCorrect: boolean
  onChangeText: (text: string) => void
}

export const Input: React.FC<InputProps> = ({
  value,
  isAnswered,
  isCorrect,
  onChangeText,
}) => {
  return (
    <View style={styles.textInputContainer}>
      <TextInput
        style={[
          styles.textInput,
          !isAnswered && value && styles.activeTextInput,
          isAnswered && isCorrect && styles.correctTextInput,
          isAnswered && !isCorrect && styles.incorrectTextInput,
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder="Type your answer here..."
        placeholderTextColor="#868e96"
        editable={!isAnswered}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  textInputContainer: {
    marginBottom: 24,
  },
  textInput: {
    borderWidth: 2,
    borderColor: '#f1f3f5',
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#000',
  },
  activeTextInput: {
    borderColor: '#ffd43b',
    backgroundColor: '#fff8db',
  },
  correctTextInput: {
    backgroundColor: '#212529',
    borderColor: '#212529',
    color: '#fff',
  },
  incorrectTextInput: {
    backgroundColor: '#868e96',
    borderColor: '#868e96',
    color: '#fff',
  },
})
