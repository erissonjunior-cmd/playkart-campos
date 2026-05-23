import React, { useState, useEffect } from 'react';
import { Timer, User, Users, Calendar as CalendarIcon, Gauge, Info, ArrowRight, MapPin } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { generateDateOptions } from '../../utils/dateUtils';

export default function BookingWidget() {
  const { handleQuickBook } = useApp();
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
              <span>VERIFICAR DISPONIBILIDADE NA DISP_PISTA</span>
              <ArrowRight className="w-6 h-6 stroke-[2]" />
            </button>
          </div>
        </div>

        <div className="md:col-span-5 flex flex-col gap-6">
          <div className="bg-[#121214] border border-brand-border rounded-xl overflow-hidden flex flex-col shadow-2xl backdrop-blur-md">
            <div className="relative h-[250px] w-full overflow-hidden bg-[#18181b] flex items-center justify-center">
              <div className="absolute inset-0 opacity-40">
                <svg className="w-full h-full" viewBox="0 0 400 250" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M-50,120 L150,50 L250,150 L450,80 M100,250 L200,100 L300,300 M250,0 L150,100 L0,20" stroke="rgba(227,6,19,0.3)" strokeWidth="2" fill="none" />
                  <path d="M-50,220 L150,150 L250,250 L450,180" stroke="rgba(227,6,19,0.15)" strokeWidth="1" fill="none" />
                </svg>
              </div>
              <div className="absolute inset-0 carbon-texture opacity-50"></div>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#121214]"></div>
              
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] flex flex-col items-center">
                <div className="relative flex items-center justify-center mb-2">
                  <div className="absolute w-12 h-12 rounded-full bg-brand-red/30 animate-ping"></div>
                  <div className="w-10 h-10 rounded-full bg-transparent border-4 border-white flex items-center justify-center shadow-[0_4px_15px_rgba(227,6,19,0.6)] z-10" style={{background: 'radial-gradient(circle, #e30613 40%, transparent 45%)'}}></div>
                  <div className="absolute -bottom-3 w-0 h-0 border-l-8 border-r-8 border-t-[12px] border-l-transparent border-r-transparent border-t-white z-0"></div>
                </div>
              </div>
              
              <span className="absolute bottom-6 font-sans text-sm font-semibold text-white drop-shadow-lg text-center px-4">
                Av. Pres. Kennedy - Jóquei club,<br/>Campos de Goyatcazes - RJ
              </span>
            </div>

            <div className="p-8 flex flex-col items-center text-center">
              <span className="font-sans text-[11px] font-black tracking-widest uppercase text-brand-red mb-3">
                LOCALIZAÇÃO DO EVENTO
              </span>
              <p className="font-sans text-sm font-semibold text-[#e2e2e2] mb-6 leading-relaxed">
                Av. Pres. Kennedy - Jóquei club,<br/>Campos dos Goytacazes - RJ,<br/>28020-010
              </p>
              <a 
                href="https://maps.google.com/?q=Av.+Pres.+Kennedy+-+Jóquei+club,+Campos+dos+Goytacazes+-+RJ,+28020-010" 
                target="_blank"
                rel="noopener noreferrer"
                className="bg-brand-red hover:bg-[#ff1e27] text-white font-sans text-xs font-black px-8 py-3.5 rounded tracking-widest uppercase flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-[0_4px_15px_rgba(227,6,19,0.3)] cursor-pointer"
              >
                VER ROTA
                <MapPin className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-black/40 border border-brand-border p-4 rounded-xl flex flex-col justify-center items-center text-center relative overflow-hidden backdrop-blur-sm">
              <div className="absolute top-2 left-2 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping"></span>
                <span className="text-[8px] font-sans tracking-widest text-red-500 font-bold uppercase">LIVE</span>
              </div>
              <span className="font-sans text-[9px] font-bold text-brand-red tracking-widest mb-1 uppercase mt-3">
                RECORDE HOJE
              </span>
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
