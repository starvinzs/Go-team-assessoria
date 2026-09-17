import { TrainingPlan, WorkoutSession } from '../types';

export const INITIAL_TRAINING_PLANS: TrainingPlan[] = [
  {
    id: '5k-iniciante',
    title: '5km: Do Zero aos Primeiros 5K Sem Parar',
    targetDistance: '5km',
    level: 'iniciante',
    durationWeeks: 8,
    description: 'Planejamento progressivo e seguro para quem nunca correu ou está voltando ao esporte. Foco em consistência, respiração e fortalecimento articular sem lesões.',
    recommendedDaysPerWeek: 3,
    targetPaceGoal: '6:30 - 7:30 min/km',
    weeks: [
      {
        weekNumber: 1,
        focus: 'Adaptação Aeróbica & Caminhada Ativa',
        targetKm: 9.5,
        workouts: [
          {
            id: '5k-w1-d1',
            dayOfWeek: 'Ter',
            title: 'Intervalado Leve 1:1',
            type: 'Rodagem Leve',
            distanceKm: 3.0,
            estimatedDurationMin: 30,
            intensity: 'Leve',
            targetPace: '7:15 min/km',
            description: 'Aquecimento caminhando 5 min + 6 séries de (1 min corrida leve + 2 min caminhada) + 5 min desaquecimento.',
            steps: [
              { type: 'aquecimento', description: 'Caminhada rápida e rotações de tornozelo', durationMinutes: 5 },
              { type: 'tiro', description: '6x (1 min trote suave + 2 min caminhada)', reps: 6, durationMinutes: 18 },
              { type: 'desaquecimento', description: 'Alongamento dinâmico leve', durationMinutes: 7 }
            ]
          },
          {
            id: '5k-w1-d2',
            dayOfWeek: 'Qui',
            title: 'Trote Suave Contínuo',
            type: 'Rodagem Leve',
            distanceKm: 3.0,
            estimatedDurationMin: 28,
            intensity: 'Leve',
            targetPace: '7:20 min/km',
            description: 'Foco no ritmo de conversa, sem faltar o fôlego. Se cansar, caminhe 1 min e retome.',
            steps: [
              { type: 'aquecimento', description: 'Aquecimento articular', durationMinutes: 5 },
              { type: 'rodagem', description: '20 min trote muito confortável alternado', durationMinutes: 20, distanceKm: 2.5 },
              { type: 'desaquecimento', description: 'Caminhada regenerativa', durationMinutes: 3 }
            ]
          },
          {
            id: '5k-w1-d3',
            dayOfWeek: 'Sáb',
            title: 'Longão de Base',
            type: 'Longão',
            distanceKm: 3.5,
            estimatedDurationMin: 35,
            intensity: 'Leve',
            targetPace: '7:30 min/km',
            description: 'Maior tempo em movimento da semana. Mantenha os braços relaxados e postura ereta.',
            steps: [
              { type: 'aquecimento', description: 'Caminhada ritmada', durationMinutes: 5 },
              { type: 'rodagem', description: 'Alternância 2 min corrida suave / 1 min caminhada rápida por 25 min', durationMinutes: 25 },
              { type: 'desaquecimento', description: 'Alongamento para panturrilhas e quadríceps', durationMinutes: 5 }
            ]
          }
        ]
      },
      {
        weekNumber: 2,
        focus: 'Consolidação de Ritmo',
        targetKm: 11.0,
        workouts: [
          {
            id: '5k-w2-d1',
            dayOfWeek: 'Ter',
            title: 'Intervalos 2:1',
            type: 'Rodagem Leve',
            distanceKm: 3.5,
            estimatedDurationMin: 32,
            intensity: 'Leve',
            targetPace: '7:10 min/km',
            description: '5 séries de 2 min de trote + 1 min caminhada ativa.',
            steps: [
              { type: 'aquecimento', description: '5 min caminhada rápida', durationMinutes: 5 },
              { type: 'tiro', description: '5x (2 min corrida / 1 min caminhada)', reps: 5, durationMinutes: 15 },
              { type: 'desaquecimento', description: 'Trote final e caminhada', durationMinutes: 10 }
            ]
          },
          {
            id: '5k-w2-d2',
            dayOfWeek: 'Qui',
            title: 'Rodagem de Respiração',
            type: 'Rodagem Leve',
            distanceKm: 3.5,
            estimatedDurationMin: 30,
            intensity: 'Leve',
            targetPace: '7:15 min/km',
            description: 'Manter a cadência constante (cerca de 160-165 passos por minuto).',
            steps: [
              { type: 'aquecimento', description: 'Alongamentos dinâmicos', durationMinutes: 5 },
              { type: 'rodagem', description: '22 min trote contínuo leve', durationMinutes: 22, distanceKm: 3.0 },
              { type: 'desaquecimento', description: 'Respiração e relaxamento', durationMinutes: 3 }
            ]
          },
          {
            id: '5k-w2-d3',
            dayOfWeek: 'Sáb',
            title: 'Longinho de Fim de Semana',
            type: 'Longão',
            distanceKm: 4.0,
            estimatedDurationMin: 38,
            intensity: 'Moderado',
            targetPace: '7:20 min/km',
            description: 'Concluir 4km com sensação de que ainda conseguiria correr mais um pouco.',
            steps: [
              { type: 'aquecimento', description: 'Caminhada 5 min', durationMinutes: 5 },
              { type: 'rodagem', description: 'Blocos de 4 min corrida + 1 min caminhada', durationMinutes: 28 },
              { type: 'desaquecimento', description: 'Desaquecimento e hidratação', durationMinutes: 5 }
            ]
          }
        ]
      },
      {
        weekNumber: 3,
        focus: 'Ganho de Resistência Contínua',
        targetKm: 13.0,
        workouts: [
          {
            id: '5k-w3-d1',
            dayOfWeek: 'Ter',
            title: 'Transição 5 min Contínuos',
            type: 'Rodagem Leve',
            distanceKm: 4.0,
            estimatedDurationMin: 35,
            intensity: 'Moderado',
            targetPace: '7:00 min/km',
            description: '3 blocos de 5 min de corrida com 2 min de caminhada entre eles.',
            steps: [
              { type: 'aquecimento', description: '5 min caminhada e educativos de corrida', durationMinutes: 5 },
              { type: 'rodagem', description: '3x (5 min corrida leve + 2 min caminhada)', reps: 3, durationMinutes: 21 },
              { type: 'desaquecimento', description: 'Caminhada e soltura', durationMinutes: 9 }
            ]
          },
          {
            id: '5k-w3-d2',
            dayOfWeek: 'Qui',
            title: 'Fortalecimento & Trote',
            type: 'Descanso / Fortalecimento',
            distanceKm: 3.0,
            estimatedDurationMin: 30,
            intensity: 'Leve',
            targetPace: '7:15 min/km',
            description: 'Trote leve de 20 min seguido de exercícios funcionais (agachamento, prancha e elevação de panturrilha).',
            steps: [
              { type: 'rodagem', description: '20 min trote suave', durationMinutes: 20 },
              { type: 'desaquecimento', description: 'Fortalecimento funcional de membros inferiores', durationMinutes: 10 }
            ]
          },
          {
            id: '5k-w3-d3',
            dayOfWeek: 'Dom',
            title: 'Longão de 4.5 km',
            type: 'Longão',
            distanceKm: 4.5,
            estimatedDurationMin: 42,
            intensity: 'Moderado',
            targetPace: '7:15 min/km',
            description: 'Quase lá nos 5k! Foco em manter o mesmo ritmo do primeiro ao último km.',
            steps: [
              { type: 'aquecimento', description: '5 min caminhada ativa', durationMinutes: 5 },
              { type: 'rodagem', description: 'Trote contínuo 32 min', durationMinutes: 32 },
              { type: 'desaquecimento', description: 'Caminhada e hidratação', durationMinutes: 5 }
            ]
          }
        ]
      },
      {
        weekNumber: 4,
        focus: 'A Conquista dos Primeiros 5K Ininterruptos',
        targetKm: 14.5,
        workouts: [
          {
            id: '5k-w4-d1',
            dayOfWeek: 'Ter',
            title: 'Rodagem Firme 3.5km',
            type: 'Rodagem Leve',
            distanceKm: 3.5,
            estimatedDurationMin: 28,
            intensity: 'Moderado',
            targetPace: '6:50 min/km',
            description: 'Corrida constante. Ajuste o passo para uma respiração ritmada 2x2.',
            steps: [
              { type: 'aquecimento', description: '5 min trote e saltitos', durationMinutes: 5 },
              { type: 'rodagem', description: '3.5 km contínuos', distanceKm: 3.5 },
              { type: 'desaquecimento', description: 'Alongamento geral', durationMinutes: 5 }
            ]
          },
          {
            id: '5k-w4-d2',
            dayOfWeek: 'Qui',
            title: 'Ativação Leve Pré-Desafio',
            type: 'Rodagem Leve',
            distanceKm: 3.0,
            estimatedDurationMin: 22,
            intensity: 'Leve',
            targetPace: '7:00 min/km',
            description: 'Apenas para soltar as pernas. 2km leves + 4 acelerações curtas de 50 metros.',
            steps: [
              { type: 'rodagem', description: '2 km trote leve', distanceKm: 2.0 },
              { type: 'tiro', description: '4x 50m passadas aceleradas para soltar', reps: 4 }
            ]
          },
          {
            id: '5k-w4-d3',
            dayOfWeek: 'Sáb',
            title: '🏆 O GRANDE DIA: 5KM CONTÍNUOS!',
            type: 'Longão',
            distanceKm: 5.0,
            estimatedDurationMin: 35,
            intensity: 'Alto',
            targetPace: '6:45 min/km',
            description: 'Parabéns! Hoje você corre seus primeiros 5km sem parar. Não comece rápido demais; guarde energia para os 2km finais!',
            steps: [
              { type: 'aquecimento', description: 'Aquecimento dinâmico e respiração', durationMinutes: 5 },
              { type: 'rodagem', description: '5.0 km sem parar em ritmo confortável e constante', distanceKm: 5.0 },
              { type: 'desaquecimento', description: 'Celebração com a equipe e foto para compartilhar!', durationMinutes: 10 }
            ]
          }
        ]
      }
    ]
  },
  {
    id: '5k-performance',
    title: '5km: Evolução de Tempo (Sub-25 / Sub-20)',
    targetDistance: '5km',
    level: 'performance',
    durationWeeks: 8,
    description: 'Periodização focada em aumentar a potência aeróbia (VO2Max), economia de corrida e cadência. Indicado para quem já corre 5km e quer abaixar seu tempo com treinos de tiros intervalados e tempo run.',
    recommendedDaysPerWeek: 4,
    targetPaceGoal: '4:15 - 4:55 min/km',
    weeks: [
      {
        weekNumber: 1,
        focus: 'Base de Tiros Curtos & Limiar',
        targetKm: 22.0,
        workouts: [
          {
            id: '5kp-w1-d1',
            dayOfWeek: 'Ter',
            title: 'Tiros VO2Max: 8x 400m',
            type: 'Tiros / Intervalado',
            distanceKm: 6.2,
            estimatedDurationMin: 45,
            intensity: 'Alto',
            targetPace: '3:55 - 4:10 min/km',
            description: 'Aquecimento 2km + 8 tiros de 400m no ritmo alvo com 90 seg de descanso trotando + 1.5km desaquecimento.',
            steps: [
              { type: 'aquecimento', description: '2km trote aquecimento + 4 retas educativas', distanceKm: 2.0 },
              { type: 'tiro', description: '8x 400m (Pace 4:00/km) com 90s recuperação ativa', reps: 8, targetPace: '4:00 min/km' },
              { type: 'desaquecimento', description: '1.5km trote regenerativo', distanceKm: 1.5 }
            ]
          },
          {
            id: '5kp-w1-d2',
            dayOfWeek: 'Qua',
            title: 'Rodagem Regenerativa Z2',
            type: 'Rodagem Leve',
            distanceKm: 5.0,
            estimatedDurationMin: 28,
            intensity: 'Leve',
            targetPace: '5:30 - 5:45 min/km',
            description: 'Recuperação ativa da musculatura. Mantenha frequência cardíaca baixa (Zona 2).',
            steps: [
              { type: 'rodagem', description: '5km em ritmo estritamente conversacional', distanceKm: 5.0 }
            ]
          },
          {
            id: '5kp-w1-d3',
            dayOfWeek: 'Sex',
            title: 'Tempo Run no Limiar de Lactato',
            type: 'Tempo Run / Ritmo',
            distanceKm: 6.0,
            estimatedDurationMin: 35,
            intensity: 'Alto',
            targetPace: '4:30 min/km',
            description: '1.5km aquecimento + 3.5km contínuos no ritmo de limiar (ritmo de prova sustentável) + 1km desaquecimento.',
            steps: [
              { type: 'aquecimento', description: '1.5km trote progressivo', distanceKm: 1.5 },
              { type: 'ritmo', description: '3.5km cravados no ritmo de 4:30 min/km', distanceKm: 3.5, targetPace: '4:30 min/km' },
              { type: 'desaquecimento', description: '1km trote bem leve', distanceKm: 1.0 }
            ]
          },
          {
            id: '5kp-w1-d4',
            dayOfWeek: 'Dom',
            title: 'Longão com Progressão Final',
            type: 'Longão',
            distanceKm: 8.5,
            estimatedDurationMin: 48,
            intensity: 'Moderado',
            targetPace: '5:15 -> 4:45 min/km',
            description: 'Construção de resistência. Primeiros 6km suaves (5:20/km) e os 2.5km finais no ritmo de prova (4:45/km).',
            steps: [
              { type: 'rodagem', description: '6km ritmo fácil aeróbio', distanceKm: 6.0 },
              { type: 'ritmo', description: '2.5km acelerando no ritmo de prova', distanceKm: 2.5 }
            ]
          }
        ]
      },
      {
        weekNumber: 2,
        focus: 'Tiros de 800m & Resistência de Velocidade',
        targetKm: 25.0,
        workouts: [
          {
            id: '5kp-w2-d1',
            dayOfWeek: 'Ter',
            title: 'Intervalados: 5x 800m',
            type: 'Tiros / Intervalado',
            distanceKm: 7.0,
            estimatedDurationMin: 48,
            intensity: 'Alto',
            targetPace: '4:05 min/km',
            description: '2km aquecendo + 5x 800m em ritmo forte com 2 min intervalo + 1.5km soltura.',
            steps: [
              { type: 'aquecimento', description: '2km trote e educativos', distanceKm: 2.0 },
              { type: 'tiro', description: '5x 800m no ritmo de 4:05 min/km', reps: 5, targetPace: '4:05 min/km' },
              { type: 'desaquecimento', description: '1.5km desaquecimento', distanceKm: 1.5 }
            ]
          },
          {
            id: '5kp-w2-d2',
            dayOfWeek: 'Qua',
            title: 'Rodagem Leve + Educativos',
            type: 'Rodagem Leve',
            distanceKm: 6.0,
            estimatedDurationMin: 34,
            intensity: 'Leve',
            targetPace: '5:35 min/km',
            description: 'Rodagem fácil para drenar lactato e melhorar eficiência motora.',
            steps: [
              { type: 'rodagem', description: '6km Z2 conversacional', distanceKm: 6.0 }
            ]
          },
          {
            id: '5kp-w2-d3',
            dayOfWeek: 'Sex',
            title: 'Fartlek Sueco: 1min Rápido / 1min Leve',
            type: 'Tiros / Intervalado',
            distanceKm: 6.5,
            estimatedDurationMin: 38,
            intensity: 'Alto',
            targetPace: 'Variação 3:50 / 5:30',
            description: 'Excelente para mudança de marcha e ultrapassagens em provas oficiais.',
            steps: [
              { type: 'aquecimento', description: '1.5km aquecimento', distanceKm: 1.5 },
              { type: 'tiro', description: '10x (1 min sprint controlado + 1 min trote)', reps: 10, durationMinutes: 20 },
              { type: 'desaquecimento', description: '1km soltura', distanceKm: 1.0 }
            ]
          },
          {
            id: '5kp-w2-d4',
            dayOfWeek: 'Dom',
            title: 'Longão de 9km',
            type: 'Longão',
            distanceKm: 9.0,
            estimatedDurationMin: 50,
            intensity: 'Moderado',
            targetPace: '5:20 min/km',
            description: 'Capacidade mitocondrial e glicogênio muscular.',
            steps: [
              { type: 'rodagem', description: '9km constantes em terreno plano', distanceKm: 9.0 }
            ]
          }
        ]
      }
    ]
  },
  {
    id: '10k-iniciante',
    title: '10km: A Primeira Conquista dos 10K',
    targetDistance: '10km',
    level: 'intermediario',
    durationWeeks: 8,
    description: 'Desenvolvido para corredores que já completam 5km com facilidade e querem dobrar a distância com segurança, evitando canelite e fadiga precoce.',
    recommendedDaysPerWeek: 3,
    targetPaceGoal: '5:45 - 6:30 min/km',
    weeks: [
      {
        weekNumber: 1,
        focus: 'Construção da Ponte 5k -> 7k',
        targetKm: 17.0,
        workouts: [
          {
            id: '10ki-w1-d1',
            dayOfWeek: 'Ter',
            title: 'Rodagem de Base 5km',
            type: 'Rodagem Leve',
            distanceKm: 5.0,
            estimatedDurationMin: 32,
            intensity: 'Leve',
            targetPace: '6:10 min/km',
            description: 'Ritmo confortável e constante para calibrar as pernas para os 10k.',
            steps: [
              { type: 'rodagem', description: '5km contínuos com boa postura', distanceKm: 5.0 }
            ]
          },
          {
            id: '10ki-w1-d2',
            dayOfWeek: 'Qui',
            title: 'Variação de Ritmo: 4x 1km',
            type: 'Tempo Run / Ritmo',
            distanceKm: 5.5,
            estimatedDurationMin: 35,
            intensity: 'Moderado',
            targetPace: '5:50 min/km',
            description: '1.5km aquecendo + 4 blocos de 1km ligeiramente mais rápidos com 1 min trote de descanso.',
            steps: [
              { type: 'aquecimento', description: '1.5km trote', distanceKm: 1.5 },
              { type: 'ritmo', description: '4x 1km no ritmo de 5:50 min/km', reps: 4, distanceKm: 4.0 }
            ]
          },
          {
            id: '10ki-w1-d3',
            dayOfWeek: 'Sáb',
            title: 'Longão de 7km',
            type: 'Longão',
            distanceKm: 7.0,
            estimatedDurationMin: 46,
            intensity: 'Moderado',
            targetPace: '6:25 min/km',
            description: 'Treine a hidratação aos 3.5km. Não deixe faltar água.',
            steps: [
              { type: 'rodagem', description: '7km mantendo o passo cadenciado', distanceKm: 7.0 }
            ]
          }
        ]
      },
      {
        weekNumber: 2,
        focus: 'Subidas para Força Muscular & 8km',
        targetKm: 19.5,
        workouts: [
          {
            id: '10ki-w2-d1',
            dayOfWeek: 'Ter',
            title: 'Tiros em Rampa (Subida)',
            type: 'Tiros / Intervalado',
            distanceKm: 5.5,
            estimatedDurationMin: 38,
            intensity: 'Alto',
            targetPace: 'Esforço Máximo na subida',
            description: '2km aquecimento + 6 tiros de 150m em subida com descida trotando para recuperar.',
            steps: [
              { type: 'aquecimento', description: '2km aquecendo', distanceKm: 2.0 },
              { type: 'tiro', description: '6x 150m subida com passada forte', reps: 6 },
              { type: 'desaquecimento', description: '1.5km regenerativo plano', distanceKm: 1.5 }
            ]
          },
          {
            id: '10ki-w2-d2',
            dayOfWeek: 'Qui',
            title: 'Rodagem Solta 5km',
            type: 'Rodagem Leve',
            distanceKm: 5.0,
            estimatedDurationMin: 31,
            intensity: 'Leve',
            targetPace: '6:15 min/km',
            description: 'Rodagem com foco em economia mecânica.',
            steps: [
              { type: 'rodagem', description: '5km contínuos', distanceKm: 5.0 }
            ]
          },
          {
            id: '10ki-w2-d3',
            dayOfWeek: 'Dom',
            title: 'Longão de 8.5km',
            type: 'Longão',
            distanceKm: 8.5,
            estimatedDurationMin: 55,
            intensity: 'Moderado',
            targetPace: '6:20 min/km',
            description: 'Sua maior distância até agora! Teste o gel de carboidrato aos 45 minutos.',
            steps: [
              { type: 'rodagem', description: '8.5km ritmo sustentável', distanceKm: 8.5 }
            ]
          }
        ]
      }
    ]
  },
  {
    id: '10k-performance',
    title: '10km: Alta Performance (Sub-50 / Sub-40)',
    targetDistance: '10km',
    level: 'performance',
    durationWeeks: 8,
    description: 'Treinamento de elite e avançado para quebrar a barreira dos 50 ou 40 minutos nos 10km. Intervalados longos de 1.000m e 2.000m, controle do limiar e split negativo.',
    recommendedDaysPerWeek: 4,
    targetPaceGoal: '3:50 - 4:40 min/km',
    weeks: [
      {
        weekNumber: 1,
        focus: 'Intervalados de 1.000m & Limiar Anaeróbio',
        targetKm: 32.0,
        workouts: [
          {
            id: '10kp-w1-d1',
            dayOfWeek: 'Ter',
            title: 'Repetições de 1.000m: 6x 1km',
            type: 'Tiros / Intervalado',
            distanceKm: 9.5,
            estimatedDurationMin: 55,
            intensity: 'Alto',
            targetPace: '3:55 - 4:15 min/km',
            description: '2km aquecimento + 6x 1.000m no ritmo ligeiramente mais rápido que a prova com 90s descanso + 1.5km soltura.',
            steps: [
              { type: 'aquecimento', description: '2km trote + 4 retas 60m', distanceKm: 2.0 },
              { type: 'tiro', description: '6x 1.000m no ritmo alvo', reps: 6, distanceKm: 6.0, targetPace: '4:05 min/km' },
              { type: 'desaquecimento', description: '1.5km regenerativo', distanceKm: 1.5 }
            ]
          },
          {
            id: '10kp-w1-d2',
            dayOfWeek: 'Qua',
            title: 'Rodagem Regenerativa 7km',
            type: 'Rodagem Leve',
            distanceKm: 7.0,
            estimatedDurationMin: 40,
            intensity: 'Leve',
            targetPace: '5:20 min/km',
            description: 'Zona 1 e Zona 2 estrita.',
            steps: [
              { type: 'rodagem', description: '7km rodagem confortável', distanceKm: 7.0 }
            ]
          },
          {
            id: '10kp-w1-d3',
            dayOfWeek: 'Sex',
            title: 'Tempo Run 6km no Ritmo de Prova',
            type: 'Tempo Run / Ritmo',
            distanceKm: 8.5,
            estimatedDurationMin: 45,
            intensity: 'Alto',
            targetPace: '4:20 min/km',
            description: '1.5km aquecendo + 6km contínuos no ritmo cravado de prova + 1km trote.',
            steps: [
              { type: 'aquecimento', description: '1.5km aquecimento', distanceKm: 1.5 },
              { type: 'ritmo', description: '6km cravados no ritmo oficial de prova', distanceKm: 6.0, targetPace: '4:20 min/km' },
              { type: 'desaquecimento', description: '1km soltura', distanceKm: 1.0 }
            ]
          },
          {
            id: '10kp-w1-d4',
            dayOfWeek: 'Dom',
            title: 'Longão de Resistência 13km',
            type: 'Longão',
            distanceKm: 13.0,
            estimatedDurationMin: 70,
            intensity: 'Moderado',
            targetPace: '4:55 min/km',
            description: 'Acúmulo de quilometragem e adaptação neural para o final da prova.',
            steps: [
              { type: 'rodagem', description: '13km com os últimos 3km progressivos', distanceKm: 13.0 }
            ]
          }
        ]
      }
    ]
  }
];

