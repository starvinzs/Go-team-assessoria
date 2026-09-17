import { TeamMember, Activity, TeamTask, DashboardWidgetConfig } from '../types';

export const INITIAL_TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'user-coach-leandro',
    name: 'Leandro Irineu da Silva',
    email: 'leandro.buzzmidia@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    role: 'treinador',
    paceGroup: 'Sub-20',
    weeklyTargetKm: 55,
    currentWeeklyKm: 42.5,
    best5kTime: '18:42',
    best10kTime: '39:15',
    lastActive: 'Agora mesmo',
    kudosCount: 148,
    recentActivity: 'Tiros 8x400m no Parque',
    joinedDate: '2023-03-12',
    connectedApps: {
      strava: true,
      garmin: true,
      appleHealth: false,
      coros: false,
      polar: false
    },
    runningShoeKm: 340,
    runningShoeModel: 'Nike Vaporfly 3'
  },
  {
    id: 'member-mariana',
    name: 'Mariana Costa',
    email: 'mariana.costa@runner.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    role: 'pacer',
    paceGroup: 'Sub-25',
    weeklyTargetKm: 35,
    currentWeeklyKm: 31.2,
    best5kTime: '23:18',
    best10kTime: '48:40',
    lastActive: 'Há 2 horas',
    kudosCount: 92,
    recentActivity: 'Longão de Domingo 10km',
    joinedDate: '2023-05-18',
    connectedApps: {
      strava: true,
      garmin: false,
      appleHealth: true,
      coros: false,
      polar: false
    },
    runningShoeKm: 180,
    runningShoeModel: 'Asics Novablast 4'
  },
  {
    id: 'member-carlos',
    name: 'Carlos Eduardo',
    email: 'carlos.eduardo@corredores.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    role: 'atleta',
    paceGroup: 'Sub-30',
    weeklyTargetKm: 25,
    currentWeeklyKm: 22.8,
    best5kTime: '28:45',
    best10kTime: '59:20',
    lastActive: 'Ontem',
    kudosCount: 64,
    recentActivity: 'Rodagem Regenerativa 5km',
    joinedDate: '2023-09-01',
    connectedApps: {
      strava: true,
      garmin: true,
      appleHealth: false,
      coros: false,
      polar: false
    },
    runningShoeKm: 420,
    runningShoeModel: 'Saucony Endorphin Speed'
  },
  {
    id: 'member-beatriz',
    name: 'Beatriz Almeida',
    email: 'beatriz.almeida@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    role: 'atleta',
    paceGroup: 'Sub-35',
    weeklyTargetKm: 18,
    currentWeeklyKm: 16.5,
    best5kTime: '33:10',
    best10kTime: '1:12:00',
    lastActive: 'Hoje de manhã',
    kudosCount: 51,
    recentActivity: 'Primeiros 5km ininterruptos!',
    joinedDate: '2024-01-10',
    connectedApps: {
      strava: false,
      garmin: false,
      appleHealth: true,
      coros: false,
      polar: false
    },
    runningShoeKm: 95,
    runningShoeModel: 'Olympikus Corre 3'
  },
  {
    id: 'member-rodrigo',
    name: 'Rodrigo Mello',
    email: 'rodrigo.mello@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    role: 'atleta',
    paceGroup: 'Sub-25',
    weeklyTargetKm: 30,
    currentWeeklyKm: 28.0,
    best5kTime: '24:05',
    best10kTime: '51:10',
    lastActive: 'Há 5 horas',
    kudosCount: 78,
    recentActivity: 'Treino de Tiros 5x1000m',
    joinedDate: '2023-08-20',
    connectedApps: {
      strava: true,
      garmin: false,
      appleHealth: false,
      coros: true,
      polar: false
    },
    runningShoeKm: 260,
    runningShoeModel: 'Hoka Clifton 9'
  }
];

