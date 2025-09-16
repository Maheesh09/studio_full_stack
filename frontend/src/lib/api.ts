// src/lib/api.ts
const BASE = import.meta.env.VITE_API_BASE_URL || '';

export async function apiGet<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${BASE}${path}`;
  console.log('API GET request to:', url);
  
  const res = await fetch(url, { credentials: "include", ...(init || {}) });
  
  console.log('API GET response:', {
    url,
    status: res.status,
    statusText: res.statusText,
    ok: res.ok
  });
  
  if (!res.ok) {
    const errorText = await res.text().catch(() => 'Unknown error');
    console.error('API GET error:', {
      url,
      status: res.status,
      statusText: res.statusText,
      errorText
    });
    throw new Error(`GET ${path} -> ${res.status}: ${errorText}`);
  }
  
  return res.json();
}

export async function apiSend<T>(path: string, method: string, body?: any): Promise<T> {
  const url = `${BASE}${path}`;
  console.log('API SEND request to:', url, { method, body });
  
  const res = await fetch(url, {
    method,
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  
  console.log('API SEND response:', {
    url,
    method,
    status: res.status,
    statusText: res.statusText,
    ok: res.ok
  });
  
  if (!res.ok) {
    const errorText = await res.text().catch(() => 'Unknown error');
    console.error('API SEND error:', {
      url,
      method,
      status: res.status,
      statusText: res.statusText,
      errorText
    });
    throw new Error(`${method} ${path} -> ${res.status}: ${errorText}`);
  }
  
  return res.json();
}