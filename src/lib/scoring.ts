import type { Quiz } from './types';

export const calculateScore = (
    quiz: Quiz,
    answers: Record<string, number>,
): { correct: number; total: number; percentage: number } => {
    const total = quiz.questions.length;
    const correct = quiz.questions.reduce((acc, question) => {
        const key = String(question.id);
        return acc + (answers[key] === question.answer_index ? 1 : 0);
    }, 0);
    const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
    return { correct, total, percentage };
};
