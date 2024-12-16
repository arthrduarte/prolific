import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome } from '@expo/vector-icons';
import { Session } from '@supabase/supabase-js';
import HomeScreen from '../screens/HomeScreen';
import CourseScreen from '../screens/CourseScreen';
import ExerciseScreen from '../screens/ExerciseScreen';
import Account from './Account';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function AccountScreen({ route }: any) {
  const { session } = route.params;
  return <Account session={session} />;
}

function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen 
        name="HomeScreen" 
        component={HomeScreen} 
      />
      <Stack.Screen 
        name="Course" 
        component={CourseScreen} 
      />
      <Stack.Screen 
        name="Exercise" 
        component={ExerciseScreen} 
      />
    </Stack.Navigator>
  );
}

export function TabNavigator({ session }: { session: Session }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, paddingTop: insets.top }}>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#f0dc1b',
          tabBarInactiveTintColor: '#495057',
          tabBarStyle: {
            borderTopWidth: 1,
            borderTopColor: '#f1f3f5',
            height: 60 + insets.bottom,
            paddingBottom: 8 + insets.bottom,
            paddingTop: 8,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600'
          },
          tabBarIconStyle: {
            width: 24,
            height: 24,
          },
          headerShown: false,
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeStack}
          options={{
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="home" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Account"
          component={AccountScreen}
          initialParams={{ session }}
          options={{
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="user-circle" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </View>
  );
}
