import React from "react";
import { X } from "react-feather";
import BookForm from "./forms/BookForm";
import AuthorForm from "./forms/AuthorForm";
import CategoryForm from "./forms/CategoryForm";
import { BASE_URL } from "../data/Api"; // added
import { toast } from "react-toastify"; // added

const FormDrawer = ({
  isOpen,
  onClose,
  mode, // 'book' | 'author' | 'category'
  authors = [],
  categories = [],
  onCreated, // callback after successful submission
  formMode = "create", // 'create' | 'edit'
  initialBook = null,
  initialAuthor = null,
  initialCategory = null,
}) => {
  if (!isOpen) return null;

  const isBook = mode === "book";
  const isAuthor = mode === "author";
  const isCategory = mode === "category";

  const isEdit =
    formMode === "edit" &&
    ((isBook && initialBook) ||
      (isAuthor && initialAuthor) ||
      (isCategory && initialCategory));

  const title = isBook
    ? isEdit
      ? `Edit: ${initialBook?.title || ""}`
      : "Add New Book"
    : isAuthor
    ? isEdit
      ? `Edit: ${initialAuthor?.name || ""}`
      : "Add New Author"
    : isCategory
    ? isEdit
      ? `Edit: ${initialCategory?.name || ""}`
      : "Add New Category"
    : "Add New";

  // Toast-based confirm dialog (returns Promise<boolean>)
  const confirmRemoveToast = (label) =>
    new Promise((resolve) => {
      toast(
        ({ closeToast }) => (
          <div className="text-sm">
            <div className="mb-3 text-gray-200">Remove “{label}”?</div>
            <div className="flex gap-2">
              <button
                className="px-3 py-1.5 rounded bg-red-600 text-white hover:bg-red-700"
                onClick={() => {
                  resolve(true);
                  closeToast();
                }}
              >
                Remove
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

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full sm:w-[480px] bg-[#1a1a1a] text-gray-100 border-l border-dark-border shadow-xl flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-dark-border">
          <h3 className="text-xl font-semibold">{title}</h3>
          <button
            aria-label="Close"
            className="p-2 rounded hover:bg-[#242424] text-gray-300"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 overflow-auto flex-1">
          {isBook && (
            <BookForm
              authors={authors}
              categories={categories}
              onCancel={onClose}
              onSubmitSuccess={onCreated}
              isEdit={isEdit}
              initialBook={initialBook}
            />
          )}

          {isAuthor && (
            <>
              <AuthorForm
                onCancel={onClose}
                onSubmitSuccess={onCreated}
                isEdit={isEdit}
                initialAuthor={initialAuthor}
              />
              {isEdit && initialAuthor && (
                <div className="mt-6 pt-4 border-t border-dark-border">
                  <button
                    type="button"
                    className="w-full px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                    onClick={async () => {
                      const label = initialAuthor?.name || "this author";
                      const ok = await confirmRemoveToast(label);
                      if (!ok) return;
                      try {
                        const id = initialAuthor._id || initialAuthor.id;
                        const res = await fetch(`${BASE_URL}/authors/${id}`, {
                          method: "DELETE",
                        });
                        if (!res.ok) throw new Error(`HTTP ${res.status}`);
                        onClose?.();
                        onCreated?.();
                      } catch {
                        toast.error("Failed to remove author.");
                      }
                    }}
                  >
                    Remove Author
                  </button>
                </div>
              )}
            </>
          )}

          {isCategory && (
            <>
              <CategoryForm
                onCancel={onClose}
                onSubmitSuccess={onCreated}
                isEdit={isEdit}
                initialCategory={initialCategory}
              />
              {isEdit && initialCategory && (
                <div className="mt-6 pt-4 border-t border-dark-border">
                  <button
                    type="button"
                    className="w-full px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                    onClick={async () => {
                      const label = initialCategory?.name || "this category";
                      const ok = await confirmRemoveToast(label);
                      if (!ok) return;
                      try {
                        const id = initialCategory._id || initialCategory.id;
                        const res = await fetch(
                          `${BASE_URL}/categories/${id}`,
                          { method: "DELETE" }
                        );
                        if (!res.ok) throw new Error(`HTTP ${res.status}`);
                        onClose?.();
                        onCreated?.();
                      } catch {
                        toast.error("Failed to remove category.");
                      }
                    }}
                  >
                    Remove Category
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormDrawer;
