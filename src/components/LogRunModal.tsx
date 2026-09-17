import React, { useState } from 'react';
import { PlusCircle, Activity as ActivityIcon, Heart, MapPin, Gauge } from 'lucide-react';
import { Activity, UserProfile } from '../types';

interface LogRunModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onSaveActivity: (activity: Activity) => void;
}

export const LogRunModal: React.FC<LogRunModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSaveActivity
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState('Rodagem Matinal');
  const [distanceKm, setDistanceKm] = useState<number>(5.0);
  const [minutes, setMinutes] = useState<number>(26);
  const [seconds, setSeconds] = useState<number>(30);
  const [heartRate, setHeartRate] = useState<number>(155);
  const [elevation, setElevation] = useState<number>(24);
  const [source, setSource] = useState<'GoTeam Manual' | 'Strava' | 'Garmin' | 'Apple Health'>('GoTeam Manual');
  const [notes, setNotes] = useState('');

  // Auto calculate pace
  const totalSec = minutes * 60 + seconds;
  const paceSec = distanceKm > 0 ? Math.round(totalSec / distanceKm) : 0;
  const paceMin = Math.floor(paceSec / 60);
  const paceRemSec = paceSec % 60;
  const formattedPace = `${paceMin}:${paceRemSec < 10 ? '0' : ''}${paceRemSec} min/km`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (distanceKm <= 0) return;

    const newActivity: Activity = {
      id: `act-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      title: title.trim() || 'Corrida GoTeam',
      distanceKm: Number(distanceKm),
      durationSeconds: totalSec,
      avgPace: formattedPace,
      avgHeartRate: heartRate > 0 ? heartRate : undefined,
      elevationGainMeters: elevation > 0 ? elevation : undefined,
      calories: Math.round(distanceKm * 65),
      date: 'Hoje, manual',
      source,
      notes,
      kudos: []
    };

    onSaveActivity(newActivity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-black text-white">Registrar Treino</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-xs font-bold">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Título do Treino</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Distância (km) *</label>
              <input
                type="number"
                step="0.01"
                min="0.5"
                required
                value={distanceKm}
                onChange={(e) => setDistanceKm(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Minutos</label>
              <input
                type="number"
                min="1"
                required
                value={minutes}
                onChange={(e) => setMinutes(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Segundos</label>
              <input
                type="number"
                min="0"
                max="59"
                value={seconds}
                onChange={(e) => setSeconds(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold"
              />
            </div>
          </div>

          {/* Real-time Pace Calculation Box */}
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400 font-semibold">Ritmo Calculado (Pace):</span>
            <span className="text-emerald-400 font-black text-sm">{formattedPace}</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Frequência Cardíaca (bpm)</label>
              <input
                type="number"
                min="60"
                max="220"
                value={heartRate}
                onChange={(e) => setHeartRate(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Elevação Ganha (m)</label>
              <input
                type="number"
                min="0"
                value={elevation}
                onChange={(e) => setElevation(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Fonte da Atividade</label>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value as typeof source)}
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-semibold"
            >
              <option value="GoTeam Manual">GoTeam Manual</option>
              <option value="Strava">Strava</option>
              <option value="Garmin">Garmin</option>
              <option value="Apple Health">Apple Health</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Observações & Sensações</label>
            <textarea
              rows={2}
              placeholder="Como se sentiu durante o treino?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-750"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black shadow-lg shadow-emerald-500/20"
            >
              Salvar Atividade
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
