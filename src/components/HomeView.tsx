import { useState, useEffect } from 'react';
import { 
  Timer, 
  Calendar as CalendarIcon, 
  User, 
  Users,
  Gauge, 
  Info, 
  ArrowRight, 
  Trophy,
  ChevronRight,
  Sparkles,
  Camera,
  Maximize2,
  X,
  MapPin
} from 'lucide-react';
import { ActiveTab, RankingDriver } from '../types';

const fallbackHeroImg = 'https://files.catbox.moe/sofvhj.jpg';

interface HomeViewProps {
  onNavigate: (tab: ActiveTab) => void;
  onQuickBook: (date: string, pilots: number, category: string, pilotName?: string) => void;
  rankings: RankingDriver[];
}

export default function HomeView({ onNavigate, onQuickBook, rankings }: HomeViewProps) {
  // Video source state supporting local file or premium cloud sunset kart racing loop fallback
  const [videoSource, setVideoSource] = useState('https://files.catbox.moe/qzvyae.mp4');
  
  // Mock live states
  const [trackStatus, setTrackStatus] = useState<'ABERTA' | 'CHAFADA' | 'MANUTENÇÃO'>('ABERTA');
  const [temperature, setTemperature] = useState<number | null>(null);
  const [countDown, setCountDown] = useState({ minutes: 12, seconds: 45 });
  
  // Lightbox state for the gallery
  const [activeLightbox, setActiveLightbox] = useState<string | null>(null);
  
  // Quick book inputs
  const [pilotName, setPilotName] = useState('Erisson Ribeiro de Souza Junior');
  const [selectedDate, setSelectedDate] = useState('Quarta, 20 Mai 2026');
  const [pilotsCount, setPilotsCount] = useState<number>(2);
  const [selectedCategory, setSelectedCategory] = useState('Sênior (125cc)');

  // Date selection options mapping back to calendar DAYS_OF_WEEK
  const dateOptions = [
    'Quarta, 20 Mai 2026',
    'Quinta, 21 Mai 2026',
    'Sexta, 22 Mai 2026',
    'Sábado, 23 Mai 2026',
    'Domingo, 24 Mai 2026',
    'Segunda, 25 Mai 2026',
    'Terça, 26 Mai 2026',
    'Quarta, 27 Mai 2026',
    'Quinta, 28 Mai 2026',
    'Sexta, 29 Mai 2026',
    'Sábado, 30 Mai 2026',
    'Domingo, 31 Mai 2026',
    'Segunda, 01 Jun 2026',
    'Terça, 02 Jun 2026',
    'Quarta, 03 Jun 2026',
    'Quinta, 04 Jun 2026',
    'Sexta, 05 Jun 2026',
    'Sábado, 06 Jun 2026',
    'Domingo, 07 Jun 2026',
    'Terça, 19 Mai 2026'
  ];
  const pilotsOptions = [1, 2, 3, 4, 5, 8, 10];
  const categoryOptions = ['Sênior (125cc)', 'Cadete (60cc)', 'Super F4 (21hp)'];

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCountDown(prev => {
        if (prev.seconds === 0) {
          if (prev.minutes === 0) {
            return { minutes: 15, seconds: 0 }; // Loop/Reset
          }
          return { minutes: prev.minutes - 1, seconds: 59 };
        }
        return { ...prev, seconds: prev.seconds - 1 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Real-time temperature fetch using Open-Meteo for Campos dos Goytacazes
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
    const tempTimer = setInterval(fetchWeather, 300000); // 5 min interval update
    return () => clearInterval(tempTimer);
  }, []);

  const handleBookSubmit = () => {
    onQuickBook(selectedDate, pilotsCount, selectedCategory, pilotName);
  };

  const top3 = rankings.filter(d => d.rank <= 3).sort((a, b) => a.rank - b.rank);
  // Reorder top3 to show #2, #1, #3 visually
  const p1 = top3.find(d => d.rank === 1);
  const p2 = top3.find(d => d.rank === 2);
  const p3 = top3.find(d => d.rank === 3);

  return (
    <div className="w-full">
      {/* Hero Section */}
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
            {/* Real-time Track indicators */}
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
              
              {/* Location Badge */}
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
                onClick={() => onNavigate('calendar')}
                className="bg-brand-red text-[#fff5f3] font-display text-2xl px-10 py-4 skew-tag mechanical-switch hover:bg-brand-red-hover hover:scale-105 active:scale-95 transition-all text-center cursor-pointer"
              >
                <span>COMECE SUA SESSÃO</span>
              </button>
              
              <button 
                onClick={() => {
                  const el = document.getElementById('about- circuito');
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

        {/* Scroll down indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50 hidden sm:flex">
          <span className="font-sans text-xs uppercase tracking-[0.3em] font-semibold text-brand-text-muted animate-pulse">ROLAR</span>
          <div className="w-px h-12 bg-white/40"></div>
        </div>
      </section>

      {/* Booking & Status Bento Grid */}
      <section className="py-24 px-6 md:px-10 max-w-[1200px] mx-auto" id="booking-section">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Quick Booking Widget */}
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
                
                {/* Row 1: Dados do Piloto */}
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
                      placeholder="Ex: Erisson Ribeiro de Souza Junior"
                      className="bg-brand-surface-high text-brand-text p-4 border border-brand-border/60 hover:border-brand-red focus:border-brand-red focus:outline-none transition-all rounded-lg font-sans text-sm font-semibold tracking-wide placeholder-brand-text-muted/40"
                    />
                  </div>
                </div>

                {/* Row 2: Detalhes da sessão */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  {/* Selecionar Data */}
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

                  {/* Pilotos */}
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

                  {/* Categoria */}
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

          {/* Live Status Sidebar */}
          <div className="md:col-span-5 flex flex-col gap-6">
            
            {/* Map Location Card */}
            <div className="bg-[#121214] border border-brand-border rounded-xl overflow-hidden flex flex-col shadow-2xl backdrop-blur-md">
              <div className="relative h-[250px] w-full overflow-hidden bg-[#18181b] flex items-center justify-center">
                {/* Simulated Map Background */}
                <div className="absolute inset-0 opacity-40">
                  <svg className="w-full h-full" viewBox="0 0 400 250" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M-50,120 L150,50 L250,150 L450,80 M100,250 L200,100 L300,300 M250,0 L150,100 L0,20" stroke="rgba(227,6,19,0.3)" strokeWidth="2" fill="none" />
                    <path d="M-50,220 L150,150 L250,250 L450,180" stroke="rgba(227,6,19,0.15)" strokeWidth="1" fill="none" />
                  </svg>
                </div>
                <div className="absolute inset-0 carbon-texture opacity-50"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#121214]"></div>
                
                {/* Map Pin */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] flex flex-col items-center">
                  <div className="relative flex items-center justify-center mb-2">
                    <div className="absolute w-12 h-12 rounded-full bg-brand-red/30 animate-ping"></div>
                    <div className="w-10 h-10 rounded-full bg-transparent border-4 border-white flex items-center justify-center shadow-[0_4px_15px_rgba(227,6,19,0.6)] z-10" style={{background: 'radial-gradient(circle, #e30613 40%, transparent 45%)'}}></div>
                    {/* Pin tail */}
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

            {/* Smaller existing widgets placed below the map */}
            <div className="grid grid-cols-2 gap-4">
              {/* Live record */}
              <div className="bg-black/40 border border-brand-border p-4 rounded-xl flex flex-col justify-center items-center text-center relative overflow-hidden backdrop-blur-sm">
                <div className="absolute top-2 left-2 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping"></span>
                  <span className="text-[8px] font-sans tracking-widest text-red-500 font-bold uppercase">LIVE</span>
                </div>
                <span className="font-sans text-[9px] font-bold text-brand-red tracking-widest mb-1 uppercase mt-3">
                  RECORDE HOJE
                </span>
                <div className="font-display text-3xl text-[#e2e2e2] tracking-wider my-0.5">
                  42:194
                </div>
                <span className="font-sans text-[9px] font-semibold text-brand-text-muted mt-1 tracking-widest uppercase">
                  MARCO_V8
                </span>
              </div>

              {/* Next Grid Start Countdown */}
              <div className="carbon-texture border border-brand-border p-4 flex flex-col items-center justify-center rounded-xl">
                <span className="font-display text-base italic tracking-wide text-[#e2e2e2] uppercase">
                  LARGADA
                </span>
                <span className="font-sans text-brand-red text-2xl font-extrabold tracking-wider mt-0.5 drop-shadow">
                  {String(countDown.minutes).padStart(2, '0')}:{String(countDown.seconds).padStart(2, '0')}
                </span>
                <span className="font-sans text-[8px] text-brand-text-muted uppercase mt-1 select-none tracking-widest">
                  Grid 3 • 125cc
                </span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Hall of Fame Section */}
      <section className="bg-brand-surface py-24 relative overflow-hidden border-y border-brand-border backdrop-blur-md">
        {/* Decorative Large Text */}
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
              onClick={() => onNavigate('ranking')}
              className="font-sans text-xs font-bold text-brand-text hover:text-brand-red border-b border-brand-text hover:border-brand-red transition-all cursor-pointer flex items-center gap-1 pb-1"
            >
              <span>VER TODOS OS RANKINGS</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-8">
            
            {/* P2 */}
            {p2 && (
              <div className="order-2 md:order-1 flex flex-col gap-6 group hover:-translate-y-2 transition-transform duration-300">
                <div className="relative aspect-square overflow-hidden border border-brand-border/60 grayscale group-hover:grayscale-0 transition-all duration-500 rounded-lg shadow-lg">
                  <img 
                    alt="Piloto em Segundo Lugar" 
                    className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-700" 
                    referrerPolicy="no-referrer"
                    src={p2.avatar}
                  />
                  <div className="absolute top-0 left-0 bg-brand-surface-high text-white font-display text-2xl px-4 py-2 skew-tag ml-[-10px] border-r border-brand-border">
                    <span className="ml-[10px]">#2</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-display text-2xl italic group-hover:text-brand-red transition-colors">
                    {p2.nickname}
                  </h3>
                  <div className="flex justify-between items-center border-t border-brand-border/50 pt-2 mt-2">
                    <span className="font-sans text-xs font-semibold text-brand-text-muted">MELHOR VOLTA</span>
                    <span className="font-sans text-sm font-bold text-brand-text">{p2.bestLap}</span>
                  </div>
                </div>
              </div>
            )}

            {/* P1 (Center / Highlighted) */}
            {p1 && (
              <div className="order-1 md:order-2 flex flex-col gap-6 group -mt-8 hover:-translate-y-2 transition-transform duration-300">
                <div className="relative aspect-[4/5] overflow-hidden border-4 border-brand-red shadow-[0_0_30px_rgba(227,6,19,0.3)] group-hover:shadow-[0_0_50px_rgba(227,6,19,0.55)] transition-all duration-500 rounded-lg">
                  <img 
                    alt="Piloto Campeão" 
                    className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-700" 
                    referrerPolicy="no-referrer"
                    src={p1.avatar}
                  />
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
                  <h3 className="font-display text-3xl italic text-brand-red group-hover:scale-110 transition-transform tracking-tight">
                    {p1.nickname}
                  </h3>
                  <div className="flex flex-col items-center mt-2">
                    <span className="font-sans text-xs font-semibold text-brand-text-muted tracking-widest uppercase">MELHOR VOLTA</span>
                    <span className="font-display text-2xl text-[#e2e2e2] mt-0.5 tracking-wider">{p1.bestLap}</span>
                  </div>
                </div>
              </div>
            )}

            {/* P3 */}
            {p3 && (
              <div className="order-3 flex flex-col gap-6 group hover:-translate-y-2 transition-transform duration-300">
                <div className="relative aspect-square overflow-hidden border border-brand-border/60 grayscale group-hover:grayscale-0 transition-all duration-500 rounded-lg shadow-lg">
                  <img 
                    alt="Piloto em Terceiro Lugar" 
                    className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-700" 
                    referrerPolicy="no-referrer"
                    src={p3.avatar}
                  />
                  <div className="absolute top-0 left-0 bg-brand-surface-high text-white font-display text-2xl px-4 py-2 skew-tag ml-[-10px] border-r border-brand-border">
                    <span className="ml-[10px]">#3</span>
                  </div>
                </div>
                <div className="text-right">
                  <h3 className="font-display text-2xl italic group-hover:text-brand-red transition-colors">
                    {p3.nickname}
                  </h3>
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

      {/* Circuit Photo Gallery Section (Styled after the Hall of Fame) */}
      <section id="paddock-gallery-section" className="bg-[#0c0c0c] py-24 relative overflow-hidden border-b border-brand-border backdrop-blur-md">
        {/* Decorative Grid Pattern/Large background text */}
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
            
            <div className="font-sans text-xs font-semibold text-brand-text-muted select-none">
              CLIQUE NAS FOTOS PARA AMPLIAR
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-8">
            {/* Gallery Photo 1 (Left - Foco) */}
            <div 
              id="gallery-card-foco"
              onClick={() => setActiveLightbox('https://files.catbox.moe/sofvhj.jpg')}
              className="flex flex-col gap-6 group hover:-translate-y-2 transition-transform duration-300 cursor-pointer"
            >
              <div className="relative aspect-square overflow-hidden border border-brand-border/60 grayscale group-hover:grayscale-0 transition-all duration-500 rounded-lg shadow-lg">
                <img 
                  alt="Concentração Pré-Grid" 
                  className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-700" 
                  referrerPolicy="no-referrer"
                  src="https://files.catbox.moe/sofvhj.jpg"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="bg-brand-red p-3 rounded-full text-white transform scale-75 group-hover:scale-100 transition-transform duration-300 shadow-lg">
                    <Maximize2 className="w-5 h-5" />
                  </div>
                </div>
                <div className="absolute top-0 left-0 bg-brand-surface-high text-white font-sans text-xs font-extrabold px-3 py-1.5 skew-tag ml-[-10px] border-r border-brand-border uppercase tracking-wider">
                  <span className="ml-[10px]">01 / FOCO</span>
                </div>
              </div>
              <div>
                <h3 className="font-display text-2xl italic group-hover:text-brand-red transition-colors">
                  CONCENTRAÇÃO PRÉ-GRID
                </h3>
                <div className="flex justify-between items-center border-t border-brand-border/50 pt-2 mt-2">
                  <span className="font-sans text-xs font-semibold text-brand-text-muted">CATEGORIA / PILOTO</span>
                  <span className="font-sans text-sm font-bold text-brand-text">SÊNIOR / EDU_KART</span>
                </div>
              </div>
            </div>

            {/* Gallery Photo 2 (Center - Highlighted Trophy like P1) */}
            <div 
              id="gallery-card-podio"
              onClick={() => setActiveLightbox('https://files.catbox.moe/9ibwct.jpg')}
              className="flex flex-col gap-6 group -mt-8 hover:-translate-y-2 transition-transform duration-300 cursor-pointer"
            >
              <div className="relative aspect-[4/5] overflow-hidden border-4 border-brand-red shadow-[0_0_30px_rgba(227,6,19,0.2)] group-hover:shadow-[0_0_50px_rgba(227,6,19,0.45)] transition-all duration-500 rounded-lg">
                <img 
                  alt="Pódio Copa Verão" 
                  className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-700" 
                  referrerPolicy="no-referrer"
                  src="https://files.catbox.moe/9ibwct.jpg"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="bg-brand-red p-3 rounded-full text-white transform scale-75 group-hover:scale-100 transition-transform duration-300 shadow-lg">
                    <Maximize2 className="w-5 h-5" />
                  </div>
                </div>
                <div className="absolute top-0 left-0 bg-brand-red text-white font-sans text-xs font-extrabold px-4 py-2 skew-tag ml-[-15px] border-r-2 border-white/20 uppercase tracking-wider">
                  <span className="ml-[15px]">02 / DESTAQUES</span>
                </div>
                <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black via-black/80 to-transparent">
                  <span className="bg-brand-red text-white text-[10px] px-2 py-0.5 font-sans font-extrabold tracking-widest inline-block mb-1 skew-tag">
                    <span>COPA VERÃO</span>
                  </span>
                  <p className="text-xs text-brand-text-muted font-sans font-medium">EDUARDO JUNIOR E SEU FILHO NO TOPO DO PÓDIO</p>
                </div>
              </div>
              <div className="text-center">
                <h3 className="font-display text-3xl italic text-brand-red group-hover:scale-105 transition-transform tracking-tight">
                  PÓDIO E FAMÍLIA
                </h3>
                <div className="flex flex-col items-center mt-2">
                  <span className="font-sans text-xs font-semibold text-brand-text-muted tracking-widest uppercase">CONQUISTA RECENTE</span>
                  <span className="font-display text-2xl text-[#e2e2e2] mt-0.5 tracking-wider">CAMPEÃO DO DESAFIO</span>
                </div>
              </div>
            </div>

            {/* Gallery Photo 3 (Right - Bastidores) */}
            <div 
              id="gallery-card-paddock"
              onClick={() => setActiveLightbox('https://files.catbox.moe/56vtrc.jpg')}
              className="flex flex-col gap-6 group hover:-translate-y-2 transition-transform duration-300 cursor-pointer"
            >
              <div className="relative aspect-square overflow-hidden border border-brand-border/60 grayscale group-hover:grayscale-0 transition-all duration-500 rounded-lg shadow-lg">
                <img 
                  alt="Resenha de Paddock" 
                  className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-700" 
                  referrerPolicy="no-referrer"
                  src="https://files.catbox.moe/56vtrc.jpg"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="bg-brand-red p-3 rounded-full text-white transform scale-75 group-hover:scale-100 transition-transform duration-300 shadow-lg">
                    <Maximize2 className="w-5 h-5" />
                  </div>
                </div>
                <div className="absolute top-0 left-0 bg-brand-surface-high text-white font-sans text-xs font-extrabold px-3 py-1.5 skew-tag ml-[-10px] border-r border-brand-border uppercase tracking-wider">
                  <span className="ml-[10px]">03 / BASTIDORES</span>
                </div>
              </div>
              <div className="text-right">
                <h3 className="font-display text-2xl italic group-hover:text-brand-red transition-colors">
                  PADDOCK MOMENTUM
                </h3>
                <div className="flex justify-between items-center border-t border-brand-border/50 pt-2 mt-2">
                  <span className="font-sans text-xs font-semibold text-brand-text-muted">REUNIÃO TÉCNICA</span>
                  <span className="font-sans text-sm font-bold text-brand-text">DICAS DE PISTA</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lightbox Modal Overlay */}
        {activeLightbox && (
          <div 
            id="gallery-lightbox-overlay"
            className="fixed inset-0 bg-black/95 z-50 flex flex-col items-center justify-center p-4 backdrop-blur-md transition-all duration-300"
            onClick={() => setActiveLightbox(null)}
          >
            <button 
              id="lightbox-close-btn"
              onClick={() => setActiveLightbox(null)}
              className="absolute top-6 right-6 text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors cursor-pointer"
              aria-label="Clean close icon"
            >
              <X className="w-6 h-6" />
            </button>
            <div 
              id="lightbox-inner-content"
              className="relative max-w-4xl max-h-[80vh] overflow-hidden border-2 border-brand-border rounded-lg shadow-2xl bg-[#080808]"
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={activeLightbox} 
                alt="Foto Ampliada" 
                className="max-w-full max-h-[80vh] object-contain rounded"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="mt-4 text-center">
              <span className="font-sans text-xs text-brand-text-muted select-none">
                Clique fora da foto para voltar ao paddock
              </span>
            </div>
          </div>
        )}
      </section>

      {/* CTA Section */}
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
              onClick={() => onNavigate('profile')}
              className="bg-white text-black font-display text-2xl px-12 py-5 skew-tag hover:scale-105 active:scale-95 transition-all w-full sm:w-auto text-center cursor-pointer mechanical-switch"
            >
              <span>CRIAR PERFIL / ACESSAR PAINEL</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
