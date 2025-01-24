import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Text, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native'
import { supabase } from '../lib/supabase'
import { Topic, Course } from '../types/database.types'
import { CourseCard } from '../components/CourseCard'

export default function HomeScreen({navigation}: {navigation: any}) {
  const [topics, setTopics] = useState<Topic[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [userName, setUserName] = useState<string>('')
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null)

  useEffect(() => {
    const fetchUserAndTopics = async () => {
      // Fetch user data
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.user_metadata?.full_name) {
        setUserName(user.user_metadata.full_name)
      }

      // Fetch topics
      const { data: topicsData } = await supabase.from('topics').select()
      if (topicsData) {
        setTopics(topicsData as Topic[])
        if (topicsData.length > 0) {
          setSelectedTopic(topicsData[0])
        }
      }
    }
    fetchUserAndTopics()
  }, [])

  useEffect(() => {
    const fetchCourses = async () => {
      if (!selectedTopic) return
      
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('topic_id', selectedTopic.id)
      
      if (data) {
        setCourses(data as Course[])
      }
    }

    fetchCourses()
  }, [selectedTopic])

  const handleTopicPress = (topic: Topic) => {
    setSelectedTopic(topic)
  }

  const handleCoursePress = (course: Course) => {
    navigation.navigate('Course', { 
      courseId: course.id,
      topicId: selectedTopic?.id 
    })
  }

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

        {/* Topics horizontal scroll */}
        <ScrollView 
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.topicsScroll}
        >
          {topics.map((topic) => (
            <TouchableOpacity
              key={topic.id}
              style={[
                styles.topicTag,
                selectedTopic?.id === topic.id && styles.topicTagSelected
              ]}
              onPress={() => handleTopicPress(topic)}
            >
              <Text style={[
                styles.topicTagText,
                selectedTopic?.id === topic.id && styles.topicTagTextSelected
              ]}>
                {topic.title} {topic.emoji}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Courses grid */}
        <View style={styles.coursesContainer}>
          {courses.map((course, index) => (
            <CourseCard
              key={course.id}
              course={course}
              topic={selectedTopic!}
              onPress={handleCoursePress}
              index={index}
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
  topicsScroll: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 8,
  },
  topicTag: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#212529',
    marginRight: 8,
  },
  topicTagSelected: {
    backgroundColor: '#ffd43b',
  },
  topicTagText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  topicTagTextSelected: {
    color: '#000',
  },
  coursesContainer: {
    paddingHorizontal: 16,
    gap: 12,
  },
});
