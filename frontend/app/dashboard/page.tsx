"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

type User = {
    name: string;
    email: string;
    joinedAt?: string;
};

type Order = {
    id: string;
    productName: string;
    productImage: string;
    artisan: string;
    date: string;
    status: "delivered" | "shipped" | "processing" | "cancelled";
    total: number;
};

type WishlistItem = {
    id: string;
    name: string;
    image: string;
    artisan: string;
    price: number;
};

const STATUS_STYLES: Record<Order["status"], string> = {
    delivered: "bg-primary-50 text-primary-600",
    shipped: "bg-blue-50 text-blue-600",
    processing: "bg-amber-50 text-amber-600",
    cancelled: "bg-red-50 text-red-500",
};

const STATUS_LABEL: Record<Order["status"], string> = {
    delivered: "Delivered",
    shipped: "Shipped",
    processing: "Processing",
    cancelled: "Cancelled",
};

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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

                const [meRes, ordersRes, wishlistRes] = await Promise.all([
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, { headers }),
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/me`, { headers }),
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/wishlist`, { headers }),
                ]);

                if (!meRes.ok) throw new Error("Could not load your account");

                const me = await meRes.json();
                setUser(me.user ? {
                    name: me.user.name,
                    email: me.user.email,
                    joinedAt: me.user.createdAt
                } : null);

                if (ordersRes.ok) {
                    const ordersData = await ordersRes.json();
                    const list = Array.isArray(ordersData)
                        ? ordersData
                        : Array.isArray(ordersData?.orders)
                          ? ordersData.orders
                          : [];
                    
                    const mappedOrders = list.map((order: any) => {
                        const firstItem = order.items?.[0];
                        const firstProduct = firstItem?.product_id;
                        
                        let orderStatus: "delivered" | "shipped" | "processing" | "cancelled" = "processing";
                        if (order.order_status === "delivered") orderStatus = "delivered";
                        else if (order.order_status === "shipped") orderStatus = "shipped";
                        else if (order.order_status === "cancelled") orderStatus = "cancelled";

                        return {
                            id: order._id || order.order_number,
                            productName: firstProduct?.name || `Order ${order.order_number}`,
                            productImage: firstProduct?.images?.[0] || "",
                            artisan: firstProduct?.vendor_id?.shop_name || "Kalakosh Artisan",
                            date: order.createdAt || new Date().toISOString(),
                            status: orderStatus,
                            total: order.total_amount ?? 0,
                        };
                    });
                    setOrders(mappedOrders);
                }

                if (wishlistRes.ok) {
                    const wishlistData = await wishlistRes.json();
                    const productsList = wishlistData?.wishlist?.products || [];
                    const mappedWishlist = productsList.map((prod: any) => ({
                        id: prod._id,
                        name: prod.name,
                        image: prod.images?.[0] || "",
                        artisan: prod.vendor_id?.shop_name || "Kalakosh Artisan",
                        price: prod.price ?? 0,
                    }));
                    setWishlist(mappedWishlist);
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

    const initials =
        user?.name
            ?.split(" ")
            .map((n) => n[0])
            .slice(0, 2)
            .join("")
            .toUpperCase() ?? "";

    const stats = [
        { label: "Orders placed", value: orders.length },
        {
            label: "Artisans supported",
            value: new Set(orders.map((o) => o.artisan)).size,
        },
        { label: "Saved pieces", value: wishlist.length },
    ];

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-cream-50">
                <p className="text-brown-400">Loading your dashboard...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FBF8F3] py-10">
            <main className="mx-auto max-w-6xl px-6">
                {error && (
                    <p className="mb-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-destructive">
                        {error}
                    </p>
                )}

                {/* Welcome & Profile Details Card */}
                <section className="flex flex-col justify-between gap-6 rounded-3xl border border-brown-100 bg-white p-6 sm:p-8 sm:flex-row sm:items-center shadow-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                        {/* User Initials Circle */}
                        <div className="w-16 h-16 bg-[#5C1A1A] text-white rounded-full flex items-center justify-center font-serif font-bold text-2xl shadow-sm border border-brown-100/50 flex-shrink-0">
                            {initials || "?"}
                        </div>
                        <div>
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="bg-primary-50 text-primary-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                    Customer Profile
                                </span>
                                {user?.joinedAt && (
                                    <span className="text-[10px] text-muted-foreground font-medium">
                                        Member since: {new Date(user.joinedAt).toLocaleDateString()}
                                    </span>
                                )}
                            </div>
                            <h1 className="mt-1.5 text-2xl font-serif font-bold text-primary-800">
                                {user?.name ?? "Friend of artisans"}
                            </h1>
                            <p className="text-sm text-muted-foreground mt-0.5">{user?.email}</p>
                            <p className="mt-2 text-xs text-brown-400 max-w-md leading-relaxed">
                                Every piece you collect supports authentic local Nepalese craftsmanship and artisan livelihoods.
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Link
                            href="/shop"
                            className="h-11 shrink-0 rounded-full bg-primary-700 hover:bg-primary-800 px-6 text-xs font-semibold text-white transition-all flex items-center justify-center shadow-xs"
                        >
                            Explore Marketplace
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="h-11 shrink-0 rounded-full border border-border hover:border-red-650 hover:bg-red-50/50 hover:text-red-750 px-6 text-xs font-semibold text-muted-foreground transition-all cursor-pointer bg-white"
                        >
                            Sign Out
                        </button>
                    </div>
                </section>

                {/* Stats */}
                <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {stats.map((stat) => (
                        <div
                            key={stat.label}
                            className="rounded-2xl border border-brown-100 bg-white px-6 py-5"
                        >
                            <p className="text-3xl font-semibold text-primary-500">
                                {stat.value}
                            </p>
                            <p className="mt-1 text-sm text-brown-400">{stat.label}</p>
                        </div>
                    ))}
                </section>

                <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Recent orders */}
                    <section className="lg:col-span-2">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-brown-500">
                                Recent orders
                            </h2>
                            <Link
                                href="/dashboard/orders"
                                className="text-sm text-primary-500 hover:text-primary-600"
                            >
                                View all
                            </Link>
                        </div>

                        <div className="mt-4 flex flex-col gap-4">
                            {orders.length === 0 ? (
                                <div className="rounded-2xl border border-dashed border-brown-100 bg-white px-6 py-10 text-center">
                                    <p className="text-brown-400">
                                        No orders yet. Your first piece is waiting to be found.
                                    </p>
                                    <Link
                                        href="/"
                                        className="mt-4 inline-block rounded-full bg-primary-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-primary-600"
                                    >
                                        Browse the collection
                                    </Link>
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
                                                by {order.artisan} &middot;{" "}
                                                {new Date(order.date).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium text-brown-500">
                                                Rs. {order.total.toLocaleString()}
                                            </p>
                                            <span
                                                className={`mt-1 inline-block rounded-full px-3 py-1 text-xs font-medium ${STATUS_STYLES[order.status]}`}
                                            >
                                                {STATUS_LABEL[order.status]}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </section>

                    {/* Wishlist + account */}
                    <section className="flex flex-col gap-8">
                        <div>
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-brown-500">
                                    Saved pieces
                                </h2>
                                <Link
                                    href="/dashboard/wishlist"
                                    className="text-sm text-primary-500 hover:text-primary-600"
                                >
                                    View all
                                </Link>
                            </div>
                            <div className="mt-4 flex flex-col gap-3">
                                {wishlist.length === 0 ? (
                                    <div className="rounded-2xl border border-dashed border-brown-100 bg-white px-5 py-8 text-center">
                                        <p className="text-sm text-brown-400">
                                            Nothing saved yet. Tap the heart on a piece you love.
                                        </p>
                                    </div>
                                ) : (
                                    wishlist.slice(0, 3).map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex items-center gap-3 rounded-2xl border border-brown-100 bg-white px-4 py-3"
                                        >
                                            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-cream-100">
                                                {item.image && (
                                                    <Image
                                                        src={item.image}
                                                        alt={item.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                )}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-medium text-brown-500">
                                                    {item.name}
                                                </p>
                                                <p className="truncate text-xs text-brown-300">
                                                    {item.artisan}
                                                </p>
                                            </div>
                                            <p className="text-sm font-medium text-brown-500">
                                                Rs. {item.price.toLocaleString()}
                                            </p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="rounded-2xl border border-brown-100 bg-white px-6 py-6">
                            <h2 className="text-lg font-semibold text-brown-500">
                                Account details
                            </h2>
                            <dl className="mt-4 space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <dt className="text-brown-300">Name</dt>
                                    <dd className="text-brown-500">{user?.name ?? "—"}</dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt className="text-brown-300">Email</dt>
                                    <dd className="text-brown-500">{user?.email ?? "—"}</dd>
                                </div>
                                {user?.joinedAt && (
                                    <div className="flex justify-between">
                                        <dt className="text-brown-300">Member since</dt>
                                        <dd className="text-brown-500">
                                            {new Date(user.joinedAt).toLocaleDateString()}
                                        </dd>
                                    </div>
                                )}
                            </dl>
                            <Link
                                href="/dashboard/settings"
                                className="mt-5 inline-block text-sm font-medium text-primary-500 hover:text-primary-600"
                            >
                                Edit account settings
                            </Link>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}