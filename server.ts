import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "5mb" }));

// Server-side Gemini AI route for Mayordomo Familiar RD financial insights
app.post("/api/ai-analyze", async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(400).json({
        error: "GEMINI_API_KEY no configurada.",
        useFallback: true,
      });
    }

    const { financialData, query } = req.body;

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
Eres un asesor financiero experto y cercano en República Dominicana para el app 'Mayordomo Familiar RD'.
Tu objetivo es analizar los datos financieros familiares y dar consejos accionables, empáticos y precisos en DOP$ (pesos dominicanos).

Datos financieros actuales:
${JSON.stringify(financialData, null, 2)}

Consulta del usuario / Tarea:
${query || "Analiza el presupuesto, gastos, ahorros y ofrece 4 recomendaciones específicas para optimizar el dinero en República Dominicana (ej. ahorro en supermercados como Bravo, Nacional, Jumbo; control de combustible; fondo de emergencia; inversión en puestos de bolsa o certificados)."
}

Responde en formato JSON con la siguiente estructura:
{
  "summary": "Resumen conciso del estado financiero familiar en 2-3 oraciones.",
  "healthScore": 85, // Número entre 0 y 100
  "recommendations": [
    {
      "type": "warning | savings | investment | tip",
      "title": "Título del consejo",
      "description": "Descripción detallada con montos en RD$"
    }
  ],
  "supermarketTip": "Consejo específico para compras en supermercados dominicanos"
}
Responde ÚNICAMENTE con el objeto JSON válido.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const responseText = response.text || "{}";
    let parsed;
    try {
      parsed = JSON.parse(responseText);
    } catch {
      parsed = { summary: responseText, recommendations: [] };
    }

    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error("AI Analysis Error:", error);
    return res.status(500).json({
      error: error.message || "Error al procesar con la IA de Gemini",
      useFallback: true,
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Mayordomo Familiar RD server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
