import React, { useState } from 'react';
import { Booking, TimeSlot, PilotProfile } from '../types';
import { Users, Timer, Calendar, X, Edit, Trash2 } from 'lucide-react';

interface AdminViewProps {
  bookings: Booking[];
  slots: TimeSlot[];
  registeredPilots: PilotProfile[];
  onCancelBooking: (id: string) => void;
  onUpdateSlot: (slot: TimeSlot) => void;
}

export default function AdminView({ 
  bookings, 
  slots, 
  registeredPilots,
  onCancelBooking,
  onUpdateSlot
}: AdminViewProps) {
  const [activeTab, setActiveTab] = useState<'pilots' | 'bookings' | 'slots'>('pilots');

  const handleDeleteBooking = (id: string) => {
    if (confirm('Tem certeza que deseja cancelar essa reserva?')) {
      onCancelBooking(id);
    }
  };

  const handleUpdateSlotClick = (slot: TimeSlot) => {
    const newPrice = prompt('Novo preço da sessão:', slot.price.toString());
    const newTotal = prompt('Novo número total de karts:', slot.totalKarts.toString());
    
    if (newPrice && newTotal) {
      onUpdateSlot({
        ...slot,
        price: parseFloat(newPrice),
        totalKarts: parseInt(newTotal, 10),
        availableKarts: parseInt(newTotal, 10) - (slot.totalKarts - slot.availableKarts) // Adjusts correctly
      });
    }
  };

  return (
    <div className="w-full">
      <div className="mb-10">
        <h2 className="font-display text-4xl italic uppercase text-brand-red tracking-tight flex items-center gap-3">
          PAINEL DE ADMINISTRAÇÃO
        </h2>
        <p className="font-sans text-brand-text-muted mt-2">
          Gerencie clientes, reservas da pista e horários das sessões.
        </p>
      </div>

      <div className="flex border-b border-brand-border mb-8 overflow-x-auto custom-scrollbar">
        <button
          onClick={() => setActiveTab('pilots')}
          className={`px-6 py-4 font-sans text-sm font-bold tracking-widest uppercase flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'pilots' ? 'text-brand-red border-brand-red' : 'text-brand-text-muted border-transparent hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          Clientes (Pilotos)
        </button>
        <button
          onClick={() => setActiveTab('bookings')}
          className={`px-6 py-4 font-sans text-sm font-bold tracking-widest uppercase flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'bookings' ? 'text-brand-red border-brand-red' : 'text-brand-text-muted border-transparent hover:text-white'
          }`}
        >
          <Calendar className="w-4 h-4" />
          Agendamentos Confirmados
        </button>
        <button
          onClick={() => setActiveTab('slots')}
          className={`px-6 py-4 font-sans text-sm font-bold tracking-widest uppercase flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'slots' ? 'text-brand-red border-brand-red' : 'text-brand-text-muted border-transparent hover:text-white'
          }`}
        >
          <Timer className="w-4 h-4" />
          Gerenciar Sessões
        </button>
      </div>

      {activeTab === 'pilots' && (
        <div className="bg-[#121214] border border-brand-border rounded-lg overflow-x-auto">
          <table className="w-full text-left font-sans text-sm border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-brand-surface border-b border-brand-border uppercase text-[10px] tracking-widest font-black text-brand-text-muted">
                <th className="p-4">Piloto</th>
                <th className="p-4">E-mail</th>
                <th className="p-4">WhatsApp</th>
                <th className="p-4">Documento</th>
                <th className="p-4">Nascimento</th>
                <th className="p-4">Sangue</th>
                <th className="p-4">Races</th>
              </tr>
            </thead>
            <tbody>
              {registeredPilots.map((p, i) => (
                <tr key={i} className="border-b border-brand-border/40 hover:bg-brand-surface-high/30 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {p.avatar ? (
                        <img src={p.avatar} alt="avatar" className="w-8 h-8 rounded-full border border-brand-border object-cover" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-brand-red flex items-center justify-center text-white"><Users className="w-4 h-4"/></div>
                      )}
                      
                      <span className="font-bold text-white">{p.name} <br/><span className="text-xs text-brand-text-muted italic">{p.nickname}</span></span>
                    </div>
                  </td>
                  <td className="p-4">{p.email}</td>
                  <td className="p-4">{p.whatsapp || p.phone || '-'}</td>
                  <td className="p-4">{p.documentType ? `${p.documentType}: ${p.documentNumber}` : (p.cpf || '-')}</td>
                  <td className="p-4">{p.dob ? new Date(p.dob+'T00:00:00').toLocaleDateString('pt-BR') : '-'}</td>
                  <td className="p-4 font-bold text-brand-red">{p.bloodType || '-'}</td>
                  <td className="p-4 font-display text-xl">{p.totalRaces}</td>
                </tr>
              ))}
              {registeredPilots.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-brand-text-muted italic">Nenhum piloto cadastrado no momento.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'bookings' && (
        <div className="bg-[#121214] border border-brand-border rounded-lg overflow-x-auto">
          <table className="w-full text-left font-sans text-sm border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-brand-surface border-b border-brand-border uppercase text-[10px] tracking-widest font-black text-brand-text-muted">
                <th className="p-4">Data / Hora</th>
                <th className="p-4">Piloto (Grupo)</th>
                <th className="p-4">Categoria</th>
                <th className="p-4">Karts</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} className="border-b border-brand-border/40 hover:bg-brand-surface-high/30 transition-colors">
                  <td className="p-4 font-bold">{b.date} • {b.time}</td>
                  <td className="p-4 text-white inline-flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-brand-red"/>{b.pilotName}</td>
                  <td className="p-4">{b.category}</td>
                  <td className="p-4 font-bold">{b.karts}</td>
                  <td className="p-4">
                    <span className="bg-emerald-950 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded text-[10px] tracking-widest font-bold uppercase">
                      {b.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleDeleteBooking(b.id)} className="text-brand-red hover:text-white p-1.5 rounded transition-colors bg-brand-surface-high hover:bg-brand-red" title="Cancelar Reserva">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {bookings.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-brand-text-muted italic">Nenhuma reserva ativa encontrada.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'slots' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {slots.map((slot) => (
            <div key={slot.id} className="bg-[#121214] border border-brand-border p-6 rounded-lg relative overflow-hidden flex flex-col justify-between shadow-[0_4px_15px_rgba(0,0,0,0.6)]">
              <div>
                <span className="font-sans text-[10px] font-black tracking-widest uppercase text-brand-text-muted bg-brand-surface px-2 py-0.5 rounded border border-brand-border">{slot.type}</span>
                <h3 className="font-display text-4xl text-white tracking-widest italic mt-3">{slot.time}</h3>
                <div className="mt-5 flex flex-col gap-2">
                  <div className="flex justify-between items-center text-sm font-sans border-b border-brand-border/40 pb-2">
                    <span className="text-brand-text-muted">Valor / Piloto:</span>
                    <span className="text-emerald-400 font-bold">R$ {slot.price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-sans pt-1">
                    <span className="text-brand-text-muted">Disponibilidade:</span>
                    <span className={`${slot.availableKarts === 0 ? 'text-brand-red' : 'text-white'} font-bold`}>
                      {slot.availableKarts} / {slot.totalKarts} livres
                    </span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => handleUpdateSlotClick(slot)}
                className="mt-6 flex items-center justify-center gap-2 bg-brand-red/10 border border-brand-red/40 text-brand-red hover:bg-brand-red hover:text-white py-2.5 transition-colors rounded uppercase text-xs font-black tracking-widest font-sans cursor-pointer"
              >
                <Edit className="w-3.5 h-3.5" /> Editar Sessão
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
