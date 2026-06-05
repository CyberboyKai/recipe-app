import express from "express";
import db from "../firebase.js";
import { collection, addDoc, getDocs, getDoc, doc, updateDoc, setDoc, serverTimestamp, arrayUnion, arrayRemove } from "firebase/firestore";

const router = express.Router();

router.get("/recipes/:recipeId/comments", async (req, res) => {
  try {
    const { recipeId } = req.params;
    const commentsSnapshot = await getDocs(collection(db, "recipes", recipeId, "comments"));
    const comments = commentsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        date: data.date?.toDate?.().toISOString() || data.date
      };
    });
    res.json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to fetch comments"
    });
  }
});

router.post("/recipes/:recipeId/comments", async (req, res) => {
  try {
    const { recipeId } = req.params;

    const {
      userId,
      displayName,
      content
    } = req.body;

    const docRef = await addDoc(
      collection(db, "recipes", recipeId, "comments"),
      {
        userId,
        displayName,
        content,
        date: new Date().toISOString(),
        likes: [],
        replies: []
      }
    );

    res.status(201).json({
      id: docRef.id
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Failed to create comment"
    });
  }
});

router.post("/recipes/:recipeId/comments/:commentId/replies", async (req, res) => {
    try {
      const { recipeId, commentId } = req.params;
      const { userId, displayName, content } = req.body;
      const commentRef = doc(db, "recipes", recipeId, "comments", commentId);
      await updateDoc(commentRef, {
        replies: arrayUnion({
          id: crypto.randomUUID(),
          userId,
          displayName,
          content,
          date: new Date().toISOString()
        })
      });

      res.status(201).json({
        success: true
      });

    } catch (err) {
      console.error(err);

      res.status(500).json({
        error: "Failed to create reply"
      });
    }
  }
);

router.patch("/recipes/:recipeId/comments/:commentId/like", async (req, res) => {
    try {
      const { recipeId, commentId } = req.params;
      const { userId } = req.body;
      const commentRef = doc(db, "recipes", recipeId, "comments", commentId);
      const snap = await getDoc(commentRef);
      const likes = snap.data()?.likes || [];
      const alreadyLiked =
        likes.includes(userId);

      if (alreadyLiked) {
        await updateDoc(commentRef, {
          likes: arrayRemove(userId)
        });
      } else {
        await updateDoc(commentRef, {
          likes: arrayUnion(userId)
        });
      }

      res.json({
        liked: !alreadyLiked
      });

    } catch (err) {
      console.error(err);

      res.status(500).json({
        error: "Failed to update like"
      });
    }
  }
);

// GET /api/recipes/:recipeId/reviews
router.get("/recipes/:recipeId/reviews", async (req, res) => {
  try {
    const { recipeId } = req.params;

    const reviewsRef = collection(db, "recipes", recipeId, "reviews");
    const snapshot = await getDocs(reviewsRef);

    const reviews = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/recipes/:recipeId/reviews
router.post("/recipes/:recipeId/reviews", async (req, res) => {
  try {
    const { recipeId } = req.params;
    const { userId, displayName, rating, text } = req.body;

    const reviewRef = doc(db, "recipes", recipeId, "reviews", userId);

    await setDoc(reviewRef, {
      displayName,
      rating,
      text,
      date: new Date().toISOString()
    });

    res.status(201).json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create review" });
  }
});

export default router;
