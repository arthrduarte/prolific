import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../lib/supabase';
import { Course, Exercise, Step } from '../types/database.types';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BackButton } from '../components/BackButton';
import { useUserProgress } from '../hooks/useUserProgress';
import { ExerciseCard } from '../components/ExerciseCard';

type NavigationProp = NativeStackNavigationProp<{
  Exercise: { exerciseId: string; courseId: string };
}>;

export default function CourseScreen({ route }: { route: any }) {
  const { courseId } = route.params;
  const navigation = useNavigation<NavigationProp>();
  const [course, setCourse] = useState<Course | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [stepsCount, setStepsCount] = useState<{ [key: string]: number }>({});

  const { 
    loading: progressLoading,
    userProgress,
    isExerciseUnlocked
  } = useUserProgress(courseId);

  useEffect(() => {
    const fetchCourse = async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .single();

      if (!error && data) {
        setCourse(data as Course);
      }
    };

    const fetchExercises = async () => {
      const { data, error } = await supabase
        .from('exercises')
        .select('*')
        .eq('course_id', courseId)
        .order('order', { ascending: true });

      if (!error && data) {
        setExercises(data as Exercise[]);
        
        // Fetch steps count for each exercise
        const exerciseIds = data.map(ex => ex.id);
        const { data: stepsData, error: stepsError } = await supabase
          .from('steps')
          .select('exercise_id')
          .in('exercise_id', exerciseIds);

        if (!stepsError && stepsData) {
          // Count steps for each exercise
          const counts = stepsData.reduce((acc, step) => {
            acc[step.exercise_id] = (acc[step.exercise_id] || 0) + 1;
            return acc;
          }, {} as { [key: string]: number });
          setStepsCount(counts);
        }
      }
    };

    fetchCourse();
    fetchExercises();
  }, [courseId]);

  const handleExercisePress = (exercise: Exercise) => {
    if (!isExerciseUnlocked(exercise)) {
      Alert.alert(
        "Exercise Locked",
        "Complete the previous exercise to unlock this one.",
        [{ text: "OK" }]
      );
      return;
    }

    navigation.navigate('Exercise', { 
      exerciseId: exercise.id,
      courseId: courseId
    });
  };

  if (!course) return null;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          <BackButton />
          
          <Text style={styles.title}>{course.title}</Text>
          <View style={styles.lessonCountContainer}>
            <Text style={styles.lessonCount}>
              {exercises.length} Lessons
            </Text>
          </View>

          <View style={styles.exercisesContainer}>
            {exercises.map((exercise, index) => (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                index={index}
                isUnlocked={isExerciseUnlocked(exercise)}
                onPress={handleExercisePress}
                steps={stepsCount[exercise.id] || 0}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 42,
    fontWeight: '800',
    color: '#000',
    marginBottom: 16,
    letterSpacing: -1,
  },
  lessonCountContainer: {
    backgroundColor: '#f8f9fa',
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginBottom: 32,
  },
  lessonCount: {
    fontSize: 16,
    color: '#495057',
    fontWeight: '600',
  },
  exercisesContainer: {
    gap: 12,
  },
});
