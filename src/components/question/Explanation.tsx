import React, { useState } from 'react'
import { StyleSheet, Dimensions } from 'react-native'
import { View, Text, Button, Dialog } from 'react-native-ui-lib'

const { width } = Dimensions.get('window')

interface ExplanationProps {
  isCorrect: boolean
  explanation: string
  onContinue: () => void
  onDismiss: () => void
}

export const Explanation: React.FC<ExplanationProps> = ({
  isCorrect,
  explanation,
  onContinue,
  onDismiss,
}) => {
  const [showExplanation, setShowExplanation] = useState(false)
  const [showResult, setShowResult] = useState(true)

  const handleDismiss = () => {
    setShowResult(false)
    onDismiss()
  }

  return (
    <>
      <Dialog
        visible={showResult}
        bottom
        width="100%"
        containerStyle={[
          styles.resultDialog,
          isCorrect ? styles.correctBackground : styles.incorrectBackground
        ]}
        onDismiss={handleDismiss}
      >
        <View style={styles.resultContent}>
          <Text text50 white style={styles.resultText}>
            {isCorrect ? '🎉 Correct!' : '❌ Wrong'}
          </Text>
          <View style={styles.buttonContainer}>
            <Button
              outline
              outlineColor="#fff"
              label="Why?"
              labelStyle={styles.whyButtonLabel}
              style={styles.whyButton}
              onPress={() => setShowExplanation(true)}
            />
            <Button
              label="Continue"
              backgroundColor="#fff"
              labelStyle={[
                styles.continueButtonLabel,
                isCorrect ? styles.correctText : styles.incorrectText
              ]}
              style={styles.continueButton}
              onPress={onContinue}
            />
          </View>
        </View>
      </Dialog>

      <Dialog
        visible={showExplanation}
        onDismiss={() => setShowExplanation(false)}
        bottom
        containerStyle={styles.explanationDialog}
        pannableHeaderProps={{
          title: 'Explanation',
        }}
      >
        <View style={styles.explanationContent}>
          <Text text70 style={styles.explanationText}>
            {explanation}
          </Text>
          <Button
            label="Got it"
            backgroundColor={isCorrect ? '#40c057' : '#fa5252'}
            style={styles.gotItButton}
            onPress={() => setShowExplanation(false)}
          />
        </View>
      </Dialog>
    </>
  )
}

const styles = StyleSheet.create({
  resultDialog: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 32,
    paddingBottom: 48, // Extra padding for bottom safe area
    paddingHorizontal: 24,
  },
  correctBackground: {
    backgroundColor: '#80ff97',
  },
  incorrectBackground: {
    backgroundColor: '#fa8490',
  },
  resultContent: {
    alignItems: 'center',
  },
  resultText: {
    marginBottom: 24,
    fontSize: 24,
    fontWeight: '700',
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  whyButton: {
    width: width * 0.2,
    height: 48,
    borderColor: '#000',
    opacity: 1,
  },
  whyButtonLabel: {
    color: '#000',
    opacity: 0.5,
    fontSize: 16,
    fontWeight: '800',
  },
  continueButton: {
    width: width * 0.7,
    height: 48,
  },
  continueButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  correctText: {
    color: '#40c057',
  },
  incorrectText: {
    color: '#fa5252',
  },
  explanationDialog: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  explanationContent: {
    padding: 24,
    paddingBottom: 48,
  },
  explanationText: {
    color: '#495057',
    lineHeight: 24,
    marginBottom: 24,
  },
  gotItButton: {
    marginTop: 16,
  },
})
