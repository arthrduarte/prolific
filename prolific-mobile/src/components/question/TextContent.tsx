import React from 'react'
import { View, Animated, StyleSheet } from 'react-native'
import { Step } from '../../types/database.types'
import { AudioPlayer } from '../AudioPlayer'

interface TextContentProps {
  currentStep: Step
  wordAnimations: (Animated.Value | null)[]
  isTransitioning: boolean
  isLoaded: (audioId: string) => boolean
  getAudio: (audioId: string) => any
}

export const TextContent: React.FC<TextContentProps> = ({
  currentStep,
  wordAnimations,
  isTransitioning,
  isLoaded,
  getAudio,
}) => {
  const words = currentStep.content.split(/(\n|\s+)/).filter(Boolean)

  return (
    <>
      <Animated.View style={styles.contentContainer}>
        {words.map((word, index) => (
          word === '\n' ? (
            <View key={index} style={styles.lineBreak} />
          ) : (
            <Animated.Text
              key={index}
              style={[
                styles.questionText,
                { opacity: wordAnimations[index] || 0 }
              ]}
            >
              {word}
            </Animated.Text>
          )
        ))}
      </Animated.View>
      
      {currentStep.audio_id && (
        <AudioPlayer
          sound={getAudio(currentStep.audio_id)}
          shouldPlay={!isTransitioning && isLoaded(currentStep.audio_id)}
        />
      )}
    </>
  )
}

const styles = StyleSheet.create({
  contentContainer: {
    marginBottom: 24,
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  lineBreak: {
    width: '100%',
    height: 0
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
})
