'use client'

import { useState, useEffect } from 'react'
import { Topic, Course } from '@/types/database.types'
import { useData } from '@/contexts/DataContext'
import { FaCog } from 'react-icons/fa'
import { useRouter } from 'next/navigation'
import { CourseCard } from '@/app/_components/CourseCard'
import { TopicPill } from '@/app/_components/TopicPill'
import SkeletonLoaderHome from '@/app/_components/SkeletonLoaderHome'

export default function Home() {
  const router = useRouter()
  const { topics, courses, isLoading } = useData()
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null)

  useEffect(() => {
    if (topics.length > 0 && !selectedTopic) {
      setSelectedTopic(topics[0])
    }
  }, [topics])

  const getTopicCourses = (topicId: string) => {
    return courses.filter(course => course.topic_id === topicId)
  }

  if (isLoading) {
    return <SkeletonLoaderHome />
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-5">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-[#6c757d] text-lg font-medium">
                {`Hello`}
              </p>
            </div>
            <button
              onClick={()=> router.push('/settings')}
              className="p-2 text-[#6c757d] hover:text-gray-900 transition-colors"
            >
              <FaCog size={20} />
            </button>
          </div>

          <h1 className="text-4xl font-bold text-black mt-2 mb-6">
            Let's Learn New Stuff!
          </h1>

          {/* Topics horizontal scroll */}
          <div className="overflow-x-auto pb-4 mb-6">
            <div className="flex px-2">
              {topics.map((topic) => (
                <TopicPill
                  key={topic.id}
                  topic={topic}
                  isSelected={selectedTopic?.id === topic.id}
                  onPress={() => setSelectedTopic(topic)}
                  courseCount={getTopicCourses(topic.id).length}
                />
              ))}

            </div>
          </div>

          {/* Courses grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {selectedTopic && getTopicCourses(selectedTopic.id).map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                topic={selectedTopic}
                onPress={() => router.push(`/course/${course.id}?topicId=${selectedTopic?.id}`)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
