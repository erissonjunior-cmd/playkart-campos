import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  Bell, 
  User, 
  Home, 
  Calendar as CalendarIcon, 
  Trophy, 
  Globe, 
  Share2,
  X,
  Plus,
  LogIn,
  LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { ActiveTab, TimeSlot, Booking, PilotProfile, RankingDriver } from './types';
import { 
  INITIAL_TIME_SLOTS, 
  INITIAL_RANKINGS, 
  INITIAL_PILOT_PROFILE, 
  INITIAL_BOOKINGS,
  loadFromLocalStorage,
  saveToLocalStorage 
} from './data';

import HomeView from './components/HomeView';
import CalendarView from './components/CalendarView';
import RankingView from './components/RankingView';
import ProfileView from './components/ProfileView';
import AuthView from './components/AuthView';
import AdminView from './components/AdminView';

export default function App() {
  
  // Set up active state navigation
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  
  // Quick booking selections to pass into CalendarView if selected
  const [quickSelections, setQuickSelections] = useState<{ date?: string; pilots?: number; category?: string; pilotName?: string } | null>(null);

  // Core application states with LocalStorage persistence
  const [profile, setProfile] = useState<PilotProfile>(() => {
    const loaded = loadFromLocalStorage<PilotProfile>('pk_campos_profile', INITIAL_PILOT_PROFILE);
    if (loaded && (loaded.name === 'Eduardo Silva' || loaded.name === 'Eduardo Ribeiro Junior' || (loaded.avatar && (loaded.avatar.includes('picsum.photos') || loaded.avatar.includes('9ibwct.jpg'))))) {
      return INITIAL_PILOT_PROFILE;
    }
    return loaded;
  });

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => 
    loadFromLocalStorage<boolean>('pk_campos_is_logged_in', false)
  );

  const [registeredPilots, setRegisteredPilots] = useState<PilotProfile[]>(() => {
    const loaded = loadFromLocalStorage<PilotProfile[]>('pk_campos_registered_pilots', []);
    const adminAccount: PilotProfile = {
      name: 'Administrador do Sistema',
      nickname: 'ADMIN',
      email: 'admin@playkart.com',
      category: 'Staff',
      experienceLevel: 'Profissional',
      activeStreak: 0,
      totalRaces: 0,
      bestLap: '',
      avatar: '',
      phone: '(22) 99999-9999',
      whatsapp: '(22) 99999-9999',
      password: 'playkart2026',
      isRegistered: true,
      role: 'admin'
    };
    // Garante que o admin SEMPRE exista, mesmo que ja haja outros pilotos
    const hasAdmin = loaded.some(p => p.email === 'admin@playkart.com');
    return hasAdmin ? loaded : [adminAccount, ...loaded];
  });

  const [slots, setSlots] = useState<TimeSlot[]>(() => 
    loadFromLocalStorage<TimeSlot[]>('pk_campos_slots', INITIAL_TIME_SLOTS)
  );

  const [bookings, setBookings] = useState<Booking[]>(() => 
    loadFromLocalStorage<Booking[]>('pk_campos_bookings', INITIAL_BOOKINGS)
  );

  const [rankings, setRankings] = useState<RankingDriver[]>(() => {
    const loaded = loadFromLocalStorage<RankingDriver[]>('pk_campos_rankings', INITIAL_RANKINGS);
    if (loaded && loaded.length > 0 && loaded[0].avatar && (loaded[0].avatar.includes('lh3.googleusercontent.com') || loaded[0].avatar.includes('champ_trophy_son') || loaded[0].avatar.includes('9ibwct.jpg'))) {
      return INITIAL_RANKINGS;
    }
    return loaded;
  });

  // Persist states to LocalStorage on updates
  useEffect(() => {
    saveToLocalStorage('pk_campos_profile', profile);
  }, [profile]);

  useEffect(() => {
    saveToLocalStorage('pk_campos_is_logged_in', isLoggedIn);
  }, [isLoggedIn]);

  useEffect(() => {
    saveToLocalStorage('pk_campos_registered_pilots', registeredPilots);
  }, [registeredPilots]);

  useEffect(() => {
    saveToLocalStorage('pk_campos_slots', slots);
  }, [slots]);

  useEffect(() => {
    saveToLocalStorage('pk_campos_bookings', bookings);
  }, [bookings]);

  useEffect(() => {
    saveToLocalStorage('pk_campos_rankings', rankings);
  }, [rankings]);

  // Mobile drawer trigger
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // States for embedded login in the menu bar
  const [navEmail, setNavEmail] = useState('');
  const [navPassword, setNavPassword] = useState('playkart2026');
  const [navError, setNavError] = useState<string | null>(null);
  const [showNavDropdown, setShowNavDropdown] = useState(false);

  const handleNavLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setNavError(null);
    if (!navEmail) {
      setNavError('Insira o e-mail');
      return;
    }
    const found = registeredPilots.find(
      p => p.email.toLowerCase() === navEmail.toLowerCase() && (p.password || 'playkart2026') === navPassword
    );
    if (found) {
      setProfile(found);
      setIsLoggedIn(true);
      setShowNavDropdown(false);
      setNavEmail('');
      setNavPassword('playkart2026');
      alert(`Bem-vindo de volta, ${found.nickname}! Cockpit liberado.`);
    } else {
      setNavError('Credenciais inválidas');
    }
  };

  const handleNavQuickLogin = (pilot: PilotProfile) => {
    setProfile(pilot);
    setIsLoggedIn(true);
    setShowNavDropdown(false);
    setNavEmail('');
    setNavPassword('playkart2026');
    setNavError(null);
    alert(`Acesso Rápido: Bem-vindo de volta, ${pilot.nickname}!`);
  };

  // Navigation controller helper
  const handleNavigate = (tab: ActiveTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Trigger quick book from header or widget
  const handleQuickBook = (date: string, pilots: number, category: string, pilotName?: string) => {
    setQuickSelections({ date, pilots, category, pilotName });
    setActiveTab('calendar');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Confirm booking callback (reduces slot and adds booking item)
  const handleConfirmBooking = (newBookingData: Omit<Booking, 'id' | 'status'>) => {
    const bookingId = `booking-${Date.now()}`;
    const newReservation: Booking = {
      ...newBookingData,
      id: bookingId,
      status: 'Confirmada'
    };

    // Update bookings list
    setBookings(prev => [newReservation, ...prev]);

    // Update slot counts
    setSlots(currentSlots => 
      currentSlots.map(slot => {
        if (slot.id === newBookingData.slotId) {
          const nextKarts = Math.max(0, slot.availableKarts - newBookingData.karts);
          return {
            ...slot,
            availableKarts: nextKarts,
            isFull: nextKarts === 0
          };
        }
        return slot;
      })
    );

    // Update Pilot total races statistical count
    setProfile(prev => ({
      ...prev,
      totalRaces: prev.totalRaces + 1
    }));
  };

  // Cancel reservation callback
  const handleCancelBooking = (id: string) => {
    const backupBooking = bookings.find(b => b.id === id);
    if (!backupBooking) return;

    // Refund / Reclaim slot tickets
    setSlots(currentSlots => 
      currentSlots.map(slot => {
        if (slot.id === backupBooking.slotId) {
          const nextKarts = Math.min(slot.totalKarts, slot.availableKarts + backupBooking.karts);
          return {
            ...slot,
            availableKarts: nextKarts,
            isFull: nextKarts === 0
          };
        }
        return slot;
      })
    );

    // Remove reservation
    setBookings(prev => prev.filter(b => b.id !== id));

    // Despawn Total statistical racing runs
    setProfile(prev => ({
      ...prev,
      totalRaces: Math.max(0, prev.totalRaces - 1)
    }));
  };

  // Admin Update slot callback
  const handleUpdateSlot = (updatedSlot: TimeSlot) => {
    setSlots(current => current.map(s => s.id === updatedSlot.id ? updatedSlot : s));
    alert('Sessão atualizada com sucesso!');
  };

  // Profile metadata update callback
  const handleUpdateProfile = (updated: PilotProfile) => {
    setProfile(updated);
    setRegisteredPilots(prev => prev.map(p => p.email.toLowerCase() === updated.email.toLowerCase() ? updated : p));
  };

  // Authentication callbacks
  const handleLoginSuccess = (user: PilotProfile) => {
    setProfile(user);
    setIsLoggedIn(true);
    alert(`Painel de Telemetria liberado para o Piloto: ${user.nickname}!`);
  };

  const handleRegisterPilot = (newPilot: PilotProfile) => {
    setRegisteredPilots(prev => [...prev, newPilot]);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setProfile({
      name: 'Piloto Convidado',
      nickname: 'CONVIDADO',
      email: 'convidado@playkart.com',
      category: 'Sênior (125cc)',
      activeStreak: 0,
      totalRaces: 0,
      bestLap: '49:990',
      avatar: 'https://picsum.photos/seed/guest/200/200',
      experienceLevel: 'Iniciante'
    });
    alert('Sessão encerrada. Volte sempre ao Grid!');
  };

  // Notification action triggers
  const triggerNotificationAlert = () => {
    alert('Nenhum briefing pendente no paddock para hoje. Todos os karts em manutenção estão prontos e aferidos pela equipe de mecânicos.');
  };

  return (
    <div className="bg-brand-bg text-brand-text font-sans overflow-x-hidden min-h-screen flex flex-col pb-20 md:pb-0">
      
      {/* Top Navbar */}
      <nav className="sticky top-0 w-full z-40 border-b border-brand-border bg-[#080808]/90 backdrop-blur-md">
        <div className="flex justify-between items-center px-6 md:px-10 h-20 max-w-[1240px] mx-auto">
          
          {/* Logo brand */}
          <div 
            onClick={() => handleNavigate('home')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <span className="font-display text-4xl tracking-normal text-white flex items-center gap-2.5 group-hover:scale-105 transition-transform duration-300">
              <span className="italic">PLAY<span className="text-brand-red">KART</span></span>
              <span className="font-sans text-[10px] font-black uppercase tracking-[0.2em] text-[#d4d4d8] bg-brand-surface-high border border-brand-border px-2 py-0.5 rounded-sm select-none not-italic">
                CAMPOS
              </span>
            </span>
          </div>

          {/* Core Desktop Navbar links */}
          <div className="hidden md:flex items-center gap-8">
            <button 
              onClick={() => handleNavigate('home')}
              className={`font-sans text-xs font-bold tracking-widest uppercase pb-1 border-b-2 cursor-pointer transition-colors ${
                activeTab === 'home' 
                  ? 'text-brand-red border-brand-red' 
                  : 'text-[#e2e2e2] border-transparent hover:text-brand-red'
              }`}
            >
              Início
            </button>
            <button 
              onClick={() => handleNavigate('calendar')}
              className={`font-sans text-xs font-bold tracking-widest uppercase pb-1 border-b-2 cursor-pointer transition-colors ${
                activeTab === 'calendar' 
                  ? 'text-brand-red border-brand-red' 
                  : 'text-[#e2e2e2] border-transparent hover:text-brand-red'
              }`}
            >
              Reservas
            </button>
            <button 
              onClick={() => handleNavigate('ranking')}
              className={`font-sans text-xs font-bold tracking-widest uppercase pb-1 border-b-2 cursor-pointer transition-colors ${
                activeTab === 'ranking' 
                  ? 'text-brand-red border-brand-red' 
                  : 'text-[#e2e2e2] border-transparent hover:text-brand-red'
              }`}
            >
              Rankings
            </button>
            <button 
              onClick={() => handleNavigate('profile')}
              className={`font-sans text-xs font-bold tracking-widest uppercase pb-1 border-b-2 cursor-pointer transition-colors ${
                activeTab === 'profile' 
                  ? 'text-brand-red border-brand-red' 
                  : 'text-[#e2e2e2] border-transparent hover:text-brand-red'
              }`}
            >
              Portal do Piloto
            </button>
            {isLoggedIn && profile.role === 'admin' && (
              <button 
                onClick={() => handleNavigate('admin')}
                className={`font-sans text-xs font-bold tracking-widest uppercase pb-1 border-b-2 cursor-pointer transition-colors ${
                  activeTab === 'admin' 
                    ? 'text-brand-red border-brand-red' 
                    : 'text-[#e2e2e2] border-transparent hover:text-brand-red'
                }`}
              >
                Painel Admin
              </button>
            )}
          </div>

          {/* Primary Call Action elements */}
          <div className="flex items-center gap-4">
            
            <button 
              onClick={() => handleNavigate('calendar')}
              className="hidden md:block bg-brand-red text-white font-display text-sm px-6 py-2.5 tracking-widest rounded-sm mechanical-switch hover:bg-brand-red-hover active:scale-95 transition-all cursor-pointer"
            >
              RESERVE AGORA
            </button>

            {/* Notification alert */}
            <button 
              onClick={triggerNotificationAlert}
              className="text-[#e2e2e2] hover:text-brand-red p-1 rounded-full cursor-pointer transition-colors"
              title="Notificações do Paddock"
            >
              <Bell className="w-6 h-6" />
            </button>

            {/* Profile trigger & Menu-integrated Dropdown Login */}
            <div className="relative">
              <button 
                onClick={() => {
                  if (isLoggedIn) {
                    handleNavigate('profile');
                  } else {
                    setShowNavDropdown(prev => !prev);
                  }
                }}
                className="text-[#e2e2e2] hover:text-brand-red p-1 rounded-full cursor-pointer transition-all flex items-center gap-2"
                title={isLoggedIn ? `Acessar Painel: ${profile.nickname}` : "Entrar / Login Rápido no Menu"}
              >
                {isLoggedIn ? (
                  <div className="flex items-center gap-2">
                    <img 
                      src={profile.avatar} 
                      alt={profile.nickname}
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 rounded-full border border-brand-red object-cover hidden sm:block shadow-[0_0_8px_rgba(227,6,19,0.3)]" 
                    />
                    <span className="hidden lg:inline-block font-sans text-[10px] font-black uppercase tracking-wider text-white bg-[#1a1a1f] border border-brand-border px-2 py-1 rounded select-none">
                      {profile.nickname}
                    </span>
                    <User className="w-5 h-5 sm:hidden" />
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-red hover:bg-[#ff1e27] text-white font-sans text-xs font-black uppercase tracking-wider rounded transition-colors shadow-md">
                    <LogIn className="w-3.5 h-3.5 shrink-0" />
                    <span className="hidden sm:inline">CONTA</span>
                  </div>
                )}
              </button>

              {/* Float container dropdown for fast checkout-compatible inline login */}
              <AnimatePresence>
                {!isLoggedIn && showNavDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 12, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 12, scale: 0.95 }}
                    transition={{ duration: 0.18 }}
                    className="absolute right-0 mt-3 w-80 bg-[#121214] border border-brand-border rounded-lg p-5 shadow-2xl z-50 text-left font-sans"
                  >
                    <div className="flex justify-between items-center mb-4 pb-2 border-b border-brand-border/40">
                      <span className="font-display text-sm italic text-brand-red font-black tracking-wider uppercase">
                        ACESSAR COCKPIT
                      </span>
                      <button 
                        type="button"
                        onClick={() => setShowNavDropdown(false)}
                        className="text-brand-text-muted hover:text-white transition-colors cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {navError && (
                      <div className="bg-brand-red/10 border border-brand-red/40 text-brand-red text-[11px] p-2.5 rounded mb-3 font-medium">
                        {navError}
                      </div>
                    )}

                    <form onSubmit={handleNavLogin} className="space-y-3.5">
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-extrabold text-brand-text-muted tracking-widest uppercase">
                          SEU E-MAIL
                        </label>
                        <input
                          type="email"
                          value={navEmail}
                          onChange={(e) => setNavEmail(e.target.value)}
                          placeholder="Ex: eduardo@playkart.com"
                          required
                          className="bg-brand-surface text-brand-text p-2.5 border border-brand-border focus:border-brand-red focus:outline-none rounded text-xs font-semibold"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-extrabold text-[#9da3af] tracking-widest uppercase">
                          SENHA SECRETA
                        </label>
                        <input
                          type="password"
                          value={navPassword}
                          onChange={(e) => setNavPassword(e.target.value)}
                          placeholder="Sua senha"
                          required
                          className="bg-brand-surface text-brand-text p-2.5 border border-brand-border focus:border-brand-red focus:outline-none rounded text-xs font-semibold"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-brand-red hover:bg-[#ff1e27] text-white font-display text-xs py-2.5 px-4 rounded transition-colors tracking-widest uppercase font-black cursor-pointer"
                      >
                        ENTRAR NO COCKPIT
                      </button>
                    </form>



                    <div className="mt-4 text-center">
                      <button
                        onClick={() => {
                          setShowNavDropdown(false);
                          handleNavigate('profile');
                        }}
                        className="text-[11px] text-brand-red/80 hover:text-brand-red underline cursor-pointer font-bold tracking-wide"
                      >
                        Não tem conta? Cadastrar Novo Piloto
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Hamburger toggle */}
            <button
              onClick={() => setMobileMenuOpen(prev => !prev)}
              className="md:hidden text-[#e2e2e2] hover:text-brand-red p-1 rounded-md cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>
        </div>

        {/* Mobile Navigation Drawer Overlay */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden border-t border-[#5e3f3b]/30 bg-[#131313] px-6 py-4 flex flex-col gap-4 overflow-hidden"
            >
              <button 
                onClick={() => handleNavigate('home')}
                className={`text-left font-sans text-xs font-bold tracking-widest uppercase py-2 cursor-pointer ${
                  activeTab === 'home' ? 'text-brand-red' : 'text-[#e2e2e2]'
                }`}
              >
                Início
              </button>
              <button 
                onClick={() => handleNavigate('calendar')}
                className={`text-left font-sans text-xs font-bold tracking-widest uppercase py-2 cursor-pointer ${
                  activeTab === 'calendar' ? 'text-brand-red' : 'text-[#e2e2e2]'
                }`}
              >
                Reservas / Race Schedule
              </button>
              <button 
                onClick={() => handleNavigate('ranking')}
                className={`text-left font-sans text-xs font-bold tracking-widest uppercase py-2 cursor-pointer ${
                  activeTab === 'ranking' ? 'text-brand-red' : 'text-[#e2e2e2]'
                }`}
              >
                Rankings
              </button>
              <button 
                onClick={() => handleNavigate('profile')}
                className={`text-left font-sans text-xs font-bold tracking-widest uppercase py-2 cursor-pointer ${
                  activeTab === 'profile' ? 'text-brand-red' : 'text-[#e2e2e2]'
                }`}
              >
                Portal do Piloto
              </button>

              {isLoggedIn && profile.role === 'admin' && (
                <button 
                  onClick={() => handleNavigate('admin')}
                  className={`text-left font-sans text-xs font-bold tracking-widest uppercase py-2 cursor-pointer ${
                    activeTab === 'admin' ? 'text-brand-red' : 'text-[#e2e2e2]'
                  }`}
                >
                  Painel Admin
                </button>
              )}

              {/* Compact Mobile Login inside menu when not logged in */}
              {!isLoggedIn && (
                <div className="border border-brand-border bg-[#121214] rounded-lg p-4 space-y-3 my-2 text-left">
                  <div className="flex justify-between items-center">
                    <span className="font-display text-[10px] font-black tracking-wider text-brand-red uppercase">
                      Login Rápido no Menu
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      placeholder="Seu e-mail..."
                      value={navEmail}
                      onChange={(e) => setNavEmail(e.target.value)}
                      className="flex-grow bg-[#1a1a1f] text-brand-text p-2 border border-brand-border focus:outline-none rounded text-xs"
                    />
                    <button
                      onClick={() => {
                        const found = registeredPilots.find(p => p.email.toLowerCase() === navEmail.toLowerCase() || p.nickname.toLowerCase() === navEmail.toLowerCase());
                        if (found) {
                          setProfile(found);
                          setIsLoggedIn(true);
                          setMobileMenuOpen(false);
                          setNavEmail('');
                          alert(`Bem-vindo, ${found.nickname}! Cockpit liberado.`);
                        } else {
                          alert('Credenciais inválidas ou nenhum piloto encontrado.');
                        }
                      }}
                      className="bg-brand-red text-white font-sans text-[10px] font-black px-3.5 py-2 uppercase rounded tracking-widest cursor-pointer"
                    >
                      LOGIN
                    </button>
                  </div>

                </div>
              )}

              <button 
                onClick={() => handleNavigate('calendar')}
                className="bg-brand-red text-white font-display text-lg py-3 tracking-widest rounded text-center cursor-pointer mechanical-switch"
              >
                RESERVE SUA BATERIA AGORA
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Viewport */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="w-full"
          >
            {activeTab === 'home' && (
              <HomeView 
                onNavigate={handleNavigate} 
                onQuickBook={handleQuickBook}
                rankings={rankings}
              />
            )}

            {activeTab === 'calendar' && (
              <div className="py-12 px-6 md:px-10 max-w-[1200px] mx-auto">
                <CalendarView
                  slots={slots}
                  bookings={bookings}
                  profile={profile}
                  initialSelections={quickSelections}
                  onConfirmBooking={handleConfirmBooking}
                  onNavigate={handleNavigate}
                />
              </div>
            )}

            {activeTab === 'ranking' && (
              <div className="py-12 px-6 md:px-10 max-w-[1200px] mx-auto">
                <RankingView rankings={rankings} />
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="py-12 px-6 md:px-10 max-w-[1200px] mx-auto">
                {isLoggedIn ? (
                  <ProfileView
                    profile={profile}
                    bookings={bookings}
                    onUpdateProfile={handleUpdateProfile}
                    onCancelBooking={handleCancelBooking}
                    onLogout={handleLogout}
                  />
                ) : (
                  <AuthView
                    onLoginSuccess={handleLoginSuccess}
                    registeredPilots={registeredPilots}
                    onRegisterPilot={handleRegisterPilot}
                    defaultEmail={profile.email !== 'convidado@playkart.com' ? profile.email : ''}
                  />
                )}
              </div>
            )}

            {activeTab === 'admin' && (
              <div className="py-12 px-6 md:px-10 max-w-[1200px] mx-auto">
                {isLoggedIn && profile.role === 'admin' ? (
                  <AdminView 
                    bookings={bookings}
                    slots={slots}
                    registeredPilots={registeredPilots}
                    onCancelBooking={handleCancelBooking}
                    onUpdateSlot={handleUpdateSlot}
                  />
                ) : (
                  <div className="text-center py-20 text-brand-red font-display text-2xl uppercase">
                    Acesso Restrito
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer Element */}
      <footer className="w-full py-16 border-t border-[#5e3f3b]/30 bg-[#0e0e0e]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6 md:px-10 max-w-[1200px] mx-auto">
          
          {/* Brand info */}
          <div className="flex flex-col gap-6">
            <span className="font-display text-3xl tracking-normal text-white flex items-center gap-2 select-none">
              <span className="italic">PLAY<span className="text-brand-red">KART</span></span>
              <span className="font-sans text-[9px] font-black uppercase tracking-[0.2em] text-[#d4d4d8] bg-brand-surface-high border border-brand-border px-1.5 py-0.5 rounded-sm not-italic">
                CAMPOS
              </span>
            </span>
            <p className="font-sans text-xs text-brand-text-muted leading-relaxed max-w-xs">
              Circuito de corrida profissional certificado, academia de pilotos amadores e karts de última geração. Entre no grid de alta performance conosco.
            </p>
          </div>

          {/* Quick links */}
          <div className="grid grid-cols-2 gap-8">
            <div className="flex flex-col gap-3">
              <span className="font-sans text-xs font-bold text-[#e2e2e2] uppercase tracking-widest">Navegação</span>
              <button onClick={() => handleNavigate('home')} className="text-left font-sans text-xs text-brand-text-muted hover:text-brand-red cursor-pointer transition-colors block">Página Inicial</button>
              <button onClick={() => handleNavigate('calendar')} className="text-left font-sans text-xs text-brand-text-muted hover:text-brand-red cursor-pointer transition-colors block">Agendar Horário</button>
              <button onClick={() => handleNavigate('ranking')} className="text-left font-sans text-xs text-brand-text-muted hover:text-brand-red cursor-pointer transition-colors block">Tabela Geral</button>
            </div>
            
            <div className="flex flex-col gap-3">
              <span className="font-sans text-xs font-bold text-[#e2e2e2] uppercase tracking-widest">Jurídico</span>
              <a href="#" className="font-sans text-xs text-brand-text-muted hover:text-brand-red transition-colors block">Termos de Serviço</a>
              <a href="#" className="font-sans text-xs text-brand-text-muted hover:text-brand-red transition-colors block">Políticas de Uso</a>
              <a href="#" className="font-sans text-xs text-brand-text-muted hover:text-brand-red transition-colors block">Privacidade</a>
            </div>
          </div>

          {/* Opening times & social icon actions */}
          <div className="flex flex-col md:items-end justify-between gap-6">
            <div className="text-left md:text-right">
              <div className="mb-4">
                <span className="font-sans text-xs font-bold text-[#e2e2e2] uppercase tracking-widest block mb-2">Localização Paddock</span>
                <p className="font-sans text-[11px] text-brand-text-muted">Av. Pres. Kennedy - Jóquei club</p>
                <p className="font-sans text-[11px] text-brand-text-muted">Campos dos Goytacazes - RJ, 28020-010</p>
              </div>
              <span className="font-sans text-xs font-bold text-[#e2e2e2] uppercase tracking-widest block mb-2">Funcionamento</span>
              <p className="font-sans text-[11px] text-brand-text-muted">Terça a Quinta: 16:00 - 22:00</p>
              <p className="font-sans text-[11px] text-brand-text-muted">Sexta e Sábado: 14:00 - 00:00</p>
              <p className="font-sans text-[11px] text-brand-text-muted">Domingo: 14:00 - 22:00</p>
            </div>

            <div className="flex items-center gap-4">
              <Share2 
                className="w-5 h-5 text-brand-text-muted hover:text-brand-red cursor-pointer transition-colors" 
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Link do Paddock copiado para a área de transferência! Compartilhe com sua equipe.');
                }}
                title="Compartilhar Link do Paddock"
              />
              <Globe className="w-5 h-5 text-brand-text-muted hover:text-brand-red cursor-pointer transition-colors" title="Idioma: Português" />
              <span className="text-[10px] font-sans text-brand-text-muted/60">
                © {new Date().getFullYear()} PLAYKART CAMPOS. INFRAESTRUTURA DE CORRIDA.
              </span>
            </div>
          </div>

        </div>
      </footer>

      {/* Mobile Sticky Bottom Tab bar (Identical to 2nd screenshot style) */}
      <nav className="fixed bottom-0 left-0 right-0 w-full z-40 bg-[#080808]/95 border-t border-brand-border flex justify-around items-center h-20 md:hidden backdrop-blur-md">
        
        <button 
          onClick={() => handleNavigate('home')}
          className={`flex flex-col items-center justify-center cursor-pointer transition-all ${
            activeTab === 'home' ? 'text-brand-red' : 'text-brand-text-muted hover:text-white'
          }`}
        >
          <Home className="w-5 h-5 mb-1" />
          <span className="font-sans text-[10px] font-semibold tracking-wider">Home</span>
        </button>

        <button 
          onClick={() => handleNavigate('calendar')}
          className={`flex flex-col items-center justify-center px-4 py-1 cursor-pointer transition-all rounded-lg ${
            activeTab === 'calendar' 
              ? 'text-brand-red ring-2 ring-brand-red bg-brand-red/5' 
              : 'text-brand-text-muted hover:text-white'
          }`}
        >
          <CalendarIcon className="w-5 h-5 mb-1" />
          <span className="font-sans text-[10px] font-semibold tracking-wider">Calendar</span>
        </button>

        <button 
          onClick={() => handleNavigate('ranking')}
          className={`flex flex-col items-center justify-center cursor-pointer transition-all ${
            activeTab === 'ranking' ? 'text-brand-red' : 'text-brand-text-muted hover:text-white'
          }`}
        >
          <Trophy className="w-5 h-5 mb-1" />
          <span className="font-sans text-[10px] font-semibold tracking-wider">Ranking</span>
        </button>

        <button 
          onClick={() => handleNavigate('profile')}
          className={`flex flex-col items-center justify-center cursor-pointer transition-all ${
            activeTab === 'profile' ? 'text-brand-red' : 'text-brand-text-muted hover:text-white'
          }`}
        >
          {isLoggedIn ? (
            <img 
              src={profile.avatar} 
              alt="Profile Avatar" 
              referrerPolicy="no-referrer"
              className="w-5 h-5 rounded-full object-cover mb-1 border border-brand-red"
            />
          ) : (
            <LogIn className="w-5 h-5 mb-1" />
          )}
          <span className="font-sans text-[10px] font-semibold tracking-wider">
            {isLoggedIn ? 'Perfil' : 'Entrar'}
          </span>
        </button>

      </nav>

    </div>
  );
}
