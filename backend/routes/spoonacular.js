import express from 'express';
import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';

import db from '../firebase.js';

const router = express.Router();

const normalizeRecipe = (recipe) => ({
  id: recipe.id,
  title: recipe.title,
  image: recipe.image ?? null,
  readyInMinutes: recipe.readyInMinutes ?? recipe.timeMinutes ?? 0,
  servings: recipe.servings ?? 2,
  source: recipe.source ?? 'official',
  rating: recipe.rating ?? 0,
  difficulty: recipe.difficulty ?? 0,
  saved: recipe.saved ?? false,
  savedAt: serverTimestamp(),
});

const getSpoonacularUrl = (path) => {
  if (!process.env.SPOONACULAR_API_KEY) {
    throw new Error('SPOONACULAR_API_KEY is not defined');
  }

  const url = new URL(`https://api.spoonacular.com${path}`);
  url.searchParams.append('apiKey', process.env.SPOONACULAR_API_KEY);

  return url;
};

router.get('/recipes/cached', async (_req, res) => {
  try {
    const recipesQuery = query(
      collection(db, 'recipes'),
      orderBy('savedAt', 'asc'),
    );
    const snapshot = await getDocs(recipesQuery);
    const recipes = snapshot.docs.map((recipeDoc) => recipeDoc.data());

    res.json({ results: recipes });
  } catch (error) {
    console.error('Cache fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch cached recipes' });
  }
});

router.get('/recipes', async (req, res) => {
  const { query: searchQuery = '', maxReadyTime = '', number = 18 } = req.query;

  try {
    const url = getSpoonacularUrl('/recipes/complexSearch');

    if (searchQuery) {
      url.searchParams.append('query', searchQuery);
    }

    url.searchParams.append('number', number);
    url.searchParams.append('addRecipeInformation', 'true');

    if (maxReadyTime) {
      url.searchParams.append('maxReadyTime', maxReadyTime);
    }

    const response = await fetch(url);

    if (!response.ok) {
      const details = await response.text();
      console.error('Spoonacular Error:', details);
      return res.status(response.status).json({
        error: 'Spoonacular request failed',
        details,
      });
    }

    const data = await response.json();

    res.json(data);
  } catch (error) {
    console.error('Recipes Route Error:', error);
    res.status(500).json({
      error: 'Failed to fetch recipes',
      details: error.message,
    });
  }
});

// GET random recipes -- called only when recipes collection is empty
router.get("/recipes/random", async (req, res) => {
  try {
    if (!process.env.SPOONACULAR_API_KEY) {
      return res.status(500).json({ error: "SPOONACULAR_API_KEY is not defined" });
    }

    const url = new URL("https://api.spoonacular.com/recipes/random");
    url.searchParams.append("apiKey", process.env.SPOONACULAR_API_KEY);
    url.searchParams.append("number", 18);
    url.searchParams.append("includeNutrition", "false");

    console.log("Calling Spoonacular:", url.toString());

    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Spoonacular Error:", errorText);
      return res.status(response.status).json({ error: "Spoonacular request failed", details: errorText });
    }

    const data = await response.json();

    // save results to Firestore
    // TODO: define a method for fetching/posting rating and difficulty
    console.log("Saving to Firestore:", data.recipes?.length, "recipes");
    const writes = (data.recipes || []).map((recipe) =>
      setDoc(doc(db, "recipes", String(recipe.id)), {
        id: recipe.id,
        title: recipe.title,
        image: recipe.image ?? null,
        readyInMinutes: recipe.readyInMinutes ?? 0,
        source: "official",
        rating: 0,
        savedAt: serverTimestamp(),
        servings: recipe.servings ?? 0,
        healthScore: recipe.healthScore ?? 0,
      })
    );
    await Promise.all(writes);
    console.log("Random recipes saved:", writes.length);

    res.json({ results: data.recipes });
  } catch (err) {
    console.error("Random recipes error:", err);
    res.status(500).json({ error: "Failed to fetch random recipes", details: err.message });
  }
});

// get specific recipe
router.get('/recipe/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const url = getSpoonacularUrl(`/recipes/${id}/information`);
    url.searchParams.append('includeNutrition', 'false');
    url.searchParams.append('addWinePairing', 'false');
    url.searchParams.append('addTasteData', 'false');

    const response = await fetch(url);

    if (!response.ok) {
      const details = await response.text();
      console.error('Spoonacular Error:', details);
      return res.status(response.status).json({
        error: 'Spoonacular request failed',
        details,
      });
    }

    const data = await response.json();

    await setDoc(doc(db, 'recipes', String(id)), {
      id: data.id,
      title: data.title,
      image: data.image ?? null,
      summary: data.summary,
      servings: data.servings ?? 0,
      healthScore: data.healthScore ?? 0,
      readyInMinutes: data.readyInMinutes ?? 0,
      preparationMinutes: data.preparationMinutes ?? 0,
      cookingMinutes: data.cookingMinutes ?? 0,
      ingredients: (data.extendedIngredients || []).map((ingredient) => ({
        id: ingredient.id,
        name: ingredient.name,
        amount: ingredient.amount,
        unit: ingredient.unit,
      })),
      instructions: (data.analyzedInstructions?.[0]?.steps || []).map((step) => ({
        number: step.number,
        step: step.step,
      })),
      savedAt: serverTimestamp(),
    });

    res.json(data);
  } catch (error) {
    console.error('Recipe Route Error:', error);
    res.status(500).json({
      error: 'Failed to fetch recipe',
      details: error.message,
    });
  }
});

export default router;
