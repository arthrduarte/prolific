'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface AudioCache {
  [key: string]: {
    audio: HTMLAudioElement;
    url: string;
  };
}

export const useAudioPreloader = (
  currentStepAudioId: string | null,
  previousStepAudioId: string | null,
  nextStepAudioId: string | null
) => {
  const [audioCache, setAudioCache] = useState<AudioCache>({});

  const loadAudio = async (audioId: string) => {
    try {
      // Skip if already loaded
      if (audioCache[audioId]) return;

      const { data: audioData, error } = await supabase
        .from('audio')
        .select('file_url')
        .eq('id', audioId)
        .single();

      if (error || !audioData) {
        console.log('Error loading audio:', error);
        return;
      }

      const audio = new Audio(audioData.file_url);
      await audio.load(); // Preload the audio

      setAudioCache(prev => ({
        ...prev,
        [audioId]: {
          audio,
          url: audioData.file_url
        }
      }));
    } catch (error) {
      console.log('Error in loadAudio:', error);
    }
  };

  const unloadAudio = (audioId: string) => {
    if (audioCache[audioId]) {
      const audio = audioCache[audioId].audio;
      audio.pause();
      audio.src = ''; // Clear the source
      setAudioCache(prev => {
        const newCache = { ...prev };
        delete newCache[audioId];
        return newCache;
      });
    }
  };

  useEffect(() => {
    const loadPrioritized = async () => {
      // Load current step first
      if (currentStepAudioId) {
        await loadAudio(currentStepAudioId);
      }

      // Then load next and previous in parallel
      if (nextStepAudioId) loadAudio(nextStepAudioId);
      if (previousStepAudioId) loadAudio(previousStepAudioId);
    };

    loadPrioritized();

    // Cleanup old audio files
    return () => {
      Object.keys(audioCache).forEach(audioId => {
        if (
          audioId !== currentStepAudioId &&
          audioId !== previousStepAudioId &&
          audioId !== nextStepAudioId
        ) {
          unloadAudio(audioId);
        }
      });
    };
  }, [currentStepAudioId, previousStepAudioId, nextStepAudioId]);

  return {
    getAudio: (audioId: string) => audioCache[audioId]?.audio || null,
    isLoaded: (audioId: string) => !!audioCache[audioId]
  };
};
