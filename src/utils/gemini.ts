// Use environment variable for security - GitHub blocks pushes with hardcoded keys
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || "";

export async function generateTrackBlueprint(base64Image: string) {
  try {
    if (!GROQ_API_KEY) {
      throw new Error("A chave VITE_GROQ_API_KEY não foi configurada no ambiente.");
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
        "svgPath": "conteúdo do atributo 'd' de um elemento <path> contendo as bordas e detalhes da pista",
        "description": "Explicação técnica do traçado capturado",
        "suggestion": "Dica de performance baseada no traçado"
      }
      
      IMPORTANTE:
      - O svgPath deve conter os caminhos para as bordas da pista.
      - Assuma ViewBox 0 0 100 100.
      - NÃO adicione blocos de código Markdown, retorne apenas o JSON puro.
    `;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.2-11b-vision-preview",
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
        temperature: 0.1,
        max_tokens: 1024,
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Erro Groq: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    const result = JSON.parse(data.choices[0].message.content);
    
    return result;
  } catch (error: any) {
    console.error("Groq Error:", error);
    throw error;
  }
}
