import React, { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Dimensions } from 'react-native'
import { Exercise, Step } from '../types/database.types'
import { PieChart } from 'react-native-chart-kit'

type StepType = 'content' | 'multiple_choice' | 'true_false' | 'input'

interface QuestionComponentProps {
  exercise: Exercise
  steps: Step[]
}

interface ChartData {
  labels: string[]
  values: number[]
}

interface RichContent {
  table?: any[]
  chart?: {
    data: ChartData
    type: 'pie'
  }
}

const screenWidth = Dimensions.get('window').width

const chartConfig = {
  backgroundGradientFrom: '#fff',
  backgroundGradientTo: '#fff',
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  strokeWidth: 2,
  decimalPlaces: 0,
}

const formatValue = (value: any): string => {
  if (typeof value === 'number') {
    return value.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
  }
  return value.toString()
}

const capitalizeHeader = (header: string): string => {
  return header
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export default function QuestionComponent({ exercise, steps }: QuestionComponentProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [inputAnswer, setInputAnswer] = useState('')
  const [isAnswered, setIsAnswered] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  const currentStep = steps[currentStepIndex]

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

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1)
      setSelectedOption(null)
      setInputAnswer('')
      setIsAnswered(false)
      setIsCorrect(false)
    }
  }

  const renderTable = (richContent: RichContent) => {
    if (!richContent.table || richContent.table.length === 0) return null

    // Get column headers from the first row
    const headers = Object.keys(richContent.table[0])

    return (
      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          {headers.map((header, index) => (
            <Text 
              key={index} 
              style={[
                styles.tableCell, 
                styles.tableHeaderText,
                index === headers.length - 1 && styles.lastCell
              ]}
            >
              {capitalizeHeader(header)}
            </Text>
          ))}
        </View>
        {richContent.table.map((row, rowIndex) => (
          <View 
            key={rowIndex} 
            style={[
              styles.tableRow,
              rowIndex % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd
            ]}
          >
            {headers.map((header, colIndex) => (
              <Text 
                key={colIndex} 
                style={[
                  styles.tableCell,
                  colIndex === headers.length - 1 && styles.lastCell,
                  typeof row[header] === 'number' && styles.numberCell
                ]}
              >
                {formatValue(row[header])}
              </Text>
            ))}
          </View>
        ))}
      </View>
    )
  }

  const renderPieChart = (chartData: ChartData) => {
    const data = chartData.labels.map((label, index) => ({
      name: label,
      amount: chartData.values[index],
      color: [
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
        '#4BC0C0',
        '#9966FF',
        '#FF9F40',
      ][index % 6],
      legendFontColor: '#7F7F7F',
      legendFontSize: 12,
    }))

    return (
      <View style={styles.chartContainer}>
        <PieChart
          data={data}
          width={screenWidth - 32} // Accounting for container padding
          height={220}
          chartConfig={chartConfig}
          accessor="amount"
          backgroundColor="transparent"
          paddingLeft="0"
          absolute
        />
      </View>
    )
  }

  const renderRichContent = (richContent: RichContent) => {
    return (
      <>
        {richContent.chart?.type === 'pie' && renderPieChart(richContent.chart.data)}
        {richContent.table && renderTable(richContent)}
      </>
    )
  }

  const renderContent = () => {
    const richContent = currentStep.rich_content as RichContent

    return (
      <View>
        <Text style={styles.questionText}>{currentStep.content}</Text>
        {richContent && renderRichContent(richContent)}
        {(() => {
          switch (currentStep.type as StepType) {
            case 'content':
              return null

            case 'multiple_choice':
            case 'true_false':
              return (
                <View style={styles.optionsContainer}>
                  {currentStep.options?.map((option, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.optionButton,
                        selectedOption === option && styles.selectedOption,
                        isAnswered && option === currentStep.correct_answer && styles.correctOption,
                        isAnswered && selectedOption === option && option !== currentStep.correct_answer && styles.incorrectOption,
                      ]}
                      onPress={() => handleOptionSelect(option)}
                      disabled={isAnswered}
                    >
                      <Text style={styles.optionText}>{option}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )

            case 'input':
              return (
                <View style={styles.textInputContainer}>
                  <TextInput
                    style={[
                      styles.textInput,
                      isAnswered && isCorrect && styles.correctTextInput,
                      isAnswered && !isCorrect && styles.incorrectTextInput,
                    ]}
                    value={inputAnswer}
                    onChangeText={handleInputChange}
                    placeholder="Type your answer here..."
                    editable={!isAnswered}
                  />
                </View>
              )

            default:
              return null
          }
        })()}
      </View>
    )
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.exerciseTitle}>{exercise.title}</Text>
      <View style={styles.questionContainer}>
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
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        )}
        {(isAnswered || currentStep.type === 'content') && (
          <>
            {isAnswered && currentStep.explanation && (
              <View style={styles.explanationContainer}>
                <Text style={styles.explanationText}>{currentStep.explanation}</Text>
              </View>
            )}
            <TouchableOpacity
              style={[styles.button, styles.buttonEnabled]}
              onPress={handleNext}
              disabled={currentStepIndex === steps.length - 1}
            >
              <Text style={styles.buttonText}>
                {currentStepIndex === steps.length - 1 ? 'Finish' : 'Continue'}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  exerciseTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#333',
  },
  questionContainer: {
    marginBottom: 24,
  },
  questionText: {
    fontSize: 18,
    marginBottom: 16,
    color: '#333',
    lineHeight: 24,
  },
  optionsContainer: {
    marginBottom: 24,
  },
  textInputContainer: {
    marginBottom: 24,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  correctTextInput: {
    backgroundColor: '#e8f5e9',
    borderColor: '#4caf50',
  },
  incorrectTextInput: {
    backgroundColor: '#ffebee',
    borderColor: '#f44336',
  },
  optionButton: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedOption: {
    backgroundColor: '#e3f2fd',
    borderColor: '#2196f3',
  },
  correctOption: {
    backgroundColor: '#e8f5e9',
    borderColor: '#4caf50',
  },
  incorrectOption: {
    backgroundColor: '#ffebee',
    borderColor: '#f44336',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  button: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonEnabled: {
    backgroundColor: '#2196f3',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  explanationContainer: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginTop: 16,
    marginBottom: 16,
  },
  explanationText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  // Table styles
  tableContainer: {
    marginBottom: 24,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tableHeaderText: {
    fontWeight: '600',
    color: '#333',
    fontSize: 14,
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  tableRowEven: {
    backgroundColor: '#fff',
  },
  tableRowOdd: {
    backgroundColor: '#fafafa',
  },
  tableCell: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingHorizontal: 4,
  },
  lastCell: {
    textAlign: 'right',
  },
  numberCell: {
    textAlign: 'right',
    fontVariant: ['tabular-nums'],
  },
  chartContainer: {
    marginBottom: 24,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
})
