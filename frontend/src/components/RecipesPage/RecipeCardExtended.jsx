import { Link } from "react-router-dom";
import { PhotoIcon, BookmarkIcon as BookmarkOutline } from "@heroicons/react/24/outline";
import { BookmarkIcon as BookmarkSolid } from "@heroicons/react/24/solid";
import StarRating from "./StarRating";
import { getHealthText } from "../../services/healthScore";

const RECIPE_SOURCE = {
  OFFICIAL: "official",
  USER: "user",
};

export default function RecipeCardExtended({ recipe, onSave }) {
  const { id, source, title, image, rating, readyInMinutes, servings, saved, author, healthScore } = recipe;
  const servingLabel = servings === 1 ? "1 serving" : `${servings} servings`;

  return (
    <article className="recipe-card relative">

      {/* IMAGE CONTAINER */}
      <div className="relative w-full aspect-[1.62] overflow-hidden">
        {image ? (
          <img src={image} alt={title} className="w-full h-full object-cover block" />
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
        <div className="absolute bottom-2.5 left-3 bg-black/45 backdrop-blur-sm text-[11px] font-bold tracking-wider uppercase rounded px-2 py-0.5 z-10 text-white">
          {source === RECIPE_SOURCE.OFFICIAL ? "Official" : "Community"}
        </div>
      </div>

      {/* META BAR */}
      <div className="recipe-meta flex items-center gap-2.5">
        {readyInMinutes > 0 && <span>{readyInMinutes} min</span>}
        {servings > 0 && <span>{servingLabel}</span>}
        {healthScore > 0 && <span>{getHealthText(healthScore)}</span>}
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
