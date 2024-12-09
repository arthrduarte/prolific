import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import { useState, useEffect } from 'react';
import { supabase } from './src/lib/supabase';
import { Session } from '@supabase/supabase-js';
import Auth from './src/components/Auth';
import CourseScreen from './src/screens/CourseScreen';
import ExerciseScreen from './src/screens/ExerciseScreen';

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
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen 
            name="Home" 
            component={HomeScreen} 
            options={{ title: 'Home' }}
          />
          <Stack.Screen 
            name="Course" 
            component={CourseScreen} 
            options={{ title: 'Course' }}
          />
          <Stack.Screen 
            name="Exercise" 
            component={ExerciseScreen} 
            options={{ title: 'Exercise' }}
          />
        </Stack.Navigator>
      ) : (
        <Auth />
      )}
    </NavigationContainer>
  );
}

