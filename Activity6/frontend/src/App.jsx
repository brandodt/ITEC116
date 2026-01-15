import React from "react";
import Navigation from "./components/Navigation";
import MoviesView from "./pages/MoviesView";
function App() {
  return (
    <div className="min-h-screen bg-dark-primary text-dark-text flex flex-col">
      <Navigation />
      <main className="flex-grow p-4">
        <MoviesView />
      </main>
    </div>
  );
}

export default App;
