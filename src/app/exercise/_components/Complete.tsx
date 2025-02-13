'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { FaTrophy } from 'react-icons/fa';

interface CompleteProps {
  visible: boolean;
  courseId: string;
}

export default function Complete({ visible, courseId }: CompleteProps) {
  const router = useRouter();

  if (!visible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center p-6"
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center space-y-6"
        >
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center">
              <FaTrophy className="w-10 h-10 text-yellow-500" />
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900">
            Exercise Complete!
          </h2>

          <p className="text-gray-600 max-w-md mx-auto">
            Great job! You've completed this exercise. Keep going to master more concepts!
          </p>

          <div className="pt-4">
            <button
              onClick={() => router.push(`/course/${courseId}`)}
              className="px-8 py-3 bg-yellow-400 text-black rounded-xl
                hover:bg-yellow-500 transition-colors font-semibold"
            >
              Continue Learning
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
} 