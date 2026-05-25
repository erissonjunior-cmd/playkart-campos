// Voltando para o Google com o modelo 8B (que é o mais resiliente de todos)
const API_KEY = "AIzaSyDofT7mrIF2Dr58Sr_boOmVZQ_44RrQTMI";

export async function generateTrackBlueprint(base64Image: string) {
  try {
    const cleanBase64 = base64Image.split(",")[1] || base64Image;

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
      
      IMPORTANTE:
      - O svgPath DEVE SER UM SVG PATH VÁLIDO.
      - NÃO adicione blocos de código Markdown ou conversas, APENAS O JSON.
    `;

    // Usando o modelo 8B-Latest que é o mais provável de estar livre
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-8b-latest:generateContent?key=${API_KEY}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
      throw new Error("Formato de resposta inválido da IA.");
    }
  } catch (error: any) {
    console.error("Gemini Error:", error);
    throw error;
  }
}
