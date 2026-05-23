import React from 'react';
import { Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function CTASection() {
  const { handleNavigate } = useApp();

  return (
    <section className="py-24 px-6 md:px-10" id="circuit-specifications">
      <div className="max-w-[1200px] mx-auto carbon-texture border border-brand-red p-12 md:p-20 relative overflow-hidden group rounded-lg">
        <div className="absolute inset-0 bg-brand-red/5 group-hover:bg-brand-red/10 transition-colors pointer-events-none"></div>
        
        <div className="relative z-10 text-center max-w-2xl mx-auto flex flex-col items-center">
          <span className="inline-flex items-center gap-1 bg-brand-red/20 border border-brand-red text-brand-text font-sans text-xs font-bold px-3 py-1 rounded-full mb-6 uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-brand-red" />
            PILOTO OFICIAL PLAYKART
          </span>
          <h2 className="font-display text-4xl md:text-6xl italic leading-none mb-6">
            PRONTO PARA ENTRAR NO GRID?
          </h2>
          <p className="font-sans text-base md:text-lg text-brand-text-muted mb-10 leading-relaxed">
            Entre no nosso Portal do Piloto para acompanhar seu histórico, comparar telemetria com os prós e subir no ranking global.
          </p>
          
          <button 
            onClick={() => handleNavigate('profile')}
            className="bg-white text-black font-display text-2xl px-12 py-5 skew-tag hover:scale-105 active:scale-95 transition-all w-full sm:w-auto text-center cursor-pointer mechanical-switch"
          >
            <span>CRIAR PERFIL / ACESSAR PAINEL</span>
          </button>
        </div>
      </div>
    </section>
  );
}
