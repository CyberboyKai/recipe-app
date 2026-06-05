export default function FilterPopover({ filters, onChange, onClose, onSearch }) {
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
        <option value={80}>High Nutrition</option>
        <option value={60}>Good Nutrition</option>
        <option value={40}>Mid Nutrition</option>
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
