'use client';

import { useState, useEffect } from 'react';
import { Exercise, Step } from '@/types/database.types';
import { motion, AnimatePresence } from 'framer-motion';
import { usePreferences } from '@/contexts/PreferencesContext';
import { useRouter } from 'next/navigation';
import TextContent from './TextContent';
import Input from './options/Input';
import MultipleChoice from './options/MultipleChoice';
import TrueFalse from './options/TrueFalse';
import Explanation from './Explanation';
import RichContent from './rich_content/RichContent';
import VideoPlayer from './rich_content/VideoPlayer';
import Complete from './Complete';

interface QuestionProps {
  exercise: Exercise;
  steps: Step[];
  currentStepIndex: number;
  onStepComplete: () => void;
  onExerciseComplete: () => Promise<void>;
}

export default function Question({ 
  exercise, 
  steps, 
  currentStepIndex,
  onStepComplete,
  onExerciseComplete 
}: QuestionProps) {
  const { voiceMode } = usePreferences();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [inputAnswer, setInputAnswer] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const router = useRouter();
  const [showComplete, setShowComplete] = useState(false);

  const currentStep = steps[currentStepIndex];
  const previousStep = currentStepIndex > 0 ? steps[currentStepIndex - 1] : null;
  const nextStep = currentStepIndex < steps.length - 1 ? steps[currentStepIndex + 1] : null;

  useEffect(() => {
    setIsTransitioning(true);
    
    // Reset states
    setSelectedOption(null);
    setInputAnswer('');
    setIsAnswered(false);
    setIsCorrect(false);

    // Add a small delay to match the animation timing
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [currentStepIndex]);

  const handleOptionSelect = (option: string) => {
    if (isAnswered) return;
    setSelectedOption(option);
  };

  const handleInputChange = (text: string) => {
    if (isAnswered) return;
    setInputAnswer(text);
  };

  const handleSubmit = () => {
    if (isAnswered) return;

    let userAnswer = '';
    if (currentStep.type === 'multiple_choice' || currentStep.type === 'true_false') {
      userAnswer = selectedOption || '';
    } else if (currentStep.type === 'input') {
      userAnswer = inputAnswer;
    }

    const correct = userAnswer.toLowerCase() === currentStep.correct_answer?.toLowerCase();
    setIsCorrect(correct);
    setIsAnswered(true);
  };

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
    if (currentStep.type === 'content') return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: voiceMode ? 1 : 0, duration: 0.5 }}
      >
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
            onChange={(e) => handleInputChange(e.target.value)}
          />
        )}
      </motion.div>
    );
  };

  const renderContent = () => {
    return (
      <>
        <TextContent
          currentStep={currentStep}
          isTransitioning={isTransitioning}
          voiceMode={voiceMode}
        />

        {currentStep.rich_content && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: voiceMode ? 0.5 : 0, duration: 0.5 }}
          >
            <RichContent richContent={currentStep.rich_content} />
          </motion.div>
        )}

        {currentStep.video_url && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: voiceMode ? 0.5 : 0, duration: 0.5 }}
            className="my-4"
          >
            <VideoPlayer videoUrl={currentStep.video_url} />
          </motion.div>
        )}

        {renderOptions()}
      </>
    );
  };

  const handleExplanationDismiss = () => {
    setIsAnswered(false);
    setSelectedOption(null);
    setInputAnswer('');
    setIsCorrect(false);
  };

  return (
    <>
      <div className="min-h-screen bg-white flex flex-col">
        <div className="flex-1 overflow-y-auto px-6 py-6 md:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </div>
        
        {currentStep.type !== 'content' && !isAnswered && (
          <div className={`
            fixed bottom-0 left-0 right-0 p-4 md:p-6 bg-white border-t border-gray-100
            ${currentStep.video_url ? 'bg-opacity-90 backdrop-blur-sm border-0' : ''}
          `}>
            <button
              className={`
                w-full py-4 px-6 rounded-xl font-semibold text-base
                transition-all duration-200
                ${(!selectedOption && currentStep.type !== 'input') ||
                  (currentStep.type === 'input' && !inputAnswer)
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-yellow-400 text-black hover:bg-yellow-500'}
              `}
              onClick={handleSubmit}
              disabled={
                (!selectedOption && currentStep.type !== 'input') ||
                (currentStep.type === 'input' && !inputAnswer)
              }
            >
              Check Answer
            </button>
          </div>
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
              <div className={`
                fixed bottom-0 left-0 right-0 p-4 md:p-6 bg-white border-t border-gray-100
                ${currentStep.video_url ? 'bg-opacity-90 backdrop-blur-sm border-0' : ''}
              `}>
                <button
                  className="w-full py-4 px-6 rounded-xl font-semibold text-base
                    bg-yellow-400 text-black hover:bg-yellow-500
                    transition-all duration-200"
                  onClick={handleNext}
                >
                  Continue
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <Complete visible={showComplete} courseId={exercise.course_id} />
    </>
  );
} 