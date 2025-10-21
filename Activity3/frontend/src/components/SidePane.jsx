import React from "react";
import { Book, Edit, Trash2, Tag, User, Calendar } from "react-feather";

const SidePane = ({ book, onEdit, onDelete }) => {
  if (!book) {
    return (
      <div className="bg-dark-secondary rounded-lg p-6 h-full flex items-center justify-center flex-col">
        <Book className="text-neutral-300 mb-4 opacity-50" size={48} />
        <p className="text-neutral-300">Select a book to view details</p>
      </div>
    );
  }

  const authorName = book?.author?.name || book?.authorName || "Unknown Author";

  const categoryNames = Array.isArray(book?.categories)
    ? book.categories
        .map((c) => (typeof c === "string" ? c : c?.name))
        .filter(Boolean)
    : [];

  return (
    <div className="bg-dark-secondary rounded-lg p-6 h-fit flex flex-col">
      <div className="mx-auto aspect-[2/3] w-48 bg-dark-input rounded mb-6 flex items-center justify-center">
        {book?.coverUrl ? (
          <img
            src={book.coverUrl}
            alt={book?.title || "Book cover"}
            className="w-full h-full object-cover rounded"
          />
        ) : (
          <Book className="text-neutral-300 opacity-60" size={48} />
        )}
      </div>

      <h2 className="text-xl font-semibold mb-2 text-dark-text">
        {book.title || "Untitled"}
      </h2>
      <div className="flex items-center text-neutral-300 mb-1">
        <User className="inline mr-2" size={14} />
        <p>by {authorName}</p>
      </div>
      <div className="flex items-center text-neutral-300 mb-4">
        <Calendar className="inline mr-2" size={14} />
        <p>{book.publicationYear ?? ""}</p>
      </div>

      <div className="mb-6">
        <div className="flex items-center mb-2">
          <Tag className="text-[#00a2ff] mr-2" size={16} />
          <span className="text-sm text-neutral-300">Categories</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {categoryNames.length === 0 ? (
            <span className="text-xs text-neutral-400">None</span>
          ) : (
            categoryNames.map((name, idx) => (
              <span
                key={`${name}-${idx}`}
                className="bg-dark-input px-2 py-1 rounded-full text-xs text-[#00a2ff]"
              >
                {name}
              </span>
            ))
          )}
        </div>
      </div>

      <div className="mb-8 flex-grow">
        <h3 className="text-lg font-medium mb-2 text-dark-text">Summary</h3>
        <p className="text-neutral-300 text-sm">{book.summary || "—"}</p>
      </div>

      <div className="flex gap-3 mt-auto">
        <button
          className="bg-dark-input hover:bg-sky-700 hover:text-white text-[#00a2ff] px-4 py-2 rounded flex-1 transition-colors flex items-center justify-center"
          onClick={onEdit}
        >
          <Edit size={16} className="mr-2" /> Edit
        </button>
        <button
          className="bg-dark-input hover:bg-red-900 hover:bg-opacity-20 text-red-500 px-4 py-2 rounded flex-1 transition-colors flex items-center justify-center"
          onClick={onDelete}
        >
          <Trash2 size={16} className="mr-2" /> Delete
        </button>
      </div>
    </div>
  );
};

export default SidePane;
