const API_KEY = "AIzaSyDofT7mrIF2Dr58Sr_boOmVZQ_44RrQTMI";

export async function generateTrackBlueprint(base64Image: string) {
  try {
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

    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt },
              {
                inlineData: {
                  mimeType: "image/jpeg",
                  data: cleanBase64
                }
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.4,
          topP: 1,
          topK: 32,
          maxOutputTokens: 2048,
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Erro na API (${response.status}): ${JSON.stringify(errorData)}`);
    }

    const result = await response.json();
    const responseText = result.candidates[0].content.parts[0].text;
    
    // Attempt to parse JSON from response
    try {
      const jsonStr = responseText.match(/\{[\s\S]*\}/)?.[0] || responseText;
      return JSON.parse(jsonStr);
    } catch (e) {
      console.error("Erro ao parsear retorno do Gemini:", responseText);
      throw new Error("O AI gerou um formato inválido. Tente novamente.");
    }
  } catch (error: any) {
    console.error("Gemini Direct Error:", error);
    throw error;
  }
}
