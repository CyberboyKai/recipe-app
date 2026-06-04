import express from 'express';
import { db } from '../db/firebaseConfig.js';
import { collection, query, where, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';

import admin from 'firebase-admin'; 

const router = express.Router();

const verifyAdmin = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split('Bearer ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    if (decodedToken.admin === true) {
      req.user = decodedToken;
      next(); 
    } else {
      return res.status(403).json({ error: 'Forbidden: Admin access required' });
    }
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

router.get('/pending', verifyAdmin, async (req, res) => {
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

router.put('/approve/:id', verifyAdmin, async (req, res) => {
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

router.delete('/reject/:id', verifyAdmin, async (req, res) => {
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