import { Exercise } from '@/types/database.types';
import { FaLock, FaWrench, FaPlay } from 'react-icons/fa';

interface ExerciseCardProps {
  exercise: Exercise;
  index: number;
  isUnlocked: boolean;
  onPress: (exercise: Exercise) => void;
  steps?: number;
}

export default function ExerciseCard({
  exercise,
  isUnlocked,
  onPress,
  steps = 0,
}: ExerciseCardProps) {
  const getIcon = () => {
    if (!isUnlocked) return <FaLock className="text-white w-3.5 h-3.5" />;
    if (steps === 0) return <FaWrench className="text-white w-3.5 h-3.5" />;
    return <FaPlay className="text-white w-3.5 h-3.5" />;
  };

  return (
    <button
      onClick={() => onPress(exercise)}
      className={`
        w-full h-[72px] px-6 rounded-2xl
        flex items-center justify-between
        transition-all duration-200 ease-in-out
        hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2
        ${isUnlocked 
          ? 'bg-yellow-400 focus:ring-yellow-500' 
          : 'bg-gray-900 focus:ring-gray-700'
        }
      `}
    >
      <div className="flex-1 mr-4 truncate">
        <h3 
          className={`
            text-lg font-semibold leading-6 truncate
            ${isUnlocked ? 'text-black' : 'text-white'}
          `}
        >
          {exercise.title}
        </h3>
      </div>
      <div 
        className={`
          w-9 h-9 rounded-full flex items-center justify-center
          ${isUnlocked ? 'bg-gray-900' : 'bg-gray-600'}
        `}
      >
        {getIcon()}
      </div>
    </button>
  );
}
