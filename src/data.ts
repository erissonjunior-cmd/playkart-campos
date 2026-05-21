import { TimeSlot, RankingDriver, PilotProfile, Booking } from './types';

const p1Avatar = 'https://files.catbox.moe/b4txuz.jpg';
const p2Avatar = 'https://files.catbox.moe/l5ofx0.jpg';
const p3Avatar = 'https://files.catbox.moe/t7ynoa.jpg';

export const INITIAL_TIME_SLOTS: TimeSlot[] = [
  {
    id: 'slot-1',
    time: '16:00',
    availableKarts: 8,
    totalKarts: 12,
    price: 85.00,
    isFull: false,
    type: 'Fast Track'
  },
  {
    id: 'slot-2',
    time: '16:30',
    availableKarts: 12,
    totalKarts: 12,
    price: 85.00,
    isFull: true,
    type: 'Standard'
  },
  {
    id: 'slot-3',
    time: '17:00',
    availableKarts: 4,
    totalKarts: 12,
    price: 85.00,
    isFull: false,
    type: 'Standard'
  },
  {
    id: 'slot-4',
    time: '17:30',
    availableKarts: 10,
    totalKarts: 12,
    price: 95.00,
    isFull: false,
    type: 'Night Run'
  },
  {
    id: 'slot-5',
    time: '18:00',
    availableKarts: 1,
    totalKarts: 12,
    price: 85.00,
    isFull: false,
    type: 'Standard'
  },
  {
    id: 'slot-6',
    time: '18:30',
    availableKarts: 6,
    totalKarts: 12,
    price: 85.00,
    isFull: false,
    type: 'Standard'
  },
  {
    id: 'slot-7',
    time: '19:30',
    availableKarts: 5,
    totalKarts: 12,
    price: 110.00,
    isFull: false,
    type: 'Pro Academy'
  },
  {
    id: 'slot-8',
    time: '20:30',
    availableKarts: 0,
    totalKarts: 12,
    price: 95.00,
    isFull: true,
    type: 'Night Run'
  }
];

export const INITIAL_RANKINGS: RankingDriver[] = [
  {
    rank: 1,
    name: 'Alex Apex',
    nickname: 'ALEX_APEX',
    bestLap: '42:194',
    recordBeaten: true,
    avatar: p1Avatar,
    tagline: 'QUEBRA DE RECORDE - LÍDER ABSOLUTO'
  },
  {
    rank: 2,
    name: 'Sarah Shift',
    nickname: 'SARAH_SHIFT',
    bestLap: '43:012',
    avatar: p2Avatar,
    tagline: 'MELHOR VOLTA SHIFT-CONTROL'
  },
  {
    rank: 3,
    name: 'Drft King',
    nickname: 'DRFT_KING',
    bestLap: '43:288',
    avatar: p3Avatar,
    tagline: 'DERRAPAGENS DE CONTROLE MILIMÉTRICO'
  },
  {
    rank: 4,
    name: 'Marco V8',
    nickname: 'MARCO_V8',
    bestLap: '43:890',
    avatar: 'https://picsum.photos/seed/marco/200/200',
    tagline: 'Mestre da tração constante'
  },
  {
    rank: 5,
    name: 'Velo Rossi',
    nickname: 'VELO_ROSSI',
    bestLap: '44:112',
    avatar: 'https://picsum.photos/seed/rossi/200/200',
    tagline: 'Curvas agressivas e frenagem tardia'
  },
  {
    rank: 6,
    name: 'Bruno Boxer',
    nickname: 'BOXER_BRUNO',
    bestLap: '44:420',
    avatar: 'https://picsum.photos/seed/bruno/200/200',
    tagline: 'Ritmo consistente em qualquer setor'
  },
  {
    rank: 7,
    name: 'Luna Light',
    nickname: 'LUNA_SPEED',
    bestLap: '44:980',
    avatar: 'https://picsum.photos/seed/luna/200/200',
    tagline: 'Velocidade final estonteante'
  }
];

export const INITIAL_PILOT_PROFILE: PilotProfile = {
  name: 'Erisson Ribeiro de Souza Junior',
  nickname: 'EDU_KART',
  email: 'esribeirojunior@gmail.com',
  category: 'Sênior (125cc)',
  activeStreak: 3,
  totalRaces: 14,
  bestLap: '44:652',
  avatar: p1Avatar,
  experienceLevel: 'Intermediário'
};

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'booking-mock-1',
    slotId: 'slot-1',
    date: 'Hoje, 24 Out',
    time: '16:00',
    karts: 2,
    category: 'Sênior (125cc)',
    price: 170.00,
    pilotName: 'Erisson Ribeiro de Souza Junior',
    status: 'Confirmada'
  }
];

// Helper functions for LocalStorage persistence
export const loadFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const data = localStorage.getItem(key);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.warn(`Erro ao carregar do localStorage para a chave: ${key}`, error);
  }
  return defaultValue;
};

export const saveToLocalStorage = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Erro ao salvar no localStorage para a chave: ${key}`, error);
  }
};
