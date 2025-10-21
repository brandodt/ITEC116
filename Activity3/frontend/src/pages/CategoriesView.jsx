import React, { useEffect, useState } from "react";
import { Tag, Book } from "react-feather";
import {
  getAllCategories,
  getAllBooks, // added
  clearLastError,
  getLastError,
  BASE_URL,
} from "../data/Api";
import FormDrawer from "../components/FormDrawer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CategoriesView = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(true ? false : false); // ...existing init...
  const [editingCategory, setEditingCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // added

  useEffect(() => {
    let mounted = true;
    (async () => {
      setIsLoading(true);
      clearLastError();
      // fetch categories + books together
      const [catsData, booksData] = await Promise.all([
        getAllCategories(),
        getAllBooks(),
      ]);
      if (!mounted) return;

      // Build category -> count map
      const counts = new Map();
      for (const b of booksData) {
        const cats = Array.isArray(b?.categories) ? b.categories : [];
        for (const c of cats) {
          const cId = c?._id || c?.id || (typeof c === "string" ? c : null);
          if (!cId) continue;
          counts.set(cId, (counts.get(cId) || 0) + 1);
        }
      }

      // Merge counts into categories
      const merged = (catsData || []).map((c) => {
        const id = c?._id || c?.id;
        return { ...c, booksCount: counts.get(id) || 0 };
      });

      setCategories(merged);
      setFetchError(getLastError());
      setIsLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Listen to navbar search input
  useEffect(() => {
    const navSearchInput = document.querySelector('nav input[type="text"]');
    if (!navSearchInput) return;
    const handleNavSearch = (e) => setSearchQuery(e.target.value || "");
    navSearchInput.addEventListener("input", handleNavSearch);
    return () => navSearchInput.removeEventListener("input", handleNavSearch);
  }, []);

  const handleAddCategory = async () => {
    setIsDrawerOpen(true);
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-dark-text flex items-center gap-3">
          <Tag className="text-[#00a2ff]" size={32} />
          Categories
        </h1>
        <button
          className="bg-[#00a2ff] text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          onClick={() => {
            setEditingCategory(null);
            setIsDrawerOpen(true);
          }}
        >
          Add New Category
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="text-gray-400">Loading...</div>
        ) : fetchError ? (
          <div className="text-red-400">
            Connection error. Please try again.
          </div>
        ) : categories.length === 0 ? (
          <div className="text-gray-400">No categories found.</div>
        ) : (
          [...categories]
            // search filter
            .filter((c) =>
              (c?.name || "").toLowerCase().includes(searchQuery.toLowerCase())
            )
            .sort((a, b) => (a?.name || "").localeCompare(b?.name || ""))
            .map((category) => (
              <div
                key={category.id || category._id}
                className="bg-dark-secondary p-6 rounded-lg border border-dark-border hover:border-[#00a2ff] transition-colors"
                onClick={() => {
                  setEditingCategory(category);
                  setIsDrawerOpen(true);
                }}
              >
                <h3 className="text-xl font-bold text-dark-text mb-2">
                  {category?.name || "Unnamed Category"}
                </h3>
                <div className="flex items-center text-gray-400">
                  <Book size={16} className="mr-2" />
                  <span>
                    {category?.booksCount ?? category?.books?.length ?? 0} books
                  </span>
                </div>
              </div>
            ))
        )}
      </div>

      {/* Drawer */}
      <FormDrawer
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setEditingCategory(null);
        }}
        mode="category"
        formMode={editingCategory ? "edit" : "create"}
        initialCategory={editingCategory}
        onCreated={async () => {
          clearLastError();
          const [catsData, booksData] = await Promise.all([
            getAllCategories(),
            getAllBooks(),
          ]);
          const counts = new Map();
          for (const b of booksData) {
            const cats = Array.isArray(b?.categories) ? b.categories : [];
            for (const c of cats) {
              const cId = c?._id || c?.id || (typeof c === "string" ? c : null);
              if (!cId) continue;
              counts.set(cId, (counts.get(cId) || 0) + 1);
            }
          }
          const merged = (catsData || []).map((c) => {
            const id = c?._id || c?.id;
            return { ...c, booksCount: counts.get(id) || 0 };
          });
          setCategories(merged);
          setFetchError(getLastError());
          setIsDrawerOpen(false);
          toast.success(
            editingCategory ? "Category updated." : "Category created."
          );
          setEditingCategory(null);
        }}
      />

      {/* Toasts */}
      <ToastContainer position="top-center" theme="dark" />
    </div>
  );
};

export default CategoriesView;
