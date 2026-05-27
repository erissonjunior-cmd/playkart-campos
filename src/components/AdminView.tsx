import React, { useState, useEffect } from 'react';
import { Booking, TimeSlot, PilotProfile } from '../types';
import { 
  Users, 
  Timer, 
  Calendar, 
  X, 
  Edit, 
  Trash2, 
  Camera, 
  Save, 
  Upload, 
  Layout, 
  Map, 
  Info,
  ChevronRight,
  Plus,
  ArrowLeft,
  Clock,
  DollarSign,
  Gamepad2,
  Trash,
  MessageCircle,
  Sun,
  Cloud,
  CloudRain,
  ShieldAlert
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';

interface AdminViewProps {
  bookings: Booking[];
  slots: TimeSlot[];
  registeredPilots: PilotProfile[];
  onCancelBooking: (id: string) => void;
  onUpdateSlot: (slot: TimeSlot) => void;
}

interface CircuitData {
  circuitPath: string;
  blueprintImage?: string;
  description: string;
  suggestion: string;
}

export default function AdminView({ 
  bookings, 
  slots, 
  registeredPilots,
  onCancelBooking,
  onUpdateSlot
}: AdminViewProps) {
  const { trackStatus, handleUpdateTrackStatus } = useApp();
  const [activeTab, setActiveTab] = useState<'pilots' | 'bookings' | 'slots' | 'circuit'>('pilots');
  
  // Circuit State (Nano Banana)
  const [circuitData, setCircuitData] = useState<CircuitData>({
    circuitPath: '',
    blueprintImage: '',
    description: '',
    suggestion: ''
  });
  const [blueprintImage, setBlueprintImage] = useState<string | null>(null);
  
  // Slot Editing State
  const [editingSlot, setEditingSlot] = useState<TimeSlot | null>(null);
  const [editForm, setEditForm] = useState<TimeSlot | null>(null);

  // Pilot Details State
  const [selectedPilot, setSelectedPilot] = useState<PilotProfile | null>(null);

  useEffect(() => {
    const savedData = localStorage.getItem('kart_circuit_data');
    if (savedData) {
      const data = JSON.parse(savedData);
      setCircuitData(data);
      if (data.blueprintImage) setBlueprintImage(data.blueprintImage);
    }
  }, []);

  const handleDeleteBooking = (id: string) => {
    if (confirm('Tem certeza que deseja cancelar essa reserva?')) {
      onCancelBooking(id);
    }
  };

  const handleUpdateSlotClick = (slot: TimeSlot) => {
    setEditingSlot(slot);
    setEditForm({ ...slot });
  };

  const handleSaveSlot = () => {
    if (editForm) {
      onUpdateSlot(editForm);
      setEditingSlot(null);
      setEditForm(null);
    }
  };

  // Circuit Handlers
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBlueprintImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveBlueprint = () => {
    const updatedCircuit = {
      ...circuitData,
      blueprintImage: blueprintImage || '',
      circuitPath: ''
    };
    localStorage.setItem('kart_circuit_data', JSON.stringify(updatedCircuit));
    setCircuitData(updatedCircuit);
    alert('Planta do circuito salva com sucesso!');
  };

  return (
    <div className="w-full">
      <div className="mb-10">
        <h2 className="font-display text-4xl italic uppercase text-brand-red tracking-tight flex items-center gap-3">
          PAINEL DE ADMINISTRAÇÃO
        </h2>
        <p className="font-sans text-brand-text-muted mt-2 uppercase tracking-widest text-[10px] font-bold">
          Gestão de Pilotos, Reservas e Pista Técnica
        </p>
      </div>

      <div className="flex border-b border-brand-border mb-8 overflow-x-auto custom-scrollbar">
        <button
          onClick={() => setActiveTab('pilots')}
          className={`px-6 py-4 font-sans text-xs font-black tracking-widest uppercase flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'pilots' ? 'text-brand-red border-brand-red' : 'text-brand-text-muted border-transparent hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          Clientes
        </button>
        <button
          onClick={() => setActiveTab('bookings')}
          className={`px-6 py-4 font-sans text-xs font-black tracking-widest uppercase flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'bookings' ? 'text-brand-red border-brand-red' : 'text-brand-text-muted border-transparent hover:text-white'
          }`}
        >
          <Calendar className="w-4 h-4" />
          Reservas
        </button>
        <button
          onClick={() => setActiveTab('slots')}
          className={`px-6 py-4 font-sans text-xs font-black tracking-widest uppercase flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'slots' ? 'text-brand-red border-brand-red' : 'text-brand-text-muted border-transparent hover:text-white'
          }`}
        >
          <Timer className="w-4 h-4" />
          Baterias
        </button>
        <button
          onClick={() => setActiveTab('circuit')}
          className={`px-6 py-4 font-sans text-xs font-black tracking-widest uppercase flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'circuit' ? 'text-brand-red border-brand-red' : 'text-brand-text-muted border-transparent hover:text-white'
          }`}
        >
          <Map className="w-4 h-4" />
          Mapa  
        </button>
      </div>

      {activeTab === 'pilots' && (
        <div className="bg-[#121214] border border-brand-border rounded-lg overflow-x-auto shadow-2xl">
          <table className="w-full text-left font-sans text-sm border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-brand-surface border-b border-brand-border uppercase text-[10px] tracking-widest font-black text-brand-text-muted">
                <th className="p-4">Piloto</th>
                <th className="p-4">WhatsApp</th>
                <th className="p-4">Documento</th>
                <th className="p-4">Nascimento</th>
                <th className="p-4">Sangue</th>
                <th className="p-4">Corridas</th>
              </tr>
            </thead>
            <tbody>
              {registeredPilots?.map((p, i) => (
                <tr 
                  key={i} 
                  onClick={() => setSelectedPilot(p)}
                  className="border-b border-brand-border/40 hover:bg-brand-surface-high/30 transition-colors cursor-pointer group"
                >
                  <td className="p-4 text-white">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-red flex items-center justify-center text-white font-black text-xs group-hover:scale-110 transition-transform">
                        {p.name.charAt(0)}
                      </div>
                      <span className="font-bold">{p.name} <br/><span className="text-[10px] text-brand-text-muted uppercase tracking-wider">{p.nickname}</span></span>
                    </div>
                  </td>
                  <td className="p-4 text-emerald-500 font-mono italic">{p.whatsapp || p.phone || '-'}</td>
                  <td className="p-4">{p.cpf || p.documentNumber || '-'}</td>
                  <td className="p-4 font-mono">{p.dob ? new Date(p.dob+'T00:00:00').toLocaleDateString('pt-BR') : '-'}</td>
                  <td className="p-4 font-black">
                    <span className={p.bloodType ? "text-brand-red" : "text-gray-700"}>{p.bloodType || 'N/A'}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="font-display text-2xl text-white">{p.totalRaces}</span>
                      {bookings.some(b => b.pilotName === p.name) && (
                        <span className="w-2 h-2 rounded-full bg-brand-red animate-pulse" title="Vaga Reservada"></span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {(!registeredPilots || registeredPilots.length === 0) && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500 italic uppercase text-[10px] tracking-widest font-bold">Nenhum piloto registrado</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'bookings' && (
        <div className="bg-[#121214] border border-brand-border rounded-lg overflow-x-auto shadow-2xl">
          <table className="w-full text-left font-sans text-sm border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-brand-surface border-b border-brand-border uppercase text-[10px] tracking-widest font-black text-brand-text-muted">
                <th className="p-4">Data / Hora</th>
                <th className="p-4">Líder do Grupo</th>
                <th className="p-4">Categoria</th>
                <th className="p-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody>
              {bookings?.map((b) => (
                <tr key={b.id} className="border-b border-brand-border/40 hover:bg-brand-surface-high/30 transition-colors">
                  <td className="p-4 font-bold text-white">{b.date} • {b.time}</td>
                  <td className="p-4 inline-flex items-center gap-2"><Users className="w-3 h-3 text-brand-red"/>{b.pilotName}</td>
                  <td className="p-4 uppercase text-[10px] font-black tracking-widest">{b.category}</td>
                  <td className="p-4 text-right flex items-center justify-end gap-2">
                    <button 
                      onClick={() => {
                        const message = `Olá ${b.pilotName}! Sua bateria na Playkart Campos está confirmada para ${b.date} às ${b.time}. Categoria: ${b.category}. Nos vemos na pista! 🏎️💨`;
                        window.open(`https://wa.me/55${b.phone?.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`, '_blank');
                      }}
                      className="text-emerald-500 hover:bg-emerald-500 hover:text-white p-2 rounded transition-all"
                      title="Enviar Confirmação WhatsApp"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDeleteBooking(b.id)} className="text-brand-red hover:bg-brand-red hover:text-white p-2 rounded transition-all">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {(!bookings || bookings.length === 0) && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500 italic uppercase text-[10px] tracking-widest font-bold">Nenhum agendamento ativo</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'slots' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {slots?.map((slot) => (
            <div key={slot.id} className="bg-[#121214] border border-brand-border p-6 rounded-lg shadow-xl hover:border-brand-red/30 transition-all">
              <span className="text-[10px] font-black tracking-[0.2em] uppercase text-brand-red">{slot.type}</span>
              <h3 className="font-display text-4xl text-white italic mt-2">{slot.time}</h3>
              <div className="mt-6 flex justify-between items-center text-sm border-t border-white/5 pt-4">
                <span className="text-emerald-500 font-black tracking-widest">R$ {slot.price.toFixed(2)}</span>
                <span className="text-gray-500">{slot.availableKarts} / {slot.totalKarts} livres</span>
              </div>
              <button onClick={() => handleUpdateSlotClick(slot)} className="mt-6 w-full py-3 bg-white/5 border border-white/10 hover:bg-brand-red hover:border-brand-red transition-all rounded text-[10px] font-black uppercase tracking-widest">
                Editar Sessão
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'circuit' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#121214] border border-brand-border rounded-xl p-6 shadow-2xl mb-8">
              <h3 className="text-xl font-bold uppercase italic flex items-center gap-2 mb-6">
                <Sun className="w-5 h-5 text-yellow-500" />
                Status da Pista (Real-Time)
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { id: 'dry', label: 'Seca', icon: Sun, color: 'text-emerald-500', bg: 'bg-emerald-500' },
                  { id: 'damp', label: 'Úmida', icon: Cloud, color: 'text-yellow-500', bg: 'bg-yellow-500' },
                  { id: 'wet', label: 'Molhada', icon: CloudRain, color: 'text-blue-500', bg: 'bg-blue-500' },
                  { id: 'closed', label: 'Fechada', icon: ShieldAlert, color: 'text-brand-red', bg: 'bg-brand-red' }
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => handleUpdateTrackStatus(s.id as any)}
                    className={`flex flex-col items-center gap-3 p-4 rounded-lg border transition-all ${
                      trackStatus === s.id 
                        ? `border-${s.id === 'dry' ? 'emerald' : s.id === 'damp' ? 'yellow' : s.id === 'wet' ? 'blue' : 'brand-red'}-500 bg-${s.id === 'dry' ? 'emerald' : s.id === 'damp' ? 'yellow' : s.id === 'wet' ? 'blue' : 'brand-red'}-500/10` 
                        : 'border-white/5 hover:border-white/10 grayscale opacity-40'
                    }`}
                  >
                    <s.icon className={`w-8 h-8 ${trackStatus === s.id ? s.color : 'text-white'}`} />
                    <span className="text-[10px] font-black uppercase tracking-widest">{s.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-[#121214] border border-brand-border rounded-xl p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold uppercase italic flex items-center gap-2">
                  <Layout className="w-5 h-5 text-brand-red" />
                  Planta da Pista
                </h3>
                <button onClick={handleSaveBlueprint} className="px-4 py-2 bg-brand-red rounded text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <Save className="w-4 h-4" /> Salvar Planta
                </button>
              </div>
              
              <div className="relative aspect-video rounded-lg bg-black border-2 border-dashed border-white/10 overflow-hidden">
                {blueprintImage ? (
                  <div className="relative w-full h-full">
                    <div className="absolute inset-0 bg-[#f2e8cf]/90" />
                    <img src={blueprintImage} className="w-full h-full object-contain mix-blend-multiply opacity-90 p-4" />
                    <label className="absolute top-4 right-4 p-2 bg-black/60 rounded-full cursor-pointer hover:bg-brand-red transition-all">
                      <Plus className="w-4 h-4" />
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                    </label>
                  </div>
                ) : (
                  <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-white/5">
                    <Upload className="w-8 h-8 text-brand-red mb-3" />
                    <span className="font-black text-[10px] tracking-widest uppercase">Subir Planta Técnica</span>
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                  </label>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#121214] p-5 rounded-xl border border-white/5">
                <h4 className="text-[10px] font-black uppercase text-brand-red mb-3 tracking-widest">Análise do Arquiteto</h4>
                <textarea 
                  value={circuitData.description}
                  onChange={(e) => setCircuitData({...circuitData, description: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded p-3 text-sm text-gray-400 h-32 outline-none focus:border-brand-red transition-all"
                  placeholder="Ex: Pista técnica com zebras baixas..."
                />
              </div>
              <div className="bg-[#121214] p-5 rounded-xl border border-white/5">
                <h4 className="text-[10px] font-black uppercase text-emerald-500 mb-3 tracking-widest">Dica Pro</h4>
                <textarea 
                  value={circuitData.suggestion}
                  onChange={(e) => setCircuitData({...circuitData, suggestion: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded p-3 text-sm text-gray-400 h-32 outline-none focus:border-emerald-500 transition-all"
                  placeholder="Ex: Mantenha o traçado aberto na curva 4..."
                />
              </div>
            </div>
          </div>

          <div className="bg-brand-red/5 border border-brand-red/10 p-6 rounded-xl h-fit">
            <h3 className="font-black italic uppercase text-brand-red mb-4">Instruções</h3>
            <ul className="text-xs text-gray-500 space-y-4 font-sans leading-relaxed">
              <li>1. Gere a planta no <strong className="text-white">Gemini Web</strong> usando a foto aérea.</li>
              <li>2. Faça o upload da imagem limpa que o Gemini retornar.</li>
              <li>3. Salve para atualizar a Home do site instantaneamente.</li>
            </ul>
          </div>
        </div>
      )}

      {/* Modern Slot Edit Modal */}
      <AnimatePresence>
        {editingSlot && editForm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingSlot(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-[#121214] border border-brand-border rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="bg-brand-surface p-6 border-b border-brand-border flex justify-between items-center">
                <div>
                  <h3 className="font-display text-xl italic uppercase text-white flex items-center gap-2">
                    <Edit className="w-5 h-5 text-brand-red" />
                    Configurar Bateria
                  </h3>
                  <p className="text-[10px] text-brand-text-muted uppercase tracking-widest mt-1">ID da Sessão: {editingSlot.id}</p>
                </div>
                <button 
                  onClick={() => setEditingSlot(null)}
                  className="p-2 hover:bg-white/5 rounded-full transition-colors text-brand-text-muted hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-8 space-y-6">
                {/* Time & Category Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-brand-text-muted uppercase tracking-widest flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-brand-red" /> Horário
                    </label>
                    <input 
                      type="text" 
                      value={editForm.time}
                      onChange={(e) => setEditForm({...editForm, time: e.target.value})}
                      className="w-full bg-black border border-brand-border rounded-lg p-3 text-sm focus:outline-none focus:border-brand-red transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-brand-text-muted uppercase tracking-widest flex items-center gap-1.5">
                      <Gamepad2 className="w-3 h-3 text-brand-red" /> Categoria
                    </label>
                    <select
                      value={editForm.type || 'Standard'}
                      onChange={(e) => setEditForm({...editForm, type: e.target.value as any})}
                      className="w-full bg-black border border-brand-border rounded-lg p-3 text-sm focus:outline-none focus:border-brand-red transition-all appearance-none cursor-pointer"
                    >
                      <option value="Standard">Standard</option>
                      <option value="Fast Track">Fast Track</option>
                      <option value="Night Run">Night Run</option>
                      <option value="Pro Academy">Pro Academy</option>
                    </select>
                  </div>
                </div>

                {/* Price & Karts Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-brand-text-muted uppercase tracking-widest flex items-center gap-1.5">
                      <DollarSign className="w-3 h-3 text-emerald-500" /> Preço (R$)
                    </label>
                    <input 
                      type="number" 
                      value={editForm.price}
                      onChange={(e) => setEditForm({...editForm, price: parseFloat(e.target.value) || 0})}
                      className="w-full bg-black border border-brand-border rounded-lg p-3 text-sm font-mono focus:outline-none focus:border-emerald-500 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-brand-text-muted uppercase tracking-widest flex items-center gap-1.5">
                      <Plus className="w-3 h-3 text-brand-red" /> Total Karts
                    </label>
                    <input 
                      type="number" 
                      value={editForm.totalKarts}
                      onChange={(e) => {
                        const total = parseInt(e.target.value) || 0;
                        const diff = total - editForm.totalKarts;
                        setEditForm({
                          ...editForm, 
                          totalKarts: total,
                          availableKarts: Math.max(0, editForm.availableKarts + diff)
                        });
                      }}
                      className="w-full bg-black border border-brand-border rounded-lg p-3 text-sm focus:outline-none focus:border-brand-red transition-all"
                    />
                  </div>
                </div>

                <div className="bg-brand-red/5 border border-brand-red/10 p-4 rounded-xl">
                  <p className="text-[11px] text-brand-text-muted leading-relaxed">
                    <strong className="text-white uppercase">Status da Disponibilidade:</strong> Atualmente existem <span className="text-white font-bold">{editForm.availableKarts}</span> karts livres para reserva nesta sessão de {editForm.time}.
                  </p>
                </div>
              </div>

              <div className="p-6 bg-brand-surface border-t border-brand-border flex gap-3">
                <button 
                  onClick={() => setEditingSlot(null)}
                  className="flex-1 py-3 px-4 rounded-lg border border-brand-border hover:bg-white/5 transition-all text-xs font-black uppercase tracking-widest"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleSaveSlot}
                  className="flex-[2] py-3 px-4 rounded-lg bg-brand-red hover:bg-[#ff1e27] text-white transition-all text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" /> Atualizar Bateria
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Ultra-Professional Telemetry Pilot Modal */}
      <AnimatePresence>
        {selectedPilot && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPilot(null)}
              className="absolute inset-0 bg-black/95 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9, x: 20 }}
              className="relative w-full max-w-4xl bg-[#0a0a0c] border border-white/10 rounded-lg shadow-[0_0_50px_rgba(0,0,0,1)] overflow-hidden flex flex-col md:flex-row h-full max-h-[85vh]"
            >
              {/* Notched Corner Accents */}
              <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-brand-red opacity-40 pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-brand-red opacity-40 pointer-events-none" />
              
              {/* Sidebar: Pilot Photo & Quick Identity */}
              <div className="w-full md:w-72 bg-black border-r border-white/5 flex flex-col items-center p-8 relative overflow-hidden shrink-0">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-red to-transparent opacity-50" />
                
                <div className="relative group mb-6">
                  <div className="w-48 h-48 bg-[#121214] rounded-sm p-1 border border-white/10 relative z-10 overflow-hidden">
                    <div className="absolute inset-0 carbon-texture opacity-20" />
                    <img 
                      src={selectedPilot.avatar || "https://cdn-icons-png.flaticon.com/512/219/219983.png"} 
                      alt={selectedPilot.name}
                      className="w-full h-full object-cover relative z-10 grayscale hover:grayscale-0 transition-all duration-500"
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-brand-red text-white py-1 px-3 font-display italic text-lg z-20 skew-tag border border-white/20">
                    #{selectedPilot.rank || 'PRO'}
                  </div>
                </div>

                <div className="text-center space-y-2 relative z-10">
                  <span className="text-[10px] font-black text-brand-red tracking-[0.3em] uppercase block">PILOTO COMPETIÇÃO</span>
                  <h3 className="font-display text-2xl italic text-white leading-none uppercase">{selectedPilot.nickname}</h3>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{selectedPilot.experienceLevel}</p>
                </div>

                <div className="mt-auto pt-8 w-full">
                  <div className="p-4 bg-brand-red/5 border border-brand-red/20 rounded-sm text-center">
                    <span className="text-[9px] font-black text-brand-red uppercase tracking-widest block mb-1">LICENÇA PK_CAMPOS</span>
                    <span className="font-mono text-white text-xs font-bold">2026-#{Math.floor(Math.random() * 9000) + 1000}</span>
                  </div>
                </div>
              </div>

              {/* Main Content: Telemetry & Data Grid */}
              <div className="flex-grow p-8 overflow-y-auto custom-scrollbar bg-[#0d0d0f]">
                <div className="flex justify-between items-start mb-8 border-b border-white/5 pb-6">
                  <div>
                    <h2 className="font-display text-4xl italic text-white uppercase tracking-tighter leading-none">{selectedPilot.name}</h2>
                    <div className="flex items-center gap-4 mt-2">
                       <span className="flex items-center gap-1.5 text-emerald-500 font-mono text-[10px] font-bold uppercase"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />SISTEMA OPERACIONAL</span>
                       <span className="text-gray-600 text-[10px] font-black uppercase tracking-widest">• VERIFICADO</span>
                    </div>
                  </div>
                  <button onClick={() => setSelectedPilot(null)} className="p-2 bg-white/5 hover:bg-brand-red transition-all cursor-pointer rounded-full border border-white/10 group">
                    <X className="w-5 h-5 text-gray-400 group-hover:text-white" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Performance Data */}
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2"><Timer className="w-3.5 h-3.5 text-brand-red" /> TELEMETRIA DE PISTA</span>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-[#121214] p-4 border-l-2 border-brand-red">
                          <span className="text-[9px] text-gray-500 font-bold block mb-1 uppercase">Corridas Totais</span>
                          <span className="font-display text-3xl text-white italic">{selectedPilot.totalRaces}</span>
                        </div>
                        <div className="bg-[#121214] p-4 border-l-2 border-emerald-500">
                          <span className="text-[9px] text-gray-500 font-bold block mb-1 uppercase">Melhor Tempo</span>
                          <span className="font-mono text-xl text-emerald-500 font-black">{selectedPilot.bestLap || '--:---'}</span>
                        </div>
                        <div className="bg-[#121214] p-4 border-l-2 border-orange-500">
                          <span className="text-[9px] text-gray-500 font-bold block mb-1 uppercase">Active Streak</span>
                          <span className="font-display text-2xl text-white">{selectedPilot.activeStreak}🔥</span>
                        </div>
                        <div className="bg-[#121214] p-4 border-l-2 border-blue-500">
                          <span className="text-[9px] text-gray-500 font-bold block mb-1 uppercase">Classificação</span>
                          <span className="text-blue-500 font-black text-sm uppercase">{selectedPilot.category}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 bg-black border border-white/5 relative overflow-hidden group">
                      <div className="absolute inset-0 carbon-texture opacity-5 group-hover:opacity-10 transition-opacity" />
                      <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2 mb-4"><Info className="w-3.5 h-3.5 text-brand-red" /> FICHA CLÍNICA</span>
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-[#1a1a1c] border border-brand-red/30 flex flex-col items-center justify-center rounded-sm">
                          <span className="text-[8px] text-brand-red font-black leading-none">TIPO</span>
                          <span className="text-2xl text-white font-display italic">{selectedPilot.bloodType || '??'}</span>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] text-gray-400 font-bold uppercase leading-none">Peso Técnico</p>
                          <p className="text-xl text-white font-mono font-black">{selectedPilot.weight ? `${selectedPilot.weight} KG` : 'N/A'}</p>
                          <p className="text-[8px] text-brand-text-muted italic uppercase">EQUIPAMENTO NÃO INC.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Operational Data */}
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2"><Users className="w-3.5 h-3.5 text-brand-red" /> PROTOCOLO DE CONTATO</span>
                      <div className="bg-[#121214] p-5 space-y-4 border border-white/5">
                        <div className="flex justify-between items-center border-b border-white/5 pb-2">
                          <span className="text-[9px] text-gray-500 font-bold uppercase">WhatsApp</span>
                          <span className="text-xs text-emerald-500 font-mono font-bold tracking-tight">{selectedPilot.whatsapp || selectedPilot.phone || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-white/5 pb-2">
                          <span className="text-[9px] text-gray-500 font-bold uppercase">Canal Email</span>
                          <span className="text-xs text-white font-medium truncate ml-4 hover:text-brand-red transition-colors">{selectedPilot.email}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-white/5 pb-2">
                          <span className="text-[9px] text-gray-500 font-bold uppercase">Documentação</span>
                          <span className="text-xs text-white font-mono">{selectedPilot.cpf || selectedPilot.documentNumber || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] text-gray-500 font-bold uppercase">Data Nasc.</span>
                          <span className="text-xs text-white font-bold">{selectedPilot.dob ? new Date(selectedPilot.dob+'T00:00:00').toLocaleDateString('pt-BR') : 'N/A'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2"><Calendar className="w-3.5 h-3.5 text-brand-red" /> GRID DE RESERVAS</span>
                        <div className={`px-2 py-0.5 rounded text-[8px] font-black italic tracking-tighter ${bookings.some(b => b.pilotName === selectedPilot.name) ? 'bg-brand-red text-white' : 'bg-white/5 text-gray-500'}`}>
                          {bookings.some(b => b.pilotName === selectedPilot.name) ? 'SINAL ATIVO' : 'STANDBY'}
                        </div>
                      </div>
                      
                      <div className="space-y-2 max-h-32 overflow-y-auto custom-scrollbar pr-2">
                        {bookings
                          .filter(b => b.pilotName === selectedPilot.name)
                          .map((b, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-black border-l-2 border-brand-red hover:bg-[#1a1a1c] transition-colors">
                              <div>
                                <p className="text-white font-bold text-[11px] leading-tight">{b.date} @ {b.time}</p>
                                <p className="text-[8px] text-gray-500 uppercase font-black">{b.karts} KARTS • {b.category}</p>
                              </div>
                              <span className="text-[10px] text-brand-red font-display italic">GRID_{idx+1}</span>
                            </div>
                          ))}
                        {!bookings.some(b => b.pilotName === selectedPilot.name) && (
                          <div className="text-center py-6 border border-dashed border-white/10 rounded">
                            <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">Nenhuma corrida pendente</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-10 flex gap-4">
                  <button onClick={() => setSelectedPilot(null)} className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-sm text-[10px] font-black uppercase tracking-[0.2em] transition-all">
                    ENCERRAR MONITORAMENTO
                  </button>
                  <button className="flex-1 py-4 bg-brand-red/10 hover:bg-brand-red/20 text-brand-red border border-brand-red/30 rounded-sm text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2">
                    <Edit className="w-3 h-3" /> ATUALIZAR STATUS
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
