export function getToken(): string | null {
  return localStorage.getItem('token')
}

export function setToken(token: string): void {
  localStorage.setItem('token', token)
}

export function removeToken(): void {
  localStorage.removeItem('token')
}

export async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string> | undefined),
  }

  const res = await fetch(`/api${path}`, { ...options, headers })

  const text = await res.text()
  let data: T
  try {
    data = JSON.parse(text)
  } catch {
    throw new Error(text || `Server error: ${res.status}`)
  }

  if (!res.ok) {
    const err = data as { detail?: string }
    throw new Error(err.detail || `Request failed: ${res.status}`)
  }

  return data
}
