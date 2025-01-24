import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Topic } from '../types/database.types';

interface TopicPillProps {
  topic: Topic;
  isSelected: boolean;
  onPress: (topic: Topic) => void;
  courseCount: number;
}

export const TopicPill: React.FC<TopicPillProps> = ({ topic, isSelected, onPress, courseCount }) => {
  return (
    <TouchableOpacity
      style={[
        styles.topicTag,
        isSelected && styles.topicTagSelected
      ]}
      onPress={() => onPress(topic)}
    >
      <Text style={[
        styles.topicTagText,
        isSelected && styles.topicTagTextSelected
      ]}>
        {topic.title}
      </Text>
      <View style={[
        styles.countBadge,
        isSelected && styles.countBadgeSelected
      ]}>
        <Text style={[
          styles.countText,
          isSelected && styles.countTextSelected
        ]}>
          {courseCount}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  topicTag: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#212529',
    marginRight: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  topicTagSelected: {
    backgroundColor: '#ffd43b',
  },
  topicTagText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  topicTagTextSelected: {
    color: '#000',
  },
  countBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countBadgeSelected: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  countText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  countTextSelected: {
    color: '#000',
  },
}); 