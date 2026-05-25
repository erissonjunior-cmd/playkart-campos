const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || "";

export async function generateTrackBlueprint(base64Image: string) {
  try {
    if (!OPENROUTER_API_KEY) {
      throw new Error("A chave VITE_OPENROUTER_API_KEY não foi configurada no Render.");
    }

    const prompt = `
      Você é um arquiteto especialista em kartódromos.
      Analise esta foto aérea e gere uma PLANTA BAIXA TÉCNICA detalhada do traçado da pista.
      
      ESTILO DO DESENHO (Obrigatório):
      1. Desenhe as BORDAS (as fileiras de pneus) interna e externa da pista.
      2. Use um estilo de "sketch técnico" ou "blueprint".
      3. O traçado deve ser contínuo e representar fielmente as curvas e zebras.
      
      RETORNE APENAS um objeto JSON válido (sem textos extras):
      {
        "svgPath": "conteúdo do atributo 'd' de um elemento <path> contendo as bordas e detalhes da pista (ViewBox 0 0 100 100)",
        "description": "Explicação técnica do traçado capturado",
        "suggestion": "Dica de performance baseada no traçado"
      }
    `;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://playkart-campos.onrender.com", // Obrigatório p/ OpenRouter
        "X-Title": "PlayKart Campos"
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.2-90b-vision-instruct",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              {
                type: "image_url",
                image_url: {
                  url: base64Image.startsWith('data:') ? base64Image : `data:image/jpeg;base64,${base64Image}`
                }
              }
            ]
          }
        ],
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Erro OpenRouter: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    const resultText = data.choices[0].message.content;
    
    try {
      return JSON.parse(resultText);
    } catch (e) {
      // Fallback para extração manual de JSON se a IA não respeitar o formato
      const jsonMatch = resultText.match(/\{[\s\S]*\}/);
      if (jsonMatch) return JSON.parse(jsonMatch[0]);
      throw new Error("Formato de resposta inválido.");
    }
  } catch (error: any) {
    console.error("AI Generation Error:", error);
    throw error;
  }
}
