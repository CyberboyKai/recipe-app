import { useState, useEffect } from "react";
import "../pages/RecipeDetail.css";

export default function ReviewsSection({ recipeId, currentUser }) {
  const [reviews, setReviews] = useState([]);
  const [formRating, setFormRating] = useState(0); 
  const [formBody, setFormBody] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Filter Selection State ("All", 5, 4, 3, 2, 1)
  const [selectedFilter, setSelectedFilter] = useState("All");

  const fetchReviews = async () => {
    const res = await fetch(`/api/recipes/${recipeId}/reviews`);
    const data = await res.json();

    const formatted = data.map(r => ({
      id: r.id,
      displayName: r.displayName,
      rating: r.rating,
      text: r.text,
      date: r.date
    }));

    setReviews(formatted);
  };

  useEffect(() => {
    fetchReviews();
  }, [recipeId]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (formRating === 0) {
      setErrorMessage("Please select a star rating between 1 and 5.");
      return;
    }


      const res = await fetch(`/api/recipes/${recipeId}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: currentUser.uid,
          displayName: currentUser.displayName || "Anonymous",
          rating: formRating,
          text: formBody.trim(),
        }),
      });

      if (!res.ok) {
        console.error("Backend error response:", data);
        throw new Error("Failed to submit review");
      }
      // re-fetch reviews
      await fetchReviews();

      setFormRating(0);
      setFormBody("");
      setErrorMessage("");

  };

  const filteredReviews = reviews.filter((review) => {
    if (selectedFilter === "All") return true;
    return review.rating === parseInt(selectedFilter);
  });

  return (
    <div className="reviews-section-container">
      <h3 className="comments-main-heading">Leave a Review</h3>
      
      <form className="comment-input-wrapper review-form-block" onSubmit={handleReviewSubmit}>
        <div className="input-fields-box">
          
          <div className="interactive-star-selector">
            <span className="selector-label">Rating (Required):</span>
            <div className="star-buttons-row">
              {[1, 2, 3, 4, 5].map((starValue) => (
                <button
                  key={starValue}
                  type="button"
                  className={`star-select-btn ${formRating >= starValue ? "is-selected-star" : ""}`}
                  onClick={() => setFormRating(starValue)}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <textarea 
            placeholder="Write your review body here... (Optional)" 
            className="comment-form-text" 
            rows="3" 
            value={formBody}
            onChange={(e) => setFormBody(e.target.value)}
          />

          {errorMessage && <div className="form-error-banner">⚠️ {errorMessage}</div>}

          <button type="submit" className="btn-submit-comment">Submit Review</button>
        </div>
      </form>

      <div className="reviews-header-dashboard-row">
        <div className="comments-count-header raw-ratings-counter">
          {selectedFilter === "All" ? (
            `${reviews.length} ratings`
          ) : (
            `Showing ${filteredReviews.length} of ${reviews.length} reviews`
          )}
        </div>

        <div className="pill-filter-dropdown-wrapper">
          <div className="filter-pill-trigger-btn">
            <svg xmlns="http://w3.org" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="filter-icon-svg">
              <line x1="4" y1="21" x2="4" y2="14"></line>
              <line x1="4" y1="10" x2="4" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12" y2="3"></line>
              <line x1="20" y1="21" x2="20" y2="16"></line>
              <line x1="20" y1="12" x2="20" y2="3"></line>
              <line x1="1" y1="14" x2="7" y2="14"></line>
              <line x1="9" y1="8" x2="15" y2="8"></line>
              <line x1="17" y1="16" x2="23" y2="16"></line>
            </svg>
            <span className="pill-text-label">Filters</span>
            
            <select 
              className="hidden-native-filter-select"
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
            >
              <option value="All">All Reviews</option>
              <option value="5">5 Stars only</option>
              <option value="4">4 Stars only</option>
              <option value="3">3 Stars only</option>
              <option value="2">2 Stars only</option>
              <option value="1">1 Star only</option>
            </select>
          </div>
        </div>
      </div>

      <div className="comments-list-thread generic-reviews-feed-stack">
        {filteredReviews.length === 0 ? (
          <div className="empty-reviews-state">No {selectedFilter}-star reviews found.</div>
        ) : (
          filteredReviews.map((review) => (
            <div key={review.id} className="comment-card-block review-card-item">
              <div className="comment-card-header">
                <div className="user-avatar-placeholder">📋</div>
                <div className="user-meta-info">
                  <div className="review-title-line-meta">
                    <span className="commenter-name">{review.displayName}</span>
                    <span className="stars-rating-badge-inline">
                      {"★".repeat(review.rating) + "☆".repeat(5 - review.rating)}
                    </span>
                  </div>
                  <span className="comment-date-stamp">{review.date}</span>
                </div>
              </div>
              {review.text && <p className="comment-body-text review-card-paragraph-text">"{review.text}"</p>}
            </div>
          ))
        )}
      </div>

    </div>
  );
}
