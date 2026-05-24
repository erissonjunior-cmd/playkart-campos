import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);

export async function generateTrackBlueprint(base64Image: string) {
  if (!API_KEY) {
    throw new Error("Gemini API Key não configurada. Por favor, adicione GEMINI_API_KEY ao seu arquivo .env");
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-001" });

    // Remove base64 header if present
    const cleanBase64 = base64Image.split(",")[1] || base64Image;

    const prompt = `
      Analise esta foto aérea de um kartódromo. 
      Sua tarefa é extrair a geometria do traçado da pista (delimitado pelos pneus) e transformá-la em uma representação técnica minimalista de "planta baixa".
      
      RETORNE APENAS um objeto JSON com o seguinte formato:
      {
        "svgPath": "conteúdo do atributo 'd' de um elemento <path> do SVG que desenha o traçado completo",
        "description": "Uma breve descrição técnica da complexidade do traçado",
        "suggestion": "Uma dica técnica para os pilotos (ex: foco na curva 3)"
      }
      
      IMPORTANTE:
      1. O svgPath deve ser simplificado e contínuo, representando o eixo central da pista.
      2. Assuma um viewBox de 0 0 100 100.
      3. Seja preciso com as curvas e retas capturadas na imagem.
      4. NÃO inclua nada além do JSON no seu retorno.
    `;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: cleanBase64,
          mimeType: "image/jpeg",
        },
      },
    ]);

    const responseText = result.response.text();
    
    // Attempt to parse JSON from response
    try {
      const jsonStr = responseText.match(/\{[\s\S]*\}/)?.[0] || responseText;
      return JSON.parse(jsonStr);
    } catch (e) {
      console.error("Erro ao parsear retorno do Gemini:", responseText);
      throw new Error("O AI gerou um formato inválido. Tente novamente.");
    }
  } catch (error: any) {
    console.error("Gemini Error:", error);
    throw error;
  }
}
