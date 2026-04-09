import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Examifyr — Free Coding Readiness Tests';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: '1200px',
                    height: '630px',
                    background: '#0f172a',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    padding: '64px 72px',
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                }}
            >
                {/* Top — logo + badge */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        {/* Logo mark */}
                        <div style={{
                            width: '44px', height: '44px', borderRadius: '10px',
                            background: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
                                <path d="M8 17l5 5 11-11" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <span style={{ fontSize: '28px', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em' }}>
                            examifyr
                        </span>
                    </div>
                    <div style={{
                        background: '#1e293b', border: '1px solid #334155',
                        borderRadius: '999px', padding: '8px 20px',
                        fontSize: '14px', color: '#94a3b8', fontWeight: 500,
                    }}>
                        Free · No sign-up required
                    </div>
                </div>

                {/* Middle — headline + subjects */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ fontSize: '58px', fontWeight: 800, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1.05 }}>
                        Know if you&apos;re ready<br />
                        <span style={{ color: '#2563eb' }}>before you sit the exam.</span>
                    </div>
                    <div style={{ fontSize: '22px', color: '#94a3b8', fontWeight: 400 }}>
                        Instant readiness score · Weak area diagnosis · Pass likelihood
                    </div>
                </div>

                {/* Bottom — subject pills + score preview */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    {/* Subject pills */}
                    <div style={{ display: 'flex', gap: '10px' }}>
                        {['🐍 Python', '⚡ JavaScript', '🗄️ SQL', '🎨 HTML & CSS'].map((s) => (
                            <div key={s} style={{
                                background: '#1e293b', border: '1px solid #334155',
                                borderRadius: '8px', padding: '10px 18px',
                                fontSize: '16px', color: '#e2e8f0', fontWeight: 600,
                            }}>
                                {s}
                            </div>
                        ))}
                    </div>

                    {/* Mini score card */}
                    <div style={{
                        background: '#fff', borderRadius: '16px', padding: '24px 28px',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                        minWidth: '180px',
                    }}>
                        <div style={{ fontSize: '64px', fontWeight: 800, color: '#15803d', lineHeight: 1, letterSpacing: '-0.04em' }}>
                            85
                        </div>
                        <div style={{ fontSize: '13px', color: '#94a3b8', fontWeight: 500 }}>out of 100</div>
                        <div style={{
                            background: '#bbf7d0', color: '#15803d',
                            borderRadius: '6px', padding: '4px 14px',
                            fontSize: '14px', fontWeight: 700,
                        }}>
                            Exam Ready ✓
                        </div>
                    </div>
                </div>
            </div>
        ),
        { width: 1200, height: 630 },
    );
}
