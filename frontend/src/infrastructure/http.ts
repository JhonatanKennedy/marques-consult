import { ApiError, NetworkError } from './errors';

const BASE = import.meta.env.VITE_API_URL ?? '';

export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${BASE}${path}`, {
      ...init,
      headers: init?.body
        ? { 'Content-Type': 'application/json', ...init.headers }
        : init?.headers,
    });
  } catch {
    throw new NetworkError(path);
  }

  if (!response.ok) throw new ApiError(response.status, path);

  return (await response.json()) as T;
}
