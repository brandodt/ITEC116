export const BASE_URL = '/api';

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

// Users API
export async function getAllUsers() {
  try {
    const data = await fetchJson(`${BASE_URL}/users`);
    lastError = null;
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error('[API] getAllUsers', err);
    lastError = err;
    return [];
  }
}

export async function createUser(payload) {
  return fetchJson(`${BASE_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export async function updateUser(id, payload) {
  return fetchJson(`${BASE_URL}/users/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export async function deleteUser(id) {
  const res = await fetch(`${BASE_URL}/users/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text || res.statusText}`);
  }
  return { success: true };
}

// Projects API
export async function getAllProjects() {
  try {
    const data = await fetchJson(`${BASE_URL}/projects`);
    lastError = null;
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error('[API] getAllProjects', err);
    lastError = err;
    return [];
  }
}

export async function createProject(payload) {
  return fetchJson(`${BASE_URL}/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export async function updateProject(id, payload) {
  return fetchJson(`${BASE_URL}/projects/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export async function deleteProject(id) {
  const res = await fetch(`${BASE_URL}/projects/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text || res.statusText}`);
  }
  return { success: true };
}

// Tasks API
export async function getAllTasks() {
  try {
    const data = await fetchJson(`${BASE_URL}/tasks`);
    lastError = null;
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error('[API] getAllTasks', err);
    lastError = err;
    return [];
  }
}

export async function createTask(payload) {
  return fetchJson(`${BASE_URL}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export async function updateTask(id, payload) {
  return fetchJson(`${BASE_URL}/tasks/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export async function deleteTask(id) {
  const res = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text || res.statusText}`);
  }
  return { success: true };
}
