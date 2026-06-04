import React, { useState } from "react";
import "../pages/RecipeDetail.css";

export default function ReviewsSection() {
  const [reviews, setReviews] = useState([
    {
      id: 1,
      userName: "Anonymous Reviewer",
      rating: 5,
      body: "A total hit with the family! Simple ingredients, restaurant quality flavor.",
      date: "October 24, 2026"
    },
    {
      id: 2,
      userName: "Anonymous Reviewer",
      rating: 4,
      body: "Very good! Added a bit of extra garlic and it was perfect.",
      date: "May 12, 2026"
    },
    {
      id: 3,
      userName: "Anonymous Reviewer",
      rating: 1,
      body: "Sauce separated completely. Instructions lacked temperature parameters.",
      date: "April 02, 2026"
    },
    {
      id: 4,
      userName: "Anonymous Reviewer",
      rating: 5,
      body: "",
      date: "January 15, 2026"
    }
  ]);

  const [formRating, setFormRating] = useState(0); 
  const [formBody, setFormBody] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Filter Selection State ("All", 5, 4, 3, 2, 1)
  const [selectedFilter, setSelectedFilter] = useState("All");

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    
    if (formRating === 0) {
      setErrorMessage("Please select a star rating between 1 and 5.");
      return;
    }

    const freshReview = {
      id: Date.now(),
      userName: "Anonymous Reviewer",
      rating: parseInt(formRating),
      body: formBody.trim(),
      date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    };

    setReviews([freshReview, ...reviews]);
    
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
                    <span className="commenter-name">{review.userName}</span>
                    <span className="stars-rating-badge-inline">
                      {"★".repeat(review.rating) + "☆".repeat(5 - review.rating)}
                    </span>
                  </div>
                  <span className="comment-date-stamp">{review.date}</span>
                </div>
              </div>
              {review.body && <p className="comment-body-text review-card-paragraph-text">"{review.body}"</p>}
            </div>
          ))
        )}
      </div>

    </div>
  );
}
