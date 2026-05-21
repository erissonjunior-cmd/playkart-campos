import React, { useState } from 'react';
import { 
  LogIn, 
  UserPlus, 
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { PilotProfile } from '../types';

interface AuthViewProps {
  onLoginSuccess: (user: PilotProfile) => void;
  registeredPilots: PilotProfile[];
  onRegisterPilot: (newPilot: PilotProfile) => void;
  defaultEmail?: string;
}

export default function AuthView({ 
  onLoginSuccess, 
  registeredPilots, 
  onRegisterPilot,
  defaultEmail = ''
}: AuthViewProps) {
  // Login Form States
  const [loginEmailOrCpf, setLoginEmailOrCpf] = useState<string>(defaultEmail);
  const [loginPassword, setLoginPassword] = useState<string>('playkart2026');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Register Form States
  const [regName, setRegName] = useState<string>('');
  const [regEmail, setRegEmail] = useState<string>('');
  const [regPhone, setRegPhone] = useState<string>('');
  const [regPassword, setRegPassword] = useState<string>('');
  
  // Registration Feedback
  const [regError, setRegError] = useState<string | null>(null);
  const [regSuccess, setRegSuccess] = useState<boolean>(false);

  // Phone Masking: (00) 00000-0000
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    
    if (value.length > 10) {
      value = value.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
    } else if (value.length > 6) {
      value = value.replace(/^(\d{2})(\d{4})(\d{0,4})$/, '($1) $2-$3');
    } else if (value.length > 2) {
      value = value.replace(/^(\d{2})(\d{0,5})$/, '($1) $2');
    }
    setRegPhone(value);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    if (!loginEmailOrCpf || !loginPassword) {
      setLoginError('Por favor, preencha todos os campos.');
      return;
    }

    const trimmedInput = loginEmailOrCpf.trim().toLowerCase();

    // Find user in registered list by Email or CPF
    const found = registeredPilots.find(
      p => (p.email.toLowerCase() === trimmedInput || (p.cpf && p.cpf.replace(/\D/g, '') === trimmedInput.replace(/\D/g, ''))) && 
           (p.password || 'playkart2026') === loginPassword
    );

    if (found) {
      onLoginSuccess(found);
    } else {
      setLoginError('Credenciais inválidas. Verifique seu e-mail/CPF e senha.');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);

    if (!regName || !regEmail || !regPhone || !regPassword) {
      setRegError('Preencha todos os campos obrigatórios.');
      return;
    }

    if (regPassword.length < 4) {
      setRegError('A senha deve conter no mínimo 4 caracteres.');
      return;
    }

    // Check if email already registered
    const emailExists = registeredPilots.some(p => p.email.toLowerCase() === regEmail.trim().toLowerCase());
    if (emailExists) {
      setRegError('Este endereço de e-mail já está cadastrado.');
      return;
    }

    // Derive racer nickname based on primary and last names
    const nameParts = regName.trim().split(' ');
    const firstName = nameParts[0] || 'PILOTO';
    const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : 'CAMPOS';
    const derivedNickname = `${firstName}_${lastName}`.toUpperCase().replace(/[^A-Z0-9_]/g, '');

    const randomSeed = Math.floor(Math.random() * 1000);
    const newPilot: PilotProfile = {
      name: regName,
      nickname: derivedNickname,
      email: regEmail.trim(),
      category: 'Sênior (125cc)',
      experienceLevel: 'Iniciante',
      activeStreak: 1,
      totalRaces: 0,
      bestLap: '47:890',
      avatar: `https://picsum.photos/seed/pilot-${randomSeed}/200/200`,
      phone: regPhone,
      cpf: '',
      rg: '',
      dob: '1998-05-20',
      weight: 75,
      password: regPassword,
      isRegistered: true
    };

    onRegisterPilot(newPilot);
    setRegSuccess(true);
    
    // Auto login
    setTimeout(() => {
      onLoginSuccess(newPilot);
      setRegSuccess(false);
      // Clean form
      setRegName('');
      setRegEmail('');
      setRegPhone('');
      setRegPassword('');
    }, 1500);
  };

  const handleForgotPassword = () => {
    alert('Caso tenha esquecido sua senha, por favor entre em contato com nossa equipe de pista no box fisicamente com seu documento original para redefinição segura.');
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-2">
      
      {/* Container split matching exactly the uploaded design style */}
      <div className="grid grid-cols-1 md:grid-cols-2 bg-[#121214] border border-brand-border rounded-lg overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.6)]">
        
        {/* Left Column: ACESSO AO BOX (Login) */}
        <div className="p-8 md:p-10 border-b md:border-b-0 md:border-r border-brand-border flex flex-col justify-between">
          
          <div className="space-y-6">
            <div>
              <h2 className="font-display text-2xl md:text-3xl italic text-white font-black uppercase tracking-wide">
                ACESSO AO BOX
              </h2>
              <p className="font-sans text-xs text-brand-text-muted mt-1">
                Retorne à pista com seu perfil de piloto
              </p>
            </div>

            {loginError && (
              <div className="bg-brand-red/10 border border-brand-red/30 text-brand-red text-xs p-3 rounded flex items-center gap-2.5 font-sans font-medium">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              
              {/* E-mail or CPF */}
              <div className="flex flex-col gap-1.5">
                <label className="font-sans text-[10px] font-black text-brand-text-muted tracking-widest uppercase">
                  E-MAIL OU CPF
                </label>
                <input
                  type="text"
                  value={loginEmailOrCpf}
                  onChange={(e) => setLoginEmailOrCpf(e.target.value)}
                  placeholder="EX: piloto@exemplo.com"
                  required
                  className="bg-brand-surface text-brand-text p-3.5 border border-brand-border focus:border-brand-red focus:outline-none rounded text-xs font-semibold"
                />
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <label className="font-sans text-[10px] font-black text-brand-text-muted tracking-widest uppercase">
                    SENHA
                  </label>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="font-sans text-[10px] font-black text-brand-red hover:text-red-400 uppercase tracking-wider underline cursor-pointer"
                  >
                    ESQUECI MINHA SENHA
                  </button>
                </div>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Sua senha"
                  required
                  className="bg-brand-surface text-brand-text p-3.5 border border-brand-border focus:border-brand-red focus:outline-none rounded text-xs font-semibold"
                />
              </div>

              {/* Slanted red action button matching design strictly */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-brand-red hover:bg-[#ff1e27] text-white font-display text-sm italic font-black uppercase tracking-widest py-3.5 px-6 transition-all shadow-md cursor-pointer relative flex items-center justify-center gap-2 rounded-sm skew-tag"
                >
                  <span className="unskew-text flex items-center gap-2">
                    ENTRAR NO GRID
                    <LogIn className="w-4 h-4" />
                  </span>
                </button>
              </div>

            </form>
          </div>

          {/* Mini Paddock Help Link */}
          <div className="mt-12 pt-6 border-t border-brand-border/40 text-left">
            <span className="text-[10px] font-extrabold text-brand-text-muted tracking-wider uppercase block mb-1">
              SUPORTE DIGITAL DO CIRCUITO
            </span>
            <p className="font-sans text-[11px] text-[#8e8e93] leading-relaxed">
              O sistema sincroniza suas voltas rápidas e posições no grid de forma instantânea.
            </p>
          </div>

        </div>

        {/* Right Column: NOVO POR AQUI? (Register) */}
        <div className="p-8 md:p-10 bg-[#161619]/35 flex flex-col justify-between">
          
          <div className="space-y-6">
            <div>
              <h2 className="font-display text-2xl md:text-3xl italic text-white font-black uppercase tracking-wide">
                NOVO POR AQUI?
              </h2>
              <p className="font-sans text-xs text-brand-text-muted mt-1">
                Crie seu perfil de piloto e domine as curvas
              </p>
            </div>

            {regError && (
              <div className="bg-brand-red/10 border border-brand-red/30 text-brand-red text-xs p-3 rounded flex items-center gap-2.5 font-sans font-medium">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{regError}</span>
              </div>
            )}

            {regSuccess && (
              <div className="bg-emerald-950/40 border border-emerald-500/50 text-emerald-400 text-xs p-3 rounded flex items-center gap-2.5 font-sans font-medium">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>CADASTRO REALIZADO COM SUCESSO! ACELERANDO...</span>
              </div>
            )}

            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              
              {/* Full Name */}
              <div className="flex flex-col gap-1">
                <label className="font-sans text-[10px] font-black text-brand-text-muted tracking-widest uppercase">
                  NOME COMPLETO
                </label>
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="Seu nome de piloto"
                  required
                  className="bg-brand-surface text-brand-text p-3 border border-brand-border focus:border-brand-red focus:outline-none rounded text-xs font-semibold"
                />
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1">
                <label className="font-sans text-[10px] font-black text-brand-text-muted tracking-widest uppercase">
                  E-MAIL
                </label>
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="exemplo@playkart.com.br"
                  required
                  className="bg-brand-surface text-brand-text p-3 border border-brand-border focus:border-brand-red focus:outline-none rounded text-xs font-semibold"
                />
              </div>

              {/* Phone and Password Grid */}
              <div className="grid grid-cols-2 gap-3.5">
                
                {/* Phone Component */}
                <div className="flex flex-col gap-1">
                  <label className="font-sans text-[10px] font-black text-brand-text-muted tracking-widest uppercase">
                    CELULAR
                  </label>
                  <input
                    type="text"
                    value={regPhone}
                    onChange={handlePhoneChange}
                    placeholder="(22) 99999-9999"
                    required
                    className="bg-brand-surface text-brand-text p-3 border border-brand-border focus:border-brand-red focus:outline-none rounded text-xs font-semibold"
                  />
                </div>

                {/* Password Component */}
                <div className="flex flex-col gap-1">
                  <label className="font-sans text-[10px] font-black text-brand-text-muted tracking-widest uppercase">
                    SENHA
                  </label>
                  <input
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Mínimo 8 caracteres"
                    required
                    className="bg-brand-surface text-brand-text p-3 border border-brand-border focus:border-brand-red focus:outline-none rounded text-xs font-semibold"
                  />
                </div>

              </div>

              {/* Thick line divider and Register Action matching design */}
              <div className="pt-4 border-t-2 border-brand-red/90 mt-5">
                <button
                  type="submit"
                  className="w-full bg-brand-red hover:bg-[#ff1e27] text-white font-display text-sm italic font-black uppercase tracking-widest py-3.5 px-6 transition-all shadow-md cursor-pointer relative flex items-center justify-center gap-2 rounded-sm skew-tag"
                >
                  <span className="unskew-text flex items-center gap-2">
                    INICIAR CARREIRA
                    <UserPlus className="w-4 h-4" />
                  </span>
                </button>
              </div>

            </form>
          </div>

          <p className="font-sans text-[9px] text-[#8e8e93] leading-relaxed uppercase tracking-wider text-center mt-6">
            AO SE CADASTRAR, VOCÊ CONCORDA COM NOSSOS TERMOS DE USO E POLÍTICAS DE PRIVACIDADE DO BOX.
          </p>

        </div>

      </div>

      {/* Instant login sample info as a humble footline helper instead of occupying high prominence blocks */}
      <div className="mt-6 text-center">
        <p className="font-sans text-xs text-[#8e8e93]">
          Pilotos de Demonstração Rápidos: <strong className="text-white">sarah.shift@playkart.com</strong> (Senha: <strong className="text-brand-red font-mono">playkart2026</strong>) ou use o menu do cockpit.
        </p>
      </div>

    </div>
  );
}
