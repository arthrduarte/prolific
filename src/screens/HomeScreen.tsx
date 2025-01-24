import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Text, ScrollView, SafeAreaView } from 'react-native'
import { supabase } from '../lib/supabase'
import { Topic } from '../types/database.types'
import { TopicComponent } from '../components/Topic'

export default function HomeScreen({navigation}: {navigation: any}) {
  const [topics, setTopics] = useState<Topic[]>([])
  const [userName, setUserName] = useState<string>('')

  useEffect(() => {
    const fetchUserAndTopics = async () => {
      // Fetch user data
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.user_metadata?.full_name) {
        setUserName(user.user_metadata.full_name)
      }

      // Fetch topics
      const { data, error } = await supabase.from('topics').select()
      if (data) {
        setTopics(data as Topic[])
      }
    }
    fetchUserAndTopics()
  }, [])

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <Text style={styles.welcomeText}>
                {userName ? `Hello, ${userName}` : 'Hello'}
              </Text>
            </View>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Let's Learn New Stuff!</Text>
          </View>

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
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
    backgroundColor: 'transparent',
  },
  titleContainer: {
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 16,
    color: '#6c757d',
    marginBottom: 4,
    fontWeight: '500',
  },
  title: {
    fontSize: 42,
    fontWeight: '800',
    color: '#000',
    letterSpacing: -1,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#495057',
    lineHeight: 24,
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statItemBorder: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#e9ecef',
    paddingHorizontal: 20,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6c757d',
    textAlign: 'center',
    lineHeight: 16,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  sectionHeader: {
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 42,
    fontWeight: '700',
    color: '#000',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6c757d',
    fontWeight: '500',
  },
  cardsContainer: {
    paddingHorizontal: 8,
  },
});
