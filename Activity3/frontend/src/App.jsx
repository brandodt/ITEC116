import React from "react";
import { Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import BooksView from "./pages/BooksView";
import AuthorsView from "./pages/AuthorsView";
import CategoriesView from "./pages/CategoriesView";

function App() {
  return (
    <div className="min-h-screen bg-dark-primary text-dark-text flex flex-col">
      <Navigation />
      <main className="flex-grow p-4">
        <Routes>
          <Route path="/" element={<BooksView />} />
          <Route path="/authors" element={<AuthorsView />} />
          <Route path="/categories" element={<CategoriesView />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
