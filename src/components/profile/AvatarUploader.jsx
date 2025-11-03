// src/components/profile/AvatarUploader.jsx
import { useState, useRef } from "react";
import { User, Camera } from "lucide-react";

export default function AvatarUploader({
  initialAvatar,
  onAvatarChange,
  isEditing,
}) {
  const [avatarPreview, setAvatarPreview] = useState(initialAvatar);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validasi sederhana (opsional)
      if (file.size > 2 * 1024 * 1024) {
        alert("Ukuran file maksimal 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
        onAvatarChange(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditClick = () => {
    fileInputRef.current.click();
  };

  // Update preview jika initialAvatar berubah (misalnya setelah save)
  useState(() => {
    setAvatarPreview(initialAvatar);
  }, [initialAvatar]);

  return (
    <div className="relative w-32 h-32 md:w-40 md:h-40 flex-shrink-0 group">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/png, image/jpeg, image/webp"
      />
      {avatarPreview ? (
        <img
          src={avatarPreview}
          alt="Avatar"
          className="w-full h-full rounded-full object-cover shadow-lg border-4 border-white"
        />
      ) : (
        <div className="w-full h-full rounded-full bg-slate-200 flex items-center justify-center shadow-lg border-4 border-white">
          <User className="w-16 h-16 text-slate-400" />
        </div>
      )}
      {isEditing && (
        <button
          type="button"
          onClick={handleEditClick}
          className="absolute inset-0 w-full h-full bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
        >
          <Camera className="w-8 h-8" />
        </button>
      )}
    </div>
  );
}
