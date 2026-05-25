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
                  text: `Analise esta foto aérea e gere uma PLANTA BAIXA TÉCNICA (BLUEPRINT) detalhada do traçado da pista de kart.
      
      INSTRUÇÕES RIGOROSAS:
      1. Extraia o traçado exato das bordas interna e externa (duas linhas paralelas).
      2. O 'svgPath' deve ser uma string LONGA e DETALHADA de comandos SVG (M, L, C, Z) que desenhem toda a pista.
      3. Use o sistema de coordenadas de 0 a 100 (viewBox="0 0 100 100").
      4. O desenho deve ser um esboço técnico limpo, sem fundo, focado apenas no traçado.
      
      RETORNE APENAS JSON:
      {
        "svgPath": "M 10,10 L 90,10 ... (exemplo de traçado real da foto)",
        "description": "Explicação técnica detalhada das curvas",
        "suggestion": "Onde frear e acelerar"
      }`
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
