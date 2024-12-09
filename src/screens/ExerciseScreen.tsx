import React, { useEffect, useState } from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { supabase } from '../lib/supabase'
import { Exercise, Step } from '../types/database.types'
import QuestionComponent from '../components/QuestionComponent'

export default function ExerciseScreen({ route }: { route: any }) {
  const { exerciseId } = route.params
  const [exercise, setExercise] = useState<Exercise | null>(null)
  const [steps, setSteps] = useState<Step[]>([])

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
        console.log(stepsData)

      if (!stepsError && stepsData) {
        setSteps(stepsData as Step[])
      }
    }
    console.log(steps)
    fetchExercise()
  }, [exerciseId])

  if (!exercise || !steps.length) return <Text>Loading...</Text>

  return (
    <View style={styles.container}>
      <QuestionComponent 
        exercise={exercise}
        steps={steps}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
})
