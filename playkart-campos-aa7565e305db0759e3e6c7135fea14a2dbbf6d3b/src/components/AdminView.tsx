import React, { useState } from 'react';
import { Users, Timer, Calendar, Edit, Trash2, X, Save } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PilotProfile, TimeSlot } from '../types';

export default function AdminView() {
  const { 
    bookings, slots, registeredPilots, handleCancelBooking, handleUpdateSlot, handleUpdateProfile 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'pilots' | 'bookings' | 'slots'>('pilots');
  const [editingPilot, setEditingPilot] = useState<PilotProfile | null>(null);
  const [editingSlot, setEditingSlot] = useState<TimeSlot | null>(null);

  const handleDeleteBooking = (id: string) => {
    if (confirm('Tem certeza que deseja cancelar essa reserva?')) handleCancelBooking(id);
  };

  const handleSavePilot = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPilot) { handleUpdateProfile(editingPilot); setEditingPilot(null); }
  };

  const handleSaveSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSlot) {
      const used = editingSlot.totalKarts - editingSlot.availableKarts;
      const available = Math.max(0, editingSlot.totalKarts - used);
      handleUpdateSlot({ ...editingSlot, availableKarts: available, isFull: available === 0 });
      setEditingSlot(null);
    }
  };

  const updatePilotField = (field: keyof PilotProfile, value: string) => {
    if (editingPilot) setEditingPilot({ ...editingPilot, [field]: value });
  };

  const PilotField = ({ label, field, type = 'text', children }: { label: string; field: keyof PilotProfile; type?: string; children?: React.ReactNode }) => (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] font-black text-brand-text-muted uppercase tracking-widest">{label}</label>
      {children ?? <input type={type} value={(editingPilot?.[field] as string) ?? ''} onChange={(e) => updatePilotField(field, e.target.value)} className="bg-brand-surface text-brand-text p-3 border border-brand-border rounded text-xs font-semibold" />}
    </div>
  );

  return (
    <div className="w-full">
      <div className="mb-10">
        <h2 className="font-display text-4xl italic uppercase text-brand-red">PAINEL DE ADMINISTRAÇÃO</h2>
        <p className="font-sans text-brand-text-muted mt-2">Gerencie clientes, reservas da pista e sessões.</p>
      </div>

      <div className="flex border-b border-brand-border mb-8 overflow-x-auto">
        {[
          { tab: 'pilots', icon: <Users className="w-4 h-4"/>, label: 'Clientes' },
          { tab: 'bookings', icon: <Calendar className="w-4 h-4"/>, label: 'Agendamentos' },
          { tab: 'slots', icon: <Timer className="w-4 h-4"/>, label: 'Sessões' }
        ].map(({ tab, icon, label }) => (
          <button key={tab} onClick={() => setActiveTab(tab as any)} className={`px-6 py-4 font-sans text-sm font-bold uppercase flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${activeTab === tab ? 'text-brand-red border-brand-red' : 'text-brand-text-muted border-transparent hover:text-white'}`}>
            {icon}{label}
          </button>
        ))}
      </div>

      {editingPilot && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#121214] border border-brand-border rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between p-6 border-b border-brand-border uppercase tracking-widest font-display text-xl text-brand-red"><span>Editar Piloto</span><X className="w-5 h-5 cursor-pointer" onClick={() => setEditingPilot(null)}/></div>
            <form onSubmit={handleSavePilot} className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <PilotField label="Nome" field="name" /><PilotField label="Apelido" field="nickname" />
              <PilotField label="E-mail" field="email" type="email" /><PilotField label="WhatsApp" field="whatsapp" type="tel" />
              <button type="submit" className="sm:col-span-2 bg-brand-red text-white py-3 rounded font-black tracking-widest transition-all hover:bg-brand-red-hover flex items-center justify-center gap-2"><Save className="w-4 h-4"/> SALVAR</button>
            </form>
          </div>
        </div>
      )}

      {editingSlot && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#121214] border border-brand-border rounded-xl w-full max-w-md p-6">
            <h3 className="font-display text-xl italic text-brand-red mb-6">EDITAR SESSÃO - {editingSlot.time}</h3>
            <form onSubmit={handleSaveSlot} className="flex flex-col gap-4">
              <input type="text" value={editingSlot.time} onChange={e => setEditingSlot({...editingSlot, time: e.target.value})} className="bg-brand-surface text-brand-text p-3 border border-brand-border rounded text-xs" />
              <button type="submit" className="bg-brand-red text-white py-3 rounded font-black tracking-widest transition-all hover:bg-brand-red-hover">SALVAR SESSÃO</button>
            </form>
          </div>
        </div>
      )}

      {activeTab === 'pilots' && (
        <div className="bg-[#121214] border border-brand-border rounded-lg overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse min-w-[900px]">
            <thead className="bg-brand-surface uppercase text-[10px] tracking-widest font-black text-brand-text-muted border-b border-brand-border">
              <tr><th className="p-4">Piloto</th><th className="p-4">E-mail</th><th className="p-4">WhatsApp</th><th className="p-4 text-right">Ação</th></tr>
            </thead>
            <tbody>
              {registeredPilots.map((p, i) => (
                <tr key={i} className="border-b border-brand-border/40 hover:bg-brand-surface-high/30 transition-all font-sans">
                  <td className="p-4 flex items-center gap-3"><img src={p.avatar} className="w-8 h-8 rounded-full border border-brand-border object-cover" /><span>{p.name}<br/><span className="text-xs italic text-brand-text-muted">{p.nickname}</span></span></td>
                  <td className="p-4">{p.email}</td>
                  <td className="p-4">{p.whatsapp || p.phone}</td>
                  <td className="p-4 text-right"><button onClick={() => setEditingPilot({...p})} className="p-1.5 bg-brand-surface-high hover:bg-brand-red text-brand-text-muted hover:text-white rounded transition-all"><Edit className="w-4 h-4"/></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'bookings' && (
        <div className="bg-[#121214] border border-brand-border rounded-lg overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse min-w-[700px]">
            <thead className="bg-brand-surface uppercase text-[10px] tracking-widest font-black text-brand-text-muted border-b border-brand-border">
              <tr><th className="p-4">Data/Hora</th><th className="p-4">Piloto</th><th className="p-4">Karts</th><th className="p-4 text-right">Ação</th></tr>
            </thead>
            <tbody className="font-sans">
              {bookings.map((b) => (
                <tr key={b.id} className="border-b border-brand-border/40 hover:bg-brand-surface-high/30">
                  <td className="p-4 font-bold">{b.date} • {b.time}</td>
                  <td className="p-4">{b.pilotName}</td>
                  <td className="p-4 font-bold">{b.karts}</td>
                  <td className="p-4 text-right"><button onClick={() => handleDeleteBooking(b.id)} className="p-1.5 bg-brand-surface-high hover:bg-brand-red text-brand-red hover:text-white rounded transition-all"><Trash2 className="w-4 h-4"/></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'slots' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {slots.map((slot) => (
            <div key={slot.id} className="bg-[#121214] border border-brand-border p-6 rounded-lg flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-black uppercase text-brand-text-muted">{slot.type}</span>
                <h3 className="font-display text-4xl text-white italic mt-3">{slot.time}</h3>
                <p className="mt-5 text-sm text-brand-text-muted">R$ {slot.price.toFixed(2)} / {slot.availableKarts} Livres</p>
              </div>
              <button onClick={() => setEditingSlot({...slot})} className="mt-6 w-full border border-brand-red text-brand-red py-2.5 uppercase text-xs font-black hover:bg-brand-red hover:text-white transition-all rounded">EDITAR</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
