import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import { useState, useEffect } from 'react';
import { supabase } from './src/lib/supabase';
import { Session } from '@supabase/supabase-js';
import Auth from './src/components/Auth';
import CourseScreen from './src/screens/CourseScreen';
import ExerciseScreen from './src/screens/ExerciseScreen';
import { TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Account from './src/components/Account';

const Stack = createNativeStackNavigator();

function AccountScreen({ route }: any) {
  const { session } = route.params;
  return <Account session={session} />;
}

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
            options={({ navigation }) => ({
              title: 'Home',
              headerRight: () => (
                <TouchableOpacity 
                  onPress={() => navigation.navigate('Account')}
                  style={{ marginRight: 16 }}
                >
                  <FontAwesome name="user-circle" size={24} color="#495057" />
                </TouchableOpacity>
              ),
            })}
          />
          <Stack.Screen 
            name="Course" 
            component={CourseScreen} 
            options={({ navigation }) => ({
              title: 'Course',
              headerRight: () => (
                <TouchableOpacity 
                  onPress={() => navigation.navigate('Account')}
                  style={{ marginRight: 16 }}
                >
                  <FontAwesome name="user-circle" size={24} color="#495057" />
                </TouchableOpacity>
              ),
            })}
          />
          <Stack.Screen 
            name="Exercise" 
            component={ExerciseScreen} 
            options={({ navigation }) => ({
              title: 'Exercise',
              headerRight: () => (
                <TouchableOpacity 
                  onPress={() => navigation.navigate('Account')}
                  style={{ marginRight: 16 }}
                >
                  <FontAwesome name="user-circle" size={24} color="#495057" />
                </TouchableOpacity>
              ),
            })}
          />
          <Stack.Screen 
            name="Account" 
            component={AccountScreen}
            initialParams={{ session }}
            options={{ 
              title: 'Account',
            }}
          />
        </Stack.Navigator>
      ) : (
        <Auth />
      )}
    </NavigationContainer>
  );
}

