import React, { useEffect, useMemo, useState } from "react";
import { Book, Calendar, User } from "react-feather";
import SidePane from "../components/SidePane";
import {
  getAllBooks,
  getAllAuthors,
  getAllCategories,
  clearLastError,
  getLastError,
  BASE_URL,
} from "../data/Api";
import FormDrawer from "../components/FormDrawer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BooksView = () => {
  const [selectedBook, setSelectedBook] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortCriteria, setSortCriteria] = useState("name-asc");
  const [books, setBooks] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);

  // Helper: attach local cover fallbacks (if backend didn't persist coverUrl)
  const attachCovers = (list) => {
    const map = JSON.parse(localStorage.getItem("bookCovers") || "{}");
    return list.map((bk) => {
      const id = bk?._id || bk?.id;
      const cover = bk?.coverUrl || map[id];
      return cover ? { ...bk, coverUrl: cover } : bk;
    });
  };

  // Fetch data
  useEffect(() => {
    let mounted = true;
    (async () => {
      setIsLoading(true);
      clearLastError();
      const [b, a, c] = await Promise.all([
        getAllBooks(),
        getAllAuthors(),
        getAllCategories(),
      ]);
      if (!mounted) return;
      const withCovers = attachCovers(b);
      setBooks(withCovers);
      setAuthors(a);
      setCategories(c);
      setFetchError(getLastError());
      // Keep selected reference in sync with updated objects
      if (selectedBook) {
        const selId = selectedBook._id || selectedBook.id;
        const nextSel =
          withCovers.find((x) => (x._id || x.id) === selId) || null;
        setSelectedBook(nextSel);
      }
      setIsLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Filter and sort books based on search query and sort criteria
  const filteredAndSortedBooks = useMemo(() => {
    // Exclude deleted books if backend returns them
    let filteredBooks = [...books].filter(
      (b) => !b?.deleted && !b?.isDeleted && b?.status !== "deleted"
    );

    // Filter by search query if present (title, author.name, categories[].name)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredBooks = filteredBooks.filter((book) => {
        const title = (book?.title || "").toLowerCase();
        const author = (book?.author?.name || "").toLowerCase();
        const catHit = Array.isArray(book?.categories)
          ? book.categories.some((cat) =>
              (cat?.name || "").toLowerCase().includes(query)
            )
          : false;
        return title.includes(query) || author.includes(query) || catHit;
      });
    }

    // Sort based on criteria (name, author.name, publicationYear)
    filteredBooks.sort((a, b) => {
      switch (sortCriteria) {
        case "name-asc":
          return (a?.title || "").localeCompare(b?.title || "");
        case "name-desc":
          return (b?.title || "").localeCompare(a?.title || "");
        case "author-asc":
          return (a?.author?.name || "").localeCompare(b?.author?.name || "");
        case "author-desc":
          return (b?.author?.name || "").localeCompare(a?.author?.name || "");
        case "year-desc": // Latest first
          return (b?.publicationYear || 0) - (a?.publicationYear || 0);
        case "year-asc": // Oldest first
          return (a?.publicationYear || 0) - (b?.publicationYear || 0);
        default:
          return 0;
      }
    });

    return filteredBooks;
  }, [books, searchQuery, sortCriteria]);

  // Update search query from navigation
  useEffect(() => {
    const navSearchInput = document.querySelector('nav input[type="text"]');
    if (navSearchInput) {
      const handleNavSearch = (e) => setSearchQuery(e.target.value);
      navSearchInput.addEventListener("input", handleNavSearch);

      return () => {
        navSearchInput.removeEventListener("input", handleNavSearch);
      };
    }
  }, []);

  const handleAddBook = async () => {
    const title = window.prompt("Enter book title:");
    if (!title) return;

    // Try to map optional author and categories from existing lists
    const authorName = window.prompt(
      "Enter author name (optional, must match existing):"
    );
    let authorId = null;
    if (authorName) {
      const match = authors.find(
        (a) => (a?.name || "").toLowerCase() === authorName.trim().toLowerCase()
      );
      authorId = match?._id || match?.id || null;
    }

    const catsInput = window.prompt(
      "Enter categories (optional, comma-separated, must match existing):"
    );
    let categoryIds = [];
    if (catsInput) {
      const wanted = catsInput
        .split(",")
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean);
      categoryIds = categories
        .filter((c) => wanted.includes((c?.name || "").toLowerCase()))
        .map((c) => c._id || c.id);
    }

    const payload = { title };
    if (authorId) payload.author = authorId;
    if (categoryIds.length) payload.categories = categoryIds;

    try {
      const res = await fetch(`${BASE_URL}/books`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
    } catch (e) {
      window.alert("Failed to add book. Please try again.");
      return;
    }

    // Refresh data
    clearLastError();
    const [b, a, c] = await Promise.all([
      getAllBooks(),
      getAllAuthors(),
      getAllCategories(),
    ]);
    const withCovers = attachCovers(b);
    setBooks(withCovers);
    setAuthors(a);
    setCategories(c);
    setFetchError(getLastError());
  };

  // Toast-based confirm dialog (returns Promise<boolean>)
  const confirmDeleteToast = (bookTitle) =>
    new Promise((resolve) => {
      toast(
        ({ closeToast }) => (
          <div className="text-lg">
            <div className="mb-3 text-gray-200">Delete “{bookTitle}”?</div>
            <div className="flex gap-2">
              <button
                className="px-3 py-1.5 rounded bg-red-600 text-white hover:bg-red-700"
                onClick={() => {
                  resolve(true);
                  closeToast();
                }}
              >
                Delete
              </button>
              <button
                className="px-3 py-1.5 rounded bg-[#242424] text-gray-200 hover:bg-[#2c2c2c]"
                onClick={() => {
                  resolve(false);
                  closeToast();
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        ),
        {
          autoClose: false,
          closeOnClick: false,
          draggable: false,
          theme: "dark",
        }
      );
    });

  // Delete (soft delete) instead of hard delete
  const handleDeleteBook = async (book) => {
    if (!book) return;
    const id = book._id || book.id;
    if (!id) return;

    const confirmed = await confirmDeleteToast(book.title || "this book");
    if (!confirmed) return;

    try {
      // 1) Preferred Delete endpoint
      let res = await fetch(`${BASE_URL}/books/${id}/Delete`, {
        method: "POST",
      });
      // 2) Fallbacks
      if (!res.ok) {
        res = await fetch(`${BASE_URL}/books/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ deleted: true }),
        });
      }
      if (!res.ok) {
        res = await fetch(`${BASE_URL}/books/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isDeleted: true }),
        });
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      setBooks((prev) =>
        prev.map((b) => ((b._id || b.id) === id ? { ...b, deleted: true } : b))
      );
      if ((selectedBook?._id || selectedBook?.id) === id) setSelectedBook(null);

      toast.success("Book deleted.");
    } catch {
      toast.error("Failed to Delete book.");
    }
  };

  // Open edit drawer instead of prompts
  const handleEditBook = (book) => {
    setEditingBook(book);
    setIsDrawerOpen(true);
  };

  // Update selected book when books change
  useEffect(() => {
    if (!selectedBook) return;
    const id = selectedBook._id || selectedBook.id;
    const updated = books.find((b) => (b._id || b.id) === id) || null;
    setSelectedBook(updated);
  }, [books]);

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Side pane */}
        <div className="w-full md:w-1/4 lg:sticky lg:top-24 lg:self-start lg:max-h-[calc(100vh-7rem)] lg:overflow-auto">
          <SidePane
            book={selectedBook}
            onEdit={() => handleEditBook(selectedBook)}
            onDelete={() => handleDeleteBook(selectedBook)}
          />
        </div>

        {/* Main content area */}
        <div className="w-full md:w-3/4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h2 className="text-2xl font-semibold flex items-center text-dark-text">
              <Book className="text-[#00a2ff] mr-2" size={24} />
              Books ({filteredAndSortedBooks.length})
            </h2>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-dark-text whitespace-nowrap">
                  Sort by:
                </span>
                <select
                  value={sortCriteria}
                  onChange={(e) => setSortCriteria(e.target.value)}
                  className="bg-dark-secondary text-dark-text px-3 py-2 rounded border border-dark-border focus:outline-none focus:ring-2 focus:ring-[#00a2ff]"
                >
                  <option value="name-asc">Name (A–Z)</option>
                  <option value="name-desc">Name (Z–A)</option>
                  <option value="author-asc">Author (A–Z)</option>
                  <option value="author-desc">Author (Z–A)</option>
                  <option value="year-desc">Year (Latest)</option>
                  <option value="year-asc">Year (Oldest)</option>
                </select>
              </div>

              <button
                className="bg-[#00a2ff] text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors whitespace-nowrap"
                onClick={() => {
                  setEditingBook(null); // create mode
                  setIsDrawerOpen(true);
                }}
              >
                Add New Book
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="text-gray-400">Loading...</div>
          ) : fetchError ? (
            <div className="text-red-400">
              Connection error. Please try again.
            </div>
          ) : books.length === 0 ? (
            <div className="text-gray-400">No books found.</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
              {filteredAndSortedBooks.map((book) => {
                const id = book.id || book._id;
                const isSelected =
                  (selectedBook?._id || selectedBook?.id) === id;
                const authorName = book?.author?.name || "Unknown Author";
                const categoryNames = Array.isArray(book?.categories)
                  ? book.categories
                      .map((c) => c?.name)
                      .filter(Boolean)
                      .join(", ")
                  : "Uncategorized";
                return (
                  <div
                    key={id}
                    className={`bg-dark-secondary p-6 rounded-lg border transition-colors ${
                      isSelected
                        ? "border-[#00a2ff]"
                        : "border-dark-border hover:border-[#00a2ff]"
                    }`}
                    onClick={() => setSelectedBook(book)}
                  >
                    {/* Book Cover Placeholder */}
                    <div className="aspect-[3/4] bg-dark-input rounded-lg mb-4 flex items-center justify-center">
                      {book?.coverUrl ? (
                        <img
                          src={book.coverUrl}
                          alt={book?.title || "Book cover"}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <Book className="text-gray-400" size={48} />
                      )}
                    </div>

                    <h3 className="text-xl font-bold text-dark-text mb-2">
                      {book?.title || "Untitled"}
                    </h3>
                    <p className="text-gray-400">
                      <span>{authorName}</span>
                      {" • "}
                      <span>{categoryNames || "Uncategorized"}</span>
                    </p>
                  </div>
                );
              })}
            </div>
          )}

          {/* Drawer */}
          <FormDrawer
            isOpen={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
            mode="book"
            // Pass edit mode + initial book to prefill the form
            formMode={editingBook ? "edit" : "create"}
            initialBook={editingBook}
            authors={authors}
            categories={categories}
            onCreated={async () => {
              clearLastError();
              const [b, a, c] = await Promise.all([
                getAllBooks(),
                getAllAuthors(),
                getAllCategories(),
              ]);
              const withCovers = attachCovers(b);
              setBooks(withCovers);
              setAuthors(a);
              setCategories(c);
              setFetchError(getLastError());
              setIsDrawerOpen(false);
              toast.success(editingBook ? "Book updated." : "Book created.");
              setEditingBook(null);
            }}
          />

          {/* Toasts */}
          <ToastContainer position="top-center" theme="dark" />
        </div>
      </div>
    </div>
  );
};

export default BooksView;
