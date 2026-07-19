"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthLayout from "@/components/AuthLayout";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight } from "lucide-react";

export default function SignInPage() {
    const router = useRouter();
    const [form, setForm] = useState({ email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setError(null);
        setLoading(true);

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(form),
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Invalid email or password");
            }

            localStorage.setItem("token", data.token);
            
            // Dispatch storage event to notify other layout parts
            window.dispatchEvent(new Event('storage'));
            
            const role = data.user?.role;
            if (role === "vendor") {
                router.push("/vendor/dashboard");
            } else if (role === "admin") {
                router.push("/admin");
            } else {
                router.push("/");
            }
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Something went wrong"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            heroImage="/images/auth_signin_hero.png"
            heroTitle="Welcome back to"
            heroHighlight="Kalakosh"
            heroSubtitle="Continue supporting authentic Nepalese craftsmanship and explore newly added masterpieces."
            reverse={true}
        >
            <div className="w-full">
                <div className="mb-8">
                    <h1 className="text-3xl font-serif font-bold text-[#5C2E2E]">Sign In</h1>
                    <p className="mt-2 text-sm text-stone-500">Welcome back, friend of Nepalese artisans.</p>
                </div>

                {error && (
                    <div className="mb-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                        <AlertCircle className="h-5 w-5 shrink-0" />
                        <div>{error}</div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Email Field */}
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">Email Address</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-stone-400">
                                <Mail className="h-5 w-5" />
                            </span>
                            <input
                                type="email"
                                name="email"
                                required
                                placeholder="arjun@example.com"
                                value={form.email}
                                onChange={handleChange}
                                className="h-12 w-full rounded-xl border border-stone-200 bg-white pl-11 pr-4 text-stone-800 placeholder-stone-400 outline-none transition focus:border-[#8B3232] focus:ring-4 focus:ring-[#8B3232]/10"
                            />
                        </div>
                    </div>

                    {/* Password Field */}
                    <div>
                        <div className="flex justify-between items-center mb-1.5">
                            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600">Password</label>
                            <Link href="/forgot-password" className="text-xs font-semibold text-[#8B3232] hover:text-[#5C1A1A] hover:underline">
                                Forgot Password?
                            </Link>
                        </div>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-stone-400">
                                <Lock className="h-5 w-5" />
                            </span>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                required
                                placeholder="••••••••"
                                value={form.password}
                                onChange={handleChange}
                                className="h-12 w-full rounded-xl border border-stone-200 bg-white pl-11 pr-12 text-stone-800 placeholder-stone-400 outline-none transition focus:border-[#8B3232] focus:ring-4 focus:ring-[#8B3232]/10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 flex items-center pr-4 text-stone-400 hover:text-stone-600"
                            >
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#5C1A1A] font-semibold text-white transition hover:bg-[#8B3232] disabled:opacity-60 disabled:pointer-events-none shadow-sm shadow-[#5C1A1A]/20"
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <svg className="h-5 w-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Signing In...
                            </span>
                        ) : (
                            <>
                                Sign In
                                <ArrowRight className="h-4 w-4" />
                            </>
                        )}
                    </button>
                </form>

                <p className="mt-8 text-center text-sm text-stone-500">
                    New to Kalakosh?{" "}
                    <Link href="/signup" className="font-semibold text-[#8B3232] hover:text-[#5C1A1A] hover:underline">
                        Create an account
                    </Link>
                </p>
            </div>
        </AuthLayout>
    );
}