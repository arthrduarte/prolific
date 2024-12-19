import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

interface ExplanationProps {
  isCorrect: boolean
  explanation: string
}

export const Explanation: React.FC<ExplanationProps> = ({
  isCorrect,
  explanation,
}) => {
  return (
    <View style={styles.explanationContainer}>
      <Text style={styles.explanationTitle}>
        {isCorrect ? '🎉 Correct!' : '💡 Explanation'}
      </Text>
      <Text style={styles.explanationText}>
        {explanation}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  explanationContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginTop: 24,
    marginBottom: 24,
  },
  explanationTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    marginBottom: 8,
  },
  explanationText: {
    fontSize: 16,
    color: '#495057',
    lineHeight: 24,
  },
})
