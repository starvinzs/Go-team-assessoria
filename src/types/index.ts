export type DistanceType = '5km' | '10km';
export type ExperienceLevel = 'iniciante' | 'intermediario' | 'avancado' | 'performance';

export interface AnamneseData {
  heightCm: number;
  weightKg: number;
  birthDateOrAge: string;
  gender: string;
  parqHeartIssue: boolean;
  parqChestPain: boolean;
  parqMedication: string;
  injuriesHistory: string[];
  strengthTraining: string;
  runningExperience: string;
  weeklyAvailabilityDays: number;
  preferredTimeOfDay: string;
  mainGoal: string;
  deviceType: string;
  runningShoe: string;
  additionalNotes?: string;
  submittedAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  city?: string;
  age?: number;
  birthDate?: string;
  gender?: 'M' | 'F' | 'Outro';
  runningLevel?: 'zero' | 'iniciante' | 'intermediario' | 'avancado';
  hasCompletedAnamnese?: boolean;
  anamneseData?: AnamneseData;
  avatar?: string;
  role: 'treinador' | 'atleta' | 'pacer' | 'coordenador';
  paceGroup: 'Sub-20' | 'Sub-25' | 'Sub-30' | 'Sub-35' | 'Livre';
  weeklyTargetKm: number;
  currentWeeklyKm: number;
  best5kTime?: string; // e.g. "22:15"
  best10kTime?: string; // e.g. "47:30"
  currentPlanId?: string;
  connectedApps: {
    strava: boolean;
    garmin: boolean;
    appleHealth: boolean;
    coros: boolean;
    polar: boolean;
  };
  runningShoeKm?: number;
  runningShoeModel?: string;
  joinedDate: string;
}

export interface TeamMember extends UserProfile {
  lastActive: string;
  kudosCount: number;
  recentActivity?: string;
}

export interface WorkoutStep {
  type: 'aquecimento' | 'tiro' | 'recuperacao' | 'ritmo' | 'rodagem' | 'desaquecimento' | 'caminhada';
  description: string;
  distanceKm?: number;
  durationMinutes?: number;
  targetPace?: string; // "5:15 - 5:25 min/km"
  reps?: number;
}

export interface WorkoutSession {
  id: string;
  dayOfWeek: 'Seg' | 'Ter' | 'Qua' | 'Qui' | 'Sex' | 'Sáb' | 'Dom';
  title: string;
  type: 'Tiros / Intervalado' | 'Rodagem Leve' | 'Tempo Run / Ritmo' | 'Longão' | 'Descanso / Fortalecimento';
  distanceKm: number;
  estimatedDurationMin: number;
  intensity: 'Leve' | 'Moderado' | 'Alto' | 'Descanso';
  targetPace: string;
  description: string;
  steps: WorkoutStep[];
  completed?: boolean;
  userRPE?: number; // 1 to 10 effort
  completedDate?: string;
}

export interface TrainingWeek {
  weekNumber: number;
  focus: string;
  targetKm: number;
  workouts: WorkoutSession[];
  adaptationFeedback?: 'reduzir' | 'manter' | 'aumentar';
  feedbackNotes?: string;
}

export interface TrainingPlan {
  id: string;
  title: string;
  targetDistance: DistanceType;
  level: ExperienceLevel;
  durationWeeks: number;
  description: string;
  targetPaceGoal?: string;
  weeks: TrainingWeek[];
  recommendedDaysPerWeek: number;
}

export interface Activity {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  title: string;
  distanceKm: number;
  durationSeconds: number; // in seconds
  avgPace: string; // e.g. "4:58 min/km"
  avgHeartRate?: number;
  elevationGainMeters?: number;
  calories?: number;
  date: string;
  source: 'Strava' | 'Garmin' | 'Apple Health' | 'GoTeam Manual' | 'Coros';
  splits?: { km: number; pace: string; heartRate?: number }[];
  notes?: string;
  kudos: string[]; // array of userIds
  isSyncedWithServer?: boolean;
}

export interface TeamTask {
  id: string;
  title: string;
  description: string;
  category: 'quilometragem' | 'presenca' | 'desafio_tiro' | 'social';
  targetValue: number;
  currentValue: number;
  unit: string;
  dueDate: string;
  completed: boolean;
  assignedToAll: boolean;
}

export interface RaceDestination {
  id: string;
  name: string;
  distance: '5km' | '10km' | '21km' | 'ambos' | '5k_10k_21k';
  city: string;
  country: string;
  region: 'Brasil' | 'Europa' | 'América do Norte' | 'América do Sul' | 'Ásia / Oceania';
  month: number; // 1 to 12
  monthName: string;
  dateString: string;
  flag: string;
  coordinates?: { lat: number; lng: number };
  courseType: 'Plana (Recorde Pessoal)' | 'Cênica / Turística' | 'Ondulada' | 'Noturna Festiva' | 'Desafio Altimétrico';
  highlight: string;
  travelTips: string;
  averageTemp: string;
  officialWebsite: string;
  isPopularBucketList: boolean;
  distancesAvailable?: string[];
  topRank?: {
    distance: '5k' | '10k' | '21k';
    rank: number;
    scope: 'brasil' | 'continente';
    categoryLabel?: string;
  }[];
}

export interface DashboardWidgetConfig {
  id: string;
  title: string;
  enabled: boolean;
  order: number;
}
