'use client';

import { useEffect, useState } from 'react';

export default function Home() {
    const [status, setStatus] = useState<string>('loading...');
    const [version, setVersion] = useState<string>('loading...');

    useEffect(() => {
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

        console.log('Backend API URL:', apiUrl);

        fetch(`${apiUrl}/health`)
            .then((res) => res.json())
            .then((data) => {
                setStatus(data.status);
            })
            .catch((err) => {
                console.error('API error:', err);
                setStatus('error');
            });

        fetch(`${apiUrl}/version`)
            .then((res) => res.json())
            .then((data) => {
                setVersion(data.version);
            })
            .catch((err) => {
                console.error('Version API error:', err);
                setVersion('error');
            });
    }, []);

    return (
        <main style={{ padding: '40px', color: 'white' }}>
            <h1>Welcome to Examifyr</h1>
            <p>AI-powered exam preparation platform</p>

            <hr style={{ margin: '30px 0' }} />

            <h3>Backend Health Check</h3>
            <p>Status: <strong>{status}</strong></p>
            <p>Version: <strong>{version}</strong></p>
        </main>
    );
}
