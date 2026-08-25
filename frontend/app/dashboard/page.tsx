"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { 
  ShoppingBag, 
  Store, 
  Package, 
  DollarSign, 
  TrendingUp, 
  PlusCircle, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  Clock, 
  Truck, 
  XCircle,
  FileText,
  CreditCard,
  User,
  Heart,
  ChevronRight,
  Upload
} from "lucide-react";

type UserType = {
    name: string;
    email: string;
    role: "user" | "vendor" | "admin";
    joinedAt?: string;
};

type CustomerOrder = {
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

type VendorProduct = {
    id: string;
    name: string;
    image: string;
    price: number;
    stock: number;
    status: string;
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

type VendorProfile = {
    shopName: string;
    ownerName: string;
    email: string;
    location: string;
    rating: number;
    joinedAt: string;
    status: string;
    panNumber: string;
    panPhoto?: string;
    bankDetails?: {
        bank_name?: string;
        account_name?: string;
        account_number?: string;
        branch?: string;
    };
};

const STATUS_STYLES = {
    delivered: "bg-green-50 text-green-700 border border-green-150",
    shipped: "bg-blue-50 text-blue-700 border border-blue-150",
    processing: "bg-amber-50 text-amber-700 border border-amber-150",
    pending: "bg-amber-50 text-amber-700 border border-amber-150",
    cancelled: "bg-red-50 text-red-600 border border-red-150",
};

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<UserType | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // Customer states
    const [customerOrders, setCustomerOrders] = useState<CustomerOrder[]>([]);
    const [wishlist, setWishlist] = useState<WishlistItem[]>([]);

    // Vendor states
    const [vendorProfile, setVendorProfile] = useState<VendorProfile | null>(null);
    const [vendorProducts, setVendorProducts] = useState<VendorProduct[]>([]);
    const [vendorOrders, setVendorOrders] = useState<VendorOrder[]>([]);
    const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);
    const [activeTab, setActiveTab] = useState<"overview" | "products" | "orders" | "payments" | "add-product">("overview");

    // Add Product Form states
    const [newProduct, setNewProduct] = useState({
        name: "",
        price: "",
        discount_price: "",
        stock: "",
        category_id: "",
        region: "Kathmandu",
        material: "Cotton Canvas",
        craft_type: "Nepalese Handicraft",
        description: "",
    });
    const [newProductFiles, setNewProductFiles] = useState<File[]>([]);
    const [newProductPreviews, setNewProductPreviews] = useState<string[]>([]);
    const [addingProduct, setAddingProduct] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/signin");
            return;
        }

        const loadDashboard = async () => {
            try {
                setLoading(true);
                const headers = {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                };

                // Fetch basic categories list for the form
                const catRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`);
                if (catRes.ok) {
                    const catData = await catRes.json();
                    if (catData?.categories) setCategories(catData.categories);
                }

                const meRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, { headers });
                if (!meRes.ok) throw new Error("Could not load account details");
                const meData = await meRes.json();

                if (meData?.user) {
                    const activeUser: UserType = {
                        name: meData.user.name,
                        email: meData.user.email,
                        role: meData.user.role,
                        joinedAt: meData.user.createdAt,
                    };
                    setUser(activeUser);

                    if (activeUser.role === "vendor") {
                        // Load Vendor dashboard details
                        const [profileRes, productsRes, ordersRes] = await Promise.all([
                            fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/vendor/me`, { headers }),
                            fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/vendor/products`, { headers }),
                            fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/vendor/orders`, { headers }),
                        ]);

                        if (profileRes.ok) {
                            const profileData = await profileRes.json();
                            setVendorProfile(profileData);
                        }
                        if (productsRes.ok) {
                            const productsData = await productsRes.json();
                            setVendorProducts(productsData);
                        }
                        if (ordersRes.ok) {
                            const ordersData = await ordersRes.json();
                            setVendorOrders(ordersData);
                        }
                    } else {
                        // Load Customer dashboard details
                        const [ordersRes, wishlistRes] = await Promise.all([
                            fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/me`, { headers }),
                            fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/wishlist`, { headers }),
                        ]);

                        if (ordersRes.ok) {
                            const ordersData = await ordersRes.json();
                            const rawList = Array.isArray(ordersData) ? ordersData : ordersData?.orders || [];
                            const mapped: CustomerOrder[] = rawList.map((order: any) => {
                                const firstItem = order.items?.[0];
                                const firstProduct = firstItem?.product_id;
                                return {
                                    id: order._id || order.order_number,
                                    productName: firstProduct?.name || `Order ${order.order_number}`,
                                    productImage: firstProduct?.images?.[0] || "",
                                    artisan: firstProduct?.vendor_id?.shop_name || "Kalakosh Artisan",
                                    date: order.createdAt,
                                    status: order.order_status || "processing",
                                    total: order.total_amount || 0,
                                };
                            });
                            setCustomerOrders(mapped);
                        }

                        if (wishlistRes.ok) {
                            const wishlistData = await wishlistRes.json();
                            const prodList = wishlistData?.wishlist?.products || [];
                            const mappedWishlist: WishlistItem[] = prodList.map((prod: any) => ({
                                id: prod._id,
                                name: prod.name,
                                image: prod.images?.[0] || "",
                                artisan: prod.vendor_id?.shop_name || "Kalakosh Artisan",
                                price: prod.price || 0,
                            }));
                            setWishlist(mappedWishlist);
                        }
                    }
                }
            } catch (err: any) {
                setError(err.message || "Failed to load dashboard data");
            } finally {
                setLoading(false);
            }
        };

        loadDashboard();
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        router.push("/signin");
    };

    // Update Vendor Order Status dropdown
    const handleUpdateOrderStatus = async (orderItemId: string, newStatus: string) => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/vendor/orders/${orderItemId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ status: newStatus }),
            });
            if (!res.ok) throw new Error("Failed to update status");
            
            toast.success("Order status updated successfully!");
            // Update local state
            setVendorOrders(prev => 
                prev.map(o => o.id === orderItemId ? { ...o, status: newStatus as any } : o)
            );
        } catch (err: any) {
            toast.error(err.message || "Failed to update status");
        }
    };

    // Add Product Form Handlers
    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewProduct(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            const remaining = 6 - newProductFiles.length;
            const updated = [...newProductFiles, ...files].slice(0, remaining);
            setNewProductFiles(updated);

            const previewsPromises = files.map(file => {
                return new Promise<string>((resolve) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result as string);
                    reader.readAsDataURL(file);
                });
            });

            Promise.all(previewsPromises).then(urls => {
                setNewProductPreviews(prev => [...prev, ...urls].slice(0, remaining));
            });
        }
    };

    const handleRemoveNewImage = (idx: number) => {
        setNewProductFiles(prev => prev.filter((_, i) => i !== idx));
        setNewProductPreviews(prev => prev.filter((_, i) => i !== idx));
    };

    const handleAddProductSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        if (!newProduct.name || !newProduct.price || !newProduct.stock || !newProduct.category_id) {
            toast.error("Please fill all required fields");
            return;
        }

        setAddingProduct(true);
        try {
            const fd = new FormData();
            fd.append("name", newProduct.name);
            fd.append("description", newProduct.description);
            fd.append("price", newProduct.price);
            if (newProduct.discount_price) fd.append("discount_price", newProduct.discount_price);
            fd.append("stock", newProduct.stock);
            fd.append("category_id", newProduct.category_id);
            fd.append("region", newProduct.region);
            fd.append("material", newProduct.material);
            fd.append("craft_type", newProduct.craft_type);

            for (const file of newProductFiles) {
                fd.append("images", file);
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/vendor/products`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: fd,
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || "Failed to create product");
            }

            toast.success("Product listed successfully!");
            // Refresh products
            const productsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/vendor/products`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (productsRes.ok) {
                const data = await productsRes.json();
                setVendorProducts(data);
            }

            // Reset form
            setNewProduct({
                name: "",
                price: "",
                discount_price: "",
                stock: "",
                category_id: "",
                region: "Kathmandu",
                material: "Cotton Canvas",
                craft_type: "Nepalese Handicraft",
                description: "",
            });
            setNewProductFiles([]);
            setNewProductPreviews([]);
            setActiveTab("products");
        } catch (err: any) {
            toast.error(err.message || "Something went wrong listing product");
        } finally {
            setAddingProduct(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#FBF8F3]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-[#8B3232] border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-[#5C2E2E] font-medium font-serif">Loading your profile dashboard...</p>
                </div>
            </div>
        );
    }

    const initials = user?.name?.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase() || "?";

    // ----------------------------------------------------
    // VENDOR VIEW RENDERING
    // ----------------------------------------------------
    if (user?.role === "vendor") {
        const totalEarnings = vendorOrders
            .filter(o => o.status === "delivered")
            .reduce((sum, o) => sum + o.total, 0);

        const pendingPayout = vendorOrders
            .filter(o => o.status !== "delivered" && o.status !== "cancelled")
            .reduce((sum, o) => sum + o.total, 0);

        return (
            <div className="min-h-screen bg-[#FBF8F3] py-8">
                <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {error && (
                        <div className="mb-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    {/* Vendor Shop Profile Info */}
                    <section className="bg-white border border-[#EADCC9] rounded-3xl p-6 sm:p-8 flex flex-col justify-between sm:flex-row items-start sm:items-center gap-6 shadow-sm">
                        <div className="flex gap-4 items-center">
                            <div className="w-16 h-16 bg-[#5C1A1A] text-white rounded-full flex items-center justify-center font-serif font-bold text-2xl shadow-inner flex-shrink-0">
                                {vendorProfile?.shopName?.substring(0, 2).toUpperCase() || initials}
                            </div>
                            <div>
                                <div className="flex items-center flex-wrap gap-2">
                                    <span className="bg-[#8B3232] text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                        ARTISAN VENDOR
                                    </span>
                                    <span className="text-[10px] text-muted-foreground font-medium capitalize">
                                        Status: {vendorProfile?.status || "pending"}
                                    </span>
                                </div>
                                <h1 className="mt-1 text-2xl font-serif font-bold text-[#3D1A16]">{vendorProfile?.shopName || "Artisan Shop"}</h1>
                                <p className="text-xs text-muted-foreground">Owner: {vendorProfile?.ownerName} &middot; {vendorProfile?.email}</p>
                                <p className="text-xs text-brown-400 mt-1 max-w-lg">
                                    PAN No: {vendorProfile?.panNumber || "N/A"} &middot; Location: {vendorProfile?.location}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-3 w-full sm:w-auto">
                            <button
                                onClick={() => setActiveTab("add-product")}
                                className="flex-1 sm:flex-initial h-11 px-5 rounded-full bg-[#8B3232] hover:bg-[#722727] text-white text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                            >
                                <PlusCircle className="w-4 h-4" /> Add Product
                            </button>
                            <button
                                onClick={handleLogout}
                                className="h-11 px-5 rounded-full border border-border hover:bg-red-50 hover:text-red-700 text-xs font-bold transition cursor-pointer bg-white text-text-mid"
                            >
                                Sign Out
                            </button>
                        </div>
                    </section>

                    {/* Stats overview */}
                    <section className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-white border border-[#EADCC9] rounded-2xl p-5 shadow-xs flex items-center gap-4">
                            <div className="p-3 bg-green-50 text-green-700 rounded-xl">
                                <DollarSign className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-[#3D1A16]">Rs. {totalEarnings.toLocaleString()}</p>
                                <p className="text-xs text-[#7A6D65] font-medium mt-0.5">Total Earnings</p>
                            </div>
                        </div>
                        <div className="bg-white border border-[#EADCC9] rounded-2xl p-5 shadow-xs flex items-center gap-4">
                            <div className="p-3 bg-blue-50 text-blue-700 rounded-xl">
                                <TrendingUp className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-[#3D1A16]">Rs. {pendingPayout.toLocaleString()}</p>
                                <p className="text-xs text-[#7A6D65] font-medium mt-0.5">Pending Payments</p>
                            </div>
                        </div>
                        <div className="bg-white border border-[#EADCC9] rounded-2xl p-5 shadow-xs flex items-center gap-4">
                            <div className="p-3 bg-amber-50 text-amber-700 rounded-xl">
                                <Package className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-[#3D1A16]">{vendorProducts.length}</p>
                                <p className="text-xs text-[#7A6D65] font-medium mt-0.5">Active Products</p>
                            </div>
                        </div>
                        <div className="bg-white border border-[#EADCC9] rounded-2xl p-5 shadow-xs flex items-center gap-4">
                            <div className="p-3 bg-purple-50 text-purple-700 rounded-xl">
                                <ShoppingBag className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-[#3D1A16]">{vendorOrders.length}</p>
                                <p className="text-xs text-[#7A6D65] font-medium mt-0.5">Total Orders</p>
                            </div>
                        </div>
                    </section>

                    {/* Tab Selection */}
                    <div className="mt-8 flex border-b border-[#EADCC9] gap-6 text-sm overflow-x-auto pb-1 scrollbar-none">
                        {(["overview", "products", "orders", "payments", "add-product"] as const).map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`pb-3 font-serif font-bold text-sm tracking-wide capitalize whitespace-nowrap border-b-2 transition-colors cursor-pointer ${
                                    activeTab === tab 
                                        ? "border-[#8B3232] text-[#8B3232]" 
                                        : "border-transparent text-text-light hover:text-[#8B3232]"
                                }`}
                            >
                                {tab === "add-product" ? "Add Product" : tab}
                            </button>
                        ))}
                    </div>

                    {/* -------------------- TAB CONTENT -------------------- */}

                    {/* OVERVIEW TAB */}
                    {activeTab === "overview" && (
                        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-6">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-lg font-serif font-bold text-[#3D1A16]">Recent Incoming Orders</h2>
                                    <button onClick={() => setActiveTab("orders")} className="text-xs font-bold text-[#8B3232] hover:underline flex items-center gap-0.5">
                                        Fulfill Orders <ChevronRight className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    {vendorOrders.length === 0 ? (
                                        <div className="bg-white border border-[#EADCC9] rounded-2xl p-8 text-center text-muted-foreground">
                                            No orders placed yet for your items.
                                        </div>
                                    ) : (
                                        vendorOrders.slice(0, 4).map(o => (
                                            <div key={o.id} className="bg-white border border-[#EADCC9] rounded-2xl p-4 flex items-center justify-between gap-4 flex-wrap sm:flex-nowrap">
                                                <div className="flex gap-3 items-center">
                                                    <div className="relative w-12 h-12 bg-[#F5EDE2] rounded-lg overflow-hidden shrink-0">
                                                        <Image src={o.productImage || "/images/placeholder.png"} alt={o.productName} fill className="object-cover" />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-sm text-[#3D1A16] line-clamp-1">{o.productName}</p>
                                                        <p className="text-xs text-muted-foreground">Buyer: {o.buyer} &middot; {new Date(o.date).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4 justify-between w-full sm:w-auto">
                                                    <span className="text-sm font-bold text-[#3D1A16]">Rs. {o.total.toLocaleString()}</span>
                                                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${STATUS_STYLES[o.status] || "bg-gray-50"}`}>
                                                        {o.status}
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h2 className="text-lg font-serif font-bold text-[#3D1A16]">Account Details</h2>
                                <div className="bg-white border border-[#EADCC9] rounded-2xl p-5 space-y-4">
                                    <div>
                                        <p className="text-xs text-[#7A6D65] uppercase font-semibold tracking-wider">Owner Details</p>
                                        <p className="text-sm font-semibold text-[#3D1A16] mt-0.5">{vendorProfile?.ownerName}</p>
                                        <p className="text-xs text-muted-foreground">{vendorProfile?.email}</p>
                                    </div>
                                    <hr className="border-[#F5EDE2]" />
                                    <div>
                                        <p className="text-xs text-[#7A6D65] uppercase font-semibold tracking-wider">Bank Accounts & Payouts</p>
                                        {vendorProfile?.bankDetails?.bank_name ? (
                                            <div className="text-xs text-muted-foreground space-y-1 mt-1">
                                                <p className="font-medium text-[#3D1A16]">Bank: {vendorProfile.bankDetails.bank_name}</p>
                                                <p>Account: {vendorProfile.bankDetails.account_name}</p>
                                                <p>Number: {vendorProfile.bankDetails.account_number}</p>
                                                <p>Branch: {vendorProfile.bankDetails.branch}</p>
                                            </div>
                                        ) : (
                                            <p className="text-xs text-muted-foreground mt-1">Bank details not provided yet. Contact admin to update.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* PRODUCTS TAB */}
                    {activeTab === "products" && (
                        <div className="mt-8 space-y-6">
                            <div className="flex justify-between items-center">
                                <h2 className="text-lg font-serif font-bold text-[#3D1A16]">Listed Products ({vendorProducts.length})</h2>
                                <button onClick={() => setActiveTab("add-product")} className="text-xs font-bold text-[#8B3232] hover:underline flex items-center gap-1">
                                    <PlusCircle className="w-3.5 h-3.5" /> List New Product
                                </button>
                            </div>
                            <div className="bg-white border border-[#EADCC9] rounded-3xl overflow-hidden shadow-xs">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse text-sm">
                                        <thead>
                                            <tr className="bg-[#FBF8F3] border-b border-[#EADCC9] text-[#7A6D65]">
                                                <th className="px-6 py-4 font-serif font-bold">Product</th>
                                                <th className="px-6 py-4 font-serif font-bold">Price</th>
                                                <th className="px-6 py-4 font-serif font-bold">Stock</th>
                                                <th className="px-6 py-4 font-serif font-bold">Status</th>
                                                <th className="px-6 py-4 font-serif font-bold text-center">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[#F5EDE2]">
                                            {vendorProducts.length === 0 ? (
                                                <tr>
                                                    <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                                                        You haven't listed any products yet.
                                                    </td>
                                                </tr>
                                            ) : (
                                                vendorProducts.map(p => (
                                                    <tr key={p.id} className="hover:bg-[#FDFBF9] transition-colors">
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="relative w-12 h-12 bg-[#F5EDE2] rounded-lg overflow-hidden shrink-0 border border-border/10">
                                                                    <Image src={p.image || "/images/placeholder.png"} alt={p.name} fill className="object-cover" />
                                                                </div>
                                                                <span className="font-semibold text-[#3D1A16] max-w-[240px] truncate">{p.name}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 font-medium text-[#3D1A16]">Rs. {p.price.toLocaleString()}</td>
                                                        <td className="px-6 py-4">
                                                            <span className={`font-semibold ${p.stock <= 3 ? "text-red-650" : "text-[#3D1A16]"}`}>
                                                                {p.stock} pcs
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                                                                p.status === "active" ? "bg-green-50 text-green-700 border border-green-150" : 
                                                                p.status === "out_of_stock" ? "bg-red-50 text-red-700 border border-red-150" : 
                                                                "bg-amber-50 text-amber-700 border border-amber-150"
                                                            }`}>
                                                                {p.status.replace("_", " ")}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center justify-center gap-3">
                                                                <Link
                                                                    href={`/admin/products/${p.id}/edit`}
                                                                    className="p-1.5 hover:bg-amber-50 text-amber-700 rounded-lg transition"
                                                                    title="Edit Product Info"
                                                                >
                                                                    <Edit3 className="w-4 h-4" />
                                                                </Link>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ORDERS TAB */}
                    {activeTab === "orders" && (
                        <div className="mt-8 space-y-6">
                            <h2 className="text-lg font-serif font-bold text-[#3D1A16]">Fulfill Customer Orders ({vendorOrders.length})</h2>
                            <div className="bg-white border border-[#EADCC9] rounded-3xl overflow-hidden shadow-xs">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse text-sm">
                                        <thead>
                                            <tr className="bg-[#FBF8F3] border-b border-[#EADCC9] text-[#7A6D65]">
                                                <th className="px-6 py-4 font-serif font-bold">Product</th>
                                                <th className="px-6 py-4 font-serif font-bold">Buyer</th>
                                                <th className="px-6 py-4 font-serif font-bold">Date</th>
                                                <th className="px-6 py-4 font-serif font-bold">Earnings</th>
                                                <th className="px-6 py-4 font-serif font-bold">Fulfilment Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[#F5EDE2]">
                                            {vendorOrders.length === 0 ? (
                                                <tr>
                                                    <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                                                        No customer orders placed for your items.
                                                    </td>
                                                </tr>
                                            ) : (
                                                vendorOrders.map(o => (
                                                    <tr key={o.id} className="hover:bg-[#FDFBF9] transition-colors">
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="relative w-12 h-12 bg-[#F5EDE2] rounded-lg overflow-hidden shrink-0 border border-border/10">
                                                                    <Image src={o.productImage || "/images/placeholder.png"} alt={o.productName} fill className="object-cover" />
                                                                </div>
                                                                <span className="font-semibold text-[#3D1A16] max-w-[220px] truncate">{o.productName}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-[#3D1A16] font-medium">{o.buyer}</td>
                                                        <td className="px-6 py-4 text-muted-foreground">{new Date(o.date).toLocaleDateString()}</td>
                                                        <td className="px-6 py-4 font-bold text-[#3D1A16]">Rs. {o.total.toLocaleString()}</td>
                                                        <td className="px-6 py-4">
                                                            <select
                                                                value={o.status}
                                                                onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                                                                className={`px-3 py-1.5 rounded-lg border text-xs font-bold focus:outline-none transition capitalize ${
                                                                    o.status === "delivered" ? "bg-green-50 text-green-700 border-green-200" :
                                                                    o.status === "shipped" ? "bg-blue-50 text-blue-700 border-blue-200" :
                                                                    o.status === "cancelled" ? "bg-red-50 text-red-700 border-red-200" :
                                                                    "bg-amber-50 text-amber-700 border-amber-200"
                                                                }`}
                                                            >
                                                                <option value="pending">Pending</option>
                                                                <option value="processing">Processing</option>
                                                                <option value="shipped">Shipped</option>
                                                                <option value="delivered">Delivered</option>
                                                                <option value="cancelled">Cancelled</option>
                                                            </select>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* PAYMENTS TAB */}
                    {activeTab === "payments" && (
                        <div className="mt-8 space-y-6">
                            <h2 className="text-lg font-serif font-bold text-[#3D1A16]">Earnings & Payments Breakdown</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-white border border-[#EADCC9] rounded-2xl p-6">
                                    <h3 className="font-serif font-bold text-[#3D1A16] mb-3">Revenue Statistics</h3>
                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-[#7A6D65]">Cleared Payouts (Delivered)</span>
                                            <span className="font-bold text-green-600">Rs. {totalEarnings.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-[#7A6D65]">Escrow Earnings (Processing/Shipped)</span>
                                            <span className="font-bold text-blue-600">Rs. {pendingPayout.toLocaleString()}</span>
                                        </div>
                                        <hr className="border-[#F5EDE2]" />
                                        <div className="flex justify-between text-base">
                                            <span className="font-semibold text-[#3D1A16]">Total Projected Revenue</span>
                                            <span className="font-bold text-[#8B3232]">Rs. {(totalEarnings + pendingPayout).toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white border border-[#EADCC9] rounded-2xl p-6">
                                    <h3 className="font-serif font-bold text-[#3D1A16] mb-3">Bank Transfer Details</h3>
                                    {vendorProfile?.bankDetails?.bank_name ? (
                                        <div className="space-y-2 text-sm text-muted-foreground">
                                            <div className="flex justify-between"><dt>Bank Name:</dt><dd className="font-medium text-[#3D1A16]">{vendorProfile.bankDetails.bank_name}</dd></div>
                                            <div className="flex justify-between"><dt>Account Name:</dt><dd className="font-medium text-[#3D1A16]">{vendorProfile.bankDetails.account_name}</dd></div>
                                            <div className="flex justify-between"><dt>Account Number:</dt><dd className="font-medium text-[#3D1A16]">{vendorProfile.bankDetails.account_number}</dd></div>
                                            <div className="flex justify-between"><dt>Branch:</dt><dd className="font-medium text-[#3D1A16]">{vendorProfile.bankDetails.branch}</dd></div>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-[#7A6D65]">No payment accounts are configured. Please contact the administrator to bind bank details.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ADD PRODUCT TAB */}
                    {activeTab === "add-product" && (
                        <div className="mt-8 space-y-6">
                            <h2 className="text-lg font-serif font-bold text-[#3D1A16]">List a New Artisan Product</h2>
                            <form onSubmit={handleAddProductSubmit} className="bg-white border border-[#EADCC9] rounded-3xl p-6 sm:p-8 shadow-xs grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2 space-y-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-[#3D1A16] mb-2">Product Name *</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={newProduct.name}
                                            onChange={handleFormChange}
                                            required
                                            placeholder="e.g. Traditional Ceramic Incense Burner"
                                            className="w-full border border-border bg-[#FDFBF7] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B3232]"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-[#3D1A16] mb-2">Category *</label>
                                            <select
                                                name="category_id"
                                                value={newProduct.category_id}
                                                onChange={handleFormChange}
                                                required
                                                className="w-full border border-border bg-[#FDFBF7] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B3232]"
                                            >
                                                <option value="">Select Category</option>
                                                {categories.map(cat => (
                                                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-[#3D1A16] mb-2">Stock Quantity *</label>
                                            <input
                                                type="number"
                                                name="stock"
                                                required
                                                min="1"
                                                value={newProduct.stock}
                                                onChange={handleFormChange}
                                                placeholder="e.g. 15"
                                                className="w-full border border-border bg-[#FDFBF7] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B3232]"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-[#3D1A16] mb-2">Regular Price *</label>
                                            <input
                                                type="number"
                                                name="price"
                                                required
                                                min="0"
                                                value={newProduct.price}
                                                onChange={handleFormChange}
                                                placeholder="e.g. 2999"
                                                className="w-full border border-border bg-[#FDFBF7] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B3232]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-[#3D1A16] mb-2">Discount Price</label>
                                            <input
                                                type="number"
                                                name="discount_price"
                                                min="0"
                                                value={newProduct.discount_price}
                                                onChange={handleFormChange}
                                                placeholder="e.g. 2499 (Optional)"
                                                className="w-full border border-border bg-[#FDFBF7] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B3232]"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-[#3D1A16] mb-2">Region</label>
                                            <select
                                                name="region"
                                                value={newProduct.region}
                                                onChange={handleFormChange}
                                                className="w-full border border-border bg-[#FDFBF7] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B3232]"
                                            >
                                                <option value="Kathmandu">Kathmandu</option>
                                                <option value="Patan">Patan</option>
                                                <option value="Bhaktapur">Bhaktapur</option>
                                                <option value="Lalitpur">Lalitpur</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-[#3D1A16] mb-2">Material</label>
                                            <select
                                                name="material"
                                                value={newProduct.material}
                                                onChange={handleFormChange}
                                                className="w-full border border-border bg-[#FDFBF7] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B3232]"
                                            >
                                                <option value="Cotton Canvas">Cotton Canvas</option>
                                                <option value="Brass Alloy">Brass Alloy</option>
                                                <option value="Pashmina Wool">Pashmina Wool</option>
                                                <option value="Sterling Silver">Sterling Silver</option>
                                                <option value="Clay">Clay</option>
                                                <option value="Lokta Paper">Lokta Paper</option>
                                                <option value="Yak Wool">Yak Wool</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-[#3D1A16] mb-2">Craft Type</label>
                                            <select
                                                name="craft_type"
                                                value={newProduct.craft_type}
                                                onChange={handleFormChange}
                                                className="w-full border border-border bg-[#FDFBF7] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B3232]"
                                            >
                                                <option value="Nepalese Handicraft">Nepalese Handicraft</option>
                                                <option value="Thangka Painting">Thangka Painting</option>
                                                <option value="Dhaka Weaving">Dhaka Weaving</option>
                                                <option value="Pottery">Pottery</option>
                                                <option value="Jewelry">Jewelry</option>
                                                <option value="Wood Crafts">Wood Crafts</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-[#3D1A16] mb-2">Description</label>
                                        <textarea
                                            name="description"
                                            rows={5}
                                            value={newProduct.description}
                                            onChange={handleFormChange}
                                            placeholder="Write detailed information about the handicraft, historical roots, dimensions, etc..."
                                            className="w-full border border-border bg-[#FDFBF7] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B3232] resize-none"
                                        />
                                    </div>

                                    <div className="flex gap-4">
                                        <button
                                            type="submit"
                                            disabled={addingProduct}
                                            className="flex-1 h-12 bg-[#8B3232] hover:bg-[#722727] disabled:opacity-50 text-white rounded-full text-sm font-bold shadow-md cursor-pointer transition flex items-center justify-center gap-1.5"
                                        >
                                            {addingProduct ? "Listing Product..." : "List Product"}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setActiveTab("products")}
                                            className="flex-1 h-12 border border-[#EADCC9] hover:bg-[#FDFBF9] text-[#7A6D65] rounded-full text-sm font-bold cursor-pointer transition"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>

                                {/* Sidebar Images */}
                                <div className="space-y-6">
                                    <div className="bg-[#FDFBF9] border border-[#EADCC9] rounded-2xl p-6">
                                        <h3 className="font-serif font-bold text-[#3D1A16] text-lg mb-4">Upload Images</h3>
                                        
                                        {newProductPreviews.length > 0 && (
                                            <div className="grid grid-cols-2 gap-3 mb-4">
                                                {newProductPreviews.map((src, idx) => (
                                                    <div key={idx} className="relative aspect-square border border-border rounded-xl overflow-hidden">
                                                        <Image src={src} alt={`Upload ${idx}`} fill className="object-cover" />
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveNewImage(idx)}
                                                            className="absolute top-1.5 right-1.5 bg-red-600 hover:bg-red-750 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] cursor-pointer"
                                                        >
                                                            ✕
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        <div className="border-2 border-dashed border-[#EADCC9] hover:border-[#8B3232] rounded-xl p-6 text-center relative transition-colors bg-white">
                                            <Upload className="w-8 h-8 mx-auto text-[#8B3232] mb-2" />
                                            <p className="text-xs font-semibold text-[#5C2E2E]">Upload Images (max 6)</p>
                                            <p className="text-[10px] text-muted-foreground mt-0.5">PNG, JPG up to 5MB</p>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                onChange={handleImageUpload}
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    )}
                </main>
            </div>
        );
    }

    // ----------------------------------------------------
    // CUSTOMER VIEW RENDERING
    // ----------------------------------------------------
    return (
        <div className="min-h-screen bg-[#FBF8F3] py-10">
            <main className="mx-auto max-w-6xl px-6">
                {error && (
                    <p className="mb-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-destructive">
                        {error}
                    </p>
                )}

                {/* Welcome Card */}
                <section className="flex flex-col justify-between gap-6 rounded-3xl border border-[#EADCC9] bg-white p-6 sm:p-8 sm:flex-row sm:items-center shadow-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                        <div className="w-16 h-16 bg-[#5C1A1A] text-white rounded-full flex items-center justify-center font-serif font-bold text-2xl shadow-sm border border-[#EADCC9]/50 flex-shrink-0">
                            {initials}
                        </div>
                        <div>
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="bg-[#ead7bf]/40 text-[#8B3232] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
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
                            <p className="mt-2 text-xs text-[#7A6D65] max-w-md leading-relaxed">
                                Every piece you collect supports authentic local Nepalese craftsmanship and artisan livelihoods.
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                        <Link
                            href="/shop"
                            className="h-11 shrink-0 rounded-full bg-primary-700 hover:bg-primary-800 px-6 text-xs font-semibold text-white transition-all flex items-center justify-center shadow-xs text-center"
                        >
                            Explore Marketplace
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="h-11 shrink-0 rounded-full border border-border hover:bg-red-50 hover:text-red-750 px-6 text-xs font-semibold text-muted-foreground transition-all cursor-pointer bg-white"
                        >
                            Sign Out
                        </button>
                    </div>
                </section>

                {/* Stats */}
                <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="rounded-2xl border border-[#EADCC9] bg-white px-6 py-5">
                        <p className="text-3xl font-semibold text-primary-500">{customerOrders.length}</p>
                        <p className="mt-1 text-sm text-[#7A6D65]">Orders placed</p>
                    </div>
                    <div className="rounded-2xl border border-[#EADCC9] bg-white px-6 py-5">
                        <p className="text-3xl font-semibold text-primary-500">
                            {new Set(customerOrders.map(o => o.artisan)).size}
                        </p>
                        <p className="mt-1 text-sm text-[#7A6D65]">Artisans supported</p>
                    </div>
                    <div className="rounded-2xl border border-[#EADCC9] bg-white px-6 py-5">
                        <p className="text-3xl font-semibold text-primary-500">{wishlist.length}</p>
                        <p className="mt-1 text-sm text-[#7A6D65]">Saved pieces</p>
                    </div>
                </section>

                <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Recent orders */}
                    <section className="lg:col-span-2">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-brown-500 font-serif">Recent orders</h2>
                            <Link href="/dashboard/orders" className="text-sm text-[#8B3232] hover:underline">
                                View all
                            </Link>
                        </div>

                        <div className="mt-4 flex flex-col gap-4">
                            {customerOrders.length === 0 ? (
                                <div className="rounded-2xl border border-dashed border-[#EADCC9] bg-white px-6 py-10 text-center">
                                    <p className="text-[#7A6D65]">
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
                                customerOrders.slice(0, 5).map((order) => (
                                    <div
                                        key={order.id}
                                        className="flex items-center gap-4 rounded-2xl border border-[#EADCC9] bg-white px-5 py-4"
                                    >
                                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[#F5EDE2] border border-border/10">
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
                                            <p className="truncate font-semibold text-[#3D1A16]">
                                                {order.productName}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                by {order.artisan} &middot;{" "}
                                                {new Date(order.date).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <p className="font-bold text-[#3D1A16]">
                                                Rs. {order.total.toLocaleString()}
                                            </p>
                                            <span
                                                className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                                                    STATUS_STYLES[order.status] || "bg-gray-50 text-gray-650"
                                                }`}
                                            >
                                                {order.status}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </section>

                    {/* Wishlist + Account Details */}
                    <section className="flex flex-col gap-8">
                        <div>
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-brown-500 font-serif">Saved pieces</h2>
                                <Link href="/dashboard/wishlist" className="text-sm text-[#8B3232] hover:underline">
                                    View all
                                </Link>
                            </div>
                            <div className="mt-4 flex flex-col gap-3">
                                {wishlist.length === 0 ? (
                                    <div className="rounded-2xl border border-dashed border-[#EADCC9] bg-white px-5 py-8 text-center">
                                        <p className="text-sm text-[#7A6D65]">
                                            Nothing saved yet. Tap the heart on a piece you love.
                                        </p>
                                    </div>
                                ) : (
                                    wishlist.slice(0, 3).map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex items-center gap-3 rounded-2xl border border-[#EADCC9] bg-white px-4 py-3"
                                        >
                                            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-[#F5EDE2] border border-border/10">
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
                                                <p className="truncate text-sm font-semibold text-[#3D1A16]">
                                                    {item.name}
                                                </p>
                                                <p className="truncate text-xs text-[#7A6D65]">
                                                    {item.artisan}
                                                </p>
                                            </div>
                                            <p className="text-sm font-bold text-[#8B3232] shrink-0">
                                                Rs. {item.price.toLocaleString()}
                                            </p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="rounded-2xl border border-[#EADCC9] bg-white p-6 shadow-xs">
                            <h2 className="text-lg font-semibold text-brown-500 font-serif">Account details</h2>
                            <dl className="mt-4 space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <dt className="text-[#7A6D65]">Name</dt>
                                    <dd className="font-semibold text-[#3D1A16]">{user?.name ?? "—"}</dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt className="text-[#7A6D65]">Email</dt>
                                    <dd className="font-semibold text-[#3D1A16]">{user?.email ?? "—"}</dd>
                                </div>
                                {user?.joinedAt && (
                                    <div className="flex justify-between">
                                        <dt className="text-[#7A6D65]">Member since</dt>
                                        <dd className="font-semibold text-[#3D1A16]">
                                            {new Date(user.joinedAt).toLocaleDateString()}
                                        </dd>
                                    </div>
                                )}
                            </dl>
                            <Link
                                href="/dashboard/settings"
                                className="mt-5 inline-block text-sm font-semibold text-[#8B3232] hover:underline"
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