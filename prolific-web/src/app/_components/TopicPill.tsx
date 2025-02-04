import React from 'react'
import { Topic } from '@/types/database.types'
import { FaLock } from 'react-icons/fa'

interface TopicPillProps {
  topic: Topic
  isSelected: boolean
  onPress: (topic: Topic) => void
  courseCount: number
}

export const TopicPill: React.FC<TopicPillProps> = ({ 
  topic, 
  isSelected, 
  onPress, 
  courseCount 
}) => {
  const isLocked = courseCount === 0

  return (
    <button
      className={`
        px-4 py-2 rounded-full flex items-center mr-2 transition-all duration-200 whitespace-nowrap
        ${isSelected 
          ? 'bg-[#ffd43b]' 
          : 'bg-[#f1f3f5]'
        }
        ${isLocked 
          ? 'opacity-70 cursor-not-allowed' 
          : 'hover:bg-opacity-90 cursor-pointer'
        }
      `}
      onClick={() => !isLocked && onPress(topic)}
      disabled={isLocked}
    >
      <span className={`
        text-base font-semibold mr-2
        ${isSelected 
          ? 'text-black' 
          : 'text-[#495057]'
        }
        ${isLocked && 'text-[#868e96]'}
      `}>
        {topic.title}
      </span>
      <div className={`
        w-6 h-6 rounded-full flex items-center justify-center
        ${isSelected 
          ? 'bg-black/10' 
          : 'bg-[#e9ecef]'
        }
      `}>
        {isLocked ? (
          <FaLock className="text-[#868e96] text-xs" />
        ) : (
          <span className={`
            text-xs font-semibold
            ${isSelected 
              ? 'text-black' 
              : 'text-[#495057]'
            }
          `}>
            {courseCount}
          </span>
        )}
      </div>
    </button>
  )
} 