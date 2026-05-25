import React, { useState, useEffect } from 'react';
import { 
  Camera, 
  Save, 
  Trash2, 
  Upload, 
  Layout, 
  Map, 
  Info,
  ChevronRight,
  Plus
} from 'lucide-react';

interface CircuitData {
  circuitPath: string;
  blueprintImage?: string;
  description: string;
  suggestion: string;
}

const AdminView: React.FC = () => {
  const [circuitData, setCircuitData] = useState<CircuitData>({
    circuitPath: '',
    blueprintImage: '',
    description: '',
    suggestion: ''
  });
  const [blueprintImage, setBlueprintImage] = useState<string | null>(null);

  useEffect(() => {
    const savedData = localStorage.getItem('kart_circuit_data');
    if (savedData) {
      const data = JSON.parse(savedData);
      setCircuitData(data);
      if (data.blueprintImage) setBlueprintImage(data.blueprintImage);
    }
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBlueprintImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveBlueprint = () => {
    if (!blueprintImage && !circuitData.description && !circuitData.suggestion) {
      alert('Preencha os dados da planta antes de salvar.');
      return;
    }
    
    const updatedCircuit = {
      ...circuitData,
      blueprintImage: blueprintImage || '',
      circuitPath: '' // Prioriza imagem manual
    };
    
    localStorage.setItem('kart_circuit_data', JSON.stringify(updatedCircuit));
    setCircuitData(updatedCircuit);
    alert('Planta oficial e análises salvas com sucesso!');
  };

  const handleResetBlueprint = () => {
    if (confirm('Deseja resetar a planta atual?')) {
      const resetData = {
        circuitPath: '',
        blueprintImage: '',
        description: 'Circuito padrão carregado.',
        suggestion: 'Prepare sua estratégia para este desafio!'
      };
      localStorage.setItem('kart_circuit_data', JSON.stringify(resetData));
      setCircuitData(resetData);
      setBlueprintImage(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white p-4 md:p-8 pt-24 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-brand-border/20 pb-8">
          <div>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter">
              Portal <span className="text-brand-red underline decoration-brand-red/30 underline-offset-8">Admin</span>
            </h1>
            <p className="text-gray-500 mt-2 font-mono text-sm uppercase tracking-widest">Controle de Circuito & Pista</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={handleSaveBlueprint}
              className="px-6 py-3 bg-brand-red text-white font-bold rounded-lg flex items-center gap-2 hover:bg-red-700 transition-all shadow-[0_0_20px_rgba(255,51,51,0.2)] active:scale-95"
            >
              <Save className="w-5 h-5" />
              <span>Salvar Alterações</span>
            </button>
            <button 
              onClick={handleResetBlueprint}
              className="px-4 py-3 bg-white/5 text-gray-400 font-bold rounded-lg hover:bg-white/10 transition-all border border-white/10"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Upload Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#121214] border border-brand-border/20 rounded-2xl overflow-hidden p-6 shadow-2xl">
              <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
                <div className="p-2 bg-brand-red/10 rounded-lg">
                  <Layout className="w-5 h-5 text-brand-red" />
                </div>
                <h2 className="text-xl font-bold uppercase italic">Planta Oficial do Circuito</h2>
              </div>
              
              <div className="relative aspect-video rounded-xl bg-[#0a0a0b] border-2 border-dashed border-white/10 group overflow-hidden">
                {blueprintImage ? (
                  <div className="relative w-full h-full p-4">
                    <div className="absolute inset-0 bg-[#f2e8cf]/90" />
                    <div className="absolute inset-0" style={{ 
                      backgroundImage: 'radial-gradient(#2b2d42 0.5px, transparent 0.5px)', 
                      backgroundSize: '20px 20px',
                      opacity: 0.2
                    }} />
                    <img 
                      src={blueprintImage} 
                      alt="Preview da Planta"
                      className="relative w-full h-full object-contain filter contrast-125 saturate-0 mix-blend-multiply opacity-90"
                    />
                    <div className="absolute top-4 right-4 flex gap-2">
                       <label className="p-3 bg-white/10 backdrop-blur-md rounded-lg cursor-pointer hover:bg-white/20 transition-all border border-white/20">
                        <Plus className="w-5 h-5" />
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                      </label>
                    </div>
                  </div>
                ) : (
                  <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-all">
                    <div className="p-4 bg-brand-red/10 rounded-full mb-4 group-hover:scale-110 transition-transform">
                      <Upload className="w-8 h-8 text-brand-red" />
                    </div>
                    <span className="text-lg font-bold text-gray-400 italic">CARREGAR PLANTA BAIXA</span>
                    <span className="text-sm text-gray-600 mt-2">Escolha o arquivo gerado no Gemini</span>
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                  </label>
                )}
              </div>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#121214] p-6 rounded-2xl border-l-4 border-brand-red shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <Info className="w-5 h-5 text-brand-red" />
                  <h3 className="font-bold uppercase tracking-widest text-sm">Análise Técnica</h3>
                </div>
                <textarea 
                  value={circuitData.description}
                  onChange={(e) => setCircuitData({...circuitData, description: e.target.value})}
                  className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-gray-400 font-mono text-sm h-32 focus:border-brand-red focus:ring-0 transition-all"
                  placeholder="Descreva as características técnicas do traçado..."
                />
              </div>

              <div className="bg-[#121214] p-6 rounded-2xl border-l-4 border-emerald-500 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <ChevronRight className="w-5 h-5 text-emerald-500" />
                  <h3 className="font-bold uppercase tracking-widest text-sm">Dica de Performance</h3>
                </div>
                <textarea 
                  value={circuitData.suggestion}
                  onChange={(e) => setCircuitData({...circuitData, suggestion: e.target.value})}
                  className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-gray-400 font-mono text-sm h-32 focus:border-emerald-500 focus:ring-0 transition-all"
                  placeholder="Dê uma dica crucial para os pilotos..."
                />
              </div>
            </div>
          </div>

          {/* Sidebar Tips */}
          <div className="space-y-6">
            <div className="bg-brand-red/10 border border-brand-red/20 p-6 rounded-2xl">
              <h3 className="text-brand-red font-black italic uppercase mb-4 flex items-center gap-2">
                <Camera className="w-5 h-5" />
                Dica Nano Banana
              </h3>
              <ul className="text-sm text-gray-400 space-y-4">
                <li className="flex gap-3">
                  <span className="text-brand-red font-bold">01.</span>
                  <span>Use o Gemini Web para converter a foto aérea em uma "planta baixa técnica".</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-brand-red font-bold">02.</span>
                  <span>Salve a imagem gerada e faça o upload aqui.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-brand-red font-bold">03.</span>
                  <span>O sistema aplicará automaticamente o visual de blueprint do site.</span>
                </li>
              </ul>
            </div>

            <div className="bg-[#121214] p-6 rounded-2xl border border-white/5">
              <h3 className="text-white font-bold uppercase tracking-tighter mb-4 flex items-center gap-2">
                <Map className="w-5 h-5" />
                Resumo do Circuito
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between text-sm py-2 border-b border-white/5">
                  <span className="text-gray-500">Status</span>
                  <span className="text-emerald-500 font-bold uppercase tracking-widest text-xs">Ativo</span>
                </div>
                <div className="flex justify-between text-sm py-2 border-b border-white/5">
                  <span className="text-gray-500">Tipo</span>
                  <span className="text-gray-300 italic">Pista Técnica</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminView;
