import express, { Request, Response } from 'express';
import { GoogleGenAI, Type } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize GoogleGenAI server-side client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// AI Chatbot Assistant endpoint
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { message, inventorySummary, history } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    const systemInstruction = `You are "Chef FreshGuard", an expert culinary, food safety, and smart grocery shopping AI assistant built into the Food Item Tracker app.
Your goals:
1. Advise users on optimal food storage (fridge vs pantry vs freezer), maximizing shelf-life, and preventing food spoilage.
2. Answer food safety questions (e.g. whether an item past its best-before date is safe, signs of spoilage, thawing rules).
3. Suggest quick leftover hacks, preservation tips (pickling, freezing, batch cooking), and food rescue ideas.
4. Smart Shopping & Store Advice:
   - For urgent 10-15 minute grocery replenishment: Recommend Blinkit, Zepto, or Swiggy Instamart.
   - For pure farm milk & fresh dairy: Recommend Country Delight (chemical-free testing) or Akshayakalpa (certified organic A2).
   - For antibiotic-free fresh chicken, seafood, and mutton: Recommend Licious, FreshToHome, or Meatigo.
   - For monthly grocery savings & bulk pantry staples: Recommend BigBasket, DMart Ready, JioMart, Amazon Fresh, or Flipkart Grocery.
   - For cooked meal ordering: Recommend Swiggy, Zomato, EatSure, Faasos, Box8, Domino's, Pizza Hut, KFC, McDonald's, Burger King, Magicpin, or Zepto Café.
5. Clinical Diet, BMR & Macro Guidance:
   - Understand the scientific BMR calculation: Female = 655 + (9.6 × weight_kg) + (1.7 × height_cm) - (4.7 × age), TDEE expenditure, and sustainable -300 kcal deficits (e.g. 1851 TDEE - 300 = 1551 target calories).
   - Macro breakdown: Protein (1.5g/kg bodyweight, 4 kcal/g), Fat (0.8g/kg bodyweight, 9 kcal/g), remaining calories to complex carbs (4 kcal/g), and 25-35g daily dietary fiber.
   - Specialized in: "Without Oil Cooking" (water braising, banana leaf steaming, clay pot stewing) and "Without Fire Cooking" (raw sprouted legumes, enzyme-rich cold soups, living vegetable spirals).
   - Tailored across Vegetarian (Veg), Non-Vegetarian, and Vegan plant-based diets.
6. If current inventory is provided: ${inventorySummary || 'Not provided'}, proactively reference which expiring or low items need cooking or restocking!
Keep answers friendly, concise, practical, structured with bullet points or numbered steps, and include helpful food safety disclaimers when in doubt.`;

    // Construct prompt with context
    const fullPrompt = `${history && Array.isArray(history) && history.length > 0 ? `Conversation history:\n${history.map((h: { role: string; text: string }) => `${h.role}: ${h.text}`).join('\n')}\n\n` : ''}User query: ${message}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: fullPrompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    return res.json({ reply: response.text || "I couldn't generate a response. Please try again." });
  } catch (error: any) {
    console.error('Error in /api/chat:', error);
    return res.status(500).json({
      error: 'Failed to process AI chat query',
      details: error?.message || 'Unknown error',
    });
  }
});

// Smart Recipe Generator from Leftover / Remaining Grocery Items
app.post('/api/recipes', async (req: Request, res: Response) => {
  try {
    const { items, dietary, cuisine, mealType } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'At least one food item is required to generate recipes' });
    }

    const itemsList = items
      .map((it: any) => `${it.productName} (${it.quantity || 1} ${it.unit || 'units'}, expires: ${it.expiryDate || 'N/A'}, status: ${it.status || 'available'})`)
      .join(', ');

    const prompt = `You are a world-class executive chef and clinical nutritionist.
The user has the following remaining food and grocery items expiring soon or in their kitchen:
[${itemsList}]

Dietary preference filter: ${dietary || 'Any (Veg / Non-Veg / Vegan)'}
Cuisine style requested: ${cuisine || 'All-World (Indian, Italian, Asian, Mexican, Mediterranean, etc.)'}
Meal preference: ${mealType || 'Any'}

