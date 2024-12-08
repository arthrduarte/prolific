import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Topic, Course } from '../types/database.types';
import { CourseCardComponent } from './CourseCardComponent';
import { supabase } from '../lib/supabase';

export const TopicComponent = ({ topic, navigation }: { topic: Topic; navigation: any }) => {
  const [courses, setCourses] = useState<Course[]>([]);

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

  return (
    <View style={styles.container}>
      <View style={styles.topicHeader}>
        <View style={styles.titleContainer}>
          <Text style={styles.emoji}>{topic.emoji}</Text>
          <Text style={styles.title}>{topic.title}</Text>
        </View>
        <Text style={styles.description}>{topic.description}</Text>
      </View>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.coursesContainer}
      >
        {courses.map((course) => (
          <CourseCardComponent 
            key={course.id} 
            topic={topic} 
            course={course}
            onPress={handleCoursePress}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 32,
  },
  topicHeader: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  emoji: {
    fontSize: 24,
    marginRight: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  coursesContainer: {
    paddingLeft: 16,
    paddingRight: 8,
  },
});