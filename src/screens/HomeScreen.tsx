import { StatusBar } from 'expo-status-bar'
import React, { useState } from 'react'
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { supabase } from '../lib/supabase'
import { Topic, Course } from '../types/database.types'
import { CourseCard } from '../components/CourseCard'
import { TopicPill } from '../components/TopicPill'
import { useData } from '../contexts/DataContext'
import { SkeletonLoaderHome } from '../components/SkeletonLoaderHome'
import { FontAwesome } from '@expo/vector-icons'

export default function HomeScreen({navigation}: {navigation: any}) {
  const { topics, courses, isLoading } = useData();
  const [userName, setUserName] = useState<string>('')
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null)

  React.useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.user_metadata?.full_name) {
        setUserName(user.user_metadata.full_name)
      }
    }
    fetchUser()
  }, [])

  React.useEffect(() => {
    if (topics.length > 0 && !selectedTopic) {
      setSelectedTopic(topics[0])
    }
  }, [topics])

  const handleTopicPress = (topic: Topic) => {
    setSelectedTopic(topic)
  }

  const handleCoursePress = (course: Course) => {
    navigation.navigate('Course', { 
      courseId: course.id,
      topicId: selectedTopic?.id 
    })
  }

  const handleSettingsPress = () => {
    navigation.navigate('Settings')
  }

  const getTopicCourses = (topicId: string) => {
    return courses.filter(course => course.topic_id === topicId)
  }

  const renderSkeletonLoaderHomes = () => (
    <>
      <ScrollView 
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.topicsScroll}
      >
        {[1, 2, 3, 4].map((_, index) => (
          <SkeletonLoaderHome
            key={index}
            style={styles.topicSkeleton}
          />
        ))}
      </ScrollView>

      <View style={styles.coursesContainer}>
        {[1, 2, 3].map((_, index) => (
          <SkeletonLoaderHome
            key={index}
            style={styles.courseSkeleton}
          />
        ))}
      </View>
    </>
  )

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar style="dark" />
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <View style={styles.welcomeRow}>
              <Text style={styles.welcomeText}>
                {userName ? `Hello, ${userName}` : 'Hello'}
              </Text>
              <TouchableOpacity 
                onPress={handleSettingsPress}
                style={styles.settingsButton}
              >
                <FontAwesome name="cog" size={20} color="#6c757d" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Let's Learn New Stuff!</Text>
        </View>

        {isLoading ? (
          renderSkeletonLoaderHomes()
        ) : (
          <>
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
                  courseCount={getTopicCourses(topic.id).length}
                />
              ))}
            </ScrollView>

            {/* Courses grid */}
            <View style={styles.coursesContainer}>
              {selectedTopic && getTopicCourses(selectedTopic.id).map((course, index) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  topic={selectedTopic}
                  onPress={handleCoursePress}
                />
              ))}
            </View>
          </>
        )}
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
    paddingBottom: 8,
    backgroundColor: 'transparent',
  },
  titleContainer: {
    marginBottom: 0,
  },
  welcomeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 18,
    color: '#6c757d',
    marginBottom: 0,
    fontWeight: '500',
  },
  settingsButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  sectionHeader: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 42,
    fontWeight: '700',
    color: '#000',
    marginBottom: 0,
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
  topicSkeleton: {
    width: 120,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  courseSkeleton: {
    width: '100%',
    height: 160,
    borderRadius: 20,
  },
});
