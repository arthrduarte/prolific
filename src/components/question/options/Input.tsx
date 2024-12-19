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
          isAnswered && isCorrect && styles.correctTextInput,
          isAnswered && !isCorrect && styles.incorrectTextInput,
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder="Type your answer here..."
        placeholderTextColor="#adb5bd"
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
    borderColor: '#e9ecef',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#000',
  },
  correctTextInput: {
    backgroundColor: '#d3f9d8',
    borderColor: '#40c057',
  },
  incorrectTextInput: {
    backgroundColor: '#ffe3e3',
    borderColor: '#fa5252',
  },
})
