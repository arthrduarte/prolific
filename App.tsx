import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import { useState, useEffect } from 'react';
import { supabase } from './src/lib/supabase';
import { Session } from '@supabase/supabase-js';
import { TopicScreen } from './src/screens/TopicScreen';
import { QuizScreen } from './src/screens/QuizScreen';
import Auth from './src/components/Auth';

type RootStackParamList = {
  Home: undefined;
  Topic: { topicId: number; topicTitle: string };
  Quiz: { levelId: number; topicId: number; levelTitle: string; topicTitle: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

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
            name="Topic" 
            component={TopicScreen}
            options={({ route }) => ({ 
              title: route.params?.topicTitle || 'Topic'
            })}
          />
          <Stack.Screen 
            name="Quiz" 
            component={QuizScreen}
            options={({ route }) => ({ 
              title: route.params?.levelTitle || 'Quiz'
            })}
          />
        </Stack.Navigator>
      ) : (
        <Auth />
      )}
    </NavigationContainer>
  );
}

