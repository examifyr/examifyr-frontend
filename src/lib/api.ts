import type {
    AttemptResult,
    AttemptSubmitRequest,
    GenerateQuizRequest,
    Question,
    Quiz,
} from './types';

export class ApiError extends Error {
    status?: number;

    constructor(message: string, status?: number) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
    }
}

const getErrorMessage = async (res: Response): Promise<string> => {
    try {
        const text = await res.text();
        if (text) {
            try {
                const data: unknown = JSON.parse(text);
                if (data && typeof data === 'object') {
                    const maybeMessage = (data as { message?: unknown }).message;
                    const maybeDetail = (data as { detail?: unknown }).detail;
                    if (typeof maybeMessage === 'string') return maybeMessage;
                    if (typeof maybeDetail === 'string') return maybeDetail;
                }
            } catch {
                // ignore json parse errors
            }
            return text;
        }
    } catch {
        // ignore read errors
    }
    return `Request failed (${res.status})`;
};

const requestJson = async <T>(
    path: string,
    options: { method?: 'GET' | 'POST'; body?: unknown } = {},
): Promise<T> => {
    const res = await fetch(path, {
        method: options.method ?? 'GET',
        headers: { 'Content-Type': 'application/json' },
        body: options.body ? JSON.stringify(options.body) : undefined,
    });

    if (!res.ok) {
        const message = await getErrorMessage(res);
        throw new ApiError(message, res.status);
    }

    return (await res.json()) as T;
};

// Legacy quiz generation (kept for existing routes)
export const generateQuiz = async (payload: GenerateQuizRequest): Promise<Quiz> => {
    return requestJson<Quiz>('/api/v1/quizzes/generate', { method: 'POST', body: payload });
};

export const getQuizById = async (quizId: string): Promise<Quiz> => {
    const encoded = encodeURIComponent(quizId);
    return requestJson<Quiz>(`/api/v1/quizzes/${encoded}`);
};

// DB-backed flows
export const getQuestions = async (): Promise<Question[]> => {
    return requestJson<Question[]>('/api/v1/questions');
};

export const submitAttempt = async (payload: AttemptSubmitRequest): Promise<AttemptResult> => {
    return requestJson<AttemptResult>('/api/v1/attempts/submit', { method: 'POST', body: payload });
};
