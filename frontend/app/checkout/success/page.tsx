"use client";

import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Calendar, ArrowRight, ShieldCheck, ShoppingBag } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { Suspense } from "react";

function SuccessPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useApp();

  const orderNumber = searchParams.get("orderNumber") || "KLK-XXXX";
  const refId = searchParams.get("refId");
  const paidAmount = searchParams.get("paidAmount");

  return (
    <div className="min-h-screen bg-[#FBF8F3] py-16 flex items-center justify-center">
      <div className="max-w-xl w-full px-4">
        <div className="bg-white border border-border rounded-3xl p-8 sm:p-10 shadow-md text-center space-y-6">
          
          {/* Checkmark icon */}
          <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle className="w-10 h-10" />
          </div>

          {/* Success Title */}
          <div className="space-y-2">
            <h1 className="text-3xl font-serif font-bold text-foreground tracking-wide">
              Order Placed Successfully!
            </h1>
            <p className="text-muted-foreground text-sm max-w-sm mx-auto leading-relaxed">
              Thank you {user?.name ? `, ${user.name}` : ""}! Your order has been placed and is currently being processed by our local artisans.
            </p>
          </div>

          {/* Order info Box */}
          <div className="bg-[#FDFBF7] border border-border rounded-2xl p-5 text-left space-y-3.5">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Order Number</span>
              <span className="font-bold text-primary-700 tracking-wider bg-primary-50 px-2.5 py-1 rounded-md text-xs">
                {orderNumber}
              </span>
            </div>
            {refId && (
              <div className="flex justify-between items-center text-sm border-t border-border/60 pt-3">
                <span className="text-muted-foreground">eSewa Reference ID</span>
                <span className="font-semibold text-foreground tracking-wide text-xs">
                  {refId}
                </span>
              </div>
            )}
            {paidAmount && (
              <div className="flex justify-between items-center text-sm border-t border-border/60 pt-3">
                <span className="text-muted-foreground">Amount Paid</span>
                <span className="font-bold text-foreground">
                  Rs. {Number(paidAmount).toLocaleString("en-IN")}
                </span>
              </div>
            )}
            <div className="flex justify-between items-center text-sm border-t border-border/60 pt-3">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-primary-700" />
                Est. Delivery
              </span>
              <span className="font-semibold text-foreground">
                3 - 5 Business Days
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-4 space-y-3">
            <Link
              href={`/track-order?orderNumber=${orderNumber}`}
              className="w-full bg-primary-700 hover:bg-primary-800 text-white font-semibold py-3.5 px-6 rounded-full transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 text-sm cursor-pointer"
            >
              Track Order Status
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/shop"
              className="w-full border border-border hover:bg-[#FDFBF7] text-foreground font-semibold py-3.5 px-6 rounded-full transition-all flex items-center justify-center gap-2 text-sm cursor-pointer bg-white"
            >
              <ShoppingBag className="w-4 h-4 text-primary-700" />
              Continue Shopping
            </Link>
          </div>

          {/* Guarantee stamp */}
          <div className="pt-4 border-t border-border flex justify-center items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="w-5 h-5 text-primary-600" />
            Guaranteed authentic Nepalese heritage craftwork.
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#FBF8F3]">
        <div className="w-10 h-10 border-4 border-primary-700 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <SuccessPageContent />
    </Suspense>
  );
}
