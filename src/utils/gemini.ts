// Tentativa final: v1 estável com dupla identificação
const API_KEY = "AIzaSyDofT7mrIF2Dr58Sr_boOmVZQ_44RrQTMI";

export async function generateTrackBlueprint(base64Image: string) {
  try {
    const cleanBase64 = base64Image.split(",")[1] || base64Image;

    const prompt = `
      Você é um arquiteto especialista em kartódromos.
      Analise esta foto aérea e gere uma PLANTA BAIXA TÉCNICA detalhada do traçado da pista.
      
      RETORNE APENAS um objeto JSON:
      {
        "svgPath": "conteúdo do atributo 'd' do SVG",
        "description": "Explicação técnica",
        "suggestion": "Dica de performance"
      }
    `;

    // Usando v1 (ESTÁVEL) e o nome exato do modelo
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-goog-api-key': API_KEY 
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }, { inlineData: { mimeType: "image/jpeg", data: cleanBase64 } }] }]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Erro API: ${errorData.error?.message || response.statusText}`);
    }

    const result = await response.json();
    const responseText = result.candidates[0].content.parts[0].text;
    
    try {
      const jsonStr = responseText.match(/\{[\s\S]*\}/)?.[0] || responseText;
      return JSON.parse(jsonStr);
    } catch (e) {
      throw new Error("Resposta inválida.");
    }
  } catch (error: any) {
    console.error("Gemini Error:", error);
    throw error;
  }
}
