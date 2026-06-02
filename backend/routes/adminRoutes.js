import express from 'express';


const router = express.Router();

router.get('/pending', async (req, res) => {
  try {
    // TODO: Write Firestore query here to get recipes where status is "pending"
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