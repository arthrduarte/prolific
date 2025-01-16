import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Dimensions, Animated } from 'react-native'
import { Exercise, Step } from '../../types/database.types'
import { AudioPlayer } from '../AudioPlayer'
import { useAudioPreloader } from '../../hooks/useAudioPreloader'
import { TextContent } from './TextContent'
import { Input } from './options/Input'
import { MultipleChoice } from './options/MultipleChoice'
import { TrueFalse } from './options/TrueFalse'
import { Explanation } from './Explanation'
import { usePreferences } from '../../contexts/PreferencesContext'
import { useNavigation } from '@react-navigation/native'
import { Complete } from './Complete'
import { RichContent } from './rich_content/RichContent'

interface QuestionProps {
  exercise: Exercise
  steps: Step[]
  currentStepIndex: number
  onStepComplete: () => void
  onExerciseComplete: () => Promise<void>
}

export default function Question({ 
  exercise, 
  steps, 
  currentStepIndex,
  onStepComplete,
  onExerciseComplete 
}: QuestionProps) {
  const { voiceMode } = usePreferences()
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [inputAnswer, setInputAnswer] = useState('')
  const [isAnswered, setIsAnswered] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const fadeAnim = useState(new Animated.Value(1))[0]
  const [isTransitioning, setIsTransitioning] = useState(false)
  const navigation = useNavigation()
  const [showComplete, setShowComplete] = useState(false)

  const currentStep = steps[currentStepIndex]
  const previousStep = currentStepIndex > 0 ? steps[currentStepIndex - 1] : null
  const nextStep = currentStepIndex < steps.length - 1 ? steps[currentStepIndex + 1] : null

  const { getAudio, isLoaded } = useAudioPreloader(
    voiceMode ? currentStep?.audio_id || null : null,
    voiceMode ? previousStep?.audio_id || null : null,
    voiceMode ? nextStep?.audio_id || null : null
  )

  // New Animated.Values for rich content and options
  const richContentAnim = useState(new Animated.Value(0))[0]
  const optionsAnim = useState(new Animated.Value(0))[0]
  const [wordAnimations, setWordAnimations] = useState<(Animated.Value | null)[]>([])

  useEffect(() => {
    setIsTransitioning(true)
    
    // Fade out existing content first
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      // After fade out, reset all states and values
      setSelectedOption(null)
      setInputAnswer('')
      setIsAnswered(false)
      setIsCorrect(false)
      richContentAnim.setValue(0)
      optionsAnim.setValue(0)
      
      // Initialize word animations after content is cleared
      const words = currentStep.content.split(/(\n|\s+)/).filter(Boolean)
      const animations = words.map(word => word === '\n' ? null : new Animated.Value(0))
      setWordAnimations(animations)

      // Short delay before starting fade in
      setTimeout(() => {
        // Fade in the container
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start(() => {
          // Start word animations after container fade in
          Animated.stagger(150, animations.map(anim => 
            anim 
              ? Animated.timing(anim, {
                  toValue: 1,
                  duration: 300,
                  useNativeDriver: true,
                })
              : Animated.delay(350)
          )).start(() => {
            // Animate rich content after text
            Animated.timing(richContentAnim, {
              toValue: 1,
              duration: 500,
              useNativeDriver: true,
            }).start(() => {
              // Animate options after rich content
              Animated.timing(optionsAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
              }).start(() => {
                setIsTransitioning(false)
              })
            })
          })
        })
      }, 100)
    })
  }, [currentStepIndex, currentStep.content])

  // Handle transitions
  useEffect(() => {
    setIsTransitioning(true)
    const timer = setTimeout(() => {
      setIsTransitioning(false)
    }, 400) // Match the fade animation duration

    return () => clearTimeout(timer)
  }, [currentStepIndex])

  const handleOptionSelect = (option: string) => {
    if (isAnswered) return
    setSelectedOption(option)
  }

  const handleInputChange = (text: string) => {
    if (isAnswered) return
    setInputAnswer(text)
  }

  const handleSubmit = () => {
    if (isAnswered) return

    let userAnswer = ''
    if (currentStep.type === 'multiple_choice' || currentStep.type === 'true_false') {
      userAnswer = selectedOption || ''
    } else if (currentStep.type === 'input') {
      userAnswer = inputAnswer
    }

    const correct = userAnswer.toLowerCase() === currentStep.correct_answer?.toLowerCase()
    setIsCorrect(correct)
    setIsAnswered(true)
  }

  const handleNext = async () => {
    const isLastStep = currentStepIndex === steps.length - 1;
    
    if (isLastStep) {
      await onExerciseComplete();
      setShowComplete(true);
    } else {
      onStepComplete();
    }
  };

  const renderOptions = () => {
    if (currentStep.type === 'content') return null

    return (
      <Animated.View style={{ opacity: optionsAnim }}>
        {currentStep.type === 'multiple_choice' && (
          <MultipleChoice
            options={currentStep.options || []}
            selectedOption={selectedOption}
            correctAnswer={currentStep.correct_answer}
            isAnswered={isAnswered}
            onSelect={handleOptionSelect}
          />
        )}
        
        {currentStep.type === 'true_false' && (
          <TrueFalse
            selectedOption={selectedOption}
            correctAnswer={currentStep.correct_answer}
            isAnswered={isAnswered}
            onSelect={handleOptionSelect}
          />
        )}
        
        {currentStep.type === 'input' && (
          <Input
            value={inputAnswer}
            isAnswered={isAnswered}
            isCorrect={isCorrect}
            onChangeText={handleInputChange}
          />
        )}
      </Animated.View>
    )
  }

  const renderContent = () => {
    return (
      <>
        <TextContent
          currentStep={currentStep}
          wordAnimations={wordAnimations}
          isTransitioning={isTransitioning}
          isLoaded={isLoaded}
          getAudio={getAudio}
        />

        {currentStep.rich_content && (
          <RichContent 
            richContent={currentStep.rich_content} 
            richContentAnim={richContentAnim} 
          />
        )}
        {renderOptions()}
      </>
    )
  }

  const handleExplanationDismiss = () => {
    setIsAnswered(false)
    setSelectedOption(null)
    setInputAnswer('')
    setIsCorrect(false)
  }

  return (
    <>
      <ScrollView 
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        <Animated.View style={{ opacity: fadeAnim }}>
          {renderContent()}
        </Animated.View>
        
        {currentStep.type !== 'content' && !isAnswered && (
          <TouchableOpacity
            style={[
              styles.button,
              (!selectedOption && currentStep.type !== 'input') ||
              (currentStep.type === 'input' && !inputAnswer)
                ? styles.buttonDisabled
                : styles.buttonEnabled,
            ]}
            onPress={handleSubmit}
            disabled={
              (!selectedOption && currentStep.type !== 'input') ||
              (currentStep.type === 'input' && !inputAnswer)
            }
          >
            <Text style={styles.buttonText}>Check Answer</Text>
          </TouchableOpacity>
        )}

        {(isAnswered || currentStep.type === 'content') && (
          <>
            {isAnswered && currentStep.explanation && (
              <Explanation
                isCorrect={isCorrect}
                explanation={currentStep.explanation}
                onContinue={handleNext}
                onDismiss={handleExplanationDismiss}
              />
            )}
            {currentStep.type === 'content' && (
              <TouchableOpacity
                style={[styles.button, styles.buttonEnabled]}
                onPress={handleNext}
              >
                <Text style={styles.buttonText}>
                  Continue
                </Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </ScrollView>

      <Complete visible={showComplete} courseId={exercise.course_id} />
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  button: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonEnabled: {
    backgroundColor: '#f0dc1b',
  },
  buttonDisabled: {
    backgroundColor: '#e9ecef',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  }
});
