'use client';

import { useState, useEffect } from 'react';
import { ApiError, getQuestions, getSubjects, submitAttempt } from '@/lib/api';
import type { AttemptResult, Question, SubjectMeta } from '@/lib/types';

type AppState = 'idle' | 'picking-difficulty' | 'loading' | 'quiz' | 'submitting' | 'results';
type Difficulty = 'easy' | 'medium' | 'hard';

const CHOICE_LABELS = ['A', 'B', 'C', 'D'];

const SUBJECT_ICONS: Record<string, string> = {
    'Python':     '🐍',
    'JavaScript': '⚡',
    'SQL':        '🗄️',
    'HTML & CSS': '🎨',
};

const DIFFICULTY_CONFIG: Record<Difficulty, { label: string; tagline: string; color: string; bg: string; border: string }> = {
    easy:   { label: 'Easy',   tagline: 'Easy questions only — great for beginners',     color: '#15803d', bg: '#f0fdf4', border: '#bbf7d0' },
    medium: { label: 'Medium', tagline: 'Easy + medium — covers core concepts',           color: '#b45309', bg: '#fffbeb', border: '#fde68a' },
    hard:   { label: 'Hard',   tagline: 'Full test — all difficulties, all topics',       color: '#b91c1c', bg: '#fef2f2', border: '#fecaca' },
};

const BAND_META: Record<string, { color: string; bg: string; border: string }> = {
    exam_ready:   { color: '#15803d', bg: '#f0fdf4', border: '#bbf7d0' },
    almost_ready: { color: '#b45309', bg: '#fffbeb', border: '#fde68a' },
    at_risk:      { color: '#c2410c', bg: '#fff7ed', border: '#fed7aa' },
    not_ready:    { color: '#b91c1c', bg: '#fef2f2', border: '#fecaca' },
};

// ── Logo ─────────────────────────────────────────────────────────────────────
function Logo({ size = 32 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="8" fill="#2563eb"/>
            <path d="M8 17l5 5 11-11" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    );
}

// ── Code-aware question renderer ──────────────────────────────────────────────
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
                            background: '#f8fafc', border: '1px solid #e2e8f0',
                            borderLeft: '3px solid #94a3b8', borderRadius: '6px',
                            padding: '14px 16px',
                            fontFamily: '"Fira Code", "Cascadia Code", Consolas, monospace',
                            fontSize: '0.85rem', color: '#334155',
                            overflowX: 'auto', margin: '14px 0 4px',
                            whiteSpace: 'pre', lineHeight: 1.6,
                        }}>
                            {seg}
                        </pre>
                    );
                }
                return (
                    <p key={i} style={{ color: '#1e293b', fontSize: '1.05rem', lineHeight: 1.65, marginBottom: i < segments.length - 1 ? '8px' : 0 }}>
                        {seg}
                    </p>
                );
            })}
        </>
    );
}

