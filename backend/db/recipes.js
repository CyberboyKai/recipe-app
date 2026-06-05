import express from "express";
import db from "../firebase.js";
import { collection, doc, setDoc, getDocs, deleteDoc, orderBy, query, where, serverTimestamp } from "firebase/firestore";

const router = express.Router();

// GET USER generated recipes
router.get("/recipes/users", async (req, res) => {
  try {
    const q = query(
      collection(db, "recipes"),
      where("source", "==", "user"),
      // orderBy("savedAt", "asc"),
    );

    const snapshot = await getDocs(q);
    const recipes = snapshot.docs.map(doc => doc.data());

    res.json({ results: recipes });
  } catch (err) {
    console.error("User generated recipes fetch error:", err);
    res.status(500).json({ error: "Failed to fetch user generated recipes" });
  }
});

// GET cached recipes (official recipes only)
router.get("/recipes/cached", async (req, res) => {
  try {
    const q = query(
      collection(db, "recipes"),
      where("source", "==", "official"),
      orderBy("savedAt", "desc")
    );

    const snapshot = await getDocs(q);

    let recipes = snapshot.docs.map(d => ({
      id: d.id,
      ...d.data(),
    }));

    // ONLY RUNS WHEN DB IS EMPTY
    if (recipes.length === 0) {
      console.log("Cache empty: fetching from Spoonacular");

      const url = new URL("https://api.spoonacular.com/recipes/random");
      url.searchParams.append("apiKey", process.env.SPOONACULAR_API_KEY);
      url.searchParams.append("number", 18);

      const response = await fetch(url);
      const data = await response.json();

      const writes = (data.recipes || []).map(recipe =>
        setDoc(doc(db, "recipes", String(recipe.id)), {
          id: recipe.id,
          title: recipe.title,
          image: recipe.image ?? null,
          readyInMinutes: recipe.readyInMinutes ?? 0,
          source: "official",
          rating: 0,
          servings: recipe.servings ?? 0,
          healthScore: recipe.healthScore ?? 0,
          savedAt: serverTimestamp(),
        })
      );

      await Promise.all(writes);

      // re-fetch after fetching
      const seededSnapshot = await getDocs(q);
      recipes = seededSnapshot.docs.map(d => ({
        id: d.id,
        ...d.data(),
      }));
    }

    res.json({ results: recipes });
  } catch (err) {
    console.error("Cache fetch error:", err);
    res.status(500).json({ error: "Failed to fetch cached recipes" });
  }
});

export default router;
