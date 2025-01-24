import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Text, ScrollView, SafeAreaView } from 'react-native'
import { supabase } from '../lib/supabase'
import { Topic, Course } from '../types/database.types'
import { CourseCard } from '../components/CourseCard'
import { TopicPill } from '../components/TopicPill'

interface TopicWithCount extends Topic {
  courseCount: number;
}

export default function HomeScreen({navigation}: {navigation: any}) {
  const [topics, setTopics] = useState<TopicWithCount[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [userName, setUserName] = useState<string>('')
  const [selectedTopic, setSelectedTopic] = useState<TopicWithCount | null>(null)

  useEffect(() => {
    const fetchUserAndTopics = async () => {
      // Fetch user data
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.user_metadata?.full_name) {
        setUserName(user.user_metadata.full_name)
      }

      // Fetch topics with course counts
      const { data: topicsData } = await supabase
        .from('topics')
        .select('*, courses(count)')

      if (topicsData) {
        const topicsWithCount = topicsData.map(topic => ({
          ...topic,
          courseCount: topic.courses[0].count
        })) as TopicWithCount[]
        
        setTopics(topicsWithCount)
        if (topicsWithCount.length > 0) {
          setSelectedTopic(topicsWithCount[0])
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
    const topicWithCount = topics.find(t => t.id === topic.id)
    if (topicWithCount) {
      setSelectedTopic(topicWithCount)
    }
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
            <TopicPill
              key={topic.id}
              topic={topic}
              isSelected={selectedTopic?.id === topic.id}
              onPress={handleTopicPress}
              courseCount={topic.courseCount}
            />
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
  coursesContainer: {
    paddingHorizontal: 16,
    gap: 12,
  },
});
