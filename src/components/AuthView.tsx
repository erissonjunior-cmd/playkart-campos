import React, { useState } from 'react';
import { 
  LogIn, 
  UserPlus, 
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { PilotProfile } from '../types';
import { useApp } from '../context/AppContext';

export default function AuthView() {
  const { 
    handleLoginSuccess, registeredPilots, handleRegisterPilot 
  } = useApp();

  const [loginEmailOrCpf, setLoginEmailOrCpf] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);

  const [regName, setRegName] = useState<string>('');
  const [regEmail, setRegEmail] = useState<string>('');
  const [regPhone, setRegPhone] = useState<string>('');
  const [regPassword, setRegPassword] = useState<string>('');
  const [regDob, setRegDob] = useState<string>('');
  const [regDocType, setRegDocType] = useState<'CPF' | 'RG' | 'Passaporte' | 'Outro'>('CPF');
  const [regDocNum, setRegDocNum] = useState<string>('');
  const [regWeight, setRegWeight] = useState<string>('');
  
  const [regError, setRegError] = useState<string | null>(null);
  const [regSuccess, setRegSuccess] = useState<boolean>(false);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    if (value.length > 10) value = value.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
    else if (value.length > 6) value = value.replace(/^(\d{2})(\d{4})(\d{0,4})$/, '($1) $2-$3');
    else if (value.length > 2) value = value.replace(/^(\d{2})(\d{0,5})$/, '($1) $2');
    setRegPhone(value);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    const trimmedInput = loginEmailOrCpf.trim().toLowerCase();

    // SUPER FAILSAFE: Hardcoded check for testing
    if ((trimmedInput === 'admin' || trimmedInput === 'admin@admin.com') && loginPassword === 'admin') {
      const adminMaster = registeredPilots.find(p => p.email === 'admin@admin.com' || p.email === 'admin') || registeredPilots[0];
      handleLoginSuccess({ ...adminMaster, role: 'admin' });
      return;
    }

    const found = registeredPilots.find(p => (p.email.toLowerCase() === trimmedInput || (p.cpf && p.cpf.replace(/\D/g, '') === trimmedInput.replace(/\D/g, ''))) && (p.password || 'playkart2026') === loginPassword);
    if (found) handleLoginSuccess(found);
    else setLoginError('Credenciais inválidas.');
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);
    if (registeredPilots.some(p => p.email.toLowerCase() === regEmail.trim().toLowerCase())) {
      setRegError('E-mail já cadastrado.');
      return;
    }
    const nameParts = regName.trim().split(' ');
    const derivedNickname = `${nameParts[0] || 'PILOTO'}_${nameParts.length > 1 ? nameParts[nameParts.length - 1] : 'CAMPOS'}`.toUpperCase().replace(/[^A-Z0-9_]/g, '');
    const newPilot: PilotProfile = {
      name: regName, 
      nickname: derivedNickname, 
      email: regEmail.trim(), 
      category: 'Sênior (125cc)', 
      experienceLevel: 'Iniciante', 
      activeStreak: 1, 
      totalRaces: 0, 
      bestLap: '47:890', 
      avatar: `https://picsum.photos/seed/pilot-${Date.now()}/200/200`, 
      phone: regPhone, 
      whatsapp: regPhone, 
      documentType: regDocType, 
      documentNumber: regDocNum, 
      bloodType: undefined, 
      cpf: '', 
      rg: '', 
      dob: regDob, 
      weight: regWeight ? parseInt(regWeight) : 75, 
      password: regPassword, 
      isRegistered: true, 
      role: 'pilot'
    };
    handleRegisterPilot(newPilot);
    setRegSuccess(true);
    setTimeout(() => { handleLoginSuccess(newPilot); setRegSuccess(false); }, 1500);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-2">
      <div className="grid grid-cols-1 md:grid-cols-2 bg-[#121214] border border-brand-border rounded-lg overflow-hidden shadow-2xl">
        <div className="p-8 md:p-10 border-b md:border-b-0 md:border-r border-brand-border flex flex-col justify-between">
          <div className="space-y-6">
            <h2 className="font-display text-2xl md:text-3xl italic text-white font-black uppercase tracking-tight">ACESSO AO BOX</h2>
            {loginError && <div className="bg-brand-red/10 border border-brand-red/30 text-brand-red text-xs p-3 rounded flex items-center gap-2"><AlertCircle className="w-4 h-4" />{loginError}</div>}
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-brand-text-muted uppercase tracking-widest">E-MAIL OU CPF</label>
                <input type="text" value={loginEmailOrCpf} onChange={(e) => setLoginEmailOrCpf(e.target.value)} required className="bg-brand-surface text-brand-text p-3.5 border border-brand-border rounded text-xs focus:outline-none focus:border-brand-red transition-colors w-full" placeholder="Seu identificador" />
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black text-brand-text-muted uppercase tracking-widest">SENHA</label>
                  <button type="button" className="text-[9px] font-black text-brand-red uppercase hover:underline">Esqueci minha senha</button>
                </div>
                <div className="relative">
                  <input 
                    type={showLoginPassword ? "text" : "password"} 
                    value={loginPassword} 
                    onChange={(e) => setLoginPassword(e.target.value)} 
                    required 
                    className="bg-brand-surface text-brand-text p-3.5 border border-brand-border rounded text-xs w-full pr-10 focus:outline-none focus:border-brand-red transition-colors" 
                    placeholder="Sua senha"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-text-muted hover:text-white transition-colors"
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <button type="submit" className="w-full bg-brand-red hover:bg-[#ff1e27] text-white font-display text-sm italic font-black uppercase py-4 rounded-sm flex items-center justify-center gap-2 cursor-pointer transition-all shadow-[0_4px_15px_rgba(227,6,19,0.25)]"><span>ENTRAR NO GRID</span><LogIn className="w-4 h-4" /></button>
            </form>
          </div>
          <p className="mt-12 text-[10px] text-brand-text-muted uppercase tracking-wider font-semibold">Suporte Digital do Circuito • Paddock 2026</p>
        </div>

        <div className="p-8 md:p-10 bg-[#161619]/35 flex flex-col justify-between">
          <div className="space-y-6">
            <h2 className="font-display text-2xl md:text-3xl italic text-white font-black uppercase tracking-tight">NOVO POR AQUI?</h2>
            {regError && <div className="bg-brand-red/10 border border-brand-red/30 text-brand-red text-xs p-3 rounded flex items-center gap-2"><AlertCircle className="w-4 h-4" />{regError}</div>}
            {regSuccess && <div className="bg-emerald-950/40 border border-emerald-500/50 text-emerald-400 text-xs p-3 rounded flex items-center gap-2"><CheckCircle className="w-4 h-4" />CADASTRO REALIZADO!</div>}
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <input type="text" value={regName} onChange={(e) => setRegName(e.target.value)} placeholder="NOME COMPLETO" required className="bg-brand-surface text-brand-text p-3 border border-brand-border rounded text-xs w-full" />
              <input type="email" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} placeholder="E-MAIL" required className="bg-brand-surface text-brand-text p-3 border border-brand-border rounded text-xs w-full" />
              <div className="grid grid-cols-2 gap-3.5">
                <input type="date" value={regDob} onChange={(e) => setRegDob(e.target.value)} required className="bg-brand-surface text-brand-text p-3 border border-brand-border rounded text-xs" />
                <input type="text" value={regDocNum} onChange={(e) => setRegDocNum(e.target.value)} placeholder="DOCUMENTO" required className="bg-brand-surface text-brand-text p-3 border border-brand-border rounded text-xs" />
              </div>
              <div className="grid grid-cols-2 gap-3.5">
                <input type="text" value={regPhone} onChange={handlePhoneChange} placeholder="WHATSAPP" required className="bg-brand-surface text-brand-text p-3 border border-brand-border rounded text-xs" />
                <input type="number" value={regWeight} onChange={(e) => setRegWeight(e.target.value)} placeholder="PESO (KG)" className="bg-brand-surface text-brand-text p-3 border border-brand-border rounded text-xs" />
              </div>
              <div className="relative">
                <input 
                  type={showRegPassword ? "text" : "password"} 
                  value={regPassword} 
                  onChange={(e) => setRegPassword(e.target.value)} 
                  placeholder="SENHA" 
                  required 
                  className="bg-brand-surface text-brand-text p-3 border border-brand-border rounded text-xs w-full pr-9 focus:outline-none focus:border-brand-red transition-colors" 
                />
                <button 
                  type="button" 
                  onClick={() => setShowRegPassword(!showRegPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-brand-text-muted hover:text-white transition-colors"
                >
                  {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
              <button type="submit" className="w-full bg-brand-red hover:bg-[#ff1e27] text-white font-display text-sm italic font-black uppercase py-4 rounded-sm flex items-center justify-center gap-2 cursor-pointer transition-all shadow-[0_4px_15px_rgba(227,6,19,0.2)] mt-2"><span>INICIAR CARREIRA</span><UserPlus className="w-4 h-4" /></button>
            </form>
          </div>
          <p className="mt-6 text-[9px] text-[#8e8e93] text-center uppercase tracking-wider font-bold">Ao se cadastrar você concorda com nossos termos.</p>
        </div>
      </div>
    </div>
  );
}
