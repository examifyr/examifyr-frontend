import { NextResponse } from 'next/server';

const getBaseUrl = (): string => {
    const raw = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!raw) {
        throw new Error('Missing NEXT_PUBLIC_API_BASE_URL');
    }
    return raw.replace(/\/+$/, '');
};

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const baseUrl = getBaseUrl();
        const res = await fetch(`${baseUrl}/api/v1/quizzes/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        const text = await res.text();
        try {
            const data = JSON.parse(text);
            return NextResponse.json(data, { status: res.status });
        } catch {
            return new Response(text, { status: res.status });
        }
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to generate quiz.';
        return NextResponse.json({ message }, { status: 500 });
    }
}
