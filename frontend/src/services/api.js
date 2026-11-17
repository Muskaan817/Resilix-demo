/**
 * API service layer communicating with the Express backend
 * Features automatic dual-mode fallback (Vite proxy -> Direct Backend :5001 via CORS)
 */

const BACKEND_BASE = 'http://localhost:5001';
const IPV4_BACKEND_BASE = 'http://127.0.0.1:5001';

async function smartFetch(url, options = {}) {
  // 1. Try relative path (Vite proxy / same-origin backend hosting)
  try {
    const res = await fetch(url, options);
    // If Vite proxy returns bad gateway (502/504), fall back to direct backend
    if (res.status === 502 || res.status === 504) {
      throw new Error(`Proxy gateway error ${res.status}`);
    }
    return res;
  } catch {
    // 2. Direct fallback to http://localhost:5001 via CORS
    try {
      return await fetch(`${BACKEND_BASE}${url}`, options);
    } catch {
      // 3. Direct fallback to http://127.0.0.1:5001
      return await fetch(`${IPV4_BACKEND_BASE}${url}`, options);
    }
  }
}

export async function fetchStats() {
  const res = await smartFetch('/stats');
  if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to fetch stats`);
  return await res.json();
}

export async function fetchHealth() {
  const res = await smartFetch('/health');
  if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to fetch health`);
  return await res.json();
}

export async function fetchUsers(scenario) {
  const url = scenario ? `/users?scenario=${encodeURIComponent(scenario)}` : '/users';
  const res = await smartFetch(url);
  const data = await res.json();
  return { status: res.status, ok: res.ok, data };
}

export async function fetchProducts(scenario) {
  const url = scenario ? `/products?scenario=${encodeURIComponent(scenario)}` : '/products';
  const res = await smartFetch(url);
  const data = await res.json();
  return { status: res.status, ok: res.ok, data };
}

export async function fetchOrders(scenario) {
  const url = scenario ? `/orders?scenario=${encodeURIComponent(scenario)}` : '/orders';
  const res = await smartFetch(url);
  const data = await res.json();
  return { status: res.status, ok: res.ok, data };
}

export async function updateConfig(configData) {
  const res = await smartFetch('/config', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(configData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to update configuration');
  return data;
}

export async function resetStats() {
  const res = await smartFetch('/reset', {
    method: 'POST',
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to reset statistics');
  return data;
}