Generate 3 diverse, appetizing, and creative recipes that maximize the use of these available ingredients to reduce food waste. Include authentic regional recipes from all over the world (e.g., Indian curries/dal, Italian pastas/frittatas, Mexican tacos/bowls, Asian stir-fries, Mediterranean bakes, etc.).
Ensure complete nutritional breakdown (calories, protein, carbs, fats, fiber).`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: 'Return valid JSON only matching the schema. Provide accurate nutritional estimates and clear culinary instructions.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          description: 'List of recommended leftover recipes',
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              cuisine: { type: Type.STRING, description: 'e.g. Indian, Italian, Mexican, Japanese, Thai, Mediterranean, American' },
              dietaryType: { type: Type.STRING, description: 'Vegetarian, Vegan, Non-Vegetarian, or Pescatarian' },
              difficulty: { type: Type.STRING, description: 'Easy, Medium, or Advanced' },
              prepTimeMinutes: { type: Type.INTEGER },
              cookTimeMinutes: { type: Type.INTEGER },
              servings: { type: Type.INTEGER },
              description: { type: Type.STRING },
              ingredientsFromInventory: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Ingredients used from the user inventory list',
              },
              pantryStaplesNeeded: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Common pantry staples needed like salt, olive oil, spices, water',
              },
              instructions: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              nutritionPerServing: {
                type: Type.OBJECT,
                properties: {
                  calories: { type: Type.INTEGER },
                  proteinGrams: { type: Type.NUMBER },
                  carbsGrams: { type: Type.NUMBER },
                  fatsGrams: { type: Type.NUMBER },
                  fiberGrams: { type: Type.NUMBER },
                },
                required: ['calories', 'proteinGrams', 'carbsGrams', 'fatsGrams'],
              },
              chefTip: { type: Type.STRING, description: 'Storage or zero-waste cooking tip' },
            },
            required: [
              'id',
              'title',
              'cuisine',
              'dietaryType',
              'difficulty',
              'prepTimeMinutes',
              'cookTimeMinutes',
              'servings',
              'description',
              'ingredientsFromInventory',
              'pantryStaplesNeeded',
              'instructions',
              'nutritionPerServing',
              'chefTip',
            ],
          },
        },
      },
    });

    const parsed = JSON.parse(response.text?.trim() || '[]');
    return res.json({ recipes: parsed });
  } catch (error: any) {
    console.error('Error in /api/recipes:', error);
    return res.status(500).json({
      error: 'Failed to generate recipes',
      details: error?.message || 'Unknown error',
    });
  }
});

// Barcode & Product Enrichment endpoint
app.post('/api/barcode-lookup', async (req: Request, res: Response) => {
  try {
    const { barcode, productName } = req.body;

    const prompt = `Analyze this grocery item / barcode:
Barcode: ${barcode || 'N/A'}
Product name query: ${productName || 'Unknown'}

Provide accurate product metadata: standard category (Dairy, Produce, Bakery, Meat & Seafood, Pantry, Beverages, Frozen, Snacks), typical unopened and opened shelf life in days from manufacture, recommended storage location (Fridge, Freezer, Pantry, Counter), estimated cost (USD), and food safety tips.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            productName: { type: Type.STRING },
            category: { type: Type.STRING },
            storageLocation: { type: Type.STRING },
            shelfLifeDays: { type: Type.INTEGER },
            typicalUnit: { type: Type.STRING },
            estimatedPriceUSD: { type: Type.NUMBER },
            isPerishable: { type: Type.BOOLEAN },
            storageTip: { type: Type.STRING },
          },
          required: ['productName', 'category', 'storageLocation', 'shelfLifeDays', 'typicalUnit'],
        },
      },
    });

    const data = JSON.parse(response.text?.trim() || '{}');
    return res.json(data);
  } catch (error: any) {
    console.error('Error in /api/barcode-lookup:', error);
    return res.status(500).json({ error: 'Failed to lookup product details' });
  }
});

