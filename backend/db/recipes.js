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
      // orderBy("savedAt", "asc"),
    );

    const snapshot = await getDocs(q);
    const recipes = snapshot.docs.map(doc => doc.data());

    res.json({ results: recipes });
  } catch (err) {
    console.error("Cache fetch error:", err);
    res.status(500).json({ error: "Failed to fetch cached recipes" });
  }
});

export default router;
