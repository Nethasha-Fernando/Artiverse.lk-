import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface RegisterForm {
  firstName:     string;
  lastName:      string;
  email:         string;
  password:      string;
  contactNumber: string;
  role:          "user" | "artist";
  receiveEmails: boolean;
}

const initialForm: RegisterForm = {
  firstName:     "",
  lastName:      "",
  email:         "",
  password:      "",
  contactNumber: "",
  role:          "user",
  receiveEmails: false,
};

export function useRegister() {
  const { login }   = useAuth();
  const navigate    = useNavigate();

  const [form,         setForm]         = useState<RegisterForm>(initialForm);
  const [showPassword, setShowPassword] = useState(false);
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState("");

  const set = <K extends keyof RegisterForm>(key: K, value: RegisterForm[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const toggleRole = () =>
    set("role", form.role === "artist" ? "user" : "artist");

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      const res  = await fetch("/api/auth/register", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      login(data.token, data.user);
      navigate("/artworks");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    set,
    toggleRole,
    showPassword,
    setShowPassword,
    loading,
    error,
    handleSubmit,
  };
}