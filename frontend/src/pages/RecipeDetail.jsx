import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAuth from '../hooks/useAuth.js';
import CommentsSection from "../components/CommentSection.jsx";
import RatingSummary from "../components/RatingSummary";
import ReviewsSection from "../components/ReviewSection.jsx";
import "../styles.css";

export default function RecipeDetail() {
    const { currentUser: user, isAuthLoading } = useAuth();
    console.log("Current user in RecipeDetail:", user);
    const navigate = useNavigate();
    const [recipe, setRecipe] = useState(null);
    const [reviews] = useState([
      {
        id: 1,
        userName: "Sarah Jenkins",
        rating: 5,
        body: "This recipe was incredibly easy to follow and tasted absolutely amazing!"
      },
      {
        id: 2,
        userName: "Gordon R.",
        rating: 1,
        body: "Sauce separated completely. Instructions lacked temperature breakdown details for pan reductions."
      },
      {
        id: 3,
        userName: "Emma Watson",
        rating: 4,
        body: "Very good! Added a bit of extra garlic and it was perfect."
      },
      {
        id: 4,
        userName: "Michael B.",
        rating: 5,
        body: "A total hit with the family! Simple ingredients, restaurant quality flavor."
      }
    ]);

  // Set loading to false initially so the mock data displays right away
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // redirect to login if not authenticated
    useEffect(() => {
        if (!isAuthLoading && !user) {
            navigate('/login');
        }
    }, [user, isAuthLoading, navigate]);

    if (user) {
        console.log(user.uid);
        console.log(user.displayName);
    }

    // useEffect is commented out so it doesn't overwrite your mock data with an API call
    const { id } = useParams();
    useEffect(() => {
        async function fetchRecipe() {
            try {
                setLoading(true);
                const res = await fetch(`/api/recipe/${id}`);
                if (!res.ok) {
                    const err = await res.json();
                    throw new Error(err.error || "Failed to fetch recipe");
                }
                const data = await res.json();
                console.log(data);
                console.log("instructions:", data.instructions);
                console.log("type:", typeof data.instructions);
                setRecipe(data);
                setError(null);
            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        if (id) {
            fetchRecipe();
        }
    }, [id]);

    const handleSaveToggle = () => {
        setRecipe(prevRecipe => ({
            ...prevRecipe,
            saved: !prevRecipe.saved
        }));
    };

  if (isAuthLoading || loading) {
    return (
      <div className="page-loading-state">
        <div className="loading-spinner" />
        <p>Loading recipe...</p>
      </div>
    );
  }
  if (error) return <div className="error-msg">Error: {error}</div>;
  if (!recipe) return <div className="error-msg">No recipe data found.</div>;

  return (
    <div className="recipe-page-container">
        
        {/* Left Pane: Image Segment */}
        <div className="recipe-visual-pane">
            {recipe.image ? (
                <img src={recipe.image} alt={recipe.title} className="main-recipe-img" />
            ) : (
                <div className="empty-image-placeholder" />
            )}

            <details open className="collapsible-section">
                <summary className="section-trigger">Summary</summary>
                <p className="recipe-summary-text">
                    {recipe.summary?.replace(/<[^>]+>/g, "")}
                </p>
            </details>
        </div>

        {/* Right Pane: Content Details (Ingredients stay inside here) */}
        <div className="recipe-content-pane">
            <div className="recipe-header-row">
                <h1 className="recipe-main-title">{recipe.title}</h1>
                <div className="action-buttons-group">
                    <button 
                    onClick={handleSaveToggle}
                    className={`btn-action save-toggle-btn ${recipe.saved ? 'is-saved' : 'is-unsaved'}`}
                    >
                    {recipe.saved ? 'Saved' : 'Save'}
                    </button>
                </div>
            </div>

            <div className="recipe-sub-meta">
                <span className="recipe-source-tag"> {recipe.source} </span>
                <span className="rating-badge">⭐ {recipe.rating} ({recipe.reviewsCount} reviews)</span>
                <span className="author-credit">By {recipe.author}</span>
            </div>

            <div className="recipe-matrix-box">
                <div className="matrix-item">⏱️ <strong>Prep Time:</strong> {" "}{recipe.preparationMinutes || recipe.readyInMinutes || "N/A"} mins</div>
                <div className="matrix-item">🔥 <strong>Cook Time:</strong> {" "}{recipe.cookingMinutes || "N/A"} mins</div>
                <div className="matrix-item">🍽️ <strong>Servings:</strong> {" "}{recipe.servings}</div>
                <div className="matrix-item">📊 <strong>Health Score:</strong> {" "}{recipe.healthScore}</div>
            </div>

            <details open className="collapsible-section">
                <summary className="section-trigger">Ingredients</summary>
                <ul className="ingredients-bullet-list">
                {recipe.ingredients?.map((ing, idx) => (
                    <li key={idx} className="ingredient-item">
                        {ing.amount} {ing.unit} {ing.name}
                    </li>
                ))}
                </ul>
            </details>

        </div>

        <details open className="collapsible-section directions-section">
        <summary className="section-trigger">Instructions</summary>
        <div className="directions-timeline">
            {recipe.instructions?.map((step) => (
            <div key={step.number} className="timeline-step-block">
                <h4 className="step-label">Step {step.number}</h4>
                <p className="step-body-text">{step.step}</p>
            </div>
            ))}
        </div>
        </details>

        <div className="comments-section-container">
            <RatingSummary reviews={reviews} />
            <CommentsSection recipeId={id} currentUser={user}/>
            <ReviewsSection />
        </div>
        
    </div>
    );

}