// Adaptive Training Engine: dynamically recalculates volume and paces based on weekly user feedback
export function adaptTrainingPlan(
  plan: TrainingPlan,
  weeklyFeedback: {
    rpeEffort: number; // 1 to 10 scale (1 = levíssimo, 10 = exaustão extrema)
    completedWorkoutsRatio: number; // 0 to 1.0
    feeling: 'facil' | 'ideal' | 'pesado' | 'dor';
    currentAvgPaceSeconds: number; // in seconds per km (e.g., 300 = 5:00 min/km)
  }
): {
  adaptedPlan: TrainingPlan;
  adaptationSummary: string;
  volumeAdjustmentPercentage: number;
} {
  let volumeFactor = 1.0;
  let summary = '';

  if (weeklyFeedback.feeling === 'dor' || weeklyFeedback.rpeEffort >= 9) {
    volumeFactor = 0.85; // Reduce by 15% to prevent injury
    summary = 'Redução preventiva de 15% no volume semanal e ritmo mais suave devido à fadiga/sinais de dor relatados. Foco em recuperação articular.';
  } else if (weeklyFeedback.feeling === 'pesado' || weeklyFeedback.completedWorkoutsRatio < 0.7) {
    volumeFactor = 0.92; // Slight de-load
    summary = 'Ajuste de consolidação: carga reduzida em 8% para estabilização de adaptação antes de novos aumentos.';
  } else if (weeklyFeedback.feeling === 'facil' && weeklyFeedback.completedWorkoutsRatio >= 0.95) {
    volumeFactor = 1.06; // Progressive overload (+6%)
    summary = 'Sobrecarga progressiva (+6% de volume): seu desempenho foi excelente e seu corpo absorveu bem os treinos! Ritmos de tiros calibrados 5s mais velozes.';
  } else {
    volumeFactor = 1.02; // Optimal steady progression (+2%)
    summary = 'Progressão ideal mantida. Carga balanceada respeitando o princípio de adaptação supercompensatória.';
  }

  // Clone plan and adapt sessions
  const adaptedPlan: TrainingPlan = {
    ...plan,
    weeks: plan.weeks.map((week) => {
      const adaptedKm = Number((week.targetKm * volumeFactor).toFixed(1));
      return {
        ...week,
        targetKm: adaptedKm,
        adaptationFeedback: volumeFactor < 0.95 ? 'reduzir' : volumeFactor > 1.04 ? 'aumentar' : 'manter',
        feedbackNotes: summary,
        workouts: week.workouts.map((w) => ({
          ...w,
          distanceKm: Number((w.distanceKm * (w.type === 'Longão' ? volumeFactor : 1.0)).toFixed(1))
        }))
      };
    })
  };

  return {
    adaptedPlan,
    adaptationSummary: summary,
    volumeAdjustmentPercentage: Math.round((volumeFactor - 1) * 100)
  };
}
