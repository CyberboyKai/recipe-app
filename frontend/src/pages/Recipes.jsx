import { useState } from "react";
import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon, PhotoIcon, BookmarkIcon as BookmarkOutline } from "@heroicons/react/24/outline";
import { BookmarkIcon as BookmarkSolid } from "@heroicons/react/24/solid";

const RECIPE_SOURCE = {
  OFFICIAL: "official",
  USER: "user",
};

const MOCK_OFFICIAL_RECIPES = [
  {
    id: "sp_1",
    source: RECIPE_SOURCE.OFFICIAL,
    title: "Vodka Pasta",
    image: null,
    rating: 4,
    difficulty: 2,
    timeMinutes: 30,
    saved: false,
  },
  {
    id: "sp_2",
    source: RECIPE_SOURCE.OFFICIAL,
    title: "Egg Rolls",
    image: null,
    rating: 5,
    difficulty: 3,
    timeMinutes: 45,
    saved: true,
  },
  {
    id: "sp_3",
    source: RECIPE_SOURCE.OFFICIAL,
    title: "Avocado Toast",
    image: null,
    rating: 3,
    difficulty: 1,
    timeMinutes: 10,
    saved: false,
  },
];

const MOCK_USER_RECIPES = [
  {
    id: "fs_1",
    source: RECIPE_SOURCE.USER,
    title: "Grandma's Chili",
    image: null,
    rating: 5,
    difficulty: 2,
    timeMinutes: 60,
    saved: false,
    author: "jane_doe",
  },
  {
    id: "fs_2",
    source: RECIPE_SOURCE.USER,
    title: "Quick Stir Fry",
    image: null,
    rating: 4,
    difficulty: 1,
    timeMinutes: 20,
    saved: false,
    author: "cook_123",
  },
  {
    id: "fs_3",
    source: RECIPE_SOURCE.USER,
    title: "Sourdough Bread",
    image: null,
    rating: 4,
    difficulty: 4,
    timeMinutes: 180,
    saved: true,
    author: "bread_lover",
  },
];

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
  const { id, source, title, image, rating, difficulty, timeMinutes, saved, author } = recipe;

  return (
    <div className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      {/* IMAGE */}
      <div className="relative h-48 bg-gray-100 flex items-center justify-center">
        {image ? (
          <img src={image} alt={title} className="h-full w-full object-cover" />
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
          {timeMinutes} min
        </div>

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
  const [activeSource, setActiveSource] = useState(RECIPE_SOURCE.OFFICIAL);
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState({
    maxTime: 999,
    maxDifficulty: 5,
  });

  const [showFilters, setShowFilters] = useState(false);
  const [recipes, setRecipes] = useState(MOCK_OFFICIAL_RECIPES);

  // TODO: save in firebase
  function handleSave(id) {
    setRecipes((prev) =>
      prev.map((r) => (r.id === id ? { ...r, saved: !r.saved } : r))
    );
  }

  function handleSourceChange(source) {
    setActiveSource(source);

    setRecipes(
      source === RECIPE_SOURCE.OFFICIAL
        ? MOCK_OFFICIAL_RECIPES
        : MOCK_USER_RECIPES
    );
  }

  const visible = recipes.filter(
    (r) =>
      r.title.toLowerCase().includes(query.toLowerCase()) &&
      r.timeMinutes <= filters.maxTime &&
      r.difficulty <= filters.maxDifficulty
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      {/* TOOLBAR */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        {/* FILTER BUTTON */}
        <button
          onClick={() => setShowFilters((v) => !v)}
          className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm shadow-sm hover:bg-gray-50"
        >
          <AdjustmentsHorizontalIcon className="h-5 w-5" />
          Filters
        </button>

        {/* SEARCH */}
        <div className="relative flex-1 min-w-[220px]">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search recipes..."
            className="w-full rounded-full border border-gray-200 py-2.5 pl-10 pr-4 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* TOGGLE */}
        <div className="ml-auto flex rounded-full bg-gray-100 p-1 text-sm">
          <button
            onClick={() => handleSourceChange(RECIPE_SOURCE.OFFICIAL)}
            className={`rounded-full px-4 py-1 transition ${
              activeSource === RECIPE_SOURCE.OFFICIAL
                ? "bg-white shadow"
                : "text-gray-500"
            }`}
          >
            Official
          </button>

          <button
            onClick={() => handleSourceChange(RECIPE_SOURCE.USER)}
            className={`rounded-full px-4 py-1 transition ${
              activeSource === RECIPE_SOURCE.USER
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
      {visible.length === 0 ? (
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
