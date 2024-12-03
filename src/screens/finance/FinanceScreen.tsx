import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

const FINANCE_LEVELS = [
  {
    id: 1,
    title: 'Basics of Finance',
    description: 'Learn the fundamental concepts of finance',
    isLocked: false,
  },
  {
    id: 2,
    title: 'Budgeting',
    description: 'Master personal and business budgeting',
    isLocked: true,
  },
  {
    id: 3,
    title: 'Investment',
    description: 'Understand investment principles',
    isLocked: true,
  },
  {
    id: 4,
    title: 'Risk Management',
    description: 'Learn to identify and manage financial risks',
    isLocked: true,
  },
];

export const FinanceScreen = ({ navigation }: { navigation: any }) => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.emoji}>💰</Text>
        <Text style={styles.title}>Finance Department</Text>
        <Text style={styles.description}>Master financial concepts level by level</Text>
      </View>
      
      <View style={styles.levelsContainer}>
        {FINANCE_LEVELS.map((level) => (
          <TouchableOpacity
            key={level.id}
            style={[
              styles.levelCard,
              level.isLocked && styles.lockedLevel
            ]}
            onPress={() => {
              if (!level.isLocked) {
                navigation.navigate('FinanceQuiz', { levelId: level.id });
              }
            }}
            disabled={level.isLocked}
          >
            <View style={styles.levelHeader}>
              <Text style={styles.levelTitle}>Level {level.id}</Text>
              {level.isLocked && (
                <Text style={styles.lockEmoji}>🔒</Text>
              )}
            </View>
            <Text style={styles.levelName}>{level.title}</Text>
            <Text style={styles.levelDescription}>{level.description}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  emoji: {
    fontSize: 72,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  levelsContainer: {
    padding: 16,
  },
  levelCard: {
    backgroundColor: '#f0dc1b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  lockedLevel: {
    backgroundColor: '#f5f5f5',
    opacity: 0.8,
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  levelTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  lockEmoji: {
    fontSize: 20,
  },
  levelName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
  },
  levelDescription: {
    fontSize: 14,
    color: '#000000',
    opacity: 0.8,
  },
}); 