// System of medals, badges and athletic milestones for Go Team Running

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'distancia' | 'constancia' | 'velocidade' | 'dedicacao';
  unlocked: boolean;
  unlockedDate?: string;
  progressPercent: number;
  currentValue: string;
  targetValue: string;
}

export const computeAchievements = (
  activities: { distancia: number; pace: string; data: string }[],
  streak: number,
  currentPlanId: string,
  completedDatesCount: number
): AchievementBadge[] => {
  // 1. Estreia 5K
  const has5K = activities.some(a => a.distancia >= 5.0);
  const maxDist = activities.length > 0 ? Math.max(...activities.map(a => a.distancia)) : 0;

  // 2. Primeiro Longão de 10K
  const has10K = activities.some(a => a.distancia >= 10.0);

  // 3. Meio Maratonista 21K
  const has21K = activities.some(a => a.distancia >= 21.0);

  // 4. Rei da Constância (Streak >= 7)
  const streak7 = streak >= 7;

  // 5. Pace Voador (< 5:00 min/km em qualquer corrida >= 3km)
  const hasFastPace = activities.some(a => {
    if (a.distancia < 3) return false;
    const parts = a.pace.replace(' min/km', '').split(':');
    if (parts.length >= 2) {
      const min = parseInt(parts[0], 10);
      const sec = parseInt(parts[1], 10);
      return min < 5 || (min === 5 && sec === 0);
    }
    return false;
  });

  // 6. 3 Semanas Sem Falhas (>= 12 treinos completados)
  const totalCompleted = completedDatesCount;
  const threeWeeksConsistency = totalCompleted >= 12;

  // 7. Guerreiro da Madrugada
  const morningWarrior = activities.length >= 3;

  // 8. Evolução Go Team (Plan 10K or 21K)
  const evolvedPlan = currentPlanId === '10K' || currentPlanId === '21K';

  return [
    {
      id: 'badge-5k',
      title: 'Estreia nos 5K',
      description: 'Complete sua primeira corrida oficial ou treino de 5 km sem parar.',
      icon: '🏅',
      category: 'distancia',
      unlocked: has5K,
      unlockedDate: has5K ? 'Conquistado' : undefined,
      progressPercent: Math.min(100, Math.round((maxDist / 5) * 100)),
      currentValue: `${maxDist.toFixed(1)} km`,
      targetValue: '5.0 km'
    },
    {
      id: 'badge-10k',
      title: 'Primeiro Longão de 10K',
      description: 'Dobre a distância e cruze a barreira dos dois dígitos com consistência.',
      icon: '🥇',
      category: 'distancia',
      unlocked: has10K,
      unlockedDate: has10K ? 'Conquistado' : undefined,
      progressPercent: Math.min(100, Math.round((maxDist / 10) * 100)),
      currentValue: `${maxDist.toFixed(1)} km`,
      targetValue: '10.0 km'
    },
    {
      id: 'badge-streak',
      title: 'Rei da Constância',
      description: 'Mantenha a sequência de treinos ativa por 7 dias seguidos.',
      icon: '🔥',
      category: 'constancia',
      unlocked: streak7,
      unlockedDate: streak7 ? `${streak} dias ativos` : undefined,
      progressPercent: Math.min(100, Math.round((streak / 7) * 100)),
      currentValue: `${streak} dias`,
      targetValue: '7 dias'
    },
    {
      id: 'badge-pace',
      title: 'Pace Voador',
      description: 'Feche qualquer treino de 3 km ou mais com ritmo abaixo de 5:00 min/km.',
      icon: '⚡',
      category: 'velocidade',
      unlocked: hasFastPace,
      unlockedDate: hasFastPace ? 'Sub-5 min/km' : undefined,
      progressPercent: hasFastPace ? 100 : 75,
      currentValue: hasFastPace ? 'Ritmo batido' : 'Em busca',
      targetValue: '< 5:00 min/km'
    },
    {
      id: 'badge-3weeks',
      title: '3 Semanas Sem Falhas',
      description: 'Complete ao menos 12 sessões da sua planilha com disciplina impecável.',
      icon: '🛡️',
      category: 'dedicacao',
      unlocked: threeWeeksConsistency,
      unlockedDate: threeWeeksConsistency ? 'Disciplina máxima' : undefined,
      progressPercent: Math.min(100, Math.round((totalCompleted / 12) * 100)),
      currentValue: `${totalCompleted} treinos`,
      targetValue: '12 treinos'
    },
    {
      id: 'badge-madrugada',
      title: 'Guerreiro da Madrugada',
      description: 'Supere a preguiça e conclua treinos matinais antes das tarefas do dia.',
      icon: '🌅',
      category: 'dedicacao',
      unlocked: morningWarrior,
      unlockedDate: morningWarrior ? 'Foco absoluto' : undefined,
      progressPercent: Math.min(100, Math.round((activities.length / 3) * 100)),
      currentValue: `${activities.length} treinos`,
      targetValue: '3 treinos'
    },
    {
      id: 'badge-evolution',
      title: 'Evolução de Nível',
      description: 'Evolua de plano na assessoria e assuma o desafio dos 10K ou 21K.',
      icon: '🚀',
      category: 'constancia',
      unlocked: evolvedPlan,
      unlockedDate: evolvedPlan ? `Plano ${currentPlanId}` : undefined,
      progressPercent: evolvedPlan ? 100 : 50,
      currentValue: `Plano ${currentPlanId}`,
      targetValue: '10K ou 21K'
    },
    {
      id: 'badge-21k',
      title: 'Meio Maratonista',
      description: 'Conclua a lendária distância da meia maratona de 21.1 km.',
      icon: '👑',
      category: 'distancia',
      unlocked: has21K,
      unlockedDate: has21K ? 'Lenda dos 21K' : undefined,
      progressPercent: Math.min(100, Math.round((maxDist / 21.1) * 100)),
      currentValue: `${maxDist.toFixed(1)} km`,
      targetValue: '21.1 km'
    }
  ];
};
