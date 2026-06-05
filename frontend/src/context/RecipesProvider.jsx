import { useState, useRef } from 'react';
import { RecipesContext } from './RecipesContext';

let isFetchingRandom = false;

export function RecipesProvider({ children }) {
  const [activeSource, setActiveSource] = useState("official");

  const [officialRecipes, setOfficialRecipes] = useState(null);
  const [userRecipes, setUserRecipes] = useState(null);

  const [searchResults, setSearchResults] = useState(null);

  const [loading, setLoading] = useState(false);

  const lastOfficialSearch = useRef(null); 

  function normalizeRecipes(results) {
    return (results || []).map((recipe) => ({
      ...recipe,
      image: recipe.image ?? null,
      readyInMinutes: recipe.readyInMinutes ?? 0,
      source: recipe.source ?? "official",
      rating: recipe.rating ?? 0,
      // difficulty: recipe.difficulty ?? 0,
      servings: recipe.servings ?? 0,
      healthScore: recipe.healthScore ?? 0,
    }));
  }

  // LOAD OFFICIAL RECIPES (Firestore cache)
  async function loadOfficialRecipes() {
    try {
      setLoading(true);

      const res = await fetch("/api/recipes/cached");
      const data = await res.json();

      setOfficialRecipes(normalizeRecipes(data.results || []));
    } catch (err) {
      console.error(err);
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
  async function searchRecipes(query, filters = {}, source = activeSource) {
    if (!query.trim()) {
      lastOfficialSearch.current = null;
      setSearchResults(null);
      return;
    }

    try {
      setLoading(true);

      // COMMUNITY: filter locally from userRecipes
      if (source === "user") {
        const q = query.toLowerCase();
        let results = (userRecipes || []).filter(r =>
          r.title.toLowerCase().includes(q)
        );

        if (filters.maxTime && filters.maxTime !== 999) {
          results = results.filter(r => r.readyInMinutes <= filters.maxTime);
        }
        if (filters.minHealthScore && filters.minHealthScore > 0) {
          results = results.filter(r => r.healthScore >= filters.minHealthScore);
        }
        if (filters.servings && filters.servings > 0) {
          results = results.filter(r => r.servings === filters.servings);
        }

        setSearchResults(results);
        return;
      }

      // OFFICIAL: return cache if query + filters haven't changed
      if (
        lastOfficialSearch.current &&
        lastOfficialSearch.current.query === query &&
        JSON.stringify(lastOfficialSearch.current.filters) === JSON.stringify(filters)
      ) {
        setSearchResults(lastOfficialSearch.current.results);
        return;
      }

      // OFFICIAL: hit Spoonacular
      const params = new URLSearchParams();
      params.append("query", query);
      params.append("number", "18");

      if (filters.maxTime && filters.maxTime !== 999) {
        params.append("maxReadyTime", filters.maxTime);
      }

      const res = await fetch(`/api/recipes?${params.toString()}`);
      const data = await res.json();

      let results = normalizeRecipes(data.results);

      if (filters.minHealthScore && filters.minHealthScore > 0) {
        results = results.filter(r => r.healthScore >= filters.minHealthScore);
      }
      if (filters.servings && filters.servings > 0) {
        results = results.filter(r => Math.abs(r.servings - filters.servings) <= 1);
      }

      lastOfficialSearch.current = { query, filters, results };
      setSearchResults(results);
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  }

  // REFRESH RECIPES BY CALLING RANDOM ENPOINT
  async function refreshRecipes() {
    try {
      setLoading(true);
      lastOfficialSearch.current = null;
      const res = await fetch("/api/recipes/random");
      const data = await res.json();
      setOfficialRecipes(normalizeRecipes(data.results));
      setSearchResults(null);
      setSource("official");
    } catch (err) {
      console.error("Refresh error:", err);
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
        setSearchResults,
        searchResults,

        loading,

        loadOfficialRecipes,
        loadUserRecipes,
        searchRecipes,
        refreshRecipes,
      }}
    >
      {children}
    </RecipesContext.Provider>
  );
}
