import React from 'react'
import { MultipleChoice } from './MultipleChoice'

interface TrueFalseProps {
  selectedOption: string | null
  correctAnswer: string
  isAnswered: boolean
  onSelect: (option: string) => void
}

export const TrueFalse: React.FC<TrueFalseProps> = ({
  selectedOption,
  correctAnswer,
  isAnswered,
  onSelect,
}) => {
  const options = ['True', 'False']

  return (
    <MultipleChoice
      options={options}
      selectedOption={selectedOption}
      correctAnswer={correctAnswer}
      isAnswered={isAnswered}
      onSelect={onSelect}
    />
  )
}
