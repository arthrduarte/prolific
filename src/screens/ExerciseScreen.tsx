import React, { useEffect, useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { supabase } from '../lib/supabase'
import { Exercise, Question } from '../types/database.types'
import QuestionComponent from '../components/QuestionComponent'

export default function ExerciseScreen({ route }: { route: any }) {
  const { exerciseId } = route.params
  const [exercise, setExercise] = useState<Exercise | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])

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

      const { data: questionsData, error: questionsError } = await supabase
        .from('questions')
        .select('*')
        .eq('exercise_id', exerciseId)

      if (!questionsError && questionsData) {
        setQuestions(questionsData as Question[])
      }
    }

    fetchExercise()
  }, [exerciseId])

  if (!exercise || questions.length === 0) return null

  return (
    <View style={styles.container}>
      <QuestionComponent 
        exercise={exercise}
        questions={questions}
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
