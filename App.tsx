import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { FinanceScreen } from './src/screens/finance/FinanceScreen';
import { SalesScreen } from './src/screens/SalesScreen';
import { MarketingScreen } from './src/screens/MarketingScreen';
import { ITScreen } from './src/screens/ITScreen';
import { FinanceQuizScreen } from './src/screens/finance/FinanceQuizScreen';
import HomeScreen from './src/screens/HomeScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerTintColor: '#000000',
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
          name="FinanceQuiz" 
          component={FinanceQuizScreen} 
          options={{ title: 'Finance Quiz' }}
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

