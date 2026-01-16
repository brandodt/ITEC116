import React, { useEffect, useRef, useState } from "react";

const currentYear = new Date().getFullYear();
// Generate years from current year down to 1888 (first movie ever made)
const yearOptions = Array.from({ length: currentYear - 1887 }, (_, i) => currentYear - i);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Title is required.");
      return;
    }

    const yearNum = releaseYear ? Number(releaseYear) : undefined;

    // Validate year is not in the future
    if (yearNum && yearNum > currentYear) {
      setError("Release year cannot be in the future.");
      return;
    }

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
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="p-3 rounded-lg bg-red-900/30 border border-red-600/50">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
        <input
          className="w-full bg-[#0a0a0a] text-gray-200 px-4 py-3 rounded-lg border border-gray-800 focus:outline-none focus:border-blue-500 transition-all"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter movie title"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Director (optional)</label>
        <input
          className="w-full bg-[#0a0a0a] text-gray-200 px-4 py-3 rounded-lg border border-gray-800 focus:outline-none focus:border-blue-500 transition-all"
          value={director}
          onChange={(e) => setDirector(e.target.value)}
          placeholder="Director name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Release Year (optional)</label>
        <select
          className="w-full bg-[#0a0a0a] text-gray-200 px-4 py-3 rounded-lg border border-gray-800 focus:outline-none focus:border-blue-500 transition-all appearance-none cursor-pointer"
          value={releaseYear}
          onChange={(e) => setReleaseYear(e.target.value)}
        >
          <option value="">Select year</option>
          {yearOptions.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Genres (optional)</label>
        <input
          className="w-full bg-[#0a0a0a] text-gray-200 px-4 py-3 rounded-lg border border-gray-800 focus:outline-none focus:border-blue-500 transition-all"
          value={genres}
          onChange={(e) => setGenres(e.target.value)}
          placeholder="Comma-separated, e.g. Action, Drama"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Description (optional)</label>
        <textarea
          className="w-full bg-[#0a0a0a] text-gray-200 px-4 py-3 rounded-lg border border-gray-800 focus:outline-none focus:border-blue-500 transition-all resize-none"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Short plot summary"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Movie Cover (optional)</label>
        <div className="flex items-center gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="flex-1 text-sm text-gray-400 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer file:transition-colors"
            onChange={onCoverChange}
          />
          <button
            type="button"
            className="px-4 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:opacity-50 transition-colors"
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
              className="w-full h-48 object-cover rounded-lg border border-gray-800"
            />
          </div>
        )}
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="button"
          className="flex-1 px-4 py-3 rounded-lg bg-gray-800 text-gray-200 hover:bg-gray-700 transition-colors font-medium"
          onClick={onCancel}
          disabled={submitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 px-4 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60 transition-colors font-medium"
          disabled={submitting}
        >
          {submitting ? "Saving..." : initialMovie ? "Save Changes" : "Add Movie"}
        </button>
      </div>
    </form>
  );
};

export default MovieForm;
