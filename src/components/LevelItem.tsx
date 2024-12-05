import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import type { LevelWithProgress } from '../hooks/useTopic';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/param.types';

interface LevelItemProps {
  item: LevelWithProgress;
  topicId: number;
  topicTitle: string;
}

export const LevelItem = ({ item, topicId, topicTitle }: LevelItemProps) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const isLocked = !item.user_progress?.is_unlocked;
  const scorePercentage = item.user_progress?.score_percentage;

  const handlePress = () => {
    if (!isLocked) {
      navigation.navigate('Quiz', { 
        levelId: item.id,
        topicId: topicId,
        levelTitle: item.title,
        topicTitle: topicTitle || ''
      });
    }
  };

  return (
    <TouchableOpacity 
      style={[
        styles.levelCard, 
        isLocked ? styles.lockedLevel : styles.unlockedLevel
      ]}
      onPress={handlePress}
      disabled={isLocked}
    >
      <View style={styles.levelContent}>
        <Text style={styles.levelTitle}>{item.title}</Text>
        <Text style={styles.levelDescription}>{item.description}</Text>
        {scorePercentage !== undefined && (
          <Text style={styles.scoreText}>Score: {scorePercentage}%</Text>
        )}
      </View>
      {isLocked && (
        <Text style={styles.lockedText}>🔒</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  levelCard: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#eee',
  },
  unlockedLevel: {
    backgroundColor: '#f0dc1b',
  },
  lockedLevel: {
    opacity: 0.7,
  },
  levelContent: {
    flex: 1,
  },
  levelTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  levelDescription: {
    fontSize: 14,
    color: '#666',
  },
  scoreText: {
    fontSize: 12,
    color: '#444',
    marginTop: 4,
    fontWeight: '500',
  },
  lockedText: {
    fontSize: 20,
    marginLeft: 12,
  },
}); 