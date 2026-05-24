const API_KEY = "AIzaSyDofT7mrIF2Dr58Sr_boOmVZQ_44RrQTMI";

export async function generateTrackBlueprint(base64Image: string) {
  try {
    // DIAGNÓSTICO: Listar modelos disponíveis
    const listUrl = `https://generativelanguage.googleapis.com/v1/models?key=${API_KEY}`;
    const listResponse = await fetch(listUrl);
    const listData = await listResponse.json();
    
    console.log("Modelos Disponíveis:", listData);
    
    if (listData.models) {
      const modelNames = listData.models.map((m: any) => m.name.replace('models/', ''));
      alert("Diagnóstico: Sua chave vê estes modelos: " + modelNames.join(", "));
    }

    // Tentar o 8b (que é mais provável de estar vago)
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
    
    const cleanBase64 = base64Image.split(",")[1] || base64Image;
    const prompt = "Analise a imagem e retorne um JSON com svgPath da pista.";

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }, { inlineData: { mimeType: "image/jpeg", data: cleanBase64 } }] }]
      })
    });

    const result = await response.json();
    return { svgPath: "M0,0", description: "Aguardando diagnóstico..." };
  } catch (error: any) {
    alert("Erro Crítico no Scanner: " + error.message);
    throw error;
  }
}
