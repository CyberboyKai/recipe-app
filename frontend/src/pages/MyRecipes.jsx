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
import RecipeCard from '../components/RecipeCard.jsx';

import { getHealthText } from "../services/healthScore";

const MyRecipes = () => {
  const { currentUser: user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('created');
  const [createdRecipes, setCreatedRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [loadingCreated, setLoadingCreated] = useState(true);
  const [loadingSaved, setLoadingSaved] = useState(true);

  const formatUserRecipe = (id, data) => ({
    ...data,
    id,
    href: `/recipes/${id}`,
    time: data.readyInMinutes
      ? `${data.readyInMinutes} mins`
      : `${(data.prepTime ?? 0) + (data.cookTime ?? 0)} mins`,
    servings: `${data.servings ?? 1} servings`,
    healthScore: getHealthText(data.healthScore ?? 0),
  });

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
      setCreatedRecipes(snapshot.docs.map((d) => formatUserRecipe(d.id, d.data())));
      setLoadingCreated(false);
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
        setLoadingSaved(false);
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
          .map((d) => formatUserRecipe(d.id, d.data()))
      );
      setLoadingSaved(false);
    };
    fetchSaved();
  }, [user]);

  const handleDelete = async (recipeId) => {
    await deleteDoc(doc(db, 'recipes', recipeId));
    setCreatedRecipes((prev) => prev.filter((r) => r.id !== recipeId));
  };

  const handlePublish = async (recipeId) => {
    await updateDoc(doc(db, 'recipes', recipeId), { published: true });
    setCreatedRecipes((prev) =>
      prev.map((r) => (r.id === recipeId ? { ...r, published: true } : r))
    );
  };

  const handleRemove = async (recipeId) => {
    // remove the id from the savedRecipes array in users/{uid}
    await updateDoc(doc(db, 'users', user.uid), {
      savedRecipes: arrayRemove(String(recipeId)),
    });
    setSavedRecipes((prev) => prev.filter((r) => r.id !== recipeId));
  };

  const recipes = activeTab === 'created' ? createdRecipes : savedRecipes;

  const loading = activeTab === 'created' ? loadingCreated : loadingSaved;

  if (user === undefined || loading) {
    return (
      <div className="app-shell" style={{ paddingTop: 80, textAlign: 'center' }}>
        Loading…
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-8 py-12 text-[#111]">
      <main>
        <header className="mb-6 text-left">
          <h1 className="text-[2.5rem] font-bold tracking-[-0.02em] text-black mb-2">My Recipes</h1>
          <p className="text-[#666] text-base m-0">View and manage your created and saved recipes.</p>
        </header>
        
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
                  {activeTab === 'created' && (
                    <span style={{
                      display: 'inline-block',
                      marginTop: 6,
                      padding: '2px 10px',
                      borderRadius: 99,
                      fontSize: 12,
                      fontWeight: 600,
                      background: recipe.published ? '#e6f4ea' : '#fff3cd',
                      color: recipe.published ? '#2d6a4f' : '#856404',
                    }}>
                      {recipe.published ? 'Published' : 'Pending Review'}
                    </span>
                  )}
                  {activeTab === 'created' ? (
                    <div className="my-recipe-actions">
                      <button
                        className="button ghost compact"
                        onClick={() => navigate(`/edit-recipe/${recipe.id}`)}
                      >
                        Edit
                      </button>
                      {!recipe.published && (
                        <button
                          className="button ghost compact"
                          onClick={() => handlePublish(recipe.id)}
                        >
                          Publish
                        </button>
                      )}
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
