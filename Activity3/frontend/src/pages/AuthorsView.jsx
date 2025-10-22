import React, { useEffect, useState } from "react";
import {
  getAllAuthors,
  getAllBooks, // added
  clearLastError,
  getLastError,
  BASE_URL,
} from "../data/Api";
import { Users, Book, Edit } from "react-feather";
import FormDrawer from "../components/FormDrawer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AuthorsView = () => {
  const [authors, setAuthors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(true ? false : false); // ...existing init...
  const [editingAuthor, setEditingAuthor] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // added

  useEffect(() => {
    let mounted = true;
    (async () => {
      setIsLoading(true);
      clearLastError();
      // fetch authors + books together
      const [authorsData, booksData] = await Promise.all([
        getAllAuthors(),
        getAllBooks(),
      ]);
      if (!mounted) return;

      // Build author -> count map
      const counts = new Map();
      for (const b of booksData) {
        const aId =
          b?.author?._id ||
          b?.author?.id ||
          b?.authorId ||
          (typeof b?.author === "string" ? b.author : null);
        if (!aId) continue;
        counts.set(aId, (counts.get(aId) || 0) + 1);
      }

      // Merge counts into authors
      const merged = (authorsData || []).map((a) => {
        const id = a?._id || a?.id;
        return { ...a, booksCount: counts.get(id) || 0 };
      });

      setAuthors(merged);
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
    return () => {
      navSearchInput.removeEventListener("input", handleNavSearch);
    };
  }, []);

  const handleAddAuthor = async () => {
    setEditingAuthor(null);
    setIsDrawerOpen(true);
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-dark-text flex items-center gap-3">
          <Users className="text-[#00a2ff]" size={32} />
          Authors
        </h1>
        <button
          className="bg-[#00a2ff] text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          onClick={handleAddAuthor}
        >
          Add New Author
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="text-gray-400">Loading...</div>
        ) : fetchError ? (
          <div className="text-red-400">
            Connection error. Please try again.
          </div>
        ) : authors.length === 0 ? (
          <div className="text-gray-400">No authors found.</div>
        ) : (
          [...authors]
            // search filter
            .filter((a) =>
              (a?.name || "").toLowerCase().includes(searchQuery.toLowerCase())
            )
            .sort((a, b) => (a?.name || "").localeCompare(b?.name || ""))
            .map((author) => (
              <div
                key={author.id || author._id}
                className="bg-dark-secondary p-6 rounded-lg border border-dark-border hover:border-[#00a2ff] transition-colors"
              >
                <div className="relative">
                  <Edit
                    className="absolute right-0 cursor-pointer text-[#00a2ff]"
                    onClick={() => {
                      setEditingAuthor(author);
                      setIsDrawerOpen(true);
                    }}
                  />
                </div>
                <h3 className="text-xl font-bold text-dark-text mb-2">
                  {author?.name || "Unnamed Author"}
                </h3>
                <div className="flex items-center text-gray-400">
                  <Book size={16} className="mr-2" />
                  <span>{author?.booksCount ?? 0} books</span>
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
          setEditingAuthor(null);
        }}
        mode="author"
        formMode={editingAuthor ? "edit" : "create"}
        initialAuthor={editingAuthor}
        onCreated={async () => {
          clearLastError();
          // refresh authors + recompute counts
          const [authorsData, booksData] = await Promise.all([
            getAllAuthors(),
            getAllBooks(),
          ]);
          const counts = new Map();
          for (const b of booksData) {
            const aId =
              b?.author?._id ||
              b?.author?.id ||
              b?.authorId ||
              (typeof b?.author === "string" ? b.author : null);
            if (!aId) continue;
            counts.set(aId, (counts.get(aId) || 0) + 1);
          }
          const merged = (authorsData || []).map((a) => {
            const id = a?._id || a?.id;
            return { ...a, booksCount: counts.get(id) || 0 };
          });
          setAuthors(merged);
          setFetchError(getLastError());
          setIsDrawerOpen(false);
          toast.success(editingAuthor ? "Author updated." : "Author created.");
          setEditingAuthor(null);
        }}
      />

      {/* Toasts */}
      <ToastContainer position="top-center" theme="dark" />
    </div>
  );
};

export default AuthorsView;
