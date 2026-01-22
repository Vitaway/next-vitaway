import { Quiz, QuizAttempt, QuizSubmission, QuizResponse } from '@/types/quizzes';

const API_BASE_URL = `${process.env.NEXT_PUBLIC_ENVENTORY_API_URL}/api`;

export const quizApi = {
    // GET /api/quizzes - Get all available quizzes
    async getAllQuizzes(): Promise<Quiz[]> {
        const response = await fetch(`${API_BASE_URL}/quizzes`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            credentials: 'include',
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Quizzes fetch error:', response.status, errorText);
            throw new Error(`Failed to fetch quizzes: ${response.status}`);
        }

        const result = await response.json();
        // Handle both direct array and { data: [] } wrapper
        return result.data || result;
    },

    // GET /api/quizzes/{quiz} - Get specific quiz details (with questions)
    async getQuizById(quizId: string | number): Promise<Quiz> {
        console.log('Fetching quiz:', `${API_BASE_URL}/quizzes/${quizId}`);
        
        const response = await fetch(`${API_BASE_URL}/quizzes/${quizId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            credentials: 'include',
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Quiz fetch error:', response.status, errorText);
            throw new Error(`Failed to fetch quiz details: ${response.status}`);
        }

        const result = await response.json();
        console.log('Quiz response:', result);
        // Handle both direct object and { data: {} } wrapper
        return result.data || result;
    },

    // POST /api/quizzes/{quiz}/start - Start a new quiz attempt
    async startQuizAttempt(quizId: string | number): Promise<QuizAttempt> {
        const response = await fetch(`${API_BASE_URL}/quizzes/${quizId}/start`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            credentials: 'include',
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Start attempt error:', response.status, errorText);
            throw new Error(`Failed to start quiz attempt: ${response.status}`);
        }

        const result = await response.json();
        return result.data || result;
    },

    // POST /api/quizzes/{quiz}/attempts/{attempt}/submit - Submit quiz answers
    async submitQuizAttempt(
        quizId: string | number,
        attemptId: string | number,
        submission: QuizSubmission
    ): Promise<QuizResponse> {
        const response = await fetch(`${API_BASE_URL}/quizzes/${quizId}/attempts/${attemptId}/submit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(submission),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Submit attempt error:', response.status, errorText);
            throw new Error(`Failed to submit quiz answers: ${response.status}`);
        }

        const result = await response.json();
        return result.data || result;
    },
};
