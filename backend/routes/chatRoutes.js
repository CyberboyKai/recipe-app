import express from 'express';
import OpenAI from 'openai';
import 'dotenv/config';

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, 
});

router.post('/', async (req, res) => {
  try {
    const { messages = [], recipes } = req.body ?? {};

    const safeMessages = Array.isArray(messages) ? messages : [];
    const recipeArray = Array.isArray(recipes?.results)
      ? recipes.results
      : Array.isArray(recipes)
        ? recipes
        : [];

    const slimRecipes = recipeArray.map((recipe) => ({
      title: recipe.title,
      summary: recipe.summary,
      ingredients: recipe.ingredients,
      instructions: recipe.instructions
    }));

    const systemPrompt = {
      role: "system",
      content: `You are a helpful culinary assistant for RecipeApp. 
      The following recipes are pulled directly from the Spoonacular API cache: ${JSON.stringify(slimRecipes)}. 
      If the user asks for recommendations, what to make for dinner, or what ingredients they need, you MUST prioritize suggesting these specific Spoonacular recipes. 
      If the user asks for a specific ingredient and it is not in the list, suggest the closest match.\
      CRITICAL DATA RULE: When sharing or discussing a recipe provided in the list, you MUST output the exact ingredients and instructions provided. You are strictly forbidden from adding, inventing, or embellishing any extra ingredients, measurements, or steps.
      CRITICAL FORMATTING RULE: You must ALWAYS format your recipes using Markdown. 
      Use '###' for the Recipe Title. 
      You MUST include '#### Ingredients' and '#### Instructions' as subheadings. 
      Use bullet points ('-') for the Ingredients list, and numbered lists ('1.') for the Instructions.`
    };

    const fullMessages = [systemPrompt, ...safeMessages];
    console.log("Sending this prompt to OpenAI:", JSON.stringify(systemPrompt).substring(0, 500) + "... [TRUNCATED]");

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: fullMessages,
      temperature: 0,
    });
    
    res.json(completion.choices[0].message);
  } catch (error) {
    console.error("OpenAI Error:", error);
    res.status(500).json({ error: "Failed to fetch AI response" });
  }
});

export default router;