// ── Nav shell used during quiz/results ───────────────────────────────────────
function PageShell({ children, onHome }: { children: React.ReactNode; onHome: () => void }) {
    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
            <header style={{ background: '#fff', borderBottom: '1px solid #f1f5f9', padding: '0 32px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <button onClick={onHome} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                    <Logo size={28} />
                    <span style={{ fontWeight: 800, fontSize: '1.05rem', color: '#0f172a', letterSpacing: '-0.03em' }}>examifyr</span>
                </button>
            </header>
            {children}
        </div>
    );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function Home() {
    const [state, setState] = useState<AppState>('idle');
    const [subjects, setSubjects] = useState<SubjectMeta[]>([]);
    const [subject, setSubject] = useState<string | null>(null);
    const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, number | null>>({});
    const [revealed, setRevealed] = useState<Set<number>>(new Set());
    const [result, setResult] = useState<AttemptResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Fetch subjects once on mount
    useEffect(() => {
        getSubjects()
            .then(setSubjects)
            .catch(() => {/* use fallback below */});
    }, []);

    const totalCount = questions.length;
    const currentQ = questions[currentIndex];
    const isLastQuestion = currentIndex === totalCount - 1;
    const currentAnswer = currentQ ? answers[currentQ.id] : undefined;
    const currentRevealed = currentQ ? revealed.has(currentQ.id) : false;

    const handleSelectSubject = (subjectName: string) => {
        setSubject(subjectName);
        setError(null);
        setState('picking-difficulty');
    };

    const handleStart = async (diff: Difficulty) => {
        setDifficulty(diff);
        setError(null);
        setState('loading');
        try {
            const qs = await getQuestions(subject ?? undefined, diff);
            setQuestions(qs);
            setAnswers({});
            setRevealed(new Set());
            setCurrentIndex(0);
            setState('quiz');
        } catch (err) {
            setError(err instanceof ApiError ? err.message : 'Failed to load. Please try again.');
            setState('picking-difficulty');
        }
    };

    const handleSelectAnswer = (qId: number, choiceIndex: number) => {
        if (revealed.has(qId)) return;
        setAnswers((prev) => ({ ...prev, [qId]: choiceIndex }));
        setRevealed((prev) => new Set(prev).add(qId));
    };

    const handleNext = async () => {
        if (isLastQuestion) {
            setState('submitting');
            try {
                const res = await submitAttempt({
                    session_token: crypto.randomUUID(),
                    topic: `${subject ?? 'general'} readiness (${difficulty})`,
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
        setCurrentIndex(0); setError(null); setDifficulty(null); setSubject(null);
        setState('idle');
    };

    const handleHome = () => {
        handleRetake();
    };

    // ── Difficulty picker (after subject selected) ────────────────────────────
    if (state === 'picking-difficulty') {
        const icon = subject ? SUBJECT_ICONS[subject] ?? '📖' : '📖';
        // Compute question counts per difficulty from subjects data
        const subjectData = subjects.find(s => s.subject === subject);
        const total = subjectData?.total_questions ?? 0;

        return (
            <PageShell onHome={handleHome}>
                <main style={{ maxWidth: '640px', margin: '0 auto', padding: '48px 24px 80px' }}>
                    <button onClick={handleHome} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: '#64748b', fontSize: '13px', cursor: 'pointer', marginBottom: '32px', padding: 0 }}>
                        ← Back to subjects
                    </button>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '32px' }}>
                        <span style={{ fontSize: '2.5rem' }}>{icon}</span>
                        <div>
                            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.03em', marginBottom: '4px' }}>
                                {subject} Readiness Test
                            </h1>
                            <p style={{ fontSize: '0.9rem', color: '#64748b' }}>
                                {total > 0 ? `${total} questions available` : 'Choose your difficulty'}
                            </p>
                        </div>
                    </div>

                    <p style={{ fontSize: '0.95rem', fontWeight: 600, color: '#0f172a', marginBottom: '16px' }}>
                        Select difficulty
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                        {(Object.entries(DIFFICULTY_CONFIG) as [Difficulty, typeof DIFFICULTY_CONFIG[Difficulty]][]).map(([key, cfg]) => (
                            <button
                                key={key}
                                onClick={() => handleStart(key)}
                                style={{
                                    background: '#fff', border: `1.5px solid #e2e8f0`,
                                    borderRadius: '12px', padding: '20px 24px',
                                    cursor: 'pointer', textAlign: 'left',
                                    transition: 'border-color 0.15s, box-shadow 0.15s',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                                    display: 'flex', alignItems: 'center', gap: '16px',
                                }}
                                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = cfg.color; (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 0 0 3px ${cfg.border}`; }}
                                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#e2e8f0'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)'; }}
                            >
                                <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: cfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <span style={{ fontSize: '1.2rem' }}>
                                        {key === 'easy' ? '🟢' : key === 'medium' ? '🟡' : '🔴'}
                                    </span>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '1rem', fontWeight: 700, color: cfg.color, marginBottom: '3px' }}>{cfg.label}</div>
                                    <div style={{ fontSize: '13px', color: '#64748b' }}>{cfg.tagline}</div>
                                </div>
                                <span style={{ color: '#94a3b8', fontSize: '18px' }}>→</span>
                            </button>
                        ))}
                    </div>

                    {error && <p style={{ color: '#dc2626', fontSize: '0.875rem' }}>{error}</p>}
                </main>
            </PageShell>
        );
    }

    // ── Loading ───────────────────────────────────────────────────────────────
    if (state === 'loading') {
        return (
            <PageShell onHome={handleHome}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 'calc(100vh - 60px)', gap: '16px' }}>
                    <div style={{ width: '40px', height: '40px', border: '3px solid #e2e8f0', borderTopColor: '#2563eb', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                    <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Loading {subject} questions…</p>
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
            </PageShell>
        );
    }

    // ── Results ───────────────────────────────────────────────────────────────
    if (state === 'results' && result) {
        const meta = BAND_META[result.band] ?? { color: '#64748b', bg: '#f8fafc', border: '#e2e8f0' };
        const sortedTopics = Object.entries(result.topic_breakdown).sort(([, a], [, b]) => a.accuracy - b.accuracy);
        const correctCount = Object.values(result.topic_breakdown).reduce((acc, td) => acc + td.correct, 0);
        const diffCfg = difficulty ? DIFFICULTY_CONFIG[difficulty] : null;

        return (
            <PageShell onHome={handleHome}>
                <main style={{ maxWidth: '680px', margin: '0 auto', padding: '40px 24px 80px' }}>
                    <p style={{ fontSize: '13px', color: '#94a3b8', fontWeight: 500, marginBottom: '24px' }}>
                        {subject} Readiness · {diffCfg?.label ?? ''} Test · {totalCount} questions
                    </p>

                    {/* Score card */}
                    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden', marginBottom: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                        <div style={{ background: meta.bg, borderBottom: `1px solid ${meta.border}`, padding: '36px 32px', display: 'flex', alignItems: 'center', gap: '28px', flexWrap: 'wrap' }}>
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

                    {/* Revenue CTA */}
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

                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        <button
                            onClick={() => { setDifficulty(null); setState('picking-difficulty'); }}
                            style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 20px', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}
                        >
                            Retake {subject} test
                        </button>
                        <button onClick={handleRetake} style={{ background: 'transparent', color: '#64748b', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 20px', fontSize: '0.875rem', cursor: 'pointer' }}>
                            ← Choose a different subject
                        </button>
                    </div>
                </main>
            </PageShell>
        );
    }

    // ── Quiz (one question at a time) ─────────────────────────────────────────
    if (state === 'quiz' || state === 'submitting') {
        if (!currentQ) return null;
        const isAnswered = currentRevealed;
        const selectedChoice = currentAnswer;
        const isCorrect = selectedChoice === currentQ.answer_index;
        const diffCfg = difficulty ? DIFFICULTY_CONFIG[difficulty] : null;

        return (
            <PageShell onHome={handleHome}>
                {/* Sticky progress header */}
                <div style={{ position: 'sticky', top: 0, background: '#fff', borderBottom: '1px solid #f1f5f9', zIndex: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '0 24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '56px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>
                                    <strong style={{ color: '#0f172a' }}>{subject}</strong> · Question <strong style={{ color: '#0f172a' }}>{currentIndex + 1}</strong> of {totalCount}
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
                        <div style={{ height: '3px', background: '#f1f5f9' }}>
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
                                fontSize: '11px', fontWeight: 700, padding: '2px 9px', borderRadius: '4px',
                                color: currentQ.difficulty === 'easy' ? '#15803d' : currentQ.difficulty === 'medium' ? '#b45309' : '#b91c1c',
                                background: currentQ.difficulty === 'easy' ? '#f0fdf4' : currentQ.difficulty === 'medium' ? '#fffbeb' : '#fef2f2',
                            }}>
                                {currentQ.difficulty.charAt(0).toUpperCase() + currentQ.difficulty.slice(1)} · {currentQ.points}pt{currentQ.points > 1 ? 's' : ''}
                            </span>
                        </div>

                        {/* Question text */}
                        <div style={{ padding: '28px 24px 20px' }}>
                            <QuestionText text={currentQ.question_text} />
                        </div>

                        {/* Choices */}
                        <div style={{ padding: '0 24px 24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {currentQ.choices.map((choice, i) => {
                                const isSelected = selectedChoice === i;
                                const isCorrectChoice = i === currentQ.answer_index;
                                let bg = '#fff', border = '#e2e8f0', color = '#1e293b', labelBg = '#f8fafc', labelColor = '#64748b';

                                if (isAnswered) {
                                    if (isCorrectChoice) {
                                        bg = '#f0fdf4'; border = '#86efac'; color = '#14532d';
                                        labelBg = '#22c55e'; labelColor = '#fff';
                                    } else if (isSelected) {
                                        bg = '#fef2f2'; border = '#fca5a5'; color = '#7f1d1d';
                                        labelBg = '#ef4444'; labelColor = '#fff';
                                    }
                                }

                                return (
                                    <button
                                        key={i}
                                        onClick={() => handleSelectAnswer(currentQ.id, i)}
                                        disabled={isAnswered}
                                        style={{
                                            display: 'flex', alignItems: 'flex-start', gap: '14px',
                                            padding: '14px 16px', background: bg,
                                            border: `1.5px solid ${border}`, borderRadius: '10px',
                                            cursor: isAnswered ? 'default' : 'pointer',
                                            textAlign: 'left', transition: 'all 0.15s',
                                        }}
                                    >
                                        <span style={{ width: '26px', height: '26px', borderRadius: '6px', background: labelBg, color: labelColor, fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>
                                            {CHOICE_LABELS[i]}
                                        </span>
                                        <span style={{ fontSize: '0.95rem', color, lineHeight: 1.55, fontFamily: 'inherit' }}>{choice}</span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Feedback */}
                        {isAnswered && (
                            <div style={{
                                margin: '0 24px 24px',
                                padding: '16px 20px',
                                background: isCorrect ? '#f0fdf4' : '#fef2f2',
                                border: `1px solid ${isCorrect ? '#bbf7d0' : '#fecaca'}`,
                                borderRadius: '10px',
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                    <span style={{ fontSize: '1rem' }}>{isCorrect ? '✅' : '❌'}</span>
                                    <span style={{ fontSize: '0.875rem', fontWeight: 700, color: isCorrect ? '#15803d' : '#b91c1c' }}>
                                        {isCorrect ? 'Correct!' : 'Incorrect'}
                                    </span>
                                </div>
                                <p style={{ fontSize: '0.875rem', color: isCorrect ? '#14532d' : '#7f1d1d', lineHeight: 1.6, margin: 0 }}>
                                    {currentQ.explanation}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Navigation */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', alignItems: 'center' }}>
                        <button
                            onClick={() => { setCurrentIndex((i) => i - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                            disabled={currentIndex === 0}
                            style={{ background: '#fff', color: currentIndex === 0 ? '#cbd5e1' : '#475569', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 18px', fontSize: '0.875rem', cursor: currentIndex === 0 ? 'not-allowed' : 'pointer' }}
                        >
                            ← Previous
                        </button>
                        {isAnswered && (
                            <button
                                onClick={handleNext}
                                disabled={state === 'submitting'}
                                style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 24px', fontSize: '0.875rem', fontWeight: 600, cursor: state === 'submitting' ? 'not-allowed' : 'pointer' }}
                            >
                                {state === 'submitting' ? 'Submitting…' : isLastQuestion ? 'See Results →' : 'Next →'}
                            </button>
                        )}
                    </div>

                    {error && <p style={{ color: '#dc2626', fontSize: '0.875rem', marginTop: '12px' }}>{error}</p>}
                </main>
            </PageShell>
        );
    }

    // ── Landing (idle) ────────────────────────────────────────────────────────
    // Fallback subject list if API hasn't loaded yet
    const displaySubjects: SubjectMeta[] = subjects.length > 0 ? subjects : [
        { subject: 'Python',     display_name: 'Python',     description: 'Core Python: syntax, data structures, functions, OOP, error handling', total_questions: 30, status: 'live' },
        { subject: 'JavaScript', display_name: 'JavaScript', description: 'Modern JS: ES6+, async/await, DOM, closures, and more',                 total_questions: 25, status: 'live' },
        { subject: 'SQL',        display_name: 'SQL',        description: 'SQL fundamentals: SELECT, JOINs, aggregates, subqueries',               total_questions: 25, status: 'live' },
        { subject: 'HTML & CSS', display_name: 'HTML & CSS', description: 'HTML structure, CSS selectors, layout, responsive design',              total_questions: 20, status: 'live' },
    ];

    return (
        <div style={{ minHeight: '100vh', background: '#fff', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
            {/* ── Nav ── */}
            <nav style={{ borderBottom: '1px solid #f1f5f9', padding: '0 32px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, background: '#fff', zIndex: 50 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Logo size={32} />
                    <span style={{ fontWeight: 800, fontSize: '1.15rem', color: '#0f172a', letterSpacing: '-0.03em' }}>examifyr</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '13px', color: '#64748b' }}>No sign-up required</span>
                    <button
                        onClick={() => handleSelectSubject('Python')}
                        style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', padding: '9px 20px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}
                    >
                        Start Free Test →
                    </button>
                </div>
            </nav>

            {/* ── Hero ── */}
            <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '72px 32px 80px', display: 'flex', alignItems: 'center', gap: '60px', flexWrap: 'wrap' }}>
                {/* Left copy */}
                <div style={{ flex: '1', minWidth: '300px' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', borderRadius: '999px', padding: '5px 14px', fontSize: '12px', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '24px' }}>
                        ✦ Exam Readiness Platform
                    </div>
                    <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: '20px' }}>
                        Know if you&apos;re ready<br />before you sit the exam.
                    </h1>
                    <p style={{ fontSize: '1.1rem', color: '#64748b', lineHeight: 1.7, marginBottom: '36px', maxWidth: '420px' }}>
                        Answer real exam-style questions, get a readiness score, and find out exactly which topics to fix — in under 20 minutes.
                    </p>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '36px' }}>
                        <button onClick={() => handleSelectSubject('Python')} style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: '10px', padding: '14px 28px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', letterSpacing: '-0.01em' }}>
                            Start Free Test
                        </button>
                        <button onClick={() => document.getElementById('subjects')?.scrollIntoView({ behavior: 'smooth' })} style={{ background: '#f8fafc', color: '#374151', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px 28px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer' }}>
                            View subjects
                        </button>
                    </div>
                    <div style={{ display: 'flex', gap: '28px' }}>
                        {[{ n: '100+', l: 'Questions' }, { n: '4', l: 'Subjects' }, { n: 'Free', l: 'No sign-up' }].map(({ n, l }) => (
                            <div key={l}>
                                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.03em' }}>{n}</div>
                                <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>{l}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right — CSS score card mockup */}
                <div style={{ flex: '0 0 auto', position: 'relative' }}>
                    <div style={{ background: '#fff', borderRadius: '20px', padding: '28px', boxShadow: '0 24px 64px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.06)', width: '300px', border: '1px solid #f1f5f9' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                            <span style={{ fontSize: '18px' }}>🐍</span>
                            <div>
                                <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>Python Readiness</div>
                                <div style={{ fontSize: '11px', color: '#94a3b8' }}>Hard · 30 questions</div>
                            </div>
                        </div>
                        <div style={{ textAlign: 'center', padding: '20px 0 16px', background: '#f0fdf4', borderRadius: '12px', marginBottom: '16px' }}>
                            <div style={{ fontSize: '3.5rem', fontWeight: 800, color: '#15803d', lineHeight: 1, letterSpacing: '-0.04em' }}>85</div>
                            <div style={{ fontSize: '12px', color: '#15803d', marginTop: '4px' }}>out of 100</div>
                            <div style={{ display: 'inline-block', background: '#bbf7d0', color: '#15803d', borderRadius: '6px', padding: '3px 12px', fontSize: '12px', fontWeight: 700, marginTop: '8px' }}>Exam Ready</div>
                        </div>
                        {[
                            { t: 'Python Basics',   p: 92, ok: true  },
                            { t: 'Control Flow',    p: 78, ok: true  },
                            { t: 'Data Structures', p: 85, ok: true  },
                            { t: 'Functions',       p: 52, ok: false },
                        ].map(({ t, p, ok }) => (
                            <div key={t} style={{ marginBottom: '10px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                    <span style={{ fontSize: '11px', color: '#64748b' }}>{t}</span>
                                    <span style={{ fontSize: '11px', fontWeight: 700, color: ok ? '#15803d' : '#b91c1c' }}>{p}%</span>
                                </div>
                                <div style={{ height: '5px', background: '#f1f5f9', borderRadius: '999px' }}>
                                    <div style={{ height: '5px', width: `${p}%`, background: ok ? '#22c55e' : '#ef4444', borderRadius: '999px' }} />
                                </div>
                            </div>
                        ))}
                        <div style={{ marginTop: '14px', padding: '10px 12px', background: '#fef2f2', borderRadius: '8px', fontSize: '11px', color: '#b91c1c', fontWeight: 500 }}>
                            ⚠ Weak area: Functions &amp; Scope
                        </div>
                    </div>
                    <div style={{ position: 'absolute', top: '-12px', right: '-12px', background: '#2563eb', color: '#fff', borderRadius: '10px', padding: '8px 14px', fontSize: '12px', fontWeight: 700, boxShadow: '0 4px 12px rgba(37,99,235,0.4)' }}>
                        Instant results ⚡
                    </div>
                </div>
            </section>

            {/* ── How it works ── */}
            <section id="how-it-works" style={{ background: '#f8fafc', borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9', padding: '72px 32px' }}>
                <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                    <p style={{ fontSize: '12px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', textAlign: 'center', marginBottom: '12px' }}>How it works</p>
                    <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.03em', textAlign: 'center', marginBottom: '48px' }}>
                        From zero to clarity in 3 steps
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
                        {[
                            { step: '01', title: 'Pick your subject', desc: 'Choose from Python, JavaScript, SQL, or HTML & CSS. Select your difficulty level — Easy, Medium, or Full test.' },
                            { step: '02', title: 'Answer questions', desc: 'Work through real exam-style questions one at a time. Get instant feedback and explanations after each answer.' },
                            { step: '03', title: 'Get your score',    desc: 'See your readiness score, pass likelihood, and a breakdown of every topic — know exactly what to study next.' },
                        ].map(({ step, title, desc }) => (
                            <div key={step} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '28px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                                <div style={{ fontSize: '12px', fontWeight: 800, color: '#2563eb', letterSpacing: '0.08em', marginBottom: '12px' }}>{step}</div>
                                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>{title}</h3>
                                <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.65 }}>{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Subject cards ── */}
            <section id="subjects" style={{ maxWidth: '960px', margin: '0 auto', padding: '72px 32px' }}>
                <p style={{ fontSize: '12px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>4 subjects, 100+ questions</p>
                <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.03em', marginBottom: '8px' }}>Choose your subject</h2>
                <p style={{ fontSize: '0.95rem', color: '#64748b', marginBottom: '36px' }}>All subjects live. No sign-up. Free to take.</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '16px' }}>
                    {displaySubjects.map((s) => (
                        <button
                            key={s.subject}
                            onClick={() => handleSelectSubject(s.subject)}
                            style={{
                                background: '#fff', border: '1.5px solid #e2e8f0',
                                borderRadius: '14px', padding: '24px 20px',
                                cursor: 'pointer', textAlign: 'left',
                                boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                                transition: 'border-color 0.15s, box-shadow 0.15s',
                            }}
                            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#2563eb'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 0 3px #bfdbfe'; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#e2e8f0'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)'; }}
                        >
                            <div style={{ fontSize: '2rem', marginBottom: '12px' }}>{SUBJECT_ICONS[s.subject] ?? '📖'}</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                                <span style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>{s.display_name}</span>
                                <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 7px', borderRadius: '4px', background: '#eff6ff', color: '#1d4ed8' }}>
                                    {s.total_questions}q
                                </span>
                            </div>
                            <p style={{ fontSize: '12px', color: '#94a3b8', lineHeight: 1.5, marginBottom: '16px' }}>{s.description}</p>
                            <div style={{ fontSize: '13px', fontWeight: 600, color: '#2563eb' }}>Start test →</div>
                        </button>
                    ))}
                </div>
            </section>

            {/* ── CTA strip ── */}
            <section style={{ background: '#0f172a', padding: '64px 32px', textAlign: 'center' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', marginBottom: '12px' }}>
                    Ready to find out your score?
                </h2>
                <p style={{ fontSize: '1rem', color: '#94a3b8', marginBottom: '28px' }}>
                    Free. No sign-up. Results in under 20 minutes.
                </p>
                <button onClick={() => handleSelectSubject('Python')} style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: '10px', padding: '15px 36px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer' }}>
                    Start Free Test →
                </button>
            </section>

            {/* ── Footer ── */}
            <footer style={{ borderTop: '1px solid #f1f5f9', padding: '24px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Logo size={20} />
                    <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>examifyr</span>
                </div>
                <p style={{ fontSize: '12px', color: '#94a3b8' }}>© 2026 Examifyr. Know before you go.</p>
            </footer>
        </div>
    );
}
