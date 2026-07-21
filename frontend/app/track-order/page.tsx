"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { Search, Loader2, AlertCircle, Package, MapPin, DollarSign, Calendar } from "lucide-react";
import { toast } from "sonner";

interface OrderItem {
  _id: string;
  product_id: {
    _id: string;
    name: string;
    price: number;
    images?: string[];
    region?: string;
    material?: string;
  };
  quantity: number;
  price_at_purchase: number;
  item_status: string;
}

interface OrderDetails {
  _id: string;
  order_number: string;
  subtotal: number;
  shipping_cost: number;
  discount: number;
  total_amount: number;
  shipping_address: {
    name: string;
    street: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    phone: string;
  };
  payment_method: string;
  payment_status: string;
  order_status: string;
  createdAt: string;
}

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const { user } = useApp();

  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState<{ order: OrderDetails; items: OrderItem[] } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  // Auto-fill and auto-submit if parameters are present in URL or logged-in user
  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
    }

    const urlOrderNum = searchParams.get("orderNumber");
    if (urlOrderNum) {
      setOrderNumber(urlOrderNum);
      const storedEmail = user?.email || "";
      if (storedEmail) {
        handleTrack(urlOrderNum, storedEmail);
      }
    }
  }, [searchParams, user]);

  const handleTrack = async (orderNum: string, trackingEmail: string) => {
    if (!orderNum || !trackingEmail) {
      setError("Please enter both Order Number and Email Address");
      return;
    }

    setLoading(true);
    setError(null);
    setOrderData(null);

    try {
      const res = await fetch(
        `${API_URL}/api/orders/track?orderNumber=${encodeURIComponent(orderNum.trim())}&email=${encodeURIComponent(trackingEmail.trim())}`
      );
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to find order details. Please double check credentials.");
      }

      setOrderData(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong while retrieving order details.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleTrack(orderNumber, email);
  };

  // Timeline Stepper Config
  const steps = [
    { key: "pending", title: "Order Placed", desc: "Awaiting confirmation" },
    { key: "confirmed", title: "Confirmed", desc: "Payment received" },
    { key: "processing", title: "Processing", desc: "Crafting by local artisans" },
    { key: "shipped", title: "Shipped", desc: "In transit for delivery" },
    { key: "delivered", title: "Delivered", desc: "Package delivered safely" },
  ];

  // Helper to determine step status
  const getStepIndex = (status: string) => {
    const map: Record<string, number> = {
      pending: 0,
      confirmed: 1,
      processing: 2,
      shipped: 3,
      delivered: 4,
    };
    return map[status] ?? 0;
  };

  const activeStepIndex = orderData ? getStepIndex(orderData.order.order_status) : -1;
  const isCancelled = orderData?.order.order_status === "cancelled";

  return (
    <div className="min-h-screen bg-[#FBF8F3] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Breadcrumb */}
        <nav className="text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-primary-700">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground font-medium">Track Order</span>
        </nav>

        <div className="text-center max-w-xl mx-auto mb-10">
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-primary-800 tracking-wide">
            Track Your Order
          </h1>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base">
            Check the real-time status of your artisan craftworks from creation to delivery.
          </p>
        </div>

        {/* Search Card */}
        <div className="bg-white border border-border rounded-3xl p-6 sm:p-8 shadow-sm mb-10">
          <form onSubmit={handleFormSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-end">
            <div className="sm:col-span-5">
              <label className="block text-xs font-bold text-primary-800 uppercase tracking-wide mb-2">
                Order Number *
              </label>
              <input
                type="text"
                required
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="e.g. KLK-0001"
                className="w-full border border-border bg-[#FDFBF7] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 uppercase"
              />
            </div>
            <div className="sm:col-span-5">
              <label className="block text-xs font-bold text-primary-800 uppercase tracking-wide mb-2">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. buyer@example.com"
                className="w-full border border-border bg-[#FDFBF7] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
              />
            </div>
            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-700 hover:bg-primary-800 text-white font-semibold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-sm h-[46px]"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    Track
                  </>
                )}
              </button>
            </div>
          </form>
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-100 text-red-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Tracking Details */}
        {orderData && (
          <div className="space-y-8 animate-fade-in">
            {/* Timeline Stepper */}
            <div className="bg-white border border-border rounded-3xl p-6 sm:p-8 shadow-sm">
              <h2 className="text-xl font-serif font-bold text-[#5C2E2E] mb-8 border-b border-border pb-3 flex items-center gap-2.5">
                <Package className="w-5 h-5 text-primary-700" />
                Delivery Timeline
              </h2>

              {isCancelled ? (
                <div className="bg-red-50 border border-red-100 p-5 rounded-2xl text-center space-y-2">
                  <h3 className="text-red-700 font-bold text-lg font-serif">Order Cancelled</h3>
                  <p className="text-red-600 text-sm max-w-sm mx-auto">
                    This order was cancelled. If you believe this is a mistake, please reach out to our Help & Support center.
                  </p>
                </div>
              ) : (
                <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-8 md:gap-4 md:px-4">
                  {/* Grid / Flex for steps */}
                  {steps.map((stepItem, idx) => {
                    const isCompleted = idx <= activeStepIndex;
                    const isActive = idx === activeStepIndex;
                    
                    return (
                      <div key={stepItem.key} className="flex md:flex-col items-center md:text-center flex-1 relative w-full gap-4 md:gap-2">
                        {/* Step Bubble */}
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-xs transition-all z-10 ${
                            isCompleted
                              ? "bg-primary-700 text-white"
                              : "bg-gray-100 text-gray-400 border border-gray-200"
                          } ${isActive ? "ring-4 ring-primary-100 scale-105" : ""}`}
                        >
                          {idx + 1}
                        </div>

                        {/* Step label */}
                        <div className="text-left md:text-center">
                          <h4 className={`text-sm font-bold ${isCompleted ? "text-primary-800" : "text-gray-400"}`}>
                            {stepItem.title}
                          </h4>
                          <p className="text-xs text-muted-foreground mt-0.5 max-w-[130px] line-clamp-2 md:mx-auto">
                            {stepItem.desc}
                          </p>
                        </div>

                        {/* Connector Line (Only for MD screens and above) */}
                        {idx < steps.length - 1 && (
                          <div
                            className={`hidden md:block absolute top-5 left-[calc(50%+20px)] w-[calc(100%-40px)] h-0.5 z-0 ${
                              idx < activeStepIndex ? "bg-primary-700" : "bg-gray-200"
                            }`}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Split details layout */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              
              {/* Order summary info */}
              <div className="md:col-span-4 bg-white border border-border rounded-3xl p-6 shadow-sm h-fit space-y-6">
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Order Details</h3>
                  <div className="space-y-3.5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status</span>
                      <span className="font-semibold capitalize text-primary-700">{orderData.order.order_status}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Order Date</span>
                      <span className="font-semibold text-foreground">
                        {new Date(orderData.order.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Payment Status</span>
                      <span className="font-semibold capitalize text-foreground">{orderData.order.payment_status}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Payment Method</span>
                      <span className="font-semibold text-foreground">{orderData.order.payment_method}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-border pt-5">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Shipping Address</h3>
                  <div className="text-sm text-foreground space-y-1.5">
                    <p className="font-bold flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-primary-700 flex-shrink-0" />
                      {orderData.order.shipping_address.name}
                    </p>
                    <p className="text-muted-foreground pl-5">{orderData.order.shipping_address.street}</p>
                    <p className="text-muted-foreground pl-5">
                      {orderData.order.shipping_address.city}, {orderData.order.shipping_address.state}
                    </p>
                    <p className="text-muted-foreground pl-5">{orderData.order.shipping_address.postal_code}, Nepal</p>
                    <p className="text-muted-foreground pl-5">Phone: {orderData.order.shipping_address.phone}</p>
                  </div>
                </div>
              </div>

              {/* Order items and breakdown */}
              <div className="md:col-span-8 bg-white border border-border rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                <h3 className="text-base font-serif font-bold text-primary-800 border-b border-border pb-3">Items in Order</h3>
                
                {/* Items */}
                <div className="divide-y divide-border">
                  {orderData.items.map((item) => {
                    const price = item.price_at_purchase;
                    const imgUrl = item.product_id?.images?.[0] || "/placeholder.svg";
                    return (
                      <div key={item._id} className="flex gap-4 py-4.5 first:pt-0 last:pb-0 items-center">
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-muted border border-border flex-shrink-0">
                          <img
                            src={imgUrl}
                            alt={item.product_id?.name || "Product"}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm text-foreground line-clamp-1">
                            {item.product_id?.name || "Artisan Craft"}
                          </h4>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {item.product_id?.region} • {item.product_id?.material}
                          </p>
                          <div className="flex items-center gap-3 mt-1.5">
                            <span className="text-xs font-semibold bg-gray-100 px-2 py-0.5 rounded text-gray-600">
                              Qty: {item.quantity}
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                              item.item_status === "delivered"
                                ? "bg-green-50 text-green-700"
                                : item.item_status === "cancelled"
                                ? "bg-red-50 text-red-600"
                                : "bg-[#FBF3E7] text-[#5C2E2E]"
                            }`}>
                              {item.item_status}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-sm text-primary-700">
                            Rs. {(price * item.quantity).toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Calculation breakdown table */}
                <div className="border-t border-border pt-5 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-semibold text-foreground">Rs. {orderData.order.subtotal.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping Cost</span>
                    <span className="font-semibold text-foreground">
                      {orderData.order.shipping_cost === 0 ? "Free" : `Rs. ${orderData.order.shipping_cost.toLocaleString("en-IN")}`}
                    </span>
                  </div>
                  {orderData.order.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-Rs. {orderData.order.discount.toLocaleString("en-IN")}</span>
                    </div>
                  )}
                  <div className="border-t border-border pt-4 flex justify-between items-baseline font-bold">
                    <span className="text-base text-foreground">Total Paid</span>
                    <span className="text-xl text-primary-700">Rs. {orderData.order.total_amount.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#FBF8F3]">
        <Loader2 className="w-10 h-10 text-primary-700 animate-spin" />
      </div>
    }>
      <TrackOrderContent />
    </Suspense>
  );
}
