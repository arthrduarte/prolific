import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Card } from './src/components/Card';
import { FinanceScreen } from './src/screens/FinanceScreen';
import { SalesScreen } from './src/screens/SalesScreen';
import { MarketingScreen } from './src/screens/MarketingScreen';
import { ITScreen } from './src/screens/ITScreen';

const Stack = createNativeStackNavigator();

function HomeScreen({ navigation }: { navigation: any }) {
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
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerTintColor: '#f0dc1b',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'Dashboard' }}
        />
        <Stack.Screen 
          name="Finance" 
          component={FinanceScreen} 
        />
        <Stack.Screen 
          name="Sales" 
          component={SalesScreen} 
        />
        <Stack.Screen 
          name="Marketing" 
          component={MarketingScreen} 
        />
        <Stack.Screen 
          name="IT" 
          component={ITScreen} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
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
