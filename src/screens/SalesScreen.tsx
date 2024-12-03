import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const SalesScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>💼</Text>
      <Text style={styles.title}>Sales Department</Text>
      <Text style={styles.description}>Track your sales performance, manage client relationships, and monitor revenue targets in real-time.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 20,
  },
  emoji: {
    fontSize: 72,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
}); 