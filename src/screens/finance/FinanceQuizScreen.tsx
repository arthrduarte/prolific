import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';

// Sample questions for Level 1
const LEVEL_1_QUESTIONS = [
  {
    id: 1,
    question: 'What is the primary purpose of a balance sheet?',
    options: [
      'To show profit and loss',
      'To show assets, liabilities, and equity',
      'To show cash flow',
      'To show revenue growth',
    ],
    correctAnswer: 1, // Index of correct answer
  },
  {
    id: 2,
    question: 'Which financial statement shows the company\'s revenue and expenses?',
    options: [
      'Balance Sheet',
      'Cash Flow Statement',
      'Income Statement',
      'Equity Statement',
    ],
    correctAnswer: 2,
  },
  // Add more questions as needed
];

export const FinanceQuizScreen = ({ route, navigation }: { route: any; navigation: any }) => {
  const { levelId } = route.params;
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);

  const questions = LEVEL_1_QUESTIONS; // In a real app, select questions based on levelId

  const handleAnswer = (selectedIndex: number) => {
    const isCorrect = selectedIndex === questions[currentQuestion].correctAnswer;
    
    if (isCorrect) {
      setScore(score + 1);
    }

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Quiz completed
      const passed = (score + (isCorrect ? 1 : 0)) / questions.length >= 0.7; // 70% passing threshold
      
      Alert.alert(
        'Quiz Completed!',
        `You scored ${score + (isCorrect ? 1 : 0)} out of ${questions.length}\n${passed ? 'Level Complete! 🎉' : 'Try again! 💪'}`,
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>
          Question {currentQuestion + 1} of {questions.length}
        </Text>
        <Text style={styles.scoreText}>Score: {score}</Text>
      </View>

      <View style={styles.questionContainer}>
        <Text style={styles.question}>{questions[currentQuestion].question}</Text>
      </View>

      <View style={styles.optionsContainer}>
        {questions[currentQuestion].options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={styles.optionButton}
            onPress={() => handleAnswer(index)}
          >
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  progressText: {
    fontSize: 16,
    color: '#666',
  },
  scoreText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f0dc1b',
  },
  questionContainer: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
  },
  question: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    lineHeight: 28,
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    backgroundColor: '#f0dc1b',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '500',
  },
}); 