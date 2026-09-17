import React from 'react';
import { AchievementBadge } from '../utils/achievements';
import confetti from 'canvas-confetti';

interface AchievementDetailModalProps {
  badge: AchievementBadge | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AchievementDetailModal: React.FC<AchievementDetailModalProps> = ({
  badge,
  isOpen,
  onClose
}) => {
  if (!isOpen || !badge) return null;

  const handleShare = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    const shareText = `🏃 Acabei de desbloquear a medalha "${badge.title}" na assessoria de corrida Go Team! ${badge.icon} Rumo aos próximos recordes pessoais!`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      alert('Texto da conquista copiado para sua área de transferência! Compartilhe com os amigos no WhatsApp ou Instagram!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="w-full max-w-sm rounded-3xl bg-[#082830] text-white border border-white/15 p-6 shadow-2xl space-y-5 text-center my-auto">
        {/* Medal Icon Glow */}
        <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-[#c6f43a]/20 blur-xl animate-pulse" />
          <div className={`relative w-20 h-20 rounded-2xl flex items-center justify-center text-4xl shadow-glow ${
            badge.unlocked
              ? 'bg-[#c6f43a] text-[#0d3b45] border-2 border-white'
              : 'bg-white/10 text-white/40 border border-white/15'
          }`}>
            {badge.icon}
          </div>
        </div>

        {/* Title & Desc */}
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-white/10 text-white/70">
            Medalha de {badge.category}
          </span>
          <h3 className="text-2xl font-display font-black text-white uppercase mt-2">
            {badge.title}
          </h3>
          <p className="text-xs text-white/80 mt-1 leading-relaxed">
            {badge.description}
          </p>
        </div>

        {/* Progress Bar & Status */}
        <div className="bg-white/5 rounded-2xl p-4 border border-white/10 text-left space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-white/60">Status:</span>
            <span className={`font-bold ${badge.unlocked ? 'text-[#c6f43a]' : 'text-white/80'}`}>
              {badge.unlocked ? '✓ Desbloqueada' : `${badge.progressPercent}% Concluído`}
            </span>
          </div>

          <div className="bg-white/10 rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                badge.unlocked ? 'bg-[#c6f43a]' : 'bg-[#a5cf2a]/80'
              }`}
              style={{ width: `${badge.progressPercent}%` }}
            />
          </div>

          <div className="flex justify-between items-center text-[11px] text-white/50 pt-0.5">
            <span>Atual: <strong className="text-white">{badge.currentValue}</strong></span>
            <span>Meta: <strong className="text-white">{badge.targetValue}</strong></span>
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-2 pt-1">
          {badge.unlocked ? (
            <button
              onClick={handleShare}
              className="w-full py-3 rounded-full bg-[#c6f43a] text-[#0d3b45] font-black text-xs shadow-glow hover:scale-105 active:scale-95 transition cursor-pointer"
            >
              🎉 Compartilhar Conquista
            </button>
          ) : (
            <button
              onClick={onClose}
              className="w-full py-3 rounded-full bg-white/10 text-white font-bold text-xs hover:bg-white/20 transition cursor-pointer"
            >
              Bora Treinar para Conquistar!
            </button>
          )}

          <button
            onClick={onClose}
            className="w-full py-2 text-xs font-semibold text-white/60 hover:text-white transition cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
