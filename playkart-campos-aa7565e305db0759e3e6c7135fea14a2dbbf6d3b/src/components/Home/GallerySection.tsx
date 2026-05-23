import React, { useState } from 'react';
import { Camera, Maximize2, X } from 'lucide-react';

export default function GallerySection() {
  const [activeLightbox, setActiveLightbox] = useState<string | null>(null);

  const images = [
    { url: 'https://files.catbox.moe/sofvhj.jpg', title: 'CONCENTRAÇÃO PRÉ-GRID', sub: '01 / FOCO' },
    { url: 'https://files.catbox.moe/9ibwct.jpg', title: 'PÓDIO E FAMÍLIA', sub: '02 / DESTAQUES', highlight: true },
    { url: 'https://files.catbox.moe/56vtrc.jpg', title: 'PADDOCK MOMENTUM', sub: '03 / BASTIDORES' }
  ];

  return (
    <section id="paddock-gallery-section" className="bg-[#0c0c0c] py-24 relative overflow-hidden border-b border-brand-border backdrop-blur-md">
      <div className="absolute -right-20 top-1/4 opacity-[0.02] select-none pointer-events-none">
        <span className="font-display text-[260px] leading-none text-white italic font-black">GALERIA</span>
      </div>

      <div className="px-6 md:px-10 max-w-[1200px] mx-auto relative z-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-16 gap-4">
          <div>
            <h2 className="font-display text-5xl italic tracking-tight uppercase flex items-center gap-3">
              <Camera className="text-brand-red w-8 h-8 shrink-0" />
              GALERIA DO CIRCUITO
            </h2>
            <p className="font-sans text-xs font-bold text-brand-red tracking-widest uppercase">
              Instantâneos de Alta Performance e Bastidores no Paddock
            </p>
          </div>
          <div className="font-sans text-xs font-semibold text-brand-text-muted select-none">CLIQUE NAS FOTOS PARA AMPLIAR</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-8">
          {images.map((img, i) => (
            <div 
              key={i}
              onClick={() => setActiveLightbox(img.url)}
              className={`flex flex-col gap-6 group hover:-translate-y-2 transition-transform duration-300 cursor-pointer ${img.highlight ? '-mt-8' : ''}`}
            >
              <div className={`relative ${img.highlight ? 'aspect-[4/5] border-4 border-brand-red shadow-[0_0_30px_rgba(227,6,19,0.2)]' : 'aspect-square border border-brand-border/60 grayscale group-hover:grayscale-0'} overflow-hidden rounded-lg shadow-lg`}>
                <img src={img.url} alt={img.title} className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-700" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="bg-brand-red p-3 rounded-full text-white transform scale-75 group-hover:scale-100 transition-transform duration-300 shadow-lg">
                    <Maximize2 className="w-5 h-5" />
                  </div>
                </div>
                <div className={`absolute top-0 left-0 ${img.highlight ? 'bg-brand-red' : 'bg-brand-surface-high'} text-white font-sans text-xs font-extrabold px-3 py-1.5 skew-tag ml-[-10px] border-r border-brand-border uppercase tracking-wider`}>
                  <span className="ml-[10px]">{img.sub}</span>
                </div>
                {img.highlight && (
                  <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black via-black/80 to-transparent">
                    <span className="bg-brand-red text-white text-[10px] px-2 py-0.5 font-sans font-extrabold tracking-widest inline-block mb-1 skew-tag"><span>COPA VERÃO</span></span>
                    <p className="text-xs text-brand-text-muted font-sans font-medium">PILOTOS NO TOPO DO PÓDIO</p>
                  </div>
                )}
              </div>
              <div className={img.highlight ? 'text-center' : i === 2 ? 'text-right' : ''}>
                <h3 className={`font-display ${img.highlight ? 'text-3xl text-brand-red' : 'text-2xl group-hover:text-brand-red'} italic transition-colors`}>{img.title}</h3>
                <div className={`flex justify-between items-center border-t border-brand-border/50 pt-2 mt-2 ${img.highlight ? 'flex-col border-t-0' : ''}`}>
                  <span className="font-sans text-xs font-semibold text-brand-text-muted uppercase">{img.highlight ? 'CONQUISTA RECENTE' : 'CATEGORIA'}</span>
                  <span className={`font-bold ${img.highlight ? 'font-display text-2xl text-[#e2e2e2] mt-0.5 tracking-wider' : 'font-sans text-sm text-brand-text'}`}>{img.highlight ? 'CAMPEÃO DO DESAFIO' : 'A DEFINIR'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {activeLightbox && (
        <div className="fixed inset-0 bg-black/95 z-50 flex flex-col items-center justify-center p-4 backdrop-blur-md transition-all duration-300" onClick={() => setActiveLightbox(null)}>
          <button className="absolute top-6 right-6 text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors cursor-pointer"><X className="w-6 h-6" /></button>
          <div className="relative max-w-4xl max-h-[80vh] overflow-hidden border-2 border-brand-border rounded-lg shadow-2xl bg-[#080808]" onClick={(e) => e.stopPropagation()}>
            <img src={activeLightbox} alt="Ampliada" className="max-w-full max-h-[80vh] object-contain rounded" referrerPolicy="no-referrer" />
          </div>
          <div className="mt-4 text-center"><span className="font-sans text-xs text-brand-text-muted select-none">Clique fora da foto para voltar ao paddock</span></div>
        </div>
      )}
    </section>
  );
}
