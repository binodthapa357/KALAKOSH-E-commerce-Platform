"use client";

interface AddToCartButtonProps {
  productId: string;
}

export default function AddToCartButton({ productId }: AddToCartButtonProps) {
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // TODO: your add-to-cart logic here (e.g. call context/store, API, etc.)
    console.log("Add to cart:", productId);
  };

  return (
    <button className="add-btn" aria-label="Add to cart" onClick={handleAddToCart}>
      🛒 Add
    </button>
  );
}