'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase/client';
import { Exercise, User_Progress } from '../types/database.types';

interface UseUserProgressReturn {
  loading: boolean;
  error: Error | null;
  userProgress: { [key: string]: User_Progress };
  isExerciseUnlocked: (exercise: Exercise) => boolean;
  updateProgress: (exerciseId: string, scorePercentage: number) => Promise<void>;
}

const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

export function useUserProgress(courseId: string): UseUserProgressReturn {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [userProgress, setUserProgress] = useState<{ [key: string]: User_Progress }>({});
  const [exercises, setExercises] = useState<Exercise[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not found');

        const { data: exercisesData, error: exercisesError } = await supabase
          .from('exercises')
          .select('*')
          .eq('course_id', courseId)
          .order('order', { ascending: true });

        if (exercisesError) throw exercisesError;
        setExercises(exercisesData as Exercise[]);

        const { data: progressData, error: progressError } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', user.id)
          .in('exercise_id', exercisesData.map(ex => ex.id));

        if (progressError) throw progressError;

        const progressMap = (progressData as User_Progress[]).reduce((acc, progress) => {
          acc[progress.exercise_id] = progress;
          return acc;
        }, {} as { [key: string]: User_Progress });

        if (exercisesData.length > 0 && !progressMap[exercisesData[0].id]) {
          const firstExercise = exercisesData[0];
          progressMap[firstExercise.id] = {
            id: generateUUID(),
            user_id: user.id,
            exercise_id: firstExercise.id,
            progress_percentage: 0,
            is_unlocked: true
          };

          await supabase
            .from('user_progress')
            .upsert(progressMap[firstExercise.id]);
        }

        setUserProgress(progressMap);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred'));
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [courseId]);

  const isExerciseUnlocked = (exercise: Exercise): boolean => {
    if (exercise.order === 1) return true;
    const progress = userProgress[exercise.id];
    return progress?.is_unlocked ?? false;
  };

  const updateProgress = async (exerciseId: string, scorePercentage: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not found');

      const exercise = exercises.find(ex => ex.id === exerciseId);
      if (!exercise) throw new Error('Exercise not found');

      const progressUpdate: User_Progress = {
        id: userProgress[exerciseId]?.id || generateUUID(),
        user_id: user.id,
        exercise_id: exerciseId,
        progress_percentage: scorePercentage,
        is_unlocked: true
      };

      const { error: updateError } = await supabase
        .from('user_progress')
        .upsert(progressUpdate);

      if (updateError) throw updateError;

      if (scorePercentage === 100) {
        const nextExercise = exercises.find(ex => ex.order === exercise.order + 1);
        if (nextExercise) {
          const nextProgressUpdate: User_Progress = {
            id: userProgress[nextExercise.id]?.id || generateUUID(),
            user_id: user.id,
            exercise_id: nextExercise.id,
            progress_percentage: 0,
            is_unlocked: true
          };

          const { error: nextUpdateError } = await supabase
            .from('user_progress')
            .upsert(nextProgressUpdate);

          if (nextUpdateError) throw nextUpdateError;

          setUserProgress(prev => ({
            ...prev,
            [exerciseId]: progressUpdate,
            [nextExercise.id]: nextProgressUpdate
          }));
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'));
      throw err;
    }
  };

  return {
    loading,
    error,
    userProgress,
    isExerciseUnlocked,
    updateProgress
  };
}
