'use client';

import { useRouter } from 'next/navigation';

export interface SubjectPageConfig {
    subject: string;           // exact subject name used in API: "Python", "JavaScript", etc.
    icon: string;
    slug: string;              // URL slug e.g. "python-readiness-test"
    headline: string;
    subheadline: string;
    introParagraph: string;
    topicList: string[];
    faqs: { q: string; a: string }[];
    relatedLinks: { label: string; href: string }[];
}

export default function SubjectLandingPage({ config }: { config: SubjectPageConfig }) {
    const router = useRouter();

    const handleStart = (difficulty: 'easy' | 'medium' | 'hard') => {
        // Store subject + difficulty in sessionStorage, then go to homepage quiz
        sessionStorage.setItem('examifyr_subject', config.subject);
        sessionStorage.setItem('examifyr_difficulty', difficulty);
        router.push('/?autostart=1');
    };

    return (
        <div style={{ minHeight: '100vh', background: '#fff', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', color: '#0f172a' }}>
            {/* Nav */}
            <nav style={{ borderBottom: '1px solid #f1f5f9', padding: '0 32px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, background: '#fff', zIndex: 50 }}>
                <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
                    <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                        <rect width="32" height="32" rx="8" fill="#2563eb"/>
                        <path d="M8 17l5 5 11-11" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#0f172a', letterSpacing: '-0.03em' }}>examifyr</span>
                </a>
                <button
                    onClick={() => handleStart('hard')}
                    style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', padding: '9px 20px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}
                >
                    Start Free Test →
                </button>
            </nav>

            {/* Hero */}
            <section style={{ maxWidth: '800px', margin: '0 auto', padding: '64px 32px 56px' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', borderRadius: '999px', padding: '5px 14px', fontSize: '12px', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '24px' }}>
                    Free · No sign-up required
                </div>
                <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: '16px' }}>
                    {config.icon} {config.headline}
                </h1>
                <p style={{ fontSize: '1.1rem', color: '#64748b', lineHeight: 1.7, marginBottom: '36px', maxWidth: '560px' }}>
                    {config.subheadline}
                </p>

                {/* Difficulty CTA cards */}
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '48px' }}>
                    {([
                        { key: 'easy'   as const, label: 'Easy',   desc: 'Beginner-friendly',    color: '#15803d', bg: '#f0fdf4', border: '#bbf7d0' },
                        { key: 'medium' as const, label: 'Medium', desc: 'Core concepts',         color: '#b45309', bg: '#fffbeb', border: '#fde68a' },
                        { key: 'hard'   as const, label: 'Hard',   desc: 'Full readiness test',   color: '#b91c1c', bg: '#fef2f2', border: '#fecaca' },
                    ]).map(({ key, label, desc, color, bg, border }) => (
                        <button
                            key={key}
                            onClick={() => handleStart(key)}
                            style={{ background: bg, border: `1.5px solid ${border}`, borderRadius: '12px', padding: '16px 24px', cursor: 'pointer', textAlign: 'left', minWidth: '140px' }}
                        >
                            <div style={{ fontSize: '0.95rem', fontWeight: 700, color, marginBottom: '3px' }}>{label}</div>
                            <div style={{ fontSize: '12px', color: '#64748b' }}>{desc}</div>
                        </button>
                    ))}
                </div>

                <div style={{ display: 'flex', gap: '24px', fontSize: '13px', color: '#94a3b8' }}>
                    <span>✓ Instant results</span>
                    <span>✓ Topic breakdown</span>
                    <span>✓ Weak area detection</span>
                    <span>✓ Pass likelihood</span>
                </div>
            </section>

            {/* What's covered */}
            <section style={{ background: '#f8fafc', borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9', padding: '56px 32px' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.03em', marginBottom: '8px' }}>
                        What this test covers
                    </h2>
                    <p style={{ color: '#64748b', marginBottom: '28px', fontSize: '0.95rem' }}>{config.introParagraph}</p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
                        {config.topicList.map((topic) => (
                            <div key={topic} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.875rem', color: '#334155', fontWeight: 500 }}>
                                <span style={{ color: '#2563eb', fontWeight: 700 }}>✓</span> {topic}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How it works */}
            <section style={{ maxWidth: '800px', margin: '0 auto', padding: '56px 32px' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.03em', marginBottom: '32px' }}>How it works</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                    {[
                        { step: '01', title: 'Pick your difficulty', desc: 'Choose Easy, Medium, or Full test depending on where you are in your learning.' },
                        { step: '02', title: 'Answer questions',     desc: 'One question at a time. Click an answer and get instant feedback with a full explanation.' },
                        { step: '03', title: 'Get your score',       desc: 'See your readiness score (0–100), pass likelihood, and a topic-by-topic breakdown.' },
                    ].map(({ step, title, desc }) => (
                        <div key={step} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '24px' }}>
                            <div style={{ fontSize: '11px', fontWeight: 800, color: '#2563eb', letterSpacing: '0.08em', marginBottom: '10px' }}>{step}</div>
                            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>{title}</h3>
                            <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.6 }}>{desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* FAQ — structured data friendly */}
            <section style={{ background: '#f8fafc', borderTop: '1px solid #f1f5f9', padding: '56px 32px' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.03em', marginBottom: '32px' }}>
                        Frequently asked questions
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {config.faqs.map(({ q, a }) => (
                            <div key={q} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '22px 24px' }}>
                                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>{q}</h3>
                                <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.65, margin: 0 }}>{a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA strip */}
            <section style={{ background: '#0f172a', padding: '56px 32px', textAlign: 'center' }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', marginBottom: '12px' }}>
                    Ready to find out your score?
                </h2>
                <p style={{ fontSize: '0.95rem', color: '#94a3b8', marginBottom: '24px' }}>Free. No sign-up. Results in under 20 minutes.</p>
                <button onClick={() => handleStart('hard')} style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: '10px', padding: '14px 32px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer' }}>
                    Start Free Test →
                </button>
            </section>

            {/* Related links */}
            <footer style={{ borderTop: '1px solid #f1f5f9', padding: '24px 32px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
                        <rect width="32" height="32" rx="8" fill="#2563eb"/>
                        <path d="M8 17l5 5 11-11" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>examifyr</span>
                </div>
                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                    {config.relatedLinks.map(({ label, href }) => (
                        <a key={href} href={href} style={{ fontSize: '13px', color: '#64748b', textDecoration: 'none' }}>{label}</a>
                    ))}
                    <a href="/" style={{ fontSize: '13px', color: '#64748b', textDecoration: 'none' }}>All subjects</a>
                </div>
                <p style={{ fontSize: '12px', color: '#94a3b8' }}>© 2026 Examifyr</p>
            </footer>
        </div>
    );
}
