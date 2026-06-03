import express from 'express';
import { db } from '../db/firebaseConfig.js';
import { collection, query, where, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';

const router = express.Router();

router.get('/pending', async (req, res) => {
  try {
    const recipesRef = collection(db, 'Created recipes');
    const q = query(recipesRef, where('Published', '==', false));
    const querySnapshot = await getDocs(q);
    
    const pendingRecipes = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json(pendingRecipes);
  } catch (error) {
    console.error("Error fetching pending recipes:", error);
    res.status(500).json({ error: 'Failed to fetch pending recipes' });
  }
});

router.put('/approve/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const recipeDoc = doc(db, 'Created recipes', id);
    await updateDoc(recipeDoc, { Published: true });
    res.json({ message: `Recipe ${id} approved successfully!` });
  } catch (error) {
    console.error(`Error approving recipe ${id}:`, error);
    res.status(500).json({ error: 'Failed to approve recipe' });
  }
});

router.delete('/reject/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const recipeDoc = doc(db, 'Created recipes', id);
    await deleteDoc(recipeDoc);
    res.json({ message: `Recipe ${id} rejected and deleted.` });
  } catch (error) {
    console.error(`Error rejecting recipe ${id}:`, error);
    res.status(500).json({ error: 'Failed to reject recipe' });
  }
});

export default router;