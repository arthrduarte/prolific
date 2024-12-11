import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Dimensions, Animated } from 'react-native'
import { Exercise, Step } from '../types/database.types'
import { AudioPlayer } from './AudioPlayer'

type StepType = 'content' | 'multiple_choice' | 'true_false' | 'input'

interface QuestionProps {
  exercise: Exercise
  steps: Step[]
  currentStepIndex: number
  onStepComplete: () => void
}

export default function Question({ 
  exercise, 
  steps, 
  currentStepIndex,
  onStepComplete 
}: QuestionProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [inputAnswer, setInputAnswer] = useState('')
  const [isAnswered, setIsAnswered] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const fadeAnim = useState(new Animated.Value(1))[0]

  const currentStep = steps[currentStepIndex]

  useEffect(() => {
    setSelectedOption(null)
    setInputAnswer('')
    setIsAnswered(false)
    setIsCorrect(false)
    
    // Fade out and in animation when step changes
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start()
  }, [currentStepIndex])

  const handleOptionSelect = (option: string) => {
    if (isAnswered) return
    setSelectedOption(option)
  }

  const handleInputChange = (text: string) => {
    if (isAnswered) return
    setInputAnswer(text)
  }

  const handleSubmit = () => {
    if (isAnswered) return

    let userAnswer = ''
    if (currentStep.type === 'multiple_choice' || currentStep.type === 'true_false') {
      userAnswer = selectedOption || ''
    } else if (currentStep.type === 'input') {
      userAnswer = inputAnswer
    }

    const correct = userAnswer.toLowerCase() === currentStep.correct_answer?.toLowerCase()
    setIsCorrect(correct)
    setIsAnswered(true)
  }

  const handleNext = () => {
    onStepComplete()
  }

  const renderTable = (richContent: any) => {
    if (!richContent?.table) return null

    return (
      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          {Object.keys(richContent.table[0]).map((header, index) => (
            <Text 
              key={index} 
              style={[
                styles.tableCell, 
                styles.tableHeaderText,
                index === Object.keys(richContent.table[0]).length - 1 && styles.lastCell
              ]}
            >
              {header.charAt(0).toUpperCase() + header.slice(1)}
            </Text>
          ))}
        </View>
        {richContent.table.map((row: any, rowIndex: number) => (
          <View 
            key={rowIndex} 
            style={[
              styles.tableRow,
              rowIndex % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd
            ]}
          >
            {Object.values(row).map((value: any, colIndex: number) => (
              <Text 
                key={colIndex} 
                style={[
                  styles.tableCell,
                  colIndex === Object.values(row).length - 1 && styles.lastCell,
                  typeof value === 'number' && styles.numberCell
                ]}
              >
                {typeof value === 'number' ? value.toLocaleString() : value}
              </Text>
            ))}
          </View>
        ))}
      </View>
    )
  }

  const renderContent = () => {
    return (
      <Animated.View style={{ opacity: fadeAnim }}>
        <Text style={styles.questionText}>{currentStep.content}</Text>
        {currentStep.audio_id && (
          <AudioPlayer audioId={currentStep.audio_id} />
        )}
        {currentStep.rich_content && renderTable(currentStep.rich_content)}
        {(() => {
          switch (currentStep.type as StepType) {
            case 'content':
              return null

            case 'multiple_choice':
            case 'true_false':
              return (
                <View style={styles.optionsContainer}>
                  {currentStep.options?.map((option, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.optionButton,
                        selectedOption === option && styles.selectedOption,
                        isAnswered && option === currentStep.correct_answer && styles.correctOption,
                        isAnswered && selectedOption === option && option !== currentStep.correct_answer && styles.incorrectOption,
                      ]}
                      onPress={() => handleOptionSelect(option)}
                      disabled={isAnswered}
                      activeOpacity={0.7}
                    >
                      <Text style={[
                        styles.optionText,
                        selectedOption === option && styles.selectedOptionText,
                        isAnswered && option === currentStep.correct_answer && styles.correctOptionText,
                        isAnswered && selectedOption === option && option !== currentStep.correct_answer && styles.incorrectOptionText,
                      ]}>
                        {option}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )

            case 'input':
              return (
                <View style={styles.textInputContainer}>
                  <TextInput
                    style={[
                      styles.textInput,
                      isAnswered && isCorrect && styles.correctTextInput,
                      isAnswered && !isCorrect && styles.incorrectTextInput,
                    ]}
                    value={inputAnswer}
                    onChangeText={handleInputChange}
                    placeholder="Type your answer here..."
                    placeholderTextColor="#adb5bd"
                    editable={!isAnswered}
                  />
                </View>
              )

            default:
              return null
          }
        })()}
      </Animated.View>
    )
  }

  return (
    <ScrollView 
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.contentContainer}
    >
      {renderContent()}
      
      {currentStep.type !== 'content' && !isAnswered && (
        <TouchableOpacity
          style={[
            styles.button,
            (!selectedOption && currentStep.type !== 'input') ||
            (currentStep.type === 'input' && !inputAnswer)
              ? styles.buttonDisabled
              : styles.buttonEnabled,
          ]}
          onPress={handleSubmit}
          disabled={
            (!selectedOption && currentStep.type !== 'input') ||
            (currentStep.type === 'input' && !inputAnswer)
          }
        >
          <Text style={styles.buttonText}>Check Answer</Text>
        </TouchableOpacity>
      )}

      {(isAnswered || currentStep.type === 'content') && (
        <>
          {isAnswered && currentStep.explanation && (
            <View style={styles.explanationContainer}>
              <Text style={styles.explanationTitle}>
                {isCorrect ? '🎉 Correct!' : '💡 Explanation'}
              </Text>
              <Text style={styles.explanationText}>
                {currentStep.explanation}
              </Text>
            </View>
          )}
          <TouchableOpacity
            style={[styles.button, styles.buttonEnabled]}
            onPress={handleNext}
          >
            <Text style={styles.buttonText}>
              Continue
            </Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    lineHeight: 28,
    marginBottom: 24,
  },
  optionsContainer: {
    marginBottom: 24,
  },
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
  optionButton: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: '#f8f9fa',
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
  button: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonEnabled: {
    backgroundColor: '#f0dc1b',
  },
  buttonDisabled: {
    backgroundColor: '#e9ecef',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  explanationContainer: {
    padding: 16,
    backgroundColor: '#f8f9fa',
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
  tableContainer: {
    marginBottom: 24,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e9ecef',
    backgroundColor: '#fff',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  tableHeaderText: {
    fontWeight: '600',
    color: '#495057',
    fontSize: 14,
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa',
  },
  tableRowEven: {
    backgroundColor: '#fff',
  },
  tableRowOdd: {
    backgroundColor: '#f8f9fa',
  },
  tableCell: {
    flex: 1,
    fontSize: 14,
    color: '#495057',
  },
  lastCell: {
    textAlign: 'right',
  },
  numberCell: {
    fontVariant: ['tabular-nums'],
  },
});
