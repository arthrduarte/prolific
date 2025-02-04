import React from 'react'
import { Course, Topic } from '@/types/database.types'
import { FaPlay } from 'react-icons/fa'

interface CourseCardProps {
  course: Course
  topic: Topic
  onPress?: (course: Course) => void
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, onPress }) => {
  return (
    <div 
      className="w-full mb-3 cursor-pointer transform transition-all duration-200 hover:scale-[1.02]"
      onClick={() => onPress?.(course)}
    >
      <div className="bg-[#ffd43b] rounded-[20px] p-5 min-h-[230px] flex flex-col justify-between shadow-lg">
        <div>
          <h3 className="text-2xl font-bold leading-8 mb-2 text-black line-clamp-2">
            {course.title}
          </h3>
          <p className="text-base leading-6 mb-5 text-black/70 line-clamp-2">
            {course.description}
          </p>
        </div>
        <div className="w-full py-3 px-5 rounded-xl flex items-center justify-between bg-[#212529]">
          <span className="text-base font-semibold text-white">
            Start Learning
          </span>
          <FaPlay className="text-white text-sm" />
        </div>
      </div>
    </div>
  )
} 