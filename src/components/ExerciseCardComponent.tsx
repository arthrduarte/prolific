import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Exercise } from '../types/database.types';

interface ExerciseCardProps {
  exercise: Exercise;
  onPress?: (exercise: Exercise) => void;
  index?: number;
}

export default function ExerciseCardComponent({ exercise, onPress, index }: ExerciseCardProps) {
  return (
    <TouchableOpacity
      style={[styles.card, index === 0 && styles.firstCard]}
      onPress={() => onPress?.(exercise)}
      activeOpacity={0.7}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.exerciseNumber}>
            <Text style={styles.numberText}>
              {(index !== undefined ? index + 1 : 1).toString().padStart(2, '0')}
            </Text>
          </View>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{exercise.title}</Text>
            <Text style={styles.description} numberOfLines={2}>
              {exercise.description}
            </Text>
          </View>
        </View>
        <View style={styles.footer}>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Estimated time</Text>
            <Text style={styles.statValue}>5-10 min</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Questions</Text>
            <Text style={styles.statValue}>4</Text>
          </View>
          <View style={[styles.progressIndicator, styles.notStarted]}>
            <Text style={styles.progressText}>Not Started</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f1f3f5',
  },
  firstCard: {
    marginTop: 8,
  },
  container: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  exerciseNumber: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  numberText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f3f5',
  },
  stat: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#868e96',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
  },
  progressIndicator: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
  },
  notStarted: {
    backgroundColor: '#f8f9fa',
  },
  inProgress: {
    backgroundColor: '#fff3bf',
  },
  completed: {
    backgroundColor: '#d3f9d8',
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#495057',
  },
});
