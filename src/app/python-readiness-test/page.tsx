import type { Metadata } from 'next';
import SubjectLandingPage from '@/components/SubjectLandingPage';

export const metadata: Metadata = {
    title: 'Free Python Readiness Test — 30 Questions, Instant Score',
    description: 'Take a free 30-question Python readiness test. Get a score from 0–100, find your weak topics, and know if you\'re ready for your Python exam or interview — no sign-up required.',
    alternates: { canonical: '/python-readiness-test' },
    openGraph: {
        title: 'Free Python Readiness Test | Examifyr',
        description: 'Answer 30 Python exam-style questions and get an instant readiness score. Covers basics, data structures, OOP, functions, and more.',
        url: 'https://www.examifyr.com/python-readiness-test',
    },
};

export default function PythonPage() {
    return (
        <SubjectLandingPage config={{
            subject: 'Python',
            icon: '🐍',
            slug: 'python-readiness-test',
            headline: 'Free Python Readiness Test',
            subheadline: 'Find out if you\'re ready for your Python exam, certification, or job interview. 30 questions, instant score, no sign-up required.',
            introParagraph: 'This test covers the full Python beginner-to-intermediate syllabus. Questions are modelled on real certification and job-screening exams.',
            topicList: [
                'Python Basics & Syntax',
                'Control Flow (if / for / while)',
                'Data Structures (lists, dicts, sets)',
                'Functions & Scope',
                'Error Handling (try/except)',
                'OOP Basics (classes, inheritance)',
            ],
            faqs: [
                {
                    q: 'How many questions are in the Python readiness test?',
                    a: 'The full test (Hard mode) has 30 questions across 6 topics. Easy mode gives you 7 questions; Medium mode gives you 20.',
                },
                {
                    q: 'What does the readiness score mean?',
                    a: 'Your score is a number from 0 to 100. 85–100 = Exam Ready, 70–84 = Almost Ready, 50–69 = At Risk, 0–49 = Not Ready. Each band comes with a pass likelihood percentage.',
                },
                {
                    q: 'Is this test good preparation for PCEP or PCAP certification?',
                    a: 'Yes. The questions are aligned with the kind of syntax, data-type, and control-flow knowledge tested in Python Institute certifications (PCEP, PCAP).',
                },
                {
                    q: 'Is it free? Do I need to sign up?',
                    a: 'Completely free, no account needed. Just pick a difficulty and start.',
                },
                {
                    q: 'What happens after I finish?',
                    a: 'You get an instant readiness score, your pass likelihood, a topic-by-topic accuracy breakdown, and a list of your weak areas so you know exactly what to study next.',
                },
            ],
            relatedLinks: [
                { label: 'JavaScript Quiz', href: '/javascript-quiz' },
                { label: 'SQL Practice Test', href: '/sql-practice-test' },
                { label: 'HTML & CSS Quiz', href: '/html-css-quiz' },
            ],
        }} />
    );
}
