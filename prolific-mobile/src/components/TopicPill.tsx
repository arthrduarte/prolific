import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Topic } from '../types/database.types';
import { FontAwesome } from '@expo/vector-icons';

interface TopicPillProps {
  topic: Topic;
  isSelected: boolean;
  onPress: (topic: Topic) => void;
  courseCount: number;
}

export const TopicPill: React.FC<TopicPillProps> = ({ topic, isSelected, onPress, courseCount }) => {
  const isLocked = courseCount === 0;

  return (
    <TouchableOpacity
      style={[
        styles.topicTag,
        isSelected && styles.topicTagSelected,
        isLocked && styles.topicTagLocked
      ]}
      onPress={() => !isLocked && onPress(topic)}
      activeOpacity={isLocked ? 1 : 0.7}
    >
      <Text style={[
        styles.topicTagText,
        isSelected && styles.topicTagTextSelected,
        isLocked && styles.topicTagTextLocked
      ]}>
        {topic.title}
      </Text>
      <View style={[
        styles.countBadge,
        isSelected && styles.countBadgeSelected,
        isLocked && styles.countBadgeLocked
      ]}>
        {isLocked ? (
          <FontAwesome name="lock" size={10} color="#868e96" />
        ) : (
          <Text style={[
            styles.countText,
            isSelected && styles.countTextSelected,
            isLocked && styles.countTextLocked
          ]}>
            {courseCount}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  topicTag: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f1f3f5',
    marginRight: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  topicTagSelected: {
    backgroundColor: '#ffd43b',
  },
  topicTagLocked: {
    backgroundColor: '#f1f3f5',
    opacity: 0.7,
  },
  topicTagText: {
    color: '#495057',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  topicTagTextSelected: {
    color: '#000',
  },
  topicTagTextLocked: {
    color: '#868e96',
  },
  countBadge: {
    backgroundColor: '#e9ecef',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countBadgeSelected: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  countBadgeLocked: {
    backgroundColor: '#e9ecef',
  },
  countText: {
    color: '#495057',
    fontSize: 12,
    fontWeight: '600',
  },
  countTextSelected: {
    color: '#000',
  },
  countTextLocked: {
    color: '#868e96',
  },
}); 