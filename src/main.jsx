// src/main.jsx
import { StrictMode, useState, Suspense, lazy, useEffect } from "react";
import { createRoot } from "react-dom/client";
import SplashScreen from "./pages/SplashScreen";
import DesktopNavbar from "./components/navbar/DesktopNavbar";
import MobileNavbar from "./components/navbar/MobileNavbar";
import "./index.css";
import PWABadge from "./PWABadge";
import { Loader } from "lucide-react";
import { clearAllCache, invalidateCache } from "./utils/cache"; // Import cache clear

// --- Lazy Load Pages ---
const HomePage = lazy(() => import("./pages/HomePage"));
const MakananPage = lazy(() => import("./pages/MakananPage"));
const MinumanPage = lazy(() => import("./pages/MinumanPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const CreateRecipePage = lazy(() => import("./pages/CreateRecipePage"));
const EditRecipePage = lazy(() => import("./pages/EditRecipePage"));
const RecipeDetail = lazy(() => import("./components/recipe/RecipeDetail"));

// --- Loading Fallback Component ---
function PageLoader() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-blue-50">
      <Loader className="w-12 h-12 text-blue-600 animate-spin" />
    </div>
  );
}

function AppRoot() {
  const [showSplash, setShowSplash] = useState(true);
  const [currentPage, setCurrentPage] = useState("home");
  const [mode, setMode] = useState("list"); // 'list', 'detail', 'create', 'edit'
  const [selectedRecipeId, setSelectedRecipeId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("makanan");
  const [editingRecipeId, setEditingRecipeId] = useState(null);

  // --- HASH ROUTING LOGIC (untuk Share Link) ---
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith("#/recipe/")) {
        const recipeId = hash.split("/")[2];
        if (recipeId) {
          setSelectedRecipeId(recipeId);
          // Kita tidak tahu kategorinya dari URL, default ke 'makanan'
          // atau coba tebak (tapi default lebih aman)
          setSelectedCategory("makanan"); // Kategori di-fetch oleh useRecipe
          setMode("detail");
        }
      } else if (hash.startsWith("#/edit/")) {
        const recipeId = hash.split("/")[2];
        if (recipeId) {
          setEditingRecipeId(recipeId);
          setMode("edit");
        }
      } else if (hash.startsWith("#/create")) {
        setMode("create");
      } else {
        // Jika hash kosong atau tidak dikenal, kembali ke list
        if (mode !== "list") {
          setMode("list");
          setSelectedRecipeId(null);
          setEditingRecipeId(null);
        }
      }
    };

    // Panggil sekali saat load
    handleHashChange();

    // Dengarkan perubahan hash
    window.addEventListener("hashchange", handleHashChange);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [mode]); // Tambahkan 'mode' sebagai dependensi

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  const handleNavigation = (page) => {
    setCurrentPage(page);
    setMode("list");
    setSelectedRecipeId(null);
    setEditingRecipeId(null);
    window.location.hash = ""; // Hapus hash saat navigasi normal
  };

  const handleCreateRecipe = () => {
    setMode("create");
    window.location.hash = "#/create"; // Opsional: set hash
  };

  const handleRecipeClick = (recipeId, category) => {
    setSelectedRecipeId(recipeId);
    setSelectedCategory(category || currentPage);
    setMode("detail");
    window.location.hash = `#/recipe/${recipeId}`; // Set hash untuk share
  };

  const handleEditRecipe = (recipeId) => {
    setEditingRecipeId(recipeId);
    setMode("edit");
    window.location.hash = `#/edit/${recipeId}`; // Opsional: set hash
  };

  const handleBack = () => {
    setMode("list");
    setSelectedRecipeId(null);
    setEditingRecipeId(null);
    window.location.hash = ""; // Hapus hash saat kembali
  };

  // Hapus cache setelah create/update/delete berhasil
  const handleCreateSuccess = (newRecipe) => {
    alert("Resep berhasil dibuat!");
    clearAllCache(); // Hapus cache
    setMode("list");
    if (newRecipe && newRecipe.category) {
      setCurrentPage(newRecipe.category);
    }
    window.location.hash = "";
  };

  const handleEditSuccess = (updatedRecipe) => {
    alert("Resep berhasil diperbarui!");
    clearAllCache(); // Hapus cache
    invalidateCache(`recipe_${updatedRecipe.id}`); // Hapus cache resep spesifik
    setMode("detail"); // Kembali ke detail page setelah edit
    setSelectedRecipeId(updatedRecipe.id);
    window.location.hash = `#/recipe/${updatedRecipe.id}`;
  };

  const renderCurrentPage = () => {
    // Show Create Recipe Page
    if (mode === "create") {
      return (
        <CreateRecipePage onBack={handleBack} onSuccess={handleCreateSuccess} />
      );
    }

    // Show Edit Recipe Page
    if (mode === "edit") {
      return (
        <EditRecipePage
          recipeId={editingRecipeId}
          onBack={handleBack}
          onSuccess={handleEditSuccess}
        />
      );
    }

    // Show Recipe Detail
    if (mode === "detail") {
      return (
        <RecipeDetail
          recipeId={selectedRecipeId}
          onBack={handleBack}
          onEdit={handleEditRecipe}
        />
      );
    }

    // Show List Pages
    switch (currentPage) {
      case "home":
        return (
          <HomePage
            onRecipeClick={handleRecipeClick}
            onNavigate={handleNavigation}
          />
        );
      case "makanan":
        return (
          <MakananPage
            onRecipeClick={(id) => handleRecipeClick(id, "makanan")}
          />
        );
      case "minuman":
        return (
          <MinumanPage
            onRecipeClick={(id) => handleRecipeClick(id, "minuman")}
          />
        );
      case "profile":
        return <ProfilePage onRecipeClick={handleRecipeClick} />;
      default:
        return (
          <HomePage
            onRecipeClick={handleRecipeClick}
            onNavigate={handleNavigation}
          />
        );
    }
  };

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hanya tampilkan navbar jika BUKAN mode detail/create/edit */}
      {mode === "list" && (
        <>
          <DesktopNavbar
            currentPage={currentPage}
            onNavigate={handleNavigation}
            onCreateRecipe={handleCreateRecipe}
          />
          <MobileNavbar
            currentPage={currentPage}
            onNavigate={handleNavigation}
            onCreateRecipe={handleCreateRecipe}
          />
        </>
      )}

      {/* Main Content dengan Suspense untuk Lazy Load */}
      <main className="min-h-screen">
        <Suspense fallback={<PageLoader />}>{renderCurrentPage()}</Suspense>
      </main>

      <PWABadge />
    </div>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AppRoot />
  </StrictMode>
);
