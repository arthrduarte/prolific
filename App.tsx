import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { FinanceScreen } from './src/screens/finance/FinanceScreen';
import { SalesScreen } from './src/screens/SalesScreen';
import { MarketingScreen } from './src/screens/MarketingScreen';
import { ITScreen } from './src/screens/ITScreen';
import { FinanceQuizScreen } from './src/screens/finance/FinanceQuizScreen';
import HomeScreen from './src/screens/HomeScreen';
import { useState,useEffect } from 'react';
import { supabase } from './src/lib/supabase';
import { Session } from '@supabase/supabase-js';
import Auth from './src/components/Auth';
import Account from './src/components/Account';

const Stack = createNativeStackNavigator();

export default function App() {
    const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  return (
    <NavigationContainer>
      {session && session.user ? (
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
      ) : (
        <Auth />
      )}
    </NavigationContainer>
  );
}

