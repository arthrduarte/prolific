import React from 'react'
import { Course, Topic } from '../types/database.types';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface CourseCardProps {
  course: Course;
  topic: Topic;
  onPress?: (course: Course) => void;
}

const getGradientColors = (emoji: string): string[] => {
  const colorMap: { [key: string]: string[] } = {
    '💰': ['#FFD700', '#FFA500'], 
    '📈': ['#9C27B0', '#6A1B9A'], 
    '🛒': ['#4CAF50', '#2E7D32'], 
    '💻': ['#2196F3', '#1565C0'], 
    // Add more emoji-to-color mappings as needed
  }

  return colorMap[emoji] || ['#6c5ce7', '#a55eea'] // Default gradient
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, topic, onPress }) => {
  const gradientColors = getGradientColors(topic.emoji)

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={() => onPress && onPress(course)}
      activeOpacity={0.9}
    >
      <LinearGradient
        colors={gradientColors as [string, string, ...string[]]}
        style={styles.card}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.contentContainer}>
          <View style={styles.iconContainer}>
            <Text style={styles.emoji}>{topic.emoji}</Text>
          </View>
          <View style={styles.titleContainer}>
            <Text style={styles.title} numberOfLines={2}>
              {course.title}
            </Text>
          </View>
          <Text style={styles.description} numberOfLines={2}>
            {course.description}
          </Text>
        </View>
      </LinearGradient>
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
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
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
    color: '#fff',
    lineHeight: 28,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  description: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 20,
    marginTop: 0,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
