import { useEffect, useMemo, useState } from "react";
import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon, PhotoIcon, BookmarkIcon as BookmarkOutline } from "@heroicons/react/24/outline";
import { BookmarkIcon as BookmarkSolid } from "@heroicons/react/24/solid";

import { useRecipesData } from "../context/useRecipesData.js";

const RECIPE_SOURCE = {
  OFFICIAL: "official",
  USER: "user",
};

// STAR RATING
function StarRating({ value, max = 5 }) {
  return (
    <div className="flex text-yellow-500 text-sm">
      {Array.from({ length: max }, (_, i) => (
        <span key={i}>{i < value ? "★" : "☆"}</span>
      ))}
    </div>
  );
}

// RECIPE CARD
function RecipeCard({ recipe, onSave }) {
  const { id, source, title, image, rating, difficulty, readyInMinutes, saved, author } = recipe;

  return (
    <div className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      {/* IMAGE */}
      <div className="relative h-48 bg-gray-100 flex items-center justify-center">
        {image ? (
          <div className="relative h-full w-full">
            <img src={image} alt={title} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/10 to-transparent" />
          </div>
        ) : (
          <PhotoIcon className="h-14 w-14 text-gray-300" />
        )}

        {/* SAVE BUTTON */}
        <button
          onClick={(e) => {
            e.preventDefault();
            onSave(id);
          }}
          className="absolute right-3 top-3 rounded-full bg-white/90 p-2 shadow hover:bg-white transition"
        >
          {saved ? (
            <BookmarkSolid className="h-5 w-5 text-blue-600" />
          ) : (
            <BookmarkOutline className="h-5 w-5 text-gray-600" />
          )}
        </button>

        {/* BADGE */}
        <div
          className={`absolute left-3 top-3 rounded-full px-2 py-1 text-xs font-semibold text-white ${
            source === RECIPE_SOURCE.OFFICIAL ? "bg-blue-500" : "bg-emerald-500"
          }`}
        >
          {source === RECIPE_SOURCE.OFFICIAL ? "Official" : "Community"}
        </div>
      </div>

      {/* BODY */}
      <div className="p-4">
        <a
          href={`/recipe/${id}`}
          className="block text-lg font-semibold text-gray-900 hover:text-blue-600"
        >
          {title}
        </a>

        <div className="mt-2 flex items-center gap-1 text-sm text-gray-600">
          <span>Rating: </span>
          <StarRating value={rating} />
        </div>

        <div className="flex items-center gap-1 text-sm text-gray-600">
          <span>Difficulty: </span>
          <StarRating value={difficulty} />
        </div>

        <div className="flex items-center gap-1 text-sm text-gray-600">
          <span>Time: </span>
          {readyInMinutes} min
        </div>

        {/* FOR USER GENERATOR RECIPES */}
        {author && (
          <div className="mt-1 text-xs text-gray-400">by @{author}</div>
        )}
      </div>
    </div>
  );
}

// FILTER BAR
function FilterBar({ filters, onChange }) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="text-sm font-semibold text-gray-700">Max Time</div>
      <select
        className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
        value={filters.maxTime}
        onChange={(e) =>
          onChange({ ...filters, maxTime: Number(e.target.value) })
        }
      >
        <option value={999}>Any</option>
        <option value={15}>Under 15 min</option>
        <option value={30}>Under 30 min</option>
        <option value={60}>Under 60 min</option>
      </select>

      <div className="text-sm font-semibold text-gray-700">Difficulty</div>
      <select
        className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
        value={filters.maxDifficulty}
        onChange={(e) =>
          onChange({ ...filters, maxDifficulty: Number(e.target.value) })
        }
      >
        <option value={5}>Any</option>
        <option value={1}>★</option>
        <option value={2}>★★</option>
        <option value={3}>★★★</option>
        <option value={4}>★★★★</option>
      </select>
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
  } = useRecipesData();

  const [query, setQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    maxTime: 999,
    maxDifficulty: 5,
  });

  useEffect(() => {
    loadOfficialRecipes();
    loadUserRecipes();
  }, []);

  const visible = useMemo(() => {
    if (searchResults) return searchResults;

    if (activeSource === RECIPE_SOURCE.OFFICIAL) {
      return officialRecipes || [];
    }
    // else return the userRecipes
    return userRecipes || [];
  }, [activeSource, officialRecipes, userRecipes, searchResults]);

  // search when the enter key is hit to avoid repeat API calls
  function handleKeyDown(e) {
    if (e.key === "Enter") {
      searchRecipes(query, filters);
    }
  }

  // TODO: save recipe in firebase for logged in user
  function handleSave(id) {
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      {/* TOOLBAR */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        {/* FILTER BUTTON */}
        <button
          onClick={() => setShowFilters((v) => !v)}
          className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm shadow-sm hover:bg-gray-100"
        >
          <AdjustmentsHorizontalIcon className="h-5 w-5" />
          Filters
        </button>

        {/* SEARCH */}   
        <div className="relative flex flex-1 min-w-[220px] items-center">
          <button
            onClick={() => searchRecipes(query, filters)}
            className="absolute left-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
          >
            <MagnifyingGlassIcon className="h-5 w-5" />
          </button>

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search recipes..."
            className="w-full rounded-full border border-gray-200 py-2.5 pl-10 pr-4 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* TOGGLE */}
        <div className="ml-auto flex rounded-full bg-gray-100 p-1 text-sm">
          <button
            onClick={() => setSource("official")}
            className={`rounded-full px-4 py-1 transition ${
              activeSource === "official"
                ? "bg-white shadow"
                : "text-gray-500"
            }`}
          >
            Official
          </button>

          <button
            onClick={() => setSource("user")}
            className={`rounded-full px-4 py-1 transition ${
              activeSource === "user"
                ? "bg-white shadow"
                : "text-gray-500"
            }`}
          >
            Community
          </button>
        </div>
      </div>

      {/* FILTERS */}
      {showFilters && <FilterBar filters={filters} onChange={setFilters} />}

      {/* CONTENT */}
      {loading || visible === null ? (
        <p className="text-center text-gray-400">Loading recipes...</p>
      ) : visible.length === 0 ? (
        <p className="text-center text-gray-400">No recipes found.</p>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onSave={handleSave}
            />
          ))}
        </div>
      )}
    </div>
  );
}
