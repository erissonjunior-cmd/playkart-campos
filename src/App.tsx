import React, { useState } from 'react';
import { 
  Bell, 
  User, 
  Home, 
  Calendar as CalendarIcon, 
  Trophy, 
  Globe, 
  Share2,
  X,
  LogIn,
  Menu,
  Eye,
  EyeOff
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { useApp } from './context/AppContext';
import { PilotProfile } from './types';

import HomeView from './components/HomeView';
import CalendarView from './components/CalendarView';
import RankingView from './components/RankingView';
import ProfileView from './components/ProfileView';
import AuthView from './components/AuthView';
import AdminView from './components/AdminView';
import TrackStatusWidget from './components/TrackStatusWidget';

export default function App() {
  const { 
    activeTab, handleNavigate, profile, isLoggedIn, handleLogout,
    registeredPilots, handleLoginSuccess, handleRegisterPilot,
    bookings, handleCancelBooking, slots, handleUpdateSlot, 
    handleUpdateProfile, rankings
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navEmail, setNavEmail] = useState('');
  const [navPassword, setNavPassword] = useState('');
  const [navError, setNavError] = useState<string | null>(null);
  const [showNavDropdown, setShowNavDropdown] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleNavLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setNavError(null);
    if (!navEmail) {
      setNavError('Insira o e-mail');
      return;
    }

    const trimmedInput = navEmail.trim().toLowerCase();

    // SUPER FAILSAFE: Hardcoded check for testing
    if ((trimmedInput === 'admin' || trimmedInput === 'admin@admin.com') && navPassword === 'admin') {
      const existingAdmin = registeredPilots.find(p => p.email === 'admin@admin.com' || p.email === 'admin');
      const adminToLogin = existingAdmin || {
        name: 'Admin Geral',
        nickname: 'ADMIN',
        email: 'admin@admin.com',
        role: 'admin',
        avatar: 'https://cdn-icons-png.flaticon.com/512/219/219983.png',
        category: 'Pro (250cc)',
        experienceLevel: 'Pro',
        activeStreak: 0,
        totalRaces: 0,
        bestLap: '00:000',
        phone: '',
        whatsapp: '',
        documentType: 'CPF',
        documentNumber: '',
        dob: '1990-01-01',
        isRegistered: true
      };
      
      handleLoginSuccess(adminToLogin as PilotProfile);
      setShowNavDropdown(false);
      setNavEmail('');
      setNavPassword('');
      alert(`Bem-vindo MASTER ADMIN! Cockpit liberado.`);
      return;
    }

    const found = registeredPilots.find(
      p => p.email.toLowerCase() === trimmedInput && (p.password || 'playkart2026') === navPassword
    );

    if (found) {
      handleLoginSuccess(found);
      setShowNavDropdown(false);
      setNavEmail('');
      setNavPassword('');
      alert(`Bem-vindo de volta, ${found.nickname}! Cockpit liberado.`);
    } else {
      setNavError('Credenciais inválidas');
    }
  };

  const triggerNotificationAlert = () => {
    alert('Nenhum briefing pendente no paddock para hoje. Todos os karts em manutenção estão prontos e aferidos pela equipe de mecânicos.');
  };

  const navigateAndClose = (tab: any) => {
    handleNavigate(tab);
    setMobileMenuOpen(false);
  };

  return (
    <div className="bg-brand-bg text-brand-text font-sans overflow-x-hidden min-h-screen flex flex-col pb-20 md:pb-0">
      
      {/* Top Navbar */}
      <nav className="sticky top-0 w-full z-40 border-b border-brand-border bg-[#080808]/90 backdrop-blur-md">
        <div className="flex justify-between items-center px-6 md:px-10 h-20 max-w-[1240px] mx-auto">
          
          <div onClick={() => handleNavigate('home')} className="flex items-center gap-3 cursor-pointer group select-none">
            <span className="font-display text-4xl tracking-normal text-white flex items-center group-hover:scale-105 transition-transform duration-300">
              <span className="italic">PLAY<span className="text-brand-red">KART</span></span>
              <span className="text-[#d4d4d8] font-black uppercase tracking-tighter ml-1.5 opacity-90 transition-colors">CAMPOS</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {['home', 'calendar', 'ranking', 'profile'].map((tab) => (
              <button 
                key={tab}
                onClick={() => handleNavigate(tab as any)}
                className={`font-sans text-xs font-bold tracking-widest uppercase pb-1 border-b-2 cursor-pointer transition-colors ${
                  activeTab === tab ? 'text-brand-red border-brand-red' : 'text-[#e2e2e2] border-transparent hover:text-brand-red'
                }`}
              >
                {tab === 'home' ? 'Início' : tab === 'calendar' ? 'Reservas' : tab === 'ranking' ? 'Rankings' : 'Portal do Piloto'}
              </button>
            ))}
            {isLoggedIn && profile.role === 'admin' && (
              <button onClick={() => handleNavigate('admin')} className={`font-sans text-xs font-bold tracking-widest uppercase pb-1 border-b-2 cursor-pointer transition-colors ${activeTab === 'admin' ? 'text-brand-red border-brand-red' : 'text-[#e2e2e2] border-transparent hover:text-brand-red'}`}>
                Painel Admin
              </button>
            )}
          </div>

          <div className="flex items-center gap-4">
            <button onClick={() => handleNavigate('calendar')} className="hidden md:block bg-brand-red text-white font-display text-sm px-6 py-2.5 tracking-widest rounded-sm mechanical-switch hover:bg-brand-red-hover active:scale-95 transition-all cursor-pointer">
              RESERVE AGORA
            </button>

            <button onClick={triggerNotificationAlert} className="text-[#e2e2e2] hover:text-brand-red p-1 rounded-full cursor-pointer transition-colors">
              <Bell className="w-6 h-6" />
            </button>

            <div className="relative">
              <button 
                onClick={() => isLoggedIn ? handleNavigate('profile') : setShowNavDropdown(!showNavDropdown)}
                className="text-[#e2e2e2] hover:text-brand-red p-1 rounded-full cursor-pointer transition-all flex items-center gap-2"
              >
                {isLoggedIn ? (
                  <div className="flex items-center gap-2">
                    <img src={profile.avatar} alt={profile.nickname} className="w-8 h-8 rounded-full border border-brand-red object-cover hidden sm:block" />
                    <span className="hidden lg:inline-block font-sans text-[10px] font-black uppercase tracking-wider text-white bg-[#1a1a1f] border border-brand-border px-2 py-1 rounded">{profile.nickname}</span>
                    <User className="w-5 h-5 sm:hidden" />
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-red hover:bg-[#ff1e27] text-white font-sans text-xs font-black uppercase tracking-wider rounded">
                    <LogIn className="w-3.5 h-3.5 shrink-0" />
                    <span className="hidden sm:inline">CONTA</span>
                  </div>
                )}
              </button>

              <AnimatePresence>
                {!isLoggedIn && showNavDropdown && (
                  <motion.div initial={{ opacity: 0, y: 12, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: 0.95 }} className="absolute right-0 mt-3 w-80 bg-[#121214] border border-brand-border rounded-lg p-5 shadow-2xl z-50 text-left">
                    <div className="flex justify-between items-center mb-4 pb-2 border-b border-brand-border/40">
                      <span className="font-display text-sm italic text-brand-red font-black uppercase">ACESSAR COCKPIT</span>
                      <button onClick={() => setShowNavDropdown(false)}><X className="w-4 h-4 text-brand-text-muted" /></button>
                    </div>
                    {navError && <div className="bg-brand-red/10 border border-brand-red/40 text-brand-red text-[11px] p-2.5 rounded mb-3">{navError}</div>}
                    <form onSubmit={handleNavLogin} className="space-y-3.5">
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-extrabold text-brand-text-muted uppercase">SEU E-MAIL</label>
                        <input type="email" value={navEmail} onChange={(e) => setNavEmail(e.target.value)} className="bg-brand-surface text-brand-text p-2.5 border border-brand-border rounded text-xs w-full focus:outline-none focus:border-brand-red transition-colors" placeholder="email@exemplo.com" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-extrabold text-brand-text-muted uppercase">SENHA SECRETA</label>
                        <div className="relative">
                          <input 
                            type={showPassword ? "text" : "password"} 
                            value={navPassword} 
                            onChange={(e) => setNavPassword(e.target.value)} 
                            className="bg-brand-surface text-brand-text p-2.5 border border-brand-border rounded text-xs w-full pr-10 focus:outline-none focus:border-brand-red transition-colors" 
                            placeholder="Sua senha"
                          />
                          <button 
                            type="button" 
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-brand-text-muted hover:text-white transition-colors"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                      <button type="submit" className="w-full bg-brand-red hover:bg-[#ff1e27] text-white font-display text-xs py-3 rounded uppercase font-black tracking-widest transition-all">ENTRAR NO COCKPIT</button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-[#e2e2e2] hover:text-brand-red">
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="md:hidden border-t border-brand-border bg-[#131313] px-6 py-4 flex flex-col gap-4 overflow-hidden">
              {['home', 'calendar', 'ranking', 'profile'].map((tab) => (
                <button key={tab} onClick={() => navigateAndClose(tab as any)} className={`text-left font-sans text-xs font-bold uppercase py-2 ${activeTab === tab ? 'text-brand-red' : 'text-[#e2e2e2]'}`}>
                  {tab === 'home' ? 'Início' : tab === 'calendar' ? 'Reservas' : tab === 'ranking' ? 'Rankings' : 'Portal do Piloto'}
                </button>
              ))}
              <button onClick={() => navigateAndClose('calendar')} className="bg-brand-red text-white font-display text-lg py-3 rounded text-center uppercase tracking-widest">RESERVE SUA BATERIA AGORA</button>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <TrackStatusWidget />

      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>
            {activeTab === 'home' && <HomeView />}
            {activeTab === 'calendar' && (
              <div className="py-12 px-6 md:px-10 max-w-[1200px] mx-auto">
                <CalendarView />
              </div>
            )}
            {activeTab === 'ranking' && (
              <div className="py-12 px-6 md:px-10 max-w-[1200px] mx-auto">
                <RankingView />
              </div>
            )}
            {activeTab === 'profile' && (
              <div className="py-12 px-6 md:px-10 max-w-[1200px] mx-auto">
                {isLoggedIn ? (
                  <ProfileView />
                ) : (
                  <AuthView />
                )}
              </div>
            )}
            {activeTab === 'admin' && isLoggedIn && profile.role === 'admin' && (
              <div className="py-12 px-6 md:px-10 max-w-[1200px] mx-auto">
                <AdminView 
                  bookings={bookings}
                  slots={slots}
                  registeredPilots={registeredPilots}
                  onCancelBooking={handleCancelBooking}
                  onUpdateSlot={handleUpdateSlot}
                />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="w-full py-16 border-t border-brand-border bg-[#0e0e0e]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6 md:px-10 max-w-[1200px] mx-auto text-xs text-brand-text-muted">
          <div className="flex flex-col gap-6">
            <span className="font-display text-3xl text-white italic">PLAY<span className="text-brand-red">KART</span> <span className="not-italic tracking-tighter text-[#d4d4d8]">CAMPOS</span></span>
            <p>Circuito de corrida profissional certificado, academia de pilotos amadores e karts de última geração.</p>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div className="flex flex-col gap-3">
              <span className="font-bold text-white uppercase tracking-widest text-[10px]">Navegação</span>
              <button onClick={() => handleNavigate('home')} className="text-left hover:text-brand-red transition-colors">Início</button>
              <button onClick={() => handleNavigate('calendar')} className="text-left hover:text-brand-red transition-colors">Agendar</button>
              <button onClick={() => handleNavigate('ranking')} className="text-left hover:text-brand-red transition-colors">Rankings</button>
            </div>
            <div className="flex flex-col gap-3">
              <span className="font-bold text-white uppercase tracking-widest text-[10px]">Jurídico</span>
              <a href="#" className="hover:text-brand-red text-left transition-colors font-semibold">Termos de Uso</a>
              <a href="#" className="hover:text-brand-red text-left transition-colors font-semibold">Privacidade</a>
            </div>
          </div>
          <div className="flex flex-col md:items-end gap-4 text-left md:text-right">
            <div>
              <span className="font-bold text-white uppercase block mb-1 tracking-widest text-[10px]">Localização</span>
              <p className="font-semibold text-white">Av. Pres. Kennedy - Jóquei club</p>
              <p>Campos dos Goytacazes - RJ</p>
            </div>
            <div className="flex items-center gap-4 mt-4">
              <Share2 className="w-5 h-5 cursor-pointer hover:text-brand-red transition-colors" onClick={() => { navigator.clipboard.writeText(window.location.href); alert('Link copiado!'); }} />
              <Globe className="w-5 h-5" />
              <span className="font-bold tracking-widest">© {new Date().getFullYear()} PLAYKART CAMPOS</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Sticky Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 w-full z-40 bg-[#080808]/95 border-t border-brand-border flex justify-around items-center h-20 md:hidden backdrop-blur-md">
        {[
          { id: 'home', icon: <Home className="w-5 h-5" />, label: 'Home' },
          { id: 'calendar', icon: <CalendarIcon className="w-5 h-5" />, label: 'Calendar' },
          { id: 'ranking', icon: <Trophy className="w-5 h-5" />, label: 'Ranking' },
          { id: 'profile', icon: isLoggedIn ? <img src={profile.avatar} className="w-5 h-5 rounded-full border border-brand-red" /> : <User className="w-5 h-5" />, label: 'Profile' }
        ].map((item) => (
          <button key={item.id} onClick={() => handleNavigate(item.id as any)} className={`flex flex-col items-center gap-1 transition-all ${activeTab === item.id ? 'text-brand-red scale-110' : 'text-brand-text-muted hover:text-white'}`}>
            {item.icon}
            <span className="text-[10px] font-black uppercase tracking-tighter">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
