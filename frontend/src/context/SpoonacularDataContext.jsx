import { useState, useEffect } from 'react';
import { SpoonacularContext } from './SpoonacularContext';

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
        setRecipes(normalizeRecipes(data.results));
      } else {
        if (isFetchingRandom) return;
        isFetchingRandom = true;
        try {
          const randomRes = await fetch("/api/recipes/random");
          const randomData = await randomRes.json();
          setRecipes(normalizeRecipes(randomData.results));
        } finally {
          isFetchingRandom = false;
        }
      }

    } catch (err) {
      console.error("Cache load error:", err);
    } finally {
      setLoading(false);
    }
  }

  async function searchRecipes(query, filters = {}) {
    if (!query.trim()) {
      loadCachedRecipes();
      return;
    }

    try {
      setLoading(true);

      const params = new URLSearchParams();
      params.append("query", query);
      params.append("number", "18");

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

  useEffect(() => {
    loadCachedRecipes();
  }, []); 

  return (
    <SpoonacularContext.Provider value={{ recipes, setRecipes, searchRecipes, loadCachedRecipes, loading }}>
      {children}
    </SpoonacularContext.Provider>
  );
}