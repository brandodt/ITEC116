import React from "react";
import { Users, Book } from "react-feather";

const AuthorsView = () => {
  const mockAuthors = [
    { id: 1, name: "Elena Morrison", booksCount: 5 },
    { id: 2, name: "Sophia Williams", booksCount: 3 },
    { id: 3, name: "Dr. Richard Hayes", booksCount: 8 },
    { id: 4, name: "Marcus Chen", booksCount: 2 },
  ];

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-dark-text flex items-center gap-3">
          <Users className="text-[#00a2ff]" size={32} />
          Authors
        </h1>
        <button className="bg-[#00a2ff] text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
          Add New Author
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockAuthors.map((author) => (
          <div
            key={author.id}
            className="bg-dark-secondary p-6 rounded-lg border border-dark-border hover:border-[#00a2ff] transition-colors"
          >
            <h3 className="text-xl font-bold text-dark-text mb-2">
              {author.name}
            </h3>
            <div className="flex items-center text-gray-400">
              <Book size={16} className="mr-2" />
              <span>{author.booksCount} books</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AuthorsView;
