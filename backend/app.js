import cors from 'cors';
import 'dotenv/config';
import express from 'express';

import adminRoutes from './routes/adminRoutes.js';
import chatRoutes from './routes/chatRoutes.js';

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/admin', adminRoutes);
app.use('/api/chat', chatRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});