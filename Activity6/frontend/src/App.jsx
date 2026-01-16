import React from "react";
import Navigation from "./components/Navigation";
import MoviesView from "./pages/MoviesView";

function App() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-200 flex flex-col">
      <Navigation />
      <main className="flex-grow">
        <MoviesView />
      </main>
    </div>
  );
}

export default App;
