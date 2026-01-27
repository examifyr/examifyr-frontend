import type { GenerateQuizRequest, Quiz } from './types';

export class ApiError extends Error {
    status?: number;

    constructor(message: string, status?: number) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
    }
}

const getBaseUrl = (): string => {
    const raw = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!raw) {
        throw new ApiError('Missing NEXT_PUBLIC_API_BASE_URL');
    }
    return raw.replace(/\/+$/, '');
};

const getErrorMessage = async (res: Response): Promise<string> => {
    try {
        const data: unknown = await res.json();
        if (data && typeof data === 'object') {
            const maybeMessage = (data as { message?: unknown }).message;
            const maybeDetail = (data as { detail?: unknown }).detail;
            if (typeof maybeMessage === 'string') {
                return maybeMessage;
            }
            if (typeof maybeDetail === 'string') {
                return maybeDetail;
            }
        }
    } catch {
        // ignore json parse errors
    }

    try {
        const text = await res.text();
        if (text) {
            return text;
        }
    } catch {
        // ignore text parse errors
    }

    return `Request failed (${res.status})`;
};

const requestJson = async <T>(
    path: string,
    options: { method?: 'GET' | 'POST'; body?: unknown } = {},
): Promise<T> => {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}${path}`, {
        method: options.method ?? 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        body: options.body ? JSON.stringify(options.body) : undefined,
    });

    if (!res.ok) {
        const message = await getErrorMessage(res);
        throw new ApiError(message, res.status);
    }

    return (await res.json()) as T;
};

export const generateQuiz = async (payload: GenerateQuizRequest): Promise<Quiz> => {
    return requestJson<Quiz>('/api/v1/quizzes/generate', { method: 'POST', body: payload });
};

export const getQuizById = async (quizId: string): Promise<Quiz> => {
    const encoded = encodeURIComponent(quizId);
    return requestJson<Quiz>(`/api/v1/quizzes/${encoded}`);
};
