import { GoogleGenAI } from '@google/genai';

interface ReqLike {
  method?: string;
  body?: {
    financialData?: Record<string, unknown>;
    query?: string;
  };
}

interface ResLike {
  status: (code: number) => ResLike;
  json: (body: unknown) => void;
  setHeader: (name: string, value: string) => void;
}

export default async function handler(req: ReqLike, res: ResLike) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(400).json({
        error: 'GEMINI_API_KEY no configurada en las variables de entorno.',
        useFallback: true,
      });
    }

    const { financialData, query } = req.body || {};
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
Eres un asesor financiero experto y cercano en República Dominicana para el app 'Mayordomo Familiar RD'.
Tu objetivo es analizar los datos financieros familiares y dar consejos accionables, empáticos y precisos en DOP$ (pesos dominicanos).

Datos financieros actuales:
${JSON.stringify(financialData || {}, null, 2)}

Consulta del usuario / Tarea:
${
  query ||
  'Analiza el presupuesto, gastos, ahorros y ofrece 4 recomendaciones específicas para optimizar el dinero en República Dominicana (ej. ahorro en supermercados como Bravo, Nacional, Jumbo; control de combustible; fondo de emergencia; inversión en puestos de bolsa o certificados).'
}

Responde en formato JSON con la siguiente estructura:
{
  "summary": "Resumen conciso del estado financiero familiar en 2-3 oraciones.",
  "healthScore": 85,
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
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const responseText = response.text || '{}';
    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(responseText);
    } catch {
      parsed = { summary: responseText, healthScore: 75, recommendations: [] };
    }

    return res.status(200).json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Vercel AI Analysis Error:', error);
    return res.status(500).json({
      error: error?.message || 'Error al procesar con la IA de Gemini',
      useFallback: true,
    });
  }
}
