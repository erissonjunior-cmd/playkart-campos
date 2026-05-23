import { useState } from 'react';
import { 
  Trophy, 
  Search, 
  SearchCode, 
  Award, 
  TrendingUp, 
  Gauge, 
  Zap, 
  HelpCircle,
  Clock,
  X
} from 'lucide-react';
import { RankingDriver } from '../types';

interface DrawingStatsModal {
  driver: RankingDriver;
}

interface RankingViewProps {
  rankings: RankingDriver[];
}

export default function RankingView({ rankings }: RankingViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | '125cc' | '60cc' | 'f4'>('all');
  const [selectedDriver, setSelectedDriver] = useState<RankingDriver | null>(null);

  // Filters rankings
  const filteredRankings = rankings.filter(driver => {
    const matchesSearch = driver.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          driver.nickname.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedCategory === 'all') return matchesSearch;
    if (selectedCategory === '125cc') {
      // simulate category matches for mock
      return matchesSearch && (driver.rank === 1 || driver.rank === 2 || driver.rank === 4);
    }
    if (selectedCategory === '60cc') {
      return matchesSearch && (driver.rank === 3 || driver.rank === 5);
    }
    return matchesSearch && (driver.rank === 6 || driver.rank === 7);
  });

  return (
    <div className="w-full">
      {/* Header */}
      <section className="mb-8 mt-2">
        <h2 className="font-display text-4xl md:text-5xl uppercase italic text-white flex items-center gap-3">
          TABELA DE LÍDERES
          <span className="text-brand-red text-sm font-sans tracking-widest uppercase italic font-bold">Classificação Oficial</span>
        </h2>
        <p className="font-sans text-xs font-bold text-brand-text-muted tracking-widest uppercase">
          RESULTADOS DO CIRCUITO • PILOTOS DE ALTA TELEMETRIA
        </p>
      </section>

      {/* Grid of Highlight Board / Hero Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        
        {/* Record Board */}
        <div className="carbon-texture border border-brand-red/60 p-6 rounded-lg relative overflow-hidden flex flex-col justify-between">
          <div className="absolute -right-4 -bottom-4 opacity-5 pointer-events-none">
            <Trophy className="w-24 h-24" />
          </div>
          <div>
            <span className="text-brand-red font-display text-sm tracking-widest uppercase flex items-center gap-1.5 ">
              <Zap className="w-4 h-4 text-brand-red animate-pulse" />
              RECORD DA SEMANA
            </span>
            <h3 className="text-4xl font-display italic text-white mt-2">42:194 SEG</h3>
            <p className="font-sans text-xs text-brand-text-muted mt-1 uppercase">
              Estabelecido por: <strong className="text-white">ALEX_APEX</strong>
            </p>
          </div>
          <span className="font-sans text-[10px] text-brand-text-muted mt-4">Pista Seca • Sodi Sênior RXX</span>
        </div>

        {/* Total Registered Pilots */}
        <div className="bg-brand-surface border border-brand-border p-6 rounded-lg flex flex-col justify-between backdrop-blur-md">
          <div>
            <span className="text-brand-text-muted font-sans text-xs font-bold tracking-widest uppercase">
              PILOTOS CADASTRADOS GERAL
            </span>
            <h3 className="text-4xl font-display italic text-white mt-2">1,248 CORREDORES</h3>
            <p className="font-sans text-xs text-brand-text-muted mt-1">
              Top 2% avançam para a Pro Copa Seletiva
            </p>
          </div>
          <span className="font-sans text-[10px] text-brand-text-muted mt-4 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-brand-red" />
            +45 novos tempos registrados hoje
          </span>
        </div>

        {/* Track Specs */}
        <div className="bg-brand-surface border border-brand-border p-6 rounded-lg flex flex-col justify-between backdrop-blur-md">
          <div>
            <span className="text-brand-text-muted font-sans text-xs font-bold tracking-widest uppercase">
              ESPECIFICAÇÕES DO CIRCUITO
            </span>
            <h3 className="text-4xl font-display italic text-white mt-2">1.1 KM (FIA SPEC)</h3>
            <p className="font-sans text-xs text-brand-text-muted mt-1">
              11 Curvas • Longa reta de 220m para ultrapassagens
            </p>
          </div>
          <span className="font-sans text-[10px] text-brand-text-muted mt-4">Velocidade Máx Registrada: 92km/h</span>
        </div>

      </div>

      {/* Filters & Search section */}
      <section className="mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
        
        {/* Category triggers */}
        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto hide-scrollbar">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 font-display text-sm uppercase italic skew-tag transition-all cursor-pointer ${
              selectedCategory === 'all' 
                ? 'bg-brand-red text-white' 
                : 'bg-brand-surface border border-brand-border text-brand-text hover:bg-brand-surface-high'
            }`}
          >
            <span>TODOS</span>
          </button>
          
          <button
            onClick={() => setSelectedCategory('125cc')}
            className={`px-4 py-2 font-display text-sm uppercase italic skew-tag transition-all cursor-pointer ${
              selectedCategory === '125cc' 
                ? 'bg-brand-red text-white' 
                : 'bg-brand-surface border border-brand-border text-brand-text hover:bg-brand-surface-high'
            }`}
          >
            <span>SÊNIOR (125cc)</span>
          </button>

          <button
            onClick={() => setSelectedCategory('60cc')}
            className={`px-4 py-2 font-display text-sm uppercase italic skew-tag transition-all cursor-pointer ${
              selectedCategory === '60cc' 
                ? 'bg-brand-red text-white' 
                : 'bg-brand-surface border border-brand-border text-brand-text hover:bg-brand-surface-high'
            }`}
          >
            <span>CADETE (60cc)</span>
          </button>

          <button
            onClick={() => setSelectedCategory('f4')}
            className={`px-4 py-2 font-display text-sm uppercase italic skew-tag transition-all cursor-pointer ${
              selectedCategory === 'f4' 
                ? 'bg-brand-red text-white' 
                : 'bg-brand-surface border border-brand-border text-brand-text hover:bg-brand-surface-high'
            }`}
          >
            <span>SUPER F4 (21hp)</span>
          </button>
        </div>

        {/* Search Input bar */}
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar apelido ou nome..."
            className="w-full bg-brand-surface-high text-brand-text p-2.5 pl-10 border border-brand-border focus:border-brand-red focus:outline-none rounded text-xs font-sans placeholder-white/30 backdrop-blur-sm"
          />
          <Search className="w-4 h-4 text-brand-red absolute left-3 top-3.5" />
        </div>

      </section>

      {/* Leaderboard Table */}
      <section className="bg-brand-surface border border-brand-border overflow-hidden rounded-lg backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-brand-border bg-black/40 text-brand-text-muted font-sans text-xs uppercase tracking-widest font-extrabold">
                <th className="py-4 px-6 text-center w-20">POSICÃO</th>
                <th className="py-4 px-6">PILOTO</th>
                <th className="py-4 px-6">CATEGORIA BASE</th>
                <th className="py-4 px-6 text-right">MELHOR VOLTA</th>
                <th className="py-4 px-6 text-right w-48">PERFORMANCE / GAP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#323235]/40">
              {filteredRankings.map((driver) => {
                const isTop3 = driver.rank <= 3;
                
                // Calculate simulated width performance percentage
                const baseLapSec = 42.194;
                const driverLapSec = parseFloat(driver.bestLap.replace(':', '.'));
                const diff = driverLapSec - baseLapSec;
                const percentage = Math.max(0, 100 - (diff * 20));

                return (
                  <tr 
                    key={driver.rank}
                    onClick={() => setSelectedDriver(driver)}
                    className="hover:bg-brand-surface-high/65 transition-colors cursor-pointer group"
                  >
                    {/* Rank Badge Column */}
                    <td className="py-5 px-6 text-center">
                      {driver.rank === 1 ? (
                        <div className="inline-flex w-8 h-8 rounded-full bg-yellow-500/20 text-yellow-500 border border-yellow-500 items-center justify-center font-display text-lg italic shadow-neon">
                          1st
                        </div>
                      ) : driver.rank === 2 ? (
                        <div className="inline-flex w-8 h-8 rounded-full bg-slate-400/20 text-slate-300 border border-slate-400 items-center justify-center font-display text-lg italic">
                          2nd
                        </div>
                      ) : driver.rank === 3 ? (
                        <div className="inline-flex w-8 h-8 rounded-full bg-amber-700/20 text-amber-600 border border-amber-700 items-center justify-center font-display text-lg italic">
                          3rd
                        </div>
                      ) : (
                        <span className="font-mono text-xs text-brand-text-muted">#{driver.rank}</span>
                      )}
                    </td>

                    {/* Driver metadata */}
                    <td className="py-5 px-6">
                      <div className="flex items-center gap-3">
                        <img 
                          alt={driver.name} 
                          className="w-10 h-10 rounded-full border border-brand-border object-cover shrink-0" 
                          referrerPolicy="no-referrer"
                          src={driver.avatar}
                        />
                        <div>
                          <p className="font-display text-lg italic tracking-wide group-hover:text-brand-red transition-colors">
                            {driver.nickname}
                          </p>
                          <p className="font-sans text-[11px] text-brand-text-muted font-medium">
                            {driver.name}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category Column */}
                    <td className="py-5 px-6">
                      <span className="font-sans text-xs text-brand-text font-medium">
                        {driver.rank % 2 === 0 ? 'Sênior (125cc)' : 'Super F4 (21hp)'}
                      </span>
                    </td>

                    {/* Best Lap Column */}
                    <td className="py-5 px-6 text-right">
                      <div className="flex flex-col items-end">
                        <span className="font-display text-xl text-white tracking-wider font-semibold">
                          {driver.bestLap}
                        </span>
                        {driver.recordBeaten && (
                          <span className="text-[9px] bg-brand-red text-white px-1.5 py-0.5 uppercase tracking-tighter font-extrabold skew-tag animate-pulse">
                            BATIDO
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Progress visual bar */}
                    <td className="py-5 px-6 text-right">
                      <div className="w-full flex items-center justify-end gap-3">
                        <div className="w-24 bg-black/40 h-2.5 rounded-full overflow-hidden border border-brand-border shrink-0">
                          <div 
                            style={{ width: `${percentage}%` }}
                            className={`h-full ${isTop3 ? 'bg-brand-red' : 'bg-brand-text-muted'}`}
                          ></div>
                        </div>
                        <span className="font-mono text-[10px] text-brand-text-muted font-bold shrink-0">
                          {diff === 0 ? 'RECORD' : `+${diff.toFixed(3)}s`}
                        </span>
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {filteredRankings.length === 0 && (
          <div className="py-12 text-center text-brand-text-muted">
            <span className="material-symbols-outlined text-4xl mb-2 text-brand-red">info</span>
            <p className="font-sans text-xs">Nenhum piloto coincide com os filtros atuais do paddock.</p>
          </div>
        )}
      </section>

      {/* Driver Telemetry Detail Modal */}
      {selectedDriver && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0b0b0d] border border-brand-border w-full max-w-md p-6 rounded-lg relative overflow-hidden shadow-2xl">
            
            <button 
              onClick={() => setSelectedDriver(null)}
              className="text-brand-text hover:text-brand-red p-1 rounded-full absolute top-4 right-4 cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex flex-col items-center text-center mt-4">
              <img 
                src={selectedDriver.avatar} 
                alt={selectedDriver.nickname} 
                referrerPolicy="no-referrer"
                className="w-24 h-24 rounded-full border border-brand-border shadow-lg object-cover mb-4"
              />
              
              <span className="bg-brand-red/20 border border-brand-red text-brand-red font-display text-sm px-4 py-1 skew-tag italic mb-2">
                <span>POSIÇÃO #{selectedDriver.rank} GLOBAL</span>
              </span>

              <h3 className="font-display text-4xl italic text-white tracking-wide">{selectedDriver.nickname}</h3>
              <p className="font-sans text-xs text-brand-text-muted uppercase mt-0.5 tracking-wider">{selectedDriver.name}</p>
              
              <div className="my-6 w-full p-4 bg-black/40 border border-brand-border rounded-md text-left space-y-3">
                <span className="text-brand-red font-display text-xs tracking-widest uppercase block mb-1">TELEMETRIA INTEGRADA</span>
                
                <div className="flex justify-between items-center text-xs text-brand-text-muted">
                  <span>Melhor Volta Geral</span>
                  <span className="font-display text-lg text-white tracking-widest">{selectedDriver.bestLap}</span>
                </div>
                
                <div className="flex justify-between items-center text-xs text-brand-text-muted">
                  <span>Velocidade Final Estimada</span>
                  <span className="font-mono text-white">88.4 km/h</span>
                </div>

                <div className="flex justify-between items-center text-xs text-brand-text-muted">
                  <span>Ritmo de Consistência</span>
                  <span className="text-brand-red">94.8% (Excelente)</span>
                </div>

                <div className="flex justify-between items-center text-xs text-brand-text-muted">
                  <span>Conselho do Coach de Corrida</span>
                  <span className="text-xs text-brand-text font-medium italic block text-right max-w-[200px]">
                    "{selectedDriver.tagline}"
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  alert(`Aviso de desafio enviado para ${selectedDriver.nickname}! Prepare-se para encontrar ele no grid.`);
                  setSelectedDriver(null);
                }}
                className="w-full bg-brand-red hover:bg-brand-red-hover text-white py-3 font-display text-xl uppercase italic rounded mechanical-switch cursor-pointer"
              >
                DESAFIAR PILOTO EM PISTA
              </button>
            </div>

            <div className="absolute bottom-0 inset-x-0 h-1 carbon-texture bg-brand-red"></div>
          </div>
        </div>
      )}

    </div>
  );
}
