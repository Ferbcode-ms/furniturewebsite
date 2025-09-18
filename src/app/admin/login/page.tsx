"use client";
import { useState } from "react";
import Container from "@/components/ui/Container";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      toast.success("Welcome back");
      router.push("/admin");
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] grid place-items-center">
      <div className="w-full max-w-sm rounded-2xl border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-extrabold tracking-tight">Admin Login</h1>
        <p className="mt-1 text-sm text-neutral-600">Sign in to continue</p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <label className="text-sm block">
            <span className="mb-1 block text-neutral-700">Email</span>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full h-11 rounded-xl border px-4 focus:outline-none focus:ring-2 focus:ring-black/10"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
            />
          </label>
          <label className="text-sm block">
            <span className="mb-1 block text-neutral-700">Password</span>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full h-11 rounded-xl border px-4 focus:outline-none focus:ring-2 focus:ring-black/10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </label>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className={`h-11 w-full rounded-full text-white transition-colors ${
              loading
                ? "bg-black/70 cursor-not-allowed"
                : "bg-black hover:bg-gray-900 cursor-pointer"
            }`}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
