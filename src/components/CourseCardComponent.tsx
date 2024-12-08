import React from 'react'
import { Course, Topic } from '../types/database.types';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface CourseCardProps {
  course: Course;
  topic: Topic;
  onPress?: (course: Course) => void;
}

export const CourseCardComponent: React.FC<CourseCardProps> = ({ course, topic, onPress }) => {
  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={() => onPress && onPress(course)}
    >
      <View style={styles.square}>
        <View style={styles.iconContainer}>
          <Text style={styles.emoji}>{topic.emoji}</Text>
        </View>
      </View>
      <Text style={styles.title} numberOfLines={2}>
        {course.title}
      </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    width: 120,
    marginRight: 16,
    alignItems: 'center',
  },
  square: {
    width: 120,
    height: 120,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 16,
    marginBottom: 8,
    overflow: 'hidden',
    backgroundColor: '#f0dc1b',
    padding: 16,
    justifyContent: 'center',
  },
  iconContainer: {
    borderRadius: 12,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12
  },
  emoji: {
    fontSize: 42,
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    width: '100%',
    textAlign: 'center',
  },
});
