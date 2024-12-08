import React, { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native'
import { Exercise, Question } from '../types/database.types'

interface QuestionComponentProps {
  exercise: Exercise
  questions: Question[]
}

export default function QuestionComponent({ exercise, questions }: QuestionComponentProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [textAnswer, setTextAnswer] = useState('')
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false)

  const currentQuestion = questions[currentQuestionIndex]
  const isMultipleChoice = currentQuestion.type === 'multiple_choice'

  const handleAnswerSelect = (answer: string) => {
    if (!isAnswerSubmitted) {
      setSelectedAnswer(answer)
    }
  }

  const handleTextChange = (text: string) => {
    if (!isAnswerSubmitted) {
      setTextAnswer(text)
    }
  }

  const handleSubmit = () => {
    if ((isMultipleChoice && selectedAnswer) || (!isMultipleChoice && textAnswer)) {
      setIsAnswerSubmitted(true)
    }
  }

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedAnswer(null)
      setTextAnswer('')
      setIsAnswerSubmitted(false)
    }
  }

  const isCorrect = isMultipleChoice 
    ? selectedAnswer === currentQuestion.correct_answer
    : textAnswer.trim().toLowerCase() === currentQuestion.correct_answer.toLowerCase()

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.exerciseTitle}>{exercise.title}</Text>
      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>{currentQuestion.question_text}</Text>
        
        {isMultipleChoice ? (
          // Multiple Choice Question
          <View style={styles.optionsContainer}>
            {currentQuestion.options?.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionButton,
                  selectedAnswer === option && styles.selectedOption,
                  isAnswerSubmitted && selectedAnswer === option && (
                    isCorrect ? styles.correctOption : styles.incorrectOption
                  )
                ]}
                onPress={() => handleAnswerSelect(option)}
                disabled={isAnswerSubmitted}
              >
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          // Text Input Question
          <View style={styles.textInputContainer}>
            <TextInput
              style={[
                styles.textInput,
                isAnswerSubmitted && (isCorrect ? styles.correctTextInput : styles.incorrectTextInput)
              ]}
              value={textAnswer}
              onChangeText={handleTextChange}
              placeholder="Type your answer here..."
              editable={!isAnswerSubmitted}
            />
          </View>
        )}

        {!isAnswerSubmitted ? (
          <TouchableOpacity
            style={[
              styles.submitButton, 
              (!selectedAnswer && isMultipleChoice) || (!textAnswer && !isMultipleChoice) 
                ? styles.disabledButton 
                : null
            ]}
            onPress={handleSubmit}
            disabled={(!selectedAnswer && isMultipleChoice) || (!textAnswer && !isMultipleChoice)}
          >
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        ) : (
          <>
            <Text style={styles.explanationText}>{currentQuestion.explanation}</Text>
            {currentQuestionIndex < questions.length - 1 && (
              <TouchableOpacity style={styles.submitButton} onPress={handleNext}>
                <Text style={styles.buttonText}>Next Question</Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  exerciseTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#333',
  },
  questionContainer: {
    marginBottom: 24,
  },
  questionText: {
    fontSize: 18,
    marginBottom: 16,
    color: '#333',
  },
  optionsContainer: {
    marginBottom: 24,
  },
  textInputContainer: {
    marginBottom: 24,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  correctTextInput: {
    backgroundColor: '#e8f5e9',
    borderColor: '#4caf50',
  },
  incorrectTextInput: {
    backgroundColor: '#ffebee',
    borderColor: '#f44336',
  },
  optionButton: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedOption: {
    backgroundColor: '#e3f2fd',
    borderColor: '#2196f3',
  },
  correctOption: {
    backgroundColor: '#e8f5e9',
    borderColor: '#4caf50',
  },
  incorrectOption: {
    backgroundColor: '#ffebee',
    borderColor: '#f44336',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  submitButton: {
    backgroundColor: '#2196f3',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#bdbdbd',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  explanationText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
})
