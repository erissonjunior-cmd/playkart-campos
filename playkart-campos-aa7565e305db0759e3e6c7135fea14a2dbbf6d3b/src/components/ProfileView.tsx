import React, { useState } from 'react';
import { 
  User, 
  Settings, 
  TrendingUp, 
  Calendar as CalendarIcon, 
  Trash2, 
  Check, 
  Trophy, 
  Flame, 
  Gauge, 
  Edit3, 
  Mail, 
  Layers 
} from 'lucide-react';
import { PilotProfile, Booking } from '../types';

interface ProfileViewProps {
  profile: PilotProfile;
  bookings: Booking[];
  onUpdateProfile: (updated: PilotProfile) => void;
  onCancelBooking: (id: string) => void;
  onLogout?: () => void;
}

export default function ProfileView({ 
  profile, 
  bookings, 
  onUpdateProfile, 
  onCancelBooking,
  onLogout
}: ProfileViewProps) {
  
  // Interactive editing switches
  const [isEditing, setIsEditing] = useState(false);
  const [nameInput, setNameInput] = useState(profile.name);
  const [nickInput, setNickInput] = useState(profile.nickname);
  const [emailInput, setEmailInput] = useState(profile.email);
  const [catInput, setCatInput] = useState(profile.category);
  const [lvlInput, setLvlInput] = useState(profile.experienceLevel);
  
  const [activeTab, setActiveTab] = useState<'races' | 'edit'>('races');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      ...profile,
      name: nameInput,
      nickname: nickInput.toUpperCase().replace(/\s+/g, '_'),
      email: emailInput,
      category: catInput,
      experienceLevel: lvlInput
    });
    setIsEditing(false);
    setActiveTab('races');
    alert('Perfil de Piloto atualizado com sucesso no painel do paddock!');
  };

  const handleCancelReservation = (id: string, time: string) => {
    if (window.confirm(`Você tem certeza que deseja cancelar sua bateria agendada para as ${time}? Seu reembolso do sinal será estornado no cartão.`)) {
      onCancelBooking(id);
    }
  };

  return (
    <div className="w-full">
      {/* Pilot Header Banner */}
      <section className="relative bg-brand-surface border border-brand-border rounded-lg p-6 md:p-8 mb-8 overflow-hidden backdrop-blur-md">
        <div className="absolute right-0 top-0 opacity-5 pointer-events-none">
          <Settings className="w-48 h-48 text-brand-red rotate-45" />
        </div>
        
        <div className="flex flex-col md:flex-row items-center gap-6 relative z-10 text-center md:text-left">
          
          {/* Avatar frame */}
          <div className="relative">
            <img 
              src={profile.avatar} 
              alt={profile.name} 
              referrerPolicy="no-referrer"
              className="w-24 h-24 rounded-full border-4 border-brand-red shadow-lg object-cover"
            />
            <div className="absolute bottom-0 right-0 bg-[#161618] text-brand-text p-1.5 rounded-full border border-brand-border cursor-pointer hover:bg-brand-red hover:text-white transition-all"
                 onClick={() => {
                   setIsEditing(true);
                   setActiveTab('edit');
                   setNameInput(profile.name);
                   setNickInput(profile.nickname);
                   setEmailInput(profile.email);
                   setCatInput(profile.category);
                   setLvlInput(profile.experienceLevel);
                 }}>
              <Edit3 className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Profile metadata info */}
          <div className="flex-grow">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-3">
              <span className="bg-brand-red/10 border-l border-brand-red px-2.5 py-0.5 font-display text-sm tracking-widest text-brand-red uppercase skew-tag">
                <span>PILOTO: {profile.experienceLevel}</span>
              </span>
              <span className="font-mono text-xs text-brand-text-muted">{profile.email}</span>
            </div>
            
            <h2 className="font-display text-4xl italic text-white mt-2 leading-none">
              {profile.nickname}
            </h2>
            <p className="font-sans text-xs text-brand-text-muted uppercase mt-1 tracking-wider">
              {profile.name} • {profile.category}
            </p>
          </div>

          {/* Action triggers switcher banner */}
          <div className="flex flex-wrap md:flex-nowrap gap-2 items-center">
            <button
               onClick={() => setActiveTab('races')}
               className={`px-5 py-2.5 font-display text-sm uppercase italic skew-tag transition-all cursor-pointer ${
                 activeTab === 'races'
                   ? 'bg-brand-red text-white'
                   : 'bg-[#121214] border border-brand-border text-brand-text hover:bg-brand-surface-high'
               }`}
             >
              <span>MINHAS CORRIDAS</span>
            </button>
            <button
               onClick={() => {
                 setActiveTab('edit');
                 setIsEditing(true);
               }}
               className={`px-5 py-2.5 font-display text-sm uppercase italic skew-tag transition-all cursor-pointer ${
                 activeTab === 'edit'
                   ? 'bg-brand-red text-white'
                   : 'bg-[#121214] border border-brand-border text-brand-text hover:bg-brand-surface-high'
               }`}
             >
              <span>EDITAR PERFIL</span>
            </button>
            {onLogout && (
              <button
                onClick={onLogout}
                className="px-5 py-2.5 font-display text-sm uppercase italic skew-tag bg-transparent border border-brand-red/35 hover:border-brand-red hover:bg-brand-red/10 text-brand-red transition-all cursor-pointer font-bold flex items-center gap-1.5"
                title="Sair do Portal do Piloto"
              >
                <span>SAIR DA CONTA</span>
              </button>
            )}
          </div>

        </div>
      </section>

      {activeTab === 'races' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main List of reservations */}
          <section className="lg:col-span-8 bg-brand-surface border border-brand-border p-6 rounded-lg backdrop-blur-md">
            <h3 className="font-display text-3xl italic text-brand-red mb-6 flex items-center gap-2">
              <CalendarIcon className="w-6 h-6 text-brand-red" />
              MINHAS RESERVAS ATIVAS
            </h3>

            {bookings.length === 0 ? (
              <div className="py-12 text-center text-brand-text-muted flex flex-col items-center">
                <CalendarIcon className="w-12 h-12 text-brand-border mb-3 animate-pulse" />
                <p className="font-sans text-sm">Você não possui nenhuma reserva agendada no momento.</p>
                <p className="font-sans text-xs text-brand-text-muted mt-1">Navegue até o Calendário para reservar seu horário.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div 
                    key={booking.id}
                    className="bg-black/20 border border-brand-border p-5 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 backdrop-blur-xs"
                  >
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-display text-3xl text-brand-red tracking-wide italic">
                          {booking.time}
                        </span>
                        
                        <div className="bg-emerald-950/40 border border-emerald-500/50 px-3 py-0.5 text-[9px] font-sans font-bold text-emerald-400 tracking-wider uppercase rounded">
                          {booking.status}
                        </div>
                      </div>

                      <p className="font-sans text-xs text-white font-semibold mt-1">
                        Data: {booking.date}
                      </p>
                      
                      <div className="flex gap-4 mt-2 font-sans text-[11px] text-brand-text-muted uppercase font-bold tracking-wider">
                        <span>{booking.karts} {booking.karts === 1 ? 'Kart' : 'Karts'} reservados</span>
                        <span>•</span>
                        <span>{booking.category}</span>
                      </div>
                    </div>

                    <div className="flex items-center sm:items-end justify-between sm:flex-col w-full sm:w-auto gap-2 border-t sm:border-t-0 border-brand-border/40 pt-3 sm:pt-0">
                      <div className="flex flex-col text-left sm:text-right">
                        <span className="font-mono text-[10px] text-brand-text-muted uppercase">TOTAL PAGO / SINAL</span>
                        <span className="font-mono text-base font-bold text-white">R$ {booking.price.toFixed(2)}</span>
                      </div>
                      
                      <button
                        onClick={() => handleCancelReservation(booking.id, booking.time)}
                        className="text-white hover:text-brand-red text-xs font-sans font-semibold flex items-center gap-1.5 transition-colors cursor-pointer p-1 border border-transparent rounded hover:border-brand-red/30 hover:bg-brand-red/10"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Cancelar</span>
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Core User stats card panel */}
          <section className="lg:col-span-4 flex flex-col gap-6">
            
            {/* Flame streak */}
            <div className="bg-gradient-to-br from-red-950/20 to-transparent border border-brand-red p-6 rounded-lg text-center relative overflow-hidden flex flex-col items-center">
              <div className="absolute top-2 right-2 opacity-5 pointer-events-none">
                <Flame className="w-16 h-16 text-brand-red" />
              </div>
              <Flame className="w-12 h-12 text-brand-red shrink-0 mb-3 animate-pulse" />
              <span className="font-sans text-xs font-bold text-brand-red tracking-widest uppercase">STREAK DA VOLTA</span>
              <h4 className="font-display text-5xl text-white tracking-widest mt-1">
                {profile.activeStreak} SEMANAS
              </h4>
              <p className="font-sans text-xs text-brand-text-muted mt-2">
                Continue correndo semanalmente para manter o desconto bônus de 5%!
              </p>
            </div>

            {/* PB Metrics box */}
            <div className="bg-brand-surface border border-brand-border p-6 rounded-lg space-y-4 backdrop-blur-md">
              <span className="font-display text-xl text-white block uppercase tracking-wide">
                ANÁLISE DE TEMPOS / PB
              </span>
              
              <div className="space-y-3">
                
                <div>
                  <div className="flex justify-between items-center text-xs font-bold text-brand-text-muted mb-1">
                    <span>SEU MELHOR TEMPO (PB)</span>
                    <span className="font-mono text-white text-sm">{profile.bestLap}</span>
                  </div>
                  <div className="w-full bg-black/40 h-2 border border-brand-border rounded-full overflow-hidden">
                    <div className="w-[88%] bg-brand-red h-full"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center text-xs font-bold text-brand-text-muted mb-1">
                    <span>RECORDE DO CIRCUITO</span>
                    <span className="font-mono text-brand-red text-sm">42:194</span>
                  </div>
                  <div className="w-full bg-black/40 h-2 border border-brand-border rounded-full overflow-hidden">
                    <div className="w-full bg-yellow-500 h-full"></div>
                  </div>
                </div>

                <div className="pt-2 border-t border-brand-border/40 flex justify-between items-center text-xs text-brand-text-muted">
                  <span>Distância para o Líder</span>
                  <span className="font-mono text-brand-red text-xs font-extrabold">+2.458s</span>
                </div>

                <div className="flex justify-between items-center text-xs text-brand-text-muted">
                  <span>Corridas Concluídas</span>
                  <span className="text-white font-bold">{profile.totalRaces}</span>
                </div>

              </div>
            </div>

          </section>

        </div>
      ) : (
        /* Edit Profile Container */
        <section className="bg-brand-surface border border-brand-border p-8 rounded-lg max-w-2xl mx-auto relative overflow-hidden backdrop-blur-md">
          <h3 className="font-display text-3xl italic text-brand-red mb-6 uppercase">
            ATUALIZAR COMPRADOR / PILOTO
          </h3>

          <form onSubmit={handleSaveProfile} className="space-y-5">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Name */}
              <div className="flex flex-col gap-1">
                <label className="font-sans text-xs font-bold text-brand-text-muted tracking-wide uppercase">
                  NOME COMPLETO
                </label>
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  required
                  className="bg-brand-surface-high text-brand-text p-3 border border-brand-border focus:border-brand-red focus:outline-none rounded text-sm font-sans"
                />
              </div>

              {/* Nickname / Call Sign */}
              <div className="flex flex-col gap-1">
                <label className="font-sans text-xs font-bold text-brand-text-muted tracking-wide uppercase">
                  SIGN DE RECONHECIMENTO (APELIDO)
                </label>
                <input
                  type="text"
                  value={nickInput}
                  onChange={(e) => setNickInput(e.target.value)}
                  placeholder="EX: V9_SHIFTER"
                  required
                  className="bg-brand-surface-high text-brand-text p-3 border border-brand-border focus:border-brand-red focus:outline-none rounded text-sm font-sans"
                />
              </div>

            </div>

            {/* Email */}
            <div className="flex flex-col gap-1">
              <label className="font-sans text-xs font-bold text-brand-text-muted tracking-wide uppercase">
                EMAIL DE TELEMETRIA
              </label>
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                required
                className="bg-brand-surface-high text-brand-text p-3 border border-brand-border focus:border-brand-red focus:outline-none rounded text-sm font-sans"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Preference Categoria */}
              <div className="flex flex-col gap-1">
                <label className="font-sans text-xs font-bold text-brand-text-muted tracking-wide uppercase">
                  CATEGORIA FAVORITA
                </label>
                <select
                  value={catInput}
                  onChange={(e) => setCatInput(e.target.value)}
                  className="bg-brand-surface-high text-brand-text p-3 border border-brand-border focus:border-brand-red focus:outline-none rounded text-sm cursor-pointer"
                >
                  <option value="Sênior (125cc)">Sênior (125cc)</option>
                  <option value="Cadete (60cc)">Cadete (60cc)</option>
                  <option value="Super F4 (21hp)">Super F4 (21hp)</option>
                </select>
              </div>

              {/* Nível de Experiência */}
              <div className="flex flex-col gap-1">
                <label className="font-sans text-xs font-bold text-brand-text-muted tracking-wide uppercase">
                  NÍVEL DE PILOTAGEM
                </label>
                <select
                  value={lvlInput}
                  onChange={(e) => setLvlInput(e.target.value as any)}
                  className="bg-brand-surface-high text-brand-text p-3 border border-brand-border focus:border-brand-red focus:outline-none rounded text-sm cursor-pointer"
                >
                  <option value="Iniciante">Iniciante - Aprendiz de Traçado</option>
                  <option value="Intermediário">Intermediário - Amador Constante</option>
                  <option value="Avançado">Avançado - Corredor de Copa</option>
                  <option value="Profissional">Profissional - Licença CBA</option>
                </select>
              </div>

            </div>

            <div className="flex gap-4 pt-4 border-t border-brand-border/40">
              <button
                type="button"
                onClick={() => setActiveTab('races')}
                className="flex-1 bg-transparent border border-brand-border text-brand-text py-3 rounded font-display text-xl uppercase italic cursor-pointer hover:bg-brand-surface-high transition-colors"
                >
                  CANCELAR
              </button>
              
              <button
                type="submit"
                className="flex-1 bg-brand-red text-white py-3 rounded font-display text-xl uppercase italic cursor-pointer mechanical-switch hover:bg-brand-red-hover"
              >
                GRAVAR PERFIL
              </button>
            </div>

          </form>
        </section>
      )}

    </div>
  );
}
