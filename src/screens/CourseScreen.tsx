import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { supabase } from '../lib/supabase';
import { Course, Exercise } from '../types/database.types';
import ExerciseCardComponent from '../components/ExerciseCardComponent';
import { useNavigation } from '@react-navigation/native';

export default function CourseScreen({ route }: { route: any }) {
  const { courseId } = route.params;
  const navigation = useNavigation();
  const [course, setCourse] = useState<Course | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);

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

  if (!course) return null;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{course.title}</Text>
        <Text style={styles.description}>{course.description}</Text>
      </View>
      <View style={styles.exercisesContainer}>
        {exercises.map((exercise) => (
          <ExerciseCardComponent
            key={exercise.id}
            exercise={exercise}
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  exercisesContainer: {
    paddingVertical: 8,
  },
});
