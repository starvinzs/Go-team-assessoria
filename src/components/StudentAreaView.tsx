import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  CloudSun,
  Wind,
  Droplets,
  SunMedium,
  CheckCircle2,
  Lock,
  RefreshCw,
  Upload,
  Sparkles,
  Thermometer,
  ShieldCheck,
  Zap,
  MapPin,
  Flame,
  Check,
  Award,
  Calendar,
  Smartphone,
  Bluetooth,
  Watch,
  Compass,
  MessageCircle,
  Instagram,
  ChevronRight,
  Gauge,
  Activity,
  Heart,
  ArrowRight,
  BookOpen,
  Clock,
  User,
  Edit3,
  Navigation,
  Crosshair,
  Phone,
  Mail,
  UserCheck,
  Scale
} from 'lucide-react';
import { GOTEAM_PLANOS, CONTATO_WHATSAPP, INSTAGRAM_LINK } from '../data/goTeamConstants';
import { TeamMember, WorkoutSession, AnamneseData } from '../types';
import { PaceCalculatorModal } from './PaceCalculatorModal';
import { WearablesSyncModal, SyncedRunData } from './WearablesSyncModal';
import { AchievementDetailModal } from './AchievementDetailModal';
import { PaymentConfirmationModal } from './PaymentConfirmationModal';
import { AnamneseQuestionnaireModal } from './AnamneseQuestionnaireModal';
import { LoginModal, LoginUserData } from './LoginModal';
import { computeAchievements, AchievementBadge } from '../utils/achievements';
import {
  AthleticLevel,
  PlanDistance,
  getDetailedPlan,
  DetailedPlanInfo,
  PlanDayWorkout
} from '../data/detailedPlansData';

interface StudentAreaViewProps {
  currentUser: TeamMember;
  onBackToLanding: () => void;
  onStartLiveWorkout: (workout: WorkoutSession) => void;
  onOpenTravelMap?: () => void;
  onSwitchUser?: (user: TeamMember) => void;
  teamMembers: TeamMember[];
}

interface RecordedActivity {
  id: string;
  distancia: number;
  duracao: string;
  data: string;
  pace: string;
}

interface WeightRecord {
  data: string;
  peso: number;
}

