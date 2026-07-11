"use client";

interface WishlistButtonProps {
  productId: string;
}

export default function WishlistButton({ productId }: WishlistButtonProps) {
  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // TODO: your wishlist toggle logic here
    console.log("Toggle wishlist:", productId);
  };

  return (
    <button className="wish-btn" aria-label="Wishlist" onClick={handleToggleWishlist}>
      ♡
    </button>
  );
}