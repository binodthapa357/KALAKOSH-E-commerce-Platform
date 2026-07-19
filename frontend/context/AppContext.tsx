"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  is_verified: boolean;
  is_active: boolean;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  discount_price?: number;
  category_id: { _id: string; name: string; slug?: string } | string;
  vendor_id: { _id: string; shop_name: string } | string;
  stock: number;
  region: string;
  material: string;
  craft_type: string;
  images: string[];
  avg_rating: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

interface AppContextType {
  // Auth
  user: User | null;
  token: string | null;
  loadingAuth: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;

  // Cart
  cart: CartItem[];
  cartCount: number;
  cartSubtotal: number;
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateCartQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;

  // Wishlist
  wishlist: Product[];
  toggleWishlist: (product: Product) => Promise<void>;
  isInWishlist: (productId: string) => boolean;

  // Global triggers
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load token and initialize state
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      fetchUserProfile(storedToken);
    } else {
      setLoadingAuth(false);
      loadLocalCartAndWishlist();
    }
  }, []);

  // Fetch profile when token is found
  const fetchUserProfile = async (authToken: string) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUser(data.user);
        // Load cart and wishlist from DB
        await fetchCartFromDB(authToken);
        await fetchWishlistFromDB(authToken);
      } else {
        // Invalid token
        logout();
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      loadLocalCartAndWishlist();
    } finally {
      setLoadingAuth(false);
    }
  };

  const refreshUser = async () => {
    const currentToken = token || localStorage.getItem("token");
    if (currentToken) {
      await fetchUserProfile(currentToken);
    }
  };

  // Load guest cart and wishlist
  const loadLocalCartAndWishlist = () => {
    const localCart = localStorage.getItem("kalakosh_cart");
    const localWishlist = localStorage.getItem("kalakosh_wishlist");
    if (localCart) {
      try {
        setCart(JSON.parse(localCart));
      } catch (e) {
        console.error(e);
      }
    }
    if (localWishlist) {
      try {
        setWishlist(JSON.parse(localWishlist));
      } catch (e) {
        console.error(e);
      }
    }
  };

  // --- DB SYNC FUNCTIONS ---

  const fetchCartFromDB = async (authToken: string) => {
    try {
      const res = await fetch(`${API_URL}/api/cart`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const data = await res.json();
      if (res.ok && data.success && data.cart) {
        const items = data.cart.items.map((item: any) => ({
          product: item.product_id,
          quantity: item.quantity,
        }));
        setCart(items);
      }
    } catch (error) {
      console.error("Error fetching cart from DB:", error);
    }
  };

  const fetchWishlistFromDB = async (authToken: string) => {
    try {
      const res = await fetch(`${API_URL}/api/wishlist`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const data = await res.json();
      if (res.ok && data.success && data.wishlist) {
        setWishlist(data.wishlist.products || []);
      }
    } catch (error) {
      console.error("Error fetching wishlist from DB:", error);
    }
  };

  const syncGuestCartToDB = async (authToken: string, guestCart: CartItem[]) => {
    try {
      for (const item of guestCart) {
        await fetch(`${API_URL}/api/cart`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            product_id: item.product._id,
            quantity: item.quantity,
          }),
        });
      }
      localStorage.removeItem("kalakosh_cart");
    } catch (error) {
      console.error("Error syncing guest cart:", error);
    }
  };

  // --- AUTH HANDLERS ---

  const login = (authToken: string, userData: User) => {
    setToken(authToken);
    setUser(userData);
    localStorage.setItem("token", authToken);

    // Sync guest cart to DB if items exist
    const localCart = localStorage.getItem("kalakosh_cart");
    if (localCart) {
      try {
        const guestItems = JSON.parse(localCart);
        if (guestItems.length > 0) {
          syncGuestCartToDB(authToken, guestItems).then(() => {
            fetchCartFromDB(authToken);
          });
        } else {
          fetchCartFromDB(authToken);
        }
      } catch (e) {
        fetchCartFromDB(authToken);
      }
    } else {
      fetchCartFromDB(authToken);
    }

    fetchWishlistFromDB(authToken);
    toast.success("Welcome back to Kalakosh!");
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setCart([]);
    setWishlist([]);
    localStorage.removeItem("token");
    localStorage.removeItem("kalakosh_cart");
    localStorage.removeItem("kalakosh_wishlist");
    toast.success("Logged out successfully");
  };

  // --- CART MANAGEMENT ---

  const addToCart = async (product: Product, quantity = 1) => {
    const updatedCart = [...cart];
    const existingIndex = updatedCart.findIndex(item => item.product._id === product._id);

    if (existingIndex > -1) {
      updatedCart[existingIndex].quantity += quantity;
    } else {
      updatedCart.push({ product, quantity });
    }

    setCart(updatedCart);
    toast.success(`${product.name} added to cart!`);

    if (token) {
      try {
        await fetch(`${API_URL}/api/cart`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            product_id: product._id,
            quantity,
          }),
        });
      } catch (err) {
        console.error("Error adding to DB cart:", err);
      }
    } else {
      localStorage.setItem("kalakosh_cart", JSON.stringify(updatedCart));
    }
  };

  const removeFromCart = async (productId: string) => {
    const updatedCart = cart.filter(item => item.product._id !== productId);
    setCart(updatedCart);
    toast.info("Item removed from cart");

    if (token) {
      try {
        await fetch(`${API_URL}/api/cart/${productId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (err) {
        console.error("Error removing from DB cart:", err);
      }
    } else {
      localStorage.setItem("kalakosh_cart", JSON.stringify(updatedCart));
    }
  };

  const updateCartQuantity = async (productId: string, quantity: number) => {
    if (quantity < 1) return;
    const updatedCart = cart.map(item =>
      item.product._id === productId ? { ...item, quantity } : item
    );
    setCart(updatedCart);

    if (token) {
      try {
        await fetch(`${API_URL}/api/cart`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            product_id: productId,
            quantity,
          }),
        });
      } catch (err) {
        console.error("Error updating DB cart quantity:", err);
      }
    } else {
      localStorage.setItem("kalakosh_cart", JSON.stringify(updatedCart));
    }
  };

  const clearCart = async () => {
    setCart([]);
    if (token) {
      try {
        await fetch(`${API_URL}/api/cart`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (err) {
        console.error("Error clearing DB cart:", err);
      }
    } else {
      localStorage.removeItem("kalakosh_cart");
    }
  };

  // --- WISHLIST MANAGEMENT ---

  const toggleWishlist = async (product: Product) => {
    const exists = wishlist.some(item => item._id === product._id);
    let updatedWishlist = [];

    if (exists) {
      updatedWishlist = wishlist.filter(item => item._id !== product._id);
      toast.info("Removed from wishlist");
    } else {
      updatedWishlist = [...wishlist, product];
      toast.success("Added to wishlist!");
    }

    setWishlist(updatedWishlist);

    if (token) {
      try {
        await fetch(`${API_URL}/api/wishlist`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            product_id: product._id,
          }),
        });
      } catch (err) {
        console.error("Error toggling DB wishlist:", err);
      }
    } else {
      localStorage.setItem("kalakosh_wishlist", JSON.stringify(updatedWishlist));
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some(item => item._id === productId);
  };

  // Calculations
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartSubtotal = cart.reduce((total, item) => {
    const price = item.product.discount_price ?? item.product.price;
    return total + price * item.quantity;
  }, 0);

  return (
    <AppContext.Provider
      value={{
        user,
        token,
        loadingAuth,
        login,
        logout,
        refreshUser,
        cart,
        cartCount,
        cartSubtotal,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        wishlist,
        toggleWishlist,
        isInWishlist,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
