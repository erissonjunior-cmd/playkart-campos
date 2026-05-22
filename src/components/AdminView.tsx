import React, { useState } from 'react';
import { Booking, TimeSlot, PilotProfile } from '../types';
import { Users, Timer, Calendar, Edit, Trash2, X, Save } from 'lucide-react';

interface AdminViewProps {
  bookings: Booking[];
  slots: TimeSlot[];
  registeredPilots: PilotProfile[];
  onCancelBooking: (id: string) => void;
  onUpdateSlot: (slot: TimeSlot) => void;
  onUpdatePilot: (pilot: PilotProfile) => void;
}

export default function AdminView({ 
  bookings, slots, registeredPilots, onCancelBooking, onUpdateSlot, onUpdatePilot
}: AdminViewProps) {
  const [activeTab, setActiveTab] = useState<'pilots' | 'bookings' | 'slots'>('pilots');
  const [editingPilot, setEditingPilot] = useState<PilotProfile | null>(null);
  const [editingSlot, setEditingSlot] = useState<TimeSlot | null>(null);

  const handleDeleteBooking = (id: string) => {
    if (confirm('Tem certeza que deseja cancelar essa reserva?')) {
      onCancelBooking(id);
    }
  };

  const handleSavePilot = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPilot) { onUpdatePilot(editingPilot); setEditingPilot(null); }
  };

  const handleSaveSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSlot) {
      const used = editingSlot.totalKarts - editingSlot.availableKarts;
      const available = Math.max(0, editingSlot.totalKarts - used);
      onUpdateSlot({ ...editingSlot, availableKarts: available, isFull: available === 0 });
      setEditingSlot(null);
    }
  };

  const updatePilotField = (field: keyof PilotProfile, value: string) => {
    if (editingPilot) setEditingPilot({ ...editingPilot, [field]: value });
  };

  const PilotField = ({ label, field, type = 'text', children }: { label: string; field: keyof PilotProfile; type?: string; children?: React.ReactNode }) => (
    <div className="flex flex-col gap-1.5">
      <label className="font-sans text-[10px] font-black text-brand-text-muted tracking-widest uppercase">{label}</label>
      {children ?? (
        <input type={type} value={(editingPilot?.[field] as string) ?? ''}
          onChange={(e) => updatePilotField(field, e.target.value)}
          className="bg-brand-surface text-brand-text p-3 border border-brand-border focus:border-brand-red focus:outline-none rounded text-xs font-semibold" />
      )}
    </div>
  );

  const modalClasses = "fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4";
  const panelClasses = "bg-[#121214] border border-brand-border rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto";

  return (
    <div className="w-full">
      <div className="mb-10">
        <h2 className="font-display text-4xl italic uppercase text-brand-red tracking-tight">PAINEL DE ADMINISTRAÇÃO</h2>
        <p className="font-sans text-brand-text-muted mt-2">Gerencie clientes, reservas da pista e horários das sessões.</p>
      </div>

      <div className="flex border-b border-brand-border mb-8 overflow-x-auto">
        {[
          { tab: 'pilots', icon: <Users className="w-4 h-4"/>, label: 'Clientes (Pilotos)' },
          { tab: 'bookings', icon: <Calendar className="w-4 h-4"/>, label: 'Agendamentos' },
          { tab: 'slots', icon: <Timer className="w-4 h-4"/>, label: 'Gerenciar Sessões' }
        ].map(({ tab, icon, label }) => (
          <button key={tab} onClick={() => setActiveTab(tab as any)}
            className={`px-6 py-4 font-sans text-sm font-bold tracking-widest uppercase flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${activeTab === tab ? 'text-brand-red border-brand-red' : 'text-brand-text-muted border-transparent hover:text-white'}`}>
            {icon}{label}
          </button>
        ))}
      </div>

      {/* MODAL: EDIT PILOT */}
      {editingPilot && (
        <div className={modalClasses} onClick={() => setEditingPilot(null)}>
          <div className={panelClasses} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-brand-border">
              <span className="font-display text-xl italic uppercase text-brand-red tracking-wide">Editar Piloto</span>
              <button onClick={() => setEditingPilot(null)} className="text-brand-text-muted hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSavePilot} className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <PilotField label="Nome Completo" field="name" />
              <PilotField label="Apelido / Nickname" field="nickname" />
              <PilotField label="E-mail" field="email" type="email" />
              <PilotField label="WhatsApp" field="whatsapp" type="tel" />
              <PilotField label="Data de Nascimento" field="dob" type="date" />
              <PilotField label="Tipo Sanguíneo" field="bloodType" />
              <PilotField label="Tipo de Documento" field="documentType">
                <select value={editingPilot.documentType ?? 'CPF'} onChange={e => updatePilotField('documentType', e.target.value)}
                  className="bg-brand-surface text-brand-text p-3 border border-brand-border focus:border-brand-red focus:outline-none rounded text-xs font-semibold">
                  {['CPF','RG','Passaporte','Outro'].map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </PilotField>
              <PilotField label="Nº Documento" field="documentNumber" />
              <PilotField label="Categoria" field="category">
                <select value={editingPilot.category ?? ''} onChange={e => updatePilotField('category', e.target.value)}
                  className="bg-brand-surface text-brand-text p-3 border border-brand-border focus:border-brand-red focus:outline-none rounded text-xs font-semibold">
                  {['Sênior (125cc)','Cadete (60cc)','Super F4 (21hp)','Staff'].map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </PilotField>
              <PilotField label="Nível de Experiência" field="experienceLevel">
                <select value={editingPilot.experienceLevel ?? 'Iniciante'} onChange={e => updatePilotField('experienceLevel', e.target.value)}
                  className="bg-brand-surface text-brand-text p-3 border border-brand-border focus:border-brand-red focus:outline-none rounded text-xs font-semibold">
                  {['Iniciante','Intermediário','Avançado','Profissional'].map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </PilotField>
              <PilotField label="Nova Senha (vazio = sem alteração)" field="password" type="password" />
              <div className="sm:col-span-2 pt-4 flex justify-end gap-3 border-t border-brand-border mt-2">
                <button type="button" onClick={() => setEditingPilot(null)}
                  className="px-6 py-2.5 font-sans text-xs font-black uppercase tracking-widest border border-brand-border text-brand-text-muted hover:text-white rounded cursor-pointer">Cancelar</button>
                <button type="submit"
                  className="px-6 py-2.5 font-sans text-xs font-black uppercase tracking-widest bg-brand-red hover:bg-[#ff1e27] text-white rounded flex items-center gap-2 cursor-pointer shadow-[0_4px_15px_rgba(227,6,19,0.3)]">
                  <Save className="w-4 h-4" /> Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT SLOT */}
      {editingSlot && (
        <div className={modalClasses} onClick={() => setEditingSlot(null)}>
          <div className="bg-[#121214] border border-brand-border rounded-xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-brand-border">
              <span className="font-display text-xl italic uppercase text-brand-red tracking-wide">Editar Sessão — {editingSlot.time}</span>
              <button onClick={() => setEditingSlot(null)} className="text-brand-text-muted hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSaveSlot} className="p-6 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-sans text-[10px] font-black text-brand-text-muted tracking-widest uppercase">Horário</label>
                <input type="text" value={editingSlot.time} onChange={e => setEditingSlot({ ...editingSlot, time: e.target.value })}
                  className="bg-brand-surface text-brand-text p-3 border border-brand-border focus:border-brand-red focus:outline-none rounded text-xs font-semibold" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-sans text-[10px] font-black text-brand-text-muted tracking-widest uppercase">Tipo de Sessão</label>
                <select value={editingSlot.type ?? 'Standard'} onChange={e => setEditingSlot({ ...editingSlot, type: e.target.value as any })}
                  className="bg-brand-surface text-brand-text p-3 border border-brand-border focus:border-brand-red focus:outline-none rounded text-xs font-semibold">
                  {['Standard','Fast Track','Night Run','Pro Academy'].map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-sans text-[10px] font-black text-brand-text-muted tracking-widest uppercase">Preço (R$)</label>
                  <input type="number" step="0.01" value={editingSlot.price} onChange={e => setEditingSlot({ ...editingSlot, price: parseFloat(e.target.value) })}
                    className="bg-brand-surface text-brand-text p-3 border border-brand-border focus:border-brand-red focus:outline-none rounded text-xs font-semibold" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-sans text-[10px] font-black text-brand-text-muted tracking-widest uppercase">Total de Karts</label>
                  <input type="number" value={editingSlot.totalKarts} onChange={e => setEditingSlot({ ...editingSlot, totalKarts: parseInt(e.target.value, 10) })}
                    className="bg-brand-surface text-brand-text p-3 border border-brand-border focus:border-brand-red focus:outline-none rounded text-xs font-semibold" />
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-3 border-t border-brand-border mt-2">
                <button type="button" onClick={() => setEditingSlot(null)}
                  className="px-6 py-2.5 font-sans text-xs font-black uppercase tracking-widest border border-brand-border text-brand-text-muted hover:text-white rounded cursor-pointer">Cancelar</button>
                <button type="submit"
                  className="px-6 py-2.5 font-sans text-xs font-black uppercase tracking-widest bg-brand-red hover:bg-[#ff1e27] text-white rounded flex items-center gap-2 cursor-pointer shadow-[0_4px_15px_rgba(227,6,19,0.3)]">
                  <Save className="w-4 h-4" /> Salvar Sessão
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PILOTS TAB */}
      {activeTab === 'pilots' && (
        <div className="bg-[#121214] border border-brand-border rounded-lg overflow-x-auto">
          <table className="w-full text-left font-sans text-sm border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-brand-surface border-b border-brand-border uppercase text-[10px] tracking-widest font-black text-brand-text-muted">
                <th className="p-4">Piloto</th><th className="p-4">E-mail</th><th className="p-4">WhatsApp</th>
                <th className="p-4">Documento</th><th className="p-4">Nascimento</th><th className="p-4">Sangue</th>
                <th className="p-4">Races</th><th className="p-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody>
              {registeredPilots.map((p, i) => (
                <tr key={i} className="border-b border-brand-border/40 hover:bg-brand-surface-high/30 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {p.avatar ? <img src={p.avatar} alt="av" className="w-8 h-8 rounded-full border border-brand-border object-cover" />
                        : <div className="w-8 h-8 rounded-full bg-brand-red flex items-center justify-center text-white"><Users className="w-4 h-4"/></div>}
                      <span className="font-bold text-white">{p.name}<br/><span className="text-xs text-brand-text-muted italic">{p.nickname}</span></span>
                    </div>
                  </td>
                  <td className="p-4">{p.email}</td>
                  <td className="p-4">{p.whatsapp || p.phone || '-'}</td>
                  <td className="p-4">{p.documentType ? `${p.documentType}: ${p.documentNumber}` : (p.cpf || '-')}</td>
                  <td className="p-4">{p.dob ? new Date(p.dob+'T00:00:00').toLocaleDateString('pt-BR') : '-'}</td>
                  <td className="p-4 font-bold text-brand-red">{p.bloodType || '-'}</td>
                  <td className="p-4 font-display text-xl">{p.totalRaces}</td>
                  <td className="p-4 text-right">
                    <button onClick={() => setEditingPilot({ ...p })}
                      className="text-brand-text-muted hover:text-white p-1.5 rounded bg-brand-surface-high hover:bg-brand-red transition-colors" title="Editar">
                      <Edit className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {registeredPilots.length === 0 && (
                <tr><td colSpan={8} className="p-6 text-center text-brand-text-muted italic">Nenhum piloto cadastrado.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* BOOKINGS TAB */}
      {activeTab === 'bookings' && (
        <div className="bg-[#121214] border border-brand-border rounded-lg overflow-x-auto">
          <table className="w-full text-left font-sans text-sm border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-brand-surface border-b border-brand-border uppercase text-[10px] tracking-widest font-black text-brand-text-muted">
                <th className="p-4">Data / Hora</th><th className="p-4">Piloto</th><th className="p-4">Categoria</th>
                <th className="p-4">Karts</th><th className="p-4">Status</th><th className="p-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} className="border-b border-brand-border/40 hover:bg-brand-surface-high/30 transition-colors">
                  <td className="p-4 font-bold">{b.date} • {b.time}</td>
                  <td className="p-4"><div className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-brand-red"/>{b.pilotName}</div></td>
                  <td className="p-4">{b.category}</td>
                  <td className="p-4 font-bold">{b.karts}</td>
                  <td className="p-4"><span className="bg-emerald-950 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded text-[10px] tracking-widest font-bold uppercase">{b.status}</span></td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleDeleteBooking(b.id)} className="text-brand-red hover:text-white p-1.5 rounded bg-brand-surface-high hover:bg-brand-red transition-colors" title="Cancelar Reserva">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {bookings.length === 0 && (
                <tr><td colSpan={6} className="p-6 text-center text-brand-text-muted italic">Nenhuma reserva ativa.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* SLOTS TAB */}
      {activeTab === 'slots' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {slots.map((slot) => (
            <div key={slot.id} className="bg-[#121214] border border-brand-border p-6 rounded-lg flex flex-col justify-between shadow-[0_4px_15px_rgba(0,0,0,0.6)]">
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
                    <span className={`${slot.availableKarts === 0 ? 'text-brand-red' : 'text-white'} font-bold`}>{slot.availableKarts} / {slot.totalKarts} livres</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setEditingSlot({ ...slot })}
                className="mt-6 flex items-center justify-center gap-2 bg-brand-red/10 border border-brand-red/40 text-brand-red hover:bg-brand-red hover:text-white py-2.5 transition-colors rounded uppercase text-xs font-black tracking-widest font-sans cursor-pointer">
                <Edit className="w-3.5 h-3.5" /> Editar Sessão
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
