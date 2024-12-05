import React from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import useTopic from '../hooks/useTopic';
import { LevelItem } from '../components/LevelItem';

export const TopicScreen = ({ route, navigation }: { route: any; navigation: any }) => {
  const topicId = route.params?.topicId;
  const { topic, levels, loading, error } = useTopic(topicId);

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
        renderItem={({ item }) => (
          <LevelItem item={item} topicId={topicId} topicTitle={topic.title} />
        )}
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