"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { clearCart as clearLocalCart, getCart } from "@/lib/cart";
import { CreditCard, Truck, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface CartItem {
  product: {
    _id: string;
    name: string;
    price: number;
    discount_price?: number;
    images?: string[];
  };
  quantity: number;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { token, user } = useApp();
  const syncRef = useRef(false);
  
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [subtotal, setSubtotal] = useState(0);
  const [shippingCost, setShippingCost] = useState(150);
  const [placingOrder, setPlacingOrder] = useState(false);

  // Form fields
  const [name, setName] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "eSewa">("eSewa");

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const syncLocalCartToBackend = async (authToken: string, localItems: any[]) => {
    try {
      // 1. Clear backend cart first
      await fetch(`${API_URL}/api/cart`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${authToken}` },
      });

      // 2. Add each local item to backend cart
      for (const item of localItems) {
        await fetch(`${API_URL}/api/cart`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            product_id: item.productId,
            quantity: item.quantity,
          }),
        });
      }
    } catch (error) {
      console.error("Error syncing cart to backend:", error);
    }
  };

  // Redirect if not logged in
  useEffect(() => {
    const storedToken = localStorage.getItem("token") || token;
    if (!storedToken) {
      toast.error("Please sign in to access checkout");
      router.push("/signin?redirect=/checkout");
      return;
    }

    if (user) {
      setName(user.name || "");
    }

    const runSyncAndFetch = async () => {
      if (!syncRef.current) {
        syncRef.current = true;
        const localCart = getCart();
        if (localCart.length > 0) {
          await syncLocalCartToBackend(storedToken, localCart);
        }
      }
      await fetchCart(storedToken);
    };

    runSyncAndFetch();
  }, [token, user]);

  const fetchCart = async (authToken: string) => {
    try {
      const res = await fetch(`${API_URL}/api/cart`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const data = await res.json();
      if (res.ok && data.success && data.cart) {
        const items = data.cart.items.map((item: any) => ({
          product: item.product_id,
          quantity: item.quantity,
        })).filter((item: any) => item.product !== null); // Filter out any deleted products
        
        setCartItems(items);
        
        // Calculate subtotal
        const sub = items.reduce((sum: number, item: CartItem) => {
          const price = item.product.discount_price ?? item.product.price;
          return sum + price * item.quantity;
        }, 0);
        setSubtotal(sub);
      } else {
        toast.error("Failed to load your cart");
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      toast.error("Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  // Recalculate shipping cost client-side dynamically as user inputs city/state
  useEffect(() => {
    if (subtotal === 0) return;
    
    if (subtotal >= 5000) {
      setShippingCost(0);
      return;
    }

    const normalizedCity = city.trim().toLowerCase();
    const normalizedState = state.trim().toLowerCase();

    if (
      ["kathmandu", "lalitpur", "bhaktapur", "kirtipur"].includes(normalizedCity) ||
      normalizedState === "bagmati"
    ) {
      setShippingCost(100);
    } else if (
      ["pokhara", "biratnagar", "butwal", "chitwan", "dharan", "birgunj", "nepalgunj", "hetauda", "itahari"].includes(
        normalizedCity
      )
    ) {
      setShippingCost(150);
    } else if (
      [
        "solukhumbu",
        "mustang",
        "manang",
        "dolpa",
        "jumla",
        "humla",
        "mugu",
        "kalikot",
        "darchula",
        "taplejung",
        "sankhuwasabha",
      ].includes(normalizedCity)
    ) {
      setShippingCost(250);
    } else {
      setShippingCost(200);
    }
  }, [city, state, subtotal]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const storedToken = localStorage.getItem("token") || token;

    if (!storedToken) {
      toast.error("Session expired. Please sign in again.");
      router.push("/signin?redirect=/checkout");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    if (!name || !street || !city || !state || !phone) {
      toast.error("Please fill in all required shipping fields");
      return;
    }

    setPlacingOrder(true);

    try {
      const orderBody = {
        shipping_address: {
          name,
          street,
          city,
          state,
          postal_code: postalCode || "00000",
          country: "Nepal",
          phone,
        },
        payment_method: paymentMethod,
      };

      const res = await fetch(`${API_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedToken}`,
        },
        body: JSON.stringify(orderBody),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create order");
      }

      // Order created successfully!
      // Clear local storage cart state
      clearLocalCart();
      
      // Also update the global context cart count
      window.dispatchEvent(new Event("kalakosh-cart-updated"));

      const order = data.order;

      if (paymentMethod === "eSewa") {
        // Redirect to simulated eSewa page
        router.push(
          `/checkout/esewa-pay?orderNumber=${order.order_number}&amount=${order.total_amount}`
        );
      } else {
        // COD order completed immediately
        toast.success("Order placed successfully with Cash on Delivery!");
        router.push(`/checkout/success?orderNumber=${order.order_number}`);
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong while placing order");
      console.error(err);
    } finally {
      setPlacingOrder(false);
    }
  };

  const totalAmount = subtotal + shippingCost;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-primary-700 animate-spin" />
          <p className="text-muted-foreground font-medium">Loading checkout...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBF8F3] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-primary-800 tracking-wide mb-10">
          Checkout
        </h1>

        {cartItems.length === 0 ? (
          <div className="bg-white border border-border p-12 rounded-3xl text-center shadow-sm max-w-xl mx-auto">
            <AlertCircle className="w-12 h-12 text-primary-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-foreground mb-2">No items to checkout</h2>
            <p className="text-muted-foreground mb-6">Your shopping cart is currently empty.</p>
            <Link
              href="/shop"
              className="bg-primary-700 hover:bg-primary-800 text-white font-semibold py-2.5 px-6 rounded-full transition-colors inline-block"
            >
              Go to Shop
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Column: Form */}
            <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-8">
              {/* Shipping Information Card */}
              <div className="bg-white border border-border rounded-3xl p-6 sm:p-8 shadow-sm">
                <h2 className="text-2xl font-serif font-bold text-[#5C2E2E] mb-6 flex items-center gap-3">
                  <Truck className="w-6 h-6 text-primary-700" />
                  Shipping Information
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#5C2E2E] mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Ram Bahadur"
                      className="w-full border border-border bg-[#FDFBF7] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-[#5C2E2E] mb-2">
                        Contact Phone *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. 98XXXXXXXX"
                        className="w-full border border-border bg-[#FDFBF7] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#5C2E2E] mb-2">
                        Street Address *
                      </label>
                      <input
                        type="text"
                        required
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        placeholder="e.g. 12 Artisans Road, Thamel"
                        className="w-full border border-border bg-[#FDFBF7] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-[#5C2E2E] mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="e.g. Kathmandu"
                        className="w-full border border-border bg-[#FDFBF7] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#5C2E2E] mb-2">
                        State / Province *
                      </label>
                      <input
                        type="text"
                        required
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        placeholder="e.g. Bagmati"
                        className="w-full border border-border bg-[#FDFBF7] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#5C2E2E] mb-2">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        placeholder="e.g. 44600"
                        className="w-full border border-border bg-[#FDFBF7] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Methods Card */}
              <div className="bg-white border border-border rounded-3xl p-6 sm:p-8 shadow-sm">
                <h2 className="text-2xl font-serif font-bold text-[#5C2E2E] mb-6 flex items-center gap-3">
                  <CreditCard className="w-6 h-6 text-primary-700" />
                  Select Payment Method
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* eSewa */}
                  <label
                    className={`border rounded-2xl p-5 flex flex-col justify-between cursor-pointer transition-all ${
                      paymentMethod === "eSewa"
                        ? "border-[#41A124] bg-[#41A124]/5 ring-2 ring-[#41A124]/20"
                        : "border-border hover:bg-[#FDFBF7]"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === "eSewa"}
                          onChange={() => setPaymentMethod("eSewa")}
                          className="text-[#41A124] focus:ring-[#41A124] h-4 w-4"
                        />
                        <span className="font-bold text-foreground">eSewa Pay</span>
                      </div>
                      <span className="bg-[#41A124] text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                        Instant
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground max-w-[200px]">
                        Pay using eSewa mobile wallet portal. (Mock API Sandbox)
                      </p>
                      <img
                        src="https://esewa.com.np/common/images/esewa_logo.png"
                        alt="eSewa Logo"
                        className="h-7 object-contain bg-white px-1.5 py-0.5 rounded border border-gray-100"
                      />
                    </div>
                  </label>

                  {/* Cash on Delivery */}
                  <label
                    className={`border rounded-2xl p-5 flex flex-col justify-between cursor-pointer transition-all ${
                      paymentMethod === "COD"
                        ? "border-primary-700 bg-primary-50/20 ring-2 ring-primary-300/35"
                        : "border-border hover:bg-[#FDFBF7]"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === "COD"}
                          onChange={() => setPaymentMethod("COD")}
                          className="text-primary-700 focus:ring-primary-700 h-4 w-4"
                        />
                        <span className="font-bold text-foreground">Cash on Delivery</span>
                      </div>
                      <span className="bg-gray-200 text-gray-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                        Offline
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Pay with cash upon delivery. Recommended for remote locations.
                    </p>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={placingOrder}
                className="w-full bg-primary-700 hover:bg-primary-800 text-white font-semibold py-4 rounded-2xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-base"
              >
                {placingOrder ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Placing Order...
                  </>
                ) : paymentMethod === "eSewa" ? (
                  `Pay Rs. ${totalAmount.toLocaleString("en-IN")} with eSewa`
                ) : (
                  `Confirm COD Order (Rs. ${totalAmount.toLocaleString("en-IN")})`
                )}
              </button>
            </form>

            {/* Right Column: Order Summary */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white border border-border rounded-3xl p-6 sm:p-8 shadow-sm h-fit">
                <h2 className="text-xl font-serif font-bold text-primary-800 mb-6 border-b border-border pb-3">
                  Items in Order
                </h2>

                {/* Items List */}
                <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
                  {cartItems.map((item) => {
                    const price = item.product.discount_price ?? item.product.price;
                    const imgUrl = item.product.images?.[0] || "/placeholder.svg";
                    return (
                      <div key={item.product._id} className="flex gap-4 items-center">
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-muted border border-border flex-shrink-0">
                          <img
                            src={imgUrl}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm text-foreground line-clamp-1">
                            {item.product.name}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            Qty: {item.quantity}
                          </p>
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

                {/* Totals Table */}
                <div className="border-t border-border mt-6 pt-6 space-y-3.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-semibold text-foreground">
                      Rs. {subtotal.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      Shipping
                      {shippingCost === 0 && (
                        <span className="bg-green-100 text-green-700 text-[10px] px-1.5 py-0.5 rounded font-bold uppercase">
                          Free
                        </span>
                      )}
                    </span>
                    <span className="font-semibold text-foreground">
                      {shippingCost === 0 ? "Free" : `Rs. ${shippingCost.toLocaleString("en-IN")}`}
                    </span>
                  </div>
                  <div className="border-t border-border pt-4 flex justify-between items-baseline">
                    <span className="text-base font-serif font-bold text-foreground">Total Amount</span>
                    <span className="text-2xl font-bold text-primary-700">
                      Rs. {totalAmount.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                {/* Info Note */}
                {shippingCost > 0 && subtotal < 5000 && (
                  <div className="mt-6 p-4 bg-primary-50/30 border border-primary-100 rounded-2xl flex items-start gap-2.5">
                    <AlertCircle className="w-5 h-5 text-primary-700 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-primary-900 leading-relaxed">
                      Add products worth Rs. <strong>{(5000 - subtotal).toLocaleString("en-IN")}</strong> more to qualify for <strong>FREE Shipping</strong>!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
