import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Text, ScrollView, SafeAreaView } from 'react-native'
import { supabase } from '../lib/supabase'
import { Topic } from '../types/database.types'
import { TopicComponent } from '../components/TopicComponent'
import { LinearGradient } from 'expo-linear-gradient'

export default function HomeScreen({navigation}: {navigation: any}) {
  const [topics, setTopics] = useState<Topic[]>([])

  useEffect(() => {
    const fetchTopics = async () => {
      const { data, error } = await supabase.from('topics').select()
      setTopics(data as Topic[])
    }
    fetchTopics()
  }, [])

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <LinearGradient
        colors={['#ffffff', '#f8f9fa']}
        style={styles.container}
      >
        <View style={styles.header}>
          <Text style={styles.smallTitle}>Welcome to</Text>
          <Text style={styles.title}>Prolific</Text>
          <Text style={styles.subtitle}>Master new skills through interactive learning</Text>
        </View>
        
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Text style={styles.sectionTitle}>Learning Paths</Text>
          <View style={styles.cardsContainer}>
            {topics.map((topic) => (
              <TopicComponent 
                key={topic.id}
                topic={topic}
                navigation={navigation}
              />
            ))}
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: '#fff',
  },
  smallTitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  title: {
    fontSize: 40,
    fontWeight: '700',
    color: '#000',
    marginBottom: 8,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginTop: 24,
    marginBottom: 16,
    paddingHorizontal: 24,
  },
  cardsContainer: {
    paddingHorizontal: 8,
  },
})
