import { Card } from '../components/Card'
import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Text } from 'react-native';
import { supabase } from '../lib/supabase';
import { Topic } from '../types/database.types';

export default function HomeScreen({navigation}: {navigation: any}) {
  const [topics, setTopics] = useState<Topic[]>([]);

  useEffect(() => {
    const fetchTopics = async () => {
      const { data, error } = await supabase.from('topics').select();
      setTopics(data as Topic[]);
    }
    fetchTopics();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Prolific</Text>
      <View style={styles.cardsContainer}>
          {topics.map((topic) => (
            <Card 
              key={topic.id}
              emoji={topic.emoji}
              title={topic.title}
              description={topic.description}
              onPress={() => navigation.navigate('Topic', { topicId: topic.id })}
            />
          ))}
      </View>
      <StatusBar style="light" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
    marginBottom: 20,
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 4
  },
});
