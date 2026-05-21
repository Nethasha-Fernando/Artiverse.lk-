// unchanged — already clean
import { useNavigate } from "react-router-dom";
import LoginForm      from "../components/auth/LoginForm";
import AuthPageLayout from "../components/auth/AuthPageLayout";

export default function LoginPage() {
  const navigate = useNavigate();
  return (
    <AuthPageLayout>
      <LoginForm onSuccess={() => navigate("/artworks")} />
    </AuthPageLayout>
  );
}