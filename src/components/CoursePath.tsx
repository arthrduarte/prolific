import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Exercise } from '../types/database.types';
import { ExerciseCard } from './ExerciseCard';

interface CoursePathProps {
  exercises: Exercise[];
  onExercisePress: (exercise: Exercise) => void;
}

export const CoursePath: React.FC<CoursePathProps> = ({
  exercises,
  onExercisePress,
}) => {
  return (
    <View style={styles.container}>
      
      {exercises.map((exercise, index) => (
        <ExerciseCard
          key={exercise.id}
          exercise={exercise}
          index={index}
          isActive={index === 0}
          onPress={onExercisePress}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    paddingLeft: 20,
  },
  verticalLine: {
    position: 'absolute',
    left: 29,
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: '#e9ecef',
  },
});
