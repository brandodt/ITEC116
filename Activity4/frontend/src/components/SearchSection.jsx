import { useState } from "react";
import { Search } from "lucide-react";

export function SearchSection({ onSearch, disabled }) {
  const [city, setCity] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim()) {
      onSearch(city.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        placeholder="Enter City Name"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        disabled={disabled}
        className="flex-1 bg-[#121212] border border-[#333333] text-[#F5F5F5] placeholder:text-[#666666] focus:border-[#00A2FF] focus:ring-[#00A2FF] rounded-md px-4 py-3 text-lg outline-none transition-colors duration-150"
        style={{ minHeight: 48 }}
      />
      <button
        type="submit"
        disabled={disabled || !city.trim()}
        className="bg-[#00A2FF] hover:bg-[#0088CC] text-white w-12 h-12 flex items-center justify-center rounded-md transition-colors duration-150 border-none outline-none"
        style={{ minWidth: 48, minHeight: 48 }}
      >
        <Search className="h-5 w-5" />
      </button>
    </form>
  );
}
