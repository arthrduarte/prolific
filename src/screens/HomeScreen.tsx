import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { supabase } from '../lib/supabase';
import { Topic, Course } from '../types/database.types';
import { TopicComponent } from '../components/TopicComponent';

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
            <TopicComponent 
              key={topic.id}
              topic={topic}
              navigation={navigation}
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
    flexDirection: 'column',
  },
});
