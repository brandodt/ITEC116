import React, { useEffect, useMemo, useState } from "react";
import { Film, PlusCircle, Edit2, Trash2, Star } from "react-feather";
import SidePane from "../components/SidePane";
import FormDrawer from "../components/FormDrawer";
import MovieForm from "../components/forms/MovieForm";
import ReviewForm from "../components/forms/ReviewForm";
import {
  getAllMovies,
  getReviews,
  createMovie,
  updateMovie,
  deleteMovie,
  createReview,
  deleteReview,
  clearLastError,
  getLastError,
} from "../data/Api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MoviesView = () => {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [isMovieDrawerOpen, setIsMovieDrawerOpen] = useState(false);
  const [isReviewDrawerOpen, setIsReviewDrawerOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setIsLoading(true);
      clearLastError();
      const data = await getAllMovies();
      if (!mounted) return;
      setMovies(data);
      setFetchError(getLastError());
      setIsLoading(false);
    })();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedMovie) {
      setReviews([]);
      return;
    }
    const id = selectedMovie._id || selectedMovie.id;
    let mounted = true;
    (async () => {
      clearLastError();
      const data = await getReviews(id);
      if (!mounted) return;
      setReviews(data);
      setFetchError(getLastError());
    })();

    return () => {
      mounted = false;
    };
  }, [selectedMovie]);

  const sortedMovies = useMemo(() => {
    return [...movies].sort((a, b) =>
      (a?.title || "").localeCompare(b?.title || "")
    );
  }, [movies]);

  const handleCreateMovie = async (payload) => {
    try {
      const created = await createMovie(payload);
      setMovies((prev) => [created, ...prev]);
      toast.success("Movie created successfully!");
      setIsMovieDrawerOpen(false);
    } catch (err) {
      toast.error("Failed to create movie.");
      throw err;
    }
  };

  const handleUpdateMovie = async (payload) => {
    if (!editingMovie) return;
    const id = editingMovie._id || editingMovie.id;
    try {
      const updated = await updateMovie(id, payload);
      const updatedId = updated?._id || updated?.id || id;
      setMovies((prev) =>
        prev.map((m) => ((m._id || m.id) === updatedId ? updated : m)),
      );
      setSelectedMovie((prev) =>
        prev && (prev._id || prev.id) === updatedId ? updated : prev
      );
      toast.success("Movie updated successfully!");
      setIsMovieDrawerOpen(false);
      setEditingMovie(null);
    } catch (err) {
      toast.error("Failed to update movie.");
      throw err;
    }
  };

  const handleDeleteMovie = async (movie) => {
    if (!movie) return;
    const id = movie._id || movie.id;
    if (!id) return;
    if (!window.confirm(`Delete "${movie.title}"? This action cannot be undone.`)) return;
    try {
      await deleteMovie(id);
      const next = movies.filter((m) => (m._id || m.id) !== id);
      setMovies(next);
      if ((selectedMovie?._id || selectedMovie?.id) === id) {
        setSelectedMovie(null);
        setReviews([]);
      }
      toast.success("Movie deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete movie.");
    }
  };

  const handleEditMovie = (movie) => {
    setEditingMovie(movie);
    setIsMovieDrawerOpen(true);
  };

  const handleCreateReview = async (payload) => {
    if (!selectedMovie) throw new Error("No movie selected.");
    const id = selectedMovie._id || selectedMovie.id;
    try {
      await createReview(id, payload);
      const nextReviews = await getReviews(id);
      setReviews(nextReviews);

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

      toast.success("Review added successfully!");
      setIsReviewDrawerOpen(false);
    } catch (err) {
      toast.error("Failed to add review.");
      throw err;
    }
  };

  const handleDeleteReview = async (review) => {
    const id = review._id || review.id;
    if (!id) return;
    if (!window.confirm("Delete this review?")) return;
    if (!selectedMovie) return;
    const movieId = selectedMovie._id || selectedMovie.id;
    try {
      await deleteReview(id);
      const nextReviews = await getReviews(movieId);
      setReviews(nextReviews);

      const reviewCount = nextReviews.length;
      const averageRating =
        reviewCount === 0
          ? 0
          : nextReviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount;

      setMovies((prev) =>
        prev.map((m) =>
          (m._id || m.id) === movieId
            ? { ...m, averageRating, reviewCount }
            : m
        )
      );
      setSelectedMovie((prev) =>
        !prev ? prev : { ...prev, averageRating, reviewCount }
      );

      toast.success("Review deleted.");
    } catch (err) {
      toast.error("Failed to delete review.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Side Panel */}
          <div className="w-full lg:w-80 xl:w-96 lg:sticky lg:top-20 lg:self-start lg:max-h-[calc(100vh-6rem)] lg:overflow-auto">
            <SidePane
              movie={selectedMovie}
              reviews={reviews}
              onAddReview={() => setIsReviewDrawerOpen(true)}
              onDeleteReview={handleDeleteReview}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-200">
                Movies
                <span className="text-gray-500 text-xl ml-2">({sortedMovies.length})</span>
              </h2>
              <button
                className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium"
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
              <div className="flex items-center justify-center py-20">
                <div className="w-10 h-10 rounded-full border-t-2 border-b-2 border-blue-500 animate-spin"></div>
              </div>
            ) : fetchError ? (
              <div className="text-center py-20">
                <p className="text-red-400 mb-2">Connection error</p>
                <p className="text-gray-500 text-sm">Please make sure the backend is running.</p>
              </div>
            ) : sortedMovies.length === 0 ? (
              <div className="text-center py-20">
                <Film className="mx-auto text-gray-700 mb-4" size={48} />
                <p className="text-gray-500">No movies yet. Add the first one!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {sortedMovies.map((movie) => {
                  const id = movie._id || movie.id;
                  const isSelected =
                    (selectedMovie?._id || selectedMovie?.id) === id;
                  const avg = movie.averageRating ?? 0;
                  return (
                    <div
                      key={id}
                      className={`bg-[#151515] rounded-xl overflow-hidden cursor-pointer transition-all group border ${
                        isSelected
                          ? "border-blue-500 ring-1 ring-blue-500/30"
                          : "border-gray-800 hover:border-blue-500/50"
                      }`}
                      onClick={() => setSelectedMovie(movie)}
                    >
                      {/* Movie Cover */}
                      <div className="aspect-[3/4] bg-[#1a1a1a] overflow-hidden relative">
                        {movie.coverUrl ? (
                          <img
                            src={movie.coverUrl}
                            alt={movie.title || "Movie cover"}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Film className="text-gray-700" size={40} />
                          </div>
                        )}
                        {/* Hover Actions */}
                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditMovie(movie);
                            }}
                            className="p-2 bg-blue-600/90 hover:bg-blue-700 rounded-lg transition-colors"
                            title="Edit movie"
                          >
                            <Edit2 size={14} className="text-white" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteMovie(movie);
                            }}
                            className="p-2 bg-red-600/90 hover:bg-red-700 rounded-lg transition-colors"
                            title="Delete movie"
                          >
                            <Trash2 size={14} className="text-white" />
                          </button>
                        </div>
                      </div>
                      {/* Movie Info */}
                      <div className="p-5">
                        <h3 className="font-semibold text-gray-200 mb-2 line-clamp-2 text-lg">
                          {movie.title || "Untitled"}
                        </h3>
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-gray-500">
                            {movie.releaseYear || "—"}
                          </span>
                          <div className="flex items-center gap-1">
                            <Star size={16} className="text-yellow-500" fill="currentColor" />
                            <span className="text-gray-400 font-medium">{avg.toFixed(1)}</span>
                          </div>
                        </div>
                        {Array.isArray(movie.genres) && movie.genres.length > 0 && (
                          <p className="text-sm text-gray-500 truncate">
                            {movie.genres.join(", ")}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
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

      <ToastContainer position="top-right" theme="dark" autoClose={3000} />
    </div>
  );
};

export default MoviesView;
