import React, { useEffect } from 'react';
import { Audio as ExpoAudio } from 'expo-av';
import { usePreferences } from '../contexts/PreferencesContext';

interface AudioPlayerProps {
  sound: ExpoAudio.Sound | null;
  onComplete?: () => void;
  shouldPlay?: boolean;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ 
  sound,
  onComplete,
  shouldPlay = false
}) => {
  const { voiceMode } = usePreferences();

  useEffect(() => {
    if (sound && shouldPlay && voiceMode) {
      const playAudio = async () => {
        try {
          await sound.setPositionAsync(0);
          await sound.playAsync();
        } catch (error) {
          console.log('Error playing audio:', error);
        }
      };

      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          onComplete?.();
        }
      });

      playAudio();
    }

    return () => {
      if (sound) {
        sound.stopAsync();
      }
    };
  }, [sound, shouldPlay, voiceMode]);

  return null;
}; 