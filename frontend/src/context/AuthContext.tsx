import { createContext, useContext, useState, ReactNode } from "react";

interface User {
  id:        string;
  firstName: string;
  lastName:  string;
  email:     string;
  role:      "artist" | "user";
}

interface AuthContextType {
  user:     User | null;
  token:    string | null;
  login:    (token: string, user: User) => void;
  logout:   () => void;
  isArtist: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  function login(token: string, user: User) {
    setToken(token);
    setUser(user);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
  }

  function logout() {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  return (
    <AuthContext.Provider value={{
      user,
      token,
      login,
      logout,
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