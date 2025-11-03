// src/main.jsx
import { StrictMode, useState, lazy, Suspense, useEffect } from 'react' // <-- MODIFIKASI: Tambahkan useEffect
import { createRoot } from 'react-dom/client'
import SplashScreen from './pages/SplashScreen';
// Impor statis untuk komponen UI utama
import DesktopNavbar from './components/navbar/DesktopNavbar';
import MobileNavbar from './components/navbar/MobileNavbar';
import './index.css'
import PWABadge from './PWABadge';

// --- Komponen fallback untuk lazy loading ---
function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
    </div>
  );
}

// --- Impor halaman lazy ---
const HomePage = lazy(() => import('./pages/HomePage'));
const MakananPage = lazy(() => import('./pages/MakananPage'));
const MinumanPage = lazy(() => import('./pages/MinumanPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const CreateRecipePage = lazy(() => import('./pages/CreateRecipePage'));
const EditRecipePage = lazy(() => import('./pages/EditRecipePage'));
const RecipeDetail = lazy(() => import('./components/recipe/RecipeDetail'));

function AppRoot() {
  const [showSplash, setShowSplash] = useState(true);
  const [currentPage, setCurrentPage] = useState('home');
  const [mode, setMode] = useState('list'); // 'list', 'detail', 'create', 'edit'
  const [selectedRecipeId, setSelectedRecipeId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('makanan');
  const [editingRecipeId, setEditingRecipeId] = useState(null);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  // --- TAMBAHAN: useEffect untuk menangani deep link (share) ---
  useEffect(() => {
    // Hanya jalankan ini satu kali setelah splash screen selesai
    if (!showSplash) { 
      const urlParams = new URLSearchParams(window.location.search);
      const recipeIdFromUrl = urlParams.get('recipeId');

      if (recipeIdFromUrl) {
        // Jika ada recipeId di URL, langsung buka halaman detail
        handleRecipeClick(recipeIdFromUrl); // handleRecipeClick akan mengatur mode dan ID
        
        // Hapus query param dari URL agar terlihat bersih
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, [showSplash]); // Dijalankan saat showSplash berubah

  
  const handleNavigation = (page) => {
    setCurrentPage(page);
    setMode('list');
    setSelectedRecipeId(null);
    setEditingRecipeId(null);
  };
  
  const handleCreateRecipe = () => {
    setMode('create');
  };

  const handleRecipeClick = (recipeId, category) => {
    setSelectedRecipeId(recipeId);
    // Jika 'category' tidak disediakan (dari URL), default ke 'currentPage' (yaitu 'home')
    // Ini tidak masalah, karena RecipeDetail akan fetch data lengkap termasuk kategori aslinya
    setSelectedCategory(category || currentPage);
    setMode('detail');
  };

  const handleEditRecipe = (recipeId) => {
    console.log('Edit button clicked! Recipe ID:', recipeId);
    setEditingRecipeId(recipeId);
    setMode('edit');
    console.log('Mode changed to: edit');
  };

  const handleBack = () => {
    setMode('list');
    setSelectedRecipeId(null);
    setEditingRecipeId(null);
  };

  const handleCreateSuccess = (newRecipe) => {
    alert('Resep berhasil dibuat!');
    setMode('list');
    if (newRecipe && newRecipe.category) {
      setCurrentPage(newRecipe.category);
    }
  };

  const handleEditSuccess = (updatedRecipe) => {
    alert('Resep berhasil diperbarui!');
    setMode('list');
  };

  const renderCurrentPage = () => {
    // ... (Logika renderCurrentPage tidak berubah)
    // Show Create Recipe Page
    if (mode === 'create') {
      return (
        <CreateRecipePage
          onBack={handleBack}
          onSuccess={handleCreateSuccess}
        />
      );
    }
    
    // Show Edit Recipe Page
    if (mode === 'edit') {
      return (
        <EditRecipePage
          recipeId={editingRecipeId}
          onBack={handleBack}
          onSuccess={handleEditSuccess}
        />
      );
    }

    // Show Recipe Detail
    if (mode === 'detail') {
      return (
        <RecipeDetail
          recipeId={selectedRecipeId}
          category={selectedCategory}
          onBack={handleBack}
          onEdit={handleEditRecipe}
        />
      );
    }

    // Show List Pages
    switch (currentPage) {
      case 'home':
        return <HomePage 
          onRecipeClick={handleRecipeClick} 
          onNavigate={handleNavigation} />;
      case 'makanan':
        return <MakananPage 
          onRecipeClick={handleRecipeClick} />;
      case 'minuman':
        return <MinumanPage 
          onRecipeClick={handleRecipeClick} />;
      case 'profile':
        return <ProfilePage 
          onRecipeClick={handleRecipeClick} />;
      default:
        return <HomePage 
          onRecipeClick={handleRecipeClick} 
          onNavigate={handleNavigation} />;
    }
  };
  
  if (showSplash) {
    return <SplashScreen 
      onComplete={handleSplashComplete} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {mode === 'list' && (
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
      
      <Suspense fallback={<LoadingFallback />}>
        <main className="min-h-screen">
          {renderCurrentPage()}
        </main>
      </Suspense>
      
      <PWABadge />
    </div>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppRoot />
  </StrictMode>,
)