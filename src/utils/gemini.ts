const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || "";

// Lista de modelos para tentativa e erro (Redundância)
const MODELS = [
  "google/gemini-flash-1.5-exp:free",
  "meta-llama/llama-3.2-11b-vision-instruct",
  "meta-llama/llama-3.2-90b-vision-instruct",
  "google/gemini-flash-1.5",
  "google/gemini-pro-1.5-exp"
];

export async function generateTrackBlueprint(base64Image: string) {
  if (!OPENROUTER_API_KEY) {
    throw new Error("A chave VITE_OPENROUTER_API_KEY não foi configurada no Render.");
  }

  let lastError = null;

  for (const model of MODELS) {
    try {
      console.log(`Tentando modelo: ${model}...`);
      
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://playkart-campos.onrender.com",
          "X-Title": "PlayKart Campos"
        },
        body: JSON.stringify({
          model: model,
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: "Você é um arquiteto especialista em kartódromos. Analise esta foto aérea e gere um JSON com { 'svgPath': 'o traçado técnico (d do SVG)', 'description': 'texto', 'suggestion': 'texto' }. Retorne APENAS o JSON puro."
                },
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
        throw new Error(errorData.error?.message || response.statusText);
      }

      const data = await response.json();
      const resultText = data.choices[0].message.content;
      
      const jsonMatch = resultText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        console.log(`Sucesso com o modelo: ${model}`);
        return JSON.parse(jsonMatch[0]);
      }
      
      throw new Error("Formato de resposta inválido.");
      
    } catch (error: any) {
      console.warn(`Falha no modelo ${model}:`, error.message);
      lastError = error;
      // Continua para o próximo loop
    }
  }

  throw new Error(`Todos os modelos falharam. Último erro: ${lastError?.message}`);
}
