import express from 'express';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.post('/', async (req, res) => {
  try {
    const { messages } = req.body;
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
    });
    res.json(completion.choices[0].message);
  } catch (error) {
    console.error("OpenAI Error:", error);
    res.status(500).json({ error: "Failed to fetch AI response" });
  }
});

export default router;