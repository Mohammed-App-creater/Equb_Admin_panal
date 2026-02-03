import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { login as loginApi } from "../api/auth";

const Login: React.FC = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await loginApi({ phone, password });
      // Since response only returns token, we use a placeholder user for now
      // or we could fetch profile right after login
      const placeholderUser = { id: 'temp', phone, fullName: 'Owner', role: 'owner' };
      login(response.token, placeholderUser);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }

  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-primary text-3xl font-black text-white shadow-xl shadow-primary/30">
            E
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Owner Login
          </h1>
          <p className="mt-2 text-slate-500">
            Manage your Equb circles with ease
          </p>
        </div>

        <div className="rounded-3xl bg-white p-8 shadow-soft border border-slate-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-100">
                {error}
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                placeholder="0911 22 33 44"
                className="w-full rounded-2xl border-slate-200 bg-slate-50 px-4 py-4 text-slate-900 transition-all focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/5 outline-none border"
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-700">
                  Password
                </label>
                <a
                  href="#"
                  className="text-xs font-medium text-primary hover:underline"
                >
                  Forgot?
                </a>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full rounded-2xl border-slate-200 bg-slate-50 px-4 py-4 text-slate-900 transition-all focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/5 outline-none border"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="group relative flex w-full items-center justify-center rounded-2xl bg-primary px-4 py-4 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:bg-secondary hover:shadow-primary/30 active:scale-95 disabled:opacity-70"
            >
              {isLoading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <>
                  Sign In
                  <svg
                    className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-500">
            Don't have an owner account?{" "}
            <a href="#" className="font-semibold text-primary hover:underline">
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
