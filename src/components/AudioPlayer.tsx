import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Audio as ExpoAudio } from 'expo-av';
import { FontAwesome } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';
import { Audio } from '../types/database.types';

interface AudioPlayerProps {
  audioId: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioId }) => {
  const [sound, setSound] = useState<ExpoAudio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  useEffect(() => {
    loadAudio();
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [audioId]);

  const loadAudio = async () => {
    try {
      setIsLoading(true);
      
      // Fetch audio URL from Supabase
      const { data: audioData, error: audioError } = await supabase
        .from('audio')
        .select('file_url')
        .eq('id', audioId)
        .single();

      if (audioError) {
        throw audioError;
      }
      
      if (!audioData) {
        throw new Error('Audio not found');
      }

      console.log('Loading audio from URL:', audioData.file_url);

      // Load the audio file directly using the stored URL
      const { sound: audioSound } = await ExpoAudio.Sound.createAsync(
        { uri: audioData.file_url },
        { shouldPlay: false }
      );

      setSound(audioSound);
      
      // Add playback status listener
      audioSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded) {
          setIsPlaying(status.isPlaying);
          if (status.didJustFinish) {
            setIsPlaying(false);
          }
        }
      });

      setIsLoading(false);
    } catch (error) {
      console.error('Error loading audio:', error);
      setIsLoading(false);
    }
  };

  const handlePlayPause = async () => {
    if (!sound) return;

    if (isPlaying) {
      await sound.pauseAsync();
    } else {
      await sound.playAsync();
    }
  };

  if (!audioId) return null;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={handlePlayPause}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#495057" />
        ) : (
          <FontAwesome
            name={isPlaying ? 'pause' : 'play'}
            size={16}
            color="#495057"
          />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
}); 