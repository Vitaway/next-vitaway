import { Quiz, QuizAttempt, QuizSubmission, QuizResponse, AnswerCheckRequest, AnswerCheckResponse } from '@/types/quizzes';

const API_BASE_URL = `${process.env.NEXT_PUBLIC_ENVENTORY_API_URL}/api`;

// Check if API URL is configured
if (!process.env.NEXT_PUBLIC_ENVENTORY_API_URL && typeof window !== 'undefined') {
    console.error('⚠️ NEXT_PUBLIC_ENVENTORY_API_URL is not configured!');
    console.error('Please create a .env.local file with: NEXT_PUBLIC_ENVENTORY_API_URL=your_api_url');
}

// Helper function to get auth headers
const getAuthHeaders = () => {
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    };
    
    // Add Bearer token if available
    const apiToken = process.env.NEXT_PUBLIC_API_TOKEN;
    if (apiToken) {
        headers['Authorization'] = `Bearer ${apiToken}`;
    }
    
    return headers;
};

export const quizApi = {
    // GET /api/quizzes - Get all available quizzes
    async getAllQuizzes(): Promise<Quiz[]> {
        const response = await fetch(`${API_BASE_URL}/quizzes`, {
            method: 'GET',
            headers: getAuthHeaders(),
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
        if (!process.env.NEXT_PUBLIC_ENVENTORY_API_URL) {
            throw new Error('API URL is not configured. Please set NEXT_PUBLIC_ENVENTORY_API_URL in your .env.local file');
        }
        
        try {
            const response = await fetch(`${API_BASE_URL}/quizzes/${quizId}`, {
                method: 'GET',
                headers: getAuthHeaders(),
                credentials: 'include',
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Quiz fetch error:', response.status, errorText);
                throw new Error(`Failed to fetch quiz details: ${response.status}`);
            }

            const result = await response.json();
            // Handle both direct object and { data: {} } wrapper
            return result.data || result;
        } catch (error) {
            if (error instanceof TypeError && error.message === 'Failed to fetch') {
                throw new Error('Unable to connect to API. Please check if the API server is running and NEXT_PUBLIC_ENVENTORY_API_URL is correct.');
            }
            throw error;
        }
    },

    // POST /api/quizzes/{quiz}/start - Start a new quiz attempt
    async startQuizAttempt(quizId: string | number): Promise<QuizAttempt> {
        const response = await fetch(`${API_BASE_URL}/quizzes/${quizId}/start`, {
            method: 'POST',
            headers: getAuthHeaders(),
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
            headers: getAuthHeaders(),
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

    // POST /api/quizzes/{quiz}/check-answer - Check a single answer and get immediate feedback
    async checkAnswer(
        quizId: string | number,
        answerData: AnswerCheckRequest
    ): Promise<AnswerCheckResponse> {
        if (!process.env.NEXT_PUBLIC_ENVENTORY_API_URL) {
            throw new Error('API URL is not configured. Please set NEXT_PUBLIC_ENVENTORY_API_URL in your .env.local file');
        }

        try {
            const response = await fetch(`${API_BASE_URL}/quizzes/${quizId}/check-answer`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(answerData),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Check answer error:', response.status, errorText);
                throw new Error(`Failed to check answer: ${response.status}`);
            }

            const result = await response.json();
            return result.data || result;
        } catch (error) {
            if (error instanceof TypeError && error.message === 'Failed to fetch') {
                throw new Error('Unable to connect to API. Please check if the API server is running.');
            }
            throw error;
        }
    },
};
