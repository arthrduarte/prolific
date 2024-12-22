import { NavigationContainer } from '@react-navigation/native';
import { useState, useEffect } from 'react';
import { supabase } from './src/lib/supabase';
import { Session } from '@supabase/supabase-js';
import Auth from './src/components/Auth';
import { TabNavigator } from './src/components/Navbar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { PreferencesProvider } from './src/contexts/PreferencesContext';

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
    <PreferencesProvider>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <NavigationContainer>
          {session && session.user ? (
            <TabNavigator session={session} />
          ) : (
            <Auth />
          )}
        </NavigationContainer>
      </SafeAreaProvider>
    </PreferencesProvider>
  );
}

