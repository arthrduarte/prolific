import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface PreferencesContextType {
  voiceMode: boolean;
  setVoiceMode: (value: boolean) => void;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [voiceMode, setVoiceModeState] = useState(true);

  useEffect(() => {
    // Load saved preference when component mounts
    loadVoiceModeSetting();
  }, []);

  const loadVoiceModeSetting = async () => {
    try {
      const savedVoiceMode = await AsyncStorage.getItem('voiceMode');
      if (savedVoiceMode !== null) {
        setVoiceModeState(JSON.parse(savedVoiceMode));
      }
    } catch (error) {
      console.error('Error loading voice mode setting:', error);
    }
  };

  const setVoiceMode = async (value: boolean) => {
    try {
      await AsyncStorage.setItem('voiceMode', JSON.stringify(value));
      setVoiceModeState(value);
    } catch (error) {
      console.error('Error saving voice mode setting:', error);
    }
  };

  return (
    <PreferencesContext.Provider value={{ voiceMode, setVoiceMode }}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (context === undefined) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  return context;
} 