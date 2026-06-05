import { useEffect, useMemo, useState } from "react";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

import { useRecipesData } from "../context/useRecipesData.js";
import { useSavedRecipes } from "../hooks/useSavedRecipes";

import RecipeCardExtended from "../components/RecipesPage/RecipeCardExtended";
import RecipeToolbar from "../components/RecipesPage/RecipeToolbar";

const DEFAULT_FILTERS = { maxTime: 999, minHealthScore: 0, servings: 0 };

export default function RecipePage() {
  const {
    activeSource,
    setSource,
    officialRecipes,
    userRecipes,
    searchResults,
    loading,
    loadOfficialRecipes,
    loadUserRecipes,
    searchRecipes,
    setSearchResults,
    refreshRecipes,
  } = useRecipesData();

  const { savedIds, toggleSave } = useSavedRecipes();

  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  useEffect(() => {
    if (!officialRecipes) loadOfficialRecipes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const visible = useMemo(() => {
    if (searchResults) return searchResults;
    return activeSource === "official" ? (officialRecipes || []) : (userRecipes || []);
  }, [activeSource, officialRecipes, userRecipes, searchResults]);

  function handleSourceChange(source) {
    setSource(source);
    if (source === "user") loadUserRecipes();
    if (query.trim()) {
      searchRecipes(query, filters, source);
    } else {
      setSearchResults(null);
    }
  }

  return (
    <div className="max-w-[1200px] mx-auto px-8 py-12 text-[#111]">

      {/* PAGE HEADER */}
      <header className="mb-6 text-left">
        <h1 className="text-[2.5rem] font-bold tracking-[-0.02em] text-black mb-2">Recipes</h1>
        <p className="text-[#666] text-base m-0">Browse, save, and discover your next favorite meal.</p>
      </header>

      {/* TOOLBAR */}
      <RecipeToolbar
        query={query}
        setQuery={setQuery}
        filters={filters}
        setFilters={setFilters}
        activeSource={activeSource}
        onSourceChange={handleSourceChange}
        onSearch={searchRecipes}
        onRefresh={refreshRecipes}
        loading={loading}
      />

      {/* CONTENT */}
      {loading && !visible.length ? (
        <div className="py-20 text-center">
          <ArrowPathIcon className="mx-auto h-8 w-8 animate-spin text-gray-300" />
          <p className="mt-2 text-gray-400">Fetching deliciousness...</p>
        </div>
      ) : visible.length === 0 ? (
        <p className="py-20 text-center text-gray-400">No recipes found matching your search.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((recipe) => (
            <RecipeCardExtended
              key={recipe.id}
              recipe={{ ...recipe, saved: savedIds.has(recipe.id) }}
              onSave={toggleSave}
            />
          ))}
        </div>
      )}
    </div>
  );
}
