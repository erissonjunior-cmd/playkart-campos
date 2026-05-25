import React, { useState, useEffect } from 'react';
import { Timer, User, Users, Calendar as CalendarIcon, Gauge, Info, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { generateDateOptions } from '../../utils/dateUtils';

export default function BookingWidget() {
  const { handleQuickBook, circuitCurves } = useApp();
  const [pilotName, setPilotName] = useState('');
  const [dateOptions] = useState(generateDateOptions());
  const [selectedDate, setSelectedDate] = useState(dateOptions[0]);
  const [pilotsCount, setPilotsCount] = useState<number>(2);
  const [selectedCategory, setSelectedCategory] = useState('Sênior (125cc)');
  const [countDown, setCountDown] = useState({ minutes: 12, seconds: 45 });

  const pilotsOptions = [1, 2, 3, 4, 5, 8, 10];
  const categoryOptions = ['Sênior (125cc)', 'Cadete (60cc)', 'Super F4 (21hp)'];

  useEffect(() => {
    const timer = setInterval(() => {
      setCountDown(prev => {
        if (prev.seconds === 0) {
          if (prev.minutes === 0) return { minutes: 15, seconds: 0 };
          return { minutes: prev.minutes - 1, seconds: 59 };
        }
        return { ...prev, seconds: prev.seconds - 1 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleBookSubmit = () => {
    handleQuickBook(selectedDate, pilotsCount, selectedCategory, pilotName);
  };

  return (
    <section className="py-24 px-6 md:px-10 max-w-[1200px] mx-auto" id="booking-section">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-7 bg-brand-surface border border-brand-border p-8 md:p-10 flex flex-col justify-between relative overflow-hidden rounded-xl backdrop-blur-md shadow-2xl">
          <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
            <Timer className="w-36 h-36" />
          </div>
          
          <div className="relative z-10 w-full">
            <h2 className="font-display text-4xl italic mb-6 tracking-tight flex items-center gap-3">
              RESERVA DE BATERIA
              <span className="text-brand-red text-xs font-sans tracking-widest uppercase italic font-black bg-brand-red/10 border border-brand-red/20 px-2.5 py-1 rounded">
                ONLINE E TELEMETRIA
              </span>
            </h2>

            <p className="font-sans text-xs text-brand-text-muted mb-8 -mt-2 uppercase tracking-wider font-semibold">
              Monte os parâmetros da sua sessão abaixo para verificar os horários livres na pista real.
            </p>
            
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-5">
                <div className="sm:col-span-12 flex flex-col gap-2">
                  <label className="font-sans text-[11px] font-black text-white tracking-widest uppercase flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-brand-red" />
                    NOME DO PILOTO PRINCIPAL
                  </label>
                  <input
                    type="text"
                    value={pilotName}
                    onChange={(e) => setPilotName(e.target.value)}
                    placeholder="Ex: Seu Nome Completo"
                    className="bg-brand-surface-high text-brand-text p-4 border border-brand-border/60 hover:border-brand-red focus:border-brand-red focus:outline-none transition-all rounded-lg font-sans text-sm font-semibold tracking-wide placeholder-brand-text-muted/40"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="flex flex-col gap-2">
                  <label className="font-sans text-[11px] font-black text-white tracking-widest uppercase flex items-center gap-2">
                    <CalendarIcon className="w-3.5 h-3.5 text-brand-red" />
                    DATA DESIGNADA
                  </label>
                  <select
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="bg-brand-surface-high text-brand-text p-4 border border-brand-border/60 hover:border-brand-red focus:border-brand-red focus:outline-none transition-all rounded-lg cursor-pointer font-sans text-sm font-semibold"
                  >
                    {dateOptions.map(day => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-sans text-[11px] font-black text-white tracking-widest uppercase flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-brand-red" />
                    Nº DE PILOTOS (VAGAS)
                  </label>
                  <select
                    value={pilotsCount}
                    onChange={(e) => setPilotsCount(Number(e.target.value))}
                    className="bg-brand-surface-high text-brand-text p-4 border border-brand-border/60 hover:border-brand-red focus:border-brand-red focus:outline-none transition-all rounded-lg cursor-pointer font-sans text-sm font-semibold"
                  >
                    {pilotsOptions.map(num => (
                      <option key={num} value={num}>{num} {num === 1 ? 'Piloto (Kart único)' : 'Pilotos'}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-sans text-[11px] font-black text-white tracking-widest uppercase flex items-center gap-2">
                    <Gauge className="w-3.5 h-3.5 text-brand-red" />
                    MOTORIZAÇÃO / CAT
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="bg-brand-surface-high text-brand-text p-4 border border-brand-border/60 hover:border-brand-red focus:border-brand-red focus:outline-none transition-all rounded-lg cursor-pointer font-sans text-sm font-semibold"
                  >
                    {categoryOptions.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-brand-border/40 pt-6">
            <div className="flex items-center gap-2 text-brand-red font-sans text-xs font-semibold italic">
              <Info className="w-4 h-4 shrink-0" />
              <span>O piloto líder assume a responsabilidade pelas telemetrias do grupo.</span>
            </div>
            
            <button 
              onClick={handleBookSubmit}
              className="mt-5 w-full bg-brand-red hover:bg-[#ff1e27] text-white font-display text-2xl py-5 hover:tracking-[0.05em] transition-all flex items-center justify-center gap-4 rounded-lg mechanical-switch cursor-pointer shadow-[0_4px_20px_rgba(227,6,19,0.3)] hover:shadow-[0_4px_30px_rgba(227,6,19,0.5)] border border-brand-red/45"
            >
              <span>VERIFICAR DISPONIBILIDADE NA PISTA</span>
              <ArrowRight className="w-6 h-6 stroke-[2]" />
            </button>
          </div>
        </div>

        <div className="md:col-span-5 flex flex-col gap-6">
          {/* Live Circuit Mini-Map */}
          <div className="bg-[#0b0e14] border border-brand-border rounded-xl overflow-hidden shadow-2xl flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-brand-border/50">
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-brand-red animate-ping"></span>
                <span className="font-display text-sm italic text-white uppercase tracking-widest">Grid ao Vivo</span>
              </div>
              <span className="text-[9px] font-black text-brand-red uppercase tracking-[0.2em]">Circuit_Map_v1.2</span>
            </div>

            {/* Map Area */}
            <div className="relative aspect-square w-full bg-[#080a0e] overflow-hidden flex items-center justify-center">
              {/* Grid background */}
              <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px]"></div>

              {/* Circuit image / Blueprint */}
              <img
                src={JSON.parse(localStorage.getItem('kart_circuit_data') || '{}').blueprintImage || "https://files.catbox.moe/rbtosq.png"}
                alt="Traçado"
                className="w-[88%] h-[88%] object-contain opacity-40 brightness-150 contrast-125 saturate-0"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />

              {/* Curve / Tyre markers */}
              {circuitCurves.map((curve) => (
                <div
                  key={curve.id}
                  className="absolute -translate-x-1/2 -translate-y-1/2 group/pt z-10"
                  style={{ left: `${curve.x}%`, top: `${curve.y}%` }}
                >
                  <div className="relative w-5 h-5 flex items-center justify-center transition-all group-hover/pt:scale-150">
                    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_8px_rgba(0,0,0,0.9)]">
                      <circle cx="50" cy="50" r="45" fill="#141416" stroke="#2a2a2e" strokeWidth="8" />
                      <circle cx="50" cy="50" r="30" fill="none"
                        stroke={curve.type === 'Alta' ? '#ef4444' : curve.type === 'Média' ? '#f97316' : '#06b6d4'}
                        strokeWidth="7"
                      />
                      <circle cx="50" cy="50" r="16" fill="#080808" />
                    </svg>
                    <div className={`absolute inset-0 rounded-full blur-md opacity-0 group-hover/pt:opacity-50 transition-opacity ${
                      curve.type === 'Alta' ? 'bg-red-500' : curve.type === 'Média' ? 'bg-orange-500' : 'bg-cyan-500'
                    }`}></div>
                  </div>
                  {/* Tooltip */}
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/90 backdrop-blur-md px-2 py-0.5 rounded border border-white/20 whitespace-nowrap opacity-0 group-hover/pt:opacity-100 transition-all pointer-events-none text-[8px] font-black text-white uppercase z-50">
                    {curve.name}
                  </div>
                </div>
              ))}

              {/* Kart Grid Markers */}
              {[
                { id: 'k1', number: 1, pilot: 'Erisson Jr.',  x: 46, y: 13, color: '#ef4444' },
                { id: 'k2', number: 2, pilot: 'Sarah Shift',  x: 49, y: 13, color: '#f97316' },
                { id: 'k3', number: 3, pilot: 'Carlos D.',    x: 52, y: 13, color: '#06b6d4' },
                { id: 'k4', number: 4, pilot: 'Marcus V.',    x: 46, y: 10, color: '#a855f7' },
                { id: 'k5', number: 5, pilot: 'Ana P.',       x: 49, y: 10, color: '#22c55e' },
              ].map((kart) => (
                <div
                  key={kart.id}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group/kart"
                  style={{ left: `${kart.x}%`, top: `${kart.y}%` }}
                >
                  <div
                    className="w-4 h-4 rounded-sm flex items-center justify-center text-white font-black text-[8px] shadow-lg cursor-default transition-all group-hover/kart:scale-150 border border-white/30"
                    style={{ backgroundColor: kart.color, boxShadow: `0 0 8px ${kart.color}66` }}
                  >
                    {kart.number}
                  </div>
                  {/* Kart Tooltip */}
                  <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-black/90 backdrop-blur-md px-2 py-0.5 rounded border border-white/20 whitespace-nowrap opacity-0 group-hover/kart:opacity-100 transition-all pointer-events-none text-[8px] font-black uppercase z-50"
                    style={{ color: kart.color }}
                  >
                    #{kart.number} {kart.pilot}
                  </div>
                </div>
              ))}

              {/* HUD Corner label */}
              <div className="absolute top-3 left-3 pointer-events-none">
                <span className="text-[8px] font-black text-brand-red/60 uppercase tracking-[0.25em]">Sectors: {circuitCurves.length}</span>
              </div>
              <div className="absolute top-3 right-3 pointer-events-none">
                <span className="text-[8px] font-black text-white/30 uppercase tracking-[0.25em]">Karts: 5</span>
              </div>
            </div>

            {/* Legend Row */}
            <div className="px-5 py-3 border-t border-brand-border/50 flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-wider text-brand-text-muted">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full border-2 border-red-500 bg-black inline-block"></span>Alta</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full border-2 border-orange-500 bg-black inline-block"></span>Média</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full border-2 border-cyan-500 bg-black inline-block"></span>Baixa</span>
              </div>
              <div className="flex items-center gap-1 text-[9px] font-black uppercase tracking-wider text-brand-text-muted">
                <span className="w-3 h-3 rounded-sm bg-brand-red inline-block"></span>Kart
              </div>
            </div>
          </div>

          {/* Bottom info row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-black/40 border border-brand-border p-4 rounded-xl flex flex-col justify-center items-center text-center relative overflow-hidden backdrop-blur-sm">
              <div className="absolute top-2 left-2 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping"></span>
                <span className="text-[8px] font-sans tracking-widest text-red-500 font-bold uppercase">LIVE</span>
              </div>
              <span className="font-sans text-[9px] font-bold text-brand-red tracking-widest mb-1 uppercase mt-3">RECORDE HOJE</span>
              <div className="font-display text-3xl text-[#e2e2e2] tracking-wider my-0.5">--:---</div>
              <span className="font-sans text-[9px] font-semibold text-brand-text-muted mt-1 tracking-widest uppercase">A DEFINIR</span>
            </div>

            <div className="carbon-texture border border-brand-border p-4 flex flex-col items-center justify-center rounded-xl">
              <span className="font-display text-base italic tracking-wide text-[#e2e2e2] uppercase">LARGADA</span>
              <span className="font-sans text-brand-red text-2xl font-extrabold tracking-wider mt-0.5 drop-shadow">
                {String(countDown.minutes).padStart(2, '0')}:{String(countDown.seconds).padStart(2, '0')}
              </span>
              <span className="font-sans text-[8px] text-brand-text-muted uppercase mt-1 select-none tracking-widest">Grid 3 • 125cc</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
