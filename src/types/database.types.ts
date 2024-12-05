export interface Question {
    id: number
    question: string
    options: string[]
    correctAnswer: number
    created_at: string
}

export interface Topic {
    id: number
    title: string
    description: string
    emoji: string
}

export interface Level {
    id: number
    topic_id: number
    title: string
    description: string
}

export interface User_Progress {
    id: number
    user_id: number
    level_id: number
    score_percentage: number
    is_unlocked: boolean
}
