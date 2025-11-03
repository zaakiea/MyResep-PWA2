// src/pages/ProfilePage.jsx
import { useState } from "react";
import { Save, Loader, Edit3 } from "lucide-react";
import userService from "../services/userService";
import AvatarUploader from "../components/profile/AvatarUploader";
import FavoriteList from "../components/profile/FavoriteList";

export default function ProfilePage({ onRecipeClick }) {
  const [profile, setProfile] = useState(userService.getUserProfile());
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    setIsLoading(true);
    setStatus("Menyimpan...");
    const result = userService.saveUserProfile(profile);
    setTimeout(() => {
      setIsLoading(false);
      if (result.success) {
        setStatus("Profil berhasil disimpan!");
        setIsEditing(false);
      } else {
        setStatus("Gagal menyimpan profil.");
      }
      // Clear status message after 2 seconds
      setTimeout(() => setStatus(""), 2000);
    }, 1000);
  };

  const handleAvatarChange = (avatarBase64) => {
    setProfile((prev) => ({
      ...prev,
      avatar: avatarBase64,
    }));
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-50 pb-20 md:pb-8">
      <main className="max-w-4xl mx-auto px-4 md:px-8 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8 text-left">
          <h1 className="text-3xl md:text-5xl font-bold text-slate-800 mb-4">
            Profil Saya
          </h1>
          <p className="text-slate-600 max-w-2xl">
            Atur informasi akun Anda dan lihat resep favorit Anda.
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-xl border border-white/40 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
            <AvatarUploader
              initialAvatar={profile.avatar}
              onAvatarChange={handleAvatarChange}
              isEditing={isEditing}
            />
            <div className="flex-1 w-full text-center md:text-left">
              {isEditing ? (
                <input
                  type="text"
                  name="username"
                  value={profile.username}
                  onChange={handleInputChange}
                  className="w-full text-2xl md:text-3xl font-bold text-slate-800 border-b-2 border-blue-300 focus:border-blue-500 outline-none bg-transparent"
                />
              ) : (
                <h2 className="text-2xl md:text-3xl font-bold text-slate-800">
                  {profile.username}
                </h2>
              )}
              <p className="text-slate-500 mb-4 text-xs md:text-sm break-all">
                ID: {profile.userId}
              </p>

              {isEditing ? (
                <textarea
                  name="bio"
                  value={profile.bio}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Tulis bio singkat..."
                  className="w-full text-slate-600 border border-slate-300 rounded-lg p-2 focus:border-blue-500 outline-none bg-white resize-none"
                />
              ) : (
                <p className="text-slate-600">
                  {profile.bio || "Belum ada bio."}
                </p>
              )}
            </div>
            <div className="flex-shrink-0">
              {isEditing ? (
                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 font-medium disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader className="w-5 h-5 animate-spin" />
                  ) : (
                    <Save className="w-5 h-5" />
                  )}
                  <span>{isLoading ? "Menyimpan..." : "Simpan"}</span>
                </button>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 font-medium"
                >
                  <Edit3 className="w-5 h-5" />
                  <span>Edit Profil</span>
                </button>
              )}
            </div>
          </div>
          {status && (
            <p
              className={`text-sm mt-4 text-center md:text-right ${
                status.includes("Gagal") ? "text-red-600" : "text-green-600"
              }`}
            >
              {status}
            </p>
          )}
        </div>

        {/* Favorite Recipes Section */}
        <FavoriteList onRecipeClick={onRecipeClick} />
      </main>
    </div>
  );
}
