import React, { useEffect, useState } from 'react'
import { View, StyleSheet, Text, SafeAreaView, Animated } from 'react-native'
import { supabase } from '../lib/supabase'
import { Exercise, Step } from '../types/database.types'
import QuestionComponent from '../components/question/Question'

export default function ExerciseScreen({ route, navigation }: { route: any, navigation: any }) {
  const { exerciseId } = route.params
  const [exercise, setExercise] = useState<Exercise | null>(null)
  const [steps, setSteps] = useState<Step[]>([])
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const progressWidth = new Animated.Value(0)

  useEffect(() => {
    const fetchExercise = async () => {
      const { data: exerciseData, error: exerciseError } = await supabase
        .from('exercises')
        .select('*')
        .eq('id', exerciseId)
        .single()

      if (!exerciseError && exerciseData) {
        setExercise(exerciseData as Exercise)
      }

      const { data: stepsData, error: stepsError } = await supabase
        .from('steps')
        .select('*')
        .eq('exercise_id', exerciseId)
        .order('order', { ascending: true })

      if (!stepsError && stepsData) {
        setSteps(stepsData as Step[])
      }
    }

    fetchExercise()
  }, [exerciseId])

  useEffect(() => {
    if (steps.length > 0) {
      Animated.spring(progressWidth, {
        toValue: (currentStepIndex + 1) / steps.length,
        useNativeDriver: false,
        damping: 20,
        mass: 0.5,
      }).start()
    }
  }, [currentStepIndex, steps.length])

  if (!exercise || !steps.length) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading exercise...</Text>
      </View>
    )
  }

  const handleStepComplete = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1)
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
        <View style={[
          styles.header,
          { paddingBottom: currentStepIndex === 0 ? 24 : 16 }
        ]}>
          <View style={[
            styles.progressContainer,
            { marginBottom: currentStepIndex === 0 ? 16 : 0 }
          ]}>
            <View style={[
              styles.progressBackground,
              { marginBottom: currentStepIndex === 0 ? 8 : 0 }
            ]}>
              <Animated.View 
                style={[
                  styles.progressBar,
                  {
                    width: progressWidth.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '100%']
                    })
                  }
                ]}
              />
            </View>
          </View>
          {currentStepIndex === 0 && (
            <Text style={styles.title}>{exercise.title}</Text>
          )}
        </View>

        <View style={styles.content}>
          <QuestionComponent 
            exercise={exercise}
            steps={steps}
            currentStepIndex={currentStepIndex}
            onStepComplete={handleStepComplete}
          />
        </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  header: {
    paddingTop: 16,
    paddingHorizontal: 24,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f5',
  },
  progressContainer: {
  },
  progressBackground: {
    height: 4,
    backgroundColor: '#f1f3f5',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#2196f3',
    borderRadius: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
    letterSpacing: -0.5,
  },
  content: {
    flex: 1,
  },
});
