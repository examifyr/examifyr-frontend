import type { Metadata } from 'next';
import SubjectLandingPage from '@/components/SubjectLandingPage';

export const metadata: Metadata = {
    title: 'Free SQL Practice Test — 25 Questions, Instant Score',
    description: 'Take a free SQL practice test with 25 real exam-style questions. Covers SELECT, JOINs, aggregates, subqueries, and more. Get an instant readiness score — no sign-up required.',
    alternates: { canonical: '/sql-practice-test' },
    openGraph: {
        title: 'Free SQL Practice Test | Examifyr',
        description: '25 SQL questions covering SELECT, WHERE, JOINs, GROUP BY, and subqueries. Find your weak spots and get an instant readiness score.',
        url: 'https://www.examifyr.com/sql-practice-test',
    },
};

export default function SQLPage() {
    return (
        <SubjectLandingPage config={{
            subject: 'SQL',
            icon: '🗄️',
            slug: 'sql-practice-test',
            headline: 'Free SQL Practice Test',
            subheadline: 'Test your SQL knowledge with 25 exam-style questions. Get an instant readiness score, see your weak areas, and know if you\'re ready for your SQL exam or interview.',
            introParagraph: 'This test covers core SQL concepts from basic SELECT queries through to advanced JOINs, subqueries, and constraints. Aligned with what data roles and SQL certifications actually test.',
            topicList: [
                'SELECT & Filtering (WHERE, LIKE, BETWEEN)',
                'Aggregates (COUNT, SUM, AVG, GROUP BY)',
                'HAVING vs WHERE',
                'JOINs (INNER, LEFT, RIGHT)',
                'NULL handling & Constraints',
                'Subqueries & Nested SELECT',
                'ORDER BY & LIMIT',
            ],
            faqs: [
                {
                    q: 'How many questions are in the SQL practice test?',
                    a: 'The full test (Hard mode) has 25 questions across 5 topic areas. Easy mode focuses on SELECT and filtering; Medium adds aggregates and JOINs.',
                },
                {
                    q: 'Which SQL dialect do the questions use?',
                    a: 'Questions use standard SQL syntax (ANSI SQL) that works across PostgreSQL, MySQL, SQLite, and SQL Server. No vendor-specific functions are tested.',
                },
                {
                    q: 'Is this good prep for data analyst or data engineer interviews?',
                    a: 'Yes. SQL is tested in almost every data role interview. This test covers the core concepts that come up most frequently in technical screenings.',
                },
                {
                    q: 'Is it free? Do I need to sign up?',
                    a: 'Completely free, no account needed. Just pick a difficulty and start.',
                },
                {
                    q: 'What do I get at the end?',
                    a: 'An instant readiness score (0–100), your pass likelihood, a topic-by-topic accuracy breakdown, and a list of weak areas so you know exactly what to review.',
                },
            ],
            relatedLinks: [
                { label: 'Python Readiness Test', href: '/python-readiness-test' },
                { label: 'JavaScript Quiz', href: '/javascript-quiz' },
                { label: 'HTML & CSS Quiz', href: '/html-css-quiz' },
            ],
        }} />
    );
}
