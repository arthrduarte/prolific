import React from 'react'
import { Course, Topic } from '../types/database.types';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';

interface CourseCardProps {
  course: Course;
  topic: Topic;
  onPress?: (course: Course) => void;
  index?: number;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, topic, onPress, index = 0 }) => {
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
        <View style={styles.contentContainer}>
          <View style={[styles.iconContainer, { backgroundColor: isYellow ? '#fff' : 'rgba(255, 255, 255, 0.9)' }]}>
            <Text style={styles.emoji}>{topic.emoji}</Text>
          </View>
          <View style={styles.titleContainer}>
            <Text style={[styles.title, { color: textColor }]} numberOfLines={2}>
              {course.title}
            </Text>
          </View>
          <Text style={[styles.description, { color: isYellow ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.9)' }]} numberOfLines={2}>
            {course.description}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const { width } = Dimensions.get('window')
const cardWidth = width * 0.75 // 75% of screen width

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
    overflow: 'hidden',
  },
  contentContainer: {
    padding: 20,
    justifyContent: 'flex-start',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emoji: {
    fontSize: 28,
  },
  titleContainer: {
    marginBottom: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 28,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 0,
  },
});
