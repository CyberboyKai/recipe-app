import { useRef, useState } from "react";
import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import FilterPopover from "./FilterPopover";

const DEFAULT_FILTERS = { maxTime: 999, minHealthScore: 0, servings: 0 };

export default function RecipeToolbar({
  query,
  setQuery,
  filters,
  setFilters,
  activeSource,
  onSourceChange,
  onSearch,
  onRefresh,
  loading,
}) {
  const [showFilters, setShowFilters] = useState(false);
  const filterRef = useRef(null);

  function handleKeyDown(e) {
    if (e.key === "Enter") onSearch(query, filters);
  }

  function handleClear() {
    setQuery("");
    setFilters(DEFAULT_FILTERS);
  }

  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">

      <div className="flex flex-1 items-center gap-2">
        {/* REFRESH */}
        <button
          onClick={onRefresh}
          disabled={loading}
          title="Refresh recipes"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm hover:bg-gray-100 disabled:opacity-50 sm:w-auto sm:px-4 sm:gap-2"
        >
          <ArrowPathIcon className={`h-5 w-5 ${loading ? "animate-spin" : ""}`} />
          <span className="hidden sm:inline text-sm font-medium">Discover</span>
        </button>

        {/* SEARCH BAR */}
        <div className="relative flex flex-1 items-center">
          <MagnifyingGlassIcon className="absolute left-3.5 h-5 w-5 text-gray-400" />

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search recipes..."
            className="w-full rounded-full border border-gray-200 py-2.5 pl-11 pr-12 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* CLEAR */}
          {query && (
            <button
              onClick={handleClear}
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
                showFilters ? "bg-blue-100 text-blue-600" : "text-gray-400 hover:bg-gray-100"
              }`}
            >
              <AdjustmentsHorizontalIcon className="h-5 w-5" />
            </button>

            {showFilters && (
              <FilterPopover
                filters={filters}
                onChange={setFilters}
                onClose={() => setShowFilters(false)}
                onSearch={() => onSearch(query, filters)}
              />
            )}
          </div>
        </div>
      </div>

      {/* SOURCE TOGGLE */}
      <div className="flex rounded-full bg-gray-100 p-1 text-sm sm:w-auto">
        <button
          onClick={() => onSourceChange("official")}
          className={`flex-1 rounded-full px-6 py-1.5 transition sm:flex-none ${
            activeSource === "official" ? "bg-white shadow font-medium" : "text-gray-500"
          }`}
        >
          Official
        </button>
        <button
          onClick={() => onSourceChange("user")}
          className={`flex-1 rounded-full px-6 py-1.5 transition sm:flex-none ${
            activeSource === "user" ? "bg-white shadow font-medium" : "text-gray-500"
          }`}
        >
          Community
        </button>
      </div>
    </div>
  );
}
