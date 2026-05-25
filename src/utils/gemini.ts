const API_KEY = "AIzaSyDofT7mrIF2Dr58Sr_boOmVZQ_44RrQTMI";

export async function generateTrackBlueprint(base64Image: string) {
  try {
    const cleanBase64 = base64Image.split(",")[1] || base64Image;

    const prompt = `
      Você é um arquiteto especialista em kartódromos.
      Analise esta foto aérea e gere uma PLANTA BAIXA TÉCNICA detalhada.
      
      ESTILO DO DESENHO:
      1. Desenhe as BORDAS (as fileiras de pneus) interna e externa da pista.
      2. Use um estilo de "sketch técnico" ou "blueprint".
      3. O traçado deve ser contínuo e representar fielmente as curvas e zebras.
      4. Inclua pequenas marcas que representem a textura dos pneus nas bordas.
      
      RETORNE APENAS um objeto JSON:
      {
        "svgPath": "o conteúdo do atributo 'd' do SVG contendo TODO o desenho técnico (bordas internas e externas)",
        "description": "Explicação técnica do traçado",
        "suggestion": "Dica de performance para o piloto"
      }
      
      IMPORTANTE:
      - O svgPath deve conter caminhos múltiplos para as duas bordas da pista.
      - Assuma viewBox 0 0 100 100.
      - O resultado deve parecer um desenho profissional de engenharia.
      - NÃO adicione texto explicativo fora do JSON.
    `;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`;

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
