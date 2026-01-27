export type Difficulty = 'easy' | 'medium' | 'hard';

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
