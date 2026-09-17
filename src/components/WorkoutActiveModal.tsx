import React, { useState, useEffect } from 'react';
import { Play, Pause, Square, Volume2, VolumeX, CheckCircle2, Flame, Award, Mic, Radio, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';
import { WorkoutSession, Activity, UserProfile } from '../types';
import { audioCoach } from '../utils/audioMetronome';

interface WorkoutActiveModalProps {
  workout: WorkoutSession | null;
  currentUser: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onFinishWorkout: (activity: Activity) => void;
}

export const WorkoutActiveModal: React.FC<WorkoutActiveModalProps> = ({
  workout,
  currentUser,
  isOpen,
  onClose,
  onFinishWorkout
}) => {
  if (!isOpen || !workout) return null;

  const [isRunning, setIsRunning] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isMetronomeActive, setIsMetronomeActive] = useState(false);
  const [isAudioCoachActive, setIsAudioCoachActive] = useState(true);
  const [coachStatusMessage, setCoachStatusMessage] = useState<string>('Áudio Coach pronto em Português');

  useEffect(() => {
    let interval: number;
    if (isRunning) {
      interval = window.setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  // Voice announcement on step change
  const handleStepTransition = (newIndex: number) => {
    setCurrentStepIndex(newIndex);
    if (!workout || !workout.steps[newIndex]) return;

    const nextStep = workout.steps[newIndex];
    const desc = nextStep.description.toLowerCase();
    const type = nextStep.type.toLowerCase();

    if (isAudioCoachActive) {
      if (type.includes('tiro') || desc.includes('tiro') || desc.includes('forte') || desc.includes('aceleração')) {
        setCoachStatusMessage('Atenção: Tiro em 3, 2, 1!');
        audioCoach.coachCallout('prep_sprint');
        setTimeout(() => {
          audioCoach.coachCallout('start_sprint', `Acelere agora! Etapa ${newIndex + 1}: ${nextStep.description}`);
          setCoachStatusMessage('Tiro em andamento! Mantenha a cadência!');
        }, 3200);
      } else if (type.includes('recuperação') || desc.includes('recuper') || desc.includes('trote') || desc.includes('caminhada')) {
        setCoachStatusMessage('Recuperação ativa iniciada.');
        audioCoach.coachCallout('active_recovery');
      } else {
        setCoachStatusMessage(`Etapa ${newIndex + 1}: ${nextStep.description}`);
        audioCoach.speak(`Etapa ${newIndex + 1}: ${nextStep.description}`);
      }
    }
  };

  const toggleTimer = () => {
    if (!isRunning) {
      if (isAudioCoachActive) {
        audioCoach.coachCallout('start_warmup');
        setCoachStatusMessage('Treino iniciado! Foco na postura.');
      } else {
        audioCoach.playIntervalChime('start');
      }
      setIsRunning(true);
    } else {
      setIsRunning(false);
      if (isAudioCoachActive) {
        audioCoach.speak('Treino pausado.');
        setCoachStatusMessage('Treino pausado.');
      }
    }
  };

  const triggerManualCallout = (type: 'sprint' | 'rest' | 'final' | 'test') => {
    if (type === 'sprint') {
      setCoachStatusMessage('Comando de tiro acionado!');
      audioCoach.coachCallout('prep_sprint');
      setTimeout(() => {
        audioCoach.coachCallout('start_sprint', 'Acelere agora! Força máxima na passada!');
      }, 3000);
    } else if (type === 'rest') {
      setCoachStatusMessage('Comando de recuperação acionado.');
      audioCoach.coachCallout('active_recovery');
    } else if (type === 'final') {
      setCoachStatusMessage('Reta final! Força total!');
      audioCoach.coachCallout('final_push');
    } else if (type === 'test') {
      setCoachStatusMessage('Áudio Coach testado com sucesso!');
      audioCoach.speak('Olá atleta Go Team! Sistema de voz esportivo operando perfeitamente!');
    }
  };

  const toggleCadence = () => {
    const running = audioCoach.toggleCadence(175);
    setIsMetronomeActive(running);
  };

  const handleFinish = () => {
    audioCoach.stopCadenceMetronome();
    if (isAudioCoachActive) {
      audioCoach.coachCallout('finish_workout');
    } else {
      audioCoach.playIntervalChime('finish');
    }

    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 }
    });

    const elapsed = Math.max(secondsElapsed, workout.estimatedDurationMin * 60);
    const paceSec = Math.round(elapsed / (workout.distanceKm || 1));
    const paceMin = Math.floor(paceSec / 60);
    const paceRem = paceSec % 60;
    const avgPace = `${paceMin}:${paceRem < 10 ? '0' : ''}${paceRem} min/km`;

    const finishedActivity: Activity = {
      id: `act-live-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      title: workout.title,
      distanceKm: workout.distanceKm,
      durationSeconds: elapsed,
      avgPace,
      avgHeartRate: 162,
      elevationGainMeters: 28,
      calories: Math.round(workout.distanceKm * 68),
      date: 'Hoje, treino ao vivo',
      source: 'GoTeam Manual',
      notes: `Treino "${workout.title}" completado com sucesso via GoTeam Live Coach com Áudio e Cadência!`,
      kudos: []
    };

    onFinishWorkout(finishedActivity);
    onClose();
  };

  const formatStopwatch = (totalSec: number) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const currentStep = workout.steps[currentStepIndex] || workout.steps[0];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-lg rounded-3xl bg-[#082830] border border-white/15 p-5 sm:p-6 shadow-2xl space-y-5 my-auto text-white">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#c6f43a] animate-ping" />
            <span className="text-xs font-black uppercase tracking-wider text-[#c6f43a]">
              Go Team Live Coach
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white text-xs font-bold px-2 py-1 rounded-lg hover:bg-white/10 transition cursor-pointer"
          >
            ✕ Encerrar
          </button>
        </div>

        {/* Workout Info */}
        <div className="text-center space-y-1">
          <span className="text-[11px] text-white/60 uppercase font-semibold tracking-wider">
            {workout.type}
          </span>
          <h2 className="text-2xl sm:text-3xl font-display font-black text-white leading-tight">
            {workout.title}
          </h2>
          <p className="text-xs text-[#c6f43a] font-bold">Ritmo Alvo: {workout.targetPace}</p>
        </div>

        {/* Big Stopwatch Display */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0d3b45] border border-white/10 text-center space-y-2 shadow-inner">
          <span className="text-5xl sm:text-6xl font-black tracking-tight text-white font-mono">
            {formatStopwatch(secondsElapsed)}
          </span>
          <div className="flex justify-center items-center gap-6 text-xs text-white/70 font-semibold pt-2">
            <span>Distância: <strong className="text-white">{workout.distanceKm} km</strong></span>
            <span>Previsão: <strong className="text-white">{workout.estimatedDurationMin} min</strong></span>
          </div>
        </div>

        {/* Current Workout Step */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-white/60 uppercase text-[10px]">
              Etapa {currentStepIndex + 1} de {workout.steps.length}
            </span>
            <span className="font-bold text-[#c6f43a] uppercase text-[10px]">
              {currentStep.type}
            </span>
          </div>
          <p className="text-sm font-bold text-white leading-snug">{currentStep.description}</p>
          {currentStep.targetPace && (
            <p className="text-xs text-[#c6f43a] font-semibold">Alvo de Pace: {currentStep.targetPace}</p>
          )}

          {workout.steps.length > 1 && (
            <div className="pt-2 flex items-center gap-2">
              <button
                disabled={currentStepIndex === 0}
                onClick={() => handleStepTransition(Math.max(0, currentStepIndex - 1))}
                className="flex-1 py-1.5 rounded-xl bg-white/10 text-white/80 text-xs font-bold disabled:opacity-30 hover:bg-white/20 transition cursor-pointer"
              >
                ← Etapa Anterior
              </button>
              <button
                disabled={currentStepIndex >= workout.steps.length - 1}
                onClick={() => handleStepTransition(Math.min(workout.steps.length - 1, currentStepIndex + 1))}
                className="flex-1 py-1.5 rounded-xl bg-[#c6f43a] text-[#0d3b45] text-xs font-black disabled:opacity-30 hover:brightness-105 transition cursor-pointer"
              >
                Próxima Etapa →
              </button>
            </div>
          )}
        </div>

        {/* Áudio Coach em Português & Atalhos Rápidos de Tiros */}
        <div className="p-4 rounded-2xl bg-[#0d3b45] border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">🎙️</span>
              <div>
                <p className="text-xs font-bold text-white leading-none">Áudio Coach (Voz em Português)</p>
                <p className="text-[10px] text-white/60 mt-0.5">{coachStatusMessage}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsAudioCoachActive(!isAudioCoachActive)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
                isAudioCoachActive
                  ? 'bg-[#c6f43a] text-[#0d3b45]'
                  : 'bg-white/10 text-white/50 hover:bg-white/20'
              }`}
            >
              {isAudioCoachActive ? 'Ativo' : 'Mudo'}
            </button>
          </div>

          {/* Botões de Comando Imediato durante a corrida */}
          <div className="grid grid-cols-4 gap-1.5 pt-1">
            <button
              type="button"
              onClick={() => triggerManualCallout('sprint')}
              className="py-2 px-1 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-bold hover:bg-amber-500/30 transition text-center cursor-pointer"
              title="Avisa contagem de 3 segundos e comanda o tiro"
            >
              📢 Iniciar Tiro
            </button>
            <button
              type="button"
              onClick={() => triggerManualCallout('rest')}
              className="py-2 px-1 rounded-xl bg-blue-500/20 border border-blue-500/40 text-blue-300 text-[10px] font-bold hover:bg-blue-500/30 transition text-center cursor-pointer"
              title="Comanda recuperação ativa"
            >
              🔄 Recuperar
            </button>
            <button
              type="button"
              onClick={() => triggerManualCallout('final')}
              className="py-2 px-1 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-[10px] font-bold hover:bg-red-500/30 transition text-center cursor-pointer"
              title="Grito de reta final"
            >
              ⚡ Reta Final
            </button>
            <button
              type="button"
              onClick={() => triggerManualCallout('test')}
              className="py-2 px-1 rounded-xl bg-white/10 border border-white/15 text-white/80 text-[10px] font-bold hover:bg-white/20 transition text-center cursor-pointer"
              title="Testar voz do sintetizador"
            >
              🔊 Testar Voz
            </button>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={toggleTimer}
            className={`flex-1 py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
              isRunning
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                : 'bg-[#c6f43a] hover:brightness-105 text-[#0d3b45] shadow-glow'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5 fill-slate-950" />
                <span>Pausar</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-[#0d3b45]" />
                <span>{secondsElapsed === 0 ? 'Iniciar Sessão' : 'Retomar'}</span>
              </>
            )}
          </button>

          <button
            onClick={toggleCadence}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
              isMetronomeActive
                ? 'bg-[#c6f43a]/20 border-[#c6f43a] text-[#c6f43a] animate-pulse'
                : 'bg-white/10 text-white/70 border-white/15 hover:text-white'
            }`}
            title="Metrônomo sonoro de cadência 175 SPM"
          >
            {isMetronomeActive ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>

          <button
            onClick={handleFinish}
            className="py-3.5 px-4 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4 text-[#c6f43a]" />
            <span>Concluir</span>
          </button>
        </div>
      </div>
    </div>
  );
};

