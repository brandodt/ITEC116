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

// Chatrooms API
export async function getAllChatrooms() {
  try {
    const data = await fetchJson(`${BASE_URL}/chatrooms`);
    lastError = null;
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error('[API] getAllChatrooms', err);
    lastError = err;
    return [];
  }
}

export async function getChatroom(id) {
  return fetchJson(`${BASE_URL}/chatrooms/${id}`);
}

export async function createChatroom(payload) {
  return fetchJson(`${BASE_URL}/chatrooms`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export async function updateChatroom(id, payload) {
  return fetchJson(`${BASE_URL}/chatrooms/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export async function deleteChatroom(id) {
  const res = await fetch(`${BASE_URL}/chatrooms/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text || res.statusText}`);
  }
  return { success: true };
}

// Messages API
export async function getMessages(chatroomId) {
  try {
    const data = await fetchJson(`${BASE_URL}/chatrooms/${chatroomId}/messages`);
    lastError = null;
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error('[API] getMessages', err);
    lastError = err;
    return [];
  }
}

export async function sendMessage(chatroomId, payload) {
  return fetchJson(`${BASE_URL}/chatrooms/${chatroomId}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export async function deleteMessage(chatroomId, messageId) {
  const res = await fetch(`${BASE_URL}/chatrooms/${chatroomId}/messages/${messageId}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text || res.statusText}`);
  }
  return { success: true };
}
