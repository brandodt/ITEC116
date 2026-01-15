import React, { useEffect, useRef, useState } from "react";

const MovieForm = ({ initialMovie = null, onCancel, onSubmit }) => {
  const [title, setTitle] = useState(initialMovie?.title || "");
  const [description, setDescription] = useState(
    initialMovie?.description || ""
  );
  const [director, setDirector] = useState(initialMovie?.director || "");
  const [releaseYear, setReleaseYear] = useState(
    initialMovie?.releaseYear ? String(initialMovie.releaseYear) : ""
  );
  const [genres, setGenres] = useState(
    Array.isArray(initialMovie?.genres) ? initialMovie.genres.join(", ") : ""
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [coverPreview, setCoverPreview] = useState(
    initialMovie?.coverUrl || null
  );
  const fileInputRef = useRef(null);

  useEffect(() => {
    setCoverPreview(initialMovie?.coverUrl || null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [initialMovie]);

  const handleYearChange = (e) => {
    const value = e.target.value || "";
    const digitsOnly = value.replace(/\D/g, "");
    setReleaseYear(digitsOnly);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Title is required.");
      return;
    }

    const yearNum = releaseYear ? Number(releaseYear) : undefined;

    const payload = {
      title: title.trim(),
      description: description || undefined,
      director: director || undefined,
      releaseYear: yearNum,
      genres: genres
        ? genres
            .split(",")
            .map((g) => g.trim())
            .filter(Boolean)
        : [],
      coverUrl: coverPreview || undefined,
    };

    try {
      setSubmitting(true);
      await onSubmit?.(payload);
    } catch (err) {
      setError(err?.message || "Failed to save movie.");
    } finally {
      setSubmitting(false);
    }
  };

  const onCoverChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      setCoverPreview(initialMovie?.coverUrl || null);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setCoverPreview(typeof reader.result === "string" ? reader.result : null);
    };
    reader.onerror = () => {
      setCoverPreview(null);
    };
    reader.readAsDataURL(file);
  };

  const clearCover = () => {
    setCoverPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-red-400 text-sm">{error}</div>}

      <div>
        <label className="block text-sm mb-1">Title</label>
        <input
          className="w-full bg-[#121212] border border-dark-border rounded px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#00a2ff]"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Movie title"
          required
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Director (optional)</label>
        <input
          className="w-full bg-[#121212] border border-dark-border rounded px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#00a2ff]"
          value={director}
          onChange={(e) => setDirector(e.target.value)}
          placeholder="Director name"
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Release Year (optional)</label>
        <input
          type="text"
          inputMode="numeric"
          className="w-full bg-[#121212] border border-dark-border rounded px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#00a2ff]"
          value={releaseYear}
          onChange={handleYearChange}
          placeholder="e.g. 2024"
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Genres (optional)</label>
        <input
          className="w-full bg-[#121212] border border-dark-border rounded px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#00a2ff]"
          value={genres}
          onChange={(e) => setGenres(e.target.value)}
          placeholder="Comma-separated, e.g. Action, Drama"
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Description (optional)</label>
        <textarea
          className="w-full bg-[#121212] border border-dark-border rounded px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#00a2ff]"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Short plot summary"
        />
      </div>

      <div>
        <label className="block text-sm mb-2">Movie Cover (optional)</label>
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
              alt="Movie cover preview"
              className="w-full h-48 object-cover rounded border border-dark-border"
            />
          </div>
        )}
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
          {submitting ? "Saving..." : initialMovie ? "Save Changes" : "Save"}
        </button>
      </div>
    </form>
  );
};

export default MovieForm;
