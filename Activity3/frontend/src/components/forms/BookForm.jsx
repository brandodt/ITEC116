import React, { useEffect, useMemo, useRef, useState } from "react";
import { BASE_URL } from "../../data/Api";

const BookForm = ({
  authors = [],
  categories = [],
  onCancel,
  onSubmitSuccess,
  // New props for edit mode:
  isEdit = false,
  initialBook = null,
}) => {
  // ...existing state...
  const [title, setTitle] = useState("");
  const [authorId, setAuthorId] = useState("");
  const [publicationYear, setPublicationYear] = useState("");
  const [categoryIds, setCategoryIds] = useState([]);
  const [summary, setSummary] = useState("");
  const [ISBN, setISBN] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [coverBlob, setCoverBlob] = useState(null); // new: compressed image blob
  const fileInputRef = useRef(null); // added

  // Prefill when editing
  useEffect(() => {
    if (!isEdit || !initialBook) return;
    const id = initialBook._id || initialBook.id;
    const covers = JSON.parse(localStorage.getItem("bookCovers") || "{}");
    setTitle(initialBook.title || "");
    setAuthorId(
      initialBook?.author?._id ||
        initialBook?.author?.id ||
        initialBook?.author ||
        ""
    );
    setPublicationYear(
      initialBook?.publicationYear != null
        ? String(initialBook.publicationYear)
        : ""
    );
    setCategoryIds(
      Array.isArray(initialBook?.categories)
        ? initialBook.categories
            .map((c) => (typeof c === "string" ? c : c?._id || c?.id))
            .filter(Boolean)
        : []
    );
    setSummary(initialBook?.summary || "");
    setISBN(initialBook?.ISBN || "");
    setCoverPreview(initialBook?.coverUrl || covers[id] || null);
    setCoverBlob(null); // reset; user may re-upload
  }, [isEdit, initialBook]);

  const sortedAuthors = useMemo(
    () =>
      [...authors].sort((a, b) => (a?.name || "").localeCompare(b?.name || "")),
    [authors]
  );
  const sortedCategories = useMemo(
    () =>
      [...categories].sort((a, b) =>
        (a?.name || "").localeCompare(b?.name || "")
      ),
    [categories]
  );

  // Ensure publication year input only keeps numeric characters
  const handlePublicationYearChange = (e) => {
    const value = e.target.value || "";
    const digitsOnly = value.replace(/\D/g, "");
    setPublicationYear(digitsOnly);
  };

  // Replace multi-select with checkbox toggles
  const toggleCategory = (id) => {
    setCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // Compress and preview the image; keep Blob for upload
  const onCoverChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      setCoverPreview(null);
      setCoverBlob(null);
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const maxWidth = 800;
      const scale = Math.min(1, maxWidth / img.width);
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, w, h);
      canvas.toBlob(
        (blob) => {
          if (blob) {
            setCoverBlob(blob);
            setCoverPreview(URL.createObjectURL(blob));
          } else {
            setCoverBlob(null);
            setCoverPreview(null);
          }
          URL.revokeObjectURL(objectUrl);
        },
        "image/jpeg",
        0.8
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      setCoverPreview(null);
      setCoverBlob(null);
    };
    img.src = objectUrl;
  };

  // New: clear/reset cover selection
  const clearCover = () => {
    try {
      if (coverPreview && coverPreview.startsWith("blob:")) {
        URL.revokeObjectURL(coverPreview);
      }
    } catch {}
    setCoverPreview(null);
    setCoverBlob(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    if (!authorId) {
      setError("Author is required.");
      return;
    }
    const yearNum = Number(publicationYear);
    if (!yearNum || Number.isNaN(yearNum)) {
      setError("Publication Year must be a number.");
      return;
    }

    const base = {
      title: title.trim(),
      author: authorId,
      authorId, // compatibility
      publicationYear: yearNum,
      categories: categoryIds,
      categoryIds, // compatibility
      summary: summary || undefined,
      ISBN: ISBN || undefined,
      // Do NOT include cover in JSON to avoid 413.
    };

    setSubmitting(true);
    try {
      let res;
      if (isEdit && initialBook) {
        const id = initialBook._id || initialBook.id;
        res = await fetch(`${BASE_URL}/books/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(base),
        });
      } else {
        res = await fetch(`${BASE_URL}/books`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(base),
        });
      }

      if (!res.ok) {
        let msg = `HTTP ${res.status}`;
        try {
          const errJson = await res.json();
          if (errJson?.message)
            msg = Array.isArray(errJson.message)
              ? errJson.message.join(", ")
              : errJson.message;
        } catch {}
        throw new Error(msg);
      }

      // Read entity (created/updated) to get id
      let entity = null;
      try {
        entity = await res.json();
      } catch {}
      const entityId =
        entity?._id || entity?.id || initialBook?._id || initialBook?.id;

      // Try upload cover via multipart; ignore failure and fallback to localStorage
      if (entityId && coverBlob) {
        try {
          const fd = new FormData();
          fd.append("file", coverBlob, "cover.jpg");
          const up = await fetch(`${BASE_URL}/books/${entityId}/cover`, {
            method: "POST",
            body: fd,
          });
          // If backend returns non-OK, just fallback
          if (!up.ok) throw new Error("upload failed");
        } catch {
          // Fallback: persist preview locally so UI shows cover
          const key = "bookCovers";
          const map = JSON.parse(localStorage.getItem(key) || "{}");
          // If preview is object URL from blob, convert to base64 for persistence
          // For simplicity, store nothing here; BooksView will keep showing current preview until refresh.
          // Persist a small base64 by reusing canvas if needed (optional).
        }
      }

      // Always store local fallback so refresh shows cover even if server didn't
      if (entityId && coverPreview) {
        // coverPreview is an object URL from blob; convert to base64 for persistence
        // Create a reader to convert Blob to data URL
        try {
          const dataUrl = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(coverBlob);
          });
          const key = "bookCovers";
          const map = JSON.parse(localStorage.getItem(key) || "{}");
          map[entityId] = dataUrl;
          localStorage.setItem(key, JSON.stringify(map));
        } catch {}
      }

      // No toast here to avoid duplicates; parent will toast and refresh
      onSubmitSuccess?.();
    } catch (err) {
      const msg = `Failed to ${isEdit ? "update" : "create"} book. ${
        err?.message || ""
      }`.trim();
      setError(msg);
      // No toast here to avoid duplicates; message shown inline
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {error && <div className="text-red-400 text-sm">{error}</div>}

      <div>
        <label className="block text-sm mb-1">Title</label>
        <input
          className="w-full bg-[#121212] border border-dark-border rounded px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#00a2ff]"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="The Great Book"
          required
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Author</label>
        <select
          className="w-full bg-[#121212] border border-dark-border rounded px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#00a2ff]"
          value={authorId}
          onChange={(e) => setAuthorId(e.target.value)}
          required
        >
          <option value="">Select an author</option>
          {sortedAuthors.map((a) => (
            <option key={a._id || a.id} value={a._id || a.id}>
              {a.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm mb-1">Publication Year</label>
        <input
          type="text"
          inputMode="numeric"
          className="w-full bg-[#121212] border border-dark-border rounded px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#00a2ff]"
          value={publicationYear}
          onChange={handlePublicationYearChange}
          placeholder="Enter Year"
          required
        />
      </div>

      <div>
        <label className="block text-sm mb-2">Categories (optional)</label>
        <div className="max-h-40 overflow-auto rounded border border-dark-border p-2 bg-[#121212]">
          {sortedCategories.length === 0 ? (
            <div className="text-sm text-gray-400">
              No categories available.
            </div>
          ) : (
            sortedCategories.map((c) => {
              const id = c._id || c.id;
              const checked = categoryIds.includes(id);
              return (
                <label
                  key={id}
                  className="flex items-center gap-2 py-1 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    className="accent-[#00a2ff]"
                    checked={checked}
                    onChange={() => toggleCategory(id)}
                  />
                  <span className="text-sm text-gray-200">{c.name}</span>
                </label>
              );
            })
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm mb-1">Summary (optional)</label>
        <textarea
          className="w-full bg-[#121212] border border-dark-border rounded px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#00a2ff]"
          rows={3}
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder="Short summary of the book"
        />
      </div>

      <div>
        <label className="block text-sm mb-1">ISBN (optional)</label>
        <input
          className="w-full bg-[#121212] border border-dark-border rounded px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#00a2ff]"
          value={ISBN}
          onChange={(e) => setISBN(e.target.value)}
          placeholder="978-0201616224"
        />
      </div>

      <div>
        <label className="block text-sm mb-2">Add Book Cover (optional)</label>
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="block w-full text-sm text-gray-300 file:mr-3 file:py-2 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-[#00a2ff] file:text-white hover:file:bg-blue-600"
            onChange={onCoverChange}
          />
          <button
            type="button"
            className="px-3 py-2 rounded bg-[#242424] text-gray-200 hover:bg-[#2c2c2c] disabled:opacity-50"
            onClick={clearCover}
            disabled={!coverPreview}
          >
            Clear
          </button>
        </div>
        {coverPreview && (
          <div className="mt-3">
            <img
              src={coverPreview}
              alt="Cover preview"
              className="w-full h-48 object-cover rounded border border-dark-border"
            />
          </div>
        )}
        <p className="text-xs text-gray-400 mt-1">
          Image will be uploaded via FormData; large JSON bodies are avoided.
        </p>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          className="px-4 py-2 rounded bg-[#242424] text-gray-200 hover:bg-[#2c2c2c]"
          onClick={onCancel}
          disabled={submitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 rounded bg-[#00a2ff] text-white hover:bg-blue-600 disabled:opacity-60"
          disabled={submitting}
        >
          {submitting ? "Saving..." : isEdit ? "Save Changes" : "Save"}
        </button>
      </div>
    </form>
  );
};

export default BookForm;
