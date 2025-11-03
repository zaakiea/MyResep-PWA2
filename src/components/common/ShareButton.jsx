// src/components/common/ShareButton.jsx
import { useState } from "react";
import { Share2, Check, Copy } from "lucide-react";

// URL Vercel Anda
const BASE_URL = "https://myresep-ten.vercel.app";

export default function ShareButton({ recipeId, recipeName }) {
  const [copied, setCopied] = useState(false);
  const shareUrl = `${BASE_URL}/#/recipe/${recipeId}`;

  const handleShare = async () => {
    const shareData = {
      title: recipeName,
      text: `Lihat resep ${recipeName} di Resep Nusantara!`,
      url: shareUrl,
    };

    // Coba gunakan Web Share API (untuk mobile)
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error("Gagal share:", err);
      }
    } else {
      // Fallback: Salin ke clipboard (untuk desktop)
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset status
      } catch (err) {
        console.error("Gagal menyalin:", err);
        alert("Gagal menyalin link");
      }
    }
  };

  return (
    <button
      onClick={handleShare}
      className={`relative flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
        copied
          ? "bg-green-600 text-white"
          : "bg-gray-100 hover:bg-gray-200 text-slate-700"
      }`}
    >
      {copied ? (
        <>
          <Check className="w-4 h-4" />
          <span>Disalin!</span>
        </>
      ) : (
        <>
          {navigator.share ? (
            <Share2 className="w-4 h-4" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
          <span>{navigator.share ? "Bagikan" : "Salin Link"}</span>
        </>
      )}
    </button>
  );
}
