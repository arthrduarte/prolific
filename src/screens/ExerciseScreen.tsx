import React, { useEffect, useState } from 'react'
import { View, StyleSheet, Text, Animated, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { supabase } from '../lib/supabase'
import { Exercise, Step } from '../types/database.types'
import QuestionComponent from '../components/question/Question'
import { useUserProgress } from '../hooks/useUserProgress'
import { FontAwesome } from '@expo/vector-icons'
import UnderConstruction from '../components/UnderConstruction'
import { SkeletonLoaderQuestion } from '../components/SkeletonLoaderQuestion'

export default function ExerciseScreen({ route, navigation }: { route: any, navigation: any }) {
  const { exerciseId, courseId } = route.params
  const { updateProgress } = useUserProgress(courseId)
  const [exercise, setExercise] = useState<Exercise | null>(null)
  const [steps, setSteps] = useState<Step[]>([])
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [progressWidth] = useState(() => new Animated.Value(0))

  useEffect(() => {
    const fetchExercise = async () => {
      setIsLoading(true)
      try {
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
      } catch (error) {
        console.error('Error fetching exercise:', error)
      } finally {
        // Add a minimum delay of 500ms to prevent flickering
        setTimeout(() => {
          setIsLoading(false)
        }, 500)
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
  }, [currentStepIndex, steps.length, progressWidth])

  if (isLoading) {
    return <SkeletonLoaderQuestion />
  }

  // Show UnderConstruction only if we have the exercise data but no steps
  if (exercise && steps.length === 0) {
    return <UnderConstruction />
  }

  // Show nothing if we don't have exercise data yet
  if (!exercise) {
    return null
  }

  const handleStepComplete = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1)
    }
  }

  const handleExerciseComplete = async () => {
    try {
      await updateProgress(exerciseId, 100)
    } catch (error) {
      console.error('Failed to update progress:', error)
    }
  }

  const handleGoBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1)
    }
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={[
        styles.header,
        { paddingBottom: currentStepIndex === 0 ? 24 : 16 }
      ]}>
        <View style={[
          styles.progressContainer,
          { marginBottom: currentStepIndex === 0 ? 16 : 0 }
        ]}>
          {currentStepIndex > 0 && (
            <TouchableOpacity 
              style={styles.backButton}
              onPress={handleGoBack}
              activeOpacity={0.7}
            >
              <FontAwesome name="chevron-left" size={16} color="#000" />
            </TouchableOpacity>
          )}
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
          onExerciseComplete={handleExerciseComplete}
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
  header: {
    paddingTop: 16,
    paddingHorizontal: 24,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f5',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressBackground: {
    flex: 1,
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
    backgroundColor: '#ffd43b',
    borderRadius: 2,
  },
  title: {
    fontSize: 42,
    fontWeight: '700',
    color: '#000',
    letterSpacing: -0.5,
  },
  content: {
    flex: 1,
  },
  backButton: {
    width: 16,
    height: 32,
    backgroundColor: '#fff',
    borderRadius: 16,
    justifyContent: 'center',
  },
});
