export function getAuthHeaders(token?: string | null): HeadersInit {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

export async function apiJson<T>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
  const res = await fetch(url, options);
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message =
      (data as { error?: string }).error ||
      `Request failed (${res.status})`;
    throw new Error(message);
  }

  return data as T;
}

export function resolveMediaUrl(url?: string): string {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return url;
}
