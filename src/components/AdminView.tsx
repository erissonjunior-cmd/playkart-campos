import React, { useState } from 'react';
import { Users, Timer, Calendar, Edit, Trash2, X, Save, MapPin as MapIcon, Plus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PilotProfile, TimeSlot } from '../types';

export default function AdminView() {
  const { 
    bookings, slots, registeredPilots, handleCancelBooking, handleUpdateSlot, handleUpdateProfile,
    circuitCurves, setCircuitCurves
  } = useApp();

  const [activeTab, setActiveTab] = useState<'pilots' | 'bookings' | 'slots' | 'circuit'>('pilots');
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
          { tab: 'slots', icon: <Timer className="w-4 h-4"/>, label: 'Sessões' },
          { tab: 'circuit', icon: <MapIcon className="w-4 h-4"/>, label: 'Mapa do Circuito' }
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

      {activeTab === 'circuit' && (
        <div className="flex flex-col lg:flex-row gap-6 h-auto lg:h-[750px] animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* LEFT: Game-style Toolbar */}
          <div className="w-full lg:w-72 bg-[#0b0e14] border border-brand-border rounded-xl p-5 flex flex-col gap-6 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-brand-red opacity-50"></div>
            
            <div className="space-y-1">
              <h4 className="font-display text-xs text-brand-red tracking-[0.2em] font-black uppercase italic italic-no">Sequência Técnica</h4>
              <div className="grid grid-cols-5 gap-1.5 mt-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                  <div key={n} className={`aspect-square flex items-center justify-center border text-[10px] font-black rounded-sm cursor-help transition-all ${circuitCurves.length >= n ? 'bg-brand-red border-brand-red text-white' : 'border-zinc-800 text-zinc-600'}`}>{n}</div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-display text-xs text-brand-red tracking-[0.2em] font-black uppercase italic italic-no">Ações Globais</h4>
              <button 
                onClick={() => { if(confirm('Resetar todo o traçado?')) setCircuitCurves([]); }}
                className="w-full bg-[#1a1a1f] hover:bg-brand-red/20 border border-brand-border hover:border-brand-red text-white py-3 rounded text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
              >
                <Trash2 className="w-3.5 h-3.5" /> LIMPAR TUDO
              </button>
            </div>

            <div className="space-y-3 flex-grow">
              <h4 className="font-display text-xs text-brand-red tracking-[0.2em] font-black uppercase italic italic-no">Ferramentas</h4>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { icon: <Edit className="w-4 h-4"/>, label: 'Lápis' },
                  { icon: <Trash2 className="w-4 h-4"/>, label: 'Borracha' },
                  { icon: <Plus className="w-4 h-4"/>, label: 'Adicionar' },
                  { icon: <MapIcon className="w-4 h-4"/>, label: 'Ponto' },
                  { icon: <Users className="w-4 h-4"/>, label: 'Agente' },
                  { icon: <Timer className="w-4 h-4"/>, label: 'Time' },
                  { icon: <Calendar className="w-4 h-4"/>, label: 'Data' },
                  { icon: <Save className="w-4 h-4"/>, label: 'Salvar' }
                ].map((tool, idx) => (
                  <button key={idx} className="aspect-square bg-[#161b22] border border-brand-border hover:border-brand-red text-brand-text-muted hover:text-brand-red rounded flex items-center justify-center transition-all">
                    {tool.icon}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 bg-brand-red/5 border border-brand-red/20 rounded-lg">
              <p className="text-[9px] text-brand-red font-black uppercase tracking-tighter leading-tight italic">
                * MODO ESTRATÉGIA ATIVO: Selecione os setores de frenagem e aceleração ideal.
              </p>
            </div>
          </div>

          {/* CENTER: Main Interactive Map */}
          <div className="flex-1 bg-[#0b0e14] border border-brand-border rounded-xl relative overflow-hidden shadow-2xl flex items-center justify-center group/map">
             {/* Map Grid Background */}
             <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:25px_25px]"></div>
             
             <div 
                className="relative w-full h-full max-w-[650px] max-h-[650px] aspect-square flex items-center justify-center cursor-crosshair"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = ((e.clientX - rect.left) / rect.width) * 100;
                  const y = ((e.clientY - rect.top) / rect.height) * 100;
                  const id = `curve-${Date.now()}`;
                  setCircuitCurves([...circuitCurves, { id, name: `Setor ${circuitCurves.length + 1}`, type: 'Média', x, y }]);
                }}
             >
                <img 
                   src="https://files.catbox.moe/rbtosq.png" 
                   className="w-[90%] h-[90%] object-contain opacity-60 brightness-150 contrast-125 transition-all duration-700 group-hover/map:scale-105"
                   alt="Circuit layout"
                />

                {/* Scanning HUD Elements */}
                <div className="absolute inset-0 border-[20px] border-transparent border-t-white/5 border-l-white/5 pointer-events-none"></div>
                <div className="absolute top-8 left-8 flex flex-col gap-1 pointer-events-none">
                   <span className="text-[10px] font-black text-brand-red uppercase tracking-[0.3em] font-sans">Circuit_Analysis.sys</span>
                   <span className="text-[8px] font-bold text-white/40 uppercase">Sectors_Loaded: {circuitCurves.length}</span>
                </div>

                {circuitCurves.map((curve) => (
                  <div 
                    key={curve.id}
                    className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center p-3 z-10 group/point cursor-pointer"
                    style={{ left: `${curve.x}%`, top: `${curve.y}%` }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Stylized Tyre Marker */}
                    <div className="relative w-8 h-8 flex items-center justify-center transition-all group-hover/point:scale-125 group-active/point:scale-95">
                      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_15px_rgba(0,0,0,0.8)]">
                        {/* Tyre Body */}
                        <circle cx="50" cy="50" r="45" fill="#141416" stroke="#2a2a2e" strokeWidth="8" />
                        {/* Tread details */}
                        <circle cx="50" cy="50" r="38" fill="none" stroke="#222" strokeWidth="2" strokeDasharray="6 4" />
                        {/* Colored Compound Ring */}
                        <circle cx="50" cy="50" r="30" fill="none" 
                          stroke={
                            curve.type === 'Alta' ? '#ef4444' : 
                            curve.type === 'Média' ? '#f97316' : 
                            '#06b6d4'
                          } 
                          strokeWidth="6" 
                          className="opacity-80"
                        />
                        {/* Hub/Hole */}
                        <circle cx="50" cy="50" r="18" fill="#080808" />
                        {/* Inner rim detail */}
                        <circle cx="50" cy="50" r="12" fill="none" stroke="#333" strokeWidth="1" />
                      </svg>
                      
                      {/* Glow effect based on compound */}
                      <div className={`absolute inset-0 rounded-full blur-md opacity-20 group-hover:opacity-40 transition-opacity ${
                        curve.type === 'Alta' ? 'bg-red-500' : 
                        curve.type === 'Média' ? 'bg-orange-500' : 
                        'bg-cyan-500'
                      }`}></div>
                    </div>
                    
                    <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-black/90 backdrop-blur-md px-2 py-1 rounded border border-white/20 whitespace-nowrap opacity-0 group-hover/point:opacity-100 transition-all pointer-events-none scale-90 group-hover/point:scale-100 z-50">
                       <span className="text-[9px] font-black text-white uppercase tracking-wider">{curve.name}</span>
                    </div>

                    <button 
                      onClick={() => setCircuitCurves(circuitCurves.filter(c => c.id !== curve.id))}
                      className="absolute -top-1 -right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover/point:opacity-100 hover:bg-white hover:text-red-600 transition-all shadow-xl z-50"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
             </div>

             {/* Bottom Tooltip */}
             <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-cyan-600/90 backdrop-blur-md px-6 py-2.5 rounded-sm border-l-4 border-white shadow-xl">
                <p className="text-[10px] font-black text-white uppercase tracking-[0.15em] flex items-center gap-3">
                   <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></span>
                   Clique no traçado para marcar novos setores de ultrapassagem
                </p>
             </div>
          </div>

          {/* RIGHT: List & Properties */}
          <div className="w-full lg:w-80 bg-[#0b0e14] border border-brand-border rounded-xl p-5 flex flex-col shadow-2xl">
             <div className="flex justify-between items-center mb-6">
                <h4 className="font-display text-lg text-white italic font-black uppercase tracking-tight">Setores</h4>
                <div className="bg-brand-red text-white text-[9px] font-black px-2 py-0.5 rounded uppercase">Ativos</div>
             </div>

             <div className="space-y-4 flex-grow overflow-y-auto pr-2 custom-scrollbar">
                {circuitCurves.map((curve, idx) => (
                  <div key={curve.id} className="bg-[#161b22] border border-brand-border p-4 rounded-lg space-y-3 group hover:border-brand-red transition-all">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-black text-brand-red uppercase tracking-widest">ID #{idx + 1}</span>
                      <Edit className="w-3.5 h-3.5 text-brand-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    
                    <input 
                      type="text" 
                      value={curve.name} 
                      onChange={(e) => {
                        const newCurves = [...circuitCurves];
                        newCurves[idx].name = e.target.value;
                        setCircuitCurves(newCurves);
                      }}
                      className="w-full bg-[#0b0e14] border border-brand-border p-2.5 rounded text-[11px] font-bold text-white focus:border-brand-red outline-none"
                      placeholder="Nome do Setor"
                    />

                    <select 
                      value={curve.type} 
                      onChange={(e) => {
                        const newCurves = [...circuitCurves];
                        newCurves[idx].type = e.target.value as any;
                        setCircuitCurves(newCurves);
                      }}
                      className="w-full bg-[#0b0e14] border border-brand-border p-2.5 rounded text-[9px] font-black uppercase text-brand-text-muted focus:text-white"
                    >
                      <option value="Baixa">BAIXA VELOCIDADE</option>
                      <option value="Média">MÉDIA VELOCIDADE</option>
                      <option value="Alta">ALTA VELOCIDADE</option>
                    </select>
                  </div>
                ))}

                {circuitCurves.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
                     <MapIcon className="w-12 h-12 mb-4" />
                     <p className="text-[10px] font-black uppercase tracking-widest leading-loose">Aguardando dados de telemetria...<br/>Marque um ponto no traçado.</p>
                  </div>
                )}
             </div>

             <button className="mt-6 w-full bg-brand-red hover:bg-brand-red-hover text-white py-4 rounded font-display italic font-black uppercase tracking-widest transition-all shadow-xl">
               ADICIONAR ESTRATÉGIA
             </button>
          </div>
        </div>
      )}
    </div>
  );
}
