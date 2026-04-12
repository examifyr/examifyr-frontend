import type { Metadata } from 'next';
import BlogLayout from '@/components/BlogLayout';

export const metadata: Metadata = {
    title: '5 Python Concepts You Must Know Before Your Exam',
    description: 'Most Python beginners skip these five areas — and they show up on every exam. Here\'s what to study and how to spot gaps before test day.',
    alternates: { canonical: '/blog/python-concepts-before-exam' },
    openGraph: {
        title: '5 Python Concepts You Must Know Before Your Exam | Examifyr',
        description: 'The five Python topics that appear on every exam — and how to make sure you\'re ready for each one.',
        url: 'https://www.examifyr.com/blog/python-concepts-before-exam',
    },
};

export default function PythonConceptsPost() {
    return (
        <BlogLayout
            title="5 Python Concepts You Must Know Before Your Exam"
            description="Most Python beginners skip these five areas — and they show up on every exam. Here's what to study and how to spot gaps before test day."
            publishedAt="Apr 2026"
            readingTime="5 min"
            subject="Python"
            subjectHref="/python-readiness-test"
        >
            <p>You&apos;ve been learning Python for a few weeks or months. You feel comfortable writing code. But when exam day comes, most people find out there are gaps they didn&apos;t know existed.</p>
            <p>Here are the five Python concepts that catch people off guard most often — and what you need to know about each one.</p>

            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#0f172a', marginTop: '40px', marginBottom: '12px', letterSpacing: '-0.02em' }}>1. Mutability and how it affects function arguments</h2>
            <p>Python has mutable types (lists, dicts, sets) and immutable types (strings, tuples, integers). This becomes critical when you pass objects to functions.</p>
            <pre style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderLeft: '3px solid #2563eb', borderRadius: '6px', padding: '16px', fontSize: '0.85rem', color: '#334155', overflowX: 'auto', lineHeight: 1.6 }}>{`def add_item(item, lst=[]):
    lst.append(item)
    return lst

print(add_item(1))  # [1]
print(add_item(2))  # [1, 2] — not [2]!`}</pre>
            <p>The default mutable argument is created once and shared across calls. This is one of the most common exam traps.</p>
            <p><strong>What to know:</strong> Always use <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '0.875rem' }}>None</code> as the default for mutable arguments and initialise inside the function.</p>

            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#0f172a', marginTop: '40px', marginBottom: '12px', letterSpacing: '-0.02em' }}>2. How Python resolves variable scope (LEGB)</h2>
            <p>Python looks up variables in this order: <strong>L</strong>ocal → <strong>E</strong>nclosing → <strong>G</strong>lobal → <strong>B</strong>uilt-in. Most people know local vs global, but the enclosing scope (closures) catches people out.</p>
            <pre style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderLeft: '3px solid #2563eb', borderRadius: '6px', padding: '16px', fontSize: '0.85rem', color: '#334155', overflowX: 'auto', lineHeight: 1.6 }}>{`x = 10

def outer():
    x = 20
    def inner():
        print(x)  # prints 20, not 10
    inner()

outer()`}</pre>
            <p><strong>What to know:</strong> The difference between <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '0.875rem' }}>global</code> and <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '0.875rem' }}>nonlocal</code>, and when each is needed.</p>

            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#0f172a', marginTop: '40px', marginBottom: '12px', letterSpacing: '-0.02em' }}>3. List comprehensions vs generator expressions</h2>
            <p>These look almost identical but behave very differently in terms of memory.</p>
            <pre style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderLeft: '3px solid #2563eb', borderRadius: '6px', padding: '16px', fontSize: '0.85rem', color: '#334155', overflowX: 'auto', lineHeight: 1.6 }}>{`# List comprehension — builds entire list in memory
squares = [x**2 for x in range(1000000)]

# Generator — yields one value at a time
squares = (x**2 for x in range(1000000))`}</pre>
            <p><strong>What to know:</strong> Generators use <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '0.875rem' }}>()</code> not <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '0.875rem' }}>[]</code>. They&apos;re lazy — values are produced one at a time. You can only iterate through them once.</p>

            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#0f172a', marginTop: '40px', marginBottom: '12px', letterSpacing: '-0.02em' }}>4. Exception handling — what actually gets caught</h2>
            <p>Most people understand <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '0.875rem' }}>try/except</code> basics, but exam questions go deeper.</p>
            <pre style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderLeft: '3px solid #2563eb', borderRadius: '6px', padding: '16px', fontSize: '0.85rem', color: '#334155', overflowX: 'auto', lineHeight: 1.6 }}>{`try:
    result = 10 / 0
except ZeroDivisionError:
    print("caught")
else:
    print("no exception")   # runs only if no exception
finally:
    print("always runs")    # runs no matter what`}</pre>
            <p><strong>What to know:</strong> The purpose of <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '0.875rem' }}>else</code> (no exception occurred) and <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '0.875rem' }}>finally</code> (always runs, even with a return statement).</p>

            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#0f172a', marginTop: '40px', marginBottom: '12px', letterSpacing: '-0.02em' }}>5. Truthiness — what evaluates to False</h2>
            <p>Python has a clear set of falsy values. Knowing them is essential for reading and writing idiomatic Python.</p>
            <pre style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderLeft: '3px solid #2563eb', borderRadius: '6px', padding: '16px', fontSize: '0.85rem', color: '#334155', overflowX: 'auto', lineHeight: 1.6 }}>{`# All of these are falsy:
bool(0)        # False
bool(0.0)      # False
bool("")       # False
bool([])       # False
bool({})       # False
bool(None)     # False

# This trips people up:
bool([0])      # True — non-empty list`}</pre>
            <p><strong>What to know:</strong> Any non-empty container is truthy, even if its contents are falsy. <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '0.875rem' }}>[0]</code>, <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '0.875rem' }}>{'{0}'}</code>, and <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '0.875rem' }}>"0"</code> are all truthy.</p>

            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#0f172a', marginTop: '40px', marginBottom: '12px', letterSpacing: '-0.02em' }}>How to know if you&apos;ve actually got these down</h2>
            <p>Reading about a concept feels different from being tested on it under exam conditions. The best way to find out where your real gaps are is to take a timed, scored practice test — one that shows you topic-by-topic where you&apos;re strong and where you&apos;re not.</p>
            <p>That&apos;s exactly what the Examifyr Python readiness test does. 30 questions, instant score, topic breakdown — free, no sign-up.</p>
        </BlogLayout>
    );
}
