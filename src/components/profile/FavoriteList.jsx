// src/components/profile/FavoriteList.jsx
import { Heart, Loader } from "lucide-react";
import { useFavorites } from "../../hooks/useFavorites";

export default function FavoriteList({ onRecipeClick }) {
  const { favorites, loading, error, refetch } = useFavorites();

  const handleRecipeClick = (recipeId, category) => {
    // Navigasi ke detail resep
    if (onRecipeClick) {
      onRecipeClick(recipeId, category);
    }
  };

  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-xl border border-white/40">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
        <Heart className="w-6 h-6 text-red-500" />
        Resep Favorit Saya
      </h2>
      {loading && (
        <div className="flex justify-center items-center py-10">
          <Loader className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      )}
      {error && (
        <div className="text-center py-10 text-red-600">
          <p>Terjadi kesalahan: {error}</p>
          <button
            onClick={refetch}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg"
          >
            Coba Lagi
          </button>
        </div>
      )}
      {!loading && !error && (
        <>
          {favorites.length === 0 ? (
            <p className="text-slate-500 text-center py-10">
              Anda belum memiliki resep favorit.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {favorites.map((recipe) => (
                <div
                  key={recipe.id}
                  onClick={() => handleRecipeClick(recipe.id, recipe.category)}
                  className="flex items-center gap-4 bg-white/70 p-4 rounded-2xl border border-white/60 cursor-pointer hover:bg-blue-50 transition-colors"
                >
                  <img
                    src={recipe.image_url}
                    alt={recipe.name}
                    className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-xl flex-shrink-0"
                  />
                  <div className="flex-1">
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        recipe.category === "makanan"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {recipe.category}
                    </span>
                    <h3 className="font-bold text-slate-800 mt-2 line-clamp-2">
                      {recipe.name}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
