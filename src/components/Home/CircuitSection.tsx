import React, { useState, useEffect } from 'react';
import { Phone } from 'lucide-react';

interface CircuitData {
  circuitPath: string;
  blueprintImage?: string;
  description: string;
  suggestion: string;
}

const CircuitSection: React.FC = () => {
  const [circuitData, setCircuitData] = useState<CircuitData>({
    circuitPath: "M 20,50 C 20,20 80,20 80,50 C 80,80 20,80 20,50 Z",
    description: "Carregando traçado do circuito...",
    suggestion: "Prepare sua estratégia..."
  });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedData = localStorage.getItem('kart_circuit_data');
    if (savedData) {
      setCircuitData(JSON.parse(savedData));
    }
    setIsLoaded(true);
  }, []);

  return (
    <section id="circuito" className="py-24 bg-[#0a0a0b] relative overflow-hidden ring-1 ring-white/5">
      <div className="container mx-auto px-6">
        <div className="flex flex-col mb-16">
          <span className="text-brand-red font-mono font-bold tracking-[0.3em] uppercase mb-4 flex items-center gap-3">
            <span className="h-[2px] w-8 bg-brand-red"></span>
            O Traçado
          </span>
          <h2 className="text-5xl md:text-6xl font-black text-white italic tracking-tighter">
            ESTRATÉGIA DE <span className="text-brand-red">CAMPEÃO</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Blueprint Container */}
          <div className="relative aspect-video rounded-xl overflow-hidden border border-[#2b2d42]/20 shadow-inner group">
            {/* Grid Background */}
            <div className="absolute inset-0 bg-[#f2e8cf] opacity-80" />
            <div className="absolute inset-0" style={{ 
              backgroundImage: 'radial-gradient(#2b2d42 0.5px, transparent 0.5px)', 
              backgroundSize: '20px 20px' 
            }} />
            
            {/* Imagem da Planta (Prioritária) ou SVG */}
            <div className="absolute inset-0 flex items-center justify-center p-8">
              {circuitData.blueprintImage ? (
                <img 
                  src={circuitData.blueprintImage} 
                  alt="Planta Técnica do Circuito"
                  className="max-w-full max-h-full object-contain filter contrast-125 saturate-0 mix-blend-multiply opacity-90 transition-all duration-500 group-hover:scale-105"
                />
              ) : (
                <svg
                  viewBox="0 0 100 100"
                  className="w-full h-full drop-shadow-lg"
                >
                  <path
                    d={circuitData.circuitPath}
                    fill="none"
                    stroke="#2b2d42"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray={isLoaded ? "0" : "1000"}
                    className="transition-all duration-1000 ease-in-out"
                    style={{ strokeDashoffset: isLoaded ? 0 : 1000 }}
                  />
                </svg>
              )}
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-[#121214] border-l-4 border-brand-red p-8 rounded-r-xl">
              <h3 className="text-brand-red font-bold uppercase tracking-widest mb-4">Análise Técnica</h3>
              <p className="text-gray-400 leading-relaxed text-lg italic">
                "{circuitData.description || 'Nenhuma descrição técnica disponível.'}"
              </p>
            </div>

            <div className="bg-[#121214] border-l-4 border-emerald-500 p-8 rounded-r-xl">
              <h3 className="text-emerald-500 font-bold uppercase tracking-widest mb-4">Dica Pro</h3>
              <p className="text-gray-400 leading-relaxed text-lg">
                {circuitData.suggestion || 'Não há dicas de performance registradas.'}
              </p>
            </div>

            <button onClick={() => document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth' })} className="w-full py-5 bg-brand-red text-white font-bold rounded-xl flex items-center justify-center gap-3 transition-all hover:bg-red-700 hover:-translate-y-1 active:scale-95 text-lg uppercase tracking-wider">
              <span>Agendar Minha Bateria</span>
              <Phone className="w-5 h-5 fill-white" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CircuitSection;
