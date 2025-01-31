'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Topic, Course } from '@/types/database.types'
import { useData } from '@/contexts/DataContext'
import { FaCog } from 'react-icons/fa'
import { useRouter } from 'next/navigation'

// Temporary components until we create the actual ones
const TopicPill = ({ topic, isSelected, onPress, courseCount }: any) => (
  <div className={`px-4 py-2 rounded-full cursor-pointer ${
    isSelected ? 'bg-blue-500 text-white' : 'bg-gray-100'
  }`}>
    {topic.name} ({courseCount})
  </div>
)

const CourseCard = ({ course, topic, onPress }: any) => (
  <div className="bg-white rounded-2xl shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow">
    <h3>{course.title}</h3>
  </div>
)

const SkeletonLoader = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-200 ${className}`} />
)

export default function Home() {
  const router = useRouter()
  const { topics, courses, isLoading } = useData()
  const [userName, setUserName] = useState<string>('')
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.user_metadata?.full_name) {
        setUserName(user.user_metadata.full_name)
      }
    }
    fetchUser()
  }, [])

  useEffect(() => {
    if (topics.length > 0 && !selectedTopic) {
      setSelectedTopic(topics[0])
    }
  }, [topics])

  const handleTopicPress = (topic: Topic) => {
    setSelectedTopic(topic)
  }

  const handleCoursePress = (course: Course) => {
    router.push(`/course/${course.id}?topicId=${selectedTopic?.id}`)
  }

  const handleSettingsPress = () => {
    router.push('/settings')
  }

  const getTopicCourses = (topicId: string) => {
    return courses.filter(course => course.topic_id === topicId)
  }

  const renderSkeletonLoaders = () => (
    <>
      <div className="flex space-x-2 px-6">
        {[1, 2, 3, 4].map((_, index) => (
          <SkeletonLoader
            key={index}
            className="w-30 h-10 rounded-full"
          />
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 px-4">
        {[1, 2, 3].map((_, index) => (
          <SkeletonLoader
            key={index}
            className="w-full h-40 rounded-2xl"
          />
        ))}
      </div>
    </>
  )

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-5">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-[#6c757d] text-lg font-medium">
                {userName ? `Hello, ${userName}` : 'Hello'}
              </p>
            </div>
            <button
              onClick={handleSettingsPress}
              className="p-2 text-[#6c757d] hover:text-gray-900 transition-colors"
            >
              <FaCog size={20} />
            </button>
          </div>

          <h1 className="text-4xl font-bold text-black mt-2 mb-6">
            Let's Learn New Stuff!
          </h1>

          {isLoading ? (
            renderSkeletonLoaders()
          ) : (
            <>
              {/* Topics horizontal scroll */}
              <div className="overflow-x-auto pb-4 mb-6">
                <div className="flex space-x-2 px-2">
                  {topics.map((topic) => (
                    <TopicPill
                      key={topic.id}
                      topic={topic}
                      isSelected={selectedTopic?.id === topic.id}
                      onPress={handleTopicPress}
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
                    onPress={handleCoursePress}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
