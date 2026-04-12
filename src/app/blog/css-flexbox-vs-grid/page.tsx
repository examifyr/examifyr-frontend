import type { Metadata } from 'next';
import BlogLayout from '@/components/BlogLayout';

export const metadata: Metadata = {
    title: 'CSS Flexbox vs Grid: When to Use Which (And What Interviewers Ask)',
    description: 'Flexbox and Grid confuse most front-end beginners. Here\'s a clear breakdown of when to use each — and the questions you\'ll face in interviews.',
    alternates: { canonical: '/blog/css-flexbox-vs-grid' },
    openGraph: {
        title: 'CSS Flexbox vs Grid — When to Use Each | Examifyr',
        description: 'A clear guide to Flexbox vs Grid for front-end interviews — when to use each, the key properties, and common exam questions.',
        url: 'https://www.examifyr.com/blog/css-flexbox-vs-grid',
    },
};

export default function CSSFlexboxPost() {
    return (
        <BlogLayout
            title="CSS Flexbox vs Grid: When to Use Which (And What Interviewers Ask)"
            description="Flexbox and Grid confuse most front-end beginners. Here's a clear breakdown of when to use each — and the questions you'll face in interviews."
            publishedAt="Apr 2026"
            readingTime="5 min"
            subject="HTML & CSS"
            subjectHref="/html-css-quiz"
        >
            <p>&quot;When would you use Flexbox vs Grid?&quot; is one of the most common front-end interview questions. Most beginners either can&apos;t answer it clearly, or give a vague response that doesn&apos;t land.</p>
            <p>Here&apos;s the clear answer — plus the properties and edge cases that show up on exams.</p>

            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#0f172a', marginTop: '40px', marginBottom: '12px', letterSpacing: '-0.02em' }}>The one-line answer</h2>
            <p><strong>Flexbox is for one dimension</strong> (a row OR a column). <strong>Grid is for two dimensions</strong> (rows AND columns at the same time).</p>
            <p>That&apos;s the answer interviewers want to hear first. Everything else is detail.</p>

            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#0f172a', marginTop: '40px', marginBottom: '12px', letterSpacing: '-0.02em' }}>When to use Flexbox</h2>
            <p>Flexbox works along a single axis. It&apos;s ideal for:</p>
            <ul style={{ paddingLeft: '24px', lineHeight: 2 }}>
                <li>Navigation bars (items in a row)</li>
                <li>Centering content (vertically and horizontally)</li>
                <li>Distributing space between items in a line</li>
                <li>Card components where items need to stretch to equal height</li>
            </ul>
            <pre style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderLeft: '3px solid #2563eb', borderRadius: '6px', padding: '16px', fontSize: '0.85rem', color: '#334155', overflowX: 'auto', lineHeight: 1.6 }}>{`.nav {
  display: flex;
  justify-content: space-between;  /* horizontal spacing */
  align-items: center;             /* vertical centering */
}`}</pre>
            <p><strong>Key properties to know:</strong> <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '0.875rem' }}>flex-direction</code>, <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '0.875rem' }}>justify-content</code>, <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '0.875rem' }}>align-items</code>, <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '0.875rem' }}>flex-wrap</code>, <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '0.875rem' }}>flex-grow</code>.</p>

            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#0f172a', marginTop: '40px', marginBottom: '12px', letterSpacing: '-0.02em' }}>When to use Grid</h2>
            <p>Grid controls both rows and columns simultaneously. It&apos;s ideal for:</p>
            <ul style={{ paddingLeft: '24px', lineHeight: 2 }}>
                <li>Page layouts (header, sidebar, main content, footer)</li>
                <li>Card grids where items must align in both directions</li>
                <li>Complex layouts where items span multiple rows or columns</li>
            </ul>
            <pre style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderLeft: '3px solid #2563eb', borderRadius: '6px', padding: '16px', fontSize: '0.85rem', color: '#334155', overflowX: 'auto', lineHeight: 1.6 }}>{`.layout {
  display: grid;
  grid-template-columns: 240px 1fr;   /* sidebar + main */
  grid-template-rows: 64px 1fr 48px; /* header + content + footer */
  gap: 16px;
}`}</pre>
            <p><strong>Key properties to know:</strong> <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '0.875rem' }}>grid-template-columns</code>, <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '0.875rem' }}>grid-template-rows</code>, <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '0.875rem' }}>gap</code>, <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '0.875rem' }}>grid-column</code>, <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '0.875rem' }}>grid-row</code>, <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '0.875rem' }}>fr</code> unit.</p>

            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#0f172a', marginTop: '40px', marginBottom: '12px', letterSpacing: '-0.02em' }}>The exam questions that trip people up</h2>

            <p><strong>Q: What does <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '0.875rem' }}>justify-content</code> do in Flexbox vs Grid?</strong></p>
            <p>In both, it aligns items along the main axis. In Flexbox the main axis defaults to horizontal (row). In Grid it aligns the grid tracks within the container.</p>

            <p style={{ marginTop: '20px' }}><strong>Q: What is the difference between <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '0.875rem' }}>align-items</code> and <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '0.875rem' }}>align-content</code>?</strong></p>
            <p><code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '0.875rem' }}>align-items</code> aligns items within a single row/line. <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '0.875rem' }}>align-content</code> aligns multiple rows/lines within the container. It only has an effect when items wrap.</p>

            <p style={{ marginTop: '20px' }}><strong>Q: What does <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '0.875rem' }}>1fr</code> mean in Grid?</strong></p>
            <p><code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '0.875rem' }}>fr</code> stands for &quot;fraction of remaining space&quot;. <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '0.875rem' }}>grid-template-columns: 1fr 2fr</code> means the second column gets twice the space of the first.</p>

            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#0f172a', marginTop: '40px', marginBottom: '12px', letterSpacing: '-0.02em' }}>Can you use both at the same time?</h2>
            <p>Yes — and this is a good answer to give in interviews. Use Grid for the overall page layout, Flexbox for components within each grid area. They&apos;re complementary, not competing.</p>
            <pre style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderLeft: '3px solid #2563eb', borderRadius: '6px', padding: '16px', fontSize: '0.85rem', color: '#334155', overflowX: 'auto', lineHeight: 1.6 }}>{`/* Grid for page layout */
.page { display: grid; grid-template-columns: 240px 1fr; }

/* Flexbox for nav inside the header */
.nav { display: flex; justify-content: space-between; }`}</pre>

            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#0f172a', marginTop: '40px', marginBottom: '12px', letterSpacing: '-0.02em' }}>See how you score under test conditions</h2>
            <p>CSS layout questions feel different when you&apos;re timed and can&apos;t look anything up. The Examifyr HTML & CSS quiz tests you on Flexbox, Grid, selectors, and responsive design — and shows you exactly which concepts you need to revisit.</p>
        </BlogLayout>
    );
}
