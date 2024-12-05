import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

interface CardProps {
  title: string;
  description: string;
  emoji: string;
  onPress: () => void;
}

export const Card = ({ title, description, emoji, onPress }: CardProps) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f0dc1b',
    borderRadius: 8,
    padding: 16,
    margin: 4,
    width: '47%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    color: '#000000',
  },
  description: {
    fontSize: 16,
    color: '#000000',
    textAlign: 'center',
  },
  emoji: {
    fontSize: 48,
    marginBottom: 12,
  },
});