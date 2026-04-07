'use client';

import { useState } from 'react';
import { ApiError, getQuestions, submitAttempt } from '@/lib/api';
import type { AttemptResult, Question } from '@/lib/types';

type AppState = 'idle' | 'loading' | 'quiz' | 'submitting' | 'results';
type Difficulty = 'easy' | 'medium' | 'hard';

const CHOICE_LABELS = ['A', 'B', 'C', 'D'];

const DIFFICULTY_CONFIG: Record<Difficulty, { label: string; desc: string; count: string; color: string; bg: string; border: string }> = {
    easy:   { label: 'Easy',   desc: 'Python basics & fundamentals',      count: '7 questions',  color: '#15803d', bg: '#f0fdf4', border: '#bbf7d0' },
    medium: { label: 'Medium', desc: 'Easy + control flow & data types',  count: '20 questions', color: '#b45309', bg: '#fffbeb', border: '#fde68a' },
    hard:   { label: 'Hard',   desc: 'Full test — all 6 topics',          count: '30 questions', color: '#b91c1c', bg: '#fef2f2', border: '#fecaca' },
};

const BAND_META: Record<string, { color: string; bg: string; border: string }> = {
    exam_ready:   { color: '#15803d', bg: '#f0fdf4', border: '#bbf7d0' },
    almost_ready: { color: '#b45309', bg: '#fffbeb', border: '#fde68a' },
    at_risk:      { color: '#c2410c', bg: '#fff7ed', border: '#fed7aa' },
    not_ready:    { color: '#b91c1c', bg: '#fef2f2', border: '#fecaca' },
};

function QuestionText({ text }: { text: string }) {
    const segments = text.split(/\n\n+/);
    return (
        <>
            {segments.map((seg, i) => {
                const looksLikeCode =
                    seg.split('\n').length > 1 &&
                    /[=(){}\[\]:]/.test(seg) &&
                    !/[.!?]$/.test(seg.trim());
                if (looksLikeCode) {
                    return (
                        <pre key={i} style={{
                            background: '#f8fafc',
                            border: '1px solid #e2e8f0',
                            borderLeft: '3px solid #94a3b8',
                            borderRadius: '6px',
                            padding: '14px 16px',
                            fontFamily: '"Fira Code", "Cascadia Code", Consolas, monospace',
                            fontSize: '0.85rem',
                            color: '#334155',
                            overflowX: 'auto',
                            margin: '14px 0 4px',
                            whiteSpace: 'pre',
                            lineHeight: 1.6,
                        }}>
                            {seg}
                        </pre>
                    );
                }
                return (
                    <p key={i} style={{
                        color: '#1e293b',
                        fontSize: '1.05rem',
                        lineHeight: 1.65,
                        marginBottom: i < segments.length - 1 ? '8px' : 0,
                    }}>
                        {seg}
                    </p>
                );
            })}
        </>
    );
}

function PageShell({ children }: { children: React.ReactNode }) {
    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
            <header style={{ background: '#fff', borderBottom: '1px solid #f1f5f9', padding: '0 32px', height: '60px', display: 'flex', alignItems: 'center' }}>
                <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#0f172a', letterSpacing: '-0.03em' }}>
                    examifyr
                </span>
            </header>
            {children}
        </div>
    );
}

