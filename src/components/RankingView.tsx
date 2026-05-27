import { useState } from 'react';
import { 
  Trophy, 
  Search, 
  TrendingUp, 
  Zap, 
  X
} from 'lucide-react';
import { RankingDriver } from '../types';
import { useApp } from '../context/AppContext';

export default function RankingView() {
  const { rankings, isLoggedIn, handleNavigate } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | '70kg' | '80kg' | '90kg' | 'heavy'>('all');
  const [selectedDriver, setSelectedDriver] = useState<RankingDriver | null>(null);

  const filteredRankings = rankings.filter(driver => {
    const matchesSearch = driver.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          driver.nickname.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedCategory === 'all') return matchesSearch;
    if (selectedCategory === '70kg') return matchesSearch && (driver.weightCategory === 'Até 70kg');
    if (selectedCategory === '80kg') return matchesSearch && (driver.weightCategory === '70kg-80kg');
    if (selectedCategory === '90kg') return matchesSearch && (driver.weightCategory === '80kg-90kg');
    return matchesSearch && (driver.weightCategory === 'Acima 90kg');
  });

  return (
    <div className="w-full">
      <section className="mb-8 mt-2">
        <h2 className="font-display text-4xl md:text-5xl uppercase italic text-white flex items-center gap-3">
          TABELA DE LÍDERES
          <span className="text-brand-red text-sm font-sans tracking-widest uppercase italic font-bold">Classificação Oficial</span>
        </h2>
        <p className="font-sans text-xs font-bold text-brand-text-muted tracking-widest uppercase">RESULTADOS DO CIRCUITO • PILOTOS DE ALTA TELEMETRIA</p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="carbon-texture border border-brand-red/60 p-6 rounded-lg relative overflow-hidden flex flex-col justify-between">
          <div className="absolute -right-4 -bottom-4 opacity-5 pointer-events-none"><Trophy className="w-24 h-24" /></div>
          <div>
            <span className="text-brand-red font-display text-sm tracking-widest uppercase flex items-center gap-1.5"><Zap className="w-4 h-4 animate-pulse" />RECORD DA SEMANA</span>
            <h3 className="text-4xl font-display italic text-white mt-2">42:194 SEG</h3>
            <p className="font-sans text-xs text-brand-text-muted mt-1 uppercase">Estabelecido por: <strong className="text-white">ALEX_APEX</strong></p>
          </div>
          <span className="font-sans text-[10px] text-brand-text-muted mt-4">Pista Seca • Sodi Sênior RXX</span>
        </div>

        <div className="bg-brand-surface border border-brand-border p-6 rounded-lg flex flex-col justify-between backdrop-blur-md">
          <div>
            <span className="text-brand-text-muted font-sans text-xs font-bold tracking-widest uppercase">PILOTOS CADASTRADOS GERAL</span>
            <h3 className="text-4xl font-display italic text-white mt-2">1,248 CORREDORES</h3>
            <p className="font-sans text-xs text-brand-text-muted mt-1">Top 2% avançam para a Pro Copa Seletiva</p>
          </div>
          <span className="font-sans text-[10px] text-brand-text-muted mt-4 flex items-center gap-1"><TrendingUp className="w-3.5 h-3.5 text-brand-red" />+45 novos tempos registrados hoje</span>
        </div>

        <div className="bg-brand-surface border border-brand-border p-6 rounded-lg flex flex-col justify-between backdrop-blur-md">
          <div>
            <span className="text-brand-text-muted font-sans text-xs font-bold tracking-widest uppercase">ESPECIFICAÇÕES DO CIRCUITO</span>
            <h3 className="text-4xl font-display italic text-white mt-2">1.1 KM (FIA SPEC)</h3>
            <p className="font-sans text-xs text-brand-text-muted mt-1">11 Curvas • Longa reta de 220m</p>
          </div>
          <span className="font-sans text-[10px] text-brand-text-muted mt-4">Velocidade Máx Registrada: 92km/h</span>
        </div>
      </div>

      <section className="mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto hide-scrollbar">
          {(['all', '70kg', '80kg', '90kg', 'heavy'] as const).map(cat => (
            <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-4 py-2 font-display text-sm uppercase italic skew-tag transition-all cursor-pointer whitespace-nowrap ${selectedCategory === cat ? 'bg-brand-red text-white' : 'bg-brand-surface border border-brand-border text-brand-text hover:bg-brand-surface-high'}`}>
              <span>
                {cat === 'all' ? 'TODOS' : 
                 cat === '70kg' ? 'ATÉ 70 KG' : 
                 cat === '80kg' ? '70 KG - 80 KG' : 
                 cat === '90kg' ? '80 KG - 90 KG' : 'ACIMA DE 90 KG'}
              </span>
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-80">
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Buscar apelido ou nome..." className="w-full bg-brand-surface-high text-brand-text p-2.5 pl-10 border border-brand-border focus:border-brand-red focus:outline-none rounded text-xs font-sans" />
          <Search className="w-4 h-4 text-brand-red absolute left-3 top-3.5" />
        </div>
      </section>

      <section className="bg-brand-surface border border-brand-border overflow-hidden rounded-lg backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-brand-border bg-black/40 text-brand-text-muted font-sans text-xs uppercase tracking-widest font-extrabold">
                <th className="py-4 px-6 text-center w-20">POSIÇÃO</th>
                <th className="py-4 px-6">PILOTO</th>
                <th className="py-4 px-6">CATEGORIA DE PESO</th>
                <th className="py-4 px-6 text-right">MELHOR VOLTA</th>
                <th className="py-4 px-6 text-right w-48">PERFORMANCE / GAP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#323235]/40">
              {filteredRankings.map((driver) => {
                const isTop3 = driver.rank <= 3;
                const baseLapSec = 42.194;
                const driverLapSec = parseFloat(driver.bestLap.replace(':', '.'));
                const diff = driverLapSec - baseLapSec;
                const percentage = Math.max(0, 100 - (diff * 20));

                return (
                  <tr key={driver.rank} onClick={() => setSelectedDriver(driver)} className="hover:bg-brand-surface-high/65 transition-colors cursor-pointer group">
                    <td className="py-5 px-6 text-center">
                      <div className={`inline-flex w-8 h-8 rounded-full items-center justify-center font-display text-lg italic ${driver.rank === 1 ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500 shadow-neon' : driver.rank === 2 ? 'bg-slate-400/20 text-slate-300 border border-slate-400' : driver.rank === 3 ? 'bg-amber-700/20 text-amber-600 border border-amber-700' : 'text-brand-text-muted'}`}>
                        {driver.rank === 1 ? '1st' : driver.rank === 2 ? '2nd' : driver.rank === 3 ? '3rd' : `#${driver.rank}`}
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <div className="flex items-center gap-3">
                        <img alt={driver.name} className="w-10 h-10 rounded-full border border-brand-border object-cover shrink-0" referrerPolicy="no-referrer" src={driver.avatar} />
                        <div>
                          <p className="font-display text-lg italic tracking-wide group-hover:text-brand-red transition-colors">{driver.nickname}</p>
                          <p className="font-sans text-[11px] text-brand-text-muted font-medium">{driver.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <span className="font-sans text-xs text-brand-text font-medium">{driver.weightCategory || 'N/A'}</span>
                    </td>
                    <td className="py-5 px-6 text-right">
                      <div className="flex flex-col items-end">
                        <span className="font-display text-xl text-white tracking-wider font-semibold">{driver.bestLap}</span>
                        {driver.recordBeaten && <span className="text-[9px] bg-brand-red text-white px-1.5 py-0.5 uppercase tracking-tighter font-extrabold skew-tag animate-pulse">BATIDO</span>}
                      </div>
                    </td>
                    <td className="py-5 px-6 text-right">
                      <div className="w-full flex items-center justify-end gap-3">
                        <div className="w-24 bg-black/40 h-2.5 rounded-full overflow-hidden border border-brand-border shrink-0">
                          <div style={{ width: `${percentage}%` }} className={`h-full ${isTop3 ? 'bg-brand-red' : 'bg-brand-text-muted'}`}></div>
                        </div>
                        <span className="font-mono text-[10px] text-brand-text-muted font-bold shrink-0">{diff === 0 ? 'RECORD' : `+${diff.toFixed(3)}s`}</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {selectedDriver && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0b0b0d] border border-brand-border w-full max-w-md p-6 rounded-lg relative overflow-hidden shadow-2xl">
            <button onClick={() => setSelectedDriver(null)} className="text-brand-text hover:text-brand-red p-1 rounded-full absolute top-4 right-4 cursor-pointer"><X className="w-6 h-6" /></button>
            <div className="flex flex-col items-center text-center mt-4">
              <img src={selectedDriver.avatar} alt={selectedDriver.nickname} referrerPolicy="no-referrer" className="w-24 h-24 rounded-full border border-brand-border shadow-lg object-cover mb-4" />
              <span className="bg-brand-red/20 border border-brand-red text-brand-red font-display text-sm px-4 py-1 skew-tag italic mb-2"><span>POSIÇÃO #{selectedDriver.rank} GLOBAL</span></span>
              <h3 className="font-display text-4xl italic text-white tracking-wide">{selectedDriver.nickname}</h3>
              <p className="font-sans text-xs text-brand-text-muted uppercase mt-0.5 tracking-wider">{selectedDriver.name}</p>
              <div className="my-6 w-full p-4 bg-black/40 border border-brand-border rounded-md text-left space-y-3">
                <span className="text-brand-red font-display text-xs tracking-widest uppercase block mb-1">TELEMETRIA INTEGRADA</span>
                <div className="flex justify-between items-center text-xs text-brand-text-muted"><span>Melhor Volta Geral</span><span className="font-display text-lg text-white tracking-widest">{selectedDriver.bestLap}</span></div>
                <div className="flex justify-between items-center text-xs text-brand-text-muted"><span>Velocidade Final</span><span className="font-mono text-white">88.4 km/h</span></div>
                <div className="flex justify-between items-center text-xs text-brand-text-muted"><span>Conselho</span><span className="text-xs text-brand-text font-medium italic block text-right">"{selectedDriver.tagline}"</span></div>
              </div>
              <button 
                onClick={() => { 
                  if (!isLoggedIn) {
                    alert('Você precisa estar logado para desafiar outros pilotos!');
                    handleNavigate('profile');
                    setSelectedDriver(null);
                    return;
                  }
                  alert(`Desafio enviado para ${selectedDriver.nickname}!`); 
                  setSelectedDriver(null); 
                }} 
                className="w-full bg-brand-red hover:bg-brand-red-hover text-white py-3 font-display text-xl uppercase italic rounded transition-all cursor-pointer"
              >
                DESAFIAR PILOTO
              </button>
            </div>
            <div className="absolute bottom-0 inset-x-0 h-1 carbon-texture bg-brand-red"></div>
          </div>
        </div>
      )}
    </div>
  );
}
