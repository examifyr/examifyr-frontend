import type { Metadata } from 'next';
import SubjectLandingPage from '@/components/SubjectLandingPage';

export const metadata: Metadata = {
    title: 'Free JavaScript Quiz — Test Your JS Skills (25 Questions)',
    description: 'Take a free JavaScript quiz with 25 real exam-style questions. Covers ES6+, async/await, closures, DOM, and more. Get an instant readiness score — no sign-up required.',
    alternates: { canonical: '/javascript-quiz' },
    openGraph: {
        title: 'Free JavaScript Quiz | Examifyr',
        description: '25 JavaScript questions covering ES6+, closures, async/await, and the DOM. Find your weak spots and get an instant readiness score.',
        url: 'https://www.examifyr.com/javascript-quiz',
    },
};

export default function JavaScriptPage() {
    return (
        <SubjectLandingPage config={{
            subject: 'JavaScript',
            icon: '⚡',
            slug: 'javascript-quiz',
            headline: 'Free JavaScript Quiz',
            subheadline: 'Test your JavaScript knowledge with 25 exam-style questions. Get an instant score, find your weak spots, and know if you\'re job-ready — no sign-up required.',
            introParagraph: 'This quiz covers modern JavaScript from fundamentals to ES6+ features. Questions are based on what employers and certification bodies actually test.',
            topicList: [
                'Variables & Types (var/let/const)',
                'Functions & Closures',
                'Arrays & Objects',
                'Async/Await & Promises',
                'ES6+ Features',
                'DOM & Event Handling',
                'Error Handling',
            ],
            faqs: [
                {
                    q: 'How many questions are in the JavaScript quiz?',
                    a: 'The full test (Hard mode) has 25 questions. Easy mode gives you beginner-level questions only; Medium mode adds intermediate questions.',
                },
                {
                    q: 'What JavaScript version do the questions cover?',
                    a: 'Questions cover modern JavaScript (ES6 and beyond), including arrow functions, destructuring, Promises, async/await, spread/rest operators, and modules.',
                },
                {
                    q: 'Is this quiz good for job interview prep?',
                    a: 'Yes. The questions reflect what JavaScript engineers are commonly tested on in technical screening rounds at software companies.',
                },
                {
                    q: 'Is it free? Do I need to sign up?',
                    a: 'Completely free, no account needed. Just pick a difficulty and start.',
                },
                {
                    q: 'What do I get at the end?',
                    a: 'An instant readiness score (0–100), pass likelihood, a topic-by-topic accuracy breakdown, and a list of weak areas to focus on.',
                },
            ],
            relatedLinks: [
                { label: 'Python Readiness Test', href: '/python-readiness-test' },
                { label: 'SQL Practice Test', href: '/sql-practice-test' },
                { label: 'HTML & CSS Quiz', href: '/html-css-quiz' },
            ],
        }} />
    );
}
