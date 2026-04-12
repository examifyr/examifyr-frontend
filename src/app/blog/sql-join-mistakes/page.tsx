import type { Metadata } from 'next';
import BlogLayout from '@/components/BlogLayout';

export const metadata: Metadata = {
    title: 'The Most Common SQL JOIN Mistakes (And How to Avoid Them)',
    description: 'JOINs are where most SQL beginners lose marks. Here are the mistakes that come up most often in exams and interviews — with clear fixes.',
    alternates: { canonical: '/blog/sql-join-mistakes' },
    openGraph: {
        title: 'The Most Common SQL JOIN Mistakes | Examifyr',
        description: 'JOINs trip up most SQL beginners. Here are the mistakes that lose marks in exams and interviews — with clear fixes for each.',
        url: 'https://www.examifyr.com/blog/sql-join-mistakes',
    },
};

export default function SQLJoinPost() {
    return (
        <BlogLayout
            title="The Most Common SQL JOIN Mistakes (And How to Avoid Them)"
            description="JOINs are where most SQL beginners lose marks. Here are the mistakes that come up most often in exams and interviews — with clear fixes."
            publishedAt="Apr 2026"
            readingTime="6 min"
            subject="SQL"
            subjectHref="/sql-practice-test"
        >
            <p>SQL JOINs are tested in almost every data role interview and SQL certification exam. Most people understand the concept — combine rows from two tables — but the details are where marks get lost.</p>
            <p>Here are the mistakes that come up most often, and exactly how to fix them.</p>

            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#0f172a', marginTop: '40px', marginBottom: '12px', letterSpacing: '-0.02em' }}>1. Confusing INNER JOIN with LEFT JOIN</h2>
            <p>This is the most common source of wrong answers in SQL exams. The difference:</p>
            <pre style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderLeft: '3px solid #2563eb', borderRadius: '6px', padding: '16px', fontSize: '0.85rem', color: '#334155', overflowX: 'auto', lineHeight: 1.6 }}>{`-- INNER JOIN: only rows that match in BOTH tables
SELECT o.id, c.name
FROM orders o
INNER JOIN customers c ON o.customer_id = c.id;

-- LEFT JOIN: ALL rows from orders, matched or not
SELECT o.id, c.name
FROM orders o
LEFT JOIN customers c ON o.customer_id = c.id;`}</pre>
            <p>With a LEFT JOIN, if there&apos;s no matching customer, <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '0.875rem' }}>c.name</code> will be NULL — not missing from results entirely.</p>
            <p><strong>Exam tip:</strong> If a question says &quot;include all orders, even those without a customer&quot; — that&apos;s a LEFT JOIN. &quot;Only orders with a matching customer&quot; — INNER JOIN.</p>

            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#0f172a', marginTop: '40px', marginBottom: '12px', letterSpacing: '-0.02em' }}>2. Forgetting that JOINs can multiply rows</h2>
            <p>If your JOIN condition isn&apos;t specific enough, you can get more rows back than you expect — a Cartesian product.</p>
            <pre style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderLeft: '3px solid #2563eb', borderRadius: '6px', padding: '16px', fontSize: '0.85rem', color: '#334155', overflowX: 'auto', lineHeight: 1.6 }}>{`-- orders has 100 rows, products has 50 rows
-- This gives 5,000 rows (100 × 50):
SELECT * FROM orders, products;

-- Always specify the join condition:
SELECT * FROM orders o
JOIN products p ON o.product_id = p.id;`}</pre>
            <p><strong>What to know:</strong> A missing <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '0.875rem' }}>ON</code> clause or a wrong condition creates a Cartesian product. Always check your row count makes sense.</p>

            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#0f172a', marginTop: '40px', marginBottom: '12px', letterSpacing: '-0.02em' }}>3. Using WHERE instead of HAVING after GROUP BY</h2>
            <p>This is tested constantly. WHERE filters rows before grouping; HAVING filters groups after.</p>
            <pre style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderLeft: '3px solid #2563eb', borderRadius: '6px', padding: '16px', fontSize: '0.85rem', color: '#334155', overflowX: 'auto', lineHeight: 1.6 }}>{`-- WRONG: can't use aggregate in WHERE
SELECT customer_id, COUNT(*) as order_count
FROM orders
WHERE COUNT(*) > 5        -- Error!
GROUP BY customer_id;

-- CORRECT: use HAVING for aggregate conditions
SELECT customer_id, COUNT(*) as order_count
FROM orders
GROUP BY customer_id
HAVING COUNT(*) > 5;`}</pre>
            <p><strong>Rule:</strong> If you&apos;re filtering on an aggregate (COUNT, SUM, AVG), use HAVING. Everything else uses WHERE.</p>

            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#0f172a', marginTop: '40px', marginBottom: '12px', letterSpacing: '-0.02em' }}>4. Not handling NULLs correctly in JOIN conditions</h2>
            <p>NULL does not equal NULL in SQL. This catches people out when joining on nullable columns.</p>
            <pre style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderLeft: '3px solid #2563eb', borderRadius: '6px', padding: '16px', fontSize: '0.85rem', color: '#334155', overflowX: 'auto', lineHeight: 1.6 }}>{`-- This will NOT match rows where ref_code is NULL on both sides:
SELECT * FROM a JOIN b ON a.ref_code = b.ref_code;

-- To include NULLs:
SELECT * FROM a JOIN b
ON a.ref_code = b.ref_code
   OR (a.ref_code IS NULL AND b.ref_code IS NULL);`}</pre>
            <p><strong>What to know:</strong> <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '0.875rem' }}>NULL = NULL</code> evaluates to UNKNOWN, not TRUE. Always use <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '0.875rem' }}>IS NULL</code> or <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '0.875rem' }}>IS NOT NULL</code>.</p>

            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#0f172a', marginTop: '40px', marginBottom: '12px', letterSpacing: '-0.02em' }}>5. Not knowing when to use a subquery vs a JOIN</h2>
            <p>Both can solve the same problem, but exams test whether you know the difference.</p>
            <pre style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderLeft: '3px solid #2563eb', borderRadius: '6px', padding: '16px', fontSize: '0.85rem', color: '#334155', overflowX: 'auto', lineHeight: 1.6 }}>{`-- Using a subquery:
SELECT name FROM customers
WHERE id IN (SELECT customer_id FROM orders WHERE total > 100);

-- Using a JOIN (often more efficient):
SELECT DISTINCT c.name
FROM customers c
JOIN orders o ON c.id = o.customer_id
WHERE o.total > 100;`}</pre>
            <p><strong>What to know:</strong> JOINs are generally faster on large datasets. Subqueries are clearer when you need to express &quot;find rows where something exists in another table&quot;. EXISTS is often better than IN for subqueries.</p>

            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#0f172a', marginTop: '40px', marginBottom: '12px', letterSpacing: '-0.02em' }}>Find your exact weak spots</h2>
            <p>Reading these examples is a start. But the only way to know if you&apos;ve actually internalised them is to answer questions under test conditions — and see which ones you get wrong.</p>
            <p>The Examifyr SQL practice test gives you 25 real exam-style questions, an instant score, and a topic breakdown showing exactly where your gaps are.</p>
        </BlogLayout>
    );
}
