import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { supabase } from '../lib/supabase';
import { Level, Topic, User_Progress } from '../types/database.types';

interface LevelWithProgress extends Level {
  user_progress?: User_Progress;
}

export const TopicScreen = ({ route, navigation }: { route: any; navigation: any }) => {
  const topicId = route.params?.topicId;
  const [topic, setTopic] = useState<Topic | null>(null);
  const [levels, setLevels] = useState<LevelWithProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTopic = async () => {
    const { data, error } = await supabase.from('topics').select('*').eq('id', topicId);
    if (error) throw error;
    setTopic(data[0]);
  };

  const fetchLevelsWithProgress = async () => {
    try {
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Fetch levels for the current topic
      const { data: levelsData, error: levelsError } = await supabase
        .from('levels')
        .select('*')
        .eq('topic_id', topicId)
        .order('id');

      if (levelsError) throw levelsError;

      // Fetch user progress for these levels
      const { data: progressData, error: progressError } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .in('level_id', levelsData.map(level => level.id));

      if (progressError) throw progressError;

      // Combine levels with their progress
      const levelsWithProgress = levelsData.map((level) => ({
        ...level,
        user_progress: progressData.find(progress => progress.level_id === level.id)
      }));

      console.log("Fetched levels with progress:", levelsWithProgress);
      setLevels(levelsWithProgress);
    } catch (err) {
      console.error('Error in fetchLevelsWithProgress:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!topicId) {
      setError('Topic ID is missing');
      setLoading(false);
      return;
    }
    fetchLevelsWithProgress();
    fetchTopic();
  }, [topicId]);

  const renderLevel = ({ item }: { item: LevelWithProgress }) => {
    const isLocked = !item.user_progress?.is_unlocked;
    const scorePercentage = item.user_progress?.score_percentage;

    return (
      <TouchableOpacity 
        style={[
          styles.levelCard, 
          isLocked ? styles.lockedLevel : styles.unlockedLevel
        ]}
        onPress={() => {
          if (!isLocked) {
            navigation.navigate('Quiz', { 
              levelId: item.id,
              topicId: topicId,
              levelTitle: item.title,
              topicTitle: topic?.title || ''
            });
          }
        }}
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

  if (!topicId) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Topic ID is missing</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#f0dc1b" />
      </View>
    );
  }

  if (error || !topic) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error || 'Failed to load topic'}</Text>
        <TouchableOpacity style={styles.retryButton}>
          <Text style={styles.buttonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.topicHeader}>
        <Text style={styles.topicTitle}>{topic.title}</Text>
        <Text style={styles.topicDescription}>{topic.description}</Text>
      </View>

      <FlatList
        data={levels}
        renderItem={renderLevel}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.levelsList}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  topicHeader: {
    marginBottom: 24,
    alignItems: 'center',
    padding: 24,
    borderRadius: 12,
    width: '100%',
  },
  topicTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
    textAlign: 'center',
  },
  topicDescription: {
    fontSize: 18,
    color: '#000',
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  levelsList: {
    gap: 16,
  },
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
  lockedLevel: {
    opacity: 0.7,
  },
  lockedText: {
    fontSize: 20,
    marginLeft: 12,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#f0dc1b',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  scoreText: {
    fontSize: 12,
    color: '#444',
    marginTop: 4,
    fontWeight: '500',
  },
}); 