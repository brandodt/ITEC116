export const BASE_URL = '/api';

let lastError = null;

export function getLastError() {
    return lastError;
}

export function clearLastError() {
    lastError = null;
}

// Reusable safe fetch: never throws, returns [] on failure, logs error.
export async function fetchData(endpoint) {
    try {
        const res = await fetch(`${BASE_URL}${endpoint}`);
        if (!res.ok) throw new Error(`HTTP ${res.status} at ${endpoint}`);
        const json = await res.json();
        lastError = null;
        // Normalize common response shapes
        if (Array.isArray(json)) return json;
        if (Array.isArray(json?.items)) return json.items;
        if (Array.isArray(json?.data)) return json.data;
        return [];
    } catch (err) {
        console.error('[API]', endpoint, err);
        lastError = err;
        return [];
    }
}

// Specific helpers
export const getAllBooks = () => fetchData('/books');
export const getAllAuthors = () => fetchData('/authors');
export const getAllCategories = () => fetchData('/categories');
