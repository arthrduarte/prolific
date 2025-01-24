import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Exercise } from '../types/database.types';
import { FontAwesome } from '@expo/vector-icons';

interface ExerciseCardProps {
  exercise: Exercise;
  index: number;
  isUnlocked: boolean;
  onPress: (exercise: Exercise) => void;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  index,
  isUnlocked,
  onPress,
}) => {
  const isEven = index % 2 === 0;

  return (
    <TouchableOpacity
      style={[
        styles.exerciseCard,
        isEven ? styles.exerciseCardYellow : styles.exerciseCardDark,
        !isUnlocked && styles.exerciseCardLocked
      ]}
      onPress={() => onPress(exercise)}
      activeOpacity={0.9}
    >
      <View style={styles.exerciseContent}>
        <Text 
          style={[
            styles.exerciseTitle,
            isEven ? styles.exerciseTitleDark : styles.exerciseTitleLight,
            !isUnlocked && styles.exerciseTitleLocked
          ]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {exercise.title}
        </Text>
      </View>
      <View style={[
        styles.playButton,
        isEven ? styles.playButtonDark : styles.playButtonYellow,
        !isUnlocked && styles.playButtonLocked
      ]}>
        <FontAwesome 
          name={isUnlocked ? "play" : "lock"} 
          size={14} 
          color={!isUnlocked ? "#fff" : (isEven ? "#fff" : "#000")}
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
  exerciseCardDark: {
    backgroundColor: '#212529',
  },
  exerciseCardLocked: {
    backgroundColor: '#868e96',
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
  exerciseTitleLocked: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  playButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButtonYellow: {
    backgroundColor: '#ffd43b',
  },
  playButtonDark: {
    backgroundColor: '#212529',
  },
  playButtonLocked: {
    backgroundColor: '#495057',
  },
}); 