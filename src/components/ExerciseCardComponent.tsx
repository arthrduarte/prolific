import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Exercise } from '../types/database.types';

interface ExerciseCardProps {
  exercise: Exercise;
  onPress?: (exercise: Exercise) => void;
}

export default function ExerciseCardComponent({ exercise, onPress }: ExerciseCardProps) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress?.(exercise)}
      activeOpacity={0.7}
    >
      <View style={styles.container}>
        <Text style={styles.title}>{exercise.title}</Text>
        <Text style={styles.description}>{exercise.description}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  container: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  difficulty: {
    fontSize: 12,
    color: '#888',
  },
  points: {
    fontSize: 12,
    color: '#888',
  },
});
