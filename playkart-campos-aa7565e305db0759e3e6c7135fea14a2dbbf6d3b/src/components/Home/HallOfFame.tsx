import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function HallOfFame() {
  const { rankings, handleNavigate } = useApp();
  const top3 = rankings.filter(d => d.rank <= 3).sort((a, b) => a.rank - b.rank);
  const p1 = top3.find(d => d.rank === 1);
  const p2 = top3.find(d => d.rank === 2);
  const p3 = top3.find(d => d.rank === 3);

  return (
    <section className="bg-brand-surface py-24 relative overflow-hidden border-y border-brand-border backdrop-blur-md">
      <div className="absolute -left-10 top-0 opacity-[0.02] select-none pointer-events-none">
        <span className="font-display text-[260px] leading-none text-white italic font-black">LENDAS</span>
      </div>
      
      <div className="px-6 md:px-10 max-w-[1200px] mx-auto relative z-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-16 gap-4">
          <div>
            <h2 className="font-display text-5xl italic tracking-tight uppercase">HALL DA FAMA</h2>
            <p className="font-sans text-xs font-bold text-brand-red tracking-widest uppercase">
              Classificação Semanal - Top 3 Pilotos
            </p>
          </div>
          
          <button 
            onClick={() => handleNavigate('ranking')}
            className="font-sans text-xs font-bold text-brand-text hover:text-brand-red border-b border-brand-text hover:border-brand-red transition-all cursor-pointer flex items-center gap-1 pb-1"
          >
            <span>VER TODOS OS RANKINGS</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-8">
          {p2 && (
            <div className="order-2 md:order-1 flex flex-col gap-6 group hover:-translate-y-2 transition-transform duration-300">
              <div className="relative aspect-square overflow-hidden border border-brand-border/60 grayscale group-hover:grayscale-0 transition-all duration-500 rounded-lg shadow-lg">
                <img src={p2.avatar} alt="P2" className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-700" referrerPolicy="no-referrer" />
                <div className="absolute top-0 left-0 bg-brand-surface-high text-white font-display text-2xl px-4 py-2 skew-tag ml-[-10px] border-r border-brand-border">
                  <span className="ml-[10px]">#2</span>
                </div>
              </div>
              <div>
                <h3 className="font-display text-2xl italic group-hover:text-brand-red transition-colors">{p2.nickname}</h3>
                <div className="flex justify-between items-center border-t border-brand-border/50 pt-2 mt-2">
                  <span className="font-sans text-xs font-semibold text-brand-text-muted">MELHOR VOLTA</span>
                  <span className="font-sans text-sm font-bold text-brand-text">{p2.bestLap}</span>
                </div>
              </div>
            </div>
          )}

          {p1 && (
            <div className="order-1 md:order-2 flex flex-col gap-6 group -mt-8 hover:-translate-y-2 transition-transform duration-300">
              <div className="relative aspect-[4/5] overflow-hidden border-4 border-brand-red shadow-[0_0_30px_rgba(227,6,19,0.3)] group-hover:shadow-[0_0_50px_rgba(227,6,19,0.55)] transition-all duration-500 rounded-lg">
                <img src={p1.avatar} alt="P1" className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-700" referrerPolicy="no-referrer" />
                <div className="absolute top-0 left-0 bg-brand-red text-white font-display text-3xl px-6 py-3 skew-tag ml-[-15px] border-r-2 border-white/20">
                  <span className="ml-[15px]">#1</span>
                </div>
                <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black via-black/80 to-transparent">
                  <span className="bg-brand-red text-white text-[10px] px-2 py-0.5 font-sans font-extrabold tracking-widest inline-block mb-1 skew-tag">
                    <span>CAMPEÃO</span>
                  </span>
                  <p className="text-xs text-brand-text-muted font-sans font-medium">QUEBRA DE RECORDE ANUAL</p>
                </div>
              </div>
              <div className="text-center">
                <h3 className="font-display text-3xl italic text-brand-red group-hover:scale-110 transition-transform tracking-tight">{p1.nickname}</h3>
                <div className="flex flex-col items-center mt-2">
                  <span className="font-sans text-xs font-semibold text-brand-text-muted tracking-widest uppercase">MELHOR VOLTA</span>
                  <span className="font-display text-2xl text-[#e2e2e2] mt-0.5 tracking-wider">{p1.bestLap}</span>
                </div>
              </div>
            </div>
          )}

          {p3 && (
            <div className="order-3 flex flex-col gap-6 group hover:-translate-y-2 transition-transform duration-300">
              <div className="relative aspect-square overflow-hidden border border-brand-border/60 grayscale group-hover:grayscale-0 transition-all duration-500 rounded-lg shadow-lg">
                <img src={p3.avatar} alt="P3" className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-700" referrerPolicy="no-referrer" />
                <div className="absolute top-0 left-0 bg-brand-surface-high text-white font-display text-2xl px-4 py-2 skew-tag ml-[-10px] border-r border-brand-border">
                  <span className="ml-[10px]">#3</span>
                </div>
              </div>
              <div className="text-right">
                <h3 className="font-display text-2xl italic group-hover:text-brand-red transition-colors">{p3.nickname}</h3>
                <div className="flex justify-between items-center border-t border-brand-border/50 pt-2 mt-2">
                  <span className="font-sans text-xs font-semibold text-brand-text-muted">MELHOR VOLTA</span>
                  <span className="font-sans text-sm font-bold text-brand-text">{p3.bestLap}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
