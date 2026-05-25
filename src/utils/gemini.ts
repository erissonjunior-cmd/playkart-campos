const API_KEY = "AIzaSyDofT7mrIF2Dr58Sr_boOmVZQ_44RrQTMI";

export async function generateTrackBlueprint(base64Image: string) {
  try {
    const cleanBase64 = base64Image.split(",")[1] || base64Image;

    const prompt = `
      Você é um CARTOGRAFISTA TÉCNICO de pistas de corrida.
      Sua tarefa é transformar a imagem aérea de um kartódromo em uma PLANTA BAIXA TÉCNICA PROFISSIONAL.
      
      REFERÊNCIA DE ESTILO (Siga rigorosamente):
      1. Desenhe as barreiras de pneus usando círculos pequenos contínuos.
      2. Desenhe o traçado central e as bordas internas/externas.
      3. Use um traço preto limpo sobre fundo técnico (estilo blueprint/nanquim).
      4. Adicione elementos visuais de engenharia (setas de fluxo, indicações de curvas).
      5. O traçado deve ser geométrica e tecnicamente preciso.
      
      RETORNE APENAS um objeto JSON:
      {
        "svgPath": "todo o desenho SVG (caminhos, círculos de pneus, setas) condensados no atributo 'd' ou agrupados",
        "description": "Análise técnica do layout da pista",
        "suggestion": "Melhor traçado para tempo de volta"
      }
      
      IMPORTANTE:
      - Foque na estética de 'Desenho Técnico à Mão'.
      - ViewBox 0 0 100 100.
      - NÃO adicione texto explicativo fora do JSON.
    `;

    // Tentando o modelo experimental que costuma ter quotas diferentes e evitar o 404
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent`;

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
      throw new Error("Formato de resposta inválido da IA.");
    }
  } catch (error: any) {
    console.error("Gemini Error:", error);
    throw error;
  }
}
