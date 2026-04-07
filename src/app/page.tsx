'use client';

import { useState } from 'react';
import { ApiError, getQuestions, submitAttempt } from '@/lib/api';
import type { AttemptResult, Question } from '@/lib/types';

type AppState = 'idle' | 'loading' | 'quiz' | 'submitting' | 'results';

const BAND_COLORS: Record<string, string> = {
    exam_ready: '#16a34a',
    almost_ready: '#ca8a04',
    at_risk: '#ea580c',
    not_ready: '#dc2626',
};

const DIFFICULTY_LABELS: Record<string, string> = {
    easy: '1 pt',
    medium: '2 pts',
    hard: '3 pts',
};

export default function Home() {
    const [state, setState] = useState<AppState>('idle');
    const [questions, setQuestions] = useState<Question[]>([]);
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [result, setResult] = useState<AttemptResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const answeredCount = Object.keys(answers).length;
    const totalCount = questions.length;

    const handleStart = async () => {
        setError(null);
        setState('loading');
        try {
            const qs = await getQuestions();
            setQuestions(qs);
            setAnswers({});
            setState('quiz');
        } catch (err) {
            const message =
                err instanceof ApiError ? err.message : 'Failed to load questions. Please try again.';
            setError(message);
            setState('idle');
        }
    };

    const handleSelect = (questionId: number, choiceIndex: number) => {
        setAnswers((prev) => ({ ...prev, [questionId]: choiceIndex }));
    };

    const handleSubmit = async () => {
        setError(null);
        setState('submitting');
        try {
            const sessionToken = crypto.randomUUID();
            const payload = {
                session_token: sessionToken,
                topic: 'python readiness',
                answers: questions.map((q) => ({
                    question_id: q.id,
                    selected_index: answers[q.id] ?? null,
                    time_spent_ms: 0,
                })),
            };
            const res = await submitAttempt(payload);
            setResult(res);
            setState('results');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err) {
            const message =
                err instanceof ApiError ? err.message : 'Failed to submit. Please try again.';
            setError(message);
            setState('quiz');
        }
    };

    const handleRetake = () => {
        setResult(null);
        setQuestions([]);
        setAnswers({});
        setError(null);
        setState('idle');
    };

    // ── Landing ───────────────────────────────────────────────────────────────
    if (state === 'idle') {
        return (
            <main style={{ padding: '60px 40px', maxWidth: '720px', margin: '0 auto', textAlign: 'center' }}>
                <p style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '0.08em', color: '#6b7280', textTransform: 'uppercase', marginBottom: '16px' }}>
                    Python Readiness
                </p>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 700, lineHeight: 1.2, marginBottom: '16px' }}>
                    Know if you&apos;re ready<br />before you take the exam.
                </h1>
                <p style={{ fontSize: '1.1rem', color: '#6b7280', marginBottom: '40px' }}>
                    30 questions &bull; Easy to hard &bull; Instant readiness score
                </p>
                <button
                    onClick={handleStart}
                    style={{
                        background: '#2563eb',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '14px 40px',
                        fontSize: '1rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                    }}
                >
                    Start Free Test
                </button>
                {error && (
                    <p style={{ color: '#dc2626', marginTop: '20px' }}>{error}</p>
                )}
                <p style={{ marginTop: '16px', fontSize: '13px', color: '#9ca3af' }}>
                    No sign-up required
                </p>
            </main>
        );
    }

    // ── Loading ───────────────────────────────────────────────────────────────
    if (state === 'loading') {
        return (
            <main style={{ padding: '60px 40px', maxWidth: '720px', margin: '0 auto', textAlign: 'center' }}>
                <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>Loading questions...</p>
            </main>
        );
    }

    // ── Results ───────────────────────────────────────────────────────────────
    if (state === 'results' && result) {
        const bandColor = BAND_COLORS[result.band] ?? '#6b7280';
        const sortedTopics = Object.entries(result.topic_breakdown).sort(
            ([, a], [, b]) => a.accuracy - b.accuracy,
        );

        return (
            <main style={{ padding: '40px', maxWidth: '720px', margin: '0 auto', color: '#111827' }}>
                {/* Score card */}
                <div style={{
                    textAlign: 'center',
                    padding: '40px 24px',
                    border: `2px solid ${bandColor}`,
                    borderRadius: '12px',
                    marginBottom: '32px',
                }}>
                    <p style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '0.08em', color: '#6b7280', textTransform: 'uppercase', marginBottom: '8px' }}>
                        Your Readiness Score
                    </p>
                    <div style={{ fontSize: '5rem', fontWeight: 700, color: bandColor, lineHeight: 1 }}>
                        {result.readiness_score}
                    </div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 600, color: bandColor, marginTop: '8px' }}>
                        {result.band_label}
                    </div>
                    <p style={{ color: '#6b7280', marginTop: '12px', fontSize: '0.95rem' }}>
                        Pass likelihood: <strong>{result.pass_likelihood}%</strong>
                        &nbsp;&bull;&nbsp;
                        Raw score: <strong>{result.raw_score}</strong> / <strong>{result.max_score}</strong> pts
                    </p>
                </div>

                {/* Weak areas */}
                {result.weak_areas.length > 0 && (
                    <div style={{ marginBottom: '32px' }}>
                        <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '12px' }}>
                            Weak Areas
                        </h2>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            {result.weak_areas.map((area) => (
                                <li key={area} style={{
                                    padding: '10px 14px',
                                    background: '#fef2f2',
                                    border: '1px solid #fecaca',
                                    borderRadius: '6px',
                                    marginBottom: '8px',
                                    color: '#991b1b',
                                    fontWeight: 500,
                                }}>
                                    {area}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Topic breakdown */}
                <div style={{ marginBottom: '32px' }}>
                    <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '12px' }}>
                        Topic Breakdown
                    </h2>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                                <th style={{ textAlign: 'left', padding: '8px 0', color: '#6b7280', fontWeight: 500 }}>Topic</th>
                                <th style={{ textAlign: 'right', padding: '8px 0', color: '#6b7280', fontWeight: 500 }}>Correct</th>
                                <th style={{ textAlign: 'right', padding: '8px 0', color: '#6b7280', fontWeight: 500 }}>Accuracy</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedTopics.map(([topic, bd]) => (
                                <tr key={topic} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                    <td style={{ padding: '10px 0', fontWeight: 500 }}>{topic}</td>
                                    <td style={{ textAlign: 'right', padding: '10px 0', color: '#6b7280' }}>
                                        {bd.correct}/{bd.total}
                                    </td>
                                    <td style={{
                                        textAlign: 'right',
                                        padding: '10px 0',
                                        fontWeight: 600,
                                        color: bd.accuracy >= 60 ? '#16a34a' : '#dc2626',
                                    }}>
                                        {bd.accuracy}%
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Revenue CTAs */}
                <div style={{
                    background: '#eff6ff',
                    border: '1px solid #bfdbfe',
                    borderRadius: '12px',
                    padding: '24px',
                    marginBottom: '24px',
                    color: '#111827',
                }}>
                    <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '6px' }}>
                        Want a full study plan?
                    </h2>
                    <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '16px' }}>
                        Get a personalized AI report with your mistake patterns and a 14-day study plan.
                    </p>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        <button style={{
                            background: '#2563eb',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '12px 24px',
                            fontSize: '0.95rem',
                            fontWeight: 600,
                            cursor: 'not-allowed',
                            opacity: 0.7,
                        }} disabled>
                            Full AI Report — $19 (coming soon)
                        </button>
                        <button style={{
                            background: '#fff',
                            color: '#2563eb',
                            border: '1px solid #2563eb',
                            borderRadius: '8px',
                            padding: '12px 24px',
                            fontSize: '0.95rem',
                            fontWeight: 600,
                            cursor: 'not-allowed',
                            opacity: 0.7,
                        }} disabled>
                            Practice Pack — $9 (coming soon)
                        </button>
                    </div>
                </div>

                <button
                    onClick={handleRetake}
                    style={{
                        background: 'transparent',
                        color: '#6b7280',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        padding: '10px 24px',
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                    }}
                >
                    Retake Test
                </button>
            </main>
        );
    }

    // ── Quiz ──────────────────────────────────────────────────────────────────
    return (
        <main style={{ maxWidth: '720px', margin: '0 auto', paddingBottom: '60px', color: '#111827' }}>
            {/* Sticky progress bar */}
            <div style={{
                position: 'sticky',
                top: 0,
                background: '#fff',
                borderBottom: '1px solid #e5e7eb',
                padding: '14px 40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                zIndex: 10,
                color: '#111827',
            }}>
                <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>Python Readiness Test</span>
                <span style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                    {answeredCount} / {totalCount} answered
                </span>
            </div>

            <div style={{ padding: '32px 40px 0' }}>
                {/* Progress fill */}
                <div style={{ background: '#e5e7eb', borderRadius: '4px', height: '6px', marginBottom: '32px' }}>
                    <div style={{
                        background: '#2563eb',
                        borderRadius: '4px',
                        height: '6px',
                        width: `${totalCount > 0 ? (answeredCount / totalCount) * 100 : 0}%`,
                        transition: 'width 0.2s',
                    }} />
                </div>

                {questions.map((question, index) => {
                    const selected = answers[question.id];
                    return (
                        <fieldset
                            key={question.id}
                            style={{
                                marginBottom: '28px',
                                padding: '20px',
                                border: '1px solid #e5e7eb',
                                borderRadius: '10px',
                                background: selected !== undefined ? '#f0fdf4' : '#fff',
                                borderColor: selected !== undefined ? '#86efac' : '#e5e7eb',
                            }}
                        >
                            <legend style={{ padding: '0 8px', fontWeight: 600, fontSize: '0.85rem', color: '#6b7280' }}>
                                Q{index + 1} &bull; {question.topic} &bull; {DIFFICULTY_LABELS[question.difficulty]}
                            </legend>
                            <p style={{ marginTop: '8px', marginBottom: '16px', fontWeight: 500, lineHeight: 1.5 }}>
                                {question.question_text}
                            </p>
                            <div>
                                {question.choices.map((choice, choiceIndex) => {
                                    const inputId = `q-${question.id}-opt-${choiceIndex}`;
                                    return (
                                        <label
                                            key={inputId}
                                            htmlFor={inputId}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'flex-start',
                                                gap: '10px',
                                                marginBottom: '10px',
                                                cursor: 'pointer',
                                                padding: '10px 12px',
                                                borderRadius: '6px',
                                                border: '1px solid',
                                                borderColor: selected === choiceIndex ? '#2563eb' : '#e5e7eb',
                                                background: selected === choiceIndex ? '#eff6ff' : 'transparent',
                                            }}
                                        >
                                            <input
                                                id={inputId}
                                                type="radio"
                                                name={`question-${question.id}`}
                                                value={choiceIndex}
                                                checked={selected === choiceIndex}
                                                onChange={() => handleSelect(question.id, choiceIndex)}
                                                style={{ marginTop: '2px', flexShrink: 0 }}
                                            />
                                            <span style={{ lineHeight: 1.5 }}>{choice}</span>
                                        </label>
                                    );
                                })}
                            </div>
                        </fieldset>
                    );
                })}

                {error && (
                    <p style={{ color: '#dc2626', marginBottom: '16px' }}>{error}</p>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '8px' }}>
                    <button
                        onClick={handleSubmit}
                        disabled={state === 'submitting'}
                        style={{
                            background: '#2563eb',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '14px 36px',
                            fontSize: '1rem',
                            fontWeight: 600,
                            cursor: state === 'submitting' ? 'not-allowed' : 'pointer',
                            opacity: state === 'submitting' ? 0.7 : 1,
                        }}
                    >
                        {state === 'submitting' ? 'Submitting...' : 'Submit Test'}
                    </button>
                    {answeredCount < totalCount && (
                        <span style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                            {totalCount - answeredCount} question{totalCount - answeredCount !== 1 ? 's' : ''} unanswered — you can still submit
                        </span>
                    )}
                </div>
            </div>
        </main>
    );
}