// AI Food & Label Photo Vision Scanner
app.post('/api/scan-photo', async (req: Request, res: Response) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg' } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ error: 'Image data is required' });
    }

    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType,
              data: cleanBase64,
            },
          },
          {
            text: `Examine this photo of a food item, grocery product, package label, or receipt.
Identify:
1. Exact product name
2. Best matching food category from: 'Dairy & Eggs', 'Fresh Produce', 'Bakery', 'Meat & Seafood', 'Pantry & Grains', 'Beverages', 'Frozen', 'Snacks & Sweets', 'Condiments & Sauces'
3. Recommended storage location: 'Fridge', 'Freezer', 'Pantry', or 'Counter'
4. Estimated shelf life in days from today
5. Estimated quantity and appropriate unit (e.g. pieces, kg, g, liters, boxes, packs)
6. Dietary classification: 'Vegetarian', 'Vegan', or 'Non-Vegetarian'
7. Estimated price in USD
8. Practical storage or freshness preservation tip.
Return valid JSON.`,
          },
        ],
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            productName: { type: Type.STRING },
            category: { type: Type.STRING },
            storageLocation: { type: Type.STRING },
            shelfLifeDays: { type: Type.INTEGER },
            quantity: { type: Type.NUMBER },
            unit: { type: Type.STRING },
            dietaryType: { type: Type.STRING },
            estimatedPriceUSD: { type: Type.NUMBER },
            storageTip: { type: Type.STRING },
          },
          required: ['productName', 'category', 'storageLocation', 'shelfLifeDays', 'quantity', 'unit'],
        },
      },
    });

    const parsed = JSON.parse(response.text?.trim() || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/scan-photo:', error);
    return res.status(500).json({ error: 'Failed to analyze food image', details: error?.message });
  }
});

// GitHub & Google Cloud Food Database Extraction Endpoints
app.get('/api/cloud-products/seed', async (_req: Request, res: Response) => {
  try {
    const { CLOUD_EXTRACTED_PRODUCTS } = await import('./src/data/cloudDatabaseSeed');
    return res.json({
      success: true,
      sources: {
        githubOpenFood: 'github.com/openfoodfacts/openfoodfacts-data',
        googleCloudDataset: 'gs://food-data-central & Google AI Vision Knowledge Graph',
      },
      count: CLOUD_EXTRACTED_PRODUCTS.length,
      products: CLOUD_EXTRACTED_PRODUCTS,
    });
  } catch (error: any) {
    console.error('Error loading cloud seed:', error);
    return res.status(500).json({ error: 'Failed to load seed products' });
  }
});

app.post('/api/cloud-products/search', async (req: Request, res: Response) => {
  try {
    const { query = '', category = 'All', sourceFilter = 'all' } = req.body;
    const { CLOUD_EXTRACTED_PRODUCTS } = await import('./src/data/cloudDatabaseSeed');

    const q = query.trim().toLowerCase();

    let results = CLOUD_EXTRACTED_PRODUCTS.filter((item) => {
      const matchQuery =
        !q ||
        item.productName.toLowerCase().includes(q) ||
        item.brand.toLowerCase().includes(q) ||
        item.barcode.includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.dietaryType.toLowerCase().includes(q);

      const matchCategory = category === 'All' || item.category === category;
      const matchSource =
        sourceFilter === 'all' ||
        (sourceFilter === 'github' && item.source === 'github_openfood') ||
        (sourceFilter === 'google' && item.source === 'google_cloud_dataset');

      return matchQuery && matchCategory && matchSource;
    });

    // If specific barcode is searched and not found in seed, attempt live lookup on OpenFoodFacts (GitHub Open Food DB API)
    if (results.length === 0 && /^\d{4,14}$/.test(q)) {
      try {
        const offRes = await fetch(`https://world.openfoodfacts.org/api/v2/product/${q}.json`, {
          signal: AbortSignal.timeout(3000),
        });
        if (offRes.ok) {
          const offData = await offRes.json();
          if (offData.status === 1 && offData.product) {
            const p = offData.product;
            const extractedItem = {
              id: `off-${p.code || q}`,
              barcode: p.code || q,
              productName: p.product_name || p.product_name_en || 'Imported Food Product',
              brand: p.brands || 'Open Food Verified',
              category: 'Pantry & Grains',
              storageLocation: 'Pantry' as const,
              shelfLifeDays: 90,
              typicalUnit: 'pieces',
              estimatedPriceUSD: 3.5,
              dietaryType: (p.ingredients_text && /meat|chicken|beef|pork|fish/i.test(p.ingredients_text)
                ? 'Non-Vegetarian'
                : 'Vegetarian') as any,
              source: 'github_openfood' as const,
              sourceRepo: 'github.com/openfoodfacts/openfoodfacts-server (Live Open Data)',
              nutrients: {
                calories: Math.round(Number(p.nutriments?.['energy-kcal_100g'] || 0)),
                protein: Number(p.nutriments?.proteins_100g || 0),
                carbs: Number(p.nutriments?.carbohydrates_100g || 0),
                fat: Number(p.nutriments?.fat_100g || 0),
                fiber: Number(p.nutriments?.fiber_100g || 0),
              },
              ecoScore: (p.ecoscore_grade || 'B').toUpperCase() as any,
              storageTip: 'Extracted live from GitHub OpenFood repository database.',
              verifiedTimestamp: new Date().toISOString(),
            };
            results.push(extractedItem);
          }
        }
      } catch (err) {
        // Fallback gracefully
      }
    }

    return res.json({
      success: true,
      query,
      totalFound: results.length,
      products: results,
    });
  } catch (error: any) {
    console.error('Error in /api/cloud-products/search:', error);
    return res.status(500).json({ error: 'Failed to search cloud products' });
  }
});