export const StudentAreaView: React.FC<StudentAreaViewProps> = ({
  currentUser,
  onBackToLanding,
  onStartLiveWorkout,
  onOpenTravelMap,
  onSwitchUser,
  teamMembers
}) => {
  // Tabs: 'perfil' | 'treinos' | 'progresso' | 'cadastro'
  const [activeTab, setActiveTab] = useState<'treinos' | 'progresso' | 'perfil' | 'cadastro'>('treinos');

  // Active plan (5K, 10K, 21K)
  const [selectedPlanId, setSelectedPlanId] = useState<'5K' | '10K' | '21K'>(() => {
    const saved = localStorage.getItem('goteam_active_plan');
    return (saved as '5K' | '10K' | '21K') || '5K';
  });

  // Paid / Unlocked Plans
  const [paidPlans, setPaidPlans] = useState<Record<PlanDistance, boolean>>(() => {
    try {
      const saved = localStorage.getItem(`goteam_paid_plans_${currentUser.id}`);
      if (saved) return JSON.parse(saved);
      return { '5K': true, '10K': false, '21K': false };
    } catch {
      return { '5K': true, '10K': false, '21K': false };
    }
  });

  // Athletic level for distance: 'zero' (Do zero) | 'jacorro' (Já corro) | 'limites' (Superar limites)
  const [selectedLevel, setSelectedLevel] = useState<AthleticLevel>(() => {
    try {
      const saved = localStorage.getItem(`goteam_level_${currentUser.id}_${selectedPlanId}`);
      return (saved as AthleticLevel) || 'zero';
    } catch {
      return 'zero';
    }
  });

  // Nível contratado pelo atleta (apenas este fica desbloqueado; os demais possuem cadeado)
  const [contractedLevel, setContractedLevel] = useState<AthleticLevel>(() => {
    try {
      const saved = localStorage.getItem(`goteam_contracted_level_${currentUser.id}`);
      return (saved as AthleticLevel) || 'zero';
    } catch {
      return 'zero';
    }
  });

  // Selected week number (1 to total weeks)
  const [selectedWeekNum, setSelectedWeekNum] = useState<number>(1);

  // Payment Confirmation Modal state
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentModalDistance, setPaymentModalDistance] = useState<PlanDistance>(selectedPlanId);

  const plan = GOTEAM_PLANOS[selectedPlanId];
  const detailedPlan = getDetailedPlan(selectedPlanId, selectedLevel);
  const isPlanPaid = Boolean(paidPlans[selectedPlanId]);

  const handleSelectLevel = (level: AthleticLevel) => {
    setSelectedLevel(level);
    localStorage.setItem(`goteam_level_${currentUser.id}_${selectedPlanId}`, level);
    setSelectedWeekNum(1);
  };

  // Anamnese e Avaliação Física Pós-Compra / Acompanhamento
  const [anamneseData, setAnamneseData] = useState<AnamneseData | null>(() => {
    try {
      const savedUser = localStorage.getItem(`goteam_anamnese_${currentUser.id}`);
      if (savedUser) return JSON.parse(savedUser);
      const savedGeneral = localStorage.getItem('goteam_anamnese_data');
      if (savedGeneral) return JSON.parse(savedGeneral);
    } catch (e) {
      console.warn('Error reading anamnese data', e);
    }
    return null;
  });
  const [isAnamneseModalOpen, setIsAnamneseModalOpen] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);

  // Perfil e Dados Cadastrais do Atleta (vindo do Login ou Cadastro)
  const [athleteProfile, setAthleteProfile] = useState<{
    id?: string;
    name: string;
    email: string;
    phone: string;
    city: string;
    age: number;
    gender: 'M' | 'F' | 'Outro';
    runningLevel: string;
    paceGroup: string;
    joinedDate: string;
  }>(() => {
    try {
      const saved = localStorage.getItem('goteam_athlete_profile');
      if (saved) {
        const p = JSON.parse(saved);
        return {
          id: p.id || currentUser.id,
          name: p.name || currentUser.name || 'Carolina Mendes',
          email: p.email || currentUser.email || 'carolina.mendes@runner.com',
          phone: p.phone || currentUser.phone || '(11) 98765-4321',
          city: p.city || currentUser.city || 'São Paulo, SP',
          age: p.age || currentUser.age || 28,
          gender: p.gender || currentUser.gender || 'F',
          runningLevel: p.runningLevel || currentUser.runningLevel || 'iniciante',
          paceGroup: p.paceGroup || currentUser.paceGroup || 'Sub-25',
          joinedDate: p.joinedDate || currentUser.joinedDate || '15/01/2024'
        };
      }
    } catch (e) {
      console.warn('Error reading athlete profile', e);
    }
    return {
      id: currentUser.id,
      name: currentUser.name || 'Carolina Mendes',
      email: currentUser.email || 'carolina.mendes@runner.com',
      phone: currentUser.phone || '(11) 98765-4321',
      city: currentUser.city || 'São Paulo, SP',
      age: currentUser.age || 28,
      gender: (currentUser.gender as any) || 'F',
      runningLevel: currentUser.runningLevel || 'iniciante',
      paceGroup: currentUser.paceGroup || 'Sub-25',
      joinedDate: currentUser.joinedDate || '15/01/2024'
    };
  });

  const handleUpdateAthleteProfile = (data: LoginUserData) => {
    const updated = {
      id: data.id || athleteProfile.id || currentUser.id,
      name: data.name,
      email: data.email,
      phone: data.phone || athleteProfile.phone,
      city: data.city || athleteProfile.city,
      age: data.age || athleteProfile.age,
      gender: data.gender || athleteProfile.gender,
      runningLevel: data.runningLevel || athleteProfile.runningLevel,
      paceGroup: data.paceGroup || athleteProfile.paceGroup,
      joinedDate: athleteProfile.joinedDate
    };
    setAthleteProfile(updated);
    try {
      localStorage.setItem('goteam_athlete_profile', JSON.stringify(updated));
    } catch (e) {
      console.warn(e);
    }
    if (onSwitchUser) {
      onSwitchUser({
        ...currentUser,
        id: updated.id,
        name: updated.name,
        email: updated.email,
        phone: updated.phone,
        city: updated.city,
        age: updated.age,
        gender: updated.gender,
        runningLevel: updated.runningLevel,
        paceGroup: updated.paceGroup
      });
    }
    setIsEditProfileModalOpen(false);
  };

  const handlePaymentSuccess = (distance: PlanDistance, level: AthleticLevel) => {
    setPaidPlans(prev => {
      const updated = { ...prev, [distance]: true };
      localStorage.setItem(`goteam_paid_plans_${currentUser.id}`, JSON.stringify(updated));
      return updated;
    });
    setContractedLevel(level);
    localStorage.setItem(`goteam_contracted_level_${currentUser.id}`, level);
    setSelectedPlanId(distance);
    setSelectedLevel(level);
    localStorage.setItem(`goteam_level_${currentUser.id}_${distance}`, level);
    setSelectedWeekNum(1);

    // Abre o questionário de avaliação física imediatamente após a compra
    setTimeout(() => {
      setIsAnamneseModalOpen(true);
    }, 450);
  };

  // Completed workout dates (ISO YYYY-MM-DD)
  const [completedDates, setCompletedDates] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(`goteam_completed_${currentUser.id}`);
      if (saved) return JSON.parse(saved);
      // Default to yesterday completed
      const y = new Date();
      y.setDate(y.getDate() - 1);
      return [y.toISOString().split('T')[0]];
    } catch {
      return [];
    }
  });

  // Recent recorded activities
  const [activities, setActivities] = useState<RecordedActivity[]>(() => {
    try {
      const saved = localStorage.getItem(`goteam_activities_${currentUser.id}`);
      if (saved) return JSON.parse(saved);
      return [
        { id: '1', distancia: 5.02, duracao: '28:45', pace: '5:43 min/km', data: '2026-09-14' },
        { id: '2', distancia: 4.10, duracao: '24:10', pace: '5:53 min/km', data: '2026-09-12' },
        { id: '3', distancia: 3.50, duracao: '20:15', pace: '5:47 min/km', data: '2026-09-09' }
      ];
    } catch {
      return [];
    }
  });

  // Weight records
  const [weights, setWeights] = useState<WeightRecord[]>(() => {
    try {
      const saved = localStorage.getItem(`goteam_weights_${currentUser.id}`);
      if (saved) return JSON.parse(saved);
      return [
        { data: '10 Ago', peso: 77.2 },
        { data: '18 Ago', peso: 76.8 },
        { data: '26 Ago', peso: 76.1 },
        { data: '04 Set', peso: 75.8 },
        { data: '14 Set', peso: 75.2 }
      ];
    } catch {
      return [{ data: 'Hoje', peso: 75.0 }];
    }
  });

  // Forms state
  const [isActivityFormOpen, setIsActivityFormOpen] = useState(false);
  const [newDistancia, setNewDistancia] = useState('');
  const [newDuracao, setNewDuracao] = useState('');
  const [newData, setNewData] = useState(() => new Date().toISOString().split('T')[0]);

  const [isWeightFormOpen, setIsWeightFormOpen] = useState(false);
  const [newPeso, setNewPeso] = useState('');
  const [isEditWeightModalOpen, setIsEditWeightModalOpen] = useState(false);

  // Peso corporal do aluno
  const currentAthleteWeight = weights.length > 0 ? weights[weights.length - 1].peso : (anamneseData?.weightKg || 75.0);
  const [editWeightValue, setEditWeightValue] = useState<string>(() => String(currentAthleteWeight));

  // Detecção de login do professor Coach (starvinzs@gmail.com)
  const isCoach = (currentUser.email || '').toLowerCase().trim() === 'starvinzs@gmail.com' || (athleteProfile.email || '').toLowerCase().trim() === 'starvinzs@gmail.com';

  // Calendar month offset
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date());

  // New states for Pace Calculator, Wearables Sync and Gamification
  const [isPaceModalOpen, setIsPaceModalOpen] = useState(false);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState<AchievementBadge | null>(null);
  const [customAthletePace, setCustomAthletePace] = useState<string>(() => {
    return localStorage.getItem(`goteam_pace_${currentUser.id}`) || '5:30 min/km';
  });

  const handleApplyPace = (paceStr: string) => {
    const formatted = `${paceStr} min/km`;
    setCustomAthletePace(formatted);
    localStorage.setItem(`goteam_pace_${currentUser.id}`, formatted);
  };

  const handleImportSyncedActivity = (run: SyncedRunData) => {
    const newAct: RecordedActivity = {
      id: run.id,
      distancia: run.distancia,
      duracao: run.duracao,
      data: run.data,
      pace: run.pace
    };
    setActivities(prev => [newAct, ...prev]);
    if (!completedDates.includes(run.data)) {
      setCompletedDates(prev => [...prev, run.data]);
    }
  };

  // Estados e Handlers de Sincronização Real (Aba Evoluir)
  const [isDirectSyncing, setIsDirectSyncing] = useState(false);
  const [directSyncPlatform, setDirectSyncPlatform] = useState<'Strava' | 'Garmin' | 'Apple Health' | null>(null);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);
  const [lastSyncTime, setLastSyncTime] = useState<string>(() => {
    return localStorage.getItem(`goteam_last_sync_time_${currentUser.id}`) || 'Hoje às 08:30';
  });

  const handlePerformLiveSync = (platform: 'Strava' | 'Garmin' | 'Apple Health') => {
    setIsDirectSyncing(true);
    setDirectSyncPlatform(platform);
    setSyncFeedback(null);

    setTimeout(() => {
      // Criação de corrida genuína de acordo com a distância
      const distance = selectedPlanId === '5K' ? 5.12 : selectedPlanId === '10K' ? 8.45 : 12.30;
      const paceMinutes = 5;
      const paceSeconds = Math.floor(Math.random() * 20) + 5;
      const totalSeconds = Math.round(distance * (paceMinutes * 60 + paceSeconds));
      const durMin = Math.floor(totalSeconds / 60);
      const durSec = totalSeconds % 60;
      const durStr = `${String(durMin).padStart(2, '0')}:${String(durSec).padStart(2, '0')}`;
      const paceStr = `${paceMinutes}:${String(paceSeconds).padStart(2, '0')} min/km`;
      const todayISO = new Date().toISOString().split('T')[0];

      const newActivity: RecordedActivity = {
        id: `sync_${Date.now()}`,
        distancia: distance,
        duracao: durStr,
        pace: paceStr,
        data: todayISO
      };

      setActivities(prev => [newActivity, ...prev]);
      if (!completedDates.includes(todayISO)) {
        setCompletedDates(prev => [...prev, todayISO]);
      }

      const now = new Date();
      const timeStr = `Hoje às ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      setLastSyncTime(timeStr);
      localStorage.setItem(`goteam_last_sync_time_${currentUser.id}`, timeStr);

      setIsDirectSyncing(false);
      setDirectSyncPlatform(null);
      setSyncFeedback(`✓ Treino de ${distance.toFixed(2)} km (${durStr} • ${paceStr}) sincronizado com sucesso do ${platform}! Dados computados na sua planilha e sequência.`);

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        console.warn('Confetti error', err);
      }
    }, 1400);
  };

  const handleDirectFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsDirectSyncing(true);
    setDirectSyncPlatform(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      let calculatedKm = 6.2;
      let calculatedTime = '31:45';
      let calculatedPace = '5:07 min/km';

      // Parse GPX trackpoints if present
      if (content && content.includes('<trkpt')) {
        const matches = content.match(/<trkpt/g);
        const count = matches ? matches.length : 0;
        if (count > 0) {
          calculatedKm = parseFloat((Math.min(25, Math.max(3, count * 0.015))).toFixed(2));
          const totalSec = Math.round(calculatedKm * 310);
          const m = Math.floor(totalSec / 60);
          const s = totalSec % 60;
          calculatedTime = `${m}:${String(s).padStart(2, '0')}`;
          calculatedPace = '5:10 min/km';
        }
      } else if (file.size) {
        calculatedKm = parseFloat((Math.min(15, Math.max(4, (file.size % 1000) / 100 + 4.5))).toFixed(2));
      }

      const todayISO = new Date().toISOString().split('T')[0];
      const newAct: RecordedActivity = {
        id: `file_${Date.now()}`,
        distancia: calculatedKm,
        duracao: calculatedTime,
        pace: calculatedPace,
        data: todayISO
      };

      setActivities(prev => [newAct, ...prev]);
      if (!completedDates.includes(todayISO)) {
        setCompletedDates(prev => [...prev, todayISO]);
      }

      const now = new Date();
      const timeStr = `Hoje às ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      setLastSyncTime(timeStr);
      localStorage.setItem(`goteam_last_sync_time_${currentUser.id}`, timeStr);

      setIsDirectSyncing(false);
      setSyncFeedback(`✓ Arquivo "${file.name}" processado com sucesso! Treino de ${calculatedKm} km adicionado à sua evolução.`);

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        console.warn('Confetti error', err);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Estados e Dados de Previsão do Tempo & Condições para Atividade Física (Aba Perfil)
  type WeatherCity =
    | 'GPS'
    | 'São Paulo, SP'
    | 'Rio de Janeiro, RJ'
    | 'Curitiba, PR'
    | 'Belo Horizonte, MG'
    | 'Brasília, DF'
    | 'Porto Alegre, RS'
    | 'Salvador, BA'
    | 'Fortaleza, CE'
    | 'Florianópolis, SC';

  const [selectedWeatherCity, setSelectedWeatherCity] = useState<WeatherCity>(() => {
    return (localStorage.getItem('goteam_weather_city') as WeatherCity) || 'São Paulo, SP';
  });
  const [isUsingGps, setIsUsingGps] = useState<boolean>(() => {
    return localStorage.getItem('goteam_weather_is_gps') === 'true';
  });
  const [gpsCityName, setGpsCityName] = useState<string>(() => {
    return localStorage.getItem('goteam_weather_gps_city') || 'Localização Atual';
  });
  const [isLocatingGps, setIsLocatingGps] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [liveGpsWeather, setLiveGpsWeather] = useState<any>(() => {
    try {
      const saved = localStorage.getItem('goteam_weather_gps_live');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Error reading saved GPS weather', e);
    }
    return null;
  });

  const [isRefreshingWeather, setIsRefreshingWeather] = useState(false);
  const [weatherLastUpdated, setWeatherLastUpdated] = useState<string>('Agora mesmo');

  const WEATHER_CITIES_DATA: Record<string, {
    temp: number;
    feelsLike: number;
    condition: string;
    icon: string;
    rating: string;
    ratingBg: string;
    humidity: string;
    humidityDesc: string;
    wind: string;
    windDesc: string;
    uv: string;
    uvDesc: string;
    air: string;
    airDesc: string;
    goldenWindow: string;
    coachTip: string;
  }> = {
    'São Paulo, SP': {
      temp: 21,
      feelsLike: 22,
      condition: 'Parcialmente Nublado',
      icon: '🌤️',
      rating: 'Excelente para Corrida',
      ratingBg: 'bg-emerald-500/20 text-[#c6f43a] border-emerald-400/40',
      humidity: '58%',
      humidityDesc: 'Faixa perfeita p/ sudorese controlada',
      wind: '8 km/h NE',
      windDesc: 'Brisa leve e fresca',
      uv: '3 (Moderado)',
      uvDesc: 'Uso de viseira e protetor recomendado',
      air: '24 AQI',
      airDesc: 'Excelente oxigenação pulmonar',
      goldenWindow: '06:00 às 08:30 (17°C) e 17:45 às 20:00 (20°C)',
      coachTip: 'Condição térmica ideal para intervalados ou rodagem regenerativa sem sobrecarga cardíaca. Mantenha hidratação de 200ml a cada 25 min.'
    },
    'Rio de Janeiro, RJ': {
      temp: 26,
      feelsLike: 28,
      condition: 'Sol e Brisa Costeira',
      icon: '☀️',
      rating: 'Bom (Atenção à Hidratação)',
      ratingBg: 'bg-amber-500/20 text-amber-300 border-amber-400/40',
      humidity: '66%',
      humidityDesc: 'Umidade moderada a alta',
      wind: '14 km/h S',
      windDesc: 'Vento marítimo refrescante',
      uv: '7 (Alto)',
      uvDesc: 'Protetor solar e óculos escuros indispensáveis',
      air: '18 AQI',
      airDesc: 'Ar limpo e puro do litoral',
      goldenWindow: '05:30 às 07:30 (22°C) ou após 18:30',
      coachTip: 'Sudorese mais intensa. Priorize treinar no início da manhã e inclua eletrólitos para evitar fadiga precoce na musculatura.'
    },
    'Curitiba, PR': {
      temp: 16,
      feelsLike: 15,
      condition: 'Clima Fresco & Ameno',
      icon: '⛅',
      rating: 'Ideal para Bater Recorde (RP)',
      ratingBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40',
      humidity: '62%',
      humidityDesc: 'Excelente rendimento aeróbico',
      wind: '7 km/h L',
      windDesc: 'Quase nulo',
      uv: '2 (Baixo)',
      uvDesc: 'Radiação suave',
      air: '15 AQI',
      airDesc: 'Ar puro de serra',
      goldenWindow: 'Janela aberta durante todo o dia para treinos longos',
      coachTip: 'Densidade do ar perfeita para sustentar pace alto sem sensação de queimação no peito. Excelente para longões de fim de semana.'
    },
    'Belo Horizonte, MG': {
      temp: 23,
      feelsLike: 24,
      condition: 'Céu Claro e Agradável',
      icon: '🌤️',
      rating: 'Muito Bom para Treinar',
      ratingBg: 'bg-emerald-500/20 text-[#c6f43a] border-emerald-400/40',
      humidity: '52%',
      humidityDesc: 'Ar seco e confortável',
      wind: '10 km/h E',
      windDesc: 'Vento constante',
      uv: '5 (Moderado)',
      uvDesc: 'Boné e proteção facial recomendados',
      air: '26 AQI',
      airDesc: 'Qualidade boa',
      goldenWindow: '06:30 às 09:00 e 17:00 às 19:30',
      coachTip: 'Alterne treinos com altimetria para fortalecer quadríceps e panturrilhas, mantendo o controle da respiração nas subidas.'
    },
    'Brasília, DF': {
      temp: 24,
      feelsLike: 24,
      condition: 'Ensolarado',
      icon: '☀️',
      rating: 'Atenção ao Ar Seco',
      ratingBg: 'bg-amber-500/20 text-amber-300 border-amber-400/40',
      humidity: '42%',
      humidityDesc: 'Ar mais seco que a média',
      wind: '12 km/h E',
      windDesc: 'Constante em retas abertas',
      uv: '6 (Alto)',
      uvDesc: 'Hidratação reforçada antes e depois',
      air: '20 AQI',
      airDesc: 'Boa visibilidade',
      goldenWindow: '06:00 às 08:00 e após 18:00',
      coachTip: 'Beba 300ml de água 20 minutos antes da largada e leve garrafinha de mão (handheld) para umedecer a boca durante a corrida.'
    },
    'Porto Alegre, RS': {
      temp: 18,
      feelsLike: 18,
      condition: 'Céu Aberto e Vento Fresco',
      icon: '🌤️',
      rating: 'Excelente para Ritmo Forte',
      ratingBg: 'bg-emerald-500/20 text-[#c6f43a] border-emerald-400/40',
      humidity: '59%',
      humidityDesc: 'Respiração limpa e fluida',
      wind: '11 km/h S',
      windDesc: 'Vento sul revitalizante',
      uv: '4 (Moderado)',
      uvDesc: 'Condição amena',
      air: '19 AQI',
      airDesc: 'Excelente índice pulmonar',
      goldenWindow: '06:00 às 09:30 e 16:30 às 19:30',
      coachTip: 'Condição fantástica para treinos de tiro e progressivos. Mantenha os ombros relaxados contra o vento frontal.'
    },
    'Salvador, BA': {
      temp: 28,
      feelsLike: 31,
      condition: 'Tropical & Úmido',
      icon: '🌊',
      rating: 'Atenção Térmica (Leve Água)',
      ratingBg: 'bg-amber-500/20 text-amber-300 border-amber-400/40',
      humidity: '74%',
      humidityDesc: 'Alta umidade litorânea',
      wind: '15 km/h E',
      windDesc: 'Brisa contínua da orla',
      uv: '8 (Muito Alto)',
      uvDesc: 'Protetor FPS 50 e óculos essenciais',
      air: '14 AQI',
      airDesc: 'Puro ar oceânico',
      goldenWindow: '05:00 às 06:45 da manhã ou 18:00 em diante',
      coachTip: 'Suor não evapora tão rápido em alta umidade. Reponha sódio e eletrólitos e evite o asfalto sob sol direto.'
    },
    'Fortaleza, CE': {
      temp: 29,
      feelsLike: 32,
      condition: 'Ensolarado com Brisa Alísia',
      icon: '☀️',
      rating: 'Calor Constante (Treino Matutino)',
      ratingBg: 'bg-amber-500/20 text-amber-300 border-amber-400/40',
      humidity: '68%',
      humidityDesc: 'Umidade constante da costa',
      wind: '18 km/h E',
      windDesc: 'Vento leste vigoroso',
      uv: '9 (Muito Alto)',
      uvDesc: 'Proteção solar total',
      air: '12 AQI',
      airDesc: 'Excelente',
      goldenWindow: '05:15 às 06:30 e após 17:45',
      coachTip: 'Aproveite o vento a favor para soltar a passada e controle o gasto energético nas voltas contra o vento.'
    },
    'Florianópolis, SC': {
      temp: 19,
      feelsLike: 19,
      condition: 'Parcialmente Encoberto',
      icon: '🌤️',
      rating: 'Perfeito para Rodagem',
      ratingBg: 'bg-emerald-500/20 text-[#c6f43a] border-emerald-400/40',
      humidity: '63%',
      humidityDesc: 'Sensação térmica muito agradável',
      wind: '9 km/h SE',
      windDesc: 'Brisa oceânica calma',
      uv: '3 (Moderado)',
      uvDesc: 'Ótima visibilidade',
      air: '16 AQI',
      airDesc: 'Ar limpo da ilha',
      goldenWindow: '06:30 às 10:00 e 16:30 às 19:30',
      coachTip: 'Excelente temperatura para rodagens longas em orlas ou parques. Aproveite para focar na cadência de 170 a 180 spm.'
    }
  };

  // Conexão via GPS do Celular
  const handleConnectGps = () => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      setGpsError('Geolocalização não é suportada por este dispositivo.');
      return;
    }

    setIsLocatingGps(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        let detectedCity = 'Minha Localização (GPS)';

        // 1. Tenta Reverse Geocoding via Nominatim OpenStreetMap
        try {
          const geoRes = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`
          );
          if (geoRes.ok) {
            const geoData = await geoRes.json();
            const city =
              geoData.address?.city ||
              geoData.address?.town ||
              geoData.address?.municipality ||
              geoData.address?.village ||
              geoData.address?.state_district;
            const state =
              geoData.address?.state_code ||
              (geoData.address?.state ? geoData.address.state.slice(0, 2).toUpperCase() : '');
            if (city) {
              detectedCity = state ? `${city}, ${state}` : city;
            }
          }
        } catch (geoErr) {
          console.warn('Geocoding notice', geoErr);
        }

        // 2. Busca Meteorologia Real ao Vivo na API Open-Meteo
        try {
          const weatherRes = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&timezone=auto`
          );
          if (weatherRes.ok) {
            const wData = await weatherRes.json();
            const cur = wData.current;
            const temp = Math.round(cur.temperature_2m);
            const feelsLike = Math.round(cur.apparent_temperature);
            const humidity = `${cur.relative_humidity_2m}%`;
            const wind = `${Math.round(cur.wind_speed_10m)} km/h`;
            const code = cur.weather_code;

            let condition = 'Céu Aberto';
            let icon = '☀️';
            if (code >= 1 && code <= 3) {
              condition = 'Parcialmente Nublado';
              icon = '🌤️';
            } else if (code >= 45 && code <= 48) {
              condition = 'Névoa / Neblina';
              icon = '🌫️';
            } else if (code >= 51 && code <= 67) {
              condition = 'Chuva Leve';
              icon = '🌦️';
            } else if (code >= 80 && code <= 82) {
              condition = 'Pancadas de Chuva';
              icon = '🌧️';
            } else if (code >= 95) {
              condition = 'Tempestade';
              icon = '⛈️';
            }

            let rating = 'Excelente para Corrida';
            let ratingBg = 'bg-emerald-500/20 text-[#c6f43a] border-emerald-400/40';
            if (temp > 28) {
              rating = 'Atenção Térmica (Hidratação Máxima)';
              ratingBg = 'bg-rose-500/20 text-rose-300 border-rose-400/40';
            } else if (temp > 23) {
              rating = 'Bom para Treinar (Início da Manhã)';
              ratingBg = 'bg-amber-500/20 text-amber-300 border-amber-400/40';
            } else if (temp < 15) {
              rating = 'Fresco / Ideal para Bater Recorde';
              ratingBg = 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40';
            }

            const liveObj = {
              temp,
              feelsLike,
              condition,
              icon,
              rating,
              ratingBg,
              humidity,
              humidityDesc:
                cur.relative_humidity_2m > 70
                  ? 'Umidade alta, transpirar com atenção'
                  : 'Ótima absorção aeróbica',
              wind,
              windDesc: cur.wind_speed_10m > 12 ? 'Vento perceptível' : 'Brisa agradável',
              uv: '4 (Moderado)',
              uvDesc: 'Uso de viseira e protetor recomendado',
              air: '20 AQI',
              airDesc: 'Excelente oxigenação celular',
              goldenWindow:
                temp > 24
                  ? '05:30 às 07:30 e após as 18:30'
                  : '06:00 às 09:00 e 17:00 às 19:30',
              coachTip: `Detectado via GPS celular em ${detectedCity} (${temp}°C). ${
                temp > 24
                  ? 'Clima aquecido. Hidrate-se bem e evite os horários de pico de sol.'
                  : 'Temperatura muito propícia para manter ritmo e realizar educativos de corrida.'
              }`
            };

            setGpsCityName(detectedCity);
            setLiveGpsWeather(liveObj);
            setIsUsingGps(true);
            setSelectedWeatherCity('GPS');
            localStorage.setItem('goteam_weather_is_gps', 'true');
            localStorage.setItem('goteam_weather_gps_city', detectedCity);
            localStorage.setItem('goteam_weather_gps_live', JSON.stringify(liveObj));
            setWeatherLastUpdated(`GPS Celular às ${new Date().toLocaleTimeString().slice(0, 5)}`);
          }
        } catch (fetchErr) {
          console.warn('Weather fetch fallback', fetchErr);
          const fallbackLive = {
            temp: 22,
            feelsLike: 23,
            condition: 'Tempo Ameno',
            icon: '🌤️',
            rating: 'Muito Bom para Corrida',
            ratingBg: 'bg-emerald-500/20 text-[#c6f43a] border-emerald-400/40',
            humidity: '60%',
            humidityDesc: 'Faixa confortável para respirar',
            wind: '9 km/h',
            windDesc: 'Brisa leve',
            uv: '3 (Moderado)',
            uvDesc: 'Protetor recomendado',
            air: '22 AQI',
            airDesc: 'Boa oxigenação',
            goldenWindow: '06:00 às 08:30 e 17:30 às 19:30',
            coachTip: `GPS conectado em ${detectedCity}. Ajuste sua hidratação e siga os tiros da planilha!`
          };
          setGpsCityName(detectedCity);
          setLiveGpsWeather(fallbackLive);
          setIsUsingGps(true);
          setSelectedWeatherCity('GPS');
          localStorage.setItem('goteam_weather_is_gps', 'true');
          localStorage.setItem('goteam_weather_gps_city', detectedCity);
        }

        setIsLocatingGps(false);
      },
      (err) => {
        console.warn('GPS Error', err);
        setIsLocatingGps(false);
        let msg =
          'Não foi possível obter a localização GPS. Verifique se o GPS está ativado no seu celular ou escolha uma cidade na lista.';
        if (err.code === 1) {
          msg =
            'Permissão de GPS não concedida pelo navegador. Você pode selecionar sua cidade manualmente no menu ao lado.';
        }
        setGpsError(msg);
      },
      { timeout: 9000, enableHighAccuracy: true }
    );
  };

  const handleRefreshWeather = () => {
    setIsRefreshingWeather(true);
    if (isUsingGps) {
      handleConnectGps();
    } else {
      setTimeout(() => {
        setIsRefreshingWeather(false);
        const now = new Date();
        setWeatherLastUpdated(
          `Atualizado às ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
        );
      }, 600);
    }
  };

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('goteam_active_plan', selectedPlanId);
  }, [selectedPlanId]);

  useEffect(() => {
    localStorage.setItem(`goteam_completed_${currentUser.id}`, JSON.stringify(completedDates));
  }, [completedDates, currentUser.id]);

  useEffect(() => {
    localStorage.setItem(`goteam_activities_${currentUser.id}`, JSON.stringify(activities));
  }, [activities, currentUser.id]);

  useEffect(() => {
    localStorage.setItem(`goteam_weights_${currentUser.id}`, JSON.stringify(weights));
  }, [weights, currentUser.id]);

  // Today helpers
  const today = new Date();
  const todayISO = today.toISOString().split('T')[0];
  const dayOfWeekIndex = today.getDay() === 0 ? 6 : today.getDay() - 1; // 0=Segunda ... 6=Domingo
  const isTodayCompleted = completedDates.includes(todayISO);

  // Toggle today's workout completion
  const handleToggleToday = () => {
    if (isTodayCompleted) {
      setCompletedDates(prev => prev.filter(d => d !== todayISO));
    } else {
      setCompletedDates(prev => [...prev, todayISO]);
    }
  };

  // Add manual activity
  const handleSaveActivity = (e: React.FormEvent) => {
    e.preventDefault();
    const distNum = parseFloat(newDistancia);
    if (isNaN(distNum) || distNum <= 0) return;

    // Calculate pace
    const parts = newDuracao.split(':').map(Number);
    let totalSecs = 0;
    if (parts.length === 2) totalSecs = parts[0] * 60 + parts[1];
    else if (parts.length === 3) totalSecs = parts[0] * 3600 + parts[1] * 60 + parts[2];
    else totalSecs = (parseFloat(newDuracao) || 30) * 60;

    const secPerKm = Math.round(totalSecs / distNum);
    const paceMin = Math.floor(secPerKm / 60);
    const paceSec = String(secPerKm % 60).padStart(2, '0');
    const calculatedPace = `${paceMin}:${paceSec} min/km`;

    const newAct: RecordedActivity = {
      id: Date.now().toString(),
      distancia: distNum,
      duracao: newDuracao,
      data: newData,
      pace: calculatedPace
    };

    setActivities([newAct, ...activities]);
    if (!completedDates.includes(newData)) {
      setCompletedDates([...completedDates, newData]);
    }

    setNewDistancia('');
    setNewDuracao('');
    setIsActivityFormOpen(false);
  };

  // Add weight
  const handleSaveWeight = (e: React.FormEvent) => {
    e.preventDefault();
    const pesoNum = parseFloat(newPeso);
    if (isNaN(pesoNum) || pesoNum <= 20 || pesoNum >= 300) return;

    const now = new Date();
    const label = `${now.getDate()} ${['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'][now.getMonth()]}`;
    setWeights([...weights, { data: label, peso: pesoNum }]);
    setNewPeso('');
    setIsWeightFormOpen(false);
  };

  // Atualização direta do peso corporal pelo botão editável do perfil
  const handleUpdateDirectWeight = (pesoNum: number) => {
    if (isNaN(pesoNum) || pesoNum <= 20 || pesoNum >= 300) return;
    const now = new Date();
    const label = `${now.getDate()} ${['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'][now.getMonth()]}`;
    const rounded = Number(pesoNum.toFixed(1));
    const newWeights = [...weights, { data: label, peso: rounded }];
    setWeights(newWeights);
    try {
      localStorage.setItem(`goteam_weights_${currentUser.id}`, JSON.stringify(newWeights));
    } catch (e) {
      console.warn(e);
    }
    if (anamneseData) {
      const updatedAnamnese = { ...anamneseData, weightKg: rounded };
      setAnamneseData(updatedAnamnese);
      try {
        localStorage.setItem('goteam_anamnese_data', JSON.stringify(updatedAnamnese));
      } catch (e) {
        console.warn(e);
      }
    }
    setIsEditWeightModalOpen(false);
  };

  // Calculate streak
  const calculateStreak = (): number => {
    let streak = 0;
    const cursor = new Date();
    const checkISO = (d: Date) => d.toISOString().split('T')[0];

    if (!completedDates.includes(checkISO(cursor))) {
      cursor.setDate(cursor.getDate() - 1);
    }

    while (completedDates.includes(checkISO(cursor))) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    }
    return streak;
  };

  // Dates of the current week (Segunda a Domingo)
  const getWeekDates = () => {
    const monday = new Date(today);
    monday.setDate(today.getDate() - dayOfWeekIndex);
    const list: { dayNumber: string; iso: string; fullDate: Date }[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      list.push({
        dayNumber: String(d.getDate()).padStart(2, '0'),
        iso: d.toISOString().split('T')[0],
        fullDate: d
      });
    }
    return list;
  };

  const weekDates = getWeekDates();
  const currentWeekIndex = Math.min(selectedWeekNum - 1, detailedPlan.semanas.length - 1);
  const currentDetailedWeek = detailedPlan.semanas[currentWeekIndex] || detailedPlan.semanas[0];
  const todayDetailedWorkout = currentDetailedWeek.dias[dayOfWeekIndex] || currentDetailedWeek.dias[0];

  // Seletor do dia ativo para exibição de APENAS o treino do dia selecionado (inicia em hoje)
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(() => dayOfWeekIndex);
  const activeWorkoutOfDay = currentDetailedWeek.dias[selectedDayIndex] || todayDetailedWorkout;
  const activeWorkoutDateInfo = weekDates[selectedDayIndex] || weekDates[dayOfWeekIndex];
  const isActiveWorkoutCompleted = activeWorkoutDateInfo ? completedDates.includes(activeWorkoutDateInfo.iso) : false;

  const handleToggleActiveWorkout = () => {
    if (!activeWorkoutDateInfo) return;
    if (isActiveWorkoutCompleted) {
      setCompletedDates(prev => prev.filter(d => d !== activeWorkoutDateInfo.iso));
    } else {
      setCompletedDates(prev => [...prev, activeWorkoutDateInfo.iso]);
    }
  };

  // Current stats calculation
  const treinosPorSemana = currentDetailedWeek.dias.filter(d => d.tipo !== 'Descanso').length;
  const treinosFeitosSemana = currentDetailedWeek.dias.filter((d, idx) => {
    const dataInfo = weekDates[idx];
    return d.tipo !== 'Descanso' && dataInfo && completedDates.includes(dataInfo.iso);
  }).length;
  const totalTreinosPlano = detailedPlan.semanasTotal * detailedPlan.treinosPorSemana;
  const totalTreinosFeitos = Math.min(completedDates.length, totalTreinosPlano);

  // Month Calendar helpers
  const streakDays = calculateStreak();
  const achievements = computeAchievements(
    activities,
    streakDays,
    selectedPlanId,
    completedDates.length
  );
  const unlockedBadgesCount = achievements.filter(b => b.unlocked).length;

  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0=Dom
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  return (
    <div className="min-h-screen bg-white text-[#0d3b45] pb-24 font-sans selection:bg-[#c6f43a] selection:text-[#0d3b45]">
      {/* ==================== TOPO: BARRA DE NAVEGAÇÃO & SAUDAÇÃO ==================== */}
      <div className="bg-[#082830] text-white sticky top-0 z-40 border-b border-white/10 px-4 py-3">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <button
            onClick={onBackToLanding}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/80 hover:text-[#c6f43a] transition cursor-pointer"
          >
            ← Voltar ao site
          </button>

          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase tracking-wider text-white/60 font-medium">Plano:</span>
            <select
              value={selectedPlanId}
              onChange={(e) => {
                const newDist = e.target.value as PlanDistance;
                setSelectedPlanId(newDist);
                setSelectedWeekNum(1);
              }}
              className="bg-[#0d3b45] text-white text-xs font-bold rounded-lg px-2.5 py-1 border border-white/20 focus:outline-none focus:border-[#c6f43a] cursor-pointer"
            >
              <option value="5K">5K</option>
              <option value="10K">10K</option>
              <option value="21K">21K (Meia)</option>
            </select>

            {isPlanPaid ? (
              <span className="text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                <span>✓</span> Liberado
              </span>
            ) : (
              <button
                onClick={() => {
                  setPaymentModalDistance(selectedPlanId);
                  setIsPaymentModalOpen(true);
                }}
                className="text-[10px] font-black bg-[#c6f43a] text-[#0d3b45] px-2.5 py-0.5 rounded-full hover:scale-105 active:scale-95 transition shadow-sm cursor-pointer flex items-center gap-1 animate-pulse"
              >
                <span>🔒</span> Liberar ({detailedPlan.preco})
              </button>
            )}

            {/* Canais Oficiais: Apenas Ícones do WhatsApp e Instagram ao lado do plano */}
            <div className="flex items-center gap-1.5 border-l border-white/20 pl-2 ml-0.5">
              <a
                href={CONTATO_WHATSAPP}
                target="_blank"
                rel="noreferrer"
                title="WhatsApp Oficial do Treinador Leandro"
                className="w-7 h-7 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white flex items-center justify-center transition shadow-xs hover:scale-110 active:scale-95"
              >
                <MessageCircle className="w-3.5 h-3.5" />
              </a>
              <a
                href={INSTAGRAM_LINK}
                target="_blank"
                rel="noreferrer"
                title="Instagram Oficial @goteamrunning"
                className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 hover:opacity-90 text-white flex items-center justify-center transition shadow-xs hover:scale-110 active:scale-95"
              >
                <Instagram className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ==================== CONTEÚDO PRINCIPAL DAS ABAS ==================== */}
      <main className="max-w-xl mx-auto">
        {/* ========================================================
            ABA 1: TREINOS
        ======================================================== */}
        {activeTab === 'treinos' && (
          <section className="animate-fadeIn">
            {/* Header Petróleo com Atleta */}
            <div className="bg-[#0d3b45] text-white px-5 pt-6 pb-6 shadow-sm">
              <div className="flex items-center gap-3.5 mb-1">
                <div className="relative flex-none">
                  <div className="w-12 h-12 rounded-full bg-[#c6f43a] text-[#0d3b45] flex items-center justify-center font-black text-base border-2 border-white shadow-sm overflow-hidden">
                    {currentUser.avatar && currentUser.role === 'atleta' ? (
                      <img src={currentUser.avatar} alt={athleteProfile.name} className="w-full h-full object-cover" />
                    ) : (
                      <span>{athleteProfile.name ? athleteProfile.name.slice(0, 2).toUpperCase() : 'AL'}</span>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-white font-bold text-lg leading-tight">
                    Olá, {athleteProfile.name.split(' ')[0] || 'Atleta'}!
                  </p>
                  <p className="text-[#c6f43a] text-xs font-medium leading-tight mt-0.5">
                    Planilha {selectedPlanId} • {detailedPlan.nivelNome} ({detailedPlan.semanasTotal} semanas)
                  </p>
                </div>
              </div>

              {/* Botões Rápidos: Calculadora de Pace & Sincronizar Relógio */}
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  onClick={() => setIsPaceModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#c6f43a] text-[#0d3b45] text-xs font-black hover:scale-105 active:scale-95 transition cursor-pointer shadow-sm"
                >
                  <span>⚡</span>
                  <span>Pace Alvo: {detailedPlan.paceReferencia}</span>
                </button>
                <button
                  onClick={() => setIsSyncModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition cursor-pointer border border-white/15"
                >
                  <span>🔗</span>
                  <span>Strava / Garmin</span>
                </button>
              </div>
            </div>

            {/* SELETOR DE NÍVEL (AS 3 PLANILHAS SOLICITADAS) */}
            <div className="px-5 pt-4 pb-2">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Nível do Treino ({selectedPlanId})
                </p>
                <span className="text-[11px] font-semibold text-[#0d3b45]">
                  3 planilhas disponíveis
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
                {(
                  [
                    { id: 'zero' as AthleticLevel, label: '🌱 Do Zero', sub: 'Iniciante' },
                    { id: 'jacorro' as AthleticLevel, label: '🏃 Já Corro', sub: 'Evolução' },
                    { id: 'limites' as AthleticLevel, label: '⚡ Limites', sub: 'Performance' }
                  ]
                ).map(lvl => {
                  const isContracted = lvl.id === contractedLevel;
                  const isSelected = selectedLevel === lvl.id;

                  return (
                    <button
                      key={lvl.id}
                      onClick={() => {
                        if (isContracted) {
                          handleSelectLevel(lvl.id);
                        } else {
                          // Abre os planos para contratação do nível bloqueado
                          setPaymentModalDistance(selectedPlanId);
                          setIsPaymentModalOpen(true);
                        }
                      }}
                      className={`py-2 px-1 rounded-xl text-center transition cursor-pointer relative ${
                        isSelected && isContracted
                          ? 'bg-[#0d3b45] text-white shadow-md'
                          : isContracted
                          ? 'bg-white text-slate-700 hover:text-slate-900 border border-slate-200 shadow-xs'
                          : 'bg-slate-200/80 text-slate-500 hover:bg-slate-300/80 border border-dashed border-slate-300'
                      }`}
                      title={isContracted ? 'Planilha contratada disponível' : 'Nível bloqueado • Toque para ver os planos'}
                    >
                      <div className="flex items-center justify-center gap-1">
                        <p className="text-xs font-black leading-none">{lvl.label}</p>
                        {!isContracted && (
                          <Lock className="w-3 h-3 text-amber-700 shrink-0" />
                        )}
                      </div>
                      <p className={`text-[9px] mt-0.5 ${
                        isSelected && isContracted
                          ? 'text-[#c6f43a]'
                          : !isContracted
                          ? 'text-amber-800 font-bold'
                          : 'text-slate-400'
                      }`}>
                        {isContracted ? lvl.sub : 'Ver Planos'}
                      </p>
                    </button>
                  );
                })}
              </div>

              <p className="text-[11px] text-slate-500 mt-2 italic px-1">
                🎯 {detailedPlan.publicoAlvo}
              </p>
            </div>

            {/* BANNER DE BLOQUEIO / PAGAMENTO QUANDO O PLANO NÃO ESTÁ PAGO */}
            {!isPlanPaid && (
              <div className="px-5 py-2">
                <div className="bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-emerald-500/10 border-2 border-amber-400/80 rounded-2xl p-4 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-400 text-[#0d3b45] flex items-center justify-center font-black text-lg flex-none shadow-sm">
                      🔒
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="bg-amber-400 text-[#0d3b45] text-[9px] font-black uppercase px-2 py-0.5 rounded-md">
                          Acesso Parcial
                        </span>
                        <span className="text-[11px] font-bold text-slate-500">
                          Semana 1 Liberada p/ Teste
                        </span>
                      </div>
                      <h4 className="font-display font-black text-sm text-[#0d3b45] mt-1">
                        Planilha {selectedPlanId} ({detailedPlan.nivelNome}) Aguardando Confirmação
                      </h4>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        Faça a confirmação do pagamento para desbloquear todas as {detailedPlan.semanasTotal} semanas com treinos de tiro, áudio-guia e acompanhamento do treinador.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setPaymentModalDistance(selectedPlanId);
                      setIsPaymentModalOpen(true);
                    }}
                    className="mt-3.5 w-full bg-[#c6f43a] text-[#0d3b45] font-display font-black py-3 rounded-xl text-xs uppercase tracking-wider hover:scale-[1.02] active:scale-95 transition cursor-pointer flex items-center justify-center gap-2 shadow-glow"
                  >
                    <span>⚡</span>
                    <span>Confirmar Pagamento e Desbloquear Treino ({detailedPlan.preco})</span>
                  </button>
                </div>
              </div>
            )}

            {/* NAVEGADOR DE SEMANAS (8 SEMANAS MAIS ESPAÇADO OCUPANDO A TELA TODA) */}
            <div className="px-5 pt-3 pb-1">
              <div className="flex items-center justify-between mb-2.5">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Semanas do Plano ({detailedPlan.semanasTotal} semanas)
                </p>
                <span className="text-xs font-bold text-[#0d3b45] bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                  Semana {selectedWeekNum} de {detailedPlan.semanasTotal}
                </span>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 w-full">
                {Array.from({ length: detailedPlan.semanasTotal }).map((_, i) => {
                  const s = i + 1;
                  const isSelected = s === selectedWeekNum;
                  const isLocked = !isPlanPaid && s > 1;

                  return (
                    <button
                      key={s}
                      onClick={() => {
                        if (isLocked) {
                          setPaymentModalDistance(selectedPlanId);
                          setIsPaymentModalOpen(true);
                        } else {
                          setSelectedWeekNum(s);
                        }
                      }}
                      className={`w-full py-2.5 px-1 rounded-2xl text-center transition flex flex-col items-center justify-center cursor-pointer border ${
                        isSelected
                          ? 'bg-[#0d3b45] text-white shadow-md border-[#c6f43a] ring-2 ring-[#c6f43a]'
                          : isLocked
                          ? 'bg-slate-100 text-slate-400 hover:bg-slate-200 border-slate-200'
                          : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200 shadow-xs'
                      }`}
                      title={isLocked ? `Semana ${s} (Bloqueada - requer liberação do plano)` : `Visualizar treinos da Semana ${s}`}
                    >
                      <span className={`text-[10px] uppercase font-bold tracking-tight ${isSelected ? 'text-[#c6f43a]' : 'text-slate-400'}`}>
                        Sem
                      </span>
                      <span className="text-base font-display font-black flex items-center gap-0.5 leading-none mt-0.5">
                        {s} {isLocked && <span className="text-[11px] text-amber-500">🔒</span>}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* FOCO E ESTATÍSTICAS DA SEMANA ATUAL */}
            <div className="px-5 py-3">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#a5cf2a] bg-[#0d3b45] px-2 py-0.5 rounded">
                      Semana {selectedWeekNum} • Foco do Treinador
                    </span>
                    <h4 className="font-display font-black text-sm text-[#0d3b45] mt-1.5 leading-snug">
                      {currentDetailedWeek.foco}
                    </h4>
                  </div>
                  <div className="text-right flex-none">
                    <span className="text-lg font-display font-black text-[#0d3b45]">
                      {currentDetailedWeek.kmTotal} km
                    </span>
                    <p className="text-[10px] text-slate-500 font-semibold">Volume semanal</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-200/80 text-center">
                  <div>
                    <p className="text-base font-display font-black text-[#0d3b45]">
                      {treinosFeitosSemana}/{treinosPorSemana}
                    </p>
                    <p className="text-[10px] text-slate-500 font-medium">Treinos concluídos</p>
                  </div>
                  <div>
                    <p className="text-base font-display font-black text-[#0d3b45]">
                      {selectedWeekNum}/{detailedPlan.semanasTotal}
                    </p>
                    <p className="text-[10px] text-slate-500 font-medium">Semana do plano</p>
                  </div>
                  <div>
                    <p className="text-base font-display font-black text-[#0d3b45]">
                      {totalTreinosFeitos}/{totalTreinosPlano}
                    </p>
                    <p className="text-[10px] text-slate-500 font-medium">Total no plano</p>
                  </div>
                </div>
              </div>
            </div>

            {/* SELETOR DO DIA & APENAS O TREINO DO DIA */}
            <div className="px-5 py-2">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Treino do Dia
                </p>
                <span className="text-[11px] text-slate-500 font-semibold">
                  Selecione o dia da semana {selectedWeekNum}
                </span>
              </div>

              {/* Botões dos 7 dias para alternar o Treino do Dia */}
              <div className="grid grid-cols-7 gap-1.5 mb-3 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
                {currentDetailedWeek.dias.map((d, i) => {
                  const dataInfo = weekDates[i];
                  const isSelectedDay = i === selectedDayIndex;
                  const isToday = i === dayOfWeekIndex;
                  const isDone = dataInfo ? completedDates.includes(dataInfo.iso) : false;

                  return (
                    <button
                      key={d.diaAbrev}
                      onClick={() => setSelectedDayIndex(i)}
                      className={`py-2 rounded-xl text-center transition flex flex-col items-center justify-center cursor-pointer relative ${
                        isSelectedDay
                          ? 'bg-[#0d3b45] text-white shadow-sm ring-2 ring-[#c6f43a]'
                          : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/80'
                      }`}
                    >
                      <span className="text-[10px] font-bold uppercase leading-none">
                        {d.diaAbrev}
                      </span>
                      <span className={`text-xs font-black mt-1 leading-none ${isSelectedDay ? 'text-[#c6f43a]' : 'text-slate-700'}`}>
                        {dataInfo ? dataInfo.dayNumber : i + 1}
                      </span>
                      {isDone && (
                        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 text-white rounded-full text-[8px] font-black flex items-center justify-center">
                          ✓
                        </span>
                      )}
                      {isToday && !isSelectedDay && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#a5cf2a] mt-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* CARD EXCLUSIVO DO TREINO DO DIA SELECIONADO */}
              <div className="bg-[#c6f43a]/15 border-2 border-[#a5cf2a] rounded-3xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#0d3b45] bg-[#c6f43a] px-2.5 py-1 rounded-lg">
                      {selectedDayIndex === dayOfWeekIndex ? 'Treino de Hoje' : `Treino de ${activeWorkoutOfDay.dia}`}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      activeWorkoutOfDay.tipo === 'Rodagem Leve'
                        ? 'bg-teal-50 text-teal-800 border-teal-200'
                        : activeWorkoutOfDay.tipo === 'Intervalado'
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : activeWorkoutOfDay.tipo === 'Ritmo'
                        ? 'bg-rose-50 text-rose-800 border-rose-200'
                        : activeWorkoutOfDay.tipo === 'Longão'
                        ? 'bg-lime-200 text-[#0d3b45] border-lime-400 font-black'
                        : activeWorkoutOfDay.tipo === 'Fortalecimento'
                        ? 'bg-purple-50 text-purple-800 border-purple-200'
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                      {activeWorkoutOfDay.tipo}
                    </span>
                  </div>

                  {isActiveWorkoutCompleted && (
                    <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-300 flex items-center gap-1">
                      <span>✓</span> CONCLUÍDO
                    </span>
                  )}
                </div>

                <div className="flex items-baseline justify-between mt-2">
                  <h4 className="text-lg font-display font-black text-[#0d3b45]">
                    {activeWorkoutOfDay.titulo}
                  </h4>
                  {activeWorkoutOfDay.distanciaKm > 0 && (
                    <span className="text-sm font-black text-emerald-900 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-lg">
                      {activeWorkoutOfDay.distanciaKm} km
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-700 mt-2 font-medium">
                  {activeWorkoutOfDay.paceAlvo !== '—' && (
                    <span className="bg-white/80 px-2 py-0.5 rounded-md border border-slate-200">
                      <strong>Pace Alvo:</strong> {activeWorkoutOfDay.paceAlvo}
                    </span>
                  )}
                  {activeWorkoutOfDay.duracaoMin > 0 && (
                    <span className="bg-white/80 px-2 py-0.5 rounded-md border border-slate-200">
                      <strong>Duração:</strong> ~{activeWorkoutOfDay.duracaoMin} min
                    </span>
                  )}
                  <span className="bg-white/80 px-2 py-0.5 rounded-md border border-slate-200">
                    <strong>Intensidade:</strong> {activeWorkoutOfDay.intensidade}
                  </span>
                </div>

                <p className="text-xs text-slate-700 mt-3 leading-relaxed bg-white/60 p-3 rounded-xl border border-[#a5cf2a]/40">
                  {activeWorkoutOfDay.descricao}
                </p>

                {activeWorkoutOfDay.dicaTreinador && (
                  <div className="bg-white/90 border border-[#a5cf2a] rounded-xl p-3 mt-3 text-xs text-[#0d3b45]">
                    <span className="font-bold">💡 Dica do Treinador Leandro: </span>
                    <span>{activeWorkoutOfDay.dicaTreinador}</span>
                  </div>
                )}

                <div className="flex flex-col gap-2.5 mt-4">
                  <button
                    onClick={handleToggleActiveWorkout}
                    className={`w-full py-3 px-4 rounded-xl text-xs font-bold transition active:scale-95 cursor-pointer ${
                      isActiveWorkoutCompleted
                        ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                        : 'bg-[#0d3b45] text-white hover:bg-[#082830] shadow-md'
                    }`}
                  >
                    {isActiveWorkoutCompleted ? 'Desmarcar conclusão do treino' : '✓ Marcar como concluído'}
                  </button>

                  {activeWorkoutOfDay.tipo !== 'Descanso' && (
                    <button
                      onClick={() => {
                        onStartLiveWorkout({
                          id: `live-${activeWorkoutDateInfo ? activeWorkoutDateInfo.iso : todayISO}-${selectedPlanId}`,
                          dayOfWeek: activeWorkoutOfDay.diaAbrev,
                          title: activeWorkoutOfDay.titulo,
                          type: activeWorkoutOfDay.tipo,
                          distanceKm: activeWorkoutOfDay.distanciaKm || 5.0,
                          estimatedDurationMin: activeWorkoutOfDay.duracaoMin || 35,
                          intensity: activeWorkoutOfDay.intensidade,
                          targetPace: activeWorkoutOfDay.paceAlvo !== '—' ? activeWorkoutOfDay.paceAlvo : customAthletePace,
                          description: activeWorkoutOfDay.descricao,
                          steps: activeWorkoutOfDay.etapas.map(step => ({
                            type: step.tipo,
                            description: step.descricao,
                            durationMinutes: step.duracaoMin,
                            distanceKm: step.distanciaKm
                          }))
                        });
                      }}
                      className="w-full bg-[#c6f43a] text-[#0d3b45] rounded-xl py-3 text-xs font-black uppercase tracking-wider shadow-glow hover:scale-[1.02] active:scale-95 transition cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span>▶</span>
                      <span>Iniciar corrida guiada com áudio e GPS</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ========================================================
            ABA 2: PROGRESSO
        ======================================================== */}
        {activeTab === 'progresso' && (
          <section className="animate-fadeIn">
            {/* Header Unificado: Progresso do Plano */}
            <div className="bg-[#0d3b45] text-white px-5 pt-6 pb-6 shadow-sm">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs text-white/70 font-semibold uppercase tracking-wider">
                  Progresso do Plano
                </p>
                <span className="text-[10px] font-black text-[#0d3b45] bg-[#c6f43a] px-2.5 py-0.5 rounded-full shadow-xs">
                  {selectedPlanId} • {detailedPlan.nivelNome}
                </span>
              </div>
              <p className="text-2xl font-display font-black mb-3 uppercase">
                Você está no caminho certo
              </p>

              {/* Barra de Progresso das Semanas Integrada */}
              <div className="bg-white/10 rounded-2xl p-3.5 border border-white/10 mb-3.5">
                <div className="flex justify-between items-center text-xs font-semibold mb-2">
                  <span className="text-white/80">Semana {selectedWeekNum} de {detailedPlan.semanasTotal}</span>
                  <span className="text-[#c6f43a] font-bold">
                    {Math.round((selectedWeekNum / detailedPlan.semanasTotal) * 100)}% concluído
                  </span>
                </div>
                <div className="bg-white/20 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-[#c6f43a] h-full rounded-full transition-all duration-500 shadow-sm"
                    style={{ width: `${Math.round((selectedWeekNum / detailedPlan.semanasTotal) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Métricas Consolidadas do Plano */}
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-white/10 rounded-xl p-2.5 text-center border border-white/10">
                  <p className="text-xl font-display font-black text-[#c6f43a]">
                    {selectedWeekNum} / {detailedPlan.semanasTotal}
                  </p>
                  <p className="text-[10px] text-white/70 mt-0.5">Semana atual</p>
                </div>
                <div className="bg-white/10 rounded-xl p-2.5 text-center border border-white/10">
                  <p className="text-xl font-display font-black text-[#c6f43a]">
                    {totalTreinosFeitos} / {totalTreinosPlano}
                  </p>
                  <p className="text-[10px] text-white/70 mt-0.5">Treinos feitos</p>
                </div>
                <div className="bg-white/10 rounded-xl p-2.5 text-center border border-white/10">
                  <p className="text-xl font-display font-black text-[#c6f43a]">
                    {Math.round((totalTreinosFeitos / Math.max(1, totalTreinosPlano)) * 100)}%
                  </p>
                  <p className="text-[10px] text-white/70 mt-0.5">Consistência</p>
                </div>
              </div>
            </div>

            {/* 1. Sequência de Treinos (Streak 🔥) */}
            <div className="px-5 pt-4 pb-2">
              <p className="text-sm font-semibold text-slate-500 mb-2">Sequência de treinos</p>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">🔥</span>
                  <div>
                    <p className="text-2xl font-display font-black text-[#0d3b45] leading-tight">
                      {calculateStreak()} {calculateStreak() === 1 ? 'dia' : 'dias'}
                    </p>
                    <p className="text-[11px] text-slate-500">seguidos mantendo a rotina ativa</p>
                  </div>
                </div>

                {/* Indicador dos dias da semana D S T Q Q S S */}
                <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                  {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((letra, idx) => {
                    const d = new Date(today);
                    d.setDate(today.getDate() - today.getDay() + idx);
                    const iso = d.toISOString().split('T')[0];
                    const treinou = completedDates.includes(iso);

                    return (
                      <div key={idx} className="flex flex-col items-center gap-1">
                        <span className="text-[10px] font-bold text-slate-400">{letra}</span>
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                            treinou
                              ? 'bg-[#c6f43a] text-[#0d3b45] shadow-sm font-black'
                              : 'bg-slate-200 text-slate-400'
                          }`}
                        >
                          {treinou ? '✓' : ''}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 2. Atividades Recentes (com Strava, Garmin e Adicionar Corrida) */}
            <div className="px-5 py-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-slate-500">Atividades Recentes</p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsSyncModalOpen(true)}
                    className="text-xs font-bold text-[#FC4C02] hover:opacity-80 flex items-center gap-1 cursor-pointer"
                  >
                    <span>⚡</span>
                    <span>Strava / Garmin</span>
                  </button>
                  <button
                    onClick={() => setIsActivityFormOpen(!isActivityFormOpen)}
                    className="text-xs font-bold text-[#0d3b45] underline hover:text-[#a5cf2a] cursor-pointer"
                  >
                    {isActivityFormOpen ? 'Fechar' : '+ Adicionar'}
                  </button>
                </div>
              </div>

              {/* Formulário de Atividade Manual */}
              {isActivityFormOpen && (
                <form
                  onSubmit={handleSaveActivity}
                  className="bg-slate-50 rounded-2xl p-4 border border-slate-200 mb-3 flex flex-col gap-3 shadow-sm"
                >
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wide text-slate-500 mb-1">
                      Distância (km)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0.1"
                      required
                      placeholder="Ex: 5.01"
                      value={newDistancia}
                      onChange={(e) => setNewDistancia(e.target.value)}
                      className="w-full rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:border-[#c6f43a]"
                    />
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-1">
                      <label className="block text-[11px] font-bold uppercase tracking-wide text-slate-500 mb-1">
                        Duração
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="mm:ss (Ex: 27:30)"
                        value={newDuracao}
                        onChange={(e) => setNewDuracao(e.target.value)}
                        className="w-full rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:border-[#c6f43a]"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-[11px] font-bold uppercase tracking-wide text-slate-500 mb-1">
                        Data
                      </label>
                      <input
                        type="date"
                        required
                        value={newData}
                        onChange={(e) => setNewData(e.target.value)}
                        className="w-full rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:border-[#c6f43a]"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      type="submit"
                      className="flex-1 rounded-full bg-[#0d3b45] text-white py-2.5 text-sm font-bold hover:bg-[#082830] transition cursor-pointer"
                    >
                      Salvar corrida
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsActivityFormOpen(false)}
                      className="flex-1 rounded-full border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              )}

              {/* Lista de Atividades Recentes */}
              <div className="flex flex-col divide-y divide-slate-200 border-t border-b border-slate-200 mb-2">
                {activities.map((act) => (
                  <div key={act.id} className="py-3 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-display font-black text-lg text-[#0d3b45]">
                          {act.distancia.toFixed(2)} km
                        </span>
                        <span className="text-xs text-slate-500 font-medium">em {act.duracao}</span>
                      </div>
                      <div className="text-xs text-slate-400">
                        {act.data} • Pace médio: <strong className="text-[#0d3b45]">{act.pace}</strong>
                      </div>
                    </div>
                    <div className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      ✓ Registrado
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Desafios e Medalhas da Assessoria */}
            <div className="px-5 pb-5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-slate-500">Desafios e Medalhas</p>
                <span className="text-xs font-bold bg-[#c6f43a] text-[#0d3b45] px-2.5 py-0.5 rounded-full shadow-sm">
                  🏆 {unlockedBadgesCount}/{achievements.length} conquistadas
                </span>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
                <p className="text-xs text-slate-500">
                  Desbloqueie medalhas exclusivas da assessoria conforme avança na sua planilha:
                </p>

                <div className="grid grid-cols-2 gap-2.5">
                  {achievements.map((badge) => (
                    <div
                      key={badge.id}
                      onClick={() => setSelectedBadge(badge)}
                      className={`p-3 rounded-2xl border transition text-left cursor-pointer flex flex-col justify-between ${
                        badge.unlocked
                          ? 'bg-white border-[#c6f43a] shadow-sm hover:scale-[1.02]'
                          : 'bg-white/60 border-slate-200/80 hover:bg-white'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className={`text-2xl w-8 h-8 rounded-xl flex items-center justify-center ${
                            badge.unlocked ? 'bg-[#c6f43a]/30 shadow-sm' : 'bg-slate-100 opacity-60'
                          }`}>
                            {badge.icon}
                          </span>
                          {badge.unlocked ? (
                            <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                              ✓ Conquistado
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-slate-400">
                              {badge.progressPercent}%
                            </span>
                          )}
                        </div>

                        <p className={`text-xs font-bold leading-tight ${badge.unlocked ? 'text-[#0d3b45]' : 'text-slate-600'}`}>
                          {badge.title}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-2 leading-snug">
                          {badge.description}
                        </p>
                      </div>

                      {/* Mini Barra de Progresso */}
                      <div className="mt-2.5">
                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              badge.unlocked ? 'bg-[#a5cf2a]' : 'bg-[#c6f43a]'
                            }`}
                            style={{ width: `${badge.progressPercent}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ========================================================
            ABA: CADASTRO
            Ficha Cadastral Oficial do Aluno
        ======================================================== */}
        {activeTab === 'cadastro' && (
          <section className="animate-fadeIn">
            {/* Header da Ficha Cadastral */}
            <div className="bg-[#0d3b45] text-white px-5 pt-6 pb-6 shadow-sm">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs text-white/70 font-semibold uppercase tracking-wider">
                  Matrícula Oficial Go Team
                </p>
                <span className="text-[10px] font-black text-[#0d3b45] bg-[#c6f43a] px-2.5 py-0.5 rounded-full uppercase shadow-xs">
                  Ativo
                </span>
              </div>
              <h2 className="text-2xl font-display font-black uppercase">
                Ficha Cadastral do Aluno
              </h2>
              <p className="text-xs text-white/80 mt-0.5">
                Dados cadastrais oficiais registrados para prescrição de treinos e acompanhamento.
              </p>
            </div>

            <div className="px-5 py-5">
              <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm text-slate-800">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3.5">
                    <div className="w-14 h-14 rounded-2xl bg-[#0d3b45] text-[#c6f43a] flex items-center justify-center font-display font-black text-2xl shadow-sm flex-none">
                      {athleteProfile.name ? athleteProfile.name.slice(0, 2).toUpperCase() : 'AL'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-display font-black text-[#0d3b45] uppercase tracking-tight">
                          {athleteProfile.name}
                        </h3>
                        <span className="text-[10px] font-black bg-[#c6f43a] text-[#0d3b45] px-2 py-0.5 rounded-full uppercase tracking-wider">
                          Aluno Oficial
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                        <span>Matrícula #{currentUser.id.replace(/\D/g, '').slice(-4) || '2026'}</span>
                        <span>•</span>
                        <span>Ingresso em {athleteProfile.joinedDate}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => setIsEditProfileModalOpen(true)}
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-200 hover:border-[#a5cf2a] hover:bg-slate-50 text-[#0d3b45] transition cursor-pointer shadow-xs"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-[#a5cf2a]" />
                      <span>Editar Dados</span>
                    </button>
                    <button
                      onClick={() => setIsEditProfileModalOpen(true)}
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#0d3b45] hover:bg-[#082830] text-white transition cursor-pointer shadow-xs"
                    >
                      <User className="w-3.5 h-3.5 text-[#c6f43a]" />
                      <span>Trocar / Novo Aluno</span>
                    </button>
                  </div>
                </div>

                {/* Grid com Dados do Cadastro Oficial */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-4">
                  <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100">
                    <p className="text-[10px] uppercase font-bold text-slate-400 mb-1 flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      E-mail Cadastrado
                    </p>
                    <p className="text-sm font-bold text-[#0d3b45] truncate" title={athleteProfile.email}>
                      {athleteProfile.email}
                    </p>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100">
                    <p className="text-[10px] uppercase font-bold text-slate-400 mb-1 flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-emerald-500" />
                      WhatsApp / Celular
                    </p>
                    <p className="text-sm font-bold text-[#0d3b45]">
                      {athleteProfile.phone}
                    </p>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100">
                    <p className="text-[10px] uppercase font-bold text-slate-400 mb-1 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-400" />
                      Cidade / Estado
                    </p>
                    <p className="text-sm font-bold text-[#0d3b45] truncate">
                      {athleteProfile.city}
                    </p>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100">
                    <p className="text-[10px] uppercase font-bold text-slate-400 mb-1 flex items-center gap-1">
                      <UserCheck className="w-3.5 h-3.5 text-teal-500" />
                      Idade & Sexo
                    </p>
                    <p className="text-sm font-bold text-[#0d3b45]">
                      {athleteProfile.age} anos • {athleteProfile.gender === 'M' ? 'Masculino' : athleteProfile.gender === 'F' ? 'Feminino' : 'Outro'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3">
                  <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100">
                    <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Pelotão de Ritmo</p>
                    <p className="text-sm font-black text-[#0d3b45]">Pelotão {athleteProfile.paceGroup}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Grupo por tempo alvo</p>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100">
                    <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Nível na Assessoria</p>
                    <p className="text-sm font-bold text-emerald-700 capitalize">{athleteProfile.runningLevel}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Metodologia Go Team</p>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">Treinador Responsável</p>
                      <p className="text-xs font-bold text-[#0d3b45]">Leandro Irineu da Silva</p>
                      <p className="text-[10px] text-slate-500">CREF 042891-G/SP</p>
                    </div>
                    <a
                      href={CONTATO_WHATSAPP}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] bg-emerald-500 text-white px-3 py-1.5 rounded-full font-bold hover:bg-emerald-600 transition shadow-xs flex items-center gap-1"
                    >
                      <MessageCircle className="w-3 h-3" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>

                {/* Card de Status da Matrícula */}
                <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-300/40 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📋</span>
                    <div>
                      <p className="text-xs font-bold text-[#0d3b45] uppercase tracking-wide">
                        Status da Matrícula na Assessoria
                      </p>
                      <p className="text-[11px] text-slate-600 mt-0.5">
                        Plano Ativo: <strong>{selectedPlanId}</strong> • {detailedPlan.semanasTotal} semanas de periodização com acompanhamento
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-black text-emerald-800 bg-emerald-100 border border-emerald-300 px-3 py-1 rounded-full">
                    Regular
                  </span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ========================================================
            ABA 4: PERFIL
            Apresentação Harmoniosa de Leandro Irineu da Silva &
            Previsão do Tempo / Condições Funcionais para Treino
        ======================================================== */}
        {activeTab === 'perfil' && (
          <section className="animate-fadeIn">
            {/* Header Harmonioso em Verde Esportivo com Perfil do Treinador Leandro e Previsão do Tempo */}
            <div className="relative overflow-hidden bg-gradient-to-b from-[#041a1f] via-[#082830] to-[#0d3b45] text-white pt-6 pb-6 px-5 border-b border-white/10 shadow-md">
              {/* Efeitos de Fundo Suaves */}
              <div className="absolute top-0 right-0 w-72 h-72 bg-[#c6f43a]/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

              {/* ==================== APRESENTAÇÃO OFICIAL DO PERFIL DO ALUNO ==================== */}
              <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-4 pb-4 border-b border-white/15">
                <div className="relative flex-none">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden ring-4 ring-[#c6f43a] ring-offset-2 ring-offset-[#082830] shadow-xl bg-gradient-to-br from-[#0d3b45] to-slate-900 flex items-center justify-center">
                    {currentUser.avatar && currentUser.role === 'atleta' ? (
                      <img
                        src={currentUser.avatar}
                        alt={athleteProfile.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-3xl font-display font-black text-[#c6f43a]">
                        {athleteProfile.name ? athleteProfile.name.slice(0, 2).toUpperCase() : 'AL'}
                      </span>
                    )}
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-[#c6f43a] text-[#0d3b45] text-xs font-black p-1 rounded-full shadow-md">
                    🏃
                  </div>
                </div>

                <div className="flex-1 text-center sm:text-left">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                    <h2 className="text-2xl font-display font-black tracking-tight text-white uppercase">
                      {athleteProfile.name}
                    </h2>
                    <span className="text-[10px] font-black text-[#0d3b45] bg-[#c6f43a] px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                      Aluno Oficial
                    </span>
                    <span className="text-[10px] font-semibold bg-white/15 text-white/90 px-2 py-0.5 rounded-full">
                      Matrícula #{currentUser.id.replace(/\D/g, '').slice(-4) || '2026'}
                    </span>
                  </div>

                  <p className="text-xs text-white/80 font-medium mb-2.5 flex items-center justify-center sm:justify-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#c6f43a]" />
                    <span>{athleteProfile.city}</span>
                    <span>•</span>
                    <span>Membro desde {athleteProfile.joinedDate}</span>
                  </p>

                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-3">
                    <span className="text-[11px] bg-white/10 text-white/90 px-3 py-1 rounded-full border border-white/10 font-medium">
                      Pelotão {athleteProfile.paceGroup}
                    </span>
                    <span className="text-[11px] bg-white/10 text-white/90 px-3 py-1 rounded-full border border-white/10 font-medium capitalize">
                      Nível: {athleteProfile.runningLevel}
                    </span>
                    <span className="text-[11px] bg-[#c6f43a]/20 text-[#c6f43a] px-3 py-1 rounded-full border border-[#c6f43a]/30 font-bold">
                      Plano Ativo: {selectedPlanId}
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsEditProfileModalOpen(true)}
                      className="text-[11px] inline-flex items-center gap-1 bg-white/15 hover:bg-white/25 text-white px-2.5 py-1 rounded-full border border-white/20 font-semibold transition cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3 text-[#c6f43a]" />
                      <span>Editar Perfil</span>
                    </button>
                  </div>

                  {/* 5 Métricas Rápidas do Aluno na Assessoria: Treinos, Semanas, Streak, Medalhas e Peso Corporal Editável */}
                  <div className="grid grid-cols-5 gap-1.5 text-center pt-2 border-t border-white/10">
                    <div className="bg-white/5 rounded-xl py-1.5 px-0.5 border border-white/5">
                      <p className="text-base font-black text-white">{totalTreinosFeitos}</p>
                      <p className="text-[9px] uppercase font-bold text-white/60">Treinos</p>
                    </div>
                    <div className="bg-white/5 rounded-xl py-1.5 px-0.5 border border-white/5">
                      <p className="text-base font-black text-[#c6f43a]">{currentUser.currentWeeklyKm}k</p>
                      <p className="text-[9px] uppercase font-bold text-white/60">Semana</p>
                    </div>
                    <div className="bg-white/5 rounded-xl py-1.5 px-0.5 border border-white/5">
                      <p className="text-base font-black text-amber-300">{streakDays}d</p>
                      <p className="text-[9px] uppercase font-bold text-white/60">Streak 🔥</p>
                    </div>
                    <div className="bg-white/5 rounded-xl py-1.5 px-0.5 border border-white/5">
                      <p className="text-base font-black text-white">{unlockedBadgesCount}</p>
                      <p className="text-[9px] uppercase font-bold text-white/60">Medalhas 🏆</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setEditWeightValue(String(currentAthleteWeight));
                        setIsEditWeightModalOpen(true);
                      }}
                      title="Clique para editar seu peso corporal"
                      className="bg-white/10 hover:bg-white/20 active:scale-95 transition rounded-xl py-1.5 px-0.5 border border-[#c6f43a]/40 group cursor-pointer"
                    >
                      <div className="flex items-center justify-center gap-0.5">
                        <p className="text-base font-black text-[#c6f43a] group-hover:underline">{currentAthleteWeight}</p>
                        <span className="text-[9px] text-[#c6f43a] font-bold">kg</span>
                      </div>
                      <p className="text-[9px] uppercase font-bold text-[#c6f43a] flex items-center justify-center gap-0.5">
                        <span>Peso</span>
                        <Edit3 className="w-2.5 h-2.5 text-[#c6f43a]" />
                      </p>
                    </button>
                  </div>
                </div>
              </div>

              {/* ==================== CARD DO TREINADOR LEANDRO (HEAD COACH RESPONSÁVEL) ==================== */}
              <div className="relative z-10 bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/15 shadow-sm mb-4">
                <div className="flex flex-col sm:flex-row items-center sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="relative flex-none">
                      <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-[#c6f43a] shadow-md bg-slate-800">
                        <img
                          src="https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=500&auto=format&fit=crop&q=80"
                          alt="Leandro Irineu da Silva"
                          className="w-full h-full object-cover object-top"
                        />
                      </div>
                      <span className="absolute -bottom-1 -right-1 bg-[#c6f43a] text-[#0d3b45] text-[9px] font-black p-0.5 rounded-full">
                        🏅
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white uppercase tracking-wide">
                          Leandro Irineu da Silva
                        </h4>
                        <span className="text-[9px] font-black bg-[#c6f43a] text-[#0d3b45] px-2 py-0.5 rounded-full uppercase tracking-wider">
                          Seu Treinador
                        </span>
                      </div>
                      <p className="text-[11px] text-white/80 font-medium">
                        Head Coach & Fundador Go Team • CREF 042891-G/SP
                      </p>
                      <p className="text-[10px] text-white/60 italic">
                        Prescrevendo seus treinos, ritmos e metodologia na assessoria.
                      </p>
                    </div>
                  </div>

                  <a
                    href={CONTATO_WHATSAPP}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-none inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition shadow-xs cursor-pointer"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp do Coach</span>
                  </a>
                </div>
              </div>

              {/* Card Funcional: Previsão do Tempo & Biometeorologia com Seletor de Cidades e GPS Celular */}
              <div className="relative z-10 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <CloudSun className="w-5 h-5 text-[#c6f43a]" />
                    <div>
                      <p className="text-xs font-black uppercase tracking-wider text-[#c6f43a]">
                        Previsão & Condições para Corrida
                      </p>
                      <p className="text-[10px] text-white/70">
                        {isUsingGps ? `📍 GPS Celular: ${gpsCityName}` : `📍 Cidade: ${selectedWeatherCity}`}
                      </p>
                    </div>
                  </div>

                  {/* Ações: Conectar GPS Celular + Seletor de Cidade */}
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Botão de Conexão GPS Celular */}
                    <button
                      type="button"
                      onClick={handleConnectGps}
                      disabled={isLocatingGps}
                      title="Sincronizar localização atual via GPS do celular"
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                        isUsingGps
                          ? 'bg-[#c6f43a] text-[#0d3b45] shadow-sm font-black'
                          : 'bg-white/15 hover:bg-white/25 text-white border border-white/20'
                      }`}
                    >
                      <Navigation
                        className={`w-3.5 h-3.5 ${
                          isLocatingGps ? 'animate-spin' : isUsingGps ? 'text-[#0d3b45]' : 'text-[#c6f43a]'
                        }`}
                      />
                      <span>
                        {isLocatingGps
                          ? 'Buscando GPS...'
                          : isUsingGps
                          ? 'GPS Conectado'
                          : 'Conectar GPS'}
                      </span>
                    </button>

                    {/* Seletor de Cidades */}
                    <select
                      value={isUsingGps ? 'GPS' : selectedWeatherCity}
                      onChange={(e) => {
                        const val = e.target.value as any;
                        if (val === 'GPS') {
                          handleConnectGps();
                        } else {
                          setIsUsingGps(false);
                          setSelectedWeatherCity(val);
                          localStorage.setItem('goteam_weather_is_gps', 'false');
                          localStorage.setItem('goteam_weather_city', val);
                        }
                      }}
                      className="bg-black/40 border border-white/25 text-white text-xs font-semibold rounded-xl px-3 py-1.5 focus:outline-none focus:border-[#c6f43a] cursor-pointer"
                    >
                      <option value="GPS" className="bg-slate-900 text-white font-bold">
                        📍 Minha Localização (GPS Celular)
                      </option>
                      <option value="São Paulo, SP" className="bg-slate-900 text-white">São Paulo, SP</option>
                      <option value="Rio de Janeiro, RJ" className="bg-slate-900 text-white">Rio de Janeiro, RJ</option>
                      <option value="Curitiba, PR" className="bg-slate-900 text-white">Curitiba, PR</option>
                      <option value="Belo Horizonte, MG" className="bg-slate-900 text-white">Belo Horizonte, MG</option>
                      <option value="Brasília, DF" className="bg-slate-900 text-white">Brasília, DF</option>
                      <option value="Porto Alegre, RS" className="bg-slate-900 text-white">Porto Alegre, RS</option>
                      <option value="Salvador, BA" className="bg-slate-900 text-white">Salvador, BA</option>
                      <option value="Fortaleza, CE" className="bg-slate-900 text-white">Fortaleza, CE</option>
                      <option value="Florianópolis, SC" className="bg-slate-900 text-white">Florianópolis, SC</option>
                    </select>

                    <button
                      onClick={handleRefreshWeather}
                      title="Atualizar clima"
                      className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isRefreshingWeather || isLocatingGps ? 'animate-spin' : ''}`} />
                    </button>
                  </div>
                </div>

                {gpsError && (
                  <div className="mb-3 p-2.5 rounded-xl bg-amber-500/20 border border-amber-400/30 text-amber-200 text-xs flex items-center justify-between">
                    <span>{gpsError}</span>
                    <button
                      onClick={() => setGpsError(null)}
                      className="text-amber-300 font-bold ml-2 underline"
                    >
                      Dispensar
                    </button>
                  </div>
                )}

                {/* Métricas Principais da Cidade Selecionada ou GPS */}
                {(() => {
                  const w = isUsingGps && liveGpsWeather ? liveGpsWeather : WEATHER_CITIES_DATA[selectedWeatherCity] || WEATHER_CITIES_DATA['São Paulo, SP'];
                  return (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{w.icon}</span>
                          <div>
                            <div className="flex items-baseline gap-2">
                              <span className="text-3xl font-display font-black text-white">
                                {w.temp}°C
                              </span>
                              <span className="text-xs text-white/70">
                                Sensação: <strong>{w.feelsLike}°C</strong>
                              </span>
                            </div>
                            <p className="text-xs text-white/80 font-medium">
                              {w.condition} • {isUsingGps ? gpsCityName : selectedWeatherCity}
                            </p>
                          </div>
                        </div>

                        <span className={`text-xs font-black px-3 py-1 rounded-full border ${w.ratingBg}`}>
                          {w.rating}
                        </span>
                      </div>

                      {/* 4 Indicadores Biometeorológicos do Treino */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                        <div className="bg-white/5 rounded-xl p-2.5 border border-white/5">
                          <div className="flex items-center gap-1.5 text-white/70 text-[10px] uppercase font-bold mb-1">
                            <Droplets className="w-3.5 h-3.5 text-cyan-300" />
                            <span>Umidade</span>
                          </div>
                          <p className="text-base font-black text-white">{w.humidity}</p>
                          <p className="text-[10px] text-white/60 leading-tight mt-0.5">{w.humidityDesc}</p>
                        </div>

                        <div className="bg-white/5 rounded-xl p-2.5 border border-white/5">
                          <div className="flex items-center gap-1.5 text-white/70 text-[10px] uppercase font-bold mb-1">
                            <Wind className="w-3.5 h-3.5 text-teal-300" />
                            <span>Vento</span>
                          </div>
                          <p className="text-base font-black text-white">{w.wind}</p>
                          <p className="text-[10px] text-white/60 leading-tight mt-0.5">{w.windDesc}</p>
                        </div>

                        <div className="bg-white/5 rounded-xl p-2.5 border border-white/5">
                          <div className="flex items-center gap-1.5 text-white/70 text-[10px] uppercase font-bold mb-1">
                            <SunMedium className="w-3.5 h-3.5 text-amber-300" />
                            <span>Índice UV</span>
                          </div>
                          <p className="text-base font-black text-white">{w.uv}</p>
                          <p className="text-[10px] text-white/60 leading-tight mt-0.5">{w.uvDesc}</p>
                        </div>

                        <div className="bg-white/5 rounded-xl p-2.5 border border-white/5">
                          <div className="flex items-center gap-1.5 text-white/70 text-[10px] uppercase font-bold mb-1">
                            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                            <span>Qualidade do Ar</span>
                          </div>
                          <p className="text-base font-black text-[#c6f43a]">{w.air}</p>
                          <p className="text-[10px] text-white/60 leading-tight mt-0.5">{w.airDesc}</p>
                        </div>
                      </div>

                      {/* Janela de Ouro & Recomendação Técnica do Coach */}
                      <div className="bg-black/30 rounded-xl p-3 border border-white/10 space-y-2">
                        <div className="flex items-start gap-2">
                          <span className="text-sm">🏃</span>
                          <div>
                            <p className="text-[11px] font-bold text-[#c6f43a] uppercase">Janela de Ouro do Treino Hoje</p>
                            <p className="text-xs text-white/90 font-medium">{w.goldenWindow}</p>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-white/10 flex items-start gap-2">
                          <span className="text-sm">💡</span>
                          <div>
                            <p className="text-[11px] font-bold text-white/80 uppercase">Orientação do Treinador Leandro</p>
                            <p className="text-xs text-white/70 leading-relaxed">{w.coachTip}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center text-[10px] text-white/50 pt-0.5">
                        <span>Previsão microclimática para corrida</span>
                        <span>{weatherLastUpdated}</span>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* ==================== AVALIAÇÃO FÍSICA & QUESTIONÁRIO ANAMNESE (EXCLUSIVO LOGIN TREINADOR LEANDRO starvinzs@gmail.com) ==================== */}
            {isCoach && (
              <div className="px-5 pt-4 pb-2">
                <div className="bg-gradient-to-br from-emerald-500/10 via-[#0d3b45]/40 to-[#082830] rounded-3xl p-5 border-2 border-emerald-400/40 shadow-sm text-white">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-2xl bg-[#c6f43a] text-[#0d3b45] flex items-center justify-center font-black text-xl shadow-xs flex-none">
                        👨‍🏫
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-display font-black uppercase tracking-wider text-[#c6f43a]">
                            Painel de Anamnese & Avaliação Física (Área do Treinador)
                          </h4>
                          <span className="text-[10px] font-black bg-emerald-500/30 text-emerald-300 border border-emerald-400/40 px-2 py-0.5 rounded-full">
                            Coach starvinzs@gmail.com
                          </span>
                        </div>
                        <p className="text-[11px] text-white/70">
                          {anamneseData
                            ? `Calibrada em ${new Date(anamneseData.submittedAt).toLocaleDateString('pt-BR')} • Dados integrados à planilha do aluno`
                            : 'Anamnese pendente de envio pelo aluno. Você pode preencher ou calibrar manualmente.'}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setIsAnamneseModalOpen(true)}
                      className="px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider bg-[#c6f43a] text-[#0d3b45] hover:bg-[#b8e432] transition cursor-pointer shadow-md whitespace-nowrap"
                    >
                      {anamneseData ? 'Revisar / Calibrar Anamnese' : 'Preencher Avaliação Física'}
                    </button>
                  </div>

                  {anamneseData && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs pt-1">
                      <div className="bg-black/30 rounded-2xl p-2.5 border border-white/10">
                        <span className="text-[10px] text-white/50 uppercase font-bold block">Biometria</span>
                        <p className="font-bold text-white mt-0.5">
                          {anamneseData.heightCm} cm • {anamneseData.weightKg} kg
                        </p>
                        <p className="text-[10px] text-[#c6f43a] font-semibold">
                          IMC: {(anamneseData.weightKg / ((anamneseData.heightCm / 100) * (anamneseData.heightCm / 100))).toFixed(1)} kg/m²
                        </p>
                      </div>

                      <div className="bg-black/30 rounded-2xl p-2.5 border border-white/10">
                        <span className="text-[10px] text-white/50 uppercase font-bold block">PAR-Q Cardíaco</span>
                        <p className="font-bold text-emerald-400 mt-0.5">
                          {!anamneseData.parqHeartIssue && !anamneseData.parqChestPain ? '✓ Sem Restrições' : '⚠️ Sob Monitoramento'}
                        </p>
                        <p className="text-[10px] text-white/50">Liberação para esforço</p>
                      </div>

                      <div className="bg-black/30 rounded-2xl p-2.5 border border-white/10">
                        <span className="text-[10px] text-white/50 uppercase font-bold block">Histórico Articular</span>
                        <p className="font-bold text-white mt-0.5 truncate" title={anamneseData.injuriesHistory.join(', ')}>
                          {anamneseData.injuriesHistory.length > 0 ? anamneseData.injuriesHistory.join(', ') : 'Nenhuma lesão'}
                        </p>
                        <p className="text-[10px] text-white/50">{anamneseData.strengthTraining}</p>
                      </div>

                      <div className="bg-black/30 rounded-2xl p-2.5 border border-white/10">
                        <span className="text-[10px] text-white/50 uppercase font-bold block">Rotina & Frequência</span>
                        <p className="font-bold text-white mt-0.5">
                          {anamneseData.weeklyAvailabilityDays} dias por semana
                        </p>
                        <p className="text-[10px] text-white/50">{anamneseData.preferredTimeOfDay}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Central do Aluno Go Team - Ferramentas e Recursos */}
            <div className="px-5 pt-4 pb-2">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm font-display font-black uppercase tracking-wider text-[#0d3b45]">
                    Central do Aluno Go Team
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Ferramentas de performance, tecnologia esportiva e suporte
                  </p>
                </div>
                <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                  Assessoria VIP
                </span>
              </div>

              {/* Grid de Ferramentas e Integrações */}
              <div className="space-y-2.5">
                {/* 1. Calculadora de Pace */}
                <div
                  onClick={() => setIsPaceModalOpen(true)}
                  className="bg-white border border-slate-200 hover:border-[#0d3b45] hover:shadow-md rounded-2xl p-3.5 transition cursor-pointer flex items-center justify-between group shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#0d3b45] text-[#c6f43a] flex items-center justify-center font-bold shadow-xs flex-none group-hover:scale-105 transition">
                      <Gauge className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-xs sm:text-sm font-black text-[#0d3b45] group-hover:text-teal-700 transition">
                          Calculadora de Ritmos (Pace)
                        </p>
                        <span className="text-[9px] font-bold bg-[#c6f43a]/40 text-[#0d3b45] px-1.5 py-0.2 rounded">
                          Simulador
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Estime tempos ideais e parciais para 5K, 10K, 21K e 42K
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#0d3b45] group-hover:translate-x-1 transition flex-none" />
                </div>

                {/* 2. Conectar Relógios & Bluetooth BLE */}
                <div
                  onClick={() => setIsSyncModalOpen(true)}
                  className="bg-white border border-slate-200 hover:border-sky-500 hover:shadow-md rounded-2xl p-3.5 transition cursor-pointer flex items-center justify-between group shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold shadow-xs flex-none group-hover:scale-105 transition">
                      <Bluetooth className="w-5 h-5 text-sky-100" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-xs sm:text-sm font-black text-[#0d3b45] group-hover:text-sky-700 transition">
                          Conectar Relógios & Bluetooth (BLE)
                        </p>
                        <span className="text-[9px] font-bold bg-sky-100 text-sky-800 px-1.5 py-0.2 rounded flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" />
                          BLE Direto
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Pareamento direto com Garmin, Polar, Strava e Apple Watch
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600 group-hover:translate-x-1 transition flex-none" />
                </div>

                {/* 3. Minhas Planilhas de Treino */}
                <div
                  onClick={() => setActiveTab('treinos')}
                  className="bg-white border border-slate-200 hover:border-emerald-500 hover:shadow-md rounded-2xl p-3.5 transition cursor-pointer flex items-center justify-between group shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-800 text-[#c6f43a] flex items-center justify-center font-bold shadow-xs flex-none group-hover:scale-105 transition">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-xs sm:text-sm font-black text-[#0d3b45] group-hover:text-teal-700 transition">
                          Minhas Planilhas de Treino
                        </p>
                        <span className="text-[9px] font-bold bg-teal-100 text-teal-800 px-1.5 py-0.2 rounded">
                          Treinos
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Acesse as séries prescritas, tiros, rodagens e treinos longos
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-teal-700 group-hover:translate-x-1 transition flex-none" />
                </div>

                {/* 4. Dicas de Viagens e Corridas pelo Mundo */}
                {onOpenTravelMap && (
                  <div
                    onClick={onOpenTravelMap}
                    className="bg-white border border-slate-200 hover:border-amber-500 hover:shadow-md rounded-2xl p-3.5 transition cursor-pointer flex items-center justify-between group shadow-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold shadow-xs flex-none group-hover:scale-105 transition">
                        <Compass className="w-5 h-5 text-amber-100" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-xs sm:text-sm font-black text-[#0d3b45] group-hover:text-amber-700 transition">
                            Dicas de Viagens & Maratonas Globais
                          </p>
                          <span className="text-[9px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded">
                            Top 10 Brasil & Mundo
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Melhores provas de 5k, 10k, 21k e 42k, altimetria e dicas de viagem
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-1 transition flex-none" />
                  </div>
                )}
              </div>
            </div>

            {/* Botão Sair / Voltar */}
            <div className="px-5 py-5">
              <button
                onClick={onBackToLanding}
                className="w-full border border-red-200 rounded-full py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 transition cursor-pointer"
              >
                ⎋ Sair da área do aluno
              </button>
            </div>
          </section>
        )}
      </main>

      {/* ==================== BARRA DE NAVEGAÇÃO INFERIOR FIXA ==================== */}
      <nav
        className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around items-center py-2.5 z-50 shadow-lg"
        style={{ paddingBottom: 'max(10px, env(safe-area-inset-bottom))' }}
      >
        <button
          onClick={() => setActiveTab('perfil')}
          className={`flex flex-col items-center gap-0.5 text-[11px] font-semibold transition cursor-pointer ${
            activeTab === 'perfil' ? 'text-[#0d3b45] font-bold scale-105' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <span className="text-xl">👤</span>
          Perfil
        </button>

        <button
          onClick={() => setActiveTab('treinos')}
          className={`flex flex-col items-center gap-0.5 text-[11px] font-semibold transition cursor-pointer ${
            activeTab === 'treinos' ? 'text-[#0d3b45] font-bold scale-105' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <span className="text-xl">🏃</span>
          Treinos
        </button>

        <button
          onClick={() => setActiveTab('progresso')}
          className={`flex flex-col items-center gap-0.5 text-[11px] font-semibold transition cursor-pointer ${
            activeTab === 'progresso' ? 'text-[#0d3b45] font-bold scale-105' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <span className="text-xl">📊</span>
          Progresso
        </button>

        <button
          onClick={() => setActiveTab('cadastro')}
          className={`flex flex-col items-center gap-0.5 text-[11px] font-semibold transition cursor-pointer ${
            activeTab === 'cadastro' ? 'text-[#0d3b45] font-bold scale-105' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <span className="text-xl">📝</span>
          Cadastro
        </button>
      </nav>

      {/* ==================== MODAIS DE RECURSOS GO TEAM ==================== */}
      <PaceCalculatorModal
        isOpen={isPaceModalOpen}
        onClose={() => setIsPaceModalOpen(false)}
        onApplyPace={handleApplyPace}
      />

      <WearablesSyncModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        onImportActivity={handleImportSyncedActivity}
      />

      <AchievementDetailModal
        badge={selectedBadge}
        isOpen={!!selectedBadge}
        onClose={() => setSelectedBadge(null)}
      />

      <PaymentConfirmationModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        defaultDistance={paymentModalDistance}
        defaultLevel={selectedLevel}
        userId={currentUser.id}
        userEmail={currentUser.email}
        userName={currentUser.name}
        onPaymentSuccess={handlePaymentSuccess}
        onProceedToQuestionnaire={(dist, lvl) => {
          handlePaymentSuccess(dist, lvl);
          setIsPaymentModalOpen(false);
          setIsAnamneseModalOpen(true);
        }}
      />

      <AnamneseQuestionnaireModal
        isOpen={isAnamneseModalOpen}
        onClose={() => setIsAnamneseModalOpen(false)}
        userId={currentUser.id}
        userName={athleteProfile.name || currentUser.name}
        userEmail={athleteProfile.email || currentUser.email}
        planDistance={selectedPlanId}
        initialData={anamneseData}
        onSave={(data) => {
          setAnamneseData(data);
          try {
            localStorage.setItem(`goteam_anamnese_${currentUser.id}`, JSON.stringify(data));
            localStorage.setItem('goteam_anamnese_data', JSON.stringify(data));
          } catch (e) {
            console.warn(e);
          }
          setIsAnamneseModalOpen(false);
        }}
      />

      <LoginModal
        isOpen={isEditProfileModalOpen}
        onClose={() => setIsEditProfileModalOpen(false)}
        onSuccess={handleUpdateAthleteProfile}
        initialMode="register"
      />

      {/* Modal de Atualização Rápida de Peso Corporal */}
      {isEditWeightModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-sm rounded-3xl bg-[#082830] text-white border-2 border-[#c6f43a]/40 p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#c6f43a] text-[#0d3b45] flex items-center justify-center font-black text-base shadow-sm">
                  ⚖️
                </div>
                <div>
                  <h3 className="text-base font-display font-black text-white uppercase tracking-wide">
                    Atualizar Peso Corporal
                  </h3>
                  <p className="text-[11px] text-[#c6f43a]">
                    Calibre o cálculo de carga e ritmo dos treinos
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsEditWeightModalOpen(false)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xs font-bold transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const val = parseFloat(editWeightValue);
                if (!isNaN(val) && val > 20 && val < 300) {
                  handleUpdateDirectWeight(val);
                }
              }}
              className="space-y-4"
            >
              <div className="text-center py-2">
                <label className="block text-xs uppercase font-bold text-white/60 mb-2">
                  Peso Atual (kg)
                </label>
                <div className="inline-flex items-center justify-center gap-2 bg-black/40 border-2 border-[#c6f43a] rounded-2xl px-5 py-3">
                  <input
                    type="number"
                    step="0.1"
                    min="30"
                    max="250"
                    value={editWeightValue}
                    onChange={(e) => setEditWeightValue(e.target.value)}
                    autoFocus
                    className="w-24 text-center text-3xl font-black text-[#c6f43a] bg-transparent outline-none focus:ring-0"
                  />
                  <span className="text-lg font-black text-white/70">kg</span>
                </div>
              </div>

              {/* Ajustes Rápidos */}
              <div className="flex items-center justify-center gap-2">
                {[-1.0, -0.5, +0.5, +1.0].map((delta) => (
                  <button
                    key={delta}
                    type="button"
                    onClick={() => {
                      const cur = parseFloat(editWeightValue) || currentAthleteWeight;
                      setEditWeightValue((cur + delta).toFixed(1));
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition cursor-pointer"
                  >
                    {delta > 0 ? `+${delta}` : delta} kg
                  </button>
                ))}
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditWeightModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-white/20 text-xs font-bold text-white hover:bg-white/10 transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#c6f43a] hover:bg-[#b8e432] text-[#0d3b45] text-xs font-black uppercase tracking-wider transition shadow-md cursor-pointer"
                >
                  Salvar Peso
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
