import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { CircuitCurve } from '../../types';

export default function CircuitSection() {
  const { circuitCurves } = useApp();
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
          {/* Decorative Background */}
          <div className="absolute inset-0 bg-brand-red/5 blur-[120px] rounded-full"></div>
          
          <div className="relative w-full h-full carbon-texture border border-brand-border/40 rounded-2xl overflow-hidden p-8 shadow-2xl skew-tag">
            <div className="absolute inset-0 bg-[#0c0c0e]/80 backdrop-blur-sm pointer-events-none"></div>
            
            <div className="relative w-full h-full flex items-center justify-center unskew-child">
               {/* Circuit Image Placeholder - In a real app, this would be an SVG or a scanned map */}
               <div className="relative w-full h-full flex items-center justify-center border-2 border-dashed border-brand-red/20 rounded-xl overflow-hidden">
                  <img 
                    src="https://files.catbox.moe/rbtosq.png" // This is a placeholder circuit scan
                    alt="Circuit Layout" 
                    className="w-full h-full object-contain opacity-60 brightness-150 contrast-125 grayscale"
                  />
                  
                  {/* Digital Overlay Effect */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000_100%)] opacity-40"></div>
                  
                  {/* Dynamic Points (Curves) */}
                  {circuitCurves.map((curve) => (
                    <motion.div
                      key={curve.id}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="absolute cursor-pointer group"
                      style={{ left: `${curve.x}%`, top: `${curve.y}%` }}
                      onMouseEnter={() => setActiveCurve(curve)}
                      onMouseLeave={() => setActiveCurve(null)}
                    >
                      {/* Point Indicator */}
                      <div className="relative">
                        <div className={`w-4 h-4 rounded-full border-2 ${curve.type === 'Alta' ? 'bg-red-500 border-white' : curve.type === 'Média' ? 'bg-orange-500 border-white' : 'bg-blue-500 border-white'} shadow-[0_0_15px_rgba(255,255,255,0.5)] group-hover:scale-150 transition-transform`}></div>
                        
                        {/* Static Label */}
                        <span className="absolute left-6 top-1/2 -translate-y-1/2 whitespace-nowrap bg-black/80 backdrop-blur-md px-2 py-0.5 border border-brand-border rounded text-[10px] font-black text-white uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                          {curve.name}
                        </span>
                      </div>
                    </motion.div>
                  ))}
               </div>

               {/* Active Info Popup */}
               <AnimatePresence>
                 {activeCurve && (
                   <motion.div
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, y: 10 }}
                     className="absolute bottom-6 left-6 right-6 bg-brand-surface-high/95 backdrop-blur-xl border border-brand-red/30 p-4 rounded-lg shadow-2xl z-20"
                   >
                     <div className="flex justify-between items-center mb-1">
                       <span className="font-display text-lg italic text-white font-black uppercase tracking-tight">{activeCurve.name}</span>
                       <span className={`text-[9px] font-black px-2 py-0.5 rounded border ${
                         activeCurve.type === 'Alta' ? 'text-red-500 border-red-500' : 
                         activeCurve.type === 'Média' ? 'text-orange-500 border-orange-500' : 
                         'text-blue-500 border-blue-500'
                       } uppercase`}>Curva de {activeCurve.type}</span>
                     </div>
                     <p className="text-[11px] text-brand-text-muted uppercase font-bold tracking-wider leading-tight">
                       Ponto técnico estratégico para ultrapassagem e manutenção de momentum centrífugo.
                     </p>
                   </motion.div>
                 )}
               </AnimatePresence>
            </div>

            {/* SCANNING Effect */}
            <div className="absolute left-0 right-0 h-1 bg-brand-red/30 animate-scan pointer-events-none"></div>
            
            <div className="absolute top-4 left-4 font-display text-[9px] text-brand-red/50 tracking-[0.3em] font-black">
              TRACK_LAYOUT_V4.02<br/>
              SCANNING_SECTORS...
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes scan {
          0% { top: 0; opacity: 0; }
          50% { opacity: 0.5; }
          100% { top: 100%; opacity: 0; }
        }
        .animate-scan {
          animation: scan 3s linear infinite;
        }
        .unskew-child {
          transform: skewX(10deg);
        }
      `}</style>
    </section>
  );
}
