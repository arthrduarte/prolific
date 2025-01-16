import React from 'react';
import { StyleSheet, View, Animated, Dimensions } from 'react-native';
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
  const [progress] = React.useState(new Animated.Value(0));

  React.useEffect(() => {
    if (visible) {
      Animated.parallel([
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
        ]),
        Animated.timing(progress, {
          toValue: 1,
          duration: 2500,
          useNativeDriver: false,
        })
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
      height={400}
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

        <View style={styles.progressContainer}>
          <View style={styles.progressBackground}>
            <Animated.View 
              style={[
                styles.progressBar,
                {
                  width: progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%']
                  })
                }
              ]}
            />
          </View>
          <Text style={styles.progressText}>100%</Text>
        </View>

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
    padding: 32,
    alignItems: 'center',
  },
  celebrationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 32,
  },
  emoji: {
    fontSize: 48,
    marginHorizontal: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#000',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#495057',
    marginBottom: 40,
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
  progressContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 32,
  },
  progressBackground: {
    flex: 1,
    height: 8,
    backgroundColor: '#f1f3f5',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#40c057',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#40c057',
  },
});
