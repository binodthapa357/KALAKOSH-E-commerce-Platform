export interface CartItem {
  productId: string;
  name: string;
  description?: string;
  image: string;
  price: number;
  originalPrice?: number;
  vendorName: string;
  stock: number;
  quantity: number;
}

const CART_KEY = "kalakosh_cart";
export const CART_UPDATED_EVENT = "kalakosh-cart-updated";

function readCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    const list = Array.isArray(parsed) ? parsed : [];

    // Self-heal: repair any items already in storage from before validation
    // existed (e.g. NaN prices, missing images/names from an older bug).
    let repaired = false;
    const clean = list.map((raw: any) => {
      // If stored in AppContext format: { product: {...}, quantity: N }
      if (raw && raw.product && typeof raw.product === "object") {
        const p = raw.product;
        const price = Number(p.discount_price ?? p.price);
        const originalPrice = p.discount_price !== undefined ? Number(p.price) : undefined;
        const stock = Number(p.stock);
        const quantity = Number(raw.quantity);
        return {
          productId: p._id ?? "",
          name: p.name || "Untitled product",
          description: p.description || undefined,
          image: p.images?.[0] || "/placeholder.svg",
          price: Number.isFinite(price) ? price : 0,
          originalPrice: originalPrice && Number.isFinite(originalPrice) ? originalPrice : undefined,
          vendorName: (typeof p.vendor_id === "object" && p.vendor_id?.shop_name) || "Kalakosh Artisan",
          stock: Number.isFinite(stock) && stock > 0 ? stock : Infinity,
          quantity: Number.isFinite(quantity) && quantity >= 1 ? quantity : 1,
        };
      }

      // Existing flat format
      const price = Number(raw.price);
      const originalPrice = raw.originalPrice !== undefined ? Number(raw.originalPrice) : undefined;
      const stock = Number(raw.stock);
      const quantity = Number(raw.quantity);
      const needsFix =
        !Number.isFinite(price) ||
        !raw.name ||
        !raw.image ||
        !raw.vendorName ||
        !Number.isFinite(quantity) ||
        quantity < 1;

      if (needsFix) repaired = true;

      return {
        productId: raw.productId ?? "",
        name: raw.name || "Untitled product",
        description: raw.description || undefined,
        image: raw.image || "/placeholder.svg",
        price: Number.isFinite(price) ? price : 0,
        originalPrice:
          originalPrice !== undefined && Number.isFinite(originalPrice)
            ? originalPrice
            : undefined,
        vendorName: raw.vendorName || "Kalakosh Artisan",
        stock: Number.isFinite(stock) && stock > 0 ? stock : Infinity,
        quantity: Number.isFinite(quantity) && quantity >= 1 ? quantity : 1,
      };
    });

    if (repaired) {
      localStorage.setItem(CART_KEY, JSON.stringify(clean));
    }

    return clean;
  } catch {
    return [];
  }
}

function writeCart(items: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(CART_UPDATED_EVENT));
}

/**
 * Coerces whatever was passed in into a valid, storable cart item.
 * This is the safety net: even if the caller forgot to pass price/image/
 * name/vendorName, we never let NaN or undefined reach localStorage.
 */
function sanitizeItem(item: Partial<Omit<CartItem, "quantity">>): Omit<CartItem, "quantity"> {
  const price = Number(item.price);
  const originalPrice = item.originalPrice !== undefined ? Number(item.originalPrice) : undefined;
  const stock = Number(item.stock);

  if (!item.productId) {
    console.warn(
      "[cart] addToCart called without a productId — this item cannot be tracked correctly."
    );
  }
  if (!Number.isFinite(price)) {
    console.warn(
      `[cart] addToCart called with an invalid price ("${item.price}") for product "${item.productId}". ` +
        "Check that the caller (e.g. ProductCard) is passing a numeric `price` prop. Defaulting to 0."
    );
  }
  if (!item.name) {
    console.warn(`[cart] addToCart called without a name for product "${item.productId}".`);
  }
  if (!item.image) {
    console.warn(`[cart] addToCart called without an image for product "${item.productId}".`);
  }
  if (!item.vendorName) {
    console.warn(`[cart] addToCart called without a vendorName for product "${item.productId}".`);
  }

  return {
    productId: item.productId ?? "",
    name: item.name || "Untitled product",
    description: item.description || undefined,
    image: item.image || "/placeholder.svg",
    price: Number.isFinite(price) ? price : 0,
    originalPrice:
      originalPrice !== undefined && Number.isFinite(originalPrice) ? originalPrice : undefined,
    vendorName: item.vendorName || "Kalakosh Artisan",
    stock: Number.isFinite(stock) && stock > 0 ? stock : Infinity,
  };
}

export function getCart(): CartItem[] {
  return readCart();
}

export function getCartCount(): number {
  return readCart().reduce((sum, i) => sum + i.quantity, 0);
}

export function addToCart(item: Partial<Omit<CartItem, "quantity">>, quantity = 1): CartItem[] {
  const clean = sanitizeItem(item);
  const items = readCart();
  const existing = items.find((i) => i.productId === clean.productId);
  const cap = clean.stock > 0 ? clean.stock : Infinity;

  if (existing) {
    existing.quantity = Math.min(existing.quantity + quantity, cap);
  } else {
    items.push({ ...clean, quantity: Math.min(quantity, cap) });
  }

  writeCart(items);
  return items;
}

export function updateCartQuantity(productId: string, quantity: number): CartItem[] {
  const items = readCart();
  const idx = items.findIndex((i) => i.productId === productId);
  if (idx === -1) return items;

  if (quantity < 1) {
    items.splice(idx, 1);
  } else {
    const cap = items[idx].stock > 0 ? items[idx].stock : Infinity;
    items[idx].quantity = Math.min(quantity, cap);
  }

  writeCart(items);
  return items;
}

export function removeFromCart(productId: string): CartItem[] {
  const items = readCart().filter((i) => i.productId !== productId);
  writeCart(items);
  return items;
}

export function clearCart(): void {
  writeCart([]);
}