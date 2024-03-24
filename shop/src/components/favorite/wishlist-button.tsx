import { useRouter } from 'next/router';

export default function WishlistNavButton({ className }: { className?: string }) {
  const router = useRouter();

  const navigateToWishlist = () => {
    router.push('/wishlists');
  };

  return (
    <button
      type="button"
      className={className}
      onClick={navigateToWishlist}
    >
      Wishlist
    </button>
  );
}