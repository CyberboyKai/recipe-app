import { Link } from 'react-router-dom';

const RecipeCard = ({ recipe }) => {
  const recipeHref = recipe.href || '/recipes';
  const isExternalLink = recipeHref.startsWith('http');

  return (
    <article className="recipe-card">
      <img src={recipe.image} alt={recipe.title} />
      <div className="recipe-meta">
        <span>{recipe.time}</span>
        <span>{recipe.servings}</span>
        <span>{recipe.healthScore}</span>
      </div>
      <div className="recipe-body">
        <h3>{recipe.title}</h3>
        {isExternalLink ? (
          <a href={recipeHref} rel="noreferrer" target="_blank">
            View Recipe
          </a>
        ) : (
          <Link to={recipeHref}>View Recipe</Link>
        )}
      </div>
    </article>
  );
};

export default RecipeCard;
