import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { Topic, Course } from '../types/database.types';
import { CourseCardComponent } from './CourseCardComponent';
import { supabase } from '../lib/supabase';

interface TopicComponentProps {
  topic: Topic;
  navigation: any;
}

export const TopicComponent: React.FC<TopicComponentProps> = ({ topic, navigation }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isExpanded, setIsExpanded] = useState(true);
  const heightAnim = useState(new Animated.Value(1))[0];

  useEffect(() => {
    const fetchCourses = async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('topic_id', topic.id);
      
      if (error) {
        console.error('Error fetching courses:', error);
        return;
      }
      
      setCourses(data as Course[]);
    };

    fetchCourses();
  }, [topic.id]);

  const handleCoursePress = (course: Course) => {
    navigation.navigate('Course', { 
      courseId: course.id,
      topicId: topic.id 
    });
  };

  const toggleExpanded = () => {
    const toValue = isExpanded ? 0 : 1;
    
    Animated.timing(heightAnim, {
      toValue,
      duration: 200,
      useNativeDriver: false,
    }).start();

    setIsExpanded(!isExpanded);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        onPress={toggleExpanded}
        activeOpacity={0.7}
        style={styles.topicHeader}
      >
        <View style={styles.leftColumn}>
          <Text style={styles.courseCount}>{courses.length} Courses</Text>
          <Text style={styles.title}>{topic.title}</Text>
          <Text style={styles.description} numberOfLines={2}>
            {topic.description}
          </Text>
        </View>
        <View style={styles.rightColumn}>
          <Text style={styles.emoji}>{topic.emoji}</Text>
        </View>
      </TouchableOpacity>
      
      <Animated.View style={[
        styles.coursesContainer,
        {
          opacity: heightAnim,
          maxHeight: heightAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1000]
          }),
        }
      ]}>
        {courses.map((course) => (
          <CourseCardComponent 
            key={course.id} 
            topic={topic} 
            course={course}
            onPress={handleCoursePress}
          />
        ))}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  topicHeader: {
    flexDirection: 'row',
    marginHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  leftColumn: {
    flex: 1,
    justifyContent: 'space-between',
    paddingRight: 16,
  },
  rightColumn: {
    width: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  courseCount: {
    fontSize: 14,
    color: '#868e96',
    fontWeight: '600',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#495057',
    lineHeight: 20,
  },
  emoji: {
    fontSize: 40,
  },
  coursesContainer: {
    paddingHorizontal: 16,
    gap: 12,
    marginTop: 16,
    overflow: 'hidden',
  },
});