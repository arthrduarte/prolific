import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Level, Topic, User_Progress } from '../types/database.types';

export interface LevelWithProgress extends Level {
  user_progress?: User_Progress;
}

const useTopic = (topicId: number | undefined) => {
  const [topic, setTopic] = useState<Topic | null>(null);
  const [levels, setLevels] = useState<LevelWithProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTopic = useCallback(async () => {
    const { data, error } = await supabase.from('topics').select('*').eq('id', topicId);
    if (error) throw error;
    setTopic(data[0]);
  }, [topicId]);

  const fetchLevelsWithProgress = useCallback(async () => {
    try {
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Fetch levels for the current topic
      const { data: levelsData, error: levelsError } = await supabase
        .from('levels')
        .select('*')
        .eq('topic_id', topicId)
        .order('id');

      if (levelsError) throw levelsError;

      // Fetch user progress for these levels
      const { data: progressData, error: progressError } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .in('level_id', levelsData.map(level => level.id));

      if (progressError) throw progressError;

      // Combine levels with their progress
      const levelsWithProgress = levelsData.map((level) => ({
        ...level,
        user_progress: progressData.find(progress => progress.level_id === level.id)
      }));

      setLevels(levelsWithProgress);
    } catch (err) {
      console.error('Error in fetchLevelsWithProgress:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [topicId]);

  const refresh = useCallback(async () => {
    if (!topicId) {
      setError('Topic ID is missing');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await Promise.all([fetchLevelsWithProgress(), fetchTopic()]);
    } finally {
      setLoading(false);
    }
  }, [topicId, fetchLevelsWithProgress, fetchTopic]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { topic, levels, loading, error, refresh };
};

export default useTopic; 