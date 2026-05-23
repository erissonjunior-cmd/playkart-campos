import React, { useState } from 'react';
import { 
  LogIn, 
  UserPlus, 
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { PilotProfile } from '../types';
import { useApp } from '../context/AppContext';

export default function AuthView() {
  const { 
    onLoginSuccess, registeredPilots, onRegisterPilot 
  } = useApp();

  const [loginEmailOrCpf, setLoginEmailOrCpf] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('playkart2026');
  const [loginError, setLoginError] = useState<string | null>(null);

  const [regName, setRegName] = useState<string>('');
  const [regEmail, setRegEmail] = useState<string>('');
  const [regPhone, setRegPhone] = useState<string>('');
  const [regPassword, setRegPassword] = useState<string>('');
  const [regDob, setRegDob] = useState<string>('');
  const [regBloodType, setRegBloodType] = useState<string>('');
  const [regDocType, setRegDocType] = useState<'CPF' | 'RG' | 'Passaporte' | 'Outro'>('CPF');
  const [regDocNum, setRegDocNum] = useState<string>('');
  
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
    const found = registeredPilots.find(p => (p.email.toLowerCase() === trimmedInput || (p.cpf && p.cpf.replace(/\D/g, '') === trimmedInput.replace(/\D/g, ''))) && (p.password || 'playkart2026') === loginPassword);
    if (found) onLoginSuccess(found);
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
      name: regName, nickname: derivedNickname, email: regEmail.trim(), category: 'Sênior (125cc)', experienceLevel: 'Iniciante', activeStreak: 1, totalRaces: 0, bestLap: '47:890', avatar: `https://picsum.photos/seed/pilot-${Date.now()}/200/200`, phone: regPhone, whatsapp: regPhone, documentType: regDocType, documentNumber: regDocNum, bloodType: regBloodType || undefined, cpf: '', rg: '', dob: regDob, weight: 75, password: regPassword, isRegistered: true, role: 'pilot'
    };
    onRegisterPilot(newPilot);
    setRegSuccess(true);
    setTimeout(() => { onLoginSuccess(newPilot); setRegSuccess(false); }, 1500);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-2">
      <div className="grid grid-cols-1 md:grid-cols-2 bg-[#121214] border border-brand-border rounded-lg overflow-hidden shadow-2xl">
        <div className="p-8 md:p-10 border-b md:border-b-0 md:border-r border-brand-border flex flex-col justify-between">
          <div className="space-y-6">
            <h2 className="font-display text-2xl md:text-3xl italic text-white font-black uppercase">ACESSO AO BOX</h2>
            {loginError && <div className="bg-brand-red/10 border border-brand-red/30 text-brand-red text-xs p-3 rounded">{loginError}</div>}
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-brand-text-muted uppercase">E-MAIL OU CPF</label>
                <input type="text" value={loginEmailOrCpf} onChange={(e) => setLoginEmailOrCpf(e.target.value)} required className="bg-brand-surface text-brand-text p-3.5 border border-brand-border rounded text-xs" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-brand-text-muted uppercase">SENHA</label>
                <input type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required className="bg-brand-surface text-brand-text p-3.5 border border-brand-border rounded text-xs" />
              </div>
              <button type="submit" className="w-full bg-brand-red hover:bg-[#ff1e27] text-white font-display text-sm italic font-black uppercase py-3.5 rounded-sm skew-tag flex items-center justify-center gap-2 cursor-pointer transition-all"><span>ENTRAR NO GRID</span><LogIn className="w-4 h-4" /></button>
            </form>
          </div>
          <p className="mt-12 text-[11px] text-brand-text-muted">Acesso seguro ao Paddock Digital.</p>
        </div>

        <div className="p-8 md:p-10 bg-[#161619]/35 flex flex-col justify-between">
          <div className="space-y-6">
            <h2 className="font-display text-2xl md:text-3xl italic text-white font-black uppercase">NOVO POR AQUI?</h2>
            {regError && <div className="bg-brand-red/10 border border-brand-red/30 text-brand-red text-xs p-3 rounded">{regError}</div>}
            {regSuccess && <div className="bg-emerald-950/40 border border-emerald-500/50 text-emerald-400 text-xs p-3 rounded">CADASTRO REALIZADO!</div>}
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <input type="text" value={regName} onChange={(e) => setRegName(e.target.value)} placeholder="NOME COMPLETO" required className="bg-brand-surface text-brand-text p-3 border border-brand-border rounded text-xs" />
              <input type="email" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} placeholder="E-MAIL" required className="bg-brand-surface text-brand-text p-3 border border-brand-border rounded text-xs" />
              <div className="grid grid-cols-2 gap-3.5">
                <input type="date" value={regDob} onChange={(e) => setRegDob(e.target.value)} required className="bg-brand-surface text-brand-text p-3 border border-brand-border rounded text-xs" />
                <input type="text" value={regDocNum} onChange={(e) => setRegDocNum(e.target.value)} placeholder="DOCUMENTO" required className="bg-brand-surface text-brand-text p-3 border border-brand-border rounded text-xs" />
              </div>
              <div className="grid grid-cols-2 gap-3.5">
                <input type="text" value={regPhone} onChange={handlePhoneChange} placeholder="WHATSAPP" required className="bg-brand-surface text-brand-text p-3 border border-brand-border rounded text-xs" />
                <input type="password" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} placeholder="SENHA" required className="bg-brand-surface text-brand-text p-3 border border-brand-border rounded text-xs" />
              </div>
              <button type="submit" className="w-full bg-brand-red hover:bg-[#ff1e27] text-white font-display text-sm italic font-black uppercase py-3.5 rounded-sm skew-tag flex items-center justify-center gap-2 cursor-pointer transition-all"><span>CRIAR PERFIL</span><UserPlus className="w-4 h-4" /></button>
            </form>
          </div>
          <p className="mt-6 text-[9px] text-[#8e8e93] text-center uppercase tracking-wider">Ao se cadastrar você concorda com nossos termos.</p>
        </div>
      </div>
    </div>
  );
}
