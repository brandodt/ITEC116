import React, { useEffect, useState } from "react";
import { BASE_URL } from "../../data/Api";

const CategoryForm = ({
  onCancel,
  onSubmitSuccess,
  isEdit = false,
  initialCategory = null,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Prefill in edit mode
  useEffect(() => {
    if (!isEdit || !initialCategory) return;
    setName(initialCategory?.name || "");
    setDescription(initialCategory?.description || "");
  }, [isEdit, initialCategory]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!name.trim()) {
      setError("Name is required.");
      return;
    }
    setSubmitting(true);
    try {
      const body = {
        name: name.trim(),
        description: description || undefined,
      };
      let res;
      if (isEdit && initialCategory) {
        const id = initialCategory._id || initialCategory.id;
        res = await fetch(`${BASE_URL}/categories/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      } else {
        res = await fetch(`${BASE_URL}/categories`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      onSubmitSuccess?.();
    } catch (err) {
      setError(
        isEdit ? "Failed to update category." : "Failed to create category."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {error && <div className="text-red-400 text-sm">{error}</div>}

      <div>
        <label className="block text-sm mb-1">Name</label>
        <input
          className="w-full bg-[#121212] border border-dark-border rounded px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#00a2ff]"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Science Fiction"
          required
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Description (optional)</label>
        <textarea
          className="w-full bg-[#121212] border border-dark-border rounded px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#00a2ff]"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe this category..."
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

export default CategoryForm;
