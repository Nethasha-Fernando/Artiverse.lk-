// unchanged — already clean
import { useNavigate } from "react-router-dom";
import LoginForm      from "../components/auth/LoginForm";
import AuthPageLayout from "../components/auth/AuthPageLayout";
import { useToast } from "../hooks/useToast";
import { Toast }    from "../components/common/Toast"

export default function LoginPage() {
  const navigate = useNavigate();
  const { toast, showToast, hideToast } = useToast();

  return (
    <AuthPageLayout>
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
      <LoginForm
        onSuccess={() => {
          showToast("Welcome back! Signed in successfully.", "success");
          setTimeout(() => navigate("/artworks"), 1200);
        }}
      />
    </AuthPageLayout>
  );
}