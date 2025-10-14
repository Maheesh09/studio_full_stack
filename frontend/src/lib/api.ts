// src/lib/api.ts
const BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined) || '';

function joinUrl(base: string, path: string): string {
  if (!base) return path; // use Vite proxy with relative /api path

  const trimmedBase = base.replace(/\/+$/, '');
  const ensuredPath = path.startsWith('/') ? path : `/${path}`;

  // Avoid double /api/api when base already includes "/api" and path starts with "/api/..."
  if (trimmedBase.endsWith('/api') && ensuredPath.startsWith('/api/')) {
    return `${trimmedBase}${ensuredPath.replace(/^\/api/, '')}`;
  }
  return `${trimmedBase}${ensuredPath}`;
}

export async function apiGet<T>(path: string, init?: RequestInit): Promise<T> {
  const url = joinUrl(BASE, path);
  const res = await fetch(url, { credentials: "include", ...(init || {}) });
  if (!res.ok) {
    const errorText = await res.text().catch(() => 'Unknown error');
    throw new Error(`GET ${path} -> ${res.status}: ${errorText}`);
  }
  return res.json();
}

export async function apiSend<T>(path: string, method: string, body?: any): Promise<T> {
  const url = joinUrl(BASE, path);
  const res = await fetch(url, {
    method,
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const errorText = await res.text().catch(() => 'Unknown error');
    throw new Error(`${method} ${path} -> ${res.status}: ${errorText}`);
  }
  return res.json();
}

export const api = {
  get: apiGet,
  send: apiSend,
};