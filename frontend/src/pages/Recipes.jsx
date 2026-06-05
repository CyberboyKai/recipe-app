import { useEffect, useMemo, useState, useRef } from "react";
import { Link } from 'react-router-dom';
import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon, PhotoIcon, BookmarkIcon as BookmarkOutline, ArrowPathIcon } from "@heroicons/react/24/outline";
import { BookmarkIcon as BookmarkSolid } from "@heroicons/react/24/solid";

import { useRecipesData } from "../context/useRecipesData.js";
import { useSavedRecipes } from "../hooks/useSavedRecipes";

const RECIPE_SOURCE = {
  OFFICIAL: "official",
  USER: "user",
};

// STAR RATING
function StarRating({ value, max = 5, compact = false }) {
  if (compact) {
    return `★ ${value}`; 
  }

  return (
    <div style={{ display: "flex", gap: 2, color: "#f59e0b", fontSize: 14 }}>
      {Array.from({ length: max }, (_, i) => (
        <span key={i}>{i < value ? "★" : "☆"}</span>
      ))}
    </div>
  );
}

function getHealthText(score) {
  if (score >= 80) return "Highly nutritious";
  if (score >= 60) return "Well balanced";
  if (score >= 40) return "Moderately balanced";
  return "Less balanced";
}

// RECIPE CARD
function RecipeCard({ recipe, onSave }) {
  const { id, source, title, image, rating, readyInMinutes, servings, saved, author, healthScore } = recipe;
  const servingLabel = servings === 1 ? "1 serving" : `${servings} servings`;

  return (
    <article className="recipe-card relative">

      {/* IMAGE CONTAINER */}
      <div className="relative w-full aspect-[1.62] overflow-hidden">
        {image ? (
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover block"
          />
        ) : (
          <div className="w-full h-full bg-[#f5f0ea] flex items-center justify-center">
            <PhotoIcon className="w-12 h-12 text-[#d1c9be]" />
          </div>
        )}

        {/* BOOKMARK */}
        <button
          onClick={(e) => { e.preventDefault(); onSave(id); }}
          className="absolute right-2.5 top-2.5 bg-white/85 backdrop-blur-md border-none cursor-pointer rounded-lg px-2 py-1.5 flex items-center shadow-[0_1px_4px_rgba(0,0,0,0.12)] z-10"
        >
          {saved
            ? <BookmarkSolid className="h-5 w-5 text-blue-600" />
            : <BookmarkOutline className="h-5 w-5 text-[#555]" />}
        </button>

        {/* SOURCE BADGE */}
        <div className="absolute bottom-2.5 left-3 bg-black/45 backdrop-blur-sm color-white text-[11px] font-bold tracking-wider uppercase rounded px-2 py-0.5 z-10 text-white">
          {source === RECIPE_SOURCE.OFFICIAL ? "Official" : "Community"}
        </div>
      </div>

      {/* META BAR */}
      <div className="recipe-meta flex items-center gap-2.5">
        {readyInMinutes > 0 && <span>{readyInMinutes} min</span>}
        {servings > 0 && <span>{servingLabel}</span>}
        {healthScore > 0 && (
          <span>{getHealthText(healthScore)}</span>
        )}
      </div>

      {/* BODY */}
      <div className="recipe-body flex flex-col">
        <div className="mb-1">
          <h3>
            {title}
            {rating > 0 && (
              <span className="text-[#f59e0b] font-medium text-sm ml-2 whitespace-nowrap inline-block align-middle">
                <StarRating value={rating} compact={true} />
              </span>
            )}
          </h3>
        </div>

        <Link to={`/recipe/${id}`}>View Recipe</Link>

        {author && (
          <div className="text-[11px] text-[#aaa] mt-2 overflow-hidden text-ellipsis whitespace-nowrap">
            by @{author}
          </div>
        )}
      </div>

    </article>
  );
}

