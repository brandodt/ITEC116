import React from "react";
import { Tag, Book } from "react-feather";

const CategoriesView = () => {
  const mockCategories = [
    { id: 1, name: "Thriller", booksCount: 12 },
    { id: 2, name: "Romance", booksCount: 8 },
    { id: 3, name: "Science Fiction", booksCount: 15 },
    { id: 4, name: "Adventure", booksCount: 6 },
    { id: 5, name: "Contemporary", booksCount: 10 },
    { id: 6, name: "Post-Apocalyptic", booksCount: 4 },
  ];

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-dark-text flex items-center gap-3">
          <Tag className="text-[#00a2ff]" size={32} />
          Categories
        </h1>
        <button className="bg-[#00a2ff] text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
          Add New Category
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockCategories.map((category) => (
          <div
            key={category.id}
            className="bg-dark-secondary p-6 rounded-lg border border-dark-border hover:border-[#00a2ff] transition-colors"
          >
            <h3 className="text-xl font-bold text-dark-text mb-2">
              {category.name}
            </h3>
            <div className="flex items-center text-gray-400">
              <Book size={16} className="mr-2" />
              <span>{category.booksCount} books</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoriesView;
