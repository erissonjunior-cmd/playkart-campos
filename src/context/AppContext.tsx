import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ActiveTab, TimeSlot, Booking, PilotProfile, RankingDriver, CircuitCurve } from '../types';
import { 
  INITIAL_TIME_SLOTS, 
  INITIAL_RANKINGS, 
  INITIAL_PILOT_PROFILE, 
  INITIAL_BOOKINGS,
  loadFromLocalStorage,
  saveToLocalStorage 
} from '../data';

export type TrackStatus = 'dry' | 'damp' | 'wet' | 'closed';

interface AppContextType {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  profile: PilotProfile;
  setProfile: (profile: PilotProfile) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  registeredPilots: PilotProfile[];
  setRegisteredPilots: (pilots: PilotProfile[]) => void;
  slots: TimeSlot[];
  setSlots: (slots: TimeSlot[]) => void;
  bookings: Booking[];
  setBookings: (bookings: Booking[]) => void;
  rankings: RankingDriver[];
  setRankings: (rankings: RankingDriver[]) => void;
  quickSelections: { date?: string; pilots?: number; category?: string; pilotName?: string } | null;
  setQuickSelections: (selections: { date?: string; pilots?: number; category?: string; pilotName?: string } | null) => void;
  circuitCurves: CircuitCurve[];
  setCircuitCurves: (curves: CircuitCurve[]) => void;
  circuitMapImage: string;
  setCircuitMapImage: (url: string) => void;
  circuitPath: string;
  setCircuitPath: (path: string) => void;
  trackStatus: TrackStatus;
  isAutoStatus: boolean;
  setIsAutoStatus: (auto: boolean) => void;
  handleUpdateTrackStatus: (status: TrackStatus) => void;
  
  // Actions
  handleNavigate: (tab: ActiveTab) => void;
  handleQuickBook: (date: string, pilots: number, category: string, pilotName?: string) => void;
  handleConfirmBooking: (newBookingData: Omit<Booking, 'id' | 'status'>) => void;
  handleCancelBooking: (id: string) => void;
  handleUpdateSlot: (updatedSlot: TimeSlot) => void;
  handleUpdateProfile: (updated: PilotProfile) => void;
  handleLoginSuccess: (user: PilotProfile) => void;
  handleRegisterPilot: (newPilot: PilotProfile) => void;
  handleLogout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [quickSelections, setQuickSelections] = useState<{ date?: string; pilots?: number; category?: string; pilotName?: string } | null>(null);
  const [circuitCurves, setCircuitCurves] = useState<CircuitCurve[]>(() => 
    loadFromLocalStorage<CircuitCurve[]>('pk_campos_circuit_curves', [
      { id: 'c1', name: 'Curva 1 – Largada',    type: 'Média', x: 47, y: 18 },
      { id: 'c2', name: 'Curva 2 – Senna S',    type: 'Baixa', x: 72, y: 28 },
      { id: 'c3', name: 'Curva 3 – Chicane',    type: 'Baixa', x: 80, y: 45 },
      { id: 'c4', name: 'Curva 4 – Saída',      type: 'Média', x: 68, y: 62 },
      { id: 'c5', name: 'Curva 5 – Ferradura',  type: 'Baixa', x: 50, y: 74 },
      { id: 'c6', name: 'Curva 6 – Central',    type: 'Média', x: 32, y: 62 },
      { id: 'c7', name: 'Curva 7 – Rápida',     type: 'Alta',  x: 20, y: 44 },
      { id: 'c8', name: 'Curva 8 – Box',        type: 'Média', x: 30, y: 28 },
    ])
  );

  const [circuitMapImage, setCircuitMapImage] = useState<string>(() => 
    loadFromLocalStorage<string>('pk_campos_circuit_map_image', 'https://files.catbox.moe/rbtosq.png')
  );

  const [circuitPath, setCircuitPath] = useState<string>(() => 
    loadFromLocalStorage<string>('pk_campos_circuit_path', '')
  );

  const [trackStatus, setTrackStatus] = useState<TrackStatus>(() => 
    loadFromLocalStorage<TrackStatus>('pk_campos_track_status', 'dry')
  );
  const [isAutoStatus, setIsAutoStatus] = useState<boolean>(() => 
    loadFromLocalStorage<boolean>('pk_campos_is_auto_status', true)
  );
  const [lastWeatherFetch, setLastWeatherFetch] = useState<number>(0);

  // Kart grid positions (static test data for now)
  const kartPositions = [
    { id: 'k1', number: 1, pilot: 'Erisson Jr.',  x: 47, y: 14, color: '#ef4444' },
    { id: 'k2', number: 2, pilot: 'Sarah Shift',  x: 50, y: 14, color: '#f97316' },
    { id: 'k3', number: 3, pilot: 'Carlos D.',    x: 53, y: 14, color: '#06b6d4' },
    { id: 'k4', number: 4, pilot: 'Marcus V.',    x: 47, y: 11, color: '#a855f7' },
    { id: 'k5', number: 5, pilot: 'Ana P.',       x: 50, y: 11, color: '#22c55e' },
  ];


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
    
