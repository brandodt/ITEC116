import React from "react";
import { Star, Trash2 } from "react-feather";

const SidePane = ({ movie, onAddReview, reviews, onDeleteReview }) => {
  if (!movie) {
    return (
      <div className="bg-[#151515] rounded-xl p-6 border border-gray-800 text-gray-500">
        <p className="text-center">Select a movie to see details.</p>
      </div>
    );
  }

  const avg = movie.averageRating ?? 0;

  return (
    <div className="bg-[#151515] rounded-xl border border-gray-800 overflow-hidden">
      {movie.coverUrl && (
        <img
          src={movie.coverUrl}
          alt={movie.title || "Movie cover"}
          className="w-full h-56 object-cover"
        />
      )}
      
      <div className="p-5 space-y-4">
        <div>
          <h2 className="text-xl font-bold text-gray-100 mb-2">
            {movie.title}
          </h2>
          {movie.releaseYear && (
            <p className="text-sm text-gray-400">Released: {movie.releaseYear}</p>
          )}
          {movie.director && (
            <p className="text-sm text-gray-400">Director: {movie.director}</p>
          )}
        </div>

        <div className="flex items-center gap-2 py-2 px-3 bg-[#1a1a1a] rounded-lg">
          <Star className="text-yellow-500" size={20} fill="currentColor" />
          <span className="text-lg font-bold text-gray-100">{avg.toFixed(1)}</span>
          <span className="text-gray-500">/</span>
          <span className="text-gray-400">5</span>
          <span className="text-sm text-gray-500 ml-auto">
            ({movie.reviewCount ?? 0} reviews)
          </span>
        </div>

        {movie.description && (
          <p className="text-sm text-gray-400 leading-relaxed">
            {movie.description}
          </p>
        )}

        {Array.isArray(movie.genres) && movie.genres.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {movie.genres.map((g) => (
              <span
                key={g}
                className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs border border-blue-500/20"
              >
                {g}
              </span>
            ))}
          </div>
        )}

        <button
          onClick={onAddReview}
          className="w-full py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
        >
          Add Review
        </button>

        <div className="border-t border-gray-800 pt-4">
          <h3 className="text-sm font-semibold text-gray-300 mb-3">Recent Reviews</h3>
          <div className="space-y-3 max-h-64 overflow-auto">
            {(!reviews || reviews.length === 0) && (
              <p className="text-xs text-gray-600">No reviews yet.</p>
            )}
            {reviews?.map((r) => (
              <div
                key={r._id || r.id}
                className="p-3 bg-[#1a1a1a] rounded-lg group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-300">{r.reviewerName}</span>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 text-yellow-500 text-sm">
                      <Star size={12} fill="currentColor" />
                      {r.rating}
                    </span>
                    {onDeleteReview && (
                      <button
                        onClick={() => onDeleteReview(r)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-gray-500 hover:text-red-500 transition-all"
                        title="Delete review"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
                {r.comment && <p className="text-xs text-gray-500">{r.comment}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidePane;
