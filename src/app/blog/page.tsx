import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Blog — Coding Exam Tips & Study Guides',
    description: 'Free guides to help you prepare for Python, JavaScript, SQL, and HTML & CSS exams and interviews. Know exactly what to study and when you\'re ready.',
    alternates: { canonical: '/blog' },
};

const POSTS = [
    {
        slug: 'python-concepts-before-exam',
        subject: 'Python',
        icon: '🐍',
        title: '5 Python Concepts You Must Know Before Your Exam',
        description: 'Most Python beginners skip these five areas — and they show up on every exam. Here\'s what to study and how to spot gaps before test day.',
        readingTime: '5 min',
        publishedAt: 'Apr 2026',
    },
    {
        slug: 'sql-join-mistakes',
        subject: 'SQL',
        icon: '🗄️',
        title: 'The Most Common SQL JOIN Mistakes (And How to Avoid Them)',
        description: 'JOINs are where most SQL beginners lose marks. Here are the mistakes that come up most often in exams and interviews — with clear fixes.',
        readingTime: '6 min',
        publishedAt: 'Apr 2026',
    },
    {
        slug: 'javascript-es6-interview',
        subject: 'JavaScript',
        icon: '⚡',
        title: 'JavaScript ES6+ Features You\'ll Be Tested On in Any Interview',
        description: 'Modern JavaScript interviews expect you to know ES6+ cold. Here are the features that come up most, with examples of exactly how they\'re tested.',
        readingTime: '6 min',
        publishedAt: 'Apr 2026',
    },
    {
        slug: 'css-flexbox-vs-grid',
        subject: 'HTML & CSS',
        icon: '🎨',
        title: 'CSS Flexbox vs Grid: When to Use Which (And What Interviewers Ask)',
        description: 'Flexbox and Grid confuse most front-end beginners. Here\'s a clear breakdown of when to use each — and the questions you\'ll face in interviews.',
        readingTime: '5 min',
        publishedAt: 'Apr 2026',
    },
];

export default function BlogIndex() {
    return (
        <div style={{ minHeight: '100vh', background: '#fff', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', color: '#0f172a' }}>
            {/* Nav */}
            <nav style={{ borderBottom: '1px solid #f1f5f9', padding: '0 32px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, background: '#fff', zIndex: 50 }}>
                <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
                    <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                        <rect width="32" height="32" rx="8" fill="#2563eb"/>
                        <path d="M8 17l5 5 11-11" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#0f172a', letterSpacing: '-0.03em' }}>examifyr</span>
                </Link>
                <Link href="/" style={{ background: '#2563eb', color: '#fff', borderRadius: '8px', padding: '9px 20px', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}>
                    Take a free test →
                </Link>
            </nav>

            <main style={{ maxWidth: '800px', margin: '0 auto', padding: '56px 32px 96px' }}>
                <div style={{ marginBottom: '48px' }}>
                    <p style={{ fontSize: '12px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>Examifyr Blog</p>
                    <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.04em', marginBottom: '12px' }}>
                        Study smarter. Score higher.
                    </h1>
                    <p style={{ fontSize: '1rem', color: '#64748b', lineHeight: 1.65 }}>
                        Practical guides to help you prepare for coding exams and technical interviews — and know exactly when you&apos;re ready.
                    </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {POSTS.map((post) => (
                        <Link
                            key={post.slug}
                            href={`/blog/${post.slug}`}
                            style={{ textDecoration: 'none', display: 'block', background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: '14px', padding: '28px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', transition: 'border-color 0.15s' }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                                <span style={{ fontSize: '1.2rem' }}>{post.icon}</span>
                                <span style={{ fontSize: '11px', fontWeight: 700, color: '#1d4ed8', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '999px', padding: '2px 10px' }}>{post.subject}</span>
                                <span style={{ fontSize: '12px', color: '#94a3b8' }}>· {post.readingTime} read · {post.publishedAt}</span>
                            </div>
                            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.02em', marginBottom: '8px', lineHeight: 1.3 }}>
                                {post.title}
                            </h2>
                            <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.65, margin: 0 }}>
                                {post.description}
                            </p>
                            <div style={{ marginTop: '16px', fontSize: '13px', fontWeight: 600, color: '#2563eb' }}>Read article →</div>
                        </Link>
                    ))}
                </div>
            </main>

            <footer style={{ borderTop: '1px solid #f1f5f9', padding: '24px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
                    <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
                        <rect width="32" height="32" rx="8" fill="#2563eb"/>
                        <path d="M8 17l5 5 11-11" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>examifyr</span>
                </Link>
                <p style={{ fontSize: '12px', color: '#94a3b8' }}>© 2026 Examifyr. Know before you go.</p>
            </footer>
        </div>
    );
}
