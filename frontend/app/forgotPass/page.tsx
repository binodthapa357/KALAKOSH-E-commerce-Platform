"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

type Step = "email" | "code" | "reset" | "done";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const requestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Could not find an account with that email.");
        setLoading(false);
        return;
      }
      setStep("code");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/verify-reset-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Invalid or expired code.");
        setLoading(false);
        return;
      }
      setStep("reset");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Could not reset password.");
        setLoading(false);
        return;
      }
      setStep("done");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF7F0] flex items-center justify-center px-4 py-12 font-sans">
      <div className="w-full max-w-md bg-white rounded-lg border border-[#EADCC9] shadow-sm p-8">
        <h1 className="text-2xl font-serif font-semibold text-[#8B3232] text-center mb-1">
          Reset Password
        </h1>
        <p className="text-sm text-gray-500 text-center mb-6">
          {step === "email" && "Enter your email to receive a verification code."}
          {step === "code" && `We sent a 6-digit code to ${email}.`}
          {step === "reset" && "Choose a new password for your account."}
          {step === "done" && "Your password has been updated."}
        </p>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
            {error}
          </div>
        )}

        {step === "email" && (
          <form onSubmit={requestCode} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full border border-[#EADCC9] rounded-md px-3 py-2.5 text-sm outline-none focus:border-[#8B3232] transition-colors"
              />
            </div>
            <p className="text-xs text-gray-400">
              Signed up with Google or GitHub? Use that same button on the sign-in page instead —
              social accounts don&apos;t use a password.
            </p>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#8B3232] hover:bg-[#732828] text-white font-semibold py-2.5 rounded-md transition-colors disabled:opacity-60"
            >
              {loading ? "Sending code..." : "Send Verification Code"}
            </button>
          </form>
        )}

        {step === "code" && (
          <form onSubmit={verifyCode} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Verification Code</label>
              <input
                type="text"
                required
                inputMode="numeric"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="123456"
                className="w-full border border-[#EADCC9] rounded-md px-3 py-2.5 text-sm text-center tracking-[8px] outline-none focus:border-[#8B3232] transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#8B3232] hover:bg-[#732828] text-white font-semibold py-2.5 rounded-md transition-colors disabled:opacity-60"
            >
              {loading ? "Verifying..." : "Verify Code"}
            </button>
            <button
              type="button"
              onClick={() => setStep("email")}
              className="text-xs text-gray-400 hover:text-[#8B3232]"
            >
              Wrong email? Go back
            </button>
          </form>
        )}

        {step === "reset" && (
          <form onSubmit={resetPassword} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">New Password</label>
              <input
                type="password"
                required
                minLength={8}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 8 characters"
                className="w-full border border-[#EADCC9] rounded-md px-3 py-2.5 text-sm outline-none focus:border-[#8B3232] transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Confirm New Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full border border-[#EADCC9] rounded-md px-3 py-2.5 text-sm outline-none focus:border-[#8B3232] transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#8B3232] hover:bg-[#732828] text-white font-semibold py-2.5 rounded-md transition-colors disabled:opacity-60"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        )}

        {step === "done" && (
          <button
            onClick={() => router.push("/signin")}
            className="w-full bg-[#8B3232] hover:bg-[#732828] text-white font-semibold py-2.5 rounded-md transition-colors"
          >
            Go to Sign In
          </button>
        )}

        <p className="text-center text-sm text-gray-500 mt-6">
          Remembered your password?{" "}
          <Link href="/signin" className="text-[#8B3232] font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}