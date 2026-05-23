import React, { useState, useEffect } from 'react';
import { 
  Info, 
  Users, 
  Calendar as CalendarIcon, 
  Check, 
  X,
  CreditCard,
  User,
  Zap,
  ChevronLeft,
  ChevronRight,
  Plus
} from 'lucide-react';
import { TimeSlot, Booking } from '../types';
import { useApp } from '../context/AppContext';
import { generateDateOptions } from '../utils/dateUtils';

const paddockBanner = 'https://files.catbox.moe/56vtrc.jpg';

export default function CalendarView() {
  const { 
    slots, profile, quickSelections, handleConfirmBooking 
  } = useApp();

  const [dateOptions] = useState(() => {
    const opts = generateDateOptions(20);
    return opts.map(full => ({
      full,
      label: full.split(',')[0].substring(0, 3).toUpperCase(),
      num: full.split(',')[1].trim().split(' ')[0]
    }));
  });

  const [selectedDay, setSelectedDay] = useState(dateOptions[1] || dateOptions[0]);
  const [activeBookSlot, setActiveBookSlot] = useState<TimeSlot | null>(null);
  
  const [bookName, setBookName] = useState(profile.name || 'Piloto Convidado');
  const [bookKarts, setBookKarts] = useState<number>(quickSelections?.pilots || 1);
  const [bookCategory, setBookCategory] = useState(quickSelections?.category || profile.category || 'Sênior (125cc)');
  const [hasPromoApplied, setHasPromoApplied] = useState(false);
  const [successBookingMsg, setSuccessBookingMsg] = useState<string | null>(null);

  useEffect(() => {
    if (quickSelections) {
      if (quickSelections.date) {
        const foundDay = dateOptions.find(d => d.full === quickSelections.date);
        if (foundDay) setSelectedDay(foundDay);
      }
      if (quickSelections.pilots) setBookKarts(quickSelections.pilots);
      if (quickSelections.category) setBookCategory(quickSelections.category);
      if (quickSelections.pilotName) setBookName(quickSelections.pilotName);
    }
  }, [quickSelections, dateOptions]);

  const handleOpenBooking = (slot: TimeSlot) => {
    setActiveBookSlot(slot);
    setBookName(profile.name || 'Piloto Convidado');
    setBookKarts(Math.min(quickSelections?.pilots || 1, slot.availableKarts));
    setSuccessBookingMsg(null);
  };

  const handleConfirmReservation = () => {
    if (!activeBookSlot) return;
    if (!bookName) {
      alert('Por favor, preencha o Nome do piloto principal.');
      return;
    }
    const calculatedPrice = activeBookSlot.price * bookKarts * (hasPromoApplied ? 0.8 : 1);
    handleConfirmBooking({
      slotId: activeBookSlot.id,
      date: selectedDay.full,
      time: activeBookSlot.time,
      karts: bookKarts,
      category: bookCategory,
      price: calculatedPrice,
      pilotName: bookName,
      phone: profile.phone || '',
      cpf: profile.cpf || ''
    });
    setSuccessBookingMsg(`Excelente! Sua bateria das ${activeBookSlot.time} (${selectedDay.full}) foi confirmada com sucesso.`);
    setTimeout(() => {
      setActiveBookSlot(null);
      setSuccessBookingMsg(null);
      setHasPromoApplied(false);
    }, 4000);
  };

  return (
    <div className="w-full">
      <section className="mb-8 mt-2">
        <h2 className="font-display text-4xl md:text-5xl uppercase italic text-white">RACE SCHEDULE</h2>
        <p className="font-sans text-xs font-bold text-brand-text-muted tracking-widest uppercase">Selecione seu horário • Chegue 30 min antes</p>
      </section>

      <div className="mb-6 bg-brand-red/10 border border-brand-red/30 p-4 rounded-lg flex items-start gap-3">
        <Info className="w-5 h-5 text-brand-red shrink-0 mt-0.5" />
        <div>
          <p className="font-sans text-xs font-bold uppercase tracking-wider text-brand-text mb-1">Aviso importante do Comissariado de Pista</p>
          <p className="font-sans text-xs text-brand-text-muted">A chegada obrigatória é de <strong className="text-white">30 minutos antes</strong> do seu horário agendado.</p>
        </div>
      </div>

      <section className="bg-brand-surface border border-brand-border rounded-xl p-5 mb-8 backdrop-blur-md">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => {
            const idx = dateOptions.findIndex(d => d.num === selectedDay.num);
            if (idx > 0) setSelectedDay(dateOptions[idx - 1]);
          }} className="w-10 h-10 rounded-full bg-brand-surface-high border border-brand-border flex items-center justify-center text-[#9ca3af] hover:text-brand-red cursor-pointer">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="font-display text-2xl font-black uppercase text-white tracking-wide">CALENDÁRIO</span>
          <button onClick={() => {
            const idx = dateOptions.findIndex(d => d.num === selectedDay.num);
            if (idx < dateOptions.length - 1) setSelectedDay(dateOptions[idx + 1]);
          }} className="w-10 h-10 rounded-full bg-brand-surface-high border border-brand-border flex items-center justify-center text-[#9ca3af] hover:text-brand-red cursor-pointer">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="flex overflow-x-auto gap-3.5 pb-2.5 hide-scrollbar scroll-smooth">
          {dateOptions.map((day) => {
            const isSelected = selectedDay.num === day.num;
            return (
              <button key={day.num} onClick={() => setSelectedDay(day)} className={`flex-shrink-0 w-16 h-20 rounded-lg border flex flex-col items-center justify-center cursor-pointer transition-all ${isSelected ? 'bg-brand-red border-brand-red text-white scale-105' : 'bg-brand-surface-high border-brand-border/60 text-[#d4d4d8]'}`}>
                <span className="font-sans text-[10px] font-black tracking-widest">{day.label}</span>
                <span className="font-display text-2xl font-black mt-1">{day.num}</span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        {slots.map((slot) => {
          const isFull = slot.availableKarts === 0;
          return (
            <div key={slot.id} className="bg-brand-surface border border-brand-border/80 rounded-xl relative overflow-hidden backdrop-blur-md flex items-center justify-between p-4 pl-0 border-l-4 border-l-brand-red shadow-lg">
              <div className="flex items-center gap-4">
                <div className="w-24 bg-brand-surface-high/80 border-r border-brand-border/60 h-20 flex flex-col items-center justify-center font-display shrink-0 ml-1 rounded-l-md">
                  <span className="text-2xl font-black text-white font-sans">{slot.time}</span>
                  <span className="text-[10px] font-bold text-brand-text-muted uppercase font-sans tracking-widest">{selectedDay.label}</span>
                </div>
                <div className="flex flex-col gap-2">
                  <h4 className="font-sans text-sm md:text-base font-black tracking-wide text-white uppercase flex items-center gap-2">
                    BATERIA {slot.time}
                    {slot.type && <span className="px-2 py-0.5 text-[8px] font-sans font-black uppercase bg-brand-red/15 border border-brand-red/30 text-brand-red rounded">{slot.type}</span>}
                  </h4>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <div className="bg-emerald-950/30 border border-emerald-500/20 text-emerald-400 font-sans text-xs px-3 py-1 rounded-full flex items-center gap-1 font-bold">
                      <Users className="w-3.5 h-3.5" /><span>{slot.availableKarts} vagas</span>
                    </div>
                    <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 font-sans text-xs px-3 py-1 rounded-full font-bold">R$ {slot.price.toFixed(2)}</div>
                  </div>
                </div>
              </div>
              <div className="flex items-center pr-4">
                {isFull ? (
                  <button disabled className="w-10 h-10 rounded-full bg-brand-surface-high border border-brand-border text-brand-text-muted/30 flex items-center justify-center font-sans font-extrabold text-[10px] uppercase">FULL</button>
                ) : (
                  <button onClick={() => handleOpenBooking(slot)} className="w-10 h-10 rounded-full bg-brand-red hover:bg-[#ff1e27] text-white flex items-center justify-center transition-all cursor-pointer shadow-lg border border-brand-red/45">
                    <Plus className="w-5 h-5 stroke-[3]" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </section>

      <section className="mt-12 rounded-xl overflow-hidden relative h-48 group">
        <img alt="Paddock" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-70" referrerPolicy="no-referrer" src={paddockBanner} />
        <div className="absolute inset-0 bg-gradient-to-r from-[#080808] via-[#080808]/75 to-transparent flex flex-col justify-center px-8 z-10">
          <span className="text-brand-red font-display uppercase tracking-widest text-sm mb-1.5 flex items-center gap-1"><Zap className="w-4 h-4" />Oferta Especial</span>
          <h3 className="text-3xl md:text-4xl font-display italic uppercase text-white leading-none mb-4">MASTER THE TRACK<br />SALVE <span className="text-brand-red">20% OFF</span> EM GRUPOS</h3>
          <button onClick={() => alert('Cupom ATIVADO!')} className="skew-chip bg-white text-black font-sans font-extrabold text-xs uppercase px-5 py-2 hover:bg-brand-red hover:text-white transition-all cursor-pointer w-fit"><span>ATIVAR GRUPO</span></button>
        </div>
      </section>

      {activeBookSlot && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#0b0b0d] border border-brand-border w-full max-w-lg p-6 rounded-lg relative overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-brand-border/60">
              <div>
                <h3 className="font-display text-3xl italic text-brand-red">CONFIRMAR BATERIA</h3>
                <p className="font-sans text-xs text-brand-text-muted uppercase tracking-wider">{selectedDay.full} • {activeBookSlot.time}</p>
              </div>
              <button onClick={() => setActiveBookSlot(null)} className="text-brand-text hover:text-brand-red cursor-pointer"><X className="w-6 h-6" /></button>
            </div>

            {successBookingMsg ? (
              <div className="flex flex-col items-center text-center py-6">
                <div className="w-16 h-16 rounded-full bg-green-950/50 border-2 border-green-500 flex items-center justify-center text-green-400 mb-4 animate-bounce"><Check className="w-10 h-10" /></div>
                <h4 className="font-display text-2xl text-green-400">CONCLUÍDO!</h4>
                <p className="font-sans text-xs text-brand-text-muted mt-2">{successBookingMsg}</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex flex-col gap-1">
                  <label className="font-sans text-xs font-bold uppercase text-brand-text-muted">NOME DO PILOTO PRINCIPAL</label>
                  <div className="relative">
                    <input type="text" value={bookName} onChange={(e) => setBookName(e.target.value)} className="w-full bg-brand-surface text-brand-text p-3 pl-10 border border-brand-border focus:border-brand-red focus:outline-none rounded text-sm" />
                    <User className="w-4 h-4 text-brand-red absolute left-3.5 top-3.5" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="font-sans text-xs font-bold uppercase text-brand-text-muted">KARTS</label>
                    <select value={bookKarts} onChange={(e) => setBookKarts(Number(e.target.value))} className="w-full bg-brand-surface text-brand-text p-3 border border-brand-border rounded text-sm">
                      {Array.from({ length: activeBookSlot.availableKarts }, (_, i) => i + 1).map(n => <option key={n} value={n}>{n} {n === 1 ? 'Kart' : 'Karts'}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-sans text-xs font-bold uppercase text-brand-text-muted">CATEGORIA</label>
                    <select value={bookCategory} onChange={(e) => setBookCategory(e.target.value)} className="w-full bg-brand-surface text-brand-text p-3 border border-brand-border rounded text-sm">
                      {['Sênior (125cc)', 'Cadete (60cc)', 'Super F4 (21hp)'].map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <button onClick={handleConfirmReservation} className="w-full bg-brand-red hover:bg-brand-red-hover text-white py-4 font-display text-2xl uppercase italic rounded transition-all cursor-pointer mt-4">CONFIRMAR GRID</button>
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 h-1 carbon-texture bg-brand-red"></div>
          </div>
        </div>
      )}
    </div>
  );
}