export default function Home() {
    const [state, setState] = useState<AppState>('idle');
    const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, number | null>>({});
    const [revealed, setRevealed] = useState<Set<number>>(new Set());
    const [result, setResult] = useState<AttemptResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const totalCount = questions.length;
    const currentQ = questions[currentIndex];
    const isLastQuestion = currentIndex === totalCount - 1;
    const currentAnswer = currentQ ? answers[currentQ.id] : undefined;
    const currentRevealed = currentQ ? revealed.has(currentQ.id) : false;

    const handleStart = async (diff: Difficulty) => {
        setDifficulty(diff);
        setError(null);
        setState('loading');
        try {
            const qs = await getQuestions(diff);
            setQuestions(qs);
            setAnswers({});
            setRevealed(new Set());
            setCurrentIndex(0);
            setState('quiz');
        } catch (err) {
            setError(err instanceof ApiError ? err.message : 'Failed to load. Please try again.');
            setState('idle');
        }
    };

    const handleSelectAnswer = (qId: number, choiceIndex: number) => {
        if (revealed.has(qId)) return; // locked after reveal
        setAnswers((prev) => ({ ...prev, [qId]: choiceIndex }));
        setRevealed((prev) => new Set(prev).add(qId));
    };

    const handleNext = async () => {
        if (isLastQuestion) {
            // submit
            setState('submitting');
            try {
                const res = await submitAttempt({
                    session_token: crypto.randomUUID(),
                    topic: `python readiness (${difficulty})`,
                    answers: questions.map((q) => ({
                        question_id: q.id,
                        selected_index: answers[q.id] ?? null,
                        time_spent_ms: 0,
                    })),
                });
                setResult(res);
                setState('results');
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } catch (err) {
                setError(err instanceof ApiError ? err.message : 'Submit failed. Please try again.');
                setState('quiz');
            }
        } else {
            setCurrentIndex((i) => i + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleRetake = () => {
        setResult(null); setQuestions([]); setAnswers({}); setRevealed(new Set());
        setCurrentIndex(0); setError(null); setDifficulty(null); setState('idle');
    };

    // ── Landing ───────────────────────────────────────────────────────────────
    if (state === 'idle') {
        return (
            <PageShell>
                <main style={{ maxWidth: '680px', margin: '0 auto', padding: '64px 24px' }}>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: '#94a3b8', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '16px' }}>
                        Python Certification Readiness
                    </p>
                    <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '16px' }}>
                        Know if you&apos;re ready<br />before you take the exam.
                    </h1>
                    <p style={{ fontSize: '1.05rem', color: '#64748b', lineHeight: 1.65, marginBottom: '48px', maxWidth: '480px' }}>
                        Get an instant readiness score, see your weak areas, and know your pass likelihood.
                    </p>

                    <p style={{ fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '16px' }}>
                        Select your test level
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
                        {(Object.entries(DIFFICULTY_CONFIG) as [Difficulty, typeof DIFFICULTY_CONFIG[Difficulty]][]).map(([key, cfg]) => (
                            <button
                                key={key}
                                onClick={() => handleStart(key)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '18px 20px',
                                    background: '#fff',
                                    border: `1.5px solid #e2e8f0`,
                                    borderRadius: '12px',
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                                    transition: 'border-color 0.15s, box-shadow 0.15s',
                                }}
                                onMouseEnter={(e) => {
                                    (e.currentTarget as HTMLButtonElement).style.borderColor = cfg.color;
                                    (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 2px 8px rgba(0,0,0,0.08)`;
                                }}
                                onMouseLeave={(e) => {
                                    (e.currentTarget as HTMLButtonElement).style.borderColor = '#e2e8f0';
                                    (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)';
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                    <span style={{
                                        display: 'inline-block',
                                        padding: '4px 12px',
                                        background: cfg.bg,
                                        color: cfg.color,
                                        border: `1px solid ${cfg.border}`,
                                        borderRadius: '6px',
                                        fontSize: '13px',
                                        fontWeight: 700,
                                        minWidth: '64px',
                                        textAlign: 'center',
                                    }}>
                                        {cfg.label}
                                    </span>
                                    <span style={{ fontSize: '0.9rem', color: '#64748b' }}>{cfg.desc}</span>
                                </div>
                                <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: 500, flexShrink: 0 }}>{cfg.count}</span>
                            </button>
                        ))}
                    </div>

                    {error && <p style={{ color: '#dc2626', fontSize: '0.9rem', marginTop: '12px' }}>{error}</p>}
                    <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '16px' }}>No sign-up required</p>
                </main>
            </PageShell>
        );
    }

    // ── Loading ───────────────────────────────────────────────────────────────
    if (state === 'loading') {
        return (
            <PageShell>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 'calc(100vh - 60px)' }}>
                    <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Loading questions…</p>
                </div>
            </PageShell>
        );
    }

    // ── Results ───────────────────────────────────────────────────────────────
    if (state === 'results' && result) {
        const meta = BAND_META[result.band] ?? { color: '#64748b', bg: '#f8fafc', border: '#e2e8f0' };
        const sortedTopics = Object.entries(result.topic_breakdown).sort(([, a], [, b]) => a.accuracy - b.accuracy);
        const correctCount = Object.values(result.topic_breakdown).reduce((acc, td) => acc + td.correct, 0);

        return (
            <PageShell>
                <main style={{ maxWidth: '680px', margin: '0 auto', padding: '40px 24px 80px' }}>
                    <p style={{ fontSize: '13px', color: '#94a3b8', fontWeight: 500, marginBottom: '24px' }}>
                        Python Readiness · {difficulty ? DIFFICULTY_CONFIG[difficulty].label : ''} Test · {totalCount} questions
                    </p>

                    {/* Score card */}
                    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden', marginBottom: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                        <div style={{ background: meta.bg, borderBottom: `1px solid ${meta.border}`, padding: '36px 32px', display: 'flex', alignItems: 'center', gap: '28px' }}>
                            <div style={{ textAlign: 'center', minWidth: '100px' }}>
                                <div style={{ fontSize: '4.5rem', fontWeight: 800, color: meta.color, lineHeight: 1, letterSpacing: '-0.04em' }}>
                                    {result.readiness_score}
                                </div>
                                <div style={{ fontSize: '12px', color: meta.color, fontWeight: 500, marginTop: '4px', opacity: 0.7 }}>/ 100</div>
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'inline-block', background: meta.border, color: meta.color, borderRadius: '6px', padding: '4px 12px', fontSize: '13px', fontWeight: 700, marginBottom: '10px' }}>
                                    {result.band_label}
                                </div>
                                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                                    <div>
                                        <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#0f172a' }}>{result.pass_likelihood}%</div>
                                        <div style={{ fontSize: '12px', color: '#94a3b8' }}>Pass likelihood</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#0f172a' }}>{correctCount}/{totalCount}</div>
                                        <div style={{ fontSize: '12px', color: '#94a3b8' }}>Correct answers</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#0f172a' }}>{result.raw_score}/{result.max_score}</div>
                                        <div style={{ fontSize: '12px', color: '#94a3b8' }}>Weighted score</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {result.weak_areas.length > 0 && (
                            <div style={{ padding: '20px 32px', borderBottom: '1px solid #f1f5f9' }}>
                                <p style={{ fontSize: '12px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>Areas to improve</p>
                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                    {result.weak_areas.map((area) => (
                                        <span key={area} style={{ background: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca', borderRadius: '6px', padding: '4px 12px', fontSize: '13px', fontWeight: 500 }}>
                                            {area}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div style={{ padding: '20px 32px' }}>
                            <p style={{ fontSize: '12px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '16px' }}>Topic breakdown</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                {sortedTopics.map(([topic, bd]) => (
                                    <div key={topic}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                            <span style={{ fontSize: '0.875rem', color: '#334155', fontWeight: 500, textTransform: 'capitalize' }}>{topic}</span>
                                            <span style={{ fontSize: '0.875rem', fontWeight: 700, color: bd.accuracy >= 60 ? '#15803d' : '#b91c1c' }}>
                                                {bd.accuracy}% <span style={{ fontWeight: 400, color: '#94a3b8' }}>({bd.correct}/{bd.total})</span>
                                            </span>
                                        </div>
                                        <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '999px', overflow: 'hidden' }}>
                                            <div style={{ height: '6px', width: `${bd.accuracy}%`, background: bd.accuracy >= 60 ? '#22c55e' : '#ef4444', borderRadius: '999px' }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* CTA */}
                    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px 32px', marginBottom: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                        <p style={{ fontSize: '12px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>Improve faster</p>
                        <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.02em', marginBottom: '6px' }}>Get a personalised AI study plan</h2>
                        <p style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: 1.55, marginBottom: '20px' }}>
                            Deep analysis of your mistakes, topic breakdowns, and a 14-day plan built for your weak areas.
                        </p>
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                            <button disabled style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 20px', fontSize: '0.875rem', fontWeight: 600, cursor: 'not-allowed', opacity: 0.45 }}>
                                Full AI Report — $19
                            </button>
                            <button disabled style={{ background: '#fff', color: '#2563eb', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '10px 20px', fontSize: '0.875rem', fontWeight: 600, cursor: 'not-allowed', opacity: 0.45 }}>
                                Practice Pack — $9
                            </button>
                        </div>
                        <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '10px' }}>Coming soon</p>
                    </div>

                    <button onClick={handleRetake} style={{ background: 'transparent', color: '#64748b', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 20px', fontSize: '0.875rem', cursor: 'pointer' }}>
                        ← Take another test
                    </button>
                </main>
            </PageShell>
        );
    }

    // ── Quiz (one question at a time) ─────────────────────────────────────────
    if (!currentQ) return null;

    const isAnswered = currentRevealed;
    const selectedChoice = currentAnswer;
    const isCorrect = selectedChoice === currentQ.answer_index;
    const diffCfg = difficulty ? DIFFICULTY_CONFIG[difficulty] : null;

    return (
        <PageShell>
            {/* Sticky progress header */}
            <div style={{ position: 'sticky', top: 0, background: '#fff', borderBottom: '1px solid #f1f5f9', zIndex: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                <div style={{ maxWidth: '680px', margin: '0 auto', padding: '0 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '56px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>
                                Question <strong style={{ color: '#0f172a' }}>{currentIndex + 1}</strong> of {totalCount}
                            </span>
                            {diffCfg && (
                                <span style={{ padding: '2px 8px', background: diffCfg.bg, color: diffCfg.color, border: `1px solid ${diffCfg.border}`, borderRadius: '4px', fontSize: '11px', fontWeight: 700 }}>
                                    {diffCfg.label}
                                </span>
                            )}
                        </div>
                        <span style={{ fontSize: '13px', color: '#94a3b8' }}>
                            {Object.keys(answers).length} answered
                        </span>
                    </div>
                    <div style={{ height: '3px', background: '#f1f5f9', marginBottom: '0' }}>
                        <div style={{ height: '3px', background: '#2563eb', width: `${((currentIndex + (isAnswered ? 1 : 0)) / totalCount) * 100}%`, transition: 'width 0.3s ease', borderRadius: '0 2px 2px 0' }} />
                    </div>
                </div>
            </div>

            <main style={{ maxWidth: '680px', margin: '0 auto', padding: '40px 24px 80px' }}>
                {/* Question card */}
                <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                    {/* Card header */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 24px', background: '#fafafa', borderBottom: '1px solid #f1f5f9' }}>
                        <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 500, textTransform: 'capitalize' }}>{currentQ.topic}</span>
                        <span style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            padding: '2px 9px',
                            borderRadius: '4px',
                            color: currentQ.difficulty === 'easy' ? '#15803d' : currentQ.difficulty === 'medium' ? '#b45309' : '#b91c1c',
                            background: currentQ.difficulty === 'easy' ? '#f0fdf4' : currentQ.difficulty === 'medium' ? '#fffbeb' : '#fef2f2',
                        }}>
                            {currentQ.difficulty} · {currentQ.points} {currentQ.points === 1 ? 'pt' : 'pts'}
                        </span>
                    </div>

                    {/* Question body */}
                    <div style={{ padding: '28px 24px 20px' }}>
                        <QuestionText text={currentQ.question_text} />

                        {/* Choices */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '24px' }}>
                            {currentQ.choices.map((choice, ci) => {
                                const isSelected = selectedChoice === ci;
                                const isCorrectChoice = ci === currentQ.answer_index;

                                let borderColor = '#e2e8f0';
                                let bg = '#fff';
                                let labelBg = '#f1f5f9';
                                let labelColor = '#64748b';
                                let textColor = '#374151';

                                if (isAnswered) {
                                    if (isCorrectChoice) {
                                        borderColor = '#16a34a';
                                        bg = '#f0fdf4';
                                        labelBg = '#16a34a';
                                        labelColor = '#fff';
                                        textColor = '#15803d';
                                    } else if (isSelected && !isCorrectChoice) {
                                        borderColor = '#dc2626';
                                        bg = '#fef2f2';
                                        labelBg = '#dc2626';
                                        labelColor = '#fff';
                                        textColor = '#b91c1c';
                                    }
                                } else if (isSelected) {
                                    borderColor = '#2563eb';
                                    bg = '#eff6ff';
                                    labelBg = '#2563eb';
                                    labelColor = '#fff';
                                    textColor = '#1e40af';
                                }

                                return (
                                    <button
                                        key={ci}
                                        onClick={() => handleSelectAnswer(currentQ.id, ci)}
                                        disabled={isAnswered}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'flex-start',
                                            gap: '12px',
                                            padding: '13px 16px',
                                            background: bg,
                                            border: `1.5px solid ${borderColor}`,
                                            borderRadius: '10px',
                                            cursor: isAnswered ? 'default' : 'pointer',
                                            textAlign: 'left',
                                            width: '100%',
                                            transition: 'all 0.15s',
                                        }}
                                    >
                                        <span style={{ width: '26px', height: '26px', borderRadius: '7px', background: labelBg, color: labelColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, flexShrink: 0, marginTop: '1px', transition: 'all 0.15s' }}>
                                            {CHOICE_LABELS[ci]}
                                        </span>
                                        <span style={{ fontSize: '0.9rem', color: textColor, fontWeight: isSelected || (isAnswered && isCorrectChoice) ? 500 : 400, lineHeight: 1.55 }}>
                                            {choice}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Feedback panel */}
                    {isAnswered && (
                        <div style={{
                            borderTop: `1px solid ${isCorrect ? '#bbf7d0' : '#fecaca'}`,
                            background: isCorrect ? '#f0fdf4' : '#fef2f2',
                            padding: '20px 24px',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: currentQ.explanation ? '10px' : '0' }}>
                                <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>{isCorrect ? '✓' : '✗'}</span>
                                <div>
                                    <p style={{ fontWeight: 700, color: isCorrect ? '#15803d' : '#b91c1c', fontSize: '0.95rem', marginBottom: '2px' }}>
                                        {isCorrect ? 'Correct!' : 'Incorrect'}
                                    </p>
                                    {!isCorrect && (
                                        <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '4px' }}>
                                            Correct answer: <strong style={{ color: '#374151' }}>{CHOICE_LABELS[currentQ.answer_index]} — {currentQ.choices[currentQ.answer_index]}</strong>
                                        </p>
                                    )}
                                    {currentQ.explanation && (
                                        <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.55 }}>
                                            {currentQ.explanation}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Navigation */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
                    <button
                        onClick={() => { setCurrentIndex((i) => i - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        disabled={currentIndex === 0}
                        style={{ background: 'transparent', color: currentIndex === 0 ? '#cbd5e1' : '#64748b', border: `1px solid ${currentIndex === 0 ? '#f1f5f9' : '#e2e8f0'}`, borderRadius: '8px', padding: '10px 20px', fontSize: '0.875rem', cursor: currentIndex === 0 ? 'default' : 'pointer' }}
                    >
                        ← Previous
                    </button>

                    {error && <p style={{ color: '#dc2626', fontSize: '0.875rem' }}>{error}</p>}

                    {isAnswered && (
                        <button
                            onClick={handleNext}
                            disabled={state === 'submitting'}
                            style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 24px', fontSize: '0.9rem', fontWeight: 700, cursor: state === 'submitting' ? 'not-allowed' : 'pointer', opacity: state === 'submitting' ? 0.6 : 1 }}
                        >
                            {state === 'submitting' ? 'Submitting…' : isLastQuestion ? 'See Results →' : 'Next →'}
                        </button>
                    )}
                </div>
            </main>
        </PageShell>
    );
}
