// src/components/common/FavoriteButton.jsx
import { useState } from 'react'; // <-- Hapus useEffect
import { Heart } from 'lucide-react';
import { useIsFavorited } from '../../hooks/useFavorites'; // <-- IMPORT HOOK API

/**
 * FavoriteButton Component
 * Toggles favorite status using the API via useIsFavorited hook
 */
export default function FavoriteButton({ recipeId, size = 'md' }) {
  // --- MODIFIKASI: Gunakan hook API, bukan localStorage ---
  const { isFavorited, loading, toggleFavorite } = useIsFavorited(recipeId);
  const [isAnimating, setIsAnimating] = useState(false);

  // Size variants (Tidak berubah)
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };
  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  // --- HAPUS: useEffect yang membaca dari localStorage ---

  const handleToggle = async (e) => {
    e.stopPropagation(); // Prevent card click
    if (loading) return; // Jangan lakukan apapun jika sedang loading

    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);

    // --- MODIFIKASI: Panggil fungsi toggleFavorite dari hook API ---
    await toggleFavorite();
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading} // <-- Tambahkan status disabled
      className={`
        ${sizes[size]} rounded-full flex items-center justify-center gap-1.5
        transition-all duration-200
        ${isFavorited
          ? 'bg-red-500 hover:bg-red-600 text-white'
          : 'bg-white/90 hover:bg-white text-slate-700 hover:text-red-500'
        }
        backdrop-blur-sm shadow-md hover:shadow-lg
        ${isAnimating ? 'scale-125' : 'scale-100'}
        disabled:opacity-70 disabled:cursor-wait
        group
      `}
      title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart
        className={`
          ${iconSizes[size]}
          transition-all duration-200
          ${isFavorited ? 'fill-current' : ''}
          ${isAnimating ? 'animate-pulse' : ''}
        `}
      />
    </button>
  );
}