import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Exercise } from '../types/database.types';
import { FontAwesome } from '@expo/vector-icons';

interface ExerciseCardProps {
  exercise: Exercise;
  index: number;
  isActive: boolean;
  onPress: (exercise: Exercise) => void;
  topicEmoji?: string;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  index,
  isActive,
  onPress,
  topicEmoji = '📝',
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.exerciseContainer,
        !isActive && styles.lockedContainer
      ]}
      onPress={() => onPress(exercise)}
      activeOpacity={0.7}
    >
      <View style={[
        styles.card,
        isActive && styles.activeCard,
        !isActive && styles.lockedCard
      ]}>
        <View style={styles.cardContent}>
          <View style={styles.emojiContainer}>
            <Text style={styles.emoji}>
              {isActive ? topicEmoji : '🔒'}
            </Text>
          </View>
          
          <View style={styles.textContainer}>
            <Text style={[
              styles.title,
              !isActive && styles.lockedText
            ]} numberOfLines={5}>
              {exercise.title}
            </Text>
          </View>

          <FontAwesome 
            name="chevron-right" 
            size={16} 
            color={isActive ? "#adb5bd" : "#dee2e6"}
            style={styles.chevron}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  exerciseContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'center',
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  activeCard: {
    borderColor: '#a1ff9c',
    borderWidth: 2,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  emojiContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  emoji: {
    fontSize: 20,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  chevron: {
    marginLeft: 'auto',
  },
  lockedContainer: {
    opacity: 0.7,
  },
  lockedCard: {
    backgroundColor: '#f8f9fa',
  },
  lockedText: {
    color: '#adb5bd',
  },
}); 