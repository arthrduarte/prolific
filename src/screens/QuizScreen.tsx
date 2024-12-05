import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { supabase } from '../lib/supabase';
import type { Question } from '../types/database.types';


export const QuizScreen = ({ route, navigation }: { route: any; navigation: any }) => {
  const { levelId, topicId, levelTitle, topicTitle } = route.params;
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
        setQuestions(data as Question[]);
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
      setError('Failed to load questions. Please try again.');
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  const updateLevelProgress = async (score: number, totalQuestions: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const scorePercentage = Math.round((score / totalQuestions) * 100);
      
      // First check if entry exists
      const { data: existingProgress } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('level_id', levelId)
        .single();

      let error;
      if (existingProgress) {
        // Update existing entry
        const { error: updateError } = await supabase
          .from('user_progress')
          .update({
            score_percentage: scorePercentage,
            is_unlocked: true
          })
          .eq('user_id', user.id)
          .eq('level_id', levelId);
        error = updateError;
      } else {
        // Insert new entry
        const { error: insertError } = await supabase
          .from('user_progress')
          .insert({
            user_id: user.id,
            level_id: levelId,
            score_percentage: scorePercentage,
            is_unlocked: true
          });
        error = insertError;
      }

      if (error) throw error;
      return scorePercentage;
    } catch (error) {
      console.error('Error updating level progress:', error);
      throw error;
    }
  };

  const handleAnswer = async (selectedIndex: number) => {
    if (!questions) return;
    
    const isCorrect = selectedIndex === questions[currentQuestion].correct_answer;
    
    if (isCorrect) {
      setScore(score + 1);
    }

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Quiz completed
      const finalScore = score + (isCorrect ? 1 : 0);
      const passed = finalScore / questions.length >= 0.7; // 70% passing threshold
      
      if (passed) {
        try {
          await updateLevelProgress(finalScore, questions.length);
        } catch (error) {
          console.error('Failed to update progress:', error);
        }
      }

      Alert.alert(
        'Quiz Completed!',
        `You scored ${finalScore} out of ${questions.length}\n${passed ? 'Level Complete! 🎉' : 'Try again! 💪'}`,
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
        <ActivityIndicator size="large" color="#f0dc1b" />
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
          <Text style={styles.buttonText}>Retry</Text>
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
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.topicTitle}>{topicTitle}</Text>
        <Text style={styles.levelTitle}>{levelTitle}</Text>
      </View>

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
  header: {
    marginBottom: 24,
  },
  topicTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  levelTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
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
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#f0dc1b',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
}); 