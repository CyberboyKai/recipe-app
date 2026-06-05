import React, { useState, useEffect } from "react";
import "../pages/RecipeDetail.css";

export default function RatingSummary({ recipeId }) {
  const [reviews, setReviews] = useState([]);

  const fetchReviews = async () => {
      try {
        const res = await fetch(`/api/recipes/${recipeId}/reviews`);
        const data = await res.json();
  
        const formatted = data.map(r => ({
          id: r.id,
          displayName: r.displayName,
          rating: r.rating,
          text: r.text,
          date: r.date?.seconds
            ? new Date(r.date.seconds * 1000).toLocaleDateString()
            : "Recently",
        }));

        console.log("RAW REVIEWS:", data);
  
        setReviews(formatted);
      } catch (err) {
        console.error(err);
      } 
    };
  
    useEffect(() => {
      fetchReviews();
    }, [recipeId]);

  const totalReviewsCount = reviews.length;
  
  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  let sumOfRatings = 0;

  reviews.forEach((review) => {
    const r = review.rating;
    if (distribution[r] !== undefined) distribution[r]++;
    sumOfRatings += r;
  });

  const averageRating = totalReviewsCount > 0 ? (sumOfRatings / totalReviewsCount).toFixed(1) : "0.0";

  let highestReview = null;
  let lowestReview = null;

  if (totalReviewsCount > 0) {
    const sortedReviews = [...reviews].sort((a, b) => a.rating - b.rating);
    lowestReview = sortedReviews[0];
    highestReview = sortedReviews[sortedReviews.length - 1];

    // If there is only 1 review, don't duplicate it across both blocks
    if (highestReview.id === lowestReview.id && totalReviewsCount === 1) {
      lowestReview = null;
    }
  }

  return (
    <div className="rating-summary-layout-box">
      <h3 className="rating-summary-main-title">Rating Summary</h3>

      <div className="rating-summary-split-grid">
        <div className="rating-score-pillar">
          <div className="huge-score-display">{averageRating}</div>
          <div className="stars-row-visual">
            {"★".repeat(Math.round(averageRating)) + "☆".repeat(5 - Math.round(averageRating))}
          </div>
          <div className="total-ratings-sub-label">{totalReviewsCount} global ratings</div>
        </div>

        <div className="rating-distribution-graph">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = distribution[star];
            const percentage = totalReviewsCount > 0 ? (count / totalReviewsCount) * 100 : 0;
            
            return (
              <div key={star} className="distribution-row-bar">
                <span className="star-bar-index-label">{star} star</span>
                <div className="progress-track-bg">
                  <div className="progress-fill-active" style={{ width: `${percentage}%` }}></div>
                </div>
                <span className="star-bar-percentage-label">{Math.round(percentage)}%</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="featured-reviews-comparison-deck">
        {highestReview && (
          <div className="featured-card-pane highest-rating-pane">
            <div className="featured-badge-header top-positive">Highest Rated Positive Review</div>
            <div className="featured-reviewer-meta">
              <strong>{highestReview.displayName}</strong> <span className="starred-accent">{"★".repeat(highestReview.rating)}</span>
            </div>
            <p className="featured-snippet-body">"{highestReview.text}"</p>
          </div>
        )}

        {lowestReview && (
          <div className="featured-card-pane lowest-rating-pane">
            <div className="featured-badge-header top-critical">Lowest Rated Critical Review</div>
            <div className="featured-reviewer-meta">
              <strong>{lowestReview.displayName}</strong> <span className="starred-accent">{"★".repeat(lowestReview.rating)}</span>
            </div>
            <p className="featured-snippet-body">"{lowestReview.text}"</p>
          </div>
        )}
      </div>
    </div>
  );
}
