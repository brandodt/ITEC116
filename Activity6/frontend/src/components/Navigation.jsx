import React, { useState } from "react";
import { Film, Search } from "react-feather";

const Navigation = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <nav className="bg-[#121212] border-b border-gray-800 py-4 px-6 sticky top-0 z-40">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4 max-w-7xl">
        <div className="flex items-center gap-2 cursor-pointer">
          <Film className="text-blue-500" size={28} />
          <h1 className="text-2xl font-bold text-blue-500">Movie Reviews</h1>
        </div>

        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search movies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-[#0a0a0a] text-gray-200 w-full py-2.5 px-4 pl-10 rounded-lg border border-gray-800 focus:outline-none focus:border-blue-500 transition-colors"
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
