import { Card } from '../components/Card'
import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { StyleSheet, View, Text } from 'react-native';

export default function HomeScreen({navigation}: {navigation: any}) {
  return (
        <View style={styles.container}>
      <Text style={styles.title}>Prolific</Text>
      <View style={styles.cardsContainer}>
        <View style={styles.cardsRow}>
          <Card 
            emoji="💰"
            title="Finance" 
            description="This is the description for the first card. It contains important information."
            onPress={() => navigation.navigate('Finance')}
          />
          <Card 
            emoji="💼"
            title="Sales" 
            description="Here's another card with different content to showcase the component."
            onPress={() => navigation.navigate('Sales')}
          />
        </View>
        <View style={styles.cardsRow}>
          <Card 
            emoji="💬"
            title="Marketing" 
            description="The third card demonstrates how multiple cards can be stacked nicely."
            onPress={() => navigation.navigate('Marketing')}
          />
          <Card 
            emoji="💻"
            title="IT" 
            description="And finally, the fourth card completes our card collection."
            onPress={() => navigation.navigate('IT')}
          />
        </View>
      </View>
      <StatusBar style="light" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
  },
  cardsContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  cardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
});
