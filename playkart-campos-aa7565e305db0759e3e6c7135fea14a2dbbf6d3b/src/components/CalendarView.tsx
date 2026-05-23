import { useState, useEffect } from 'react';
import { 
  Info, 
  MapPin, 
  Users, 
  Trophy, 
  Car, 
  Gauge, 
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
import { TimeSlot, Booking, PilotProfile } from '../types';

const paddockBanner = 'https://files.catbox.moe/56vtrc.jpg';

interface CalendarViewProps {
  slots: TimeSlot[];
  bookings: Booking[];
  profile: PilotProfile;
  initialSelections?: { date?: string; pilots?: number; category?: string; pilotName?: string } | null;
  onConfirmBooking: (booking: Omit<Booking, 'id' | 'status'>) => void;
  onNavigate?: (tab: 'home' | 'calendar' | 'ranking' | 'profile') => void;
}

const DAYS_OF_WEEK = [
  { label: 'TER', num: '19', full: 'Terça, 19 Mai 2026' },
  { label: 'QUA', num: '20', full: 'Quarta, 20 Mai 2026' },
  { label: 'QUI', num: '21', full: 'Quinta, 21 Mai 2026' },
  { label: 'SEX', num: '22', full: 'Sexta, 22 Mai 2026' },
  { label: 'SÁB', num: '23', full: 'Sábado, 23 Mai 2026' },
  { label: 'DOM', num: '24', full: 'Domingo, 24 Mai 2026' },
  { label: 'SEG', num: '25', full: 'Segunda, 25 Mai 2026' },
  { label: 'TER', num: '26', full: 'Terça, 26 Mai 2026' },
  { label: 'QUA', num: '27', full: 'Quarta, 27 Mai 2026' },
  { label: 'QUI', num: '28', full: 'Quinta, 28 Mai 2026' },
  { label: 'SEX', num: '29', full: 'Sexta, 29 Mai 2026' },
  { label: 'SÁB', num: '30', full: 'Sábado, 30 Mai 2026' },
  { label: 'DOM', num: '31', full: 'Domingo, 31 Mai 2026' },
  { label: 'SEG', num: '01', full: 'Segunda, 01 Jun 2026' },
  { label: 'TER', num: '02', full: 'Terça, 02 Jun 2026' },
  { label: 'QUA', num: '03', full: 'Quarta, 03 Jun 2026' },
  { label: 'QUI', num: '04', full: 'Quinta, 04 Jun 2026' },
  { label: 'SEX', num: '05', full: 'Sexta, 05 Jun 2026' },
  { label: 'SÁB', num: '06', full: 'Sábado, 06 Jun 2026' },
  { label: 'DOM', num: '07', full: 'Domingo, 07 Jun 2026' }
];

export default function CalendarView({ 
  slots, 
  bookings, 
  profile, 
  initialSelections, 
  onConfirmBooking,
  onNavigate
}: CalendarViewProps) {
  
  // Keep track of selected day (Default QUA 20)
  const [selectedDay, setSelectedDay] = useState(DAYS_OF_WEEK[1]);
  
  // Interactive selected booking modal
  const [activeBookSlot, setActiveBookSlot] = useState<TimeSlot | null>(null);
  
  // Form fields for booking
  const [bookName, setBookName] = useState(profile.name || 'Piloto Convidado');
  const [bookKarts, setBookKarts] = useState<number>(initialSelections?.pilots || 1);
  const [bookCategory, setBookCategory] = useState(initialSelections?.category || profile.category || 'Sênior (125cc)');
  const [hasPromoApplied, setHasPromoApplied] = useState(false);
  const [successBookingMsg, setSuccessBookingMsg] = useState<string | null>(null);
  
  // Custom temporary fields for unregistered guest flows
  const [guestPhone, setGuestPhone] = useState<string>('');
  const [guestCpf, setGuestCpf] = useState<string>('');

  // Sync state whenever quick entry reservations are requested
  useEffect(() => {
    if (initialSelections) {
      if (initialSelections.date) {
        const foundDay = DAYS_OF_WEEK.find(
          d => d.full === initialSelections.date || d.full.toLowerCase().includes(initialSelections.date.toLowerCase())
        );
        if (foundDay) {
          setSelectedDay(foundDay);
        }
      }
      if (initialSelections.pilots) {
        setBookKarts(initialSelections.pilots);
      }
      if (initialSelections.category) {
        setBookCategory(initialSelections.category);
      }
      if (initialSelections.pilotName) {
        setBookName(initialSelections.pilotName);
      }
    }
  }, [initialSelections]);

  const handleOpenBooking = (slot: TimeSlot) => {
    setActiveBookSlot(slot);
    setBookName(profile.name);
    // Limit desired karts by what is available
    setBookKarts(Math.min(initialSelections?.pilots || 1, slot.availableKarts));
    setSuccessBookingMsg(null);
  };

  const handleApplyPromo = () => {
    setHasPromoApplied(true);
  };

  const handleConfirmReservation = () => {
    if (!activeBookSlot) return;
    
    if (!bookName) {
      alert('Por favor, preencha o Nome do piloto principal.');
      return;
    }

    const calculatedPrice = activeBookSlot.price * bookKarts * (hasPromoApplied ? 0.8 : 1);
    
    onConfirmBooking({
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
    
    // Clear slot shortly
    setTimeout(() => {
      setActiveBookSlot(null);
      setSuccessBookingMsg(null);
      setHasPromoApplied(false);
      setGuestPhone('');
      setGuestCpf('');
    }, 4000);
  };

  return (
    <div className="w-full">
      {/* Title */}
      <section className="mb-8 mt-2">
        <h2 className="font-display text-4xl md:text-5xl uppercase italic text-white">
          RACE SCHEDULE
        </h2>
        <p className="font-sans text-xs font-bold text-brand-text-muted tracking-widest uppercase">
          Selecione seu horário • Chegue 30 min antes
        </p>
      </section>

      {/* Critical notice box */}
      <div className="mb-6 bg-brand-red/10 border border-brand-red/30 p-4 rounded-lg flex items-start gap-3">
        <Info className="w-5 h-5 text-brand-red shrink-0 mt-0.5" />
        <div>
          <p className="font-sans text-xs font-bold uppercase tracking-wider text-brand-text mb-1">
            Aviso importante do Comissariado de Pista
          </p>
          <p className="font-sans text-xs text-brand-text-muted">
            A chegada obrigatória é de <strong className="text-white">30 minutos antes</strong> do seu horário agendado para briefing detalhado de telemetria, recepção de lastro e distribuição de macacão e capacete.
          </p>
        </div>
      </div>

      {/* Date Selector Wrapper with header matching the image composition */}
      <section className="bg-brand-surface border border-brand-border rounded-xl p-5 mb-8 backdrop-blur-md">
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => {
              const curIndex = DAYS_OF_WEEK.findIndex(d => d.num === selectedDay.num);
              if (curIndex > 0) {
                setSelectedDay(DAYS_OF_WEEK[curIndex - 1]);
              }
            }}
            className="w-10 h-10 rounded-full bg-brand-surface-high border border-brand-border flex items-center justify-center text-[#9ca3af] hover:text-brand-red hover:border-brand-red transition-all cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2">
            <span className="font-display text-2xl font-black uppercase text-white tracking-wide">
              Mai - Jun 2026
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => {
                const curIndex = DAYS_OF_WEEK.findIndex(d => d.num === selectedDay.num);
                if (curIndex < DAYS_OF_WEEK.length - 1) {
                  setSelectedDay(DAYS_OF_WEEK[curIndex + 1]);
                }
              }}
              className="w-10 h-10 rounded-full bg-brand-surface-high border border-brand-border flex items-center justify-center text-[#9ca3af] hover:text-brand-red hover:border-brand-red transition-all cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <button 
              onClick={() => {
                setSelectedDay(DAYS_OF_WEEK[1]); // Reset to 20 QUA
              }}
              className="w-10 h-10 rounded-full bg-brand-surface-high border border-brand-border flex items-center justify-center text-[#9ca3af] hover:text-brand-red hover:border-brand-red transition-all cursor-pointer"
              title="Hoje"
            >
              <CalendarIcon className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>

        {/* Horizontal Days Scroll */}
        <div className="flex overflow-x-auto gap-3.5 pb-2.5 hide-scrollbar scroll-smooth">
          {DAYS_OF_WEEK.map((day) => {
            const isSelected = selectedDay.num === day.num;
            return (
              <button
                key={day.num}
                onClick={() => setSelectedDay(day)}
                className={`flex-shrink-0 w-16 h-20 rounded-lg border flex flex-col items-center justify-center cursor-pointer transition-all duration-300 relative ${
                  isSelected 
                    ? 'bg-brand-red border-brand-red shadow-[0_4px_15px_rgba(227,6,19,0.4)] scale-105 active-ring text-white' 
                    : 'bg-brand-surface-high border-brand-border/60 text-[#d4d4d8] hover:border-brand-text-muted hover:bg-brand-surface-high/90'
                }`}
              >
                <span className={`font-sans text-[10px] font-black tracking-widest ${
                  isSelected ? 'text-white/80' : 'text-brand-text-muted'
                }`}>
                  {day.label}
                </span>
                <span className={`font-display text-2xl font-black mt-1 ${
                  isSelected ? 'text-white' : 'text-white/95'
                }`}>
                  {day.num}
                </span>
                {isSelected && (
                  <span className="absolute bottom-1.5 w-1 h-1 rounded-full bg-white animate-pulse"></span>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* Slots List styled exactly as high-performance rows with vertical indicators */}
      <section className="flex flex-col gap-4">
        {slots.map((slot) => {
          const isFull = slot.isFull || slot.availableKarts === 0;
          return (
            <div 
              key={slot.id} 
              className="bg-brand-surface border border-brand-border/80 rounded-xl relative overflow-hidden backdrop-blur-md transition-all duration-300 md:hover:border-brand-red flex items-center justify-between p-4 pl-0 border-l-4 border-l-brand-red shadow-lg"
            >
              <div className="flex items-center gap-4">
                {/* Left-most badge with schedule info */}
                <div className="w-24 bg-brand-surface-high/80 border-r border-brand-border/60 h-20 flex flex-col items-center justify-center font-display shrink-0 ml-1 rounded-l-md">
                  <span className="text-2xl font-black text-white leading-tight font-sans tracking-tight">
                    {slot.time}
                  </span>
                  <span className="text-[10px] font-bold text-brand-text-muted uppercase font-sans tracking-widest mt-0.5">
                    {selectedDay.label}
                  </span>
                </div>
                
                {/* Middle Details */}
                <div className="flex flex-col gap-2">
                  <h4 className="font-sans text-sm md:text-base font-black tracking-wide text-white uppercase flex items-center gap-2">
                    BATERIA {slot.time}
                    
                    {slot.type && slot.type !== 'Standard' && (
                      <span className="px-2 py-0.5 text-[8px] font-sans font-black uppercase tracking-wider bg-brand-red/15 border border-brand-red/30 text-brand-red rounded">
                        {slot.type}
                      </span>
                    )}
                  </h4>
                  
                  <div className="flex flex-wrap items-center gap-2.5">
                    {/* Vagas Badge */}
                    <div className="bg-emerald-950/30 border border-emerald-500/20 text-emerald-400 font-sans text-xs px-3 py-1 rounded-full flex items-center gap-1 font-bold">
                      <Users className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{slot.availableKarts} vagas</span>
                    </div>
                    
                    {/* Price Badge */}
                    <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 font-sans text-xs px-3 py-1 rounded-full font-bold">
                      R$ {slot.price.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Circle Button matching the plus screenshot */}
              <div className="flex items-center pr-4">
                {isFull ? (
                  <button 
                    disabled
                    className="w-10 h-10 rounded-full bg-brand-surface-high border border-brand-border text-brand-text-muted/30 flex items-center justify-center font-sans font-extrabold text-[10px] uppercase cursor-not-allowed"
                  >
                    FULL
                  </button>
                ) : (
                  <button 
                    onClick={() => handleOpenBooking(slot)}
                    className="w-10 h-10 rounded-full bg-brand-red hover:bg-[#ff1e27] hover:scale-105 active:scale-95 text-white flex items-center justify-center transition-all cursor-pointer shadow-[0_0_15px_rgba(227,6,19,0.3)] hover:shadow-[0_0_20px_rgba(227,6,19,0.5)] border border-brand-red/45"
                    title="Agendar esta bateria"
                  >
                    <Plus className="w-5 h-5 stroke-[3]" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </section>

      {/* Dynamic Promo Banner */}
      <section className="mt-12 rounded-xl overflow-hidden relative h-48 group">
        <img 
          alt="Karting track paddock" 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-70" 
          referrerPolicy="no-referrer"
          src={paddockBanner}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#080808] via-[#080808]/75 to-transparent flex flex-col justify-center px-8 z-10">
          <span className="text-brand-red font-display uppercase tracking-widest text-sm mb-1.5 flex items-center gap-1">
            <Zap className="w-4 h-4 text-brand-red animate-bounce" />
            Oferta Especial do Paddock
          </span>
          <h3 className="text-3xl md:text-4xl font-display italic uppercase text-white leading-none mb-4">
            MASTER THE TRACK<br />
            SALVE <span className="text-brand-red">20% DE DESCONTO</span> EM GRUPOS
          </h3>
          <div className="flex">
            <button 
              onClick={() => {
                alert('Cupom de desconto "PADDOCK20" ativado para reservas em grupo de 3+ pilotos!');
              }}
              className="skew-chip bg-white text-black font-sans font-extrabold text-xs uppercase px-5 py-2 hover:bg-brand-red hover:text-white transition-all cursor-pointer shadow-md"
            >
              <span>ATIVAR GRUPO</span>
            </button>
          </div>
        </div>
      </section>

      {/* Reservation Dialog / Drawer */}
      {activeBookSlot && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#0b0b0d] border border-brand-border w-full max-w-lg p-6 rounded-lg relative overflow-hidden shadow-2xl">
            
            {/* Header */}
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-brand-border/60">
              <div>
                <h3 className="font-display text-3xl italic text-brand-red">CONFIRMAR BATERIA</h3>
                <p className="font-sans text-xs text-brand-text-muted uppercase tracking-wider">
                  Data: {selectedDay.full} • Horário: {activeBookSlot.time}
                </p>
              </div>
              <button 
                onClick={() => setActiveBookSlot(null)}
                className="text-brand-text hover:text-brand-red p-1 rounded-full cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {successBookingMsg ? (
              <div className="flex flex-col items-center text-center py-6">
                <div className="w-16 h-16 rounded-full bg-green-950/50 border-2 border-green-500 flex items-center justify-center text-green-400 mb-4 animate-bounce">
                  <Check className="w-10 h-10" />
                </div>
                <h4 className="font-display text-2xl text-green-400">AGENDAMENTO CONCLUÍDO!</h4>
                <p className="font-sans text-xs text-brand-text-muted max-w-sm mt-2">
                  {successBookingMsg}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                
                {/* Driver Profile */}
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col gap-1">
                    <label className="font-sans text-xs font-bold uppercase tracking-wider text-brand-text-muted">
                      NOME DO PILOTO PRINCIPAL *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={bookName}
                        onChange={(e) => setBookName(e.target.value)}
                        placeholder="Identifique o competidor..."
                        className="w-full bg-brand-surface text-brand-text p-3 pl-10 border border-brand-border focus:border-brand-red focus:outline-none rounded text-sm font-sans font-medium"
                      />
                      <User className="w-4 h-4 text-brand-red absolute left-3.5 top-3.5" />
                    </div>
                  </div>

                  {profile.isRegistered && (
                    /* Authenticated notification badge */
                    <div className="bg-emerald-950/25 border-l-4 border-l-emerald-500 border border-emerald-500/20 rounded-lg p-3 text-xs text-emerald-400 font-sans mt-1">
                      <span className="font-extrabold uppercase tracking-wider block">
                        ✓ PILOTO ASSOCIADO VINCULADO
                      </span>
                      <p className="text-emerald-300/80 mt-1 leading-relaxed">
                        Estatísticas de <strong className="text-white">{profile.nickname}</strong> e pesagem de <strong className="text-white">{profile.weight || 75}kg</strong> integradas automaticamente para calibração dos bicos injetores do Kart.
                      </p>
                    </div>
                  )}

                </div>

                {/* Grid row: Karts count & Category */}
                <div className="grid grid-cols-2 gap-4">
                  
                  {/* Karts Count */}
                  <div className="flex flex-col gap-1">
                    <label className="font-sans text-xs font-bold uppercase tracking-wider text-brand-text-muted">
                      NÚMERO DE KARTS
                    </label>
                    <select
                      value={bookKarts}
                      onChange={(e) => setBookKarts(Number(e.target.value))}
                      className="w-full bg-brand-surface text-brand-text p-3 border border-brand-border focus:border-brand-red focus:outline-none rounded text-sm cursor-pointer"
                    >
                      {Array.from({ length: activeBookSlot.availableKarts }, (_, i) => i + 1).map(n => (
                        <option key={n} value={n}>{n} {n === 1 ? 'Kart' : 'Karts'}</option>
                      ))}
                    </select>
                  </div>

                  {/* Category */}
                  <div className="flex flex-col gap-1">
                    <label className="font-sans text-xs font-bold uppercase tracking-wider text-brand-text-muted">
                      CATEGORIA KART
                    </label>
                    <select
                      value={bookCategory}
                      onChange={(e) => setBookCategory(e.target.value)}
                      className="w-full bg-brand-surface text-brand-text p-3 border border-brand-border focus:border-brand-red focus:outline-none rounded text-sm cursor-pointer"
                    >
                      <option value="Sênior (125cc)">Sênior (125cc)</option>
                      <option value="Cadete (60cc)">Cadete (60cc)</option>
                      <option value="Super F4 (21hp)">Super F4 (21hp)</option>
                    </select>
                  </div>

                </div>

                {/* Promo application (mock toggle) */}
                <div className="p-3 bg-brand-surface/80 border border-brand-border rounded flex justify-between items-center text-xs">
                  <div>
                    <p className="font-sans font-bold text-brand-text">CUPOM: PADDOCK20</p>
                    <p className="font-sans text-[10px] text-brand-text-muted">Clique para 20% de desconto adicional</p>
                  </div>
                  <button
                    onClick={handleApplyPromo}
                    disabled={hasPromoApplied}
                    className={`px-3 py-1 font-sans font-bold uppercase tracking-widest text-[10px] rounded transition-all cursor-pointer ${
                      hasPromoApplied 
                        ? 'bg-green-600 text-white' 
                        : 'bg-brand-red text-white hover:brightness-110'
                    }`}
                  >
                    {hasPromoApplied ? 'APLICADO' : 'APLICAR'}
                  </button>
                </div>

                {/* Calculations details */}
                <div className="pt-4 border-t border-brand-border/60 flex flex-col gap-1">
                  <div className="flex justify-between text-xs text-brand-text-muted">
                    <span>Taxa base por piloto</span>
                    <span>R$ {activeBookSlot.price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-brand-text-muted">
                    <span>Multiplicador karts (x{bookKarts})</span>
                    <span>R$ {(activeBookSlot.price * bookKarts).toFixed(2)}</span>
                  </div>
                  {hasPromoApplied && (
                    <div className="flex justify-between text-xs text-green-400">
                      <span>Desconto Especial (20%)</span>
                      <span>- R$ {(activeBookSlot.price * bookKarts * 0.2).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-dashed border-brand-border/40">
                    <span className="flex items-center gap-1.5 font-sans">
                      <CreditCard className="w-4 h-4 text-brand-red" />
                      VALOR DO SINAL / GRID
                    </span>
                    <span className="font-mono text-brand-red">
                      R$ {(activeBookSlot.price * bookKarts * (hasPromoApplied ? 0.8 : 1)).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  onClick={handleConfirmReservation}
                  className="w-full bg-brand-red hover:bg-brand-red-hover text-white py-4 font-display text-2xl uppercase italic rounded mechanical-switch cursor-pointer mt-4"
                >
                  CONFIRMAR E REIVINDICAR GRID
                </button>

              </div>
            )}

            {/* Decorative bottom bar mimicking a high-performance tire trail */}
            <div className="absolute bottom-0 left-0 right-0 h-1 carbon-texture bg-brand-red"></div>
          </div>
        </div>
      )}

    </div>
  );
}
