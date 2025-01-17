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

  const renderButtons = () => {
    const buttons = [
      <Button
        outline
        outlineColor="#fff"
        label="Why?"
        labelStyle={styles.whyButtonLabel}
        style={styles.whyButton}
        onPress={() => setShowExplanation(true)}
        key="why"
      />,
      <Button
        label="Continue"
        backgroundColor="#fff"
        labelStyle={[
          styles.continueButtonLabel,
          isCorrect ? styles.correctText : styles.incorrectText
        ]}
        style={styles.continueButton}
        onPress={onContinue}
        key="continue"
      />
    ];

    return isCorrect ? buttons.reverse() : buttons;
  };

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
            {renderButtons()}
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
    paddingTop: 24,
    paddingBottom: 32,
    paddingHorizontal: 24,
  },
  correctBackground: {
    backgroundColor: '#80ff97',
  },
  incorrectBackground: {
    backgroundColor: '#fa8490',
  },
  resultContent: {
    width: '100%',
  },
  resultText: {
    marginBottom: 24,
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  whyButton: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fff',
  },
  whyButtonLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  continueButton: {
    height: 48,
    borderRadius: 12,
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
