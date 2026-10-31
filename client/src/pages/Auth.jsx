import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import BrandMark from "../components/layout/BrandMark";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000";

const initialState = {
  fullName: "",
  workspaceName: "",
  email: "",
  password: "",
};

export default function Auth() {
  const navigate = useNavigate();
  const { mode } = useParams();
  const authMode = mode === "register" ? "register" : "login";

  const [form, setForm] = useState(initialState);
  const [status, setStatus] = useState({ type: "idle", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fieldConfig = useMemo(
    () =>
      authMode === "register"
        ? [
            {
              name: "fullName",
              label: "Full name",
              type: "text",
              placeholder: "Avery Chen",
              autoComplete: "name",
            },
            {
              name: "workspaceName",
              label: "Workspace name",
              type: "text",
              placeholder: "Northstar Product",
              autoComplete: "organization",
            },
          ]
        : [],
    [authMode],
  );

  const endpoint = `${API_BASE_URL}/api/auth/${authMode}`;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: "idle", message: "" });

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: form.email.trim(),
          password: form.password,
          fullName: form.fullName.trim(),
          workspaceName: form.workspaceName.trim(),
        }),
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          payload?.message ?? "Unable to authenticate right now.",
        );
      }

      navigate("/");
    } catch (err) {
      setStatus({
        type: "error",
        message: err instanceof Error ? err.message : "Authentication failed.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-7xl overflow-hidden rounded-[2rem] border border-white/70 bg-white/75 shadow-[0_30px_90px_rgb(15_23_42_/_0.12)] backdrop-blur-xl lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative overflow-hidden bg-slate-950 px-6 py-10 text-white sm:px-10 lg:px-12 lg:py-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.32),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(45,212,191,0.22),transparent_28%)]" />
          <div className="relative flex h-full flex-col justify-between gap-10">
            <BrandMark inverted />

            <div className="max-w-xl space-y-6">
              <span className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-sky-100">
                WORKSPACES & COLLABORATION
              </span>
              <div className="space-y-4">
                <h1 className="text-4xl font-semibold leading-tight text-balance sm:text-5xl">
                  Stay organized, collaborate, and achieve more together.
                </h1>
                <p className="max-w-lg text-sm leading-6 text-slate-300 sm:text-base">
                  Manage personal tasks, work with friends, or coordinate entire
                  teams through shared workspaces and real-time collaboration.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  ["Unlimited", "TASKS"],
                  ["Three", "WORKSPACE TYPES"],
                  ["Real-Time", "COLLABORATION"],
                ].map(([value, label]) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-white/10 bg-white/10 p-4"
                  >
                    <p className="text-2xl font-semibold text-white">{value}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-300">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <p className="max-w-lg text-sm leading-6 text-slate-400">
              Built for individuals, teams, startups, and organizations that
              need a simple way to plan, track, and complete work.
            </p>
          </div>
        </section>

        <section className="flex items-center justify-center bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(248,250,252,0.98))] px-6 py-10 sm:px-10 lg:px-12 lg:py-12">
          <div className="w-full max-w-md space-y-8">
            <div className="space-y-2">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
                {authMode === "login" ? "Welcome back" : "GET STARTED"}
              </p>
              <h2 className="text-3xl font-semibold text-slate-950">
                {authMode === "login"
                  ? "Sign in to DevCollab"
                  : "Create your DevCollab account"}
              </h2>
              <p className="text-sm leading-6 text-slate-600">
                {authMode === "login"
                  ? "Pick up where your team left off and continue coordinating in one shared workspace."
                  : "Start with a personal workspace and expand to teams or organizations whenever you're ready."}
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              {fieldConfig.map((field) => (
                <label
                  key={field.name}
                  className="block space-y-2 text-sm font-medium text-slate-700"
                >
                  <span>{field.label}</span>
                  <input
                    name={field.name}
                    type={field.type}
                    value={form[field.name]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    autoComplete={field.autoComplete}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                  />
                </label>
              ))}

              <label className="block space-y-2 text-sm font-medium text-slate-700">
                <span>Email address</span>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="name@company.com"
                  autoComplete="email"
                  required
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                />
              </label>

              <label className="block space-y-2 text-sm font-medium text-slate-700">
                <span>Password</span>
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
                  autoComplete={
                    authMode === "login" ? "current-password" : "new-password"
                  }
                  required
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                />
              </label>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex w-full items-center justify-center rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:c  ursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting
                  ? "Working..."
                  : authMode === "login"
                    ? "Sign in"
                    : "Create Account"}
              </button>

              <p
                className={`rounded-2xl border px-4 py-3 text-sm ${
                  status.type === "error"
                    ? "border-rose-200 bg-rose-50 text-rose-700"
                    : status.type === "success"
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border-slate-200 bg-slate-50 text-slate-600"
                }`}
                aria-live="polite"
              >
                {status.message ||
                  "Secure authentication and workspace management powered by DevCollab."}
              </p>

              <div className="flex items-center justify-between gap-4 text-sm text-slate-600">
                <span>
                  {authMode === "login"
                    ? "Need an account?"
                    : "Already using DevCollab?"}
                </span>
                <Link
                  to={authMode === "login" ? "/auth/register" : "/auth"}
                  className="font-semibold text-sky-700 transition hover:text-sky-900"
                >
                  {authMode === "login" ? "Create Account" : "Sign in"}
                </Link>
              </div>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
