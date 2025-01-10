import React from 'react';
import { StyleSheet, View, Animated } from 'react-native';
import { Dialog, Text, Button } from 'react-native-ui-lib';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';

interface CompleteProps {
  visible: boolean;
  courseId: string;
}

type RootStackParamList = {
  HomeScreen: undefined;
  Course: { courseId: string };
  Exercise: { exerciseId: string; courseId: string };
};

type NavigationProps = NavigationProp<RootStackParamList>;

export const Complete: React.FC<CompleteProps> = ({ visible, courseId }) => {
  const navigation = useNavigation<NavigationProps>();
  const [fireworks] = React.useState(new Animated.Value(0));

  React.useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.timing(fireworks, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(fireworks, {
          toValue: 0.8,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(fireworks, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleStartAnother = () => {
    navigation.navigate('Course', { courseId });
  };

  return (
    <Dialog
      visible={visible}
      width="100%"
      height={300}
      bottom
      containerStyle={styles.dialog}
      ignoreBackgroundPress
    >
      <View style={styles.content}>
        <Animated.View 
          style={[
            styles.celebrationContainer,
            {
              transform: [{
                scale: fireworks
              }],
              opacity: fireworks
            }
          ]}
        >
          <Text style={styles.emoji}>🎉</Text>
          <Text style={styles.emoji}>🌟</Text>
          <Text style={styles.emoji}>🎊</Text>
        </Animated.View>

        <Text style={styles.title}>Well done!</Text>
        <Text style={styles.subtitle}>You've completed this exercise</Text>

        <Button
          label="Start Another Course"
          style={styles.button}
          labelStyle={styles.buttonLabel}
          onPress={handleStartAnother}
        />
      </View>
    </Dialog>
  );
};

const styles = StyleSheet.create({
  dialog: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  content: {
    padding: 24,
    alignItems: 'center',
  },
  celebrationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emoji: {
    fontSize: 40,
    marginHorizontal: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#000',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#495057',
    marginBottom: 32,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#f0dc1b',
    borderRadius: 12,
    height: 56,
    width: '100%',
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
});
