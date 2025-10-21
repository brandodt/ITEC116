import React, { useState, useEffect, useMemo } from "react";
import { Book, Calendar, User } from "react-feather";
import SidePane from "../components/SidePane";

const BooksView = () => {
  const [selectedBook, setSelectedBook] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortCriteria, setSortCriteria] = useState("name");

  // Mock data for books
  const mockBooks = useMemo(
    () => [
      {
        id: 1,
        title: "The Silent Echo",
        authorName: "Elena Morrison",
        publicationYear: 2023,
        categories: ["Mystery", "Thriller"],
        summary:
          "A psychological thriller that follows detective Sarah Lane as she investigates a series of disappearances in a small coastal town. As she uncovers the truth, she realizes the cases are connected to her own past.",
      },
      {
        id: 2,
        title: "Whispers of Eternity",
        authorName: "Marcus Chen",
        publicationYear: 2022,
        categories: ["Fantasy", "Adventure"],
        summary:
          "In a world where time is a currency, young Elara discovers she can manipulate the flow of time. As she masters her abilities, she becomes entangled in a war between immortal beings.",
      },
      {
        id: 3,
        title: "Quantum Paradox",
        authorName: "Dr. Richard Hayes",
        publicationYear: 2024,
        categories: ["Science Fiction", "Mystery"],
        summary:
          "When physicist Dr. Emma Carter creates a machine that can glimpse alternate realities, she witnesses versions of herself making dangerous choices. Soon, the boundaries between realities begin to collapse.",
      },
      {
        id: 4,
        title: "The Last Horizon",
        authorName: "Marcus Chen",
        publicationYear: 2021,
        categories: ["Adventure", "Drama"],
        summary:
          "After a global catastrophe, survivors navigate a changed world. Among them is Leo, who embarks on a journey across the wasteland in search of a rumored safe haven.",
      },
      {
        id: 5,
        title: "Midnight Gardens",
        authorName: "Sophia Williams",
        publicationYear: 2020,
        categories: ["Romance", "Fantasy"],
        summary:
          "When Isabella inherits her grandmother's Victorian mansion, she discovers a garden that only appears at midnight. Inside, she meets a mysterious guardian bound to the grounds for centuries.",
      },
      {
        id: 6,
        title: "Code of Shadows",
        authorName: "Elena Morrison",
        publicationYear: 2023,
        categories: ["Thriller", "Techno-thriller"],
        summary:
          "Cybersecurity expert Maya Reyes uncovers a conspiracy involving a dangerous AI system designed to manipulate global events. As she digs deeper, she becomes the target of the very system she's trying to expose.",
      },
    ],
    []
  );

  // Filter and sort books based on search query and sort criteria
  const filteredAndSortedBooks = useMemo(() => {
    let filteredBooks = [...mockBooks];

    // Filter by search query if present
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredBooks = filteredBooks.filter(
        (book) =>
          book.title.toLowerCase().includes(query) ||
          book.authorName.toLowerCase().includes(query) ||
          book.categories.some((cat) => cat.toLowerCase().includes(query))
      );
    }

    // Sort based on criteria
    filteredBooks.sort((a, b) => {
      switch (sortCriteria) {
        case "name":
          return a.title.localeCompare(b.title);
        case "author":
          return a.authorName.localeCompare(b.authorName);
        case "year":
          return b.publicationYear - a.publicationYear;
        default:
          return 0;
      }
    });

    return filteredBooks;
  }, [mockBooks, searchQuery, sortCriteria]);

  // Update search query from navigation
  useEffect(() => {
    const navSearchInput = document.querySelector('nav input[type="text"]');
    if (navSearchInput) {
      const handleNavSearch = (e) => setSearchQuery(e.target.value);
      navSearchInput.addEventListener("input", handleNavSearch);

      return () => {
        navSearchInput.removeEventListener("input", handleNavSearch);
      };
    }
  }, []);

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Side pane */}
        <div className="w-full md:w-1/4">
          <SidePane book={selectedBook} />
        </div>

        {/* Main content area */}
        <div className="w-full md:w-3/4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h2 className="text-2xl font-semibold flex items-center text-dark-text">
              <Book className="text-[#00a2ff] mr-2" size={24} />
              Books ({filteredAndSortedBooks.length})
            </h2>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-dark-text whitespace-nowrap">
                  Sort by:
                </span>
                <select
                  value={sortCriteria}
                  onChange={(e) => setSortCriteria(e.target.value)}
                  className="bg-dark-secondary text-dark-text px-3 py-2 rounded border border-dark-border focus:outline-none focus:ring-2 focus:ring-[#00a2ff]"
                >
                  <option value="name">Name</option>
                  <option value="author">Author</option>
                  <option value="year">Year</option>
                </select>
              </div>

              <button className="bg-[#00a2ff] text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors whitespace-nowrap">
                Add New Book
              </button>
            </div>
          </div>

          {filteredAndSortedBooks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredAndSortedBooks.map((book) => (
                <div
                  key={book.id}
                  className={`bg-dark-secondary p-4 rounded-lg border cursor-pointer transition-colors ${
                    selectedBook && selectedBook.id === book.id
                      ? "border-[#00a2ff] ring-2 ring-[#00a2ff] ring-opacity-30"
                      : "border-dark-border hover:border-[#00a2ff]"
                  }`}
                  onClick={() => setSelectedBook(book)}
                >
                  {/* Book Cover Placeholder */}
                  <div className="aspect-[3/4] bg-dark-input rounded-lg mb-4 flex items-center justify-center">
                    <Book className="text-gray-400" size={48} />
                  </div>

                  <h3
                    className="text-lg font-bold text-dark-text mb-1 truncate"
                    title={book.title}
                  >
                    {book.title}
                  </h3>
                  <div className="flex items-center text-gray-400 mb-2">
                    <User size={14} className="mr-1 flex-shrink-0" />
                    <span className="text-sm truncate" title={book.authorName}>
                      {book.authorName}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-400 mb-3">
                    <Calendar size={14} className="mr-1 flex-shrink-0" />
                    <span className="text-sm">{book.publicationYear}</span>
                  </div>

                  {/* Categories */}
                  <div className="flex flex-wrap gap-1">
                    {book.categories.slice(0, 2).map((category, index) => (
                      <span
                        key={index}
                        className="bg-[#00a2ff] bg-opacity-20 text-[#00a2ff] px-2 py-1 rounded text-xs"
                        title={category}
                      >
                        {category}
                      </span>
                    ))}
                    {book.categories.length > 2 && (
                      <span className="text-gray-400 text-xs px-2 py-1">
                        +{book.categories.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-dark-secondary rounded-lg p-8 text-center">
              <Book
                size={48}
                className="text-gray-400 mx-auto mb-4 opacity-60"
              />
              <p className="text-gray-400 text-lg mb-2">
                No books found matching your search criteria
              </p>
              <p className="text-gray-500 text-sm">
                Try adjusting your search terms or clearing the search to see
                all books
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="mt-4 text-[#00a2ff] hover:text-blue-400 transition-colors"
                >
                  Clear search
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BooksView;
