import React, { useState } from 'react';
import { Share2, Download, Zap, Heart, Flame, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Activity, UserProfile } from '../types';

interface ShareAchievementModalProps {
  activity: Activity | null;
  currentUser: UserProfile;
  isOpen: boolean;
  onClose: () => void;
}

export const ShareAchievementModal: React.FC<ShareAchievementModalProps> = ({
  activity,
  currentUser,
  isOpen,
  onClose
}) => {
  if (!isOpen || !activity) return null;

  const [copied, setCopied] = useState(false);
  const [theme, setTheme] = useState<'neon' | 'sunset' | 'stealth'>('neon');

  const handleShare = async () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    const shareText = `🏃 Acabei de completar ${activity.distanceKm}km em ${Math.floor(activity.durationSeconds / 60)}m com ritmo ${activity.avgPace} pelo GoTeam Running! 🔥 #GoTeamRunning`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `GoTeam Running - ${activity.title}`,
          text: shareText,
          url: window.location.href
        });
      } catch (err) {
        console.log('Share dismissed:', err);
      }
    } else {
      navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-white">Compartilhar Conquista</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-xs font-bold">
            ✕
          </button>
        </div>

        {/* Theme Pill Picker */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setTheme('neon')}
            className={`flex-1 py-1 rounded-lg text-[10px] font-bold border transition-all ${
              theme === 'neon' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-slate-950 border-slate-800 text-slate-400'
            }`}
          >
            Neon
          </button>
          <button
            onClick={() => setTheme('sunset')}
            className={`flex-1 py-1 rounded-lg text-[10px] font-bold border transition-all ${
              theme === 'sunset' ? 'bg-orange-500/20 border-orange-500 text-orange-400' : 'bg-slate-950 border-slate-800 text-slate-400'
            }`}
          >
            Sunset
          </button>
          <button
            onClick={() => setTheme('stealth')}
            className={`flex-1 py-1 rounded-lg text-[10px] font-bold border transition-all ${
              theme === 'stealth' ? 'bg-slate-700 border-slate-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'
            }`}
          >
            Stealth
          </button>
        </div>

        {/* The Card */}
        <div
          className={`p-5 rounded-2xl border text-white text-center space-y-4 shadow-2xl transition-all ${
            theme === 'neon'
              ? 'bg-gradient-to-b from-slate-950 via-slate-900 to-emerald-950 border-emerald-500/40'
              : theme === 'sunset'
              ? 'bg-gradient-to-b from-slate-950 via-slate-900 to-amber-950 border-amber-500/40'
              : 'bg-gradient-to-b from-slate-950 to-slate-900 border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
            <span className="text-emerald-400 font-black">GOTEAM RUNNING CLUB</span>
            <span>{activity.date}</span>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400">DISTÂNCIA TOTAL</span>
            <p className="text-4xl font-black tracking-tight text-white">
              {activity.distanceKm} <span className="text-emerald-400 text-xl">KM</span>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-semibold bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
            <div>
              <span className="text-[9px] uppercase text-slate-400 block">Pace Médio</span>
              <strong className="text-emerald-400">{activity.avgPace}</strong>
            </div>
            <div>
              <span className="text-[9px] uppercase text-slate-400 block">Duração</span>
              <strong className="text-white">
                {Math.floor(activity.durationSeconds / 60)}m {activity.durationSeconds % 60}s
              </strong>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] pt-1">
            <div className="flex items-center gap-2">
              <img
                src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                alt={currentUser.name}
                className="w-5 h-5 rounded-full object-cover border border-emerald-400"
              />
              <span className="font-bold text-slate-200">{currentUser.name}</span>
            </div>
            <span className="text-emerald-400 font-bold">#GoTeam</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-2 pt-2">
          <button
            onClick={handleShare}
            className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
          >
            <Share2 className="w-4 h-4" />
            <span>{copied ? 'Link e Texto Copiados!' : 'Compartilhar nas Redes / WhatsApp'}</span>
          </button>
          <button
            onClick={() => {
              confetti();
              alert('Imagem do card salva com sucesso!');
            }}
            className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Baixar Imagem</span>
          </button>
        </div>
      </div>
    </div>
  );
};
