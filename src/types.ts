export interface PilotProfile {
  name: string;
  nickname: string;
  email: string;
  category: string;
  activeStreak: number;
  totalRaces: number;
  bestLap: string;
  avatar: string;
  experienceLevel: 'Iniciante' | 'Intermediário' | 'Avançado' | 'Profissional';
  phone?: string;
  cpf?: string;
  rg?: string;
  dob?: string;
  weight?: number;
  password?: string;
  isRegistered?: boolean;
  role?: 'admin' | 'pilot';
  bloodType?: string;
  documentType?: 'CPF' | 'RG' | 'Passaporte' | 'Outro';
  documentNumber?: string;
  whatsapp?: string;
}

export interface TimeSlot {
  id: string;
  time: string;
  title?: string;
  availableKarts: number;
  totalKarts: number;
  price: number;
  isFull: boolean;
  type?: 'Fast Track' | 'Night Run' | 'Pro Academy' | 'Standard';
}

export interface Booking {
  id: string;
  slotId: string;
  date: string; // e.g., "Hoje, 24 Out" or "2026-05-20"
  time: string;
  karts: number;
  category: string;
  price: number;
  pilotName: string;
  status: 'Pendente' | 'Confirmada' | 'Concluída';
  phone?: string;
  cpf?: string;
}

export interface RankingDriver {
  rank: number;
  name: string;
  nickname: string;
  bestLap: string;
  recordBeaten?: boolean;
  avatar: string;
  tagline: string;
  weightCategory?: string;
}

export interface CircuitCurve {
  id: string;
  name: string;
  type: 'Alta' | 'Média' | 'Baixa';
  x: number; // percentage 0-100
  y: number; // percentage 0-100
}

export type ActiveTab = 'home' | 'calendar' | 'ranking' | 'profile' | 'admin';