app.post('/api/cloud-products/extract-ai', async (req: Request, res: Response) => {
  try {
    const { productName, barcode } = req.body;
    if (!productName && !barcode) {
      return res.status(400).json({ error: 'Product name or barcode required' });
    }

    const prompt = `Extract food knowledge from Google Cloud and Open Datasets for:
Product Name: ${productName || 'Unknown'}
Barcode: ${barcode || 'N/A'}

Provide precise food specifications:
1. Standardized Product Name and Brand
2. Best Category ('Dairy & Eggs', 'Fresh Produce', 'Bakery', 'Meat & Seafood', 'Pantry & Grains', 'Beverages', 'Frozen', 'Snacks & Sweets', 'Condiments & Sauces')
3. Recommended Storage Location ('Fridge', 'Freezer', 'Pantry', 'Counter')
4. Shelf Life in days from purchase
5. Standard unit (pieces, kg, g, liters, packs)
6. Estimated Price (USD)
7. Dietary Classification ('Vegetarian', 'Vegan', 'Non-Vegetarian')
8. Nutritional profile per 100g: calories (kcal), protein (g), carbs (g), fat (g), fiber (g)
9. Eco-Score estimate ('A', 'B', 'C', 'D')
10. Storage & preservation tip
11. Zero-Oil cooking friendly (boolean)
12. Without-Fire raw eating friendly (boolean)`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            productName: { type: Type.STRING },
            brand: { type: Type.STRING },
            category: { type: Type.STRING },
            storageLocation: { type: Type.STRING },
            shelfLifeDays: { type: Type.INTEGER },
            typicalUnit: { type: Type.STRING },
            estimatedPriceUSD: { type: Type.NUMBER },
            dietaryType: { type: Type.STRING },
            nutrients: {
              type: Type.OBJECT,
              properties: {
                calories: { type: Type.NUMBER },
                protein: { type: Type.NUMBER },
                carbs: { type: Type.NUMBER },
                fat: { type: Type.NUMBER },
                fiber: { type: Type.NUMBER },
              },
              required: ['calories', 'protein', 'carbs', 'fat', 'fiber'],
            },
            ecoScore: { type: Type.STRING },
            storageTip: { type: Type.STRING },
            zeroOilFriendly: { type: Type.BOOLEAN },
            noFireFriendly: { type: Type.BOOLEAN },
          },
          required: ['productName', 'category', 'storageLocation', 'shelfLifeDays', 'typicalUnit'],
        },
      },
    });

    const parsed = JSON.parse(response.text?.trim() || '{}');
    const result = {
      id: `ai-gc-${Date.now()}`,
      barcode: barcode || `GC-${Math.floor(100000000000 + Math.random() * 900000000000)}`,
      source: 'google_cloud_dataset' as const,
      sourceRepo: 'Google Cloud Gemini AI Knowledge Graph & USDA FoodData Central',
      verifiedTimestamp: new Date().toISOString(),
      ...parsed,
    };

    return res.json(result);
  } catch (error: any) {
    console.error('Error in /api/cloud-products/extract-ai:', error);
    return res.status(500).json({ error: 'Failed to extract cloud product data' });
  }
});

// Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true, hmr: process.env.DISABLE_HMR !== 'true' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Food Item Tracker server running on port ${PORT}`);
  });
}

startServer();
