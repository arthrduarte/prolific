import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { supabase } from '../lib/supabase';

type Level = {
  id: number;
  topic_id: number;
  title: string;
  description: string;
  is_locked: boolean;
};

type Topic = {
  id: number;
  title: string;
  description: string;
};

export const TopicScreen = ({ route, navigation }: { route: any; navigation: any }) => {
  const { topicId } = route.params;
  const [levels, setLevels] = useState<Level[]>([]);
  const [topic, setTopic] = useState<Topic | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTopicAndLevels();
  }, [topicId]);

  const fetchTopicAndLevels = async () => {
    try {
      // Fetch topic details
      const { data: topicData, error: topicError } = await supabase
        .from('topics')
        .select('*')
        .eq('id', topicId)
        .single();

      if (topicError) throw topicError;
      setTopic(topicData);

      // Fetch levels for this topic
      const { data: levelsData, error: levelsError } = await supabase
        .from('levels')
        .select('*')
        .eq('topic_id', topicId)
        .order('id');

      if (levelsError) throw levelsError;
      setLevels(levelsData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLevelPress = (level: Level) => {
    if (level.is_locked) {
      // Show locked message or unlock requirements
      return;
    }
    navigation.navigate('Quiz', {
      levelId: level.id,
      topicId: topicId,
      levelTitle: level.title,
      topicTitle: topic?.title
    });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#f0dc1b" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={fetchTopicAndLevels}
        >
          <Text style={styles.buttonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {topic && (
        <View style={styles.topicHeader}>
          <Text style={styles.topicTitle}>{topic.title}</Text>
          <Text style={styles.topicDescription}>{topic.description}</Text>
        </View>
      )}

      <FlatList
        data={levels}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.levelCard,
              item.is_locked && styles.lockedLevel
            ]}
            onPress={() => handleLevelPress(item)}
            disabled={item.is_locked}
          >
            <View style={styles.levelContent}>
              <Text style={styles.levelTitle}>{item.title}</Text>
              <Text style={styles.levelDescription}>{item.description}</Text>
            </View>
            {item.is_locked && (
              <Text style={styles.lockedText}>🔒</Text>
            )}
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.levelsList}
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
  },
  topicTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  topicDescription: {
    fontSize: 16,
    color: '#666',
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
}); 