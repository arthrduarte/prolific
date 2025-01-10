import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { supabase } from '../lib/supabase';
import { Course, Exercise } from '../types/database.types';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ExerciseCard } from '../components/ExerciseCard';
import { useUserProgress } from '../hooks/useUserProgress';

type NavigationProp = NativeStackNavigationProp<{
  Exercise: { exerciseId: string; courseId: string };
}>;

type GroupedExercises = {
  [key: string]: Exercise[];
};

const DIFFICULTY_ORDER = ['EASY', 'MEDIUM', 'HARD'];

export default function CourseScreen({ route }: { route: any }) {
  const { courseId } = route.params;
  const navigation = useNavigation<NavigationProp>();
  const [course, setCourse] = useState<Course | null>(null);
  const [groupedExercises, setGroupedExercises] = useState<GroupedExercises>({});
  const [progress, setProgress] = useState(0);

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
        .order('difficulty', { ascending: true })
        .order('order', { ascending: true });

      if (!error && data) {
        // Group exercises by difficulty
        const grouped = (data as Exercise[]).reduce((acc: GroupedExercises, exercise) => {
          const difficulty = exercise.difficulty.toUpperCase();
          if (!acc[difficulty]) {
            acc[difficulty] = [];
          }
          acc[difficulty].push(exercise);
          return acc;
        }, {});

        setGroupedExercises(grouped);
        // Placeholder progress calculation - you might want to implement actual progress tracking
        setProgress(0.3); // 30% progress for demonstration
      }
    };

    fetchCourse();
    fetchExercises();
  }, [courseId]);

  const handleExercisePress = (exercise: Exercise) => {
    navigation.navigate('Exercise', { 
      exerciseId: exercise.id,
      courseId: courseId
    });
  };

  if (!course) return null;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>{course.title}</Text>
          <View style={styles.metaContainer}>
            <Text style={styles.metaText}>
              {Object.values(groupedExercises).reduce((total, exercises) => total + exercises.length, 0)} exercises
            </Text>
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
              </View>
              <Text style={styles.progressText}>{Math.round(progress * 100)}%</Text>
            </View>
          </View>
          <Text style={styles.description}>
            {course.description || 'Learn the fundamentals and advanced concepts through practical exercises.'}
          </Text>
        </View>

        <View style={styles.content}>
          <View style={styles.exercisesSection}>
            <Text style={styles.sectionTitle}>Course Content</Text>
            <View style={styles.exercisesContainer}>
              {DIFFICULTY_ORDER.map((difficulty) => {
                const exercises = groupedExercises[difficulty];
                if (!exercises?.length) return null;
                
                return (
                  <View key={difficulty} style={styles.difficultySection}>
                    <Text style={styles.difficultyTitle}>{difficulty}:</Text>
                    {exercises.map((exercise, index) => (
                      <ExerciseCard
                        key={exercise.id}
                        exercise={exercise}
                        index={index}
                        isActive={isExerciseUnlocked(exercise)}
                        onPress={handleExercisePress}
                      />
                    ))}
                  </View>
                );
              })}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0dc1b',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#f0dc1b',
    padding: 24,
    height: 200,
    paddingTop: 20,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
  title: {
    marginTop: 20,
    fontSize: 28,
    fontWeight: '800',
    color: '#000',
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 16,
  },
  metaText: {
    fontSize: 14,
    color: '#495057',
    fontWeight: '600',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressBar: {
    width: 100,
    height: 4,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#000',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 14,
    color: '#495057',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  description: {
    fontSize: 14,
    color: '#495057',
    lineHeight: 18,
    opacity: 0.5,
  },
  exercisesSection: {
    flex: 1,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    marginBottom: 16,
  },
  exercisesContainer: {
    flex: 1,
  },
  difficultySection: {
    marginBottom: 24,
  },
  difficultyTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    opacity: 0.3,
    marginBottom: 12,
    textTransform: 'capitalize',
  },
});