export const INITIAL_ACTIVITIES: Activity[] = [
  {
    id: 'act-1',
    userId: 'user-coach-leandro',
    userName: 'Leandro Silva',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    title: 'Tiros VO2Max 8x400m no Pista',
    distanceKm: 6.2,
    durationSeconds: 1612, // 26m 52s
    avgPace: '4:20 min/km',
    avgHeartRate: 164,
    elevationGainMeters: 28,
    calories: 430,
    date: 'Hoje, 06:30',
    source: 'Garmin',
    notes: 'Sensação ótima nos tiros de 400m, todos mantidos abaixo de 1m35s. Recuperação ativa de 90s trotando.',
    splits: [
      { km: 1, pace: '5:02', heartRate: 138 },
      { km: 2, pace: '4:08', heartRate: 168 },
      { km: 3, pace: '4:05', heartRate: 172 },
      { km: 4, pace: '4:12', heartRate: 171 },
      { km: 5, pace: '4:04', heartRate: 175 },
      { km: 6, pace: '4:45', heartRate: 155 }
    ],
    kudos: ['member-mariana', 'member-carlos', 'member-beatriz', 'member-rodrigo']
  },
  {
    id: 'act-2',
    userId: 'member-mariana',
    userName: 'Mariana Costa',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    title: 'Longão de Domingo na Orla',
    distanceKm: 10.0,
    durationSeconds: 3150, // 52m 30s
    avgPace: '5:15 min/km',
    avgHeartRate: 152,
    elevationGainMeters: 45,
    calories: 680,
    date: 'Ontem, 07:15',
    source: 'Strava',
    notes: 'Manhã fresca, ritmo constante e confortável do início ao fim. Hidratação nos 5km.',
    splits: [
      { km: 1, pace: '5:25' },
      { km: 2, pace: '5:18' },
      { km: 3, pace: '5:14' },
      { km: 4, pace: '5:15' },
      { km: 5, pace: '5:12' },
      { km: 6, pace: '5:16' },
      { km: 7, pace: '5:14' },
      { km: 8, pace: '5:12' },
      { km: 9, pace: '5:10' },
      { km: 10, pace: '5:04' }
    ],
    kudos: ['user-coach-leandro', 'member-carlos', 'member-rodrigo']
  },
  {
    id: 'act-3',
    userId: 'member-beatriz',
    userName: 'Beatriz Almeida',
    userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    title: '🏆 Meus Primeiros 5K Sem Parar!',
    distanceKm: 5.02,
    durationSeconds: 2010, // 33m 30s
    avgPace: '6:40 min/km',
    avgHeartRate: 158,
    elevationGainMeters: 18,
    calories: 340,
    date: 'Anteontem, 18:40',
    source: 'Apple Health',
    notes: 'Muito emocionada! Quando comecei há 8 semanas não aguentava 1 minuto correndo. Obrigado pela planilha GoTeam!',
    kudos: ['user-coach-leandro', 'member-mariana', 'member-carlos', 'member-rodrigo']
  }
];

export const INITIAL_TEAM_TASKS: TeamTask[] = [
  {
    id: 'task-1',
    title: 'Desafio Semanal: 150 km Coletivos',
    description: 'Somar 150 km acumulados por todos os membros da equipe nesta semana.',
    category: 'quilometragem',
    targetValue: 150,
    currentValue: 140.7,
    unit: 'km',
    dueDate: 'Domingo, 23:59',
    completed: false,
    assignedToAll: true
  },
  {
    id: 'task-2',
    title: 'Treino de Tiros da Equipe - Quinta-feira',
    description: 'Presença confirmada no treino intervalado na pista às 19h00.',
    category: 'presenca',
    targetValue: 8,
    currentValue: 7,
    unit: 'corredores confirmados',
    dueDate: 'Quinta-feira, 19:00',
    completed: false,
    assignedToAll: true
  },
  {
    id: 'task-3',
    title: 'Manter Z2 na Rodagem Regenerativa',
    description: 'Completar ao menos 1 rodagem em ritmo estritamente fácil (frequência cardíaca abaixo de 145 bpm).',
    category: 'desafio_tiro',
    targetValue: 5,
    currentValue: 5,
    unit: 'membros completaram',
    dueDate: 'Sexta-feira',
    completed: true,
    assignedToAll: true
  }
];

export const INITIAL_TASKS = INITIAL_TEAM_TASKS;

export const DEFAULT_DASHBOARD_WIDGETS: DashboardWidgetConfig[] = [
  { id: 'widget-today-workout', title: 'Treino do Dia & Cadência', enabled: true, order: 1 },
  { id: 'widget-weekly-progress', title: 'Progresso Semanal & Metas', enabled: true, order: 2 },
  { id: 'widget-team-goal', title: 'Meta Coletiva da Equipe', enabled: true, order: 3 },
  { id: 'widget-recent-activities', title: 'Feed de Atividades da Equipe', enabled: true, order: 4 },
  { id: 'widget-wearables-status', title: 'Dispositivos & Apps Conectados', enabled: true, order: 5 },
  { id: 'widget-shoes-mileage', title: 'Desgaste do Tênis de Corrida', enabled: true, order: 6 },
  { id: 'widget-next-race', title: 'Próxima Prova no Calendário', enabled: true, order: 7 }
];
