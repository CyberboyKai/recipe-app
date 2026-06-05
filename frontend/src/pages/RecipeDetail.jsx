import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAuth from '../hooks/useAuth.js';
import { useSavedRecipes } from "../hooks/useSavedRecipes";
import CommentsSection from "../components/CommentSection.jsx";
import RatingSummary from "../components/RatingSummary";
import ReviewsSection from "../components/ReviewSection.jsx";
import { BookmarkIcon as BookmarkOutline } from "@heroicons/react/24/outline";
import { BookmarkIcon as BookmarkSolid } from "@heroicons/react/24/solid";
import "../styles.css";

export default function RecipeDetail() {
    const { currentUser: user, isAuthLoading } = useAuth();
    const { id } = useParams();
    const navigate = useNavigate();
    const [recipe, setRecipe] = useState(null);
    const { savedIds, toggleSave } = useSavedRecipes();
    const authReady = !isAuthLoading && user;
    // only trust savedIds AFTER auth is ready
    const isSaved = authReady && savedIds?.has(Number(id));
    console.log(isSaved)
    console.log(savedIds)
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
                <button
                    onClick={() => {
                        if (!user) return;
                        toggleSave(Number(id));
                    }}
                    className="absolute right-3 top-3 rounded-full bg-white/90 p-2 shadow hover:bg-white transition relative"
                    >
                    {isSaved ? (
                        <BookmarkSolid className="h-10 w-10 text-blue-600" />
                    ) : (
                        <BookmarkOutline className="h-10 w-10 text-gray-600" />
                    )}
                </button>
            </div>

            <div className="recipe-sub-meta">
                <span className="recipe-source-tag"> {recipe.source} </span>
                <span className="rating-badge">⭐ {recipe.rating} ({recipe.reviewsCount ?? 0})</span>
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
            <RatingSummary recipeId={id} />
            <CommentsSection recipeId={id} currentUser={user}/>
            <ReviewsSection recipeId={id} currentUser={user}/>
        </div>
        
    </div>
    );

}
