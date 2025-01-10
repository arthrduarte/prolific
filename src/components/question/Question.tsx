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
    // Initialize word animations based on the number of words and line breaks
    const words = currentStep.content.split(/(\n|\s+)/).filter(Boolean)
    const animations = words.map(word => word === '\n' ? null : new Animated.Value(0))
    setWordAnimations(animations)

    // Reset animation values
    setSelectedOption(null)
    setInputAnswer('')
    setIsAnswered(false)
    setIsCorrect(false)
    richContentAnim.setValue(0)
    optionsAnim.setValue(0)
    
    // Animate words sequentially, skipping line breaks
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
        }).start()
      })
    })
  }, [currentStepIndex, currentStep.content, richContentAnim, optionsAnim])

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

  const renderTable = (richContent: any) => {
    if (!richContent?.table) return null

    return (
      <Animated.View style={{ 
        opacity: richContentAnim 
      }}>
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            {Object.keys(richContent.table[0]).map((header, index) => (
              <Text 
                key={index} 
                style={[
                  styles.tableCell, 
                  styles.tableHeaderText,
                  index === Object.keys(richContent.table[0]).length - 1 && styles.lastCell
                ]}
              >
                {header.charAt(0).toUpperCase() + header.slice(1)}
              </Text>
            ))}
          </View>
          {richContent.table.map((row: any, rowIndex: number) => (
            <View 
              key={rowIndex} 
              style={[
                styles.tableRow,
                rowIndex % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd
              ]}
            >
              {Object.values(row).map((value: any, colIndex: number) => (
                <Text 
                  key={colIndex} 
                  style={[
                    styles.tableCell,
                    colIndex === Object.values(row).length - 1 && styles.lastCell,
                    typeof value === 'number' && styles.numberCell
                  ]}
                >
                  {typeof value === 'number' ? value.toLocaleString() : value}
                </Text>
              ))}
            </View>
          ))}
        </View>
      </Animated.View>
    )
  }

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

        {currentStep.rich_content && renderTable(currentStep.rich_content)}
        {renderOptions()}
      </>
    )
  }

  return (
    <>
      <ScrollView 
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {renderContent()}
        
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
  },
  tableContainer: {
    marginBottom: 24,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e9ecef',
    backgroundColor: '#fff',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  tableHeaderText: {
    fontWeight: '600',
    color: '#495057',
    fontSize: 14,
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
  },
  tableRowEven: {
    backgroundColor: '#fff',
  },
  tableRowOdd: {
    backgroundColor: '#fff',
  },
  tableCell: {
    flex: 1,
    fontSize: 14,
    color: '#495057',
  },
  lastCell: {
    textAlign: 'right',
  },
  numberCell: {
    fontVariant: ['tabular-nums'],
  },
});
