// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import "./RecipeDetail.css";

// export default function RecipeDetail() {
//   // const { id } = useParams();
//   // exmpale id
//   const { id } = { id: 647555 };
//   const [recipe, setRecipe] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     setLoading(true);
    
//     fetch(`/recipe/${id}`)
//         .then(async (res) => {
//         const isJson = res.headers.get('content-type')?.includes('application/json');
//         const rawData = isJson ? await res.json() : null;

//         if (!res.ok) {
//             // If it's not JSON, extract the fallback HTML status text
//             const errorMsg = rawData?.error || await res.text() || `Status code: ${res.status}`;
//             throw new Error(errorMsg);
//         }
        
//         return rawData;
//         })
//         .then((data) => {
//         setRecipe(data);
//         setLoading(false);
//         })
//         .catch((err) => {
//         console.error("Frontend Fetch Error Context:", err);
//         setError(err.message);
//         setLoading(false);
//         });
//     }, [id]);

//   if (loading) return <div className="loader">Loading recipe info...</div>;
//   if (error) return <div className="error-msg">Error: {error}</div>;
//   if (!recipe) return <div className="error-msg">No recipe data found.</div>;

//   return (
//     <div className="recipe-page-container">
//       {/* Left Pane: Image Segment */}
//       <div className="recipe-visual-pane">
//         {recipe.image ? (
//           <img src={recipe.image} alt={recipe.title} className="main-recipe-img" />
//         ) : (
//           <div className="empty-image-placeholder" />
//         )}
//       </div>

//       {/* Right Pane: Context & Content Details */}
//       <div className="recipe-content-pane">
//         <div className="recipe-header-row">
//           <h1 className="recipe-main-title">{recipe.title}</h1>
//           <div className="action-buttons-group">
//             <button className="btn-action save-btn">Save</button>
//             <button className={`btn-action unsaved-btn ${recipe.saved ? 'is-saved' : ''}`}>
//               {recipe.saved ? 'Saved' : 'Unsaved'}
//             </button>
//           </div>
//         </div>

//         <div className="recipe-sub-meta">
//           <span className="rating-badge">⭐ {recipe.rating} ({recipe.reviewsCount} reviews)</span>
//           <span className="author-credit">By {recipe.author}</span>
//         </div>

//         {/* Clean, stripped summary display */}
//         <p className="recipe-summary-text">
//           {recipe.summary ? recipe.summary.replace(/<[^>]*>/g, '') : ''}
//         </p>

//         {/* Matrix Dashboard Container */}
//         <div className="recipe-matrix-box">
//           <div className="matrix-item">⏱️ <strong>Prep Time:</strong> {recipe.preparationMinutes} mins</div>
//           <div className="matrix-item">🔥 <strong>Cook Time:</strong> {recipe.cookingMinutes} mins</div>
//           <div className="matrix-item">🍽️ <strong>Servings:</strong> {recipe.servings}</div>
//           <div className="matrix-item">📊 <strong>Difficulty:</strong> {recipe.difficulty}</div>
//         </div>

//         {/* Native Accordion Wrapper Sections */}
//         <details open className="collapsible-section">
//           <summary className="section-trigger">Ingredients</summary>
//           <ul className="ingredients-bullet-list">
//             {recipe.ingredients?.map((ing, idx) => (
//               <li key={idx} className="ingredient-item">{ing.original}</li>
//             ))}
//           </ul>
//         </details>

//         <details open className="collapsible-section">
//           <summary className="section-trigger">Directions</summary>
//           <div className="directions-timeline">
//             {recipe.instructions?.map((step) => (
//               <div key={step.number} className="timeline-step-block">
//                 <h4 className="step-label">Step {step.number}</h4>
//                 <p className="step-body-text">{step.step}</p>
//               </div>
//             ))}
//           </div>
//         </details>
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CommentsSection from "../components/CommentSection.jsx";
import RatingSummary from "../components/RatingSummary";
import ReviewsSection from "../components/ReviewSection.jsx";
import "../styles.css";

export default function RecipeDetail() {
  const [recipe, setRecipe] = useState({
    title: "Creamy Garlic Pasta",
    image: null,
    saved: false,
    rating: "4.8",
    reviewsCount: 124,
    author: "John",
    summary: "A quick and easy pasta recipe perfect for busy weeknights.",
    preparationMinutes: 15,
    cookingMinutes: 20,
    servings: 4,
    difficulty: "Easy",
    ingredients: [
      { original: "12 oz pasta" },
      { original: "4 cloves garlic, minced" },
      { original: "2 tbsp butter" },
      { original: "1 cup heavy cream" },
      { original: "½ cup parmesan cheese" },
      { original: "Salt and pepper" }
    ],
    instructions: [
      { number: 1, step: "Boil pasta according to package instructions." },
      { number: 2, step: "Melt butter in a pan and sauté garlic until fragrant." },
      { number: 3, step: "Add cream and parmesan cheese. Stir until smooth." },
      { number: 4, step: "Mix cooked pasta into the sauce." },
      { number: 5, step: "Serve with parsley and extra parmesan." }
    ]
  });

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

  // useEffect is commented out so it doesn't overwrite your mock data with an API call
  /*
  const { id } = { id: 647555 };
  useEffect(() => {
    setLoading(true);
    fetch(`/recipe/${id}`)
      .then(async (res) => {
        const isJson = res.headers.get('content-type')?.includes('application/json');
        const rawData = isJson ? await res.json() : null;
        if (!res.ok) {
          const errorMsg = rawData?.error || await res.text() || `Status code: ${res.status}`;
          throw new Error(errorMsg);
        }
        return rawData;
      })
      .then((data) => {
        setRecipe(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Frontend Fetch Error Context:", err);
        setError(err.message);
        setLoading(false);
      });
  }, [id]);
  */

  const handleSaveToggle = () => {
    setRecipe(prevRecipe => ({
        ...prevRecipe,
        saved: !prevRecipe.saved
    }));
    };


  if (loading) return <div className="loader">Loading recipe info...</div>;
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
            <span className="rating-badge">⭐ {recipe.rating} ({recipe.reviewsCount} reviews)</span>
            <span className="author-credit">By {recipe.author}</span>
        </div>

        <p className="recipe-summary-text">
            {recipe.summary ? recipe.summary.replace(/<[^>]*>/g, '') : ''}
        </p>

        <div className="recipe-matrix-box">
            <div className="matrix-item">⏱️ <strong>Prep Time:</strong> {recipe.preparationMinutes} mins</div>
            <div className="matrix-item">🔥 <strong>Cook Time:</strong> {recipe.cookingMinutes} mins</div>
            <div className="matrix-item">🍽️ <strong>Servings:</strong> {recipe.servings}</div>
            <div className="matrix-item">📊 <strong>Difficulty:</strong> {recipe.difficulty}</div>
        </div>

        <details open className="collapsible-section">
            <summary className="section-trigger">Ingredients</summary>
            <ul className="ingredients-bullet-list">
            {recipe.ingredients?.map((ing, idx) => (
                <li key={idx} className="ingredient-item">{ing.original}</li>
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
            <CommentsSection />
            <ReviewsSection />
        </div>
        
    </div>
    );

}
