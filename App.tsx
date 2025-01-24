import 'react-native-url-polyfill/auto'
import { NavigationContainer } from '@react-navigation/native';
import { useState, useEffect } from 'react';
import { supabase } from './src/lib/supabase';
import { Session } from '@supabase/supabase-js';
import Auth from './src/components/Auth';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { PreferencesProvider } from './src/contexts/PreferencesContext';
import { DataProvider } from './src/contexts/DataContext';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import CourseScreen from './src/screens/CourseScreen';
import ExerciseScreen from './src/screens/ExerciseScreen';
import Settings from './src/components/Settings';

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
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <PreferencesProvider>
        <DataProvider>
          <NavigationContainer>
            <Stack.Navigator screenOptions={{
              headerShown: false,
              animation: 'slide_from_right',
            }}>
              {session && session.user ? (
                <>
                  <Stack.Screen name="Home" component={HomeScreen} />
                  <Stack.Screen name="Course" component={CourseScreen} />
                  <Stack.Screen name="Exercise" component={ExerciseScreen} />
                  <Stack.Screen name="Settings" component={Settings} />
                </>
              ) : (
                <Stack.Screen name="Auth" component={Auth} />
              )}
            </Stack.Navigator>
          </NavigationContainer>
        </DataProvider>
      </PreferencesProvider>
    </SafeAreaProvider>
  );
}

