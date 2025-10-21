import React, { useEffect, useState } from "react";
import { BASE_URL } from "../../data/Api";

const AuthorForm = ({
  onCancel,
  onSubmitSuccess,
  isEdit = false,
  initialAuthor = null,
}) => {
  const [name, setName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [biography, setBiography] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Prefill fields in edit mode
  useEffect(() => {
    if (!isEdit || !initialAuthor) return;
    setName(initialAuthor?.name || "");
    // Convert ISO to yyyy-MM-dd if present
    const dob = initialAuthor?.dateOfBirth
      ? new Date(initialAuthor.dateOfBirth)
      : null;
    if (dob && !isNaN(dob.getTime())) {
      const yyyy = dob.getFullYear();
      const mm = String(dob.getMonth() + 1).padStart(2, "0");
      const dd = String(dob.getDate()).padStart(2, "0");
      setDateOfBirth(`${yyyy}-${mm}-${dd}`);
    } else {
      setDateOfBirth("");
    }
    setBiography(initialAuthor?.biography || "");
  }, [isEdit, initialAuthor]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!name.trim()) {
      setError("Full name is required.");
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        name: name.trim(),
        dateOfBirth: dateOfBirth
          ? new Date(dateOfBirth).toISOString()
          : undefined,
        biography: biography || undefined,
      };
      let res;
      if (isEdit && initialAuthor) {
        const id = initialAuthor._id || initialAuthor.id;
        res = await fetch(`${BASE_URL}/authors/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`${BASE_URL}/authors`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      onSubmitSuccess?.();
    } catch (err) {
      setError(
        isEdit ? "Failed to update author." : "Failed to create author."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {error && <div className="text-red-400 text-sm">{error}</div>}

      <div>
        <label className="block text-sm mb-1">Full Name</label>
        <input
          className="w-full bg-[#121212] border border-dark-border rounded px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#00a2ff]"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Jane Doe"
          required
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Date of Birth (optional)</label>
        <input
          type="date"
          className="w-full bg-[#121212] border border-dark-border rounded px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#00a2ff]"
          value={dateOfBirth}
          onChange={(e) => setDateOfBirth(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Biography (optional)</label>
        <textarea
          className="w-full bg-[#121212] border border-dark-border rounded px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#00a2ff]"
          rows={3}
          value={biography}
          onChange={(e) => setBiography(e.target.value)}
          placeholder="Short biography..."
        />
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

export default AuthorForm;
