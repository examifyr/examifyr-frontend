import type { Metadata } from 'next';
import SubjectLandingPage from '@/components/SubjectLandingPage';

export const metadata: Metadata = {
    title: 'Free HTML & CSS Quiz — 20 Questions, Instant Score',
    description: 'Take a free HTML & CSS quiz with 20 real exam-style questions. Covers semantic HTML, Flexbox, Grid, selectors, and responsive design. Get an instant score — no sign-up required.',
    alternates: { canonical: '/html-css-quiz' },
    openGraph: {
        title: 'Free HTML & CSS Quiz | Examifyr',
        description: '20 HTML & CSS questions covering semantic markup, Flexbox, Grid, and responsive design. Find your weak spots and get an instant readiness score.',
        url: 'https://www.examifyr.com/html-css-quiz',
    },
};

export default function HTMLCSSPage() {
    return (
        <SubjectLandingPage config={{
            subject: 'HTML & CSS',
            icon: '🎨',
            slug: 'html-css-quiz',
            headline: 'Free HTML & CSS Quiz',
            subheadline: 'Test your HTML and CSS knowledge with 20 exam-style questions. Get an instant readiness score, find your weak areas, and know if you\'re ready for your front-end interview or exam.',
            introParagraph: 'This quiz covers HTML structure and CSS layout from foundational markup to modern Flexbox and Grid. Ideal for front-end developer roles and web design certifications.',
            topicList: [
                'Semantic HTML (article, section, nav)',
                'HTML Forms & Input Types',
                'CSS Selectors & Specificity',
                'Box Model (margin, padding, border)',
                'Flexbox Layout',
                'CSS Grid',
                'Responsive Design & Media Queries',
                'CSS Variables & Custom Properties',
            ],
            faqs: [
                {
                    q: 'How many questions are in the HTML & CSS quiz?',
                    a: 'The full test (Hard mode) has 20 questions. Easy mode covers HTML basics and simple CSS; Medium adds layout and intermediate CSS concepts.',
                },
                {
                    q: 'Does this quiz cover Flexbox and Grid?',
                    a: 'Yes. Both Flexbox and CSS Grid are covered in the medium and hard difficulty levels, including common layout patterns and gotchas.',
                },
                {
                    q: 'Is this good preparation for a front-end developer interview?',
                    a: 'Yes. HTML and CSS fundamentals are tested in almost every front-end screening. This quiz covers the core concepts that come up most often.',
                },
                {
                    q: 'Is it free? Do I need to sign up?',
                    a: 'Completely free, no account needed. Just pick a difficulty and start.',
                },
                {
                    q: 'What do I get at the end?',
                    a: 'An instant readiness score (0–100), your pass likelihood, a topic-by-topic accuracy breakdown, and a list of weak areas to focus your revision on.',
                },
            ],
            relatedLinks: [
                { label: 'Python Readiness Test', href: '/python-readiness-test' },
                { label: 'JavaScript Quiz', href: '/javascript-quiz' },
                { label: 'SQL Practice Test', href: '/sql-practice-test' },
            ],
        }} />
    );
}
