import 'react-native-url-polyfill/auto'
import { NavigationContainer } from '@react-navigation/native';
import { useState, useEffect } from 'react';
import { supabase } from './prolific-mobile/src/lib/supabase';
import { Session } from '@supabase/supabase-js';
import Auth from './prolific-mobile/src/components/Auth';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { PreferencesProvider } from './prolific-mobile/src/contexts/PreferencesContext';
import { DataProvider } from './prolific-mobile/src/contexts/DataContext';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './prolific-mobile/src/screens/HomeScreen';
import CourseScreen from './prolific-mobile/src/screens/CourseScreen';
import ExerciseScreen from './prolific-mobile/src/screens/ExerciseScreen';
import Settings from './prolific-mobile/src/components/Settings';

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

