'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { FaCheck, FaTimes } from 'react-icons/fa';

interface ExplanationProps {
  isCorrect: boolean;
  explanation: string;
  onContinue: () => void;
  onDismiss: () => void;
}

export default function Explanation({
  isCorrect,
  explanation,
  onContinue,
  onDismiss
}: ExplanationProps) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center p-4 z-50"
        onClick={onDismiss}
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="bg-white rounded-2xl w-full max-w-2xl p-6 space-y-4"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center space-x-3">
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center
              ${isCorrect ? 'bg-green-100' : 'bg-red-100'}
            `}>
              {isCorrect ? (
                <FaCheck className="w-4 h-4 text-green-600" />
              ) : (
                <FaTimes className="w-4 h-4 text-red-600" />
              )}
            </div>
            <h3 className={`
              text-xl font-semibold
              ${isCorrect ? 'text-green-600' : 'text-red-600'}
            `}>
              {isCorrect ? 'Correct!' : 'Incorrect'}
            </h3>
          </div>

          <p className="text-gray-700 text-base leading-relaxed">
            {explanation}
          </p>

          <div className="flex justify-end space-x-3 pt-2">
            <button
              onClick={onDismiss}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={onContinue}
              className="px-6 py-2 bg-yellow-400 text-black rounded-xl
                hover:bg-yellow-500 transition-colors font-medium"
            >
              Continue
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
} 