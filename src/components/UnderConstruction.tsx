import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

export const UnderConstruction: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <FontAwesome name="wrench" size={32} color="#495057" />
      </View>
      <Text style={styles.title}>Under Construction</Text>
      <Text style={styles.description}>
        We're working hard to create this exercise.{'\n'}
        Please check back soon!
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 24,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  cogIcon: {
    marginLeft: -8,
    marginTop: -16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  description: {
    fontSize: 16,
    color: '#495057',
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default UnderConstruction;
