import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { fetchArtistProfile } from "../services/artistService";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "artist" | "user" | "admin";
  slug?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (patch: Partial<User>) => void;
  refreshProfile: () => Promise<void>;
  isArtist: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token"),
  );
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  function persist(nextToken: string | null, nextUser: User | null) {
    if (nextToken) localStorage.setItem("token", nextToken);
    else localStorage.removeItem("token");

    if (nextUser) localStorage.setItem("user", JSON.stringify(nextUser));
    else localStorage.removeItem("user");
  }

  function login(nextToken: string, nextUser: User) {
    setToken(nextToken);
    setUser(nextUser);
    persist(nextToken, nextUser);
  }

  function logout() {
    setToken(null);
    setUser(null);
    persist(null, null);
  }

  function updateUser(patch: Partial<User>) {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...patch };
      localStorage.setItem("user", JSON.stringify(next));
      return next;
    });
  }

  const refreshProfile = useCallback(async () => {
    if (!token || user?.role !== "artist") return;
    try {
      const profile = await fetchArtistProfile("me", token);
      updateUser({
        firstName: profile.firstName ?? user.firstName,
        lastName: profile.lastName ?? user.lastName,
        slug: profile.slug,
      });
    } catch {
      /* ignore refresh errors */
    }
  }, [token, user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        updateUser,
        refreshProfile,
        isArtist: user?.role === "artist",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
