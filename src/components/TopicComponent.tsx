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
  const rotateAnim = useState(new Animated.Value(0))[0];

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
    Animated.spring(rotateAnim, {
      toValue: isExpanded ? 1 : 0,
      useNativeDriver: true,
    }).start();
    setIsExpanded(!isExpanded);
  };

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        onPress={toggleExpanded}
        activeOpacity={0.7}
        style={styles.topicHeader}
      >
        <View style={styles.headerContent}>
          <View style={styles.titleContainer}>
            <View style={styles.iconContainer}>
              <Text style={styles.emoji}>{topic.emoji}</Text>
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.title}>{topic.title}</Text>
              <Text style={styles.description} numberOfLines={2}>
                {topic.description}
              </Text>
            </View>
          </View>
          <View style={styles.statsContainer}>
            <Text style={styles.statsText}>{courses.length} Courses</Text>
            <Animated.View style={[styles.arrow, { transform: [{ rotate }] }]}>
              <Text style={styles.arrowText}>↓</Text>
            </Animated.View>
          </View>
        </View>
      </TouchableOpacity>
      
      {isExpanded && (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.coursesContainer}
          decelerationRate="fast"
          snapToAlignment="start"
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
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 32,
  },
  topicHeader: {
    marginHorizontal: 16,
    borderRadius: 20,
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f1f3f5',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  emoji: {
    fontSize: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 12,
  },
  statsText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
    marginRight: 8,
  },
  arrow: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowText: {
    fontSize: 16,
    color: '#666',
  },
  coursesContainer: {
    paddingLeft: 16,
    paddingRight: 8,
  },
});