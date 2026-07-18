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
                setUser(me);

                if (ordersRes.ok) {
                    const ordersData = await ordersRes.json();
                    const list = Array.isArray(ordersData)
                        ? ordersData
                        : Array.isArray(ordersData?.orders)
                          ? ordersData.orders
                          : [];
                    setOrders(list);
                }

                if (wishlistRes.ok) {
                    const wishlistData = await wishlistRes.json();
                    const list = Array.isArray(wishlistData)
                        ? wishlistData
                        : Array.isArray(wishlistData?.items)
                          ? wishlistData.items
                          : [];
                    setWishlist(list);
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
        <div className="min-h-screen bg-cream-50">
            {/* Top bar */}
            <header className="sticky top-0 z-10 border-b border-brown-100 bg-cream-50/90 backdrop-blur">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                    <Link href="/" className="text-xl font-semibold text-primary-500">
                        Kalakosh
                    </Link>
                    <nav className="hidden items-center gap-8 text-sm text-brown-400 md:flex">
                        <Link href="/" className="hover:text-primary-500">
                            Marketplace
                        </Link>
                        <Link href="/dashboard" className="font-medium text-primary-500">
                            Dashboard
                        </Link>
                        <Link href="/dashboard/orders" className="hover:text-primary-500">
                            Orders
                        </Link>
                        <Link href="/dashboard/wishlist" className="hover:text-primary-500">
                            Wishlist
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
                        <p className="text-sm text-brown-300">Welcome back</p>
                        <h1 className="mt-1 text-3xl font-semibold text-primary-500">
                            {user?.name ?? "Friend of artisans"}
                        </h1>
                        <p className="mt-2 max-w-md text-sm text-brown-400">
                            Every piece you&apos;ve collected here carries a story, and a
                            livelihood, from a Nepali artisan family.
                        </p>
                    </div>
                    <Link
                        href="/"
                        className="h-12 shrink-0 rounded-full bg-primary-500 px-6 text-sm font-medium text-white transition hover:bg-primary-600 flex items-center justify-center"
                    >
                        Explore the marketplace
                    </Link>
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