import { NextResponse } from 'next/server';
import { getBackendBaseUrl } from '@/lib/config';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const baseUrl = getBackendBaseUrl();
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
