import { useEffect, useState } from 'react';

import HeroSection from '../components/HeroSection.jsx';
import RecipeSection from '../components/RecipeSection.jsx';
import { featuredRecipes } from '../data/recipes.js';
import { heroReviews } from '../data/reviews.js';
import { fetchFeaturedRecipes } from '../services/recipeApi.js';

const Home = () => {
  const [recipes, setRecipes] = useState(featuredRecipes);
  const [recipesStatus, setRecipesStatus] = useState('loading');

  useEffect(() => {
    const loadRecipes = async () => {
      try {
        const apiRecipes = await fetchFeaturedRecipes();
        setRecipes(apiRecipes.length > 0 ? apiRecipes : featuredRecipes);
        setRecipesStatus('success');
      } catch {
        setRecipes(featuredRecipes);
        setRecipesStatus('fallback');
      }
    };

    loadRecipes();
  }, []);

  return (
    <div className="app-shell">
      <main>
        <HeroSection reviews={heroReviews} />
        <RecipeSection recipes={recipes} status={recipesStatus} />
      </main>
    </div>
  );
};

export default Home;
