'use client';

import { useState, type FormEvent } from 'react';
import { ApiError, generateQuiz, getQuizById } from '@/lib/api';
import type { Difficulty, GenerateQuizRequest, Quiz } from '@/lib/types';

const clampNumQuestions = (value: number): number => {
    if (Number.isNaN(value)) return 5;
    return Math.min(20, Math.max(1, value));
};

export default function Home() {
    const [topic, setTopic] = useState<string>('');
    const [difficulty, setDifficulty] = useState<Difficulty>('easy');
    const [numQuestions, setNumQuestions] = useState<number>(5);
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [answers, setAnswers] = useState<Record<string, number>>({});
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [score, setScore] = useState<{ correct: number; total: number } | null>(null);
    const [loadQuizId, setLoadQuizId] = useState<string>('');
    const [loadError, setLoadError] = useState<string | null>(null);
    const [copied, setCopied] = useState<boolean>(false);
    const [copyError, setCopyError] = useState<string | null>(null);

    const resetQuizState = () => {
        setQuiz(null);
        setAnswers({});
        setSubmitted(false);
        setScore(null);
        setError(null);
        setLoadError(null);
        setCopied(false);
    };

    const handleGenerate = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        setLoadError(null);
        setSubmitted(false);
        setScore(null);
        setCopied(false);

        if (!topic.trim()) {
            setError('Please enter a topic to generate a quiz.');
            return;
        }

        const payload: GenerateQuizRequest = {
            topic: topic.trim(),
            difficulty,
            num_questions: clampNumQuestions(numQuestions),
        };

        setLoading(true);
        try {
            const data = await generateQuiz(payload);
            setQuiz(data);
            setAnswers({});
        } catch (err) {
            const message =
                err instanceof ApiError
                    ? err.message
                    : 'Unable to generate quiz. Please try again.';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    const handleLoadById = async () => {
        setError(null);
        setLoadError(null);
        setSubmitted(false);
        setScore(null);
        setCopied(false);

        const trimmedId = loadQuizId.trim();
        if (!trimmedId) {
            setLoadError('Please enter a quiz id to load.');
            return;
        }

        setLoading(true);
        try {
            const data = await getQuizById(trimmedId);
            setQuiz(data);
            setAnswers({});
        } catch (err) {
            if (err instanceof ApiError && err.status === 404) {
                setLoadError('Quiz not found (in-memory quizzes reset when server restarts).');
            } else {
                setLoadError('Unable to load quiz. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSelect = (questionId: string, choiceIndex: number) => {
        setAnswers((prev) => ({ ...prev, [questionId]: choiceIndex }));
    };

    const handleSubmit = () => {
        if (!quiz) return;
        const total = quiz.questions.length;
        const correct = quiz.questions.reduce((acc, question) => {
            const key = String(question.id);
            return acc + (answers[key] === question.answer_index ? 1 : 0);
        }, 0);
        setScore({ correct, total });
        setSubmitted(true);
    };

    const handleReset = () => {
        resetQuizState();
        setTopic('');
        setDifficulty('easy');
        setNumQuestions(5);
        setLoadQuizId('');
    };

    const handleCopyQuizId = async () => {
        if (!quiz?.quiz_id) return;
        setCopyError(null);
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(quiz.quiz_id);
            } else {
                const textArea = document.createElement('textarea');
                textArea.value = quiz.quiz_id;
                textArea.setAttribute('readonly', '');
                textArea.style.position = 'absolute';
                textArea.style.left = '-9999px';
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
            }
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {
            setCopied(false);
            setCopyError('Unable to copy. Please select and copy the quiz id manually.');
        }
    };

    return (
        <main style={{ padding: '40px', maxWidth: '900px', margin: '0 auto' }}>
            <h1>Examifyr Quiz MVP</h1>
            <p>Generate a quiz, answer questions, and see your score.</p>

            <section style={{ marginTop: '24px', padding: '16px', border: '1px solid #ddd' }}>
                <h2>Generate Quiz</h2>
                <form onSubmit={handleGenerate}>
                    <div style={{ marginBottom: '12px' }}>
                        <label htmlFor="topic">Topic</label>
                        <input
                            id="topic"
                            type="text"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            style={{ display: 'block', width: '100%', padding: '8px', marginTop: '6px' }}
                            placeholder="e.g., Photosynthesis"
                        />
                    </div>

                    <div style={{ marginBottom: '12px' }}>
                        <label htmlFor="difficulty">Difficulty</label>
                        <select
                            id="difficulty"
                            value={difficulty}
                            onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                            style={{ display: 'block', width: '100%', padding: '8px', marginTop: '6px' }}
                        >
                            <option value="easy">easy</option>
                            <option value="medium">medium</option>
                            <option value="hard">hard</option>
                        </select>
                    </div>

                    <div style={{ marginBottom: '12px' }}>
                        <label htmlFor="numQuestions">Number of questions (1-20)</label>
                        <input
                            id="numQuestions"
                            type="number"
                            min={1}
                            max={20}
                            value={numQuestions}
                            onChange={(e) => setNumQuestions(clampNumQuestions(Number(e.target.value)))}
                            style={{ display: 'block', width: '100%', padding: '8px', marginTop: '6px' }}
                        />
                    </div>

                    <button type="submit" disabled={loading}>
                        {loading ? 'Generating...' : 'Generate'}
                    </button>
                </form>

                <div style={{ marginTop: '16px' }}>
                    <label htmlFor="loadQuizId">Load by quiz id (optional)</label>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                        <input
                            id="loadQuizId"
                            type="text"
                            value={loadQuizId}
                            onChange={(e) => setLoadQuizId(e.target.value)}
                            placeholder="quiz_id"
                            style={{ flex: 1, padding: '8px' }}
                        />
                        <button type="button" onClick={handleLoadById} disabled={loading}>
                            {loading ? 'Loading...' : 'Load'}
                        </button>
                    </div>
                    {loadError && <p style={{ color: 'crimson', marginTop: '8px' }}>{loadError}</p>}
                </div>

                {error && <p style={{ color: 'crimson', marginTop: '12px' }}>{error}</p>}
            </section>

            {quiz && (
                <section style={{ marginTop: '32px' }}>
                    <h2>Quiz</h2>
                    <p>
                        Topic: <strong>{quiz.topic}</strong> | Difficulty: <strong>{quiz.difficulty}</strong>
                    </p>
                    <p>
                        Quiz ID: <strong>{quiz.quiz_id}</strong>{' '}
                        <button type="button" onClick={handleCopyQuizId}>
                            {copied ? 'Copied' : 'Copy quiz id'}
                        </button>
                    </p>
                    {copyError && <p style={{ color: 'crimson' }}>{copyError}</p>}

                    {quiz.questions.map((question, index) => {
                        const questionId = String(question.id);
                        const selected = answers[questionId];
                        const isCorrect = selected === question.answer_index;
                        const selectedLabel =
                            selected !== undefined ? question.choices[selected] : 'No answer';
                        const correctLabel = question.choices[question.answer_index] ?? 'Unknown';

                        return (
                            <fieldset
                                key={questionId}
                                style={{ marginTop: '20px', padding: '12px', border: '1px solid #ddd' }}
                                disabled={submitted}
                            >
                                <legend>Question {index + 1}</legend>
                                <p style={{ marginTop: '4px' }}>{question.question}</p>

                                <div style={{ marginTop: '12px' }}>
                                    {question.choices.map((choice, choiceIndex) => {
                                        const inputId = `q-${questionId}-opt-${choiceIndex}`;
                                        return (
                                            <label
                                                key={inputId}
                                                htmlFor={inputId}
                                                style={{ display: 'block', marginBottom: '6px' }}
                                            >
                                                <input
                                                    id={inputId}
                                                    type="radio"
                                                    name={`question-${questionId}`}
                                                    value={choiceIndex}
                                                    checked={selected === choiceIndex}
                                                    onChange={() => handleSelect(questionId, choiceIndex)}
                                                    style={{ marginRight: '6px' }}
                                                />
                                                {choice}
                                            </label>
                                        );
                                    })}
                                </div>

                                {submitted && (
                                    <div style={{ marginTop: '10px' }}>
                                        <p>
                                            Result:{' '}
                                            <strong style={{ color: isCorrect ? 'green' : 'crimson' }}>
                                                {isCorrect ? 'Correct' : 'Incorrect'}
                                            </strong>
                                        </p>
                                        <p>Your answer: {selectedLabel}</p>
                                        <p>Correct answer: {correctLabel}</p>
                                        {question.explanation && (
                                            <p style={{ marginTop: '6px' }}>Explanation: {question.explanation}</p>
                                        )}
                                    </div>
                                )}
                            </fieldset>
                        );
                    })}

                    <div style={{ marginTop: '20px', display: 'flex', gap: '8px' }}>
                        {!submitted && (
                            <button type="button" onClick={handleSubmit}>
                                Submit
                            </button>
                        )}
                        <button type="button" onClick={handleReset}>
                            Reset
                        </button>
                    </div>

                    {submitted && score && (
                        <p style={{ marginTop: '12px' }}>
                            Score: <strong>{score.correct}</strong> / <strong>{score.total}</strong>
                        </p>
                    )}
                </section>
            )}
        </main>
    );
}
