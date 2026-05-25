// Scanner seguro usando variável de ambiente
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || "";

export async function generateTrackBlueprint(base64Image: string) {
  try {
    if (!GROQ_API_KEY) {
      alert("ERRO: A variável VITE_GROQ_API_KEY não foi encontrada no Render.");
      return { svgPath: "M0,0", description: "Configuração ausente." };
    }

    // DIAGNÓSTICO GROQ
    const listResponse = await fetch("https://api.groq.com/openai/v1/models", {
      headers: { "Authorization": `Bearer ${GROQ_API_KEY}` }
    });
    const listData = await listResponse.json();
    
    if (listData.data) {
      const modelNames = listData.data.map((m: any) => m.id).filter((id: string) => id.includes('vision'));
      alert("Diagnóstico Groq (Modelos de Visão): " + modelNames.join(", "));
    }

    return { svgPath: "M0,0", description: "Buscando modelos de visão ativos..." };
  } catch (error: any) {
    alert("Erro no Scanner Groq: " + error.message);
    throw error;
  }
}
