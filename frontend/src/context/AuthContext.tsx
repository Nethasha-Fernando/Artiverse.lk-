import { createContext, useContext, useState, useEffect, useRef, useCallback, ReactNode } from "react";

interface User {
  id: string; firstName: string; lastName: string;
  email: string; role: "artist" | "user";
}

interface AuthContextType {
  user:        User | null;
  accessToken: string | null;
  login:       (token: string, user: User) => void;
  logout:      () => void;
  isArtist:    boolean;
  isLoading:   boolean; // NEW — prevents flash of unauthenticated UI
}

const AuthContext = createContext<AuthContextType | null>(null);

const REFRESH_INTERVAL = 13 * 60 * 1000; // 13 min (before 15m expiry)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user,        setUser]        = useState<User | null>(null);
  const [isLoading,   setIsLoading]   = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearRefreshTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const silentRefresh = useCallback(async (): Promise<string | null> => {
    try {
      const res  = await fetch("/api/auth/refresh", { method: "POST", credentials: "include" });
      const data = await res.json();
      if (!res.ok) throw new Error();
      setAccessToken(data.accessToken);
      return data.accessToken;
    } catch {
      // refresh token expired — force logout
      setAccessToken(null);
      setUser(null);
      clearRefreshTimer();
      return null;
    }
  }, []);

  // On mount: try to restore session via refresh token cookie
  useEffect(() => {
    silentRefresh().finally(() => setIsLoading(false));
  }, [silentRefresh]);

  // Keep user data in localStorage (not sensitive — just display info)
  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else      localStorage.removeItem("user");
  }, [user]);

  // Restore user from localStorage if we got a new access token on mount
  useEffect(() => {
    if (accessToken && !user) {
      const saved = localStorage.getItem("user");
      if (saved) setUser(JSON.parse(saved));
    }
  }, [accessToken]);

  function login(token: string, newUser: User) {
    setAccessToken(token);
    setUser(newUser);
    // Start silent refresh loop
    clearRefreshTimer();
    intervalRef.current = setInterval(silentRefresh, REFRESH_INTERVAL);
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    setAccessToken(null);
    setUser(null);
    localStorage.removeItem("user");
    clearRefreshTimer();
  }

  // Start refresh timer when we have a token
  useEffect(() => {
    if (accessToken) {
      clearRefreshTimer();
      intervalRef.current = setInterval(silentRefresh, REFRESH_INTERVAL);
    }
    return clearRefreshTimer;
  }, [accessToken, silentRefresh]);

  return (
    <AuthContext.Provider value={{
      user, accessToken, login, logout, isLoading,
      isArtist: user?.role === "artist",
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}