import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, Book, Users, Tag } from "react-feather";

const Navigation = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-dark-secondary py-4 px-6 shadow-lg">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <Link to="/">
          <div className="flex items-center">
            <Book className="text-[#00a2ff] mr-2" size={24} />
            <h1 className="text-2xl font-bold text-[#00a2ff]">BookShelf</h1>
          </div>
        </Link>

        <div className="flex space-x-6">
          <Link
            to="/"
            className={`${
              isActive("/")
                ? "text-[#00a2ff] border-b-2 border-[#00a2ff]"
                : "text-dark-text hover:text-[#00a2ff]"
            } font-medium flex items-center gap-2`}
          >
            <Book size={18} />
            Books
          </Link>
          <Link
            to="/authors"
            className={`${
              isActive("/authors")
                ? "text-[#00a2ff] border-b-2 border-[#00a2ff]"
                : "text-dark-text hover:text-[#00a2ff]"
            } font-medium flex items-center gap-2`}
          >
            <Users size={18} />
            Authors
          </Link>
          <Link
            to="/categories"
            className={`${
              isActive("/categories")
                ? "text-[#00a2ff] border-b-2 border-[#00a2ff]"
                : "text-dark-text hover:text-[#00a2ff]"
            } font-medium flex items-center gap-2`}
          >
            <Tag size={18} />
            Categories
          </Link>
        </div>

        <div className="relative w-full md:w-1/5">
          <input
            type="text"
            placeholder="Search books, authors, categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-[#1e1e1e] text-dark-text w-full py-2 px-4 rounded-lg border border-[#2a2a2a] focus:outline-none focus:ring-2 focus:ring-input-focus focus:border-transparent"
          />
          <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Search className="text-[#2563eb]" size={18} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
