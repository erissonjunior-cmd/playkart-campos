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
  Plus
} from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState<'pilots' | 'bookings' | 'slots' | 'circuit'>('pilots');
  
  // Circuit State (Nano Banana)
  const [circuitData, setCircuitData] = useState<CircuitData>({
    circuitPath: '',
    blueprintImage: '',
    description: '',
    suggestion: ''
  });
  const [blueprintImage, setBlueprintImage] = useState<string | null>(null);

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
    const newPrice = prompt('Novo preço da sessão:', slot.price.toString());
    const newTotal = prompt('Novo número total de karts:', slot.totalKarts.toString());
    
    if (newPrice && newTotal) {
      onUpdateSlot({
        ...slot,
        price: parseFloat(newPrice),
        totalKarts: parseInt(newTotal, 10),
        availableKarts: parseInt(newTotal, 10) - (slot.totalKarts - slot.availableKarts)
      });
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
          Nano Banana IA
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
              {registeredPilots.map((p, i) => (
                <tr key={i} className="border-b border-brand-border/40 hover:bg-brand-surface-high/30 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-red flex items-center justify-center text-white font-black text-xs">
                        {p.name.charAt(0)}
                      </div>
                      <span className="font-bold text-white">{p.name} <br/><span className="text-[10px] text-brand-text-muted uppercase tracking-wider">{p.nickname}</span></span>
                    </div>
                  </td>
                  <td className="p-4 text-emerald-500 font-mono">{p.whatsapp || p.phone || '-'}</td>
                  <td className="p-4">{p.cpf || p.documentNumber || '-'}</td>
                  <td className="p-4 font-mono">{p.dob ? new Date(p.dob+'T00:00:00').toLocaleDateString('pt-BR') : '-'}</td>
                  <td className="p-4 font-black text-brand-red">{p.bloodType || '-'}</td>
                  <td className="p-4 font-display text-2xl text-white">{p.totalRaces}</td>
                </tr>
              ))}
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
              {bookings.map((b) => (
                <tr key={b.id} className="border-b border-brand-border/40 hover:bg-brand-surface-high/30 transition-colors">
                  <td className="p-4 font-bold text-white">{b.date} • {b.time}</td>
                  <td className="p-4 inline-flex items-center gap-2"><Users className="w-3 h-3 text-brand-red"/>{b.pilotName}</td>
                  <td className="p-4 uppercase text-[10px] font-black tracking-widest">{b.category}</td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleDeleteBooking(b.id)} className="text-brand-red hover:bg-brand-red hover:text-white p-2 rounded transition-all">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'slots' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {slots.map((slot) => (
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
    </div>
  );
}
