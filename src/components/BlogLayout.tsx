import Link from 'next/link';

interface BlogLayoutProps {
    title: string;
    description: string;
    publishedAt: string;
    readingTime: string;
    subject: string;
    subjectHref: string;
    children: React.ReactNode;
}

export default function BlogLayout({ title, description, publishedAt, readingTime, subject, subjectHref, children }: BlogLayoutProps) {
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
                <Link href={subjectHref} style={{ background: '#2563eb', color: '#fff', borderRadius: '8px', padding: '9px 20px', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}>
                    Take the {subject} test →
                </Link>
            </nav>

            {/* Article */}
            <article style={{ maxWidth: '720px', margin: '0 auto', padding: '56px 32px 96px' }}>
                {/* Breadcrumb */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#94a3b8', marginBottom: '28px' }}>
                    <Link href="/" style={{ color: '#94a3b8', textDecoration: 'none' }}>Home</Link>
                    <span>›</span>
                    <Link href="/blog" style={{ color: '#94a3b8', textDecoration: 'none' }}>Blog</Link>
                    <span>›</span>
                    <span style={{ color: '#64748b' }}>{subject}</span>
                </div>

                {/* Header */}
                <header style={{ marginBottom: '40px' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', borderRadius: '999px', padding: '4px 12px', fontSize: '12px', fontWeight: 600, marginBottom: '16px' }}>
                        {subject}
                    </div>
                    <h1 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: '16px' }}>
                        {title}
                    </h1>
                    <p style={{ fontSize: '1.1rem', color: '#64748b', lineHeight: 1.65, marginBottom: '20px' }}>
                        {description}
                    </p>
                    <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: '#94a3b8', borderBottom: '1px solid #f1f5f9', paddingBottom: '20px' }}>
                        <span>Examifyr</span>
                        <span>·</span>
                        <span>{publishedAt}</span>
                        <span>·</span>
                        <span>{readingTime} read</span>
                    </div>
                </header>

                {/* Body */}
                <div style={{ fontSize: '1rem', lineHeight: 1.8, color: '#334155' }}>
                    {children}
                </div>

                {/* CTA */}
                <div style={{ marginTop: '56px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '16px', padding: '32px', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', marginBottom: '12px' }}>🎯</div>
                    <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', marginBottom: '8px' }}>
                        Think you&apos;re ready? Prove it.
                    </h2>
                    <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '20px', lineHeight: 1.6 }}>
                        Take the free {subject} readiness test. Get a score from 0–100, a topic breakdown, and your exact weak areas — in under 20 minutes.
                    </p>
                    <Link href={subjectHref} style={{ display: 'inline-block', background: '#2563eb', color: '#fff', borderRadius: '10px', padding: '12px 28px', fontSize: '0.95rem', fontWeight: 700, textDecoration: 'none' }}>
                        Take the free {subject} test →
                    </Link>
                    <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '10px' }}>Free · No sign-up · Instant results</p>
                </div>

                {/* Related posts */}
                <div style={{ marginTop: '48px', borderTop: '1px solid #f1f5f9', paddingTop: '32px' }}>
                    <p style={{ fontSize: '12px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '16px' }}>More from Examifyr</p>
                    <Link href="/blog" style={{ color: '#2563eb', fontSize: '0.9rem', textDecoration: 'none', fontWeight: 500 }}>← All articles</Link>
                </div>
            </article>

            {/* Footer */}
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
