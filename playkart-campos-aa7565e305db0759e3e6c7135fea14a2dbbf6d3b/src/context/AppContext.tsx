import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ActiveTab, TimeSlot, Booking, PilotProfile, RankingDriver } from '../types';
import { 
  INITIAL_TIME_SLOTS, 
  INITIAL_RANKINGS, 
  INITIAL_PILOT_PROFILE, 
  INITIAL_BOOKINGS,
  loadFromLocalStorage,
  saveToLocalStorage 
} from '../data';

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
        name: 'Erisson Ribeiro Junior',
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
      handleUpdateSlot, handleUpdateProfile, handleLoginSuccess, handleRegisterPilot, handleLogout
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
