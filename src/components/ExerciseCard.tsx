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
      style={styles.exerciseContainer}
      onPress={() => onPress(exercise)}
      activeOpacity={0.7}
    >
      {/* Circle connector with number */}
      <View style={styles.connector}>
        <View style={[
          styles.circle,
          isActive && styles.activeCircle
        ]}>
          <Text style={styles.circleNumber}>{index + 1}</Text>
        </View>
        <View style={styles.verticalLine} />
      </View>

      {/* Exercise card */}
      <View style={[
        styles.card,
        isActive && styles.activeCard
      ]}>
        <View style={styles.cardContent}>
          <View style={styles.emojiContainer}>
            <Text style={styles.emoji}>{topicEmoji}</Text>
          </View>
          
          <View style={styles.textContainer}>
            <Text style={styles.title} numberOfLines={1}>
              {exercise.title}
            </Text>
          </View>

          <FontAwesome 
            name="chevron-right" 
            size={16} 
            color="#adb5bd"
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
  connector: {
    width: 40,
    alignItems: 'center',
  },
  verticalLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#e9ecef',
    position: 'absolute',
    top: 40,
    bottom: -24,
  },
  circle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f8f9fa',
    borderWidth: 2,
    borderColor: '#e9ecef',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
  },
  activeCircle: {
    backgroundColor: '#f0dc1b',
    borderColor: '#f0dc1b',
  },
  card: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginLeft: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  activeCard: {
    backgroundColor: '#fff',
    borderColor: '#f0dc1b',
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
    marginRight: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#495057',
  },
  chevron: {
    marginLeft: 'auto',
  },
}); 