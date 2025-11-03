// src/pages/ProfilePage.jsx
import { useState, useEffect, useRef } from "react";
import {
  HiUsers,
  HiHashtag,
  HiPencil,
  HiSave,
  HiX,
  HiCamera,
  HiRefresh,
  HiTrash,
  HiHeart,
} from "react-icons/hi";

// Impor hook favorit dan grid
import { useFavorites } from "../hooks/useFavorites";
import RecipeGrid from "../components/makanan/RecipeGrid";

// Kunci untuk localStorage (tidak berubah)
const STORAGE_KEY = "groupProfileInfo";

// Data awal sebagai fallback (tidak berubah)
const initialMembers = [
  { name: "Muhammad Arif Maulana", nim: "21120123140117", avatar: null },
  { name: "DImas Agus Saputra", nim: "21120123130100", avatar: null },
  { name: "Justin Advani", nim: "21120123140137", avatar: null },
  { name: "Althaf Muhammad Taftazani", nim: "21120123120014", avatar: null },
];

// Terima prop onRecipeClick (tidak berubah)
export default function ProfilePage({ onRecipeClick }) {
  const [members, setMembers] = useState(initialMembers);
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRefs = useRef([]);

  // Panggil hook useFavorites (tidak berubah)
  const {
    favorites,
    loading: favoritesLoading,
    error: favoritesError,
  } = useFavorites();

  // --- SEMUA FUNGSI LOGIC (useEffect, handleInputChange, dll) TETAP SAMA ---

  // Load data dari localStorage
  useEffect(() => {
    const storedMembers = localStorage.getItem(STORAGE_KEY);
    if (storedMembers) {
      setMembers(JSON.parse(storedMembers));
    }
  }, []);

  // Handle perubahan input
  const handleInputChange = (index, field, value) => {
    const updatedMembers = members.map((member, i) => {
      if (i === index) {
        return { ...member, [field]: value };
      }
      return member;
    });
    setMembers(updatedMembers);
  };

  // Handle upload foto
  const handlePhotoChange = (index, event) => {
    const file = event.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Harap pilih file gambar (jpg, png, webp).");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert("Ukuran file terlalu besar, maksimal 2MB.");
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      handleInputChange(index, "avatar", reader.result);
    };
  };

  // Trigger input file
  const triggerFileInput = (index) => {
    if (fileInputRefs.current[index]) {
      fileInputRefs.current[index].click();
    }
  };

  // Hapus Foto
  const handleRemovePhoto = (index) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus foto profil ini?")) {
      handleInputChange(index, "avatar", null);
    }
  };

  // Reset Semua Profil
  const handleResetProfiles = () => {
    if (
      window.confirm(
        "PERINGATAN: Ini akan mereset SEMUA data kelompok ke default. Yakin?"
      )
    ) {
      setMembers(initialMembers);
      localStorage.removeItem(STORAGE_KEY);
      setIsEditing(false);
      alert("Semua profil telah di-reset ke data awal.");
    }
  };

  // Simpan perubahan
  const handleSaveChanges = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(members));
    setIsEditing(false);
    alert("Profil berhasil disimpan!");
  };

  // Batal edit
  const handleCancelEdit = () => {
    const storedMembers = localStorage.getItem(STORAGE_KEY);
    setMembers(storedMembers ? JSON.parse(storedMembers) : initialMembers);
    setIsEditing(false);
  };

  const groupInfo = {
    groupName: "Kelompok 20 PBB Shift 4",
  };

  // ===================================================================
  // PERUBAHAN TAMPILAN (LAYOUT) DIMULAI DARI SINI
  // ===================================================================
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 md:p-8 pt-16 md:pt-24 pb-20 md:pb-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
        {/* ================================= */}
        {/* KOLOM KIRI (PROFIL KELOMPOK) */}
        {/* ================================= */}
        <div className="lg:col-span-1 space-y-6">
          {/* Header Kelompok: Judul, Info, dan Tombol Aksi */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-800 flex items-center gap-3">
                <HiUsers className="text-blue-600" />
                {groupInfo.groupName}
              </h1>
              <p className="text-slate-600 mt-2">
                Informasi anggota kelompok praktikum.
              </p>
            </div>
            {/* Tombol Aksi */}
            <div className="flex gap-2 flex-shrink-0">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSaveChanges}
                    className="p-2 bg-green-600 text-white rounded-full hover:bg-green-700 shadow-lg transition-all"
                    title="Simpan Perubahan"
                  >
                    <HiSave className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="p-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 shadow-lg transition-all"
                    title="Batal"
                  >
                    <HiX className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleResetProfiles}
                    className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 shadow-lg transition-all"
                    title="Reset Semua Profil"
                  >
                    <HiRefresh className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 shadow-lg transition-all"
                  title="Edit Profil"
                >
                  <HiPencil className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Grid untuk Kartu Anggota */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
            {members.map((member, index) => (
              // Kartu Anggota Individual
              <div
                key={index}
                className="bg-white/60 backdrop-blur-lg border border-white/40 rounded-2xl shadow-xl p-6 transition-all duration-300 hover:shadow-2xl"
              >
                {/* Bagian Avatar */}
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <img
                    src={
                      member.avatar ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        member.name
                      )}&background=e0e7ff&color=4338ca`
                    }
                    alt={member.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                  {/* Tombol Edit Avatar (Hanya muncul saat mode edit) */}
                  {isEditing && (
                    <div className="absolute bottom-0 right-0 flex">
                      <button
                        onClick={() => triggerFileInput(index)}
                        className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-md hover:bg-blue-700 transition-all border-2 border-white"
                        title="Ganti Foto"
                      >
                        <HiCamera size={16} />
                      </button>
                      {member.avatar && (
                        <button
                          onClick={() => handleRemovePhoto(index)}
                          className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center shadow-md hover:bg-red-700 transition-all -ml-2 border-2 border-white"
                          title="Hapus Foto"
                        >
                          <HiTrash size={16} />
                        </button>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        ref={(el) => (fileInputRefs.current[index] = el)}
                        className="hidden"
                        onChange={(e) => handlePhotoChange(index, e)}
                      />
                    </div>
                  )}
                </div>

                {/* Bagian Info (Nama & NIM) */}
                <div className="text-center">
                  {isEditing ? (
                    // Tampilan Edit
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={member.name}
                        onChange={(e) =>
                          handleInputChange(index, "name", e.target.value)
                        }
                        className="w-full font-bold text-slate-800 text-lg text-center border-b-2 border-slate-300 focus:border-blue-500 focus:ring-0 outline-none bg-transparent py-1 transition-colors"
                        placeholder="Nama Anggota"
                      />
                      <input
                        type="text"
                        value={member.nim}
                        onChange={(e) =>
                          handleInputChange(index, "nim", e.target.value)
                        }
                        className="w-full text-slate-500 text-sm text-center border-b border-slate-300 focus:border-blue-500 focus:ring-0 outline-none bg-transparent py-1 transition-colors"
                        placeholder="NIM"
                      />
                    </div>
                  ) : (
                    // Tampilan Normal
                    <>
                      <p className="font-bold text-slate-800 text-lg">
                        {member.name}
                      </p>
                      <div className="flex items-center justify-center text-slate-500 text-sm mt-1">
                        <HiHashtag size={14} className="mr-1 text-slate-400" />
                        <span>{member.nim}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>{" "}
        {/* Akhir dari Kolom Kiri */}
        {/* ================================= */}
        {/* KOLOM KANAN (RESEP FAVORIT) */}
        {/* ================================= */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header Favorit */}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">
              Resep Favorit Saya
            </h1>
            <p className="text-slate-600">Resep yang telah Anda simpan.</p>
          </div>

          {/* Konten Resep Favorit */}
          {favoritesLoading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Memuat resep favorit...</p>
            </div>
          )}

          {favoritesError && (
            <div className="text-center py-12">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <p className="text-red-600 font-semibold mb-2">
                  Terjadi Kesalahan
                </p>
                <p className="text-red-500">{favoritesError}</p>
              </div>
            </div>
          )}

          {!favoritesLoading && !favoritesError && (
            <>
              {favorites.length === 0 ? (
                <div className="text-center py-16 flex flex-col items-center bg-white/60 backdrop-blur-lg border border-white/40 rounded-2xl shadow-xl">
                  <HiHeart size={48} className="text-red-300 mb-4" />
                  <p className="text-slate-500 text-lg">
                    Anda belum memiliki resep favorit.
                  </p>
                  <p className="text-slate-400 mt-2">
                    Klik ikon hati pada resep untuk menambahkannya.
                  </p>
                </div>
              ) : (
                <RecipeGrid recipes={favorites} onRecipeClick={onRecipeClick} />
              )}
            </>
          )}
        </div>{" "}
        {/* Akhir dari Kolom Kanan */}
      </div>{" "}
      {/* Akhir dari Wrapper Grid Utama */}
    </div>
  );
}
