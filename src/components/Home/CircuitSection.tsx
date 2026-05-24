import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { CircuitCurve } from '../../types';

export default function CircuitSection() {
  const { circuitCurves, circuitMapImage, circuitPath } = useApp();
  const [activeCurve, setActiveCurve] = useState<CircuitCurve | null>(null);

  // Stats for the circuit
  const stats = [
    { label: 'EXTENSÃO TOTAL', value: '1.2 KM' },
    { label: 'CURVAS TÉCNICAS', value: circuitCurves.length.toString() },
    { label: 'RETA PRINCIPAL', value: '120M' },
    { label: 'LARGURA MÉDIA', value: '8M' },
  ];

  return (
    <section className="bg-brand-bg py-24 px-6 md:px-10 border-t border-brand-border overflow-hidden">
      <div className="max-w-[1240px] mx-auto flex flex-col lg:flex-row items-center gap-16">
        
        {/* Left: Info & Stats */}
        <div className="flex-1 space-y-10">
          <div>
            <h3 className="font-display text-lg text-brand-red uppercase tracking-widest mb-2 font-black italic">CIRCUITO CAMPOS</h3>
            <h2 className="font-display text-4xl md:text-5xl italic text-white font-black uppercase tracking-tight leading-none">
              CONFIGURAÇÃO TÉCNICA
            </h2>
          </div>

          <p className="font-sans text-brand-text-muted text-lg leading-relaxed max-w-xl">
            Um traçado de 1.200 metros projetado para testar limites. Com {circuitCurves.length} curvas de alta, média e baixa velocidade, nossa pista oferece o equilíbrio perfeito entre técnica e velocidade pura.
          </p>

          <div className="grid grid-cols-2 gap-y-10 gap-x-12 pt-4">
            {stats.map((stat, idx) => (
              <div key={idx} className="border-l-2 border-brand-red/50 hover:border-brand-red transition-colors pl-6 py-1">
                <span className="block font-display text-3xl text-white font-black tracking-tight">{stat.value}</span>
                <span className="block text-[10px] font-black uppercase tracking-[0.2em] text-brand-text-muted mt-1">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Interactive Circuit Map */}
        <div className="flex-1 relative w-full lg:w-[600px] aspect-square flex items-center justify-center">
          <div className="absolute inset-0 bg-brand-red/5 blur-[120px] rounded-full"></div>
          
          <div className="relative w-full h-full bg-[#121214] border border-brand-border/40 rounded-2xl overflow-hidden p-6 shadow-2xl">
            <div className="relative w-full h-full rounded-xl overflow-hidden bg-[#f2e8cf] border border-[#bc6c25]/20 group">
              {/* Grid Lines */}
              <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[linear-gradient(#bc6c25_1px,transparent_1px),linear-gradient(90deg,#bc6c25_1px,transparent_1px)] bg-[size:30px_30px]"></div>
              
              {/* Blueprint Layer */}
              {circuitPath && (
                <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full p-[8%] drop-shadow-[0_2px_10px_rgba(0,0,0,0.1)] z-10 pointer-events-none">
                  <path 
                    d={circuitPath} 
                    fill="none" 
                    stroke="#2b2d42" 
                    strokeWidth="0.8" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    className="transition-all duration-1000"
                  />
                  <path 
                    d={circuitPath} 
                    fill="none" 
                    stroke="#bc6c25" 
                    strokeWidth="2.5" 
                    className="opacity-5"
                  />
                </svg>
              )}

              <img 
                src={circuitMapImage} 
                alt="Circuit Layout" 
                className={`w-full h-full object-contain transition-all duration-1000 ${circuitPath ? 'opacity-10 grayscale brightness-125' : 'opacity-80'}`}
              />

              {/* HUD Elements */}
              <div className="absolute top-4 left-4 flex flex-col gap-1 pointer-events-none z-20">
                <span className="text-[10px] font-black text-[#bc6c25] uppercase tracking-[0.3em]">Circuit_Analysis.sys</span>
                <span className="text-[8px] font-bold text-black/40 uppercase">Sectors: {circuitCurves.length}</span>
              </div>

              {/* Curve Points */}
              <div className="absolute inset-0 z-20">
                {circuitCurves.map((curve) => (
                  <motion.div
                    key={curve.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute cursor-pointer group/point"
                    style={{ left: `${curve.x}%`, top: `${curve.y}%` }}
                    onMouseEnter={() => setActiveCurve(curve)}
                    onMouseLeave={() => setActiveCurve(null)}
                  >
                    <div className="relative w-6 h-6 flex items-center justify-center -translate-x-1/2 -translate-y-1/2">
                      <div className={`w-3 h-3 rounded-full border-2 border-white shadow-xl transition-transform group-hover/point:scale-150 ${
                        curve.type === 'Alta' ? 'bg-red-500' : curve.type === 'Média' ? 'bg-orange-500' : 'bg-cyan-500'
                      }`}></div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Curve Tooltip */}
              <AnimatePresence>
                {activeCurve && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md border border-[#bc6c25]/20 p-4 rounded shadow-xl z-30"
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-display text-lg italic text-[#2b2d42] font-black uppercase tracking-tight">{activeCurve.name}</span>
                      <span className={`text-[8px] font-black px-2 py-0.5 rounded border ${
                        activeCurve.type === 'Alta' ? 'text-red-500 border-red-500' : 
                        activeCurve.type === 'Média' ? 'text-orange-500 border-orange-500' : 
                        'text-cyan-500 border-cyan-500'
                      } uppercase`}>Setor de {activeCurve.type}</span>
                    </div>
                    <p className="text-[10px] text-[#555] font-bold uppercase tracking-wider">Ponto de análise técnica Nano Banana.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
