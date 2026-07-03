"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthLayout, { AuthFooterLink } from "@/components/AuthLayout";

export default function SignUpPage() {
    const router = useRouter();
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (form.password !== form.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: form.name,
                    email: form.email,
                    password: form.password,
                }),
            });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Registration failed");
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
            heroTitle="Begin your"
            heroHighlight="heritage journey"
            heroSubtitle="Every account supports a Nepali artisan family."
        >
            <h1 className="text-4xl font-semibold text-primary-500">Create account</h1>
            <p className="mt-2 text-brown-400">Join the Kalakosh community.</p>

            <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
                {[
                    { label: "Full name", name: "name", type: "text" },
                    { label: "Email", name: "email", type: "email" },
                    { label: "Password", name: "password", type: "password" },
                    { label: "Confirm password", name: "confirmPassword", type: "password" },
                ].map((field) => (
                    <div key={field.name}>
                        <label className="mb-1 block text-sm text-brown-400">{field.label}</label>
                        <input
                            type={field.type}
                            name={field.name}
                            required
                            value={form[field.name as keyof typeof form]}
                            onChange={handleChange}
                            className="h-12 w-full rounded-xl border border-brown-100 px-4 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-200"
                        />
                    </div>
                ))}

                {error && <p className="text-sm text-destructive">{error}</p>}

                <button
                    type="submit"
                    disabled={loading}
                    className="h-12 rounded-full bg-primary-500 text-white font-medium transition hover:bg-primary-600 disabled:opacity-60"
                >
                    {loading ? "Creating account..." : "Create account"}
                </button>
            </form>

            <AuthFooterLink prompt="Already have an account?" linkText="Sign in" href="/signin" />
        </AuthLayout>
    );
}