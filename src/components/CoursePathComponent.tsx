import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Exercise } from '../types/database.types';
import { FontAwesome } from '@expo/vector-icons';

interface CoursePathComponentProps {
  exercises: Exercise[];
  onExercisePress: (exercise: Exercise) => void;
}

export const CoursePathComponent: React.FC<CoursePathComponentProps> = ({
  exercises,
  onExercisePress,
}) => {
  return (
    <View style={styles.container}>
      {/* Vertical line that connects all exercises */}
      <View style={styles.verticalLine} />
      
      {exercises.map((exercise, index) => (
        <TouchableOpacity
          key={exercise.id}
          style={styles.exerciseContainer}
          onPress={() => onExercisePress(exercise)}
          activeOpacity={0.7}
        >
          {/* Circle connector */}
          <View style={styles.connector}>
            <View style={[
              styles.circle,
              index === 0 && styles.activeCircle
            ]} />
          </View>

          {/* Exercise card */}
          <View style={[
            styles.card,
            index === 0 && styles.activeCard
          ]}>
            <View style={styles.cardHeader}>
              <Text style={styles.exerciseNumber}>Exercise {index + 1}</Text>
              <FontAwesome name="chevron-right" size={14} color="#adb5bd" />
            </View>
            <Text style={styles.title}>{exercise.title}</Text>
            <Text style={styles.description} numberOfLines={2}>
              {exercise.description}
            </Text>
            <View style={styles.footer}>
              <View style={styles.tag}>
                <Text style={styles.tagText}>5 min</Text>
              </View>
              <View style={[styles.tag, styles.statusTag]}>
                <View style={[
                  styles.statusDot,
                  { backgroundColor: index === 0 ? '#40c057' : '#adb5bd' }
                ]} />
                <Text style={styles.tagText}>
                  {index === 0 ? 'Ready' : 'Locked'}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
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
  exerciseContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  connector: {
    width: 20,
    height: '100%',
    alignItems: 'center',
    paddingTop: 24,
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#e9ecef',
    borderWidth: 4,
    borderColor: '#fff',
  },
  activeCircle: {
    backgroundColor: '#f0dc1b',
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginLeft: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f1f3f5',
    opacity: 0.7,
  },
  activeCard: {
    opacity: 1,
    borderColor: '#f0dc1b',
    shadowOpacity: 0.1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  exerciseNumber: {
    fontSize: 12,
    color: '#868e96',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#495057',
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#f8f9fa',
    borderRadius: 6,
  },
  statusTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  tagText: {
    fontSize: 12,
    color: '#495057',
    fontWeight: '500',
  },
});
