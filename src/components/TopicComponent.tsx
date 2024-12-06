import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Topic } from '../types/database.types';

export const TopicComponent = ({ topic }: { topic: Topic }) => {
  return (
    <TouchableOpacity style={styles.container}>
      <Text style={styles.title}>{topic.title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
});