import { NextResponse } from 'next/server';
import { getBackendBaseUrl } from '@/lib/config';

export async function GET(
    _request: Request,
    context: { params: Promise<{ quizId: string }> },
) {
    try {
        const { quizId } = await context.params;
        const baseUrl = getBackendBaseUrl();
        const res = await fetch(`${baseUrl}/api/v1/quizzes/${encodeURIComponent(quizId)}`);

        const text = await res.text();
        try {
            const data = JSON.parse(text);
            return NextResponse.json(data, { status: res.status });
        } catch {
            return new Response(text, { status: res.status });
        }
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load quiz.';
        return NextResponse.json({ message }, { status: 500 });
    }
}
