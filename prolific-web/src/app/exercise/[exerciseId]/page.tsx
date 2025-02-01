'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Exercise, Step } from '@/types/database.types';
import Question from '@/components/question/Question';
import SkeletonLoaderQuestion from '@/components/SkeletonLoaderQuestion';
import { useUserProgress } from '@/hooks/useUserProgress';
import { FaChevronLeft } from 'react-icons/fa';
import { motion, useSpring, useTransform } from 'framer-motion';

export default function ExercisePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const exerciseId = params.exerciseId as string;
  const courseId = searchParams.get('courseId');

  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const { updateProgress } = useUserProgress(courseId || '');

  // Progress animation
  const progress = useSpring(0);
  const progressWidth = useTransform(progress, [0, 1], ['0%', '100%']);

  useEffect(() => {
    if (steps.length > 0) {
      progress.set((currentStepIndex + 1) / steps.length);
    }
  }, [currentStepIndex, steps.length, progress]);

  useEffect(() => {
    const fetchExerciseData = async () => {
      setIsLoading(true);
      try {
        // Fetch exercise
        const { data: exerciseData, error: exerciseError } = await supabase
          .from('exercises')
          .select('*')
          .eq('id', exerciseId)
          .single();

        if (exerciseError) throw exerciseError;
        if (exerciseData) setExercise(exerciseData);

        // Fetch steps
        const { data: stepsData, error: stepsError } = await supabase
          .from('steps')
          .select('*')
          .eq('exercise_id', exerciseId)
          .order('order', { ascending: true });

        if (stepsError) throw stepsError;
        if (stepsData) setSteps(stepsData);

      } catch (error) {
        console.error('Error fetching exercise data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (exerciseId) {
      fetchExerciseData();
    }
  }, [exerciseId]);

  const handleStepComplete = () => {
    setCurrentStepIndex(prev => prev + 1);
  };

  const handleExerciseComplete = async () => {
    if (!courseId || !exercise) return;
    
    try {
      await updateProgress(exercise.id);
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const handleGoBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    } else {
      router.back();
    }
  };

  if (isLoading) {
    return <SkeletonLoaderQuestion />;
  }

  if (!exercise || !steps.length) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-500">Exercise not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className={`
        px-6 pt-4 pb-6 md:px-8 bg-white border-b border-gray-100
        ${currentStepIndex === 0 ? 'pb-6' : 'pb-4'}
      `}>
        <div className={`
          flex items-center gap-3
          ${currentStepIndex === 0 ? 'mb-4' : 'mb-0'}
        `}>
          <button
            onClick={handleGoBack}
            className="w-4 h-8 flex items-center justify-center hover:text-gray-600 transition-colors"
          >
            <FaChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-yellow-400 rounded-full"
              style={{ width: progressWidth }}
            />
          </div>
        </div>
        {currentStepIndex === 0 && (
          <h1 className="text-4xl font-bold text-black tracking-tight">
            {exercise.title}
          </h1>
        )}
      </div>

      <div className="flex-1">
        <Question
          exercise={exercise}
          steps={steps}
          currentStepIndex={currentStepIndex}
          onStepComplete={handleStepComplete}
          onExerciseComplete={handleExerciseComplete}
        />
      </div>
    </div>
  );
} 