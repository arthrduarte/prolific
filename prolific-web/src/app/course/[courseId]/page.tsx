'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/utils/supabase/client';
import { Course, Exercise } from '@/types/database.types';
import { useUserProgress } from '@/hooks/useUserProgress';
import ExerciseCard from '@/app/course/_components/ExerciseCard';
import BackButton from '@/components/BackButton';
import SkeletonLoaderQuestion from '@/app/exercise/_components/SkeletonLoaderQuestion';

export default function CoursePage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const [course, setCourse] = useState<Course | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [stepsCount, setStepsCount] = useState<{ [key: string]: number }>({});
  const [isLoading, setIsLoading] = useState(true);

  const { 
    loading: progressLoading,
    userProgress,
    isExerciseUnlocked
  } = useUserProgress(courseId);

  useEffect(() => {
    if (!courseId) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const { data: courseData, error: courseError } = await supabase
          .from('courses')
          .select('*')
          .eq('id', courseId)
          .single();

        if (!courseError && courseData) {
          setCourse(courseData as Course);
        }

        const { data: exercisesData, error: exercisesError } = await supabase
          .from('exercises')
          .select('*')
          .eq('course_id', courseId)
          .order('order', { ascending: true });

        if (!exercisesError && exercisesData) {
          setExercises(exercisesData as Exercise[]);
          
          // Fetch steps count for each exercise
          const exerciseIds = exercisesData.map(ex => ex.id);
          const { data: stepsData, error: stepsError } = await supabase
            .from('steps')
            .select('exercise_id')
            .in('exercise_id', exerciseIds);

          if (!stepsError && stepsData) {
            // Count steps for each exercise
            const counts = stepsData.reduce((acc, step) => {
              acc[step.exercise_id] = (acc[step.exercise_id] || 0) + 1;
              return acc;
            }, {} as { [key: string]: number });
            setStepsCount(counts);
          }
        }
      } catch (error) {
        console.error('Error fetching course data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [courseId]);

  const handleExercisePress = (exercise: Exercise) => {
    if (!isExerciseUnlocked(exercise)) {
      alert("Complete the previous exercise to unlock this one.");
      return;
    }

    window.location.href = `/exercise/${exercise.id}?courseId=${courseId}`;
  };

  if (isLoading || progressLoading) {
    return <SkeletonLoaderQuestion />;
  }

  if (!course) return null;

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <BackButton />
        
        <h1 className="text-5xl font-extrabold text-black mb-4 tracking-tight">
          {course.title}
        </h1>

        <div className="inline-block bg-gray-100 px-6 py-3 rounded-full mb-8">
          <span className="text-gray-700 font-semibold">
            {exercises.length} Lessons
          </span>
        </div>

        <div className="space-y-4">
          {exercises.map((exercise, index) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              index={index}
              isUnlocked={isExerciseUnlocked(exercise)}
              onPress={() => handleExercisePress(exercise)}
              steps={stepsCount[exercise.id] || 0}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
