import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../hooks/useAuth.jsx";

// Google redirects here with ?code=... after the user approves consent.
// We forward the code to our backend, which exchanges it and returns our
// own JWTs (see /auth/google/callback on the backend).
export default function GoogleCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithGoogleToken } = useAuth();
  const [error, setError] = useState("");

  useEffect(() => {
    const code = params.get("code");
    if (!code) {
      setError("Missing authorization code");
      return;
    }
    api
      .get("/auth/google/callback", { params: { code } })
      .then(({ data }) => {
        loginWithGoogleToken(data);
        navigate("/");
      })
      .catch(() => setError("Google sign-in failed"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex h-screen items-center justify-center text-sm text-gray-500">
      {error ? error : "Signing you in…"}
    </div>
  );
}
