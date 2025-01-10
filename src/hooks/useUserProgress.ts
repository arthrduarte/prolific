import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Exercise, User_Progress } from '../types/database.types'

interface UseUserProgressReturn {
  loading: boolean
  error: Error | null
  userProgress: { [key: string]: User_Progress }
  isExerciseUnlocked: (exercise: Exercise) => boolean
  updateProgress: (exerciseId: string, scorePercentage: number) => Promise<void>
}

export function useUserProgress(courseId: string): UseUserProgressReturn {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [userProgress, setUserProgress] = useState<{ [key: string]: User_Progress }>({})
  const [exercises, setExercises] = useState<Exercise[]>([])

  // Fetch user progress and exercises for the course
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        
        // Get current user
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('User not found')

        // Fetch all exercises for the course, ordered by their sequence
        const { data: exercisesData, error: exercisesError } = await supabase
          .from('exercises')
          .select('*')
          .eq('course_id', courseId)
          .order('order', { ascending: true })

        if (exercisesError) throw exercisesError
        setExercises(exercisesData as Exercise[])

        // Fetch user progress for these exercises
        const { data: progressData, error: progressError } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', user.id)
          .in('exercise_id', exercisesData.map(ex => ex.id))

        if (progressError) throw progressError

        // Convert progress array to object for easier lookup
        const progressMap = (progressData as User_Progress[]).reduce((acc, progress) => {
          acc[progress.exercise_id] = progress
          return acc
        }, {} as { [key: string]: User_Progress })

        // Ensure first exercise is unlocked
        if (exercisesData.length > 0 && !progressMap[exercisesData[0].id]) {
          const firstExercise = exercisesData[0]
          progressMap[firstExercise.id] = {
            id: crypto.randomUUID(),
            user_id: user.id,
            exercise_id: firstExercise.id,
            score_percentage: 0,
            is_unlocked: true
          }

          // Create progress entry for first exercise if it doesn't exist
          await supabase
            .from('user_progress')
            .upsert(progressMap[firstExercise.id])
        }

        setUserProgress(progressMap)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred'))
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [courseId])

  const isExerciseUnlocked = (exercise: Exercise): boolean => {
    // First exercise is always unlocked
    if (exercise.order === 1) return true

    // Check if this exercise has a progress entry and is marked as unlocked
    const progress = userProgress[exercise.id]
    if (progress?.is_unlocked) return true

    // Otherwise, check if previous exercise is completed
    const previousExercise = exercises.find(ex => ex.order === exercise.order - 1)
    if (!previousExercise) return false

    const previousProgress = userProgress[previousExercise.id]
    return previousProgress?.score_percentage >= 100
  }

  const updateProgress = async (exerciseId: string, scorePercentage: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not found')

      const exercise = exercises.find(ex => ex.id === exerciseId)
      if (!exercise) throw new Error('Exercise not found')

      // Update current exercise progress
      const progressUpdate: User_Progress = {
        id: userProgress[exerciseId]?.id || crypto.randomUUID(),
        user_id: user.id,
        exercise_id: exerciseId,
        score_percentage: scorePercentage,
        is_unlocked: true
      }

      const { error: updateError } = await supabase
        .from('user_progress')
        .upsert(progressUpdate)

      if (updateError) throw updateError

      // If exercise is completed, unlock the next one
      if (scorePercentage === 100) {
        const nextExercise = exercises.find(ex => ex.order === exercise.order + 1)
        if (nextExercise) {
          const nextProgressUpdate: User_Progress = {
            id: userProgress[nextExercise.id]?.id || crypto.randomUUID(),
            user_id: user.id,
            exercise_id: nextExercise.id,
            score_percentage: 0,
            is_unlocked: true
          }

          const { error: nextUpdateError } = await supabase
            .from('user_progress')
            .upsert(nextProgressUpdate)

          if (nextUpdateError) throw nextUpdateError

          // Update local state
          setUserProgress(prev => ({
            ...prev,
            [exerciseId]: progressUpdate,
            [nextExercise.id]: nextProgressUpdate
          }))
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'))
      throw err
    }
  }

  return {
    loading,
    error,
    userProgress,
    isExerciseUnlocked,
    updateProgress
  }
}
