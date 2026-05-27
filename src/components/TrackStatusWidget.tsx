import React from 'react';
import { useApp } from '../context/AppContext';
import { Sun, Cloud, CloudRain, ShieldAlert } from 'lucide-react';
import { motion } from 'motion/react';

export default function TrackStatusWidget() {
  const { trackStatus } = useApp();

  const statuses = {
    dry: {
      label: 'PISTA SECA',
      icon: Sun,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/30',
      description: 'Condições ideais para recordes de pista.'
    },
    damp: {
      label: 'PISTA ÚMIDA',
      icon: Cloud,
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/30',
      description: 'Aderência reduzida. Cuidado nas curvas 2 e 5.'
    },
    wet: {
      label: 'PISTA MOLHADA',
      icon: CloudRain,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/30',
      description: 'Chuva na pista. Setup de chuva recomendado.'
    },
    closed: {
      label: 'PISTA FECHADA',
      icon: ShieldAlert,
      color: 'text-brand-red',
      bg: 'bg-brand-red/10',
      border: 'border-brand-red/30',
      description: 'Atividades suspensas temporariamente.'
    }
  };

  const current = statuses[trackStatus || 'dry'];
  const Icon = current.icon;

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`w-full border-b ${current.border} ${current.bg} py-2.5 px-6 md:px-10 overflow-hidden relative group`}
    >
      <div className="max-w-[1240px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-black/40 border border-white/5 animate-pulse">
            <Icon className={`w-4 h-4 ${current.color}`} />
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
            <span className={`font-display text-sm italic font-black uppercase tracking-widest ${current.color}`}>
              {current.label}
            </span>
            <span className="hidden sm:inline w-1 h-1 rounded-full bg-white/20" />
            <span className="font-sans text-[10px] text-white/60 font-bold uppercase tracking-wider">
              {current.description}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1 rounded-full border border-white/5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500">LIVE TELEMETRIA</span>
          </div>
        </div>
      </div>

      {/* Decorative scanning line */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-white/10" />
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-white/5" />
    </motion.div>
  );
}
