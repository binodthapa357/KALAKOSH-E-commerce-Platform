"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

type Vendor = {
    shopName: string;
    ownerName: string;
    email: string;
    location?: string;
    rating?: number;
    joinedAt?: string;
    status: "pending" | "active" | "suspended" | "rejected";
    panNumber: string;
    panPhoto: string;
    bankDetails: {
        bank_name: string;
        account_name: string;
        account_number: string;
        branch?: string;
    };
};

type VendorOrder = {
    id: string;
    productName: string;
    productImage: string;
    buyer: string;
    date: string;
    status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
    total: number;
};

type Product = {
    id: string;
    name: string;
    image: string;
    price: number;
    stock: number;
    status: "active" | "draft" | "out_of_stock";
};

const ORDER_STATUS_STYLES: Record<VendorOrder["status"], string> = {
    pending: "bg-amber-50 text-amber-600",
    processing: "bg-blue-50 text-blue-600",
    shipped: "bg-indigo-50 text-indigo-600",
    delivered: "bg-primary-50 text-primary-600",
    cancelled: "bg-red-50 text-red-500",
};

const ORDER_STATUS_LABEL: Record<VendorOrder["status"], string> = {
    pending: "Awaiting fulfillment",
    processing: "Processing",
    shipped: "Shipped",
    delivered: "Delivered",
    cancelled: "Cancelled",
};

const PRODUCT_STATUS_STYLES: Record<Product["status"], string> = {
    active: "bg-primary-50 text-primary-600",
    draft: "bg-brown-50 text-brown-400",
    out_of_stock: "bg-red-50 text-red-500",
};

const PRODUCT_STATUS_LABEL: Record<Product["status"], string> = {
    active: "Live",
    draft: "Draft",
    out_of_stock: "Out of stock",
};

