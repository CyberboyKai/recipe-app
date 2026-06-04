import { useState } from 'react';
import { RecipesContext } from './RecipesContext';

// set vars to avoid double api calls
let isFetchingRandom = false;

export function RecipesProvider({ children }) {
  const [activeSource, setActiveSource] = useState("official");

  const [officialRecipes, setOfficialRecipes] = useState(null);
  const [userRecipes, setUserRecipes] = useState(null);

  const [searchResults, setSearchResults] = useState(null);

  const [loading, setLoading] = useState(false);

  function normalizeRecipes(results) {
    return (results || []).map((recipe) => ({
      ...recipe,
      image: recipe.image ?? null,
      readyInMinutes: recipe.readyInMinutes ?? 0,
      source: recipe.source ?? "official",
      rating: recipe.rating ?? 0,
      difficulty: recipe.difficulty ?? 0,
    }));
  }

  // LOAD OFFICIAL RECIPES (Firestore cache)
  async function loadOfficialRecipes() {
    try {
      setLoading(true);
      const res = await fetch("/api/recipes/cached");
      const data = await res.json();

      if (data.results && data.results.length > 0) {
        // cache has recipes, use them
        setOfficialRecipes(normalizeRecipes(data.results));
      } else {
        if (isFetchingRandom) return;
        isFetchingRandom = true;
        try {
          // cache is empty, fetch from random endpoint and save them
          const randomRes = await fetch("/api/recipes/random");
          const randomData = await randomRes.json();
          setOfficialRecipes(normalizeRecipes(randomData.results));
        } finally {
          isFetchingRandom = false;
        }
      }
    } catch (err) {
      console.error("Official recipes load error:", err);
    } finally {
      setLoading(false);
    }
  }

  // LOAD USER RECIPES
  async function loadUserRecipes() {
    try {
      setLoading(true);
      const res = await fetch("/api/recipes/users")
      const data = await res.json();

      if (data.results && data.results.length > 0) {
        // db has user recipes, set them
        setUserRecipes(normalizeRecipes(data.results));
      }
      // else it is empty
    } catch (err) {
      console.error("User generated recipes load error:", err);
    } finally {
      setLoading(false);
    }
  }

  // SEARCH API RECIPES (Spoonacular)
  async function searchRecipes(query, filters = {}) {
    // if the API limit is reached --> hit enter an empty bar and the cached recipes will load
    if (!query.trim()) {
      setSearchResults(null);
      return;
    }

    try {
      setLoading(true);

      const params = new URLSearchParams();
      params.append("query", query);
      params.append("number", "18");

      // if user picks a max time filter then append, if not then default to 'any' which = 999
      if (filters.maxTime && filters.maxTime !== 999) {
        params.append("maxReadyTime", filters.maxTime);
      }

      const res = await fetch(`/api/recipes?${params.toString()}`);
      const data = await res.json();

      setSearchResults(normalizeRecipes(data.results));
      setActiveSource("search");
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  }

  // SET SOURCE
  function setSource(source) {
    setActiveSource(source);
  }

  return (
    <RecipesContext.Provider
      value={{
        activeSource,
        setSource,

        officialRecipes,
        userRecipes,
        searchResults,

        loading,

        loadOfficialRecipes,
        loadUserRecipes,
        searchRecipes,
      }}
    >
      {children}
    </RecipesContext.Provider>
  );
}
