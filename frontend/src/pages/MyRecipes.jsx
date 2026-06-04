import { useEffect, useState } from 'react';
import {
  arrayRemove,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

import { db } from '../firebase.js';
import useAuth from '../hooks/useAuth.js';
import salad from '../assets/salad.png';
import RecipeCard from '../components/RecipeCard.jsx';
import ReviewCard from '../components/ReviewCard.jsx';

const placeholderReviews = [
  {
    name: 'Sarah M.',
    quote: 'The recipes here are not only delicious but also easy to follow.',
    position: 'left',
  },
  {
    name: 'Farellin J.',
    quote: "I've discovered a treasure trove of meatless recipes that have made my meals.",
    position: 'right',
  },
];

const MyRecipes = () => {
  const { currentUser: user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('created');
  const [createdRecipes, setCreatedRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  // redirect to login if not authenticated
  useEffect(() => {
    if (user === null) navigate('/login');
  }, [user, navigate]);

  // fetch created recipes — recipes collection where source == "user" and authorId == uid
  useEffect(() => {
    if (!user) return;
    const fetchCreated = async () => {
      const q = query(
        collection(db, 'recipes'),
        where('source', '==', 'user'),
        where('authorId', '==', user.uid)
      );
      const snapshot = await getDocs(q);
      setCreatedRecipes(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    };
    fetchCreated();
  }, [user]);

  // fetch saved recipes — get array from users/{uid} then fetch each recipe
  useEffect(() => {
    if (!user) return;
    const fetchSaved = async () => {
      const userSnap = await getDoc(doc(db, 'users', user.uid));
      const savedIds = userSnap.data()?.savedRecipes || [];

      if (savedIds.length === 0) {
        setSavedRecipes([]);
        setLoading(false);
        return;
      }

      // fetch each recipe by ID
      const recipePromises = savedIds.map((id) =>
        getDoc(doc(db, 'recipes', String(id)))
      );
      const recipeDocs = await Promise.all(recipePromises);
      setSavedRecipes(
        recipeDocs
          .filter((d) => d.exists())
          .map((d) => ({ id: d.id, ...d.data() }))
      );
      setLoading(false);
    };
    fetchSaved();
  }, [user]);

  const handleDelete = async (recipeId) => {
    await deleteDoc(doc(db, 'recipes', recipeId));
    setCreatedRecipes((prev) => prev.filter((r) => r.id !== recipeId));
  };

  const handleRemove = async (recipeId) => {
    // remove the id from the savedRecipes array in users/{uid}
    await updateDoc(doc(db, 'users', user.uid), {
      savedRecipes: arrayRemove(String(recipeId)),
    });
    setSavedRecipes((prev) => prev.filter((r) => r.id !== recipeId));
  };

  const recipes = activeTab === 'created' ? createdRecipes : savedRecipes;

  if (user === undefined || loading) {
    return (
      <div className="app-shell" style={{ paddingTop: 80, textAlign: 'center' }}>
        Loading…
      </div>
    );
  }

  return (
    <div className="app-shell">
      <main>
        <section className="hero-section" aria-labelledby="my-recipes-title">
          <div className="hero-copy">
            <div className="hero-text">
              <h1 id="my-recipes-title">Easy recipes for any occasion</h1>
            </div>
          </div>

          <div className="hero-visual" aria-label="Featured dish">
            <img src={salad} alt="Avocado egg bowl with broccoli and toast" />
            {placeholderReviews.map((review) => (
              <ReviewCard
                key={review.name}
                name={review.name}
                quote={review.quote}
                position={review.position}
              />
            ))}
          </div>
        </section>

        <div className="my-recipes-tabs">
          <button
            className={`my-recipes-tab ${activeTab === 'created' ? 'active' : ''}`}
            onClick={() => setActiveTab('created')}
          >
            ✓ My Recipes (Created)
          </button>
          <button
            className={`my-recipes-tab ${activeTab === 'saved' ? 'active' : ''}`}
            onClick={() => setActiveTab('saved')}
          >
            ✓ Saved
          </button>
        </div>

        <div className="recipes-section">
          {recipes.length === 0 ? (
            <p style={{ color: '#77736d', textAlign: 'center', padding: '40px 0' }}>
              {activeTab === 'created'
                ? "You haven't created any recipes yet."
                : "You haven't saved any recipes yet."}
            </p>
          ) : (
            <div className="recipe-grid">
              {recipes.map((recipe) => (
                <div key={recipe.id} className="my-recipe-card-wrapper">
                  <RecipeCard recipe={recipe} />
                  {activeTab === 'created' ? (
                    <div className="my-recipe-actions">
                      <button
                        className="button ghost compact"
                        onClick={() => navigate(`/edit-recipe/${recipe.id}`)}
                      >
                        Edit
                      </button>
                      <button
                        className="button dark compact"
                        onClick={() => handleDelete(recipe.id)}
                      >
                        Delete
                      </button>
                    </div>
                  ) : (
                    <div className="my-recipe-actions">
                      <button
                        className="button ghost compact"
                        onClick={() => handleRemove(recipe.id)}
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MyRecipes;
