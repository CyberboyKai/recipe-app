import express from 'express';
import { db } from '../db/firebaseConfig.js';
import { collection, query, where, getDocs } from 'firebase/firestore';

const router = express.Router();

router.get('/pending', async (req, res) => {
  try {
    const recipesRef = collection(db, 'Created recipes');
    const q = query(recipesRef, where('Published', '==', false));
    const querySnapshot = await getDocs(q);
    res.json([
      { id: '1', title: 'Spicy Garlic Noodles', author: 'User123', status: 'pending' },
      { id: '2', title: 'Vegan Brownies', author: 'BakingFan', status: 'pending' }
    ]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch pending recipes' });
  }
});

router.put('/approve/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // TODO: Write Firestore query to update the document with this ID to status: 'approved'
    res.json({ message: `Recipe ${id} approved successfully!` });
  } catch (error) {
    res.status(500).json({ error: 'Failed to approve recipe' });
  }
});

export default router;