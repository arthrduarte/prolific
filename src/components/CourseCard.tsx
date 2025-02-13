import React from 'react'
import { Course, Topic } from '../types/database.types';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

interface CourseCardProps {
  course: Course;
  topic: Topic;
  onPress?: (course: Course) => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, onPress }) => {
  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={() => onPress && onPress(course)}
      activeOpacity={0.9}
    >
      <View style={styles.card}>
        <View>
          <Text style={styles.title} numberOfLines={2}>
            {course.title}
          </Text>
          <Text 
            style={styles.description}
            numberOfLines={2}
          >
            {course.description}
          </Text>
        </View>
        <View style={styles.button}>
          <Text style={styles.buttonText}>
            Start Learning
          </Text>
          <FontAwesome 
            name="play" 
            size={14}
            color="#fff"
          />
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  card: {
    borderRadius: 20,
    padding: 20,
    minHeight: 230,
    justifyContent: 'space-between',
    backgroundColor: '#ffd43b',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 32,
    marginBottom: 8,
    color: '#000',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
    color: 'rgba(0, 0, 0, 0.7)',
  },
  button: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#212529',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
