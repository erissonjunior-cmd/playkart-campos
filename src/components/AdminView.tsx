import React, { useState } from 'react';
import { Users, Timer, Calendar, X, Save, Zap, ImageIcon, Loader2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { generateTrackBlueprint } from '../utils/gemini';
import { PilotProfile, TimeSlot } from '../types';

export default function AdminView() {
  const { 
    bookings, slots, registeredPilots, handleCancelBooking, handleUpdateSlot, handleUpdateProfile,
    circuitMapImage, setCircuitMapImage, circuitPath, setCircuitPath
  } = useApp();

  const [activeTab, setActiveTab] = useState<'pilots' | 'bookings' | 'slots' | 'circuit'>('pilots');
  const [editingPilot, setEditingPilot] = useState<PilotProfile | null>(null);
  const [editingSlot, setEditingSlot] = useState<TimeSlot | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [genStatus, setGenStatus] = useState('');

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

  const handleProcessBlueprint = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsGenerating(true);
    setGenStatus('Analisando via Nano Banana...');

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      try {
        const result = await generateTrackBlueprint(base64);
        if (result.svgPath) {
          setCircuitPath(result.svgPath);
          setCircuitMapImage(base64);
          alert('Planta baixa gerada com sucesso!');
        }
      } catch (err: any) {
        alert('Erro na análise IA: ' + err.message);
      } finally {
        setIsGenerating(false);
        setGenStatus('');
      }
    };
    reader.readAsDataURL(file);
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
        <h2 className="font-display text-4xl italic uppercase text-brand-red">ADMINISTRAÇÃO</h2>
      </div>

      <div className="flex border-b border-brand-border mb-8 overflow-x-auto">
        {[
          { tab: 'pilots', label: 'Clientes' },
          { tab: 'bookings', label: 'Reservas' },
          { tab: 'slots', label: 'Sessões' },
          { tab: 'circuit', label: 'Nano Banana IA' }
        ].map(({ tab, label }) => (
          <button key={tab} onClick={() => setActiveTab(tab as any)} className={`px-6 py-4 font-sans text-sm font-bold uppercase border-b-2 transition-colors whitespace-nowrap ${activeTab === tab ? 'text-brand-red border-brand-red' : 'text-brand-text-muted border-transparent hover:text-white'}`}>
            {label}
          </button>
        ))}
      </div>

      {activeTab === 'pilots' && (
        <div className="bg-[#121214] border border-brand-border rounded-lg overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-brand-surface uppercase text-[10px] tracking-widest font-black text-brand-text-muted border-b border-brand-border">
              <tr><th className="p-4">Piloto</th><th className="p-4">WhatsApp</th></tr>
            </thead>
            <tbody>
              {registeredPilots.map((p, i) => (
                <tr key={i} className="border-b border-brand-border/40 hover:bg-brand-surface-high/30">
                  <td className="p-4 flex items-center gap-3">
                    <img src={p.avatar} className="w-8 h-8 rounded-full border border-brand-border object-cover" />
                    <span>{p.name} <span className="text-xs text-brand-text-muted italic">({p.nickname})</span></span>
                  </td>
                  <td className="p-4">{p.whatsapp || p.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'bookings' && (
        <div className="bg-[#121214] border border-brand-border rounded-lg overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-brand-surface uppercase text-[10px] tracking-widest font-black text-brand-text-muted border-b border-brand-border">
              <tr><th className="p-4">Data/Hora</th><th className="p-4">Piloto</th><th className="p-4">Ação</th></tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} className="border-b border-brand-border/40 hover:bg-brand-surface-high/30">
                  <td className="p-4 font-bold">{b.date} • {b.time}</td>
                  <td className="p-4">{b.pilotName}</td>
                  <td className="p-4"><button onClick={() => handleDeleteBooking(b.id)} className="text-brand-red font-bold text-[10px] uppercase">Cancelar</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'slots' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {slots.map((slot) => (
            <div key={slot.id} className="bg-[#121214] border border-brand-border p-6 rounded-lg">
              <span className="text-[10px] font-black uppercase text-brand-text-muted">{slot.type}</span>
              <h3 className="font-display text-4xl text-white italic mt-3">{slot.time}</h3>
              <button onClick={() => setEditingSlot({...slot})} className="mt-6 w-full border border-brand-red text-brand-red py-2.5 uppercase text-xs font-black rounded hover:bg-brand-red hover:text-white transition-all">EDITAR</button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'circuit' && (
        <div className="bg-brand-surface border border-brand-border rounded-xl p-8">
          <div className="flex flex-col md:flex-row gap-10">
            <div className="w-full md:w-80 space-y-6">
              <h3 className="font-display text-2xl italic text-white uppercase flex items-center gap-2">
                <Zap className="w-6 h-6 text-brand-red" /> NANO BANANA IA
              </h3>
              <p className="text-brand-text-muted text-sm leading-relaxed">
                Envie a foto da pista e a IA gerará o traçado técnico automaticamente.
              </p>
              
              <label className="block w-full cursor-pointer relative group">
                <input type="file" className="hidden" accept="image/*" onChange={handleProcessBlueprint} disabled={isGenerating} />
                <div className={`w-full py-12 border-2 border-dashed rounded-xl transition-all flex flex-col items-center justify-center gap-4 ${isGenerating ? 'border-brand-red/50 bg-brand-red/5' : 'border-brand-border group-hover:border-brand-red/50 group-hover:bg-brand-red/5'}`}>
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-10 h-10 text-brand-red animate-spin" />
                      <span className="text-[10px] font-black text-brand-red uppercase animate-pulse">{genStatus}</span>
                    </>
                  ) : (
                    <>
                      <ImageIcon className="w-10 h-10 text-brand-text-muted group-hover:text-brand-red" />
                      <span className="text-[10px] font-black text-brand-text-muted group-hover:text-brand-red uppercase">Upload da Foto</span>
                    </>
                  )}
                </div>
              </label>

              {circuitPath && (
                <button onClick={() => { setCircuitPath(''); setCircuitMapImage('https://files.catbox.moe/rbtosq.png'); }} className="w-full text-center text-brand-text-muted text-[10px] font-black uppercase hover:text-white transition-colors">
                  Resetar Planta Baixa
                </button>
              )}
            </div>

            <div className="flex-1 relative aspect-video bg-black/40 rounded-xl border border-brand-border overflow-hidden">
              {circuitPath && (
                <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full p-[10%] drop-shadow-[0_0_20px_rgba(239,68,68,0.5)] z-10 pointer-events-none">
                  <path d={circuitPath} fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-pulse" />
                </svg>
              )}
              <img src={circuitMapImage} className={`w-full h-full object-contain ${circuitPath ? 'opacity-30 blur-[2px]' : 'opacity-60'}`} alt="Circuit Map" />
              <div className="absolute top-4 right-4 text-[8px] font-mono text-white/20 uppercase tracking-widest">Nano_Banana_Link_Active</div>
            </div>
          </div>
        </div>
      )}

      {editingSlot && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#121214] border border-brand-border rounded-xl w-full max-w-md p-6">
            <h3 className="font-display text-xl italic text-brand-red mb-6">EDITAR SESSÃO - {editingSlot.time}</h3>
            <form onSubmit={handleSaveSlot} className="flex flex-col gap-4">
              <input type="text" value={editingSlot.time} onChange={e => setEditingSlot({...editingSlot, time: e.target.value})} className="bg-brand-surface text-brand-text p-3 border border-brand-border rounded text-xs" />
              <button type="submit" className="bg-brand-red text-white py-3 rounded font-black tracking-widest transition-all hover:bg-brand-red-hover">SALVAR</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
