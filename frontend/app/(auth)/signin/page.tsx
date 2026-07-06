"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthLayout, { AuthFooterLink } from "@/components/AuthLayout";

export default function SignInPage() {
    const router = useRouter();
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Invalid email or password");
            }

            localStorage.setItem("token", data.token);
            router.push("/");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            heroImage="/images/heritage.png"
            heroTitle="Welcome back to"
            heroHighlight="Kalakosh"
            heroSubtitle="Continue your journey through Nepal's living heritage."
        >
            <h1 className="text-4xl font-semibold text-primary-500">Sign in</h1>
            <p className="mt-2 text-brown-400">Welcome back, friend of artisans.</p>

            <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
                <div>
                    <label className="mb-1 block text-sm text-brown-400">Email</label>
                    <input
                        type="email"
                        name="email"
                        required
                        value={form.email}
                        onChange={handleChange}
                        className="h-12 w-full rounded-xl border border-brown-100 px-4 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-200"
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm text-brown-400">Password</label>
                    <input
                        type="password"
                        name="password"
                        required
                        value={form.password}
                        onChange={handleChange}
                        className="h-12 w-full rounded-xl border border-brown-100 px-4 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-200"
                    />
                </div>

                <div className="text-right text-sm text-brown-400 cursor-pointer hover:text-primary-500">
                    Forgot password?
                </div>

                {error && <p className="text-sm text-destructive">{error}</p>}

                <button
                    type="submit"
                    disabled={loading}
                    className="h-12 rounded-full bg-primary-500 text-white font-medium transition hover:bg-primary-600 disabled:opacity-60"
                >
                    {loading ? "Signing in..." : "Sign in"}
                </button>
            </form>

            <AuthFooterLink prompt="New here?" linkText="Create an account" href="/signup" />
        </AuthLayout>
    );
}