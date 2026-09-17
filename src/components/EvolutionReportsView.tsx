import React, { useState } from 'react';
import {
  Award,
  TrendingUp,
  Share2,
  Download,
  Flame,
  CheckCircle2,
  Sparkles,
  Zap,
  Heart,
  BarChart2,
  Camera,
  Copy,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserProfile, Activity } from '../types';

interface EvolutionReportsViewProps {
  currentUser: UserProfile;
  activities: Activity[];
}

export const EvolutionReportsView: React.FC<EvolutionReportsViewProps> = ({
  currentUser,
  activities
}) => {
  const [selectedStyle, setSelectedStyle] = useState<'neon' | 'sunset' | 'stealth'>('neon');
  const [copiedLink, setCopiedLink] = useState(false);

  const bestActivity = activities[0] || {
    title: 'Tiros VO2Max 8x400m',
    distanceKm: 6.2,
    avgPace: '4:20 min/km',
    durationSeconds: 1612,
    date: 'Hoje'
  };

  const handleTriggerCelebration = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10b981', '#34d399', '#f59e0b', '#06b6d4']
    });
  };

  const handleShareStory = async () => {
    handleTriggerCelebration();
    const shareData = {
      title: `Conquista GoTeam Running - ${currentUser.name}`,
      text: `Acabei de completar ${bestActivity.distanceKm}km no ritmo de ${bestActivity.avgPace}! Treino com o GoTeam Running Club. 🏃🔥`,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share dismissed:', err);
      }
    } else {
      navigator.clipboard.writeText(shareData.text);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  // Mock weekly evolution data for bars
  const weeklyHistory = [
    { week: 'Sem 1', km: 18.5, pace: '5:42' },
    { week: 'Sem 2', km: 22.0, pace: '5:35' },
    { week: 'Sem 3', km: 26.5, pace: '5:28' },
    { week: 'Sem 4', km: 31.0, pace: '5:18' },
    { week: 'Sem 5', km: 28.0, pace: '5:10' },
    { week: 'Sem 6', km: 35.5, pace: '5:02' },
    { week: 'Sem 7', km: 38.0, pace: '4:55' },
    { week: 'Sem 8', km: currentUser.currentWeeklyKm || 42.5, pace: '4:48' }
  ];

  const maxKm = Math.max(...weeklyHistory.map((w) => w.km), 45);

  const badges = [
    {
      id: 'b-5k',
      title: 'Primeiro 5K Oficial',
      desc: 'Correu 5km contínuos sem pausas para caminhar.',
      unlocked: true,
      icon: '🥉'
    },
    {
      id: 'b-sub25',
      title: 'Barreira Sub-25 Quebrada',
      desc: 'Ritmo médio abaixo de 5:00 min/km nos 5km.',
      unlocked: true,
      icon: '⚡'
    },
    {
      id: 'b-10k',
      title: 'Guerreiro dos 10K',
      desc: 'Completou a marca oficial dos 10km na rua.',
      unlocked: true,
      icon: '🏆'
    },
    {
      id: 'b-consistencia',
      title: 'Disciplina de Aço',
      desc: '4 semanas consecutivas batendo a meta semanal.',
      unlocked: true,
      icon: '🎯'
    },
    {
      id: 'b-cadencia',
      title: 'Mestre da Cadência',
      desc: 'Sessão inteira mantendo cadência média de 178 SPM.',
      unlocked: false,
      icon: '🦶'
    },
    {
      id: 'b-sub45-10k',
      title: 'Elite 10K Sub-45',
      desc: 'Concluir 10km em menos de 45 minutos cravados.',
      unlocked: false,
      icon: '💎'
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <BarChart2 className="w-4 h-4" />
            <span>Desempenho & Estatísticas Científicas</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Relatórios de Evolução & Conquistas
          </h1>
          <p className="text-slate-400 text-sm">
            Acompanhe o ganho de VO2Max, economia de corrida, redução de pace e compartilhe cards oficiais da equipe.
          </p>
        </div>

        <button
          onClick={handleShareStory}
          id="btn-share-achievement-top"
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-emerald-500/20 active:scale-95 transition-all"
        >
          <Share2 className="w-4 h-4" />
          <span>{copiedLink ? 'Copiado para Redes!' : 'Compartilhar Conquista'}</span>
        </button>
      </div>

      {/* Main Stats Highlights */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800">
          <span className="text-[11px] text-slate-400 font-semibold block">RITMO MÉDIO ATUAL</span>
          <p className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1">4:48 <span className="text-xs text-slate-400">/km</span></p>
          <span className="text-[11px] text-emerald-400 font-bold">▲ 54s mais veloz em 8 semanas</span>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800">
          <span className="text-[11px] text-slate-400 font-semibold block">ESTIMATIVA VO2MAX</span>
          <p className="text-2xl sm:text-3xl font-black text-white mt-1">52.4 <span className="text-xs text-slate-400">ml/kg</span></p>
          <span className="text-[11px] text-teal-400 font-bold">Excelente (Top 12% faixa etária)</span>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800">
          <span className="text-[11px] text-slate-400 font-semibold block">VOLUME TOTAL ACUMULADO</span>
          <p className="text-2xl sm:text-3xl font-black text-white mt-1">218 <span className="text-xs text-slate-400">km</span></p>
          <span className="text-[11px] text-slate-400">Neste ciclo de treinos</span>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800">
          <span className="text-[11px] text-slate-400 font-semibold block">FREQUÊNCIA DE REPOUSO</span>
          <p className="text-2xl sm:text-3xl font-black text-rose-400 mt-1">49 <span className="text-xs text-slate-400">bpm</span></p>
          <span className="text-[11px] text-slate-400">Coração com alta eficiência</span>
        </div>
      </div>

      {/* Evolution Chart: Weekly Mileage and Pace Drop */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-white">Evolução de Volume Semanal (km) & Ritmo</h3>
            <p className="text-xs text-slate-400">Progressão com semanas de sobrecarga controlada e absorção muscular</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-3 h-3 rounded bg-emerald-400" />
              Volume (km)
            </span>
            <span className="flex items-center gap-1.5 text-teal-300">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-400" />
              Evolução Pace (min/km)
            </span>
          </div>
        </div>

        {/* Custom Pure Tailwind Responsive Bar Graph */}
        <div className="pt-4 pb-2">
          <div className="grid grid-cols-8 gap-2 sm:gap-4 items-end h-48 border-b border-slate-800">
            {weeklyHistory.map((item, idx) => {
              const heightPercent = Math.round((item.km / maxKm) * 100);
              const isCurrent = idx === weeklyHistory.length - 1;
              return (
                <div key={item.week} className="flex flex-col items-center gap-2 group h-full justify-end">
                  <span className="text-[10px] font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {item.pace}/km
                  </span>
                  <div
                    className={`w-full rounded-t-xl transition-all duration-500 relative group-hover:brightness-110 ${
                      isCurrent
                        ? 'bg-gradient-to-t from-emerald-500 to-teal-400 shadow-lg shadow-emerald-500/20'
                        : 'bg-slate-800 hover:bg-slate-700'
                    }`}
                    style={{ height: `${heightPercent}%` }}
                  >
                    <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-bold text-white">
                      {item.km}
                    </span>
                  </div>
                  <span className={`text-[10px] sm:text-xs font-semibold ${isCurrent ? 'text-emerald-400 font-black' : 'text-slate-500'}`}>
                    {item.week}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Social Card Generator & Badges Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Badges */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold text-white">Conquistas & Medalhas da Equipe</h3>
            </div>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
              4 / 6 Desbloqueadas
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
                  badge.unlocked
                    ? 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    : 'bg-slate-950/40 border-slate-850 opacity-50'
                }`}
              >
                <div className="text-2xl p-2.5 rounded-2xl bg-slate-900 border border-slate-800 shrink-0">
                  {badge.icon}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-black text-white">{badge.title}</h4>
                    {badge.unlocked && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 leading-tight">{badge.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Social Share Graphic Card Preview */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Card para Redes Sociais</h3>
              </div>
              <span className="text-[10px] text-slate-400">Instagram & WhatsApp</span>
            </div>

            {/* Theme Selector for the card */}
            <div className="flex items-center gap-1.5 mb-4">
              <button
                onClick={() => setSelectedStyle('neon')}
                className={`flex-1 py-1 rounded-lg text-[10px] font-bold border transition-all ${
                  selectedStyle === 'neon'
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                Neon Emerald
              </button>
              <button
                onClick={() => setSelectedStyle('sunset')}
                className={`flex-1 py-1 rounded-lg text-[10px] font-bold border transition-all ${
                  selectedStyle === 'sunset'
                    ? 'bg-orange-500/20 border-orange-500 text-orange-400'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                Sunset Gold
              </button>
              <button
                onClick={() => setSelectedStyle('stealth')}
                className={`flex-1 py-1 rounded-lg text-[10px] font-bold border transition-all ${
                  selectedStyle === 'stealth'
                    ? 'bg-slate-700 border-slate-500 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                Stealth
              </button>
            </div>

            {/* Visual Social Card Graphic */}
            <div
              id="social-share-card-render"
              className={`p-5 rounded-2xl border relative overflow-hidden transition-all shadow-2xl ${
                selectedStyle === 'neon'
                  ? 'bg-gradient-to-b from-slate-950 via-slate-900 to-emerald-950 border-emerald-500/40 text-white'
                  : selectedStyle === 'sunset'
                  ? 'bg-gradient-to-b from-slate-950 via-slate-900 to-amber-950 border-amber-500/40 text-white'
                  : 'bg-gradient-to-b from-slate-950 to-slate-900 border-slate-700 text-white'
              }`}
            >
              {/* Card Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-md bg-emerald-500 flex items-center justify-center">
                    <Zap className="w-3.5 h-3.5 text-slate-950 fill-slate-950" />
                  </div>
                  <span className="text-[11px] font-black tracking-wider uppercase text-emerald-400">GoTeam Running</span>
                </div>
                <span className="text-[10px] text-slate-400 font-semibold">{bestActivity.date}</span>
              </div>

              {/* Main Big Numbers */}
              <div className="my-5 text-center space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block">Distância Concluída</span>
                <p className="text-4xl font-black tracking-tight text-white">
                  {bestActivity.distanceKm} <span className="text-xl font-bold text-emerald-400">KM</span>
                </p>
                <div className="flex items-center justify-center gap-4 text-xs mt-3 font-semibold text-slate-300">
                  <div>
                    <span className="text-[9px] uppercase text-slate-500 block">Pace Médio</span>
                    <strong className="text-emerald-400 text-sm">{bestActivity.avgPace}</strong>
                  </div>
                  <div className="w-px h-6 bg-slate-800" />
                  <div>
                    <span className="text-[9px] uppercase text-slate-500 block">Tempo Total</span>
                    <strong className="text-white text-sm">
                      {Math.floor(bestActivity.durationSeconds / 60)}m {bestActivity.durationSeconds % 60}s
                    </strong>
                  </div>
                </div>
              </div>

              {/* Card Footer with Athlete Tag */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                <div className="flex items-center gap-2">
                  <img
                    src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                    alt={currentUser.name}
                    className="w-5 h-5 rounded-full object-cover border border-emerald-400"
                  />
                  <span className="font-bold text-white truncate max-w-[100px]">{currentUser.name}</span>
                </div>
                <span className="text-emerald-400 font-black">#GoTeamClub</span>
              </div>
            </div>
          </div>

          <div className="pt-3 space-y-2">
            <button
              onClick={handleShareStory}
              id="btn-share-instagram-story"
              className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copiedLink ? 'Copiado para Compartilhar!' : 'Compartilhar nos Stories / WhatsApp'}</span>
            </button>
            <button
              onClick={() => {
                handleTriggerCelebration();
                alert('Card preparado para salvamento nos seus arquivos!');
              }}
              className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Baixar Imagem PNG</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
