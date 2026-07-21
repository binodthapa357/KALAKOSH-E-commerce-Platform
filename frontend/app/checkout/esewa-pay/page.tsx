"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Lock, ShieldCheck, Phone, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

function EsewaPayContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const orderNumber = searchParams.get("orderNumber");
  const amountStr = searchParams.get("amount");
  const amount = Number(amountStr) || 0;

  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Login, 2: OTP, 3: Success animation/redirecting
  const [esewaId, setEsewaId] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    if (!orderNumber || amount === 0) {
      toast.error("Invalid payment parameters");
      router.push("/cart");
    }
  }, [orderNumber, amount]);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!esewaId || !password) {
      toast.error("Please fill in eSewa ID and password");
      return;
    }
    setLoading(true);
    // Simulate API delay
    setTimeout(() => {
      setLoading(false);
      setStep(2);
      toast.success("Verification code sent to your mobile number");
    }, 1200);
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length < 4) {
      toast.error("Please enter a valid OTP code");
      return;
    }

    setLoading(true);

    try {
      // Create a mock transaction ID
      const refId = `ESW-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

      const res = await fetch(`${API_URL}/api/payments/verify/esewa`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          oid: orderNumber,
          amt: amount,
          refId: refId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "eSewa verification failed");
      }

      // Success! Proceed to final step and redirect
      setStep(3);
      toast.success("Payment verified successfully!");
      
      setTimeout(() => {
        router.push(`/checkout/success?orderNumber=${orderNumber}&refId=${refId}&paidAmount=${amount}`);
      }, 2000);
    } catch (err: any) {
      toast.error(err.message || "Failed to verify eSewa payment");
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex flex-col justify-between font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-3 shadow-xs">
        <div className="max-w-md mx-auto px-4 flex justify-between items-center">
          <img
            src="https://esewa.com.np/common/images/esewa_logo.png"
            alt="eSewa Logo"
            className="h-10 object-contain"
          />
          <div className="flex items-center gap-1.5 text-xs text-gray-500 font-semibold">
            <Lock className="w-3.5 h-3.5 text-[#41A124]" />
            Secure Checkout
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Top Banner */}
          <div className="bg-[#41A124] px-6 py-4 text-white flex justify-between items-center">
            <div>
              <p className="text-xs text-white/80 uppercase tracking-wider font-semibold">Merchant</p>
              <h3 className="font-bold text-lg font-serif">KALAKOSH Handicrafts</h3>
            </div>
            <div className="text-right">
              <p className="text-xs text-white/80 uppercase tracking-wider font-semibold">Amount</p>
              <h3 className="font-extrabold text-xl">Rs. {amount.toLocaleString("en-IN")}</h3>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            {step === 1 && (
              <form onSubmit={handleLoginSubmit} className="space-y-5">
                <div className="text-center mb-6">
                  <h2 className="text-lg font-bold text-gray-800">Login to eSewa Account</h2>
                  <p className="text-xs text-gray-500 mt-1">Enter your credentials to proceed with payment</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">
                      eSewa ID (Mobile or Email)
                    </label>
                    <input
                      type="text"
                      required
                      value={esewaId}
                      onChange={(e) => setEsewaId(e.target.value)}
                      placeholder="98XXXXXXXX or email@address.com"
                      className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#41A124] focus:ring-1 focus:ring-[#41A124]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">
                      Password / MPIN
                    </label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#41A124] focus:ring-1 focus:ring-[#41A124]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#41A124] hover:bg-[#34861c] text-white font-bold py-3 rounded-lg transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    "Login & Pay"
                  )}
                </button>

                <div className="pt-4 border-t border-gray-100 flex justify-center items-center gap-1.5 text-xs text-gray-400">
                  <ShieldCheck className="w-4 h-4 text-gray-400" />
                  Your credentials are encrypted and secure.
                </div>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleOtpSubmit} className="space-y-5">
                <div className="text-center mb-6">
                  <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-3 text-[#41A124]">
                    <Phone className="w-6 h-6" />
                  </div>
                  <h2 className="text-lg font-bold text-gray-800">Verify Payment OTP</h2>
                  <p className="text-xs text-gray-500 mt-1">
                    An OTP code has been sent to your registered number ending in <strong>{esewaId.slice(-4)}</strong>
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5 text-center">
                    Enter Verification Code
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter 6-digit OTP (e.g. 123456)"
                    className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm font-semibold tracking-widest text-center focus:outline-none focus:border-[#41A124] focus:ring-1 focus:ring-[#41A124]"
                  />
                  <p className="text-[10px] text-gray-400 text-center mt-1">For simulation, any code (e.g. 123456) is accepted.</p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#41A124] hover:bg-[#34861c] text-white font-bold py-3 rounded-lg transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Verifying Payment...
                    </>
                  ) : (
                    "Confirm & Pay"
                  )}
                </button>

                <div className="flex justify-between items-center text-xs pt-2">
                  <span className="text-gray-400">Order ID: {orderNumber}</span>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-[#41A124] font-semibold hover:underline"
                  >
                    Go Back
                  </button>
                </div>
              </form>
            )}

            {step === 3 && (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 bg-green-50 text-[#41A124] rounded-full flex items-center justify-center mx-auto animate-bounce">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Payment Completed!</h2>
                <p className="text-sm text-gray-500 max-w-xs mx-auto">
                  Your eSewa transaction was successful. Redirecting you back to KALAKOSH to display your confirmation receipt...
                </p>
                <div className="flex items-center justify-center gap-2 text-xs text-gray-400 pt-4">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Please do not close or refresh this page.
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 py-3 text-center text-[10px] text-gray-400 border-t border-gray-200">
        © eSewa Nepal Pvt. Ltd. | Powered by eSewa Developer Sandbox Simulation
      </footer>
    </div>
  );
}

export default function EsewaPayPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#F0F2F5]">
        <Loader2 className="w-10 h-10 text-[#41A124] animate-spin" />
      </div>
    }>
      <EsewaPayContent />
    </Suspense>
  );
}
