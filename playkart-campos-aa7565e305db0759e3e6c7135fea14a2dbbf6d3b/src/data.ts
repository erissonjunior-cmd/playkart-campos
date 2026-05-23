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

export const INITIAL_RANKINGS: RankingDriver[] = [];

export const INITIAL_PILOT_PROFILE: PilotProfile = {
  name: '',
  nickname: '',
  email: '',
  category: '',
  activeStreak: 0,
  totalRaces: 0,
  bestLap: '',
  avatar: '',
  experienceLevel: 'Iniciante',
  isRegistered: false
};

export const INITIAL_BOOKINGS: Booking[] = [];

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
