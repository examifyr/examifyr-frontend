import { NextResponse } from 'next/server';
import { getBackendBaseUrl } from '@/lib/config';

export async function GET() {
    try {
        const baseUrl = getBackendBaseUrl();
        const res = await fetch(`${baseUrl}/api/v1/questions`, {
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
