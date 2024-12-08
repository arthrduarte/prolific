import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Animated } from 'react-native';
import { supabase } from '../lib/supabase';
import { Course, Exercise } from '../types/database.types';
import ExerciseCardComponent from '../components/ExerciseCardComponent';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';

type NavigationProp = NativeStackNavigationProp<{
  Exercise: { exerciseId: string; courseId: string };
}>;

export default function CourseScreen({ route }: { route: any }) {
  const { courseId } = route.params;
  const navigation = useNavigation<NavigationProp>();
  const [course, setCourse] = useState<Course | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const scrollY = new Animated.Value(0);

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
        .eq('course_id', courseId);

      if (!error && data) {
        setExercises(data as Exercise[]);
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

  const headerHeight = scrollY.interpolate({
    inputRange: [0, 120],
    outputRange: [120, 80],
    extrapolate: 'clamp',
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient colors={['#ffffff', '#f8f9fa']} style={styles.container}>
        <Animated.View style={[styles.header, { height: headerHeight }]}>
          <Text style={styles.smallTitle}>Course</Text>
          <Text style={styles.title} numberOfLines={2}>{course.title}</Text>
        </Animated.View>

        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
        >
          <View style={styles.content}>
            <Text style={styles.description}>{course.description}</Text>
            <Text style={styles.sectionTitle}>Exercises</Text>
            <View style={styles.exercisesContainer}>
              {exercises.map((exercise, index) => (
                <ExerciseCardComponent
                  key={exercise.id}
                  exercise={exercise}
                  onPress={handleExercisePress}
                />
              ))}
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingTop: 20,
    justifyContent: 'flex-end',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  smallTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000',
    letterSpacing: -0.5,
  },
  content: {
    padding: 24,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  exercisesContainer: {
    gap: 12,
  },
  scrollView: {
    flex: 1,
  },
});