    // Default Admin Accounts
    const defaultAdmins: PilotProfile[] = [
      {
        name: 'Erisson Ribeiro de Souza Junior',
        nickname: 'ERISSON_MASTER',
        email: 'esribeirojunior@gmail.com',
        category: 'Staff',
        experienceLevel: 'Profissional',
        activeStreak: 52,
        totalRaces: 100,
        bestLap: '42:194',
        avatar: 'https://picsum.photos/seed/eduardo/200/200',
        phone: '(22) 99999-9999',
        whatsapp: '(22) 99999-9999',
        password: 'playkart2026',
        isRegistered: true,
        role: 'admin'
      },
      {
        name: 'Sarah Shift',
        nickname: 'SARAH_PRO',
        email: 'sarah.shift@playkart.com',
        category: 'Sênior (125cc)',
        experienceLevel: 'Profissional',
        activeStreak: 12,
        totalRaces: 45,
        bestLap: '42:250',
        avatar: 'https://picsum.photos/seed/sarah/200/200',
        phone: '(22) 88888-8888',
        whatsapp: '(22) 88888-8888',
        password: 'playkart2026',
        isRegistered: true,
        role: 'admin'
      }
    ];

    // Merge loaded with admins, avoiding duplicates
    let updatedList = [...loaded];
    defaultAdmins.forEach(admin => {
      if (!updatedList.some(p => p.email.toLowerCase() === admin.email.toLowerCase())) {
        updatedList.unshift(admin);
      }
    });

    return updatedList;
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

  // Persist states to LocalStorage
  useEffect(() => { saveToLocalStorage('pk_campos_profile', profile); }, [profile]);
  useEffect(() => { saveToLocalStorage('pk_campos_is_logged_in', isLoggedIn); }, [isLoggedIn]);
  useEffect(() => { saveToLocalStorage('pk_campos_registered_pilots', registeredPilots); }, [registeredPilots]);
  useEffect(() => { saveToLocalStorage('pk_campos_slots', slots); }, [slots]);
  useEffect(() => { saveToLocalStorage('pk_campos_bookings', bookings); }, [bookings]);
  useEffect(() => { saveToLocalStorage('pk_campos_rankings', rankings); }, [rankings]);
  useEffect(() => { saveToLocalStorage('pk_campos_circuit_curves', circuitCurves); }, [circuitCurves]);
  useEffect(() => { saveToLocalStorage('pk_campos_circuit_map_image', circuitMapImage); }, [circuitMapImage]);
  useEffect(() => { saveToLocalStorage('pk_campos_circuit_path', circuitPath); }, [circuitPath]);
  useEffect(() => { saveToLocalStorage('pk_campos_track_status', trackStatus); }, [trackStatus]);
  useEffect(() => { saveToLocalStorage('pk_campos_is_auto_status', isAutoStatus); }, [isAutoStatus]);

  // Ensure master admin is always sync'd in local storage list if missing
  useEffect(() => {
    const adminsToSync = [
      {
        name: 'Erisson Ribeiro de Souza Junior',
        nickname: 'ERISSON_MASTER',
        email: 'esribeirojunior@gmail.com',
        category: 'Staff',
        experienceLevel: 'Profissional',
        activeStreak: 52,
        totalRaces: 100,
        bestLap: '42:194',
        avatar: 'https://picsum.photos/seed/eduardo/200/200',
        phone: '(22) 99999-9999',
        whatsapp: '(22) 99999-9999',
        password: 'playkart2026',
        isRegistered: true,
        role: 'admin' as const
      },
      {
        name: 'Administrador Genérico',
        nickname: 'ADMIN',
        email: 'admin@admin.com',
        category: 'Staff',
        experienceLevel: 'Profissional',
        activeStreak: 0,
        totalRaces: 0,
        bestLap: '00:000',
        avatar: '',
        phone: '000',
        whatsapp: '000',
        password: 'admin',
        isRegistered: true,
        role: 'admin' as const
      }
    ];

    setRegisteredPilots(prev => {
      let newList = [...prev];
      let changed = false;
      
      adminsToSync.forEach(admin => {
        const existingIndex = newList.findIndex(p => p.email.toLowerCase() === admin.email.toLowerCase());
        
        if (existingIndex === -1) {
          // If totally missing, add it
          newList.unshift(admin);
          changed = true;
        } else if (newList[existingIndex].password !== admin.password) {
          // If exists but password changed/wrong, update it
          newList[existingIndex] = { ...newList[existingIndex], password: admin.password, role: 'admin' };
          changed = true;
        }
      });
      
      return changed ? newList : prev;
    });
  }, [registeredPilots]);

