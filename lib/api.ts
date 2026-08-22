export const API_BASE = '/api';

export function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('dayflow_token');
}

export function setToken(token: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('dayflow_token', token);
}

export function removeToken() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('dayflow_token');
}

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const token = getToken();
  
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  let response;
  try {
    response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });
  } catch {
    throw new Error('Unable to connect to Dayflow services. Please try again.');
  }

  let data;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('dayflow:unauthorized'));
      }
    }
    
    if (response.status >= 500) {
      throw new Error('Unable to process your request at this time (Server Error). Please try again.');
    }

    throw new Error(data?.message || data?.error || 'API request failed');
  }

  return data;
}
