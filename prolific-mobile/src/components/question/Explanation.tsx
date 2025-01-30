import React, { useState } from 'react'
import { StyleSheet, Dimensions, View } from 'react-native'
import { Text, Button, Overlay } from '@rneui/themed'

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
        type="outline"
        title="Why?"
        titleStyle={styles.whyButtonLabel}
        buttonStyle={[styles.whyButton, { borderColor: '#fff' }]}
        onPress={() => setShowExplanation(true)}
        key="why"
      />,
      <Button
        title="Continue"
        buttonStyle={[styles.continueButton, { backgroundColor: '#fff' }]}
        titleStyle={[
          styles.continueButtonLabel,
          isCorrect ? styles.correctText : styles.incorrectText
        ]}
        onPress={onContinue}
        key="continue"
      />
    ];

    return isCorrect ? buttons.reverse() : buttons;
  };

  return (
    <>
      <Overlay
        isVisible={showResult}
        onBackdropPress={handleDismiss}
        overlayStyle={styles.overlayContainer}
        backdropStyle={styles.transparent}
        animationType="fade"
      >
        <View style={[
          styles.resultDialog,
          isCorrect ? styles.correctBackground : styles.incorrectBackground
        ]}>
          <View style={styles.resultContent}>
            <Text h4 style={styles.resultText}>
              {isCorrect ? '🎉 Correct!' : '❌ Wrong'}
            </Text>
            <View style={styles.buttonContainer}>
              {renderButtons()}
            </View>
          </View>
        </View>
      </Overlay>

      <Overlay
        isVisible={showExplanation}
        onBackdropPress={() => setShowExplanation(false)}
        overlayStyle={styles.overlayContainer}
        backdropStyle={styles.transparent}
      >
        <View style={styles.explanationDialog}>
          <View style={styles.explanationHeader}>
            <Text style={styles.explanationTitle}>Explanation</Text>
          </View>
          <View style={styles.explanationContent}>
            <Text style={styles.explanationText}>
              {explanation}
            </Text>
            <Button
              title="Got it"
              buttonStyle={[
                styles.gotItButton,
                { backgroundColor: isCorrect ? '#ffd43b' : '#868e96' }
              ]}
              onPress={() => setShowExplanation(false)}
            />
          </View>
        </View>
      </Overlay>
    </>
  )
}

const styles = StyleSheet.create({
  overlayContainer: { 
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    margin: 0,
    padding: 0,
  },
  resultDialog: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
    paddingBottom: 32,
    paddingHorizontal: 24,
    backgroundColor: '#fff',
    width: '100%',
  },
  correctBackground: {
    backgroundColor: '#ffd43b',
  },
  incorrectBackground: {
    backgroundColor: '#868e96',
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
    color: '#000',
  },
  incorrectText: {
    color: '#868e96',
  },
  explanationDialog: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    width: '100%',
  },
  explanationHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f5',
  },
  explanationTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
  },
  explanationContent: {
    padding: 24,
    paddingBottom: 48,
  },
  explanationText: {
    color: '#495057',
    lineHeight: 24,
    marginBottom: 24,
    fontSize: 16,
  },
  gotItButton: {
    marginTop: 16,
    height: 48,
    borderRadius: 12,
    color: '#000',
  },
  transparent: {
    backgroundColor: 'transparent'
  },
})