  const handleUpdateTrackStatus = (status: TrackStatus) => {
    setTrackStatus(status);
    setIsAutoStatus(false); // Assume controle manual ao trocar manualmente
  };

  // Weather Sync Logic (Campos dos Goytacazes: -21.7642, -41.3236)
  useEffect(() => {
    if (!isAutoStatus) return;

    const fetchWeather = async () => {
      try {
        console.log("Sincronizando clima de Campos (Open-Meteo)...");
        const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=-21.7642&longitude=-41.3236&current=weather_code,precipitation&timezone=auto');
        const data = await res.json();
        
        const prec = data.current.precipitation;
        const code = data.current.weather_code;
        
        // 0: Clear, 1-3: Partly Cloudy, 45-48: Fog
        // 51-67: Drizzle/Rain, 71-77: Snow, 80-82: Rain Showers, 95-99: Thunderstorm
        
        let newStatus: TrackStatus = 'dry';
        if (prec > 1.0 || code >= 61) {
          newStatus = 'wet';
        } else if (prec > 0.1 || (code >= 51 && code <= 55)) {
          newStatus = 'damp';
        }

        if (newStatus !== trackStatus) {
          setTrackStatus(newStatus);
        }
        setLastWeatherFetch(Date.now());
      } catch (err) {
        console.error("Erro ao sincronizar clima:", err);
      }
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 300000); // A cada 5 minutos
    return () => clearInterval(interval);
  }, [isAutoStatus, trackStatus]);

  // Actions
  const handleNavigate = (tab: ActiveTab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuickBook = (date: string, pilots: number, category: string, pilotName?: string) => {
    setQuickSelections({ date, pilots, category, pilotName });
    setActiveTab('calendar');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConfirmBooking = (newBookingData: Omit<Booking, 'id' | 'status'>) => {
    const bookingId = `booking-${Date.now()}`;
    const newReservation: Booking = { ...newBookingData, id: bookingId, status: 'Confirmada' };
    setBookings(prev => [newReservation, ...prev]);
    setSlots(currentSlots => 
      currentSlots.map(slot => {
        if (slot.id === newBookingData.slotId) {
          const nextKarts = Math.max(0, slot.availableKarts - newBookingData.karts);
          return { ...slot, availableKarts: nextKarts, isFull: nextKarts === 0 };
        }
        return slot;
      })
    );
    setProfile(prev => ({ ...prev, totalRaces: prev.totalRaces + 1 }));
  };

  const handleCancelBooking = (id: string) => {
    const backupBooking = bookings.find(b => b.id === id);
    if (!backupBooking) return;
    setSlots(currentSlots => 
      currentSlots.map(slot => {
        if (slot.id === backupBooking.slotId) {
          const nextKarts = Math.min(slot.totalKarts, slot.availableKarts + backupBooking.karts);
          return { ...slot, availableKarts: nextKarts, isFull: nextKarts === 0 };
        }
        return slot;
      })
    );
    setBookings(prev => prev.filter(b => b.id !== id));
    setProfile(prev => ({ ...prev, totalRaces: Math.max(0, prev.totalRaces - 1) }));
  };

  const handleUpdateSlot = (updatedSlot: TimeSlot) => {
    setSlots(current => current.map(s => s.id === updatedSlot.id ? updatedSlot : s));
  };

  const handleUpdateProfile = (updated: PilotProfile) => {
    setProfile(updated);
    setRegisteredPilots(prev => prev.map(p => p.email.toLowerCase() === updated.email.toLowerCase() ? updated : p));
  };

  const handleLoginSuccess = (user: PilotProfile) => {
    setProfile(user);
    setIsLoggedIn(true);
  };

  const handleRegisterPilot = (newPilot: PilotProfile) => {
    setRegisteredPilots(prev => [...prev, newPilot]);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setProfile(INITIAL_PILOT_PROFILE);
  };

  return (
    <AppContext.Provider value={{
      activeTab, setActiveTab, profile, setProfile, isLoggedIn, setIsLoggedIn,
      registeredPilots, setRegisteredPilots, slots, setSlots, bookings, setBookings,
      rankings, setRankings, quickSelections, setQuickSelections,
      handleNavigate, handleQuickBook, handleConfirmBooking, handleCancelBooking,
      handleUpdateSlot, handleUpdateProfile, handleLoginSuccess, handleRegisterPilot, handleLogout,
      circuitCurves, setCircuitCurves, circuitMapImage, setCircuitMapImage, circuitPath, setCircuitPath,
      trackStatus, handleUpdateTrackStatus, isAutoStatus, setIsAutoStatus
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
