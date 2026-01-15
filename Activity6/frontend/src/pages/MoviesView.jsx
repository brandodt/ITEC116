import React, { useEffect, useMemo, useState } from "react";
import { Film, PlusCircle } from "react-feather";
import SidePane from "../components/SidePane";
import FormDrawer from "../components/FormDrawer";
import MovieForm from "../components/forms/MovieForm";
import ReviewForm from "../components/forms/ReviewForm";
import { exampleMovies, exampleReviewsByMovieId } from "../assets/movieexample";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MoviesView = () => {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMovieDrawerOpen, setIsMovieDrawerOpen] = useState(false);
  const [isReviewDrawerOpen, setIsReviewDrawerOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);

  useEffect(() => {
    // For now, use static example data instead of backend API
    setIsLoading(true);
    setMovies(exampleMovies);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!selectedMovie) {
      setReviews([]);
      return;
    }
    const id = selectedMovie._id || selectedMovie.id;
    setReviews(exampleReviewsByMovieId[id] || []);
  }, [selectedMovie]);

  const sortedMovies = useMemo(() => {
    return [...movies].sort((a, b) =>
      (a?.title || "").localeCompare(b?.title || "")
    );
  }, [movies]);

  const handleCreateMovie = async (payload) => {
    const newMovie = {
      id: `local-${Date.now()}`,
      averageRating: 0,
      reviewCount: 0,
      ...payload,
    };
    setMovies((prev) => [newMovie, ...prev]);
    toast.success("Movie created (local only).");
    setIsMovieDrawerOpen(false);
  };

  const handleUpdateMovie = async (payload) => {
    const id = editingMovie._id || editingMovie.id;
    setMovies((prev) =>
      prev.map((m) => ((m._id || m.id) === id ? { ...m, ...payload } : m))
    );
    toast.success("Movie updated (local only).");
    setIsMovieDrawerOpen(false);
    setEditingMovie(null);
  };

  const handleDeleteMovie = async (movie) => {
    if (!movie) return;
    const id = movie._id || movie.id;
    if (!id) return;
    if (!window.confirm("Delete this movie?")) return;
    // Local-only delete
    toast.success("Movie deleted (local only).");
    const next = movies.filter((m) => (m._id || m.id) !== id);
    setMovies(next);
    if ((selectedMovie?._id || selectedMovie?.id) === id) {
      setSelectedMovie(null);
    }
  };

  const handleCreateReview = async (payload) => {
    if (!selectedMovie) throw new Error("No movie selected.");
    const id = selectedMovie._id || selectedMovie.id;
    const newReview = {
      id: `local-r-${Date.now()}`,
      ...payload,
    };
    const current = reviews.length
      ? reviews
      : exampleReviewsByMovieId[id] || [];
    const nextReviews = [newReview, ...current];
    setReviews(nextReviews);

    // Recalculate rating locally
    const reviewCount = nextReviews.length;
    const averageRating =
      reviewCount === 0
        ? 0
        : nextReviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount;

    setMovies((prev) =>
      prev.map((m) =>
        (m._id || m.id) === id ? { ...m, averageRating, reviewCount } : m
      )
    );
    setSelectedMovie((prev) =>
      !prev ? prev : { ...prev, averageRating, reviewCount }
    );

    toast.success("Review added (local only).");
    setIsReviewDrawerOpen(false);
  };

  const handleDeleteReview = async (review) => {
    const id = review._id || review.id;
    if (!id) return;
    if (!window.confirm("Delete this review?")) return;
    toast.success("Review deleted (local only).");
    if (!selectedMovie) return;
    const movieId = selectedMovie._id || selectedMovie.id;
    const nextReviews = reviews.filter((r) => (r._id || r.id) !== id);
    setReviews(nextReviews);

    const reviewCount = nextReviews.length;
    const averageRating =
      reviewCount === 0
        ? 0
        : nextReviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount;

    setMovies((prev) =>
      prev.map((m) =>
        (m._id || m.id) === movieId ? { ...m, averageRating, reviewCount } : m
      )
    );
    setSelectedMovie((prev) =>
      !prev ? prev : { ...prev, averageRating, reviewCount }
    );
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/3 lg:sticky lg:top-24 lg:self-start lg:max-h-[calc(100vh-7rem)] lg:overflow-auto">
          <SidePane
            movie={selectedMovie}
            reviews={reviews}
            onAddReview={() => setIsReviewDrawerOpen(true)}
          />
        </div>

        <div className="w-full md:w-2/3">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold flex items-center text-dark-text">
              <Film className="text-[#00a2ff] mr-2" size={24} />
              Movies ({sortedMovies.length})
            </h2>
            <button
              className="bg-[#00a2ff] text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
              onClick={() => {
                setEditingMovie(null);
                setIsMovieDrawerOpen(true);
              }}
            >
              <PlusCircle size={18} />
              Add Movie
            </button>
          </div>

          {isLoading ? (
            <div className="text-gray-400">Loading...</div>
          ) : sortedMovies.length === 0 ? (
            <div className="text-gray-400">No movies found.</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {sortedMovies.map((movie) => {
                const id = movie._id || movie.id;
                const isSelected =
                  (selectedMovie?._id || selectedMovie?.id) === id;
                const avg = movie.averageRating ?? 0;
                return (
                  <div
                    key={id}
                    className={`bg-dark-secondary p-4 rounded-lg transition-colors cursor-pointer shadow-md hover:shadow-xl ${
                      isSelected
                        ? "ring-2 ring-[#00a2ff]"
                        : "hover:ring-1 hover:ring-[#00a2ff]/60"
                    }`}
                    onClick={() => setSelectedMovie(movie)}
                  >
                    <div className="aspect-[3/4] bg-dark-input rounded-lg mb-3 overflow-hidden flex items-center justify-center text-gray-400 text-sm">
                      {movie.coverUrl ? (
                        <img
                          src={movie.coverUrl}
                          alt={movie.title || "Movie cover"}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-center px-2">
                          {movie.title || "Untitled"}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                      {movie.releaseYear && <span>{movie.releaseYear}</span>}
                      <span>{avg.toFixed(1)} / 5</span>
                    </div>
                    {Array.isArray(movie.genres) && movie.genres.length > 0 && (
                      <p className="text-xs text-gray-500 truncate">
                        {movie.genres.join(", ")}
                      </p>
                    )}
                    <button
                      className="mt-2 text-xs text-red-400 hover:text-red-300"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteMovie(movie);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <FormDrawer
        isOpen={isMovieDrawerOpen}
        title={editingMovie ? "Edit Movie" : "Add Movie"}
        onClose={() => {
          setIsMovieDrawerOpen(false);
          setEditingMovie(null);
        }}
      >
        <MovieForm
          initialMovie={editingMovie}
          onCancel={() => {
            setIsMovieDrawerOpen(false);
            setEditingMovie(null);
          }}
          onSubmit={editingMovie ? handleUpdateMovie : handleCreateMovie}
        />
      </FormDrawer>

      <FormDrawer
        isOpen={isReviewDrawerOpen}
        title="Add Review"
        onClose={() => setIsReviewDrawerOpen(false)}
      >
        <ReviewForm
          onCancel={() => setIsReviewDrawerOpen(false)}
          onSubmit={handleCreateReview}
        />
      </FormDrawer>

      <ToastContainer position="top-center" theme="dark" />
    </div>
  );
};

export default MoviesView;
