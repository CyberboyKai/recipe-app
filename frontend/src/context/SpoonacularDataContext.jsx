import { createContext, useContext, useState } from 'react';

const SpoonacularContext = createContext(null);

// set vars to avoid double api calls
let isFetchingRandom = false;

export function SpoonacularProvider({ children }) {
  const [recipes, setRecipes] = useState(null);
  const [loading, setLoading] = useState(true);

  function normalizeRecipes(results) {
    return (results || []).map((recipe) => ({
      ...recipe,
      image: recipe.image ?? null,
      timeMinutes: recipe.timeMinutes ?? recipe.readyInMinutes ?? 0,
      source: recipe.source ?? "official",
      rating: recipe.rating ?? 0,
      difficulty: recipe.difficulty ?? 0,
    }));
  }

  async function loadCachedRecipes() {
    try {
      setLoading(true);
      const res = await fetch("/api/recipes/cached");
      const data = await res.json();

      if (data.results && data.results.length > 0) {
        // cache has recipes, use them
        setRecipes(normalizeRecipes(data.results));
      } else {
        if (isFetchingRandom) return;
        isFetchingRandom = true;
        try {
          // cache is empty, fetch from random endpoint and save them
          const randomRes = await fetch("/api/recipes/random");
          const randomData = await randomRes.json();
          setRecipes(normalizeRecipes(randomData.results));
        } finally {
          isFetchingRandom.current = false;
        }
      }

    } catch (err) {
      console.error("Cache load error:", err);
    } finally {
      setLoading(false);
    }
  }

  async function searchRecipes(query, filters = {}) {
    // if the API limit is reached --> hit enter an empty bar and the cached recipes will load
    if (!query.trim()) {
      loadCachedRecipes();
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

      setRecipes(normalizeRecipes(data.results));
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SpoonacularContext.Provider value={{ recipes, setRecipes, searchRecipes, loadCachedRecipes, loading }}>
      {children}
    </SpoonacularContext.Provider>
  );
}

export const useSpoonacularData = () => useContext(SpoonacularContext);
