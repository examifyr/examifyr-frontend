export const getBackendBaseUrl = (): string => {
    const raw = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!raw) {
        throw new Error('Missing NEXT_PUBLIC_API_BASE_URL');
    }
    return raw.replace(/\/+$/, '');
};
