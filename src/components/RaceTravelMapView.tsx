import React, { useState, useEffect } from 'react';
import {
  Compass,
  MapPin,
  Calendar,
  ExternalLink,
  Plane,
  Thermometer,
  Bookmark,
  BookmarkCheck,
  Search,
  CheckCircle2,
  Circle,
  RotateCcw,
  Luggage,
  Sparkles,
  Mountain,
  Award,
  Clock,
  Info,
  ChevronRight,
  ShieldCheck,
  Sun,
  Flame
} from 'lucide-react';
import { RaceDestination } from '../types';
import {
  WORLD_RACES,
  RACE_MONTHS,
  TRAVEL_COACH_TIPS,
  RUNNER_PACKING_CHECKLIST
} from '../data/worldRaces';

interface RaceTravelMapViewProps {
  onSelectTargetRace: (race: RaceDestination) => void;
  savedTargetRace: RaceDestination | null;
}

export const RaceTravelMapView: React.FC<RaceTravelMapViewProps> = ({
  onSelectTargetRace,
  savedTargetRace
}) => {
  // Navigation tabs within the Travel & Races view
  const [activeSubTab, setActiveSubTab] = useState<'races' | 'tips' | 'checklist'>('races');

  // Filters for Races
  const [selectedTop10, setSelectedTop10] = useState<'todos' | '5k' | '10k' | '21k'>('todos');
  const [selectedScope, setSelectedScope] = useState<'todos' | 'brasil' | 'continente'>('todos');
  const [selectedRegion, setSelectedRegion] = useState<string>('todas');
  const [selectedMonth, setSelectedMonth] = useState<number | 'todos'>('todos');
  const [selectedDistance, setSelectedDistance] = useState<'todos' | '5km' | '10km' | '21km'>('todos');
  const [selectedCourseType, setSelectedCourseType] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState('');

  // Interactive Checklist Persistence
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('goteam_runner_travel_checklist');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const toggleCheckItem = (id: string) => {
    setCheckedItems((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem('goteam_runner_travel_checklist', JSON.stringify(next));
      } catch (err) {
        console.warn('Failed to save checklist state', err);
      }
      return next;
    });
  };

  const resetChecklist = () => {
    setCheckedItems({});
    try {
      localStorage.removeItem('goteam_runner_travel_checklist');
    } catch (err) {
      console.warn('Failed to clear checklist state', err);
    }
  };

  const markAllChecklist = () => {
    const allChecked: Record<string, boolean> = {};
    RUNNER_PACKING_CHECKLIST.forEach((item) => {
      allChecked[item.id] = true;
    });
    setCheckedItems(allChecked);
    try {
      localStorage.setItem('goteam_runner_travel_checklist', JSON.stringify(allChecked));
    } catch (err) {
      console.warn('Failed to save all checked', err);
    }
  };

  // Filter logic
  const filteredRaces = WORLD_RACES.filter((race) => {
    // Top 10 filter
    if (selectedTop10 !== 'todos') {
      const rankMatch = race.topRank?.find((r) => r.distance === selectedTop10);
      if (!rankMatch) return false;
      if (selectedScope !== 'todos' && rankMatch.scope !== selectedScope) return false;
    } else {
      if (selectedScope === 'brasil' && race.region !== 'Brasil') return false;
      if (selectedScope === 'continente' && race.region === 'Brasil') return false;
    }

    const matchesRegion = selectedRegion === 'todas' || race.region === selectedRegion;
    const matchesMonth = selectedMonth === 'todos' || race.month === selectedMonth;

    let matchesDistance = true;
    if (selectedDistance !== 'todos') {
      if (selectedDistance === '5km') {
        matchesDistance =
          race.distance === '5km' ||
          race.distance === 'ambos' ||
          race.distance === '5k_10k_21k' ||
          (race.distancesAvailable?.includes('5km') ?? false);
      } else if (selectedDistance === '10km') {
        matchesDistance =
          race.distance === '10km' ||
          race.distance === 'ambos' ||
          race.distance === '5k_10k_21k' ||
          (race.distancesAvailable?.includes('10km') ?? false);
      } else if (selectedDistance === '21km') {
        matchesDistance =
          race.distance === '21km' ||
          race.distance === '5k_10k_21k' ||
          (race.distancesAvailable?.includes('21km') ?? false);
      }
    }

    const matchesCourseType =
      selectedCourseType === 'todos' || race.courseType.includes(selectedCourseType);

    const term = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !term ||
      race.name.toLowerCase().includes(term) ||
      race.city.toLowerCase().includes(term) ||
      race.country.toLowerCase().includes(term) ||
      race.highlight.toLowerCase().includes(term);

    return matchesRegion && matchesMonth && matchesDistance && matchesCourseType && matchesSearch;
  }).sort((a, b) => {
    if (selectedTop10 !== 'todos') {
      const rankA = a.topRank?.find((r) => r.distance === selectedTop10)?.rank ?? 99;
      const rankB = b.topRank?.find((r) => r.distance === selectedTop10)?.rank ?? 99;
      return rankA - rankB;
    }
    return 0;
  });

  const totalPacked = RUNNER_PACKING_CHECKLIST.filter((item) => checkedItems[item.id]).length;
  const packingProgressPercent = Math.round(
    (totalPacked / RUNNER_PACKING_CHECKLIST.length) * 100
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. Hero Header Banner (Padrão Oficial Go Team) */}
      <div className="bg-[#0d3b45] text-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#0d3b45]/20 relative overflow-hidden">
        {/* Subtle geometric background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#c6f43a]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-[#a5cf2a]/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#c6f43a] text-xs font-bold uppercase tracking-wider border border-white/10">
              <Compass className="w-3.5 h-3.5" />
              <span>Turismo de Corrida • Assessoria Go Team</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-display font-black tracking-tight text-white leading-tight">
              Dicas de Viagens & Corridas pelo Mundo
            </h1>
            <p className="text-white/80 text-sm sm:text-base leading-relaxed">
              Curadoria das melhores provas de 5K, 10K e 21K no Brasil e no exterior. Conheça percursos planos para recordes pessoais, provas cênicas, logística de viagem do Treinador Leandro e checklist para sua bagagem.
            </p>

            {/* Quick stats pills */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="bg-white/10 text-[#c6f43a] font-bold px-3 py-1 rounded-full border border-white/10">
                ✓ 18 Provas Selecionadas
              </span>
              <span className="bg-white/10 text-white/90 font-medium px-3 py-1 rounded-full border border-white/10">
                5K, 10K & 21K (Meia)
              </span>
              <span className="bg-white/10 text-white/90 font-medium px-3 py-1 rounded-full border border-white/10">
                Dicas de Logística & Clima
              </span>
              <span className="bg-white/10 text-white/90 font-medium px-3 py-1 rounded-full border border-white/10">
                Checklist do Atleta
              </span>
            </div>
          </div>

          {/* Target Race Callout Card if selected */}
          {savedTargetRace ? (
            <div className="bg-white/10 border border-[#c6f43a]/40 backdrop-blur-md rounded-2xl p-4 sm:p-5 text-white max-w-sm shrink-0 shadow-lg">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-[#c6f43a] text-[#0d3b45] px-2.5 py-0.5 rounded-full">
                  Sua Prova Alvo Salva
                </span>
                <span className="text-2xl">{savedTargetRace.flag}</span>
              </div>
              <h3 className="font-display font-black text-white text-base leading-snug">
                {savedTargetRace.name}
              </h3>
              <p className="text-white/80 text-xs mt-1">
                📍 {savedTargetRace.city}, {savedTargetRace.country}
              </p>
              <div className="mt-2.5 pt-2.5 border-t border-white/15 flex items-center justify-between text-xs">
                <span className="text-[#c6f43a] font-bold">{savedTargetRace.dateString}</span>
                <span className="text-[11px] text-white/70">{savedTargetRace.courseType}</span>
              </div>
            </div>
          ) : (
            <div className="hidden lg:flex flex-col items-center justify-center p-5 rounded-2xl bg-white/5 border border-white/10 text-center max-w-xs shrink-0">
              <span className="text-3xl mb-2">✈️</span>
              <p className="text-xs font-bold text-white">Escolha sua Prova Alvo</p>
              <p className="text-[11px] text-white/70 mt-1">
                Selecione uma prova na lista abaixo para definir como seu grande objetivo do ano!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 2. Top Navigation Tabs (Padrão Go Team) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-1.5 flex gap-1 shadow-xs overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('races')}
          className={`flex-1 min-w-[170px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
            activeSubTab === 'races'
              ? 'bg-[#0d3b45] text-[#c6f43a] shadow-xs'
              : 'text-slate-600 hover:text-[#0d3b45] hover:bg-slate-50'
          }`}
        >
          <span>🌍</span>
          <span>Catálogo de Corridas ({WORLD_RACES.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('tips')}
          className={`flex-1 min-w-[170px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
            activeSubTab === 'tips'
              ? 'bg-[#0d3b45] text-[#c6f43a] shadow-xs'
              : 'text-slate-600 hover:text-[#0d3b45] hover:bg-slate-50'
          }`}
        >
          <span>💡</span>
          <span>Dicas de Viagem do Treinador</span>
        </button>

        <button
          onClick={() => setActiveSubTab('checklist')}
          className={`flex-1 min-w-[170px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
            activeSubTab === 'checklist'
              ? 'bg-[#0d3b45] text-[#c6f43a] shadow-xs'
              : 'text-slate-600 hover:text-[#0d3b45] hover:bg-slate-50'
          }`}
        >
          <span>🎒</span>
          <span>Checklist de Bagagem</span>
          {totalPacked > 0 && (
            <span className="text-[10px] bg-[#c6f43a] text-[#0d3b45] px-1.5 py-0.2 rounded-full font-black">
              {totalPacked}/{RUNNER_PACKING_CHECKLIST.length}
            </span>
          )}
        </button>
      </div>

      {/* 3. CONTEÚDO DA ABA: CATÁLOGO DE CORRIDAS */}
      {activeSubTab === 'races' && (
        <div className="space-y-6">
          {/* SELETOR EXCLUSIVO: TOP 10 BRASIL E CONTINENTES */}
          <div className="bg-[#082830] text-white rounded-3xl p-4 sm:p-5 border border-white/15 space-y-3.5 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">🏆</span>
                <div>
                  <h3 className="text-sm font-display font-black uppercase text-white tracking-wide">
                    Rankings Oficiais Go Team • Top 10
                  </h3>
                  <p className="text-[11px] text-[#c6f43a]">
                    Curadoria de elite do Treinador Leandro: Brasil & Continentes
                  </p>
                </div>
              </div>

              {/* Toggle de Escopo: Brasil vs Continentes */}
              <div className="flex items-center gap-1 bg-white/10 p-1 rounded-full border border-white/10 text-xs">
                {[
                  { id: 'todos', label: 'Todos os Lugares' },
                  { id: 'brasil', label: '🇧🇷 Brasil' },
                  { id: 'continente', label: '🌐 Continentes' }
                ].map((sc) => (
                  <button
                    key={sc.id}
                    onClick={() => setSelectedScope(sc.id as any)}
                    className={`px-3 py-1 rounded-full text-[11px] font-bold transition cursor-pointer ${
                      selectedScope === sc.id
                        ? 'bg-[#c6f43a] text-[#0d3b45] shadow-sm'
                        : 'text-white/80 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {sc.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick buttons para Top 10 */}
            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-white/10 text-xs">
              <button
                onClick={() => {
                  setSelectedTop10('todos');
                }}
                className={`px-3.5 py-1.5 rounded-full font-bold transition cursor-pointer text-xs ${
                  selectedTop10 === 'todos'
                    ? 'bg-white text-[#0d3b45] font-black shadow-sm'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                Todas as Provas ({WORLD_RACES.length})
              </button>

              <button
                onClick={() => {
                  setSelectedTop10('5k');
                  setSelectedDistance('5km');
                }}
                className={`px-3.5 py-1.5 rounded-full font-bold transition cursor-pointer flex items-center gap-1.5 text-xs ${
                  selectedTop10 === '5k'
                    ? 'bg-[#c6f43a] text-[#0d3b45] font-black shadow-sm'
                    : 'bg-white/10 text-[#c6f43a] hover:bg-white/20'
                }`}
              >
                <span>🥇</span> Top 10 - 5K
              </button>

              <button
                onClick={() => {
                  setSelectedTop10('10k');
                  setSelectedDistance('10km');
                }}
                className={`px-3.5 py-1.5 rounded-full font-bold transition cursor-pointer flex items-center gap-1.5 text-xs ${
                  selectedTop10 === '10k'
                    ? 'bg-[#c6f43a] text-[#0d3b45] font-black shadow-sm'
                    : 'bg-white/10 text-[#c6f43a] hover:bg-white/20'
                }`}
              >
                <span>🥈</span> Top 10 - 10K
              </button>

              <button
                onClick={() => {
                  setSelectedTop10('21k');
                  setSelectedDistance('21km');
                }}
                className={`px-3.5 py-1.5 rounded-full font-bold transition cursor-pointer flex items-center gap-1.5 text-xs ${
                  selectedTop10 === '21k'
                    ? 'bg-[#c6f43a] text-[#0d3b45] font-black shadow-sm'
                    : 'bg-white/10 text-[#c6f43a] hover:bg-white/20'
                }`}
              >
                <span>🥉</span> Top 10 - 21K (Meia)
              </button>
            </div>
          </div>

          {/* Painel de Filtros e Busca no padrão Go Team */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Barra de Busca */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar prova por nome, cidade (ex: Valência, Tóquio, Rio, Paris)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:border-[#a5cf2a] focus:bg-white transition"
                />
              </div>

              {/* Filtro de Distâncias */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                <span className="text-slate-400 font-bold text-[11px] uppercase tracking-wider mr-1 shrink-0">
                  Distância:
                </span>
                {[
                  { id: 'todos', label: 'Todas' },
                  { id: '5km', label: '5K' },
                  { id: '10km', label: '10K' },
                  { id: '21km', label: '21K Meia' }
                ].map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setSelectedDistance(d.id as any)}
                    className={`px-3 py-1.5 rounded-full font-bold transition cursor-pointer shrink-0 ${
                      selectedDistance === d.id
                        ? 'bg-[#0d3b45] text-[#c6f43a]'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Filtros de Região */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                <span className="text-slate-400 font-bold text-[11px] uppercase tracking-wider mr-1 shrink-0">
                  Região:
                </span>
                {[
                  { id: 'todas', label: 'Todas' },
                  { id: 'Brasil', label: '🇧🇷 Brasil' },
                  { id: 'Europa', label: '🇪🇺 Europa' },
                  { id: 'América do Norte', label: '🇺🇸 América do Norte' },
                  { id: 'América do Sul', label: '🇦🇷 América do Sul' },
                  { id: 'Ásia / Oceania', label: '🌏 Ásia & Oceania' }
                ].map((reg) => (
                  <button
                    key={reg.id}
                    onClick={() => setSelectedRegion(reg.id)}
                    className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition cursor-pointer text-xs shrink-0 ${
                      selectedRegion === reg.id
                        ? 'bg-[#c6f43a] text-[#0d3b45] border border-[#a5cf2a]'
                        : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {reg.label}
                  </button>
                ))}
              </div>

              {/* Filtro de Perfil */}
              <div className="flex items-center gap-1.5 text-xs shrink-0">
                <span className="text-slate-400 font-bold text-[11px] uppercase tracking-wider">
                  Perfil:
                </span>
                <select
                  value={selectedCourseType}
                  onChange={(e) => setSelectedCourseType(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl px-3 py-1.5 focus:outline-none focus:border-[#a5cf2a]"
                >
                  <option value="todos">Todos os perfis</option>
                  <option value="Plana">⚡ Plana (Recorde Pessoal)</option>
                  <option value="Cênica">🌄 Cênica / Turística</option>
                  <option value="Noturna">🌙 Noturna Festiva</option>
                  <option value="Ondulada">📈 Ondulada</option>
                </select>
              </div>
            </div>

            {/* Seletor de Meses do Ano */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                <span className="uppercase tracking-wider">Mês do Calendário de Provas:</span>
                <button
                  onClick={() => setSelectedMonth('todos')}
                  className={`text-xs cursor-pointer font-bold ${
                    selectedMonth === 'todos'
                      ? 'text-[#0d3b45] underline'
                      : 'text-slate-400 hover:text-[#0d3b45]'
                  }`}
                >
                  Ver Todos os Meses
                </button>
              </div>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none text-xs">
                {RACE_MONTHS.map((m) => (
                  <button
                    key={m.number}
                    onClick={() => setSelectedMonth(m.number)}
                    className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition cursor-pointer text-xs shrink-0 border ${
                      selectedMonth === m.number
                        ? 'bg-[#0d3b45] text-[#c6f43a] border-[#0d3b45] shadow-xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {m.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Contador de resultados */}
          <div className="flex items-center justify-between text-xs text-slate-500 px-1 font-medium">
            <span>
              Exibindo <strong className="text-[#0d3b45]">{filteredRaces.length}</strong> {filteredRaces.length === 1 ? 'prova selecionada' : 'provas selecionadas'}
            </span>
            {(selectedRegion !== 'todas' || selectedMonth !== 'todos' || selectedDistance !== 'todos' || selectedCourseType !== 'todos' || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedRegion('todas');
                  setSelectedMonth('todos');
                  setSelectedDistance('todos');
                  setSelectedCourseType('todos');
                  setSearchQuery('');
                }}
                className="text-[#0d3b45] hover:text-[#a5cf2a] font-bold underline cursor-pointer"
              >
                Limpar todos os filtros
              </button>
            )}
          </div>

          {/* Grid de Cards de Provas no padrão Go Team */}
          {filteredRaces.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
              <span className="text-4xl">🔍</span>
              <h3 className="text-lg font-display font-black text-[#0d3b45]">
                Nenhuma corrida encontrada para esses filtros
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Tente ajustar a região, mês ou distância selecionada, ou clique no botão abaixo para restaurar a lista completa.
              </p>
              <button
                onClick={() => {
                  setSelectedRegion('todas');
                  setSelectedMonth('todos');
                  setSelectedDistance('todos');
                  setSelectedCourseType('todos');
                  setSearchQuery('');
                }}
                className="mt-2 px-4 py-2 rounded-full bg-[#c6f43a] text-[#0d3b45] text-xs font-black hover:scale-105 transition cursor-pointer"
              >
                Restaurar catálogo completo
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRaces.map((race) => {
                const isSelectedTarget = savedTargetRace?.id === race.id;

                return (
                  <div
                    key={race.id}
                    className={`bg-white rounded-3xl border transition-all duration-200 flex flex-col justify-between p-5 sm:p-6 shadow-xs hover:shadow-md ${
                      isSelectedTarget
                        ? 'border-[#a5cf2a] ring-2 ring-[#c6f43a]/50 bg-gradient-to-b from-[#c6f43a]/5 to-white'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="space-y-3.5">
                      {/* Top Header do Card: Bandeira, Distâncias e Bookmark */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-3xl" title={race.country}>
                            {race.flag}
                          </span>
                          <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg bg-[#0d3b45] text-[#c6f43a]">
                            {race.distance === 'ambos'
                              ? '5K & 10K'
                              : race.distance === '5k_10k_21k'
                              ? '5K, 10K & 21K'
                              : race.distance.toUpperCase()}
                          </span>
                          <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                            {race.monthName}
                          </span>
                        </div>

                        {/* Botão Salvar como Meta rápida */}
                        <button
                          onClick={() => onSelectTargetRace(race)}
                          title={isSelectedTarget ? 'Prova alvo atual' : 'Definir como minha meta anual'}
                          className={`p-2 rounded-xl transition cursor-pointer ${
                            isSelectedTarget
                              ? 'bg-[#c6f43a] text-[#0d3b45] shadow-xs'
                              : 'bg-slate-100 text-slate-400 hover:text-[#0d3b45] hover:bg-slate-200'
                          }`}
                        >
                          {isSelectedTarget ? (
                            <BookmarkCheck className="w-4 h-4" />
                          ) : (
                            <Bookmark className="w-4 h-4" />
                          )}
                        </button>
                      </div>

                      {/* Nome da Prova e Localização */}
                      <div>
                        {race.topRank && race.topRank.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-2">
                            {race.topRank.map((tr, i) => (
                              <span
                                key={i}
                                className="inline-flex items-center gap-1 text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full bg-[#c6f43a] text-[#0d3b45] shadow-xs"
                              >
                                🏆 {tr.categoryLabel || `Top 10 ${tr.distance.toUpperCase()} • ${tr.rank}º Lugar`}
                              </span>
                            ))}
                          </div>
                        )}
                        <h3 className="text-lg font-display font-black text-[#0d3b45] leading-snug">
                          {race.name}
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5 font-medium flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>
                            {race.city}, {race.country} • {race.region}
                          </span>
                        </p>
                      </div>

                      {/* Tag do Percurso */}
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200/80">
                        <Mountain className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{race.courseType}</span>
                      </div>

                      {/* Destaque / Highlight da Prova */}
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {race.highlight}
                      </p>

                      {/* Box Dica de Viagem & Clima da Go Team */}
                      <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2 text-xs">
                        <div className="flex items-center gap-1.5 text-amber-900 font-bold">
                          <Thermometer className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span>Clima Médio: <strong className="font-extrabold">{race.averageTemp}</strong></span>
                        </div>
                        <div className="flex items-start gap-1.5 text-amber-900/90 leading-relaxed text-[11px]">
                          <Plane className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                          <span><strong>Dica Go Team:</strong> {race.travelTips}</span>
                        </div>
                      </div>
                    </div>

                    {/* Rodapé com Data e Botões de Ação */}
                    <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                      <div className="text-[11px] text-slate-500">
                        <span className="block font-bold text-[#0d3b45] text-xs">
                          {race.dateString}
                        </span>
                        <span>Data oficial</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => onSelectTargetRace(race)}
                          className={`px-3 py-1.5 rounded-full text-xs font-black transition cursor-pointer shadow-xs ${
                            isSelectedTarget
                              ? 'bg-[#0d3b45] text-[#c6f43a]'
                              : 'bg-[#c6f43a] text-[#0d3b45] hover:bg-[#b8e932]'
                          }`}
                        >
                          {isSelectedTarget ? '✓ Meta Salva' : 'Definir Meta'}
                        </button>

                        <a
                          href={race.officialWebsite}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-full bg-slate-100 text-slate-600 hover:text-[#0d3b45] hover:bg-slate-200 transition"
                          title="Acessar site oficial da prova"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 4. CONTEÚDO DA ABA: DICAS DE VIAGEM DO TREINADOR */}
      {activeSubTab === 'tips' && (
        <div className="space-y-6">
          {/* Banner do Treinador Leandro */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-center gap-6">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
                alt="Treinador Leandro Irineu da Silva"
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover shadow-md border-4 border-[#c6f43a]"
              />
              <span className="absolute bottom-0 right-0 bg-[#0d3b45] text-[#c6f43a] text-xs p-1 rounded-full border-2 border-white">
                ⚡
              </span>
            </div>
            <div className="space-y-2 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="text-[11px] font-black uppercase tracking-wider bg-[#c6f43a] text-[#0d3b45] px-3 py-1 rounded-full">
                  Palavra do Treinador Leandro
                </span>
                <span className="text-xs font-bold text-slate-500">
                  Leandro Irineu da Silva • Head Coach Go Team
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-display font-black text-[#0d3b45]">
                "Correr pelo mundo é a melhor forma de conhecer uma cidade"
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
                Viajar para correr exige uma estratégia diferente das viagens convencionais de férias. Seu corpo precisa chegar descansado, nutrido e hidratado para você entregar o seu melhor no dia da prova e ainda curtir a cidade após cruzar a linha de chegada.
              </p>
            </div>
          </div>

          {/* Grid de Dicas Práticas de Viagem */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TRAVEL_COACH_TIPS.map((tip) => (
              <div
                key={tip.id}
                className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:border-[#a5cf2a] hover:shadow-md transition flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl p-2 rounded-2xl bg-slate-50 border border-slate-100">
                      {tip.icon}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                      Guia Oficial
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-display font-black text-[#0d3b45]">
                      {tip.title}
                    </h3>
                    <p className="text-xs font-bold text-[#a5cf2a] mt-0.5">
                      {tip.subtitle}
                    </p>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {tip.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-emerald-800 text-[11px] font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Recomendação Assessoria Go Team</span>
                </div>
              </div>
            ))}
          </div>

          {/* Box de Periodização: Como sincronizar a planilha Go Team com sua prova */}
          <div className="bg-[#0d3b45] text-white rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-[#c6f43a] text-xs font-black uppercase tracking-wider">
              <Clock className="w-4 h-4" />
              <span>Cronograma & Periodização para Viagens</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-display font-black text-white">
              Como sincronizar as semanas da sua planilha com a data da prova
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="bg-white/10 p-4 rounded-2xl border border-white/10 space-y-1">
                <span className="text-[#c6f43a] font-black text-sm block">1. Provas de 5K (8 Semanas)</span>
                <p className="text-white/80 leading-relaxed">
                  Inicie a planilha exatamente 8 semanas antes da data da prova. A semana 8 foi desenhada como polimento para você chegar descansado.
                </p>
              </div>

              <div className="bg-white/10 p-4 rounded-2xl border border-white/10 space-y-1">
                <span className="text-[#c6f43a] font-black text-sm block">2. Provas de 10K (10 Semanas)</span>
                <p className="text-white/80 leading-relaxed">
                  O ciclo de 10 semanas atinge o pico de volume na Semana 8 e 9. A semana da prova reduz a quilometragem para supercompensação muscular.
                </p>
              </div>

              <div className="bg-white/10 p-4 rounded-2xl border border-white/10 space-y-1">
                <span className="text-[#c6f43a] font-black text-sm block">3. Meias Maratonas 21K (12-16 Semanas)</span>
                <p className="text-white/80 leading-relaxed">
                  O maior longão do ciclo (18km a 20km) deve ser realizado 2 a 3 semanas antes do evento. Na véspera do voo, faça apenas trote regenerativo.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. CONTEÚDO DA ABA: CHECKLIST DE BAGAGEM */}
      {activeSubTab === 'checklist' && (
        <div className="space-y-6">
          {/* Header do Checklist com Barra de Progresso */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0d3b45] uppercase tracking-wider">
                  <Luggage className="w-4 h-4 text-[#a5cf2a]" />
                  <span>Mala & Bagagem de Mão do Corredor</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-display font-black text-[#0d3b45]">
                  Checklist Completo de Viagem para Provas
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
                  Marque cada item à medida que você for organizando sua mala. Suas seleções ficam salvas no seu navegador.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={resetChecklist}
                  className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-full transition cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Limpar</span>
                </button>
                <button
                  onClick={markAllChecklist}
                  className="text-xs font-black text-[#0d3b45] bg-[#c6f43a] hover:bg-[#b8e932] px-3.5 py-1.5 rounded-full transition cursor-pointer shadow-xs"
                >
                  Marcar Todos
                </button>
              </div>
            </div>

            {/* Barra de Progresso Visual */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-600">Progresso do Empacotamento:</span>
                <span className="text-[#0d3b45]">
                  {totalPacked} de {RUNNER_PACKING_CHECKLIST.length} itens prontos ({packingProgressPercent}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden p-0.5 border border-slate-200">
                <div
                  className="bg-gradient-to-r from-[#a5cf2a] to-[#c6f43a] h-full rounded-full transition-all duration-300"
                  style={{ width: `${packingProgressPercent}%` }}
                />
              </div>
              {packingProgressPercent === 100 && (
                <p className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Tudo pronto! Sua mala esportiva está 100% preparada para a viagem e para o recorde.</span>
                </p>
              )}
            </div>
          </div>

          {/* Lista de Itens por Categoria */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {['Equipamento', 'Nutrição', 'Cuidado & Saúde', 'Logística'].map((cat) => {
              const items = RUNNER_PACKING_CHECKLIST.filter((i) => i.category === cat);

              return (
                <div
                  key={cat}
                  className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <h3 className="text-sm font-display font-black text-[#0d3b45] uppercase tracking-wider flex items-center gap-2">
                      <span>{cat === 'Equipamento' ? '👟' : cat === 'Nutrição' ? '⚡' : cat === 'Cuidado & Saúde' ? '🩹' : '📄'}</span>
                      <span>{cat}</span>
                    </h3>
                    <span className="text-xs font-bold text-slate-400">
                      {items.filter((i) => checkedItems[i.id]).length}/{items.length}
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {items.map((item) => {
                      const isChecked = Boolean(checkedItems[item.id]);

                      return (
                        <div
                          key={item.id}
                          onClick={() => toggleCheckItem(item.id)}
                          className={`p-3 rounded-2xl border transition flex items-center justify-between gap-3 cursor-pointer select-none ${
                            isChecked
                              ? 'bg-emerald-50/50 border-emerald-300 text-slate-800'
                              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <span
                            className={`text-xs font-medium ${
                              isChecked ? 'line-through text-slate-500' : 'text-slate-800'
                            }`}
                          >
                            {item.label}
                          </span>

                          <button
                            type="button"
                            className={`shrink-0 p-1 rounded-full transition ${
                              isChecked ? 'text-emerald-600' : 'text-slate-400'
                            }`}
                          >
                            {isChecked ? (
                              <CheckCircle2 className="w-5 h-5 fill-emerald-100" />
                            ) : (
                              <Circle className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Aviso Importante de Segurança Go Team */}
          <div className="bg-amber-50 rounded-2xl border border-amber-200 p-4 text-xs text-amber-900 flex items-start gap-3">
            <span className="text-xl shrink-0">⚠️</span>
            <div className="space-y-1">
              <strong className="block font-black">Regra de Ouro da Assessoria Go Team:</strong>
              <p className="leading-relaxed">
                Nunca despache seus tênis de corrida, top, meias ou medicação na bagagem de porão. Em casos de atraso ou extravio de bagagem pela companhia aérea, você terá todo o essencial para correr a prova no domingo com tranquilidade.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
