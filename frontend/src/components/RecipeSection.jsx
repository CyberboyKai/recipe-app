import { Link } from 'react-router-dom';

import RecipeCard from './RecipeCard.jsx';

const RecipeSection = ({ recipes, status }) => {
  return (
    <section className="recipes-section" aria-labelledby="recipes-title">
      <div className="section-heading">
        <div>
          <h2 id="recipes-title">Discover, Create, Share</h2>
          <p>
            {status === 'fallback'
              ? 'Showing saved picks while recipes load'
              : 'Check our most popular recipes of this week'}
          </p>
        </div>
        <Link className="button primary compact" to="#">
          See All
        </Link>
      </div>

      {status === 'loading' && (
        <p className="recipes-status">Loading recipes...</p>
      )}

      <div className="recipe-grid">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.title} recipe={recipe} />
        ))}
      </div>
    </section>
  );
};

export default RecipeSection;
