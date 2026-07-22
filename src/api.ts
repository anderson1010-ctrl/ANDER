import type { LostPetReport, Pet } from './types';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000';

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`API request failed (${response.status}): ${body}`);
  }

  return response.json();
}

export function fetchAdoptionPets() {
  return fetchJson<Pet[]>(`${BASE_URL}/api/pets`);
}

export function fetchLostReports() {
  return fetchJson<LostPetReport[]>(`${BASE_URL}/api/reports`);
}

export function updatePetStatus(petId: string, status: string) {
  return fetchJson<Pet>(`${BASE_URL}/api/pets/${encodeURIComponent(petId)}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  });
}

export function createLostReport(report: Omit<LostPetReport, 'id' | 'reportedAt'>) {
  return fetchJson<LostPetReport>(`${BASE_URL}/api/reports`, {
    method: 'POST',
    body: JSON.stringify(report),
  });
}
