import { Link } from 'react-router-dom';

const RecipeCard = ({ recipe }) => {
  return (
    <article className="recipe-card">
      <img src={recipe.image} alt={recipe.title} />
      <div className="recipe-meta">
        <span>{recipe.time}</span>
        <span>{recipe.servings}</span>
        <span>{recipe.level}</span>
      </div>
      <div className="recipe-body">
        <h3>{recipe.title}</h3>
        <Link to="#">View Recipe</Link>
      </div>
    </article>
  );
};

export default RecipeCard;
