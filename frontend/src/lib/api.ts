// src/lib/api.ts
const BASE = import.meta.env.VITE_API_BASE_URL || '';

function buildUrl(path: string): string {
  // Prevent double '/api' and double slashes when combining BASE and path
  const base = BASE.replace(/\/$/, '');
  let p = path;
  if (!p.startsWith('/')) p = '/' + p;
  if (base.endsWith('/api') && p.startsWith('/api/')) {
    p = p.substring(4); // remove leading '/api'
  }
  return `${base}${p}`;
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function apiGet<T>(path: string, init?: RequestInit): Promise<T> {
  const url = buildUrl(path);
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
    throw new ApiError(errorText || res.statusText, res.status);
  }
  
  return res.json();
}

export async function apiSend<T>(path: string, method: string, body?: any): Promise<T> {
  const url = buildUrl(path);
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
    throw new ApiError(errorText || res.statusText, res.status);
  }

  // Handle endpoints that return no content (e.g., 204) or non-JSON bodies
  const contentType = res.headers.get('content-type') || '';
  if (res.status === 204 || contentType.indexOf('application/json') === -1) {
    return undefined as T;
  }
  const text = await res.text();
  if (!text) return undefined as T;
  return JSON.parse(text) as T;
}

// Admin Suppliers API helpers
export type SupplierDTO = {
  supplierId: number;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
};

export async function listSuppliers(): Promise<SupplierDTO[]> {
  return apiGet<SupplierDTO[]>("/api/admin/suppliers");
}

export async function getSupplier(id: number): Promise<SupplierDTO> {
  return apiGet<SupplierDTO>(`/api/admin/suppliers/${id}`);
}

export async function createSupplier(input: { name: string; email?: string; phone?: string; address?: string; }): Promise<{ supplierId: number; }> {
  return apiSend<{ supplierId: number; }>("/api/admin/suppliers", "POST", input);
}

export async function updateSupplier(id: number, input: { name?: string; email?: string; phone?: string; address?: string; }): Promise<void> {
  await apiSend<void>(`/api/admin/suppliers/${id}`, "PUT", input);
}

export async function deleteSupplier(id: number): Promise<void> {
  await apiSend<void>(`/api/admin/suppliers/${id}`, "DELETE");
}