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
