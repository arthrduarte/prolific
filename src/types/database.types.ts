export interface Topic {
    id: string
    title: string
    description: string
    emoji: string
}

export interface Course {
    id: string
    topic_id: string
    title: string
    description: string
}

export interface Exercise {
    id: string
    course_id: string
    title: string
    description: string
    difficulty: string
    order: number
}

export interface Step {
    id: string
    exercise_id: string
    type: string
    content: string
    options: string[]
    correct_answer: string
    explanation: string
    order: number
    rich_content: JSON
    audio_id: string
    video_url: string | null
}

export interface Audio {
    id: string
    file_url: string
}

export interface User_Progress {
    id: string
    user_id: string
    exercise_id: string
    progress_percentage: number
    is_unlocked: boolean
}
