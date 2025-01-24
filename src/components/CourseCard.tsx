import React from 'react'
import { Course, Topic } from '../types/database.types';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

interface CourseCardProps {
  course: Course;
  topic: Topic;
  onPress?: (course: Course) => void;
  index?: number;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, onPress, index = 0 }) => {
  const isYellow = index % 2 === 0;
  const backgroundColor = isYellow ? '#ffd43b' : '#212529';
  const textColor = isYellow ? '#000' : '#fff';

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={() => onPress && onPress(course)}
      activeOpacity={0.9}
    >
      <View style={[styles.card, { backgroundColor }]}>
        <View>
          <Text style={[styles.title, { color: textColor }]} numberOfLines={2}>
            {course.title}
          </Text>
          <Text 
            style={[
              styles.description, 
              { color: isYellow ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)' }
            ]} 
            numberOfLines={2}
          >
            {course.description}
          </Text>
        </View>
        <View style={[
          styles.button,
          { backgroundColor: isYellow ? '#212529' : '#ffd43b' }
        ]}>
          <Text style={[
            styles.buttonText,
            { color: isYellow ? '#fff' : '#000' }
          ]}>
            Start Learning
          </Text>
          <FontAwesome 
            name="play" 
            size={14}
            color={isYellow ? '#fff' : '#000'}
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
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 32,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  button: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
