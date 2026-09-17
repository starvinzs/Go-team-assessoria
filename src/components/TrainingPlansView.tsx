import React, { useState } from 'react';
import {
  CalendarCheck,
  Zap,
  TrendingUp,
  Play,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
  Plus,
  Sliders,
  Timer
} from 'lucide-react';
import { TrainingPlan, WorkoutSession, UserProfile } from '../types';
import { INITIAL_TRAINING_PLANS, adaptTrainingPlan } from '../data/trainingPlans';
import { audioCoach } from '../utils/audioMetronome';

interface TrainingPlansViewProps {
  currentUser: UserProfile;
  activePlan: TrainingPlan;
  onSelectPlan: (plan: TrainingPlan) => void;
  onStartLiveWorkout: (workout: WorkoutSession) => void;
  onOpenLogRun: () => void;
}

export const TrainingPlansView: React.FC<TrainingPlansViewProps> = ({
  currentUser,
  activePlan,
  onSelectPlan,
  onStartLiveWorkout,
  onOpenLogRun
}) => {
  const [plans, setPlans] = useState<TrainingPlan[]>(INITIAL_TRAINING_PLANS);
  const [selectedDistance, setSelectedDistance] = useState<'5km' | '10km'>('5km');
  const [selectedLevel, setSelectedLevel] = useState<'iniciante' | 'performance'>('iniciante');
  const [selectedWeek, setSelectedWeek] = useState<number>(1);
  const [isMetronomePlaying, setIsMetronomePlaying] = useState<boolean>(false);
  const [targetSpm, setTargetSpm] = useState<number>(175);

  // Adaptive Feedback State
  const [showAdaptiveModal, setShowAdaptiveModal] = useState<boolean>(false);
  const [rpeEffort, setRpeEffort] = useState<number>(7);
  const [feeling, setFeeling] = useState<'facil' | 'ideal' | 'pesado' | 'dor'>('ideal');
  const [completionRatio, setCompletionRatio] = useState<number>(1.0);
  const [adaptationMessage, setAdaptationMessage] = useState<string | null>(null);

  // Pace Calculator State
  const [calcDistance, setCalcDistance] = useState<'5' | '10'>('5');
  const [targetTimeMinutes, setTargetTimeMinutes] = useState<number>(24);
  const [targetTimeSeconds, setTargetTimeSeconds] = useState<number>(30);

  const filteredPlans = plans.filter(
    (p) => p.targetDistance === selectedDistance && (selectedLevel === 'iniciante' ? p.level === 'iniciante' || p.level === 'intermediario' : p.level === 'performance')
  );

  const currentPlan = (plans && plans.find((p) => p.id === activePlan?.id)) || filteredPlans[0] || (plans && plans[0]);
  const activeWeekData = currentPlan?.weeks?.find((w) => w.weekNumber === selectedWeek) || currentPlan?.weeks?.[0] || {
    weekNumber: 1,
    targetKm: 20,
    focus: 'Adaptação Inicial',
    workouts: []
  };

  const handleToggleCadence = () => {
    const running = audioCoach.toggleCadence(targetSpm);
    setIsMetronomePlaying(running);
  };

  const handleSpmChange = (spm: number) => {
    setTargetSpm(spm);
    if (isMetronomePlaying) {
      audioCoach.startCadenceMetronome(spm);
    }
  };

  // Run Adaptive Engine
  const handleApplyAdaptation = () => {
    const { adaptedPlan, adaptationSummary } = adaptTrainingPlan(currentPlan, {
      rpeEffort,
      completedWorkoutsRatio: completionRatio,
      feeling,
      currentAvgPaceSeconds: 300
    });

    setPlans((prev) => prev.map((p) => (p.id === adaptedPlan.id ? adaptedPlan : p)));
    onSelectPlan(adaptedPlan);
    setAdaptationMessage(adaptationSummary);
    setShowAdaptiveModal(false);
  };

  // Calculate Pace and Zones
  const totalSeconds = targetTimeMinutes * 60 + targetTimeSeconds;
  const distNum = Number(calcDistance);
  const paceSecondsPerKm = Math.round(totalSeconds / distNum);
  const paceMin = Math.floor(paceSecondsPerKm / 60);
  const paceSec = paceSecondsPerKm % 60;
  const formattedPace = `${paceMin}:${paceSec < 10 ? '0' : ''}${paceSec} min/km`;
  const lap400m = Math.round((paceSecondsPerKm / 1000) * 400);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Header & Distance/Level Selectors */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Zap className="w-4 h-4" />
            <span>Planilhas de Treino Periodizadas</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Treinos Inteligentes para 5km & 10km
          </h1>
          <p className="text-slate-400 text-sm">
            Metodologia baseada em intervalados de VO2Max, limiar de lactato e adaptação individual contínua.
          </p>
        </div>

        {/* Action: Open Weekly Calibration */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAdaptiveModal(true)}
            id="btn-open-adaptive-modal"
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-emerald-500/20 hover:opacity-95 active:scale-95 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Adaptar Carga Semanal</span>
          </button>
        </div>
      </div>

      {/* Adaptation Notification Banner if recently calibrated */}
      {adaptationMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-start gap-3 text-xs animate-in fade-in">
          <Sparkles className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <strong className="font-bold text-white block">Adaptação Semanal Concluída com Sucesso:</strong>
            <span>{adaptationMessage}</span>
          </div>
          <button
            onClick={() => setAdaptationMessage(null)}
            className="text-slate-400 hover:text-white text-xs font-bold"
          >
            Fechar
          </button>
        </div>
      )}

      {/* Target Distance & Profile Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-2 bg-slate-900 border border-slate-800 rounded-2xl">
        {/* 5k vs 10k Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800/80">
          <button
            onClick={() => setSelectedDistance('5km')}
            id="tab-select-5km"
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              selectedDistance === '5km'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Distância 5 km
          </button>
          <button
            onClick={() => setSelectedDistance('10km')}
            id="tab-select-10km"
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              selectedDistance === '10km'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Distância 10 km
          </button>
        </div>

        {/* Level Switcher: Iniciante vs Melhora de Tempo / Performance */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800/80">
          <button
            onClick={() => setSelectedLevel('iniciante')}
            id="tab-level-iniciante"
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedLevel === 'iniciante'
                ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Iniciante (Do Zero / Sem Parar)
          </button>
          <button
            onClick={() => setSelectedLevel('performance')}
            id="tab-level-performance"
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedLevel === 'performance'
                ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Performance (Melhorar Tempos / Sub-25 / Sub-50)
          </button>
        </div>
      </div>

      {/* Available Plans for Selected Filter */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPlans.map((plan) => {
          const isCurrent = currentPlan.id === plan.id;
          return (
            <div
              key={plan.id}
              onClick={() => onSelectPlan(plan)}
              className={`p-5 rounded-3xl border cursor-pointer transition-all ${
                isCurrent
                  ? 'bg-slate-900 border-emerald-500/40 shadow-xl shadow-emerald-500/10 ring-1 ring-emerald-500/40'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {plan.targetDistance} • {plan.level}
                    </span>
                    {isCurrent && (
                      <span className="text-[10px] font-bold text-slate-300 bg-emerald-600/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        Plano Selecionado
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-white">{plan.title}</h3>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 font-semibold block">{plan.durationWeeks} semanas</span>
                  <span className="text-[11px] text-emerald-400 font-bold">{plan.recommendedDaysPerWeek}x / semana</span>
                </div>
              </div>

              <p className="mt-3 text-xs text-slate-300 leading-relaxed">{plan.description}</p>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">
                  Ritmo Alvo Médio: <strong className="text-white">{plan.targetPaceGoal}</strong>
                </span>
                <span className="text-emerald-400 font-bold hover:underline">Ver Treinos &gt;</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Week Selector Bar */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Cronograma por Semanas ({currentPlan.title})
          </span>
          <span className="text-xs font-bold text-emerald-400">
            Volume Semanal Previsto: {activeWeekData.targetKm} km
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {(currentPlan?.weeks || []).map((w) => (
            <button
              key={w.weekNumber}
              onClick={() => setSelectedWeek(w.weekNumber)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border ${
                selectedWeek === w.weekNumber
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              Semana {w.weekNumber} ({w.targetKm} km)
            </button>
          ))}
        </div>
      </div>

      {/* Detailed Workouts for Selected Week */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-white">
              Semana {activeWeekData?.weekNumber || 1}: {activeWeekData?.focus || 'Treino'}
            </h3>
            <p className="text-xs text-slate-400">
              Carga total planejada: <strong>{activeWeekData?.targetKm || 0} km</strong> divididos em {(activeWeekData?.workouts || []).length} sessões.
            </p>
          </div>
          {activeWeekData?.adaptationFeedback && (
            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 font-bold border border-emerald-500/30">
              {activeWeekData.adaptationFeedback === 'aumentar' ? 'Carga +6% Aplicada' : 'Carga Ajustada'}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(activeWeekData?.workouts || []).map((workout) => (
            <div
              key={workout.id}
              className="p-5 rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px] font-bold uppercase">
                    {workout.dayOfWeek} • {workout.type}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    workout.intensity === 'Alto'
                      ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                      : workout.intensity === 'Moderado'
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  }`}>
                    {workout.intensity}
                  </span>
                </div>

                <h4 className="text-base font-black text-white">{workout.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{workout.description}</p>
              </div>

              {/* Workout Target Numbers */}
              <div className="pt-3 border-t border-slate-800/80 space-y-2.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-400">Distância Total:</span>
                  <span className="text-white font-black">{workout.distanceKm} km</span>
                </div>
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-400">Ritmo Alvo:</span>
                  <span className="text-emerald-400 font-bold">{workout.targetPace}</span>
                </div>
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-400">Duração Aprox:</span>
                  <span className="text-slate-300">{workout.estimatedDurationMin} min</span>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={() => onStartLiveWorkout(workout)}
                    id={`btn-live-session-${workout.id}`}
                    className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Play className="w-3.5 h-3.5 fill-slate-950" />
                    <span>Treinar Agora</span>
                  </button>
                  <button
                    onClick={onOpenLogRun}
                    title="Concluir manualmente"
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Tool: Cadence Metronome & Pace Zone Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
        {/* Metrônomo de Cadência com Áudio Real */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Sliders className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Metrônomo de Cadência em Tempo Real</h4>
                <p className="text-xs text-slate-400">Treine com 170 a 180 passos por minuto para evitar lesões</p>
              </div>
            </div>
            <button
              onClick={handleToggleCadence}
              id="btn-cadence-toggle-large"
              className={`p-2.5 rounded-xl transition-all ${
                isMetronomePlaying
                  ? 'bg-amber-500 text-slate-950 animate-bounce'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              {isMetronomePlaying ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-400">Cadência Desejada:</span>
              <span className="text-emerald-400 text-base">{targetSpm} SPM</span>
            </div>
            <input
              type="range"
              min="150"
              max="195"
              step="1"
              value={targetSpm}
              onChange={(e) => handleSpmChange(Number(e.target.value))}
              className="w-full accent-emerald-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>150 (Trote)</span>
              <span className="text-emerald-400 font-bold">175 - 180 (Ideal Biomecânico)</span>
              <span>195 (Sprint)</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed">
            💡 <strong>Dica do Treinador:</strong> Aumentar a cadência diminui a oscilação vertical e reduz o impacto nos joelhos e tíbias em até 30%.
          </div>
        </div>

        {/* Calculadora de Pacing & Zonas de Treino */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
                <Timer className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Calculadora de Ritmo & Zonas Alvo</h4>
                <p className="text-xs text-slate-400">Descubra o pace exato para atingir sua meta de prova</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-[10px] text-slate-400 font-semibold block mb-1">Distância</label>
              <select
                value={calcDistance}
                onChange={(e) => setCalcDistance(e.target.value as '5' | '10')}
                className="w-full p-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-bold"
              >
                <option value="5">5 km</option>
                <option value="10">10 km</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] text-slate-400 font-semibold block mb-1">Minutos</label>
              <input
                type="number"
                min="14"
                max="90"
                value={targetTimeMinutes}
                onChange={(e) => setTargetTimeMinutes(Number(e.target.value))}
                className="w-full p-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-bold"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 font-semibold block mb-1">Segundos</label>
              <input
                type="number"
                min="0"
                max="59"
                value={targetTimeSeconds}
                onChange={(e) => setTargetTimeSeconds(Number(e.target.value))}
                className="w-full p-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-bold"
              />
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase">Ritmo Médio Necessário</span>
              <p className="text-xl font-black text-emerald-400">{formattedPace}</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Volta de 400m (Pista)</span>
              <p className="text-base font-black text-white">{Math.floor(lap400m / 60)}m {lap400m % 60}s</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Weekly Adaptive Load Calibration */}
      {showAdaptiveModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                <h3 className="text-lg font-black text-white">Calibrar Carga da Semana</h3>
              </div>
              <button
                onClick={() => setShowAdaptiveModal(false)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300">
              O motor adaptativo analisa como seu corpo respondeu aos treinos desta semana e recalcula os volumes e ritmos das próximas semanas automaticamente.
            </p>

            {/* 1. RPE Effort */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-300">Percepção Subjetiva de Esforço (RPE):</span>
                <span className="text-emerald-400 text-sm font-black">{rpeEffort} / 10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={rpeEffort}
                onChange={(e) => setRpeEffort(Number(e.target.value))}
                className="w-full accent-emerald-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                <span>1 - Muito Leve</span>
                <span>5 - Moderado</span>
                <span>10 - Exaustão Extrema</span>
              </div>
            </div>

            {/* 2. Feeling Radio */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 block">Como suas pernas e respiração se sentiram?</label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setFeeling('facil')}
                  className={`p-3 rounded-xl border font-bold text-left transition-all ${
                    feeling === 'facil'
                      ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  ⚡ Muito Fácil
                  <span className="block text-[10px] font-normal text-slate-400 mt-0.5">Absorvi sem cansaço</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFeeling('ideal')}
                  className={`p-3 rounded-xl border font-bold text-left transition-all ${
                    feeling === 'ideal'
                      ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  🎯 Na Medida Certa
                  <span className="block text-[10px] font-normal text-slate-400 mt-0.5">Cansaço normal e recuperado</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFeeling('pesado')}
                  className={`p-3 rounded-xl border font-bold text-left transition-all ${
                    feeling === 'pesado'
                      ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  🥵 Bastante Pesado
                  <span className="block text-[10px] font-normal text-slate-400 mt-0.5">Dificuldade para fechar o pace</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFeeling('dor')}
                  className={`p-3 rounded-xl border font-bold text-left transition-all ${
                    feeling === 'dor'
                      ? 'bg-rose-500/20 border-rose-500/50 text-rose-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  ⚠️ Dor Articular / Lesão
                  <span className="block text-[10px] font-normal text-slate-400 mt-0.5">Necessidade de deload seguro</span>
                </button>
              </div>
            </div>

            {/* 3. Completed workouts ratio */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 block">Conseguiu fazer todos os treinos?</label>
              <select
                value={completionRatio}
                onChange={(e) => setCompletionRatio(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-semibold"
              >
                <option value={1.0}>100% dos treinos concluídos</option>
                <option value={0.75}>Fiz 3 de 4 treinos (75%)</option>
                <option value={0.5}>Fiz metade dos treinos (50%)</option>
                <option value={0.25}>Pulei quase todos devido à rotina/cansaço</option>
              </select>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowAdaptiveModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleApplyAdaptation}
                id="btn-confirm-apply-adaptation"
                className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black transition-all shadow-lg shadow-emerald-500/20"
              >
                Recalcular Carga Inteligente
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
