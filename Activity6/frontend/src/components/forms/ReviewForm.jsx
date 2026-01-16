import React, { useState } from "react";
import { Star } from "react-feather";

const ReviewForm = ({ onCancel, onSubmit }) => {
  const [reviewerName, setReviewerName] = useState("");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!reviewerName.trim()) {
      setError("Name is required.");
      return;
    }

    const ratingNum = Number(rating);
    if (!ratingNum || ratingNum < 1 || ratingNum > 5) {
      setError("Rating must be between 1 and 5.");
      return;
    }

    try {
      setSubmitting(true);
      await onSubmit?.({
        reviewerName: reviewerName.trim(),
        rating: ratingNum,
        comment: comment || undefined,
      });
    } catch (err) {
      setError(err?.message || "Failed to save review.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="p-3 rounded-lg bg-red-900/30 border border-red-600/50">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Your Name</label>
        <input
          className="w-full bg-[#0a0a0a] text-gray-200 px-4 py-3 rounded-lg border border-gray-800 focus:outline-none focus:border-blue-500 transition-all"
          value={reviewerName}
          onChange={(e) => setReviewerName(e.target.value)}
          placeholder="Enter your name"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Rating</label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className="p-1 transition-transform hover:scale-110"
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(star)}
            >
              <Star
                size={28}
                className={`transition-colors ${
                  star <= (hoverRating || rating)
                    ? "text-yellow-500 fill-yellow-500"
                    : "text-gray-600"
                }`}
              />
            </button>
          ))}
          <span className="ml-3 text-gray-400 text-sm">
            {rating} Star{rating > 1 ? "s" : ""}
          </span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Comment (optional)</label>
        <textarea
          className="w-full bg-[#0a0a0a] text-gray-200 px-4 py-3 rounded-lg border border-gray-800 focus:outline-none focus:border-blue-500 transition-all resize-none"
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="What did you think about the movie?"
        />
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="button"
          className="flex-1 px-4 py-3 rounded-lg bg-gray-800 text-gray-200 hover:bg-gray-700 transition-colors font-medium"
          onClick={onCancel}
          disabled={submitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 px-4 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60 transition-colors font-medium"
          disabled={submitting}
        >
          {submitting ? "Submitting..." : "Submit Review"}
        </button>
      </div>
    </form>
  );
};

export default ReviewForm;
