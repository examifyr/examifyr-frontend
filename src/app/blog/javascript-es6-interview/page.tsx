import type { Metadata } from 'next';
import BlogLayout from '@/components/BlogLayout';

export const metadata: Metadata = {
    title: "JavaScript ES6+ Features You'll Be Tested On in Any Interview",
    description: "Modern JavaScript interviews expect you to know ES6+ cold. Here are the features that come up most, with examples of exactly how they're tested.",
    alternates: { canonical: '/blog/javascript-es6-interview' },
    openGraph: {
        title: "JavaScript ES6+ Features Tested in Every Interview | Examifyr",
        description: "The ES6+ JavaScript features that appear in almost every technical interview — with examples of how they're actually tested.",
        url: 'https://www.examifyr.com/blog/javascript-es6-interview',
    },
};

export default function JavaScriptES6Post() {
    return (
        <BlogLayout
            title="JavaScript ES6+ Features You'll Be Tested On in Any Interview"
            description="Modern JavaScript interviews expect you to know ES6+ cold. Here are the features that come up most, with examples of exactly how they're tested."
            publishedAt="Apr 2026"
            readingTime="6 min"
            subject="JavaScript"
            subjectHref="/javascript-quiz"
        >
            <p>If you&apos;re preparing for a JavaScript technical interview, knowing ES6+ is not optional — it&apos;s expected. Interviewers assume modern JS fluency and write questions that expose gaps fast.</p>
            <p>Here are the features that come up most, with the exact kinds of questions you&apos;ll face.</p>

            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#0f172a', marginTop: '40px', marginBottom: '12px', letterSpacing: '-0.02em' }}>1. let, const, and the temporal dead zone</h2>
            <p>Most people know <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '0.875rem' }}>let</code> is block-scoped and <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '0.875rem' }}>const</code> can&apos;t be reassigned. What catches people is the temporal dead zone.</p>
            <pre style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderLeft: '3px solid #2563eb', borderRadius: '6px', padding: '16px', fontSize: '0.85rem', color: '#334155', overflowX: 'auto', lineHeight: 1.6 }}>{`console.log(x); // undefined (var is hoisted)
var x = 5;

console.log(y); // ReferenceError (temporal dead zone)
let y = 5;`}</pre>
            <p><code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '0.875rem' }}>let</code> and <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '0.875rem' }}>const</code> are hoisted but not initialised. Accessing them before declaration throws a ReferenceError.</p>

            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#0f172a', marginTop: '40px', marginBottom: '12px', letterSpacing: '-0.02em' }}>2. Arrow functions and how they handle <code style={{ fontSize: '1.1rem' }}>this</code></h2>
            <p>Arrow functions don&apos;t have their own <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '0.875rem' }}>this</code>. They inherit it from the enclosing scope. This is tested heavily.</p>
            <pre style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderLeft: '3px solid #2563eb', borderRadius: '6px', padding: '16px', fontSize: '0.85rem', color: '#334155', overflowX: 'auto', lineHeight: 1.6 }}>{`const obj = {
  name: 'Examifyr',
  regular: function() { return this.name; },  // 'Examifyr'
  arrow: () => this.name,                     // undefined
};`}</pre>
            <p><strong>What to know:</strong> Never use arrow functions as object methods when you need <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '0.875rem' }}>this</code> to refer to the object. Arrow functions are ideal for callbacks inside methods.</p>

            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#0f172a', marginTop: '40px', marginBottom: '12px', letterSpacing: '-0.02em' }}>3. Destructuring and the rest operator</h2>
            <p>Destructuring is everywhere in modern JS — and interviewers test the edge cases.</p>
            <pre style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderLeft: '3px solid #2563eb', borderRadius: '6px', padding: '16px', fontSize: '0.85rem', color: '#334155', overflowX: 'auto', lineHeight: 1.6 }}>{`// Array destructuring with skip
const [first, , third] = [1, 2, 3];
console.log(third); // 3

// Object rest
const { a, ...rest } = { a: 1, b: 2, c: 3 };
console.log(rest); // { b: 2, c: 3 }

// Default values
const { name = 'Guest' } = {};
console.log(name); // 'Guest'`}</pre>

            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#0f172a', marginTop: '40px', marginBottom: '12px', letterSpacing: '-0.02em' }}>4. Promises and async/await</h2>
            <p>Async code is the most tested area in senior JS interviews. You need to understand both Promises and async/await, and crucially, how errors propagate.</p>
            <pre style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderLeft: '3px solid #2563eb', borderRadius: '6px', padding: '16px', fontSize: '0.85rem', color: '#334155', overflowX: 'auto', lineHeight: 1.6 }}>{`// Promise chain
fetch('/api/data')
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));

// async/await equivalent
async function getData() {
  try {
    const res = await fetch('/api/data');
    const data = await res.json();
    console.log(data);
  } catch (err) {
    console.error(err);
  }
}`}</pre>
            <p><strong>What to know:</strong> <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '0.875rem' }}>await</code> only works inside <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '0.875rem' }}>async</code> functions. A rejected Promise that isn&apos;t caught will throw an unhandled rejection error.</p>

            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#0f172a', marginTop: '40px', marginBottom: '12px', letterSpacing: '-0.02em' }}>5. Closures — the classic interview question</h2>
            <p>Closures come up in almost every JavaScript interview. The classic trap:</p>
            <pre style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderLeft: '3px solid #2563eb', borderRadius: '6px', padding: '16px', fontSize: '0.85rem', color: '#334155', overflowX: 'auto', lineHeight: 1.6 }}>{`// Using var — all log 3
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}

// Using let — logs 0, 1, 2
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}`}</pre>
            <p><code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '0.875rem' }}>var</code> is function-scoped so all callbacks share the same <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '0.875rem' }}>i</code>. <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '0.875rem' }}>let</code> creates a new binding per iteration.</p>

            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#0f172a', marginTop: '40px', marginBottom: '12px', letterSpacing: '-0.02em' }}>Test yourself before the interview does</h2>
            <p>Reading code examples isn&apos;t the same as being tested under pressure. The Examifyr JavaScript quiz gives you 25 real exam-style questions and shows you exactly which ES6+ concepts you haven&apos;t fully internalised.</p>
        </BlogLayout>
    );
}
