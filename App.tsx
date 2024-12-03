import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { Card } from './src/components/Card';

export default function App() {
  return (
    <View style={styles.container}>
      <View style={styles.cardsContainer}>
        <View style={styles.cardsRow}>
          <Card 
            emoji="💰"
            title="Finance" 
            description="This is the description for the first card. It contains important information."
            />
          <Card 
            emoji="💼"
            title="Sales" 
            description="Here's another card with different content to showcase the component."
            />
        </View>
        <View style={styles.cardsRow}>
          <Card 
            emoji="💬"
          title="Marketing" 
          description="The third card demonstrates how multiple cards can be stacked nicely."
          />
        <Card 
          emoji="💻"
          title="IT" 
          description="And finally, the fourth card completes our card collection."
          />
          </View>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    padding: 16,
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
