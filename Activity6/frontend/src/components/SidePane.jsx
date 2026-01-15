import React from "react";
import { Star } from "react-feather";

const SidePane = ({ movie, onAddReview, reviews }) => {
  if (!movie) {
    return (
      <div className="bg-dark-secondary rounded-lg p-4 text-gray-400 shadow-lg">
        Select a movie to see details.
      </div>
    );
  }

  const avg = movie.averageRating ?? 0;

  return (
    <div className="bg-dark-secondary rounded-lg p-4 space-y-4 shadow-lg">
      {movie.coverUrl && (
        <div>
          <img
            src={movie.coverUrl}
            alt={movie.title || "Movie cover"}
            className="w-full h-64 object-cover rounded-lg border border-dark-border mb-3"
          />
        </div>
      )}
      <div>
        <h2 className="text-xl font-semibold text-dark-text mb-1">
          {movie.title}
        </h2>
        {movie.releaseYear && (
          <p className="text-sm text-gray-400">Released: {movie.releaseYear}</p>
        )}
        {movie.director && (
          <p className="text-sm text-gray-400">Director: {movie.director}</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Star className="text-yellow-400" size={18} />
        <span className="text-lg font-semibold">{avg.toFixed(1)} / 5</span>
        <span className="text-sm text-gray-400">
          ({movie.reviewCount ?? 0} reviews)
        </span>
      </div>

      {movie.description && (
        <p className="text-sm text-gray-300 whitespace-pre-line">
          {movie.description}
        </p>
      )}

      {Array.isArray(movie.genres) && movie.genres.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {movie.genres.map((g) => (
            <span
              key={g}
              className="px-2 py-1 rounded-full bg-dark-card text-xs text-gray-200"
            >
              {g}
            </span>
          ))}
        </div>
      )}

      <button
        onClick={onAddReview}
        className="mt-2 px-4 py-2 rounded bg-[#00a2ff] text-white hover:bg-blue-600 text-sm"
      >
        Add Review
      </button>

      <div className="mt-4 border-t border-dark-border pt-3 max-h-64 overflow-auto">
        <h3 className="text-sm font-semibold mb-2">Recent Reviews</h3>
        {(!reviews || reviews.length === 0) && (
          <p className="text-xs text-gray-500">No reviews yet.</p>
        )}
        {reviews?.map((r) => (
          <div
            key={r._id || r.id}
            className="mb-3 pb-2 border-b border-dark-border last:border-b-0 last:pb-0"
          >
            <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
              <span>{r.reviewerName}</span>
              <span className="flex items-center gap-1">
                <Star className="text-yellow-400" size={12} />
                {r.rating}
              </span>
            </div>
            {r.comment && <p className="text-xs text-gray-300">{r.comment}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SidePane;
