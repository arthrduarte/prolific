import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { supabase } from '../../lib/supabase';
import { Question } from '../../types/database.types';

export const FinanceQuizScreen = ({ route, navigation }: { route: any; navigation: any }) => {
  const { levelId } = route.params || { levelId: 1 };
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchQuestions();
  }, [levelId]);

  const fetchQuestions = async () => {
    try {
      const { data, error: supabaseError } = await supabase
        .from('questions')
        .select(`
          id,
          level_id,
          question,
          options,
          correct_answer
        `)
        .eq('level_id', levelId)
        .order('created_at');

      if (supabaseError) {
        throw supabaseError;
      }

      if (!data || data.length === 0) {
        setError('No questions found for this level');
        setQuestions([]);
      } else {
        setQuestions(data as unknown as Question[]);
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
      setError('Failed to load questions. Please try again.');
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  }

  const handleAnswer = (selectedIndex: number) => {
    if (!questions) return;
    
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

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading questions...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => {
            setError(null);
            setLoading(true);
            fetchQuestions();
          }}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <View style={styles.container}>
        <Text>No questions available.</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.retryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

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
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    width: '100%',
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
    width: '100%',
  },
  question: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    lineHeight: 28,
  },
  optionsContainer: {
    gap: 12,
    width: '100%',
  },
  optionButton: {
    backgroundColor: '#f0dc1b',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    width: '100%',
  },
  optionText: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '500',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#f0dc1b',
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
  },
  retryButtonText: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '500',
  },
}); 