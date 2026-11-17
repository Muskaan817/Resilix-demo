/**
 * API service layer communicating with the Express backend
 */

export async function fetchStats() {
  const res = await fetch('/stats');
  if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to fetch stats`);
  return await res.json();
}

export async function fetchHealth() {
  const res = await fetch('/health');
  if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to fetch health`);
  return await res.json();
}

export async function fetchUsers(scenario) {
  const url = scenario ? `/users?scenario=${encodeURIComponent(scenario)}` : '/users';
  const res = await fetch(url);
  const data = await res.json();
  return { status: res.status, ok: res.ok, data };
}

export async function fetchProducts(scenario) {
  const url = scenario ? `/products?scenario=${encodeURIComponent(scenario)}` : '/products';
  const res = await fetch(url);
  const data = await res.json();
  return { status: res.status, ok: res.ok, data };
}

export async function fetchOrders(scenario) {
  const url = scenario ? `/orders?scenario=${encodeURIComponent(scenario)}` : '/orders';
  const res = await fetch(url);
  const data = await res.json();
  return { status: res.status, ok: res.ok, data };
}

export async function updateConfig(configData) {
  const res = await fetch('/config', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(configData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to update configuration');
  return data;
}

export async function resetStats() {
  const res = await fetch('/reset', {
    method: 'POST',
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to reset statistics');
  return data;
}
