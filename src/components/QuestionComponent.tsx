import React, { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import { Exercise, Question } from '../types/database.types'

interface QuestionComponentProps {
  exercise: Exercise
  questions: Question[]
}

export default function QuestionComponent({ exercise, questions }: QuestionComponentProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false)

  const currentQuestion = questions[currentQuestionIndex]

  const handleAnswerSelect = (answer: string) => {
    if (!isAnswerSubmitted) {
      setSelectedAnswer(answer)
    }
  }

  const handleSubmit = () => {
    if (selectedAnswer) {
      setIsAnswerSubmitted(true)
    }
  }

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedAnswer(null)
      setIsAnswerSubmitted(false)
    }
  }

  const isCorrect = selectedAnswer === currentQuestion.correct_answer

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.exerciseTitle}>{exercise.title}</Text>
      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>{currentQuestion.question_text}</Text>
        
        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((option, index) => (
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

        {!isAnswerSubmitted ? (
          <TouchableOpacity
            style={[styles.submitButton, !selectedAnswer && styles.disabledButton]}
            onPress={handleSubmit}
            disabled={!selectedAnswer}
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
