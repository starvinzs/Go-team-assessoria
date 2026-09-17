import React, { useState } from 'react';
import {
  Activity as ActivityIcon,
  Flame,
  TrendingUp,
  Award,
  Play,
  CheckCircle2,
  Settings2,
  Calendar,
  Zap,
  Share2,
  Watch,
  Heart,
  ChevronRight,
  Sparkles,
  RefreshCw,
  Gauge
} from 'lucide-react';
import {
  UserProfile,
  Activity,
  TeamTask,
  TrainingPlan,
  WorkoutSession,
  DashboardWidgetConfig,
  RaceDestination
} from '../types';
import { audioCoach } from '../utils/audioMetronome';
import { DEFAULT_DASHBOARD_WIDGETS } from '../data/initialTeam';

interface DashboardViewProps {
  currentUser: UserProfile;
  activePlan: TrainingPlan;
  todayWorkout?: WorkoutSession | null;
  activities?: Activity[];
  tasks?: TeamTask[];
  onStartLiveWorkout: (workout: WorkoutSession) => void;
  onOpenLogRun: () => void;
  onOpenShareModal?: (activity: Activity) => void;
  onToggleTask: (taskId: string) => void;
  onGiveKudo: (activityId: string) => void;
  onOpenAdaptationModal?: () => void;
  targetRace?: RaceDestination | null;
  onNavigateToTab?: (tab: string) => void;
  onNavigateTab?: (tab: string) => void;
  widgetConfigs?: DashboardWidgetConfig[];
  onUpdateWidgetConfigs?: (configs: DashboardWidgetConfig[]) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentUser,
  activePlan,
  todayWorkout,
  activities = [],
  tasks = [],
  onStartLiveWorkout,
  onOpenLogRun,
  onOpenShareModal,
  onToggleTask,
  onGiveKudo,
  onOpenAdaptationModal,
  targetRace,
  onNavigateToTab,
  onNavigateTab,
  widgetConfigs = DEFAULT_DASHBOARD_WIDGETS,
  onUpdateWidgetConfigs
}) => {
  const [isMetronomeActive, setIsMetronomeActive] = useState(false);
  const [showWidgetConfig, setShowWidgetConfig] = useState(false);

  const configs = widgetConfigs && widgetConfigs.length > 0 ? widgetConfigs : DEFAULT_DASHBOARD_WIDGETS;

  const currentTodayWorkout =
    todayWorkout || activePlan?.weeks?.[0]?.workouts?.[0] || null;

  const navigateTo = (tab: string) => {
    if (onNavigateToTab) {
      onNavigateToTab(tab);
    } else if (onNavigateTab) {
      onNavigateTab(tab);
    }
  };

  const toggleCadenceBeep = () => {
    const running = audioCoach.toggleCadence(175);
    setIsMetronomeActive(running);
  };

  const weeklyProgress = Math.min(
    100,
    Math.round((currentUser.currentWeeklyKm / (currentUser.weeklyTargetKm || 1)) * 100)
  );

  const isWidgetEnabled = (widgetId: string) => {
    const w = configs.find((cfg) => cfg.id === widgetId);
    return w ? w.enabled : true;
  };

  const toggleWidget = (widgetId: string) => {
    const updated = configs.map((w) =>
      w.id === widgetId ? { ...w, enabled: !w.enabled } : w
    );
    if (onUpdateWidgetConfigs) {
      onUpdateWidgetConfigs(updated);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Hero Welcome Banner with Quick Athletic Stats */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-900 border border-slate-800 p-5 sm:p-7 shadow-xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Semana 4 • Ciclo Adaptativo Ativo</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Bora correr, <span className="text-emerald-400">{currentUser.name.split(' ')[0]}</span>! 🏃‍♂️
            </h1>
            <p className="text-slate-300 text-sm max-w-xl">
              Plano ativo: <strong className="text-white">{activePlan.title}</strong>. Mantenha a cadência alta e a hidratação em dia.
            </p>
          </div>

          {/* Quick Metrics Cards */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="px-4 py-3 rounded-2xl bg-slate-950/80 border border-slate-800 min-w-[120px]">
              <span className="text-xs text-slate-400 font-semibold block">Volume Semana</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-xl font-black text-white">{currentUser.currentWeeklyKm}</span>
                <span className="text-xs font-bold text-slate-400">/ {currentUser.weeklyTargetKm} km</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-emerald-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${weeklyProgress}%` }}
                />
              </div>
            </div>

            <div className="px-4 py-3 rounded-2xl bg-slate-950/80 border border-slate-800 min-w-[120px]">
              <span className="text-xs text-slate-400 font-semibold block">Melhor 5K</span>
              <span className="text-xl font-black text-emerald-400 mt-0.5 block">
                {currentUser.best5kTime || '22:15'}
              </span>
              <span className="text-[10px] text-slate-400 font-medium">Recorde Pessoal</span>
            </div>

            <div className="px-4 py-3 rounded-2xl bg-slate-950/80 border border-slate-800 min-w-[120px]">
              <span className="text-xs text-slate-400 font-semibold block">Melhor 10K</span>
              <span className="text-xl font-black text-teal-400 mt-0.5 block">
                {currentUser.best10kTime || '47:30'}
              </span>
              <span className="text-[10px] text-slate-400 font-medium">Recorde Pessoal</span>
            </div>
          </div>
        </div>

        {/* Dashboard Customization Bar Button */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <Flame className="w-4 h-4 text-amber-400" />
            <span>Ritmo Grupo: <strong className="text-slate-200">{currentUser.paceGroup}</strong></span>
          </div>
          <button
            onClick={() => setShowWidgetConfig(!showWidgetConfig)}
            id="btn-customize-dashboard"
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors font-medium"
          >
            <Settings2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Personalizar Widgets</span>
          </button>
        </div>

        {/* Widget Customization Drawer */}
        {showWidgetConfig && (
          <div className="mt-4 p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Ativar / Desativar Seções do Dashboard
              </span>
              <span className="text-[11px] text-slate-400">Clique para alternar a exibição</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {configs.map((w) => (
                <button
                  key={w.id}
                  onClick={() => toggleWidget(w.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold text-left border flex items-center justify-between transition-all ${
                    w.enabled
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                      : 'bg-slate-900 border-slate-800 text-slate-500 opacity-60'
                  }`}
                >
                  <span className="truncate">{w.title}</span>
                  {w.enabled && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 ml-1" />}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Grid: Workouts + Team Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Today's Workout & Adaptive Load */}
        <div className="lg:col-span-2 space-y-6">
          {/* Widget: Today's Workout */}
          {isWidgetEnabled('widget-today-workout') && (
            <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-xl relative overflow-hidden">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                      {currentTodayWorkout ? currentTodayWorkout.type : 'Treino Programado'}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                      <Calendar className="w-3.5 h-3.5" />
                      Hoje ({currentTodayWorkout?.dayOfWeek || 'Hoje'})
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white">
                    {currentTodayWorkout ? currentTodayWorkout.title : 'Tiros VO2Max: 8x 400m'}
                  </h2>
                </div>

                <div className="text-right">
                  <span className="text-2xl sm:text-3xl font-black text-white">
                    {currentTodayWorkout ? currentTodayWorkout.distanceKm : '6.2'} <span className="text-sm font-semibold text-slate-400">km</span>
                  </span>
                  <p className="text-xs text-emerald-400 font-semibold mt-0.5">
                    Alvo: {currentTodayWorkout ? currentTodayWorkout.targetPace : '4:00 - 4:15 min/km'}
                  </p>
                </div>
              </div>

              {/* Workout Description & Step Breakdown */}
              <p className="mt-3 text-slate-300 text-sm leading-relaxed">
                {currentTodayWorkout
                  ? currentTodayWorkout.description
                  : 'Aquecimento 2km trote leve + 8 tiros de 400m no ritmo alvo com 90 seg de descanso trotando + 1.5km desaquecimento.'}
              </p>

              {/* Steps Progress List */}
              <div className="mt-4 space-y-2 bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800/80">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Estrutura da Sessão
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 font-medium block text-[10px]">1. AQUECIMENTO</span>
                    <strong className="text-white">1.5 km a 2.0 km</strong>
                    <p className="text-[11px] text-slate-400">Trote solto + educativos</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                    <span className="text-emerald-400 font-bold block text-[10px]">2. TIROS PRINCIPAIS</span>
                    <strong className="text-white">8x 400m @ Pace 4:00</strong>
                    <p className="text-[11px] text-emerald-300/80">90s intervalo ativo</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 font-medium block text-[10px]">3. DESAQUECIMENTO</span>
                    <strong className="text-white">1.2 km a 1.5 km</strong>
                    <p className="text-[11px] text-slate-400">Trote regenerativo final</p>
                  </div>
                </div>
              </div>

              {/* Interactive Audio Metronome & Start Run Buttons */}
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => currentTodayWorkout && onStartLiveWorkout(currentTodayWorkout)}
                  id="btn-start-today-workout"
                  className="flex-1 min-w-[200px] flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/25 transition-all"
                >
                  <Play className="w-4 h-4 fill-slate-950" />
                  <span>Iniciar Modo Treino ao Vivo</span>
                </button>

                <button
                  onClick={toggleCadenceBeep}
                  id="btn-cadence-metronome"
                  title="Metrônomo de áudio para manter a cadência de 175 passos/minuto"
                  className={`flex items-center gap-2 py-3 px-4 rounded-2xl border text-xs font-bold transition-all ${
                    isMetronomeActive
                      ? 'bg-amber-500/15 border-amber-500/40 text-amber-400 animate-pulse'
                      : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
                  }`}
                >
                  <Gauge className="w-4 h-4" />
                  <span>{isMetronomeActive ? 'Cadência 175 SPM (Ativa 🔊)' : 'Cadência 175 SPM (Beep)'}</span>
                </button>

                <button
                  onClick={onOpenLogRun}
                  id="btn-log-done-workout"
                  className="py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 text-xs font-bold transition-colors"
                >
                  Concluir Manualmente
                </button>
              </div>
            </div>
          )}

          {/* Widget: Adaptive Workload Card */}
          {isWidgetEnabled('widget-weekly-progress') && (
            <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Calibração Adaptativa de Carga</h3>
                    <p className="text-xs text-slate-400">Ajusta treinos futuros conforme seu esforço percebido (RPE)</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (onOpenAdaptationModal) onOpenAdaptationModal();
                    else navigateTo('treinos');
                  }}
                  id="btn-open-weekly-adaptation"
                  className="flex items-center gap-1 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Avaliar Semana</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
                  <span className="text-[11px] text-slate-400 font-semibold">STATUS DO CICLO</span>
                  <p className="text-sm font-bold text-emerald-400 mt-1">Ótima Absorção (+6%)</p>
                  <p className="text-xs text-slate-400 mt-0.5">Semana com baixo índice de fadiga muscular residual.</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
                  <span className="text-[11px] text-slate-400 font-semibold">CADÊNCIA MÉDIA</span>
                  <p className="text-sm font-bold text-white mt-1">174 spm</p>
                  <p className="text-xs text-slate-400 mt-0.5">Dentro da zona ideal de eficiência e baixo impacto articular.</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
                  <span className="text-[11px] text-slate-400 font-semibold">PROGRESSÃO DE PACE</span>
                  <p className="text-sm font-bold text-teal-400 mt-1">-8 seg/km</p>
                  <p className="text-xs text-slate-400 mt-0.5">Evolução positiva em comparação às últimas 3 semanas.</p>
                </div>
              </div>
            </div>
          )}

          {/* Widget: Team Feed & Recent Runs */}
          {isWidgetEnabled('widget-recent-activities') && (
            <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <ActivityIcon className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-base font-bold text-white">Mural da Equipe & Últimas Corridas</h3>
                </div>
                <button
                  onClick={() => navigateTo('equipe')}
                  className="text-xs font-bold text-slate-400 hover:text-emerald-400 flex items-center gap-1 transition-colors"
                >
                  Ver Todos
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-3">
                {activities.slice(0, 3).map((act) => (
                  <div
                    key={act.id}
                    className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={act.userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                        alt={act.userName}
                        className="w-10 h-10 rounded-full object-cover border border-slate-700"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">{act.userName}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-semibold">
                            {act.source}
                          </span>
                          <span className="text-[10px] text-slate-400">{act.date}</span>
                        </div>
                        <p className="text-sm font-semibold text-slate-200 mt-0.5">{act.title}</p>
                        <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                          <span>Distância: <strong className="text-white">{act.distanceKm} km</strong></span>
                          <span>Pace: <strong className="text-emerald-400">{act.avgPace}</strong></span>
                          {act.avgHeartRate && (
                            <span className="flex items-center gap-1">
                              <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
                              <strong className="text-slate-200">{act.avgHeartRate} bpm</strong>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => onGiveKudo(act.id)}
                        id={`btn-kudo-${act.id}`}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                          act.kudos.includes(currentUser.id)
                            ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                            : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-emerald-400 hover:border-emerald-500/30'
                        }`}
                      >
                        <Flame className="w-3.5 h-3.5 text-amber-400" />
                        <span>{act.kudos.length} Kudos</span>
                      </button>

                      <button
                        onClick={() => onOpenShareModal && onOpenShareModal(act)}
                        id={`btn-share-activity-${act.id}`}
                        title="Compartilhar nas Redes Sociais"
                        className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right 1 Column: Team Tasks, Shoes, Wearables & Destination Race */}
        <div className="space-y-6">
          {/* Widget: Team Goal & Tasks */}
          {isWidgetEnabled('widget-team-goal') && (
            <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-400" />
                  <h3 className="text-base font-bold text-white">Tarefas & Desafios da Equipe</h3>
                </div>
                <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                  Semanal
                </span>
              </div>

              <div className="space-y-2.5">
                {tasks.map((task) => {
                  const progressPercent = Math.min(100, Math.round((task.currentValue / task.targetValue) * 100));
                  return (
                    <div
                      key={task.id}
                      className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2.5">
                          <button
                            onClick={() => onToggleTask(task.id)}
                            className="mt-0.5 text-slate-400 hover:text-emerald-400 transition-colors"
                          >
                            {task.completed ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 fill-emerald-400/20" />
                            ) : (
                              <div className="w-4 h-4 rounded-full border-2 border-slate-600 hover:border-emerald-400" />
                            )}
                          </button>
                          <div>
                            <p className={`text-xs font-bold ${task.completed ? 'line-through text-slate-400' : 'text-white'}`}>
                              {task.title}
                            </p>
                            <p className="text-[11px] text-slate-400 mt-0.5">{task.description}</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                          <span>{task.currentValue} / {task.targetValue} {task.unit}</span>
                          <span>{progressPercent}%</span>
                        </div>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              task.completed ? 'bg-emerald-400' : 'bg-gradient-to-r from-emerald-500 to-teal-400'
                            }`}
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Widget: Running Shoe Mileage Tracker */}
          {isWidgetEnabled('widget-shoes-mileage') && (
            <div className="rounded-3xl bg-slate-900 border border-slate-800 p-5 shadow-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Desgaste do Calçado
                </span>
                <span className="text-xs font-bold text-amber-400">
                  {currentUser.runningShoeKm || 340} / 600 km
                </span>
              </div>
              <h4 className="text-sm font-black text-white">{currentUser.runningShoeModel || 'Nike Vaporfly 3'}</h4>
              <div className="w-full bg-slate-800 h-2 rounded-full mt-2.5 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-amber-400 to-orange-500"
                  style={{ width: `${Math.min(100, Math.round(((currentUser.runningShoeKm || 340) / 600) * 100))}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                Ainda restam cerca de <strong>{600 - (currentUser.runningShoeKm || 340)} km</strong> de amortecimento ideal para este par.
              </p>
            </div>
          )}

          {/* Widget: Target Race Countdown */}
          {isWidgetEnabled('widget-next-race') && (
            <div className="rounded-3xl bg-gradient-to-br from-slate-900 to-emerald-950/40 border border-emerald-500/20 p-5 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Próximo Desafio no Calendário
                </span>
                <span className="text-lg">
                  {targetRace ? targetRace.flag : '🇪🇸'}
                </span>
              </div>
              <div>
                <h4 className="text-base font-black text-white">
                  {targetRace ? targetRace.name : '10K Valencia Ibercaja'}
                </h4>
                <p className="text-xs text-slate-300 mt-0.5">
                  {targetRace ? `${targetRace.city}, ${targetRace.country}` : 'Valência, Espanha'} • {targetRace ? targetRace.dateString : 'Janeiro'}
                </p>
              </div>
              <p className="text-xs text-emerald-300/80 italic">
                {targetRace ? targetRace.highlight : 'Percurso plano ideal para cravar seu recorde pessoal de 10k!'}
              </p>
              <button
                onClick={() => navigateTo('viagens')}
                id="btn-view-race-map-dash"
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Explorar Guia & Mapa de Viagens</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Widget: Wearable Connection Quick Status */}
          {isWidgetEnabled('widget-wearables-status') && (
            <div className="rounded-3xl bg-slate-900 border border-slate-800 p-5 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Watch className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-white">Dispositivos Esportivos</span>
                </div>
                <button
                  onClick={() => navigateTo('wearables')}
                  className="text-xs text-emerald-400 font-bold hover:underline"
                >
                  Conectar
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <span className="font-semibold text-slate-300">Strava</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400" title="Conectado" />
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <span className="font-semibold text-slate-300">Garmin</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400" title="Conectado" />
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <span className="font-semibold text-slate-300">Apple Health</span>
                  <span className="w-2 h-2 rounded-full bg-slate-600" title="Desconectado" />
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <span className="font-semibold text-slate-300">Coros / Polar</span>
                  <span className="w-2 h-2 rounded-full bg-slate-600" title="Desconectado" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
