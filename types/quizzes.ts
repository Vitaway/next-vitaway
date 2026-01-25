export interface Quiz {
    id: number;
    title: string;
    description: string;
    duration?: number;
    passing_score?: number;
    max_attempts?: number;
    show_correct_answers?: boolean;
    randomize_questions?: boolean;
    is_active?: boolean;
    available_from?: string | null;
    available_until?: string | null;
    total_points?: number;
    questions_count?: number;
    created_at?: string;
    updated_at?: string;
    questions?: Question[];
}

export interface Question {
    id: number;
    quiz_id: number;
    question: string;
    type?: string;
    points?: number;
    order?: number;
    is_required?: boolean;
    options?: QuestionOption[];
    correct_answer?: number;
    created_at?: string;
    updated_at?: string;
}

export interface QuestionOption {
    id: number;
    quiz_question_id: number;
    option_text: string;
    is_correct: boolean;
    order?: number;
    created_at?: string;
    updated_at?: string;
}

export interface QuizAttempt {
    id: number;
    quiz_id: number;
    user_id?: number;
    started_at: string;
    status: 'in_progress' | 'completed';
}

export interface QuizResult {
    id: number;
    quiz_id: number;
    attempt_id: number;
    user_id?: number;
    score: number;
    answers: Record<number, number>;
    completed_at: string;
    time_taken?: number;
}

export interface QuizSubmission {
    answers: Record<number, number>;
}

export interface QuizResponse {
    score: number;
    correct_answers: number;
    total_questions: number;
    results: Array<{
        question_id: number;
        is_correct: boolean;
        user_answer: number;
        correct_answer: number;
    }>;
}
