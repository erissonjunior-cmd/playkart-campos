import React, { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const fallbackHeroImg = 'https://files.catbox.moe/sofvhj.jpg';

export default function HeroSection() {
  const { handleNavigate } = useApp();
  const [videoSource, setVideoSource] = useState('https://files.catbox.moe/qzvyae.mp4');
  const [trackStatus] = useState<'ABERTA' | 'CHAFADA' | 'MANUTENÇÃO'>('ABERTA');
  const [temperature, setTemperature] = useState<number | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=-21.7535&longitude=-41.3235&current=temperature_2m');
        const data = await res.json();
        if (data && data.current && typeof data.current.temperature_2m === 'number') {
          setTemperature(Math.round(data.current.temperature_2m));
        }
      } catch (error) {
        console.error("Erro ao buscar a temperatura em tempo real:", error);
      }
    };
    fetchWeather();
    const tempTimer = setInterval(fetchWeather, 300000);
    return () => clearInterval(tempTimer);
  }, []);

  return (
    <section className="relative min-h-[85vh] md:h-[921px] w-full flex items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <video
          key={videoSource}
          autoPlay
          loop
          muted
          playsInline
          onError={() => {
            if (videoSource !== 'https://assets.mixkit.co/videos/preview/mixkit-go-kart-race-on-a-track-34281-large.mp4') {
              setVideoSource('https://assets.mixkit.co/videos/preview/mixkit-go-kart-race-on-a-track-34281-large.mp4');
            }
          }}
          className="w-full h-full object-cover brightness-[0.35] pointer-events-none"
        >
          <source src={videoSource} type="video/mp4" />
          <img 
            alt="Corrida de kart em alta velocidade" 
            className="w-full h-full object-cover brightness-[0.35]" 
            referrerPolicy="no-referrer"
            src={fallbackHeroImg}
          />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent"></div>
      </div>
      
      <div className="relative z-10 px-6 md:px-10 max-w-[1200px] mx-auto w-full pt-20 pb-16">
        <div className="max-w-3xl">
          <div className="flex flex-col gap-3 mb-6">
            <div className="flex flex-wrap items-center gap-3">
              <div className="skew-tag bg-green-600 px-4 py-1.5 flex items-center gap-2 rounded-r-sm shadow-md">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-green-400"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <span className="font-sans text-xs font-semibold uppercase tracking-wider text-white">
                  STATUS DA PISTA: {trackStatus}
                </span>
              </div>
              
              <div className="skew-tag border border-brand-border bg-black/60 backdrop-blur-sm px-4 py-1.5 rounded-l-sm flex items-center gap-2">
                <span className="font-sans text-xs font-semibold uppercase tracking-wider text-[#e2e2e2]">
                  PISTA SECA • {temperature !== null ? `${temperature}°C` : '...'}
                </span>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="skew-tag border border-brand-border bg-black/60 backdrop-blur-sm px-4 py-2 rounded-sm max-w-fit shadow-md">
                <span className="font-sans text-[11px] font-semibold text-[#e2e2e2] tracking-wider uppercase flex items-center gap-2">
                  <span className="text-brand-red font-black text-xs not-italic whitespace-nowrap">📍</span> 
                  Av. Pres. Kennedy - Jóquei club, Campos dos Goytacazes - RJ, 28020-010
                </span>
              </div>
            </div>
          </div>

          <h1 className="font-display text-5xl md:text-8xl italic uppercase leading-[0.9] mb-8 tracking-tighter">
            VELOCIDADE DE PRECISÃO.<br />
            <span className="text-brand-red bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-red-400 drop-shadow-md">
              LIBERE O LIMITE.
            </span>
          </h1>

          <p className="font-sans text-base md:text-lg text-brand-text-muted max-w-xl mb-10 leading-relaxed">
            Experimente o circuito de kart mais avançado da região. Sodi Karts de nível profissional, telemetria em tempo real e um design de pista com especificações FIA.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => handleNavigate('calendar')}
              className="bg-brand-red text-[#fff5f3] font-display text-2xl px-10 py-4 skew-tag mechanical-switch hover:bg-brand-red-hover hover:scale-105 active:scale-95 transition-all text-center cursor-pointer"
            >
              <span>COMECE SUA SESSÃO</span>
            </button>
            
            <button 
              onClick={() => {
                const el = document.getElementById('circuit-specifications');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
                else {
                  alert('As especificações técnicas do paddock foram carregadas! Explore a telemetria e o circuito no bento grid abaixo.');
                }
              }}
              className="border-2 border-brand-text bg-black/30 backdrop-blur-sm text-brand-text font-display text-2xl px-10 py-4 skew-tag hover:bg-brand-text hover:text-black hover:scale-105 active:scale-95 transition-all text-center cursor-pointer"
            >
              <span>EXPLORAR CIRCUITO</span>
            </button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50 hidden sm:flex">
        <span className="font-sans text-xs uppercase tracking-[0.3em] font-semibold text-brand-text-muted animate-pulse">ROLAR</span>
        <div className="w-px h-12 bg-white/40"></div>
      </div>
    </section>
  );
}
