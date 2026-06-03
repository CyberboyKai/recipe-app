import HeroSection from '../components/HeroSection.jsx';
import RecipeSection from '../components/RecipeSection.jsx';
import { featuredRecipes } from '../data/recipes.js';
import { heroReviews } from '../data/reviews.js';

const Home = () => {
  return (
    <div className="app-shell">
      <main>
        <HeroSection reviews={heroReviews} />
        <RecipeSection recipes={featuredRecipes} />
      </main>
    </div>
  );
};

export default Home;
