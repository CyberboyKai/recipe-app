import cors from 'cors';
import 'dotenv/config';
import express from 'express';

import adminRoutes from './routes/adminRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import spoonacularRoutes from './routes/spoonacular.js';
import recipesRoutes from './db/recipes.js';

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use('/api', spoonacularRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api', recipesRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
