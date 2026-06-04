const getRecipeUrl = (recipe) => {
  if (!Number.isFinite(Number(recipe.id))) {
    return '/recipes';
  }

  const slug = recipe.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  return `https://spoonacular.com/recipes/${slug}-${recipe.id}`;
};

const formatRecipe = (recipe) => ({
  href: getRecipeUrl(recipe),
  id: recipe.id,
  title: recipe.title,
  time: `${recipe.timeMinutes ?? recipe.readyInMinutes ?? 0} Mins`,
  servings: `${recipe.servings ?? 2} Serving`,
  level: recipe.difficulty ? `Level ${recipe.difficulty}` : 'Easy',
  image: recipe.image,
});

export const fetchFeaturedRecipes = async () => {
  let response = await fetch('/api/recipes/cached');

  if (!response.ok) {
    throw new Error('Unable to load cached recipes');
  }

  let data = await response.json();
  let recipes = data.results || [];

  if (recipes.length === 0) {
    response = await fetch('/api/recipes/random');

    if (!response.ok) {
      throw new Error('Unable to load Spoonacular recipes');
    }

    data = await response.json();
    recipes = data.results || [];
  }

  return recipes.slice(0, 6).map(formatRecipe);
};
