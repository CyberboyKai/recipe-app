import express from 'express';
import {
  collection,
  doc,
  getDoc, getDocs,
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
  healthScore: recipe.healthScore ?? 0,
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
router.get('/recipe/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const recipeRef = doc(db, "recipes", String(id));
    const recipeSnap = await getDoc(recipeRef);

    let cachedRecipe = null;

    if (recipeSnap.exists()) {
      cachedRecipe = recipeSnap.data();
    }

    // user-created recipe 
    if (cachedRecipe?.source === "user") {
      console.log(`Serving USER recipe ${id} from Firestore`);

      return res.json({
        ...cachedRecipe,

        // normalize fields so frontend stays consistent
        summary: cachedRecipe.description ?? "",
        preparationMinutes: cachedRecipe.prepTime ?? 0,
        cookingMinutes: cachedRecipe.cookTime ?? 0,
        instructions: (cachedRecipe.instructions || []).map(
          (instruction, index) => ({
            number: index + 1,
            step: instruction,
          })
        ),
        ingredients: cachedRecipe.ingredients ?? [],
      });
    }

    // offcial recipe fetched (or cache fallback)
    if (cachedRecipe?.source === "official" && cachedRecipe?.ingredients?.length) {
      console.log(`Serving OFFICIAL recipe ${id} from Firestore cache`);
      return res.json(cachedRecipe);
    }

    // Otherwise fetch from API
    if (!process.env.SPOONACULAR_API_KEY) {
      return res.status(500).json({ error: "SPOONACULAR_API_KEY is not defined" });
    }

    const url = new URL(`https://api.spoonacular.com/recipes/${id}/information`);
    url.searchParams.append("apiKey", process.env.SPOONACULAR_API_KEY);
    url.searchParams.append("includeNutrition", "false");
    url.searchParams.append("addWinePairing", "false");
    url.searchParams.append("addTasteData", "false");

    const response = await fetch(url);

    if (!response.ok) {
      const details = await response.text();
      return res.status(response.status).json({
        error: "Spoonacular request failed",
        details,
      });
    }

    const data = await response.json();

    // normalize Spoonacular
    const recipeData = {
      id: data.id,
      source: "official",

      title: data.title,
      image: data.image ?? null,
      summary: data.summary,

      servings: data.servings ?? 0,
      healthScore: data.healthScore ?? 0,

      readyInMinutes: data.readyInMinutes ?? 0,
      preparationMinutes: data.preparationMinutes ?? 0,
      cookingMinutes: data.cookingMinutes ?? 0,

      author: data.sourceName ?? null,
      url: data.sourceUrl ?? null,

      ingredients: (data.extendedIngredients || []).map(ing => ({
        id: ing.id,
        name: ing.name,
        amount: ing.amount,
        unit: ing.unit,
      })),

      instructions: (data.analyzedInstructions?.[0]?.steps || []).map(step => ({
        number: step.number,
        step: step.step,
      })),
    };

    // cache/update Firestore
    await setDoc(recipeRef, recipeData, { merge: true });

    return res.json(recipeData);

  } catch (err) {
    console.error("Recipe Route Error:", err);
    res.status(500).json({
      error: "Failed to fetch recipe",
      details: err.message,
    });
  }
});

export default router;