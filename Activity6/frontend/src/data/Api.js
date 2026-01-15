export const BASE_URL = "/api";

let lastError = null;

export function getLastError() {
    return lastError;
}

export function clearLastError() {
    lastError = null;
}

async function fetchJson(url, options) {
    const res = await fetch(url, options);
    if (!res.ok) {
        const text = await res.text();
        throw new Error(`HTTP ${res.status}: ${text || res.statusText}`);
    }
    return res.json();
}

export async function getAllMovies() {
    try {
        const data = await fetchJson(`${BASE_URL}/movies`);
        lastError = null;
        return Array.isArray(data) ? data : [];
    } catch (err) {
        console.error("[API] getAllMovies", err);
        lastError = err;
        return [];
    }
}

export async function createMovie(payload) {
    return fetchJson(`${BASE_URL}/movies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
}

export async function updateMovie(id, payload) {
    return fetchJson(`${BASE_URL}/movies/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
}

export async function deleteMovie(id) {
    return fetchJson(`${BASE_URL}/movies/${id}`, {
        method: "DELETE",
    });
}

export async function getReviews(movieId) {
    try {
        const data = await fetchJson(`${BASE_URL}/movies/${movieId}/reviews`);
        lastError = null;
        return Array.isArray(data) ? data : [];
    } catch (err) {
        console.error("[API] getReviews", err);
        lastError = err;
        return [];
    }
}

export async function createReview(movieId, payload) {
    return fetchJson(`${BASE_URL}/movies/${movieId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
}

export async function deleteReview(id) {
    return fetchJson(`${BASE_URL}/reviews/${id}`, {
        method: "DELETE",
    });
}
