import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Exercise } from '../types/database.types';
import { FontAwesome } from '@expo/vector-icons';

interface ExerciseCardProps {
  exercise: Exercise;
  index: number;
  isUnlocked: boolean;
  onPress: (exercise: Exercise) => void;
  steps?: number;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  isUnlocked,
  onPress,
  steps = 0,
}) => {
  const getIcon = () => {
    if (!isUnlocked) return "lock";
    if (steps === 0) return "wrench";
    return "play";
  };

  return (
    <TouchableOpacity
      style={[
        styles.exerciseCard,
        isUnlocked ? styles.exerciseCardYellow : styles.exerciseCardLocked
      ]}
      onPress={() => onPress(exercise)}
      activeOpacity={0.9}
    >
      <View style={styles.exerciseContent}>
        <Text 
          style={[
            styles.exerciseTitle,
            isUnlocked ? styles.exerciseTitleDark : styles.exerciseTitleLight
          ]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {exercise.title}
        </Text>
      </View>
      <View style={[
        styles.playButton,
        isUnlocked ? styles.playButtonDark : styles.playButtonLocked
      ]}>
        <FontAwesome 
          name={getIcon()} 
          size={14} 
          color="#fff"
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  exerciseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 72,
    paddingHorizontal: 24,
    borderRadius: 16,
  },
  exerciseCardYellow: {
    backgroundColor: '#ffd43b',
  },
  exerciseCardLocked: {
    backgroundColor: '#212529',
  },
  exerciseContent: {
    flex: 1,
    marginRight: 16,
  },
  exerciseTitle: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 24,
  },
  exerciseTitleDark: {
    color: '#000',
  },
  exerciseTitleLight: {
    color: '#fff',
  },
  playButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButtonDark: {
    backgroundColor: '#212529',
  },
  playButtonLocked: {
    backgroundColor: '#495057',
  },
}); 