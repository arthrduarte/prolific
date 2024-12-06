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
}

export interface Question {
    id: string
    exercise_id: string
    question_text: string
    options: JSON
    correct_answer: string
    type: string
}

export interface User_Progress {
    id: string
    user_id: string
    exercise_id: string
    score_percentage: number
    is_unlocked: boolean
}
