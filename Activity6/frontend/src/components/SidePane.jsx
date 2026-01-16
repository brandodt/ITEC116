import React from "react";
import { Star, Trash2, Film } from "react-feather";

const SidePane = ({ movie, onAddReview, reviews, onDeleteReview }) => {
  if (!movie) {
    return (
      <div className="bg-gradient-to-br from-[#151515] to-[#0f0f0f] rounded-xl p-8 border border-gray-800 text-gray-500 text-center">
        <Film className="mx-auto mb-3 text-gray-700" size={40} />
        <p className="text-gray-400">Select a movie to see details</p>
      </div>
    );
  }

  const avg = movie.averageRating ?? 0;

  return (
    <div className="bg-gradient-to-br from-[#151515] to-[#0f0f0f] rounded-xl border border-gray-800 overflow-hidden shadow-xl">
      {movie.coverUrl && (
        <div className="relative overflow-hidden">
          <img
            src={movie.coverUrl}
            alt={movie.title || "Movie cover"}
            className="w-full h-64 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-transparent to-transparent" />
        </div>
      )}
      
      <div className="p-6 space-y-5">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent mb-3">
            {movie.title}
          </h2>
          <div className="space-y-1">
            {movie.releaseYear && (
              <p className="text-sm text-gray-400 flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-blue-500"></span>
                Released: <span className="font-medium text-gray-300">{movie.releaseYear}</span>
              </p>
            )}
            {movie.director && (
              <p className="text-sm text-gray-400 flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-blue-500"></span>
                Director: <span className="font-medium text-gray-300">{movie.director}</span>
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 py-3 px-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-xl border border-yellow-500/20">
          <Star className="text-yellow-500" size={24} fill="currentColor" />
          <span className="text-2xl font-bold text-gray-100">{avg.toFixed(1)}</span>
          <span className="text-gray-500 text-lg">/</span>
          <span className="text-gray-400 text-lg">5</span>
          <span className="text-sm text-gray-500 ml-auto">
            {movie.reviewCount ?? 0} reviews
          </span>
        </div>

        {movie.description && (
          <p className="text-sm text-gray-400 leading-relaxed bg-[#0a0a0a] p-4 rounded-lg border border-gray-800">
            {movie.description}
          </p>
        )}

        {Array.isArray(movie.genres) && movie.genres.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {movie.genres.map((g) => (
              <span
                key={g}
                className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-500/10 to-blue-600/10 text-blue-400 text-xs font-medium border border-blue-500/30 hover:border-blue-500/50 transition-colors"
              >
                {g}
              </span>
            ))}
          </div>
        )}

        <button
          onClick={onAddReview}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.02]"
        >
          Add Review
        </button>

        <div className="border-t border-gray-800 pt-5">
          <h3 className="text-sm font-bold text-gray-300 mb-4 flex items-center gap-2">
            <div className="w-1 h-4 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></div>
            Recent Reviews
          </h3>
          <div className="space-y-3 max-h-80 overflow-auto pr-1">
            {(!reviews || reviews.length === 0) && (
              <p className="text-xs text-gray-600 text-center py-4">No reviews yet. Be the first!</p>
            )}
            {reviews?.map((r) => (
              <div
                key={r._id || r.id}
                className="p-4 bg-gradient-to-br from-[#1a1a1a] to-[#141414] rounded-xl border border-gray-800 group hover:border-gray-700 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-200">{r.reviewerName}</span>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                      <Star size={12} className="text-yellow-500" fill="currentColor" />
                      <span className="text-yellow-500 text-sm font-bold">{r.rating}</span>
                    </span>
                    {onDeleteReview && (
                      <button
                        onClick={() => onDeleteReview(r)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-gray-500 hover:text-red-500 hover:bg-red-500/10 transition-all duration-200"
                        title="Delete review"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
                {r.comment && (
                  <p className="text-xs text-gray-400 leading-relaxed">{r.comment}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidePane;
