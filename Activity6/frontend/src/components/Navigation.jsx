import React, { useState } from "react";
import { Film, Search } from "react-feather";

const Navigation = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <nav className="bg-gradient-to-r from-[#121212] via-[#151515] to-[#121212] border-b border-gray-800 py-4 px-6 sticky top-0 z-40 backdrop-blur-lg bg-opacity-95">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4 max-w-7xl">
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-blue-500/20">
            <Film className="text-white" size={24} />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
            Movie Reviews
          </h1>
        </div>

        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
          <input
            type="text"
            placeholder="Search movies, genres, directors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-[#0a0a0a] text-gray-200 w-full py-3 px-4 pl-10 pr-4 rounded-xl border border-gray-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 placeholder:text-gray-600"
          />
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