export default function VendorDashboardPage() {
    const router = useRouter();
    const [vendor, setVendor] = useState<Vendor | null>(null);
    const [orders, setOrders] = useState<VendorOrder[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/signin");
            return;
        }

        const load = async () => {
            try {
                const headers = {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                };

                const [meRes, ordersRes, productsRes] = await Promise.all([
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/vendor/me`, { headers }),
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/vendor/orders`, {
                        headers,
                    }),
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/vendor/products`, {
                        headers,
                    }),
                ]);

                if (!meRes.ok) throw new Error("Could not load your shop");

                const me = await meRes.json();
                setVendor(me);

                if (ordersRes.ok) {
                    const ordersData = await ordersRes.json();
                    const list = Array.isArray(ordersData)
                        ? ordersData
                        : Array.isArray(ordersData?.orders)
                          ? ordersData.orders
                          : [];
                    setOrders(list);
                }

                if (productsRes.ok) {
                    const productsData = await productsRes.json();
                    const list = Array.isArray(productsData)
                        ? productsData
                        : Array.isArray(productsData?.products)
                          ? productsData.products
                          : [];
                    setProducts(list);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : "Something went wrong");
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        router.push("/signin");
    };

    const markFulfilled = async (orderId: string) => {
        const token = localStorage.getItem("token");
        setUpdatingOrderId(orderId);
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/vendor/orders/${orderId}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ status: "processing" }),
                }
            );
            if (res.ok) {
                setOrders((prev) =>
                    prev.map((o) =>
                        o.id === orderId ? { ...o, status: "processing" } : o
                    )
                );
            }
        } finally {
            setUpdatingOrderId(null);
        }
    };

    const initials =
        vendor?.shopName
            ?.split(" ")
            .map((n) => n[0])
            .slice(0, 2)
            .join("")
            .toUpperCase() ?? "";

    const revenue = orders
        .filter((o) => o.status !== "cancelled")
        .reduce((sum, o) => sum + o.total, 0);

    const pendingCount = orders.filter((o) => o.status === "pending").length;
    const activeProductCount = products.filter((p) => p.status === "active").length;

    const stats = [
        { label: "Total revenue", value: `Rs. ${revenue.toLocaleString()}` },
        { label: "Orders to fulfill", value: pendingCount },
        { label: "Products live", value: activeProductCount },
        { label: "Shop rating", value: vendor?.rating ? vendor.rating.toFixed(1) : "—" },
    ];

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-cream-50">
                <p className="text-brown-400">Loading your shop...</p>
            </div>
        );
    }

    if (vendor && (vendor.status === "pending" || vendor.status === "rejected")) {
        return (
            <div className="min-h-screen bg-[#FBF7F0] font-sans flex flex-col justify-between">
                {/* Minimal Header */}
                <header className="border-b border-[#EADCC9] bg-white">
                    <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                        <span className="text-xl font-serif font-bold text-[#8B3232]">
                            Kalakosh <span className="text-xs font-sans font-medium text-gray-500 uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-stone-100 align-middle ml-2">Artisan Center</span>
                        </span>
                        <button
                            onClick={handleLogout}
                            className="rounded-full border border-stone-200 px-4 py-2 text-sm text-stone-600 transition hover:border-[#8B3232] hover:text-[#8B3232]"
                        >
                            Sign out
                        </button>
                    </div>
                </header>

                <main className="mx-auto max-w-3xl px-6 py-12 flex-1 w-full">
                    {vendor.status === "pending" ? (
                        <div className="bg-white border border-yellow-200 rounded-3xl p-8 shadow-sm text-center">
                            <div className="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-6 text-yellow-600">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                            </div>
                            <h1 className="text-3xl font-serif font-semibold text-[#5C2E2E]">Verification Pending</h1>
                            <p className="mt-4 text-stone-600 leading-relaxed max-w-xl mx-auto">
                                Thank you for registering with Kalakosh! Your artisan profile is currently pending administrator verification. We are reviewing your shop details and PAN documents to maintain platform safety.
                            </p>
                            <p className="mt-2 text-stone-500 text-sm">This process typically takes 24 to 48 hours. We will notify you once approved.</p>
                        </div>
                    ) : (
                        <div className="bg-white border border-red-200 rounded-3xl p-8 shadow-sm text-center">
                            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 text-red-600">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h1 className="text-3xl font-serif font-semibold text-[#8B3232]">Verification Rejected</h1>
                            <p className="mt-4 text-stone-600 leading-relaxed max-w-xl mx-auto">
                                We regret to inform you that your artisan registration profile has been rejected by the Kalakosh administration. This could be due to incorrect PAN information, low-quality document uploads, or mismatched bank details.
                            </p>
                            <p className="mt-4 text-sm font-semibold text-stone-700">Please review your submitted details below or contact support at <a href="mailto:support@kalakosh.com" className="text-[#8B3232] hover:underline">support@kalakosh.com</a> to re-apply.</p>
                        </div>
                    )}

                    {/* Submitted Details Review Panel */}
                    <div className="mt-8 bg-white border border-[#EADCC9] rounded-3xl p-8 shadow-sm">
                        <h2 className="text-lg font-serif font-bold text-[#5C2E2E] mb-6 pb-2 border-b border-stone-100">Submitted Registration Details</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                            <div className="space-y-4">
                                <div>
                                    <span className="block text-xs font-semibold uppercase tracking-wider text-stone-400">Shop Name</span>
                                    <span className="font-medium text-stone-850">{vendor.shopName}</span>
                                </div>
                                <div>
                                    <span className="block text-xs font-semibold uppercase tracking-wider text-stone-400">Owner Name</span>
                                    <span className="font-medium text-stone-850">{vendor.ownerName}</span>
                                </div>
                                <div>
                                    <span className="block text-xs font-semibold uppercase tracking-wider text-stone-400">Email Address</span>
                                    <span className="font-medium text-stone-850">{vendor.email}</span>
                                </div>
                                <div>
                                    <span className="block text-xs font-semibold uppercase tracking-wider text-stone-400">9-Digit PAN Number</span>
                                    <span className="font-mono text-stone-850">{vendor.panNumber}</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <span className="block text-xs font-semibold uppercase tracking-wider text-stone-400">Bank Name</span>
                                    <span className="font-medium text-stone-850">{vendor.bankDetails?.bank_name || 'N/A'}</span>
                                </div>
                                <div>
                                    <span className="block text-xs font-semibold uppercase tracking-wider text-stone-400">Account Name</span>
                                    <span className="font-medium text-stone-850">{vendor.bankDetails?.account_name || 'N/A'}</span>
                                </div>
                                <div>
                                    <span className="block text-xs font-semibold uppercase tracking-wider text-stone-400">Account Number</span>
                                    <span className="font-mono text-stone-850">{vendor.bankDetails?.account_number || 'N/A'}</span>
                                </div>
                                <div>
                                    <span className="block text-xs font-semibold uppercase tracking-wider text-stone-400">Bank Branch</span>
                                    <span className="font-medium text-stone-850">{vendor.bankDetails?.branch || 'Main Branch'}</span>
                                </div>
                            </div>
                        </div>

                        {vendor.panPhoto && (
                          <div className="mt-8 pt-6 border-t border-stone-100">
                              <span className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-3">PAN Document Uploaded</span>
                              <div className="relative w-full max-w-md h-64 rounded-xl overflow-hidden border border-stone-200 bg-stone-50 shadow-inner">
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img src={vendor.panPhoto} alt="PAN Document" className="w-full h-full object-contain" />
                              </div>
                          </div>
                        )}
                    </div>
                </main>

                <footer className="py-6 text-center text-xs text-stone-400 border-t border-[#EADCC9] bg-white">
                    © {new Date().getFullYear()} Kalakosh. Preserving Traditional Nepalese Arts & Crafts.
                </footer>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-cream-50">
            {/* Top bar */}
            <header className="sticky top-0 z-10 border-b border-brown-100 bg-cream-50/90 backdrop-blur">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                    <Link href="/" className="text-xl font-semibold text-primary-500">
                        Kalakosh
                        <span className="ml-2 rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-600 align-middle">
                            Artisan
                        </span>
                    </Link>
                    <nav className="hidden items-center gap-8 text-sm text-brown-400 md:flex">
                        <Link href="/vendor/dashboard" className="font-medium text-primary-500">
                            Dashboard
                        </Link>
                        <Link href="/vendor/products" className="hover:text-primary-500">
                            Products
                        </Link>
                        <Link href="/vendor/orders" className="hover:text-primary-500">
                            Orders
                        </Link>
                        <Link href="/vendor/payouts" className="hover:text-primary-500">
                            Payouts
                        </Link>
                    </nav>
                    <div className="flex items-center gap-4">
                        <div className="hidden h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-600 sm:flex">
                            {initials || "?"}
                        </div>
                        <button
                            onClick={handleLogout}
                            className="rounded-full border border-brown-100 px-4 py-2 text-sm text-brown-400 transition hover:border-primary-300 hover:text-primary-500"
                        >
                            Sign out
                        </button>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-6xl px-6 py-10">
                {error && (
                    <p className="mb-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-destructive">
                        {error}
                    </p>
                )}

                {/* Welcome */}
                <section className="flex flex-col justify-between gap-6 rounded-2xl border border-brown-100 bg-white px-8 py-8 sm:flex-row sm:items-center">
                    <div>
                        <p className="text-sm text-brown-300">Your shop</p>
                        <h1 className="mt-1 text-3xl font-semibold text-primary-500">
                            {vendor?.shopName ?? "Your workshop"}
                        </h1>
                        <p className="mt-2 max-w-md text-sm text-brown-400">
                            {pendingCount > 0
                                ? `You have ${pendingCount} order${pendingCount === 1 ? "" : "s"} waiting to be fulfilled.`
                                : "All caught up. No orders waiting on you right now."}
                        </p>
                    </div>
                    <Link
                        href="/vendor/products/new"
                        className="h-12 shrink-0 rounded-full bg-primary-500 px-6 text-sm font-medium text-white transition hover:bg-primary-600 flex items-center justify-center"
                    >
                        List a new piece
                    </Link>
                </section>

                {/* Stats */}
                <section className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
                    {stats.map((stat) => (
                        <div
                            key={stat.label}
                            className="rounded-2xl border border-brown-100 bg-white px-6 py-5"
                        >
                            <p className="text-2xl font-semibold text-primary-500">
                                {stat.value}
                            </p>
                            <p className="mt-1 text-sm text-brown-400">{stat.label}</p>
                        </div>
                    ))}
                </section>

                <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Orders to fulfill */}
                    <section className="lg:col-span-2">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-brown-500">
                                Orders to fulfill
                            </h2>
                            <Link
                                href="/vendor/orders"
                                className="text-sm text-primary-500 hover:text-primary-600"
                            >
                                View all
                            </Link>
                        </div>

                        <div className="mt-4 flex flex-col gap-4">
                            {orders.length === 0 ? (
                                <div className="rounded-2xl border border-dashed border-brown-100 bg-white px-6 py-10 text-center">
                                    <p className="text-brown-400">
                                        No orders yet. Once your pieces sell, they&apos;ll show
                                        up here.
                                    </p>
                                </div>
                            ) : (
                                orders.slice(0, 5).map((order) => (
                                    <div
                                        key={order.id}
                                        className="flex items-center gap-4 rounded-2xl border border-brown-100 bg-white px-5 py-4"
                                    >
                                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-cream-100">
                                            {order.productImage && (
                                                <Image
                                                    src={order.productImage}
                                                    alt={order.productName}
                                                    fill
                                                    className="object-cover"
                                                />
                                            )}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate font-medium text-brown-500">
                                                {order.productName}
                                            </p>
                                            <p className="text-sm text-brown-300">
                                                for {order.buyer} &middot;{" "}
                                                {new Date(order.date).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium text-brown-500">
                                                Rs. {order.total.toLocaleString()}
                                            </p>
                                            <span
                                                className={`mt-1 inline-block rounded-full px-3 py-1 text-xs font-medium ${ORDER_STATUS_STYLES[order.status]}`}
                                            >
                                                {ORDER_STATUS_LABEL[order.status]}
                                            </span>
                                        </div>
                                        {order.status === "pending" && (
                                            <button
                                                onClick={() => markFulfilled(order.id)}
                                                disabled={updatingOrderId === order.id}
                                                className="ml-2 shrink-0 rounded-full bg-primary-500 px-4 py-2 text-xs font-medium text-white transition hover:bg-primary-600 disabled:opacity-60"
                                            >
                                                {updatingOrderId === order.id
                                                    ? "Updating..."
                                                    : "Mark processing"}
                                            </button>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </section>

                    {/* Products + shop details */}
                    <section className="flex flex-col gap-8">
                        <div>
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-brown-500">
                                    Your products
                                </h2>
                                <Link
                                    href="/vendor/products"
                                    className="text-sm text-primary-500 hover:text-primary-600"
                                >
                                    View all
                                </Link>
                            </div>
                            <div className="mt-4 flex flex-col gap-3">
                                {products.length === 0 ? (
                                    <div className="rounded-2xl border border-dashed border-brown-100 bg-white px-5 py-8 text-center">
                                        <p className="text-sm text-brown-400">
                                            You haven&apos;t listed anything yet.
                                        </p>
                                        <Link
                                            href="/vendor/products/new"
                                            className="mt-3 inline-block text-sm font-medium text-primary-500 hover:text-primary-600"
                                        >
                                            List your first piece
                                        </Link>
                                    </div>
                                ) : (
                                    products.slice(0, 4).map((product) => (
                                        <div
                                            key={product.id}
                                            className="flex items-center gap-3 rounded-2xl border border-brown-100 bg-white px-4 py-3"
                                        >
                                            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-cream-100">
                                                {product.image && (
                                                    <Image
                                                        src={product.image}
                                                        alt={product.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                )}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-medium text-brown-500">
                                                    {product.name}
                                                </p>
                                                <p className="text-xs text-brown-300">
                                                    {product.stock} in stock
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-medium text-brown-500">
                                                    Rs. {product.price.toLocaleString()}
                                                </p>
                                                <span
                                                    className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-[11px] font-medium ${PRODUCT_STATUS_STYLES[product.status]}`}
                                                >
                                                    {PRODUCT_STATUS_LABEL[product.status]}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="rounded-2xl border border-brown-100 bg-white px-6 py-6">
                            <h2 className="text-lg font-semibold text-brown-500">
                                Shop details
                            </h2>
                            <dl className="mt-4 space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <dt className="text-brown-300">Owner</dt>
                                    <dd className="text-brown-500">
                                        {vendor?.ownerName ?? "—"}
                                    </dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt className="text-brown-300">Email</dt>
                                    <dd className="text-brown-500">{vendor?.email ?? "—"}</dd>
                                </div>
                                {vendor?.location && (
                                    <div className="flex justify-between">
                                        <dt className="text-brown-300">Location</dt>
                                        <dd className="text-brown-500">{vendor.location}</dd>
                                    </div>
                                )}
                                {vendor?.joinedAt && (
                                    <div className="flex justify-between">
                                        <dt className="text-brown-300">Selling since</dt>
                                        <dd className="text-brown-500">
                                            {new Date(vendor.joinedAt).toLocaleDateString()}
                                        </dd>
                                    </div>
                                )}
                            </dl>
                            <Link
                                href="/vendor/settings"
                                className="mt-5 inline-block text-sm font-medium text-primary-500 hover:text-primary-600"
                            >
                                Edit shop settings
                            </Link>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}