import { useAuth } from "../context/AuthContext";

export function useAuthFetch() {
  const { accessToken } = useAuth();

  return async (url: string, options: RequestInit = {}) => {
    return fetch(url, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers ?? {}),
        Authorization: `Bearer ${accessToken}`,
      },
    });
  };
}