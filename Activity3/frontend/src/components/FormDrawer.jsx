import React from "react";
import { X } from "react-feather";
import BookForm from "./forms/BookForm";
import AuthorForm from "./forms/AuthorForm";
import CategoryForm from "./forms/CategoryForm";

const titles = {
  book: "Add New Book",
  author: "Add New Author",
  category: "Add New Category",
};

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
            <AuthorForm
              onCancel={onClose}
              onSubmitSuccess={onCreated}
              isEdit={isEdit}
              initialAuthor={initialAuthor}
            />
          )}
          {isCategory && (
            <CategoryForm
              onCancel={onClose}
              onSubmitSuccess={onCreated}
              isEdit={isEdit}
              initialCategory={initialCategory}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default FormDrawer;
