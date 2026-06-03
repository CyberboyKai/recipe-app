import express from "express";
import db from "../firebase.js";
import { collection, doc, setDoc, getDocs, deleteDoc, orderBy, query, limit, serverTimestamp } from "firebase/firestore";

const router = express.Router();

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

    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Spoonacular Error:", errorText);
      return res.status(response.status).json({ error: "Spoonacular request failed", details: errorText });
    }

    const data = await response.json();

    // save results to Firestore
    // TODO: define a method for fetching/posting rating and difficulty
    console.log("Saving to Firestore:", data.results?.length, "recipes");
    const writes = (data.recipes || []).map((recipe) =>
      setDoc(doc(db, "recipes", String(recipe.id)), {
        id: recipe.id,
        title: recipe.title,
        image: recipe.image ?? null,
        timeMinutes: recipe.readyInMinutes ?? 0,
        source: "official",
        rating: 0,
        difficulty: 0,
        saved: false,
        savedAt: serverTimestamp(),
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

// load cached recipes
router.get("/recipes/cached", async (req, res) => {
  try {
    const q = query(
      collection(db, "recipes"),
      orderBy("savedAt", "asc"),
    );

    const snapshot = await getDocs(q);
    const recipes = snapshot.docs.map(doc => doc.data());

    res.json({ results: recipes });
  } catch (err) {
    console.error("Cache fetch error:", err);
    res.status(500).json({ error: "Failed to fetch cached recipes" });
  }
});

// search recipes
router.get("/recipes", async (req, res) => {
  const { query: searchQuery = "", maxReadyTime = "", number = 18 } = req.query;

  try {
    if (!process.env.SPOONACULAR_API_KEY) {
      return res.status(500).json({ error: "SPOONACULAR_API_KEY is not defined" });
    }

    const url = new URL("https://api.spoonacular.com/recipes/complexSearch");
    url.searchParams.append("apiKey", process.env.SPOONACULAR_API_KEY);
    if (searchQuery) url.searchParams.append("query", searchQuery);
    url.searchParams.append("number", number);
    // matchReadyTime: The maximum time in minutes it should take to prepare AND cook the recipe.
    if (maxReadyTime) url.searchParams.append("maxReadyTime", maxReadyTime);
    // addRecipeInformation needs to be set to true to fetch maxReadyTime
    url.searchParams.append("addRecipeInformation", "true");

    console.log("Calling Spoonacular:", url.toString());

    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Spoonacular Error:", errorText);
      return res.status(response.status).json({ error: "Spoonacular request failed", details: errorText });
    }

    const data = await response.json();

    res.json(data);
  } catch (err) {
    console.error("Recipes Route Error:", err);
    res.status(500).json({ error: "Failed to fetch recipes", details: err.message });
  }
});

// get specific recipe
router.get("/recipe/:id", async (req, res) => {
  const { id } = req.params;

  try {
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
      const errorText = await response.text();
      console.error("Spoonacular Error:", errorText);
      return res.status(response.status).json({ error: "Spoonacular request failed", details: errorText });
    }

    const data = await response.json();

    // save full detail to Firestore so repeat visits to the ID are free
    await setDoc(doc(db, "recipes", String(id)), {
      id: data.id,
      title: data.title,
      image: data.image ?? null,
      summary: data.summary,
      servings: data.servings ?? 0,
      readyInMinutes: data.readyInMinutes ?? 0,
      preparationMinutes: data.preparationMinutes ?? 0,
      cookingMinutes: data.cookingMinutes ?? 0,
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
      savedAt: serverTimestamp(),
    });

    res.json(data);
  } catch (err) {
    console.error("Recipe Route Error:", err);
    res.status(500).json({ error: "Failed to fetch recipe", details: err.message });
  }
});

export default router;