// FILTER POPOVER
function FilterPopover({ filters, onChange, onClose, onSearch }) {
  function handleKeyDown(e) {
    if (e.key === "Enter") {
      onSearch();
      onClose();
    }
  }

  function handleReset() {
    onChange({ maxTime: 999, minHealthScore: 0, servings: 0 });
  }

  return (
    <div className="absolute right-0 top-full mt-2 z-50 w-72 rounded-2xl border border-gray-100 bg-white p-4 shadow-xl">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-gray-800">Filter Recipes</span>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg leading-none">✕</button>
      </div>

      {/* Cook Time */}
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
        Max Cook Time (minutes)
      </label>
      <input
        type="number"
        min={1}
        placeholder="e.g. 45"
        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm mb-3"
        value={filters.maxTime === 999 ? "" : filters.maxTime}
        onKeyDown={handleKeyDown}
        onChange={(e) =>
          onChange({ ...filters, maxTime: e.target.value === "" ? 999 : Number(e.target.value) })
        }
      />

      {/* Servings */}
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
        Servings
      </label>
      <input
        type="number"
        min={1}
        placeholder="e.g. 4"
        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm mb-3"
        value={filters.servings === 0 ? "" : filters.servings}
        onKeyDown={handleKeyDown}
        onChange={(e) =>
          onChange({ ...filters, servings: e.target.value === "" ? 0 : Number(e.target.value) })
        }
      />

      {/* Nutrition Level */}
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
        Nutrition Level
      </label>
      <select
        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
        value={filters.minHealthScore}
        onChange={(e) => onChange({ ...filters, minHealthScore: Number(e.target.value) })}
      >
        <option value={0}>Any</option>
        <option value={80}>Highly nutritious (80+)</option>
        <option value={60}>Well balanced (60+)</option>
        <option value={40}>Moderately balanced (40+)</option>
      </select>

      {/* RESET */}
      <button
        onClick={handleReset}
        className="mt-4 w-full rounded-lg border border-gray-200 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors"
      >
        Reset Filters
      </button>
    </div>
  );
}

// MAIN PAGE
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
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    maxTime: 999,
    minHealthScore: 0,
    servings: 0, // 0 = any
  });

  const filterRef = useRef(null);

  useEffect(() => {
    if (!officialRecipes) loadOfficialRecipes();

    function handleClickOutside(e) {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setShowFilters(false);
      }
    }
    if (showFilters) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showFilters]);

  const visible = useMemo(() => {
    if (searchResults) return searchResults;
    return activeSource === "official" ? (officialRecipes || []) : (userRecipes || []);
  }, [activeSource, officialRecipes, userRecipes, searchResults]);

  function handleKeyDown(e) {
    if (e.key === "Enter") searchRecipes(query, filters);
  }

  function handleSourceChange(source) {
    setSource(source);
    if (source === "user") loadUserRecipes(); // always re-fetch on tab switch
    if (query.trim()) {
      searchRecipes(query, filters, source);
    } else {
      setSearchResults(null); // let the toggle show cached data normally
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      
      {/* TOOLBAR: Changed to a responsive grid/flex combo */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        
        <div className="flex flex-1 items-center gap-2">
          {/* REFRESH */}
          <button
            onClick={refreshRecipes}
            disabled={loading}
            title="Refresh recipes"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm hover:bg-gray-100 disabled:opacity-50 sm:w-auto sm:px-4 sm:gap-2"
          >
            <ArrowPathIcon className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
            <span title="Discover new recipes" className="hidden sm:inline text-sm font-medium">Discover</span>
          </button>

          {/* SEARCH BAR + FILTER POPOVER */}
          <div className="relative flex flex-1 items-center">
            <MagnifyingGlassIcon className="absolute left-3.5 h-5 w-5 text-gray-400" />

            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search recipes..."
              className="w-full rounded-full border border-gray-200 py-2.5 pl-11 pr-12 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* CLEAR BUTTON */}
            {query && (
              <button
                onClick={() => { setQuery(""); setFilters({ maxTime: 999, minHealthScore: 0, servings: 0 }); }}
                className="absolute right-10 text-gray-400 hover:text-gray-600 mr-2"
              >
                ✕
              </button>
            )}

            {/* FILTER TOGGLE */}
            <div className="absolute right-2" ref={filterRef}>
              <button
                onClick={() => setShowFilters((v) => !v)}
                className={`p-1.5 rounded-full transition-colors ${
                  showFilters ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:bg-gray-100'
                }`}
              >
                <AdjustmentsHorizontalIcon className="h-5 w-5" />
              </button>

              {showFilters && (
                <FilterPopover
                  filters={filters}
                  onChange={setFilters}
                  onClose={() => setShowFilters(false)}
                  onSearch={() => searchRecipes(query, filters)}
                />
              )}
            </div>
          </div>
        </div>

        {/* TOGGLE: Full width on mobile, auto width on desktop */}
        <div className="flex rounded-full bg-gray-100 p-1 text-sm sm:w-auto">
          <button
            onClick={() => handleSourceChange("official")}
            className={`flex-1 rounded-full px-6 py-1.5 transition sm:flex-none ${
              activeSource === "official" ? "bg-white shadow font-medium" : "text-gray-500"
            }`}
          >
            Official
          </button>
          <button
            onClick={() => handleSourceChange("user")}
            className={`flex-1 rounded-full px-6 py-1.5 transition sm:flex-none ${
              activeSource === "user" ? "bg-white shadow font-medium" : "text-gray-500"
            }`}
          >
            Community
          </button>
        </div>
      </div>

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
            <RecipeCard
              key={recipe.id}
              recipe={{...recipe, saved: savedIds.has(recipe.id)}}
              onSave={toggleSave}
            />
          ))}
        </div>
      )}
    </div>
  );
}
