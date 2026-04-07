import { NextResponse } from 'next/server';
import { getBackendBaseUrl } from '@/lib/config';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const difficulty = searchParams.get('difficulty');

        const baseUrl = getBackendBaseUrl();
        const backendUrl = new URL(`${baseUrl}/api/v1/questions`);
        if (difficulty) backendUrl.searchParams.set('difficulty', difficulty);

        const res = await fetch(backendUrl.toString(), {
            headers: { 'Content-Type': 'application/json' },
            cache: 'no-store',
        });

        const text = await res.text();
        try {
            const data = JSON.parse(text);
            return NextResponse.json(data, { status: res.status });
        } catch {
            return new Response(text, { status: res.status });
        }
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch questions.';
        return NextResponse.json({ message }, { status: 500 });
    }
}
