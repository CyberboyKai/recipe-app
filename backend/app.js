import cors from 'cors';
import 'dotenv/config';
import express from 'express';

import spoonacularRoutes from "./routes/spoonacular.js";
import adminRoutes from './routes/adminRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import recipesRoutes from "./db/recipes.js";
import recipeDetailRoutes from "./routes/recipes.js"

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api", spoonacularRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/chat', chatRoutes);
app.use("/api", recipesRoutes);
app.use("/api", recipeDetailRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
