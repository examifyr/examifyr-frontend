export type Difficulty = 'easy' | 'medium' | 'hard';

// Legacy quiz types (kept for existing proxy routes)
export interface QuizQuestion {
    id: string | number;
    question: string;
    choices: string[];
    answer_index: number;
    explanation?: string | null;
}

export interface Quiz {
    quiz_id: string;
    topic: string;
    difficulty: Difficulty;
    questions: QuizQuestion[];
}

export interface GenerateQuizRequest {
    topic: string;
    difficulty: Difficulty;
    num_questions: number;
}

// DB-backed question
export interface Question {
    id: number;
    topic: string;
    difficulty: Difficulty;
    points: number;
    question_text: string;
    choices: string[];
    answer_index: number;
    explanation: string;
}

// Attempt submission
export interface AnswerInput {
    question_id: number;
    selected_index: number | null;
    time_spent_ms: number;
}

export interface AttemptSubmitRequest {
    session_token: string;
    topic: string;
    answers: AnswerInput[];
}

export interface TopicBreakdown {
    correct: number;
    total: number;
    accuracy: number;
}

export interface AttemptResult {
    attempt_id: string;
    readiness_score: number;
    band: 'exam_ready' | 'almost_ready' | 'at_risk' | 'not_ready';
    band_label: string;
    pass_likelihood: number;
    weak_areas: string[];
    topic_breakdown: Record<string, TopicBreakdown>;
    raw_score: number;
    max_score: number;
}
