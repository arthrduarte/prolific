import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Topic } from '../types/database.types';

interface TopicPillProps {
  topic: Topic;
  isSelected: boolean;
  onPress: (topic: Topic) => void;
}

export const TopicPill: React.FC<TopicPillProps> = ({ topic, isSelected, onPress }) => {
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
        {topic.title} {topic.emoji}
      </Text>
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
  },
  topicTagSelected: {
    backgroundColor: '#ffd43b',
  },
  topicTagText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  topicTagTextSelected: {
    color: '#000',
  },
}); 