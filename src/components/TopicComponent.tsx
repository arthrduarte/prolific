import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Topic, Course } from '../types/database.types';
import { CourseCardComponent } from './CourseCardComponent';
import { supabase } from '../lib/supabase';

export const TopicComponent = ({ topic }: { topic: Topic }) => {
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{topic.emoji} {topic.title}</Text>
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
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  coursesContainer: {
    paddingRight: 16,
  },
});