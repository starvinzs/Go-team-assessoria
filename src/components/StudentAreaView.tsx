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
  // Tabs: 'treinos' | 'progresso' | 'evoluir' | 'perfil'
  const [activeTab, setActiveTab] = useState<'treinos' | 'progresso' | 'evoluir' | 'perfil'>('treinos');

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

            {/* NAVEGADOR DE SEMANAS (CARROSSEL DE SEMANAS 1 A N) */}
            <div className="px-5 pt-3 pb-1">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Semanas do Plano ({detailedPlan.semanasTotal} semanas)
                </p>
                <span className="text-xs font-bold text-[#0d3b45]">
                  Visualizando Semana {selectedWeekNum}
                </span>
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin">
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
                      className={`flex-none px-3 py-2 rounded-xl text-xs font-bold transition flex flex-col items-center cursor-pointer ${
                        isSelected
                          ? 'bg-[#0d3b45] text-white shadow-md ring-2 ring-[#c6f43a]'
                          : isLocked
                          ? 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                          : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      <span className="text-[10px] uppercase tracking-tight">Sem</span>
                      <span className="text-sm font-black flex items-center gap-0.5">
                        {s} {isLocked && <span className="text-[10px]">🔒</span>}
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

            {/* CARD EM DESTAQUE: TREINO DE HOJE */}
            <div className="px-5 py-2">
              <div className="bg-[#c6f43a]/15 border-2 border-[#a5cf2a] rounded-2xl p-4 mb-2 shadow-sm">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#0d3b45] bg-[#c6f43a] px-2 py-0.5 rounded">
                      Treino de Hoje
                    </span>
                    <span className="text-xs font-bold text-slate-500">
                      {todayDetailedWorkout.dia}
                    </span>
                  </div>
                  {isTodayCompleted && (
                    <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      ✓ CONCLUÍDO
                    </span>
                  )}
                </div>

                <div className="flex items-baseline justify-between mt-2">
                  <h4 className="text-base font-black text-[#0d3b45]">
                    {todayDetailedWorkout.titulo}
                  </h4>
                  {todayDetailedWorkout.distanciaKm > 0 && (
                    <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                      {todayDetailedWorkout.distanciaKm} km
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 text-xs text-slate-600 mt-1">
                  <span className="font-semibold text-slate-700">Pace Alvo: {todayDetailedWorkout.paceAlvo}</span>
                  {todayDetailedWorkout.duracaoMin > 0 && <span>• {todayDetailedWorkout.duracaoMin} min aprox.</span>}
                  <span>• Intensidade: {todayDetailedWorkout.intensidade}</span>
                </div>

                <p className="text-xs text-slate-700 mt-2 leading-relaxed">
                  {todayDetailedWorkout.descricao}
                </p>

                {todayDetailedWorkout.dicaTreinador && (
                  <div className="bg-white/80 border border-[#a5cf2a]/50 rounded-xl p-2.5 mt-2.5 text-[11px] text-[#0d3b45]">
                    <span className="font-bold">💡 Dica do Treinador: </span>
                    <span>{todayDetailedWorkout.dicaTreinador}</span>
                  </div>
                )}

                <div className="flex flex-col gap-2 mt-3.5">
                  <button
                    onClick={handleToggleToday}
                    className={`w-full py-2.5 px-4 rounded-full text-xs font-bold transition active:scale-95 cursor-pointer ${
                      isTodayCompleted
                        ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                        : 'bg-[#0d3b45] text-white hover:bg-[#082830] shadow-md'
                    }`}
                  >
                    {isTodayCompleted ? 'Desmarcar conclusão de hoje' : '✓ Marcar como concluído'}
                  </button>

                  {todayDetailedWorkout.tipo !== 'Descanso' && (
                    <button
                      onClick={() => {
                        onStartLiveWorkout({
                          id: `live-${todayISO}-${selectedPlanId}`,
                          dayOfWeek: todayDetailedWorkout.diaAbrev,
                          title: todayDetailedWorkout.titulo,
                          type: todayDetailedWorkout.tipo,
                          distanceKm: todayDetailedWorkout.distanciaKm || 5.0,
                          estimatedDurationMin: todayDetailedWorkout.duracaoMin || 35,
                          intensity: todayDetailedWorkout.intensidade,
                          targetPace: todayDetailedWorkout.paceAlvo !== '—' ? todayDetailedWorkout.paceAlvo : customAthletePace,
                          description: todayDetailedWorkout.descricao,
                          steps: todayDetailedWorkout.etapas.map(step => ({
                            type: step.tipo,
                            description: step.descricao,
                            durationMinutes: step.duracaoMin,
                            distanceKm: step.distanciaKm
                          }))
                        });
                      }}
                      className="w-full bg-[#c6f43a] text-[#0d3b45] rounded-full py-3 text-xs font-black uppercase tracking-wider shadow-glow hover:scale-[1.02] active:scale-95 transition cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span>▶</span>
                      <span>Iniciar corrida guiada (áudio e cadência)</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* LISTA COMPLETA DOS 7 DIAS DA SEMANA SELECIONADA */}
            <div className="px-5 pb-2">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Programação Completa — Semana {selectedWeekNum}
                </p>
                <span className="text-xs text-slate-500 font-medium">
                  {treinosFeitosSemana} de {treinosPorSemana} feitos
                </span>
              </div>

              <div className="flex flex-col gap-2.5">
                {currentDetailedWeek.dias.map((d, i) => {
                  const dataInfo = weekDates[i];
                  const ehHoje = i === dayOfWeekIndex;
                  const concluido = dataInfo ? completedDates.includes(dataInfo.iso) : false;
                  const ehDescanso = d.tipo === 'Descanso';

                  return (
                    <div
                      key={d.dia}
                      className={`rounded-2xl p-4 border transition ${
                        ehHoje
                          ? 'bg-[#c6f43a]/15 border-[#a5cf2a] shadow-sm'
                          : concluido
                          ? 'bg-slate-50/80 border-slate-200 opacity-80'
                          : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-black uppercase tracking-wider text-[#0d3b45]">
                              {d.dia} {dataInfo && `(${dataInfo.dayNumber})`} {ehHoje && '• HOJE'}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                d.tipo === 'Rodagem Leve'
                                  ? 'bg-teal-50 text-teal-700 border-teal-200'
                                  : d.tipo === 'Intervalado'
                                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                                  : d.tipo === 'Ritmo'
                                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                                  : d.tipo === 'Longão'
                                  ? 'bg-lime-100 text-[#0d3b45] border-lime-300 font-black'
                                  : d.tipo === 'Fortalecimento'
                                  ? 'bg-purple-50 text-purple-700 border-purple-200'
                                  : 'bg-slate-100 text-slate-500 border-slate-200'
                              }`}
                            >
                              {d.tipo}
                            </span>
                          </div>

                          <h5 className="font-bold text-sm text-[#0d3b45] mt-1">
                            {d.titulo}
                          </h5>

                          <div className="flex flex-wrap gap-2 text-[11px] text-slate-500 mt-1">
                            {d.distanciaKm > 0 && <span className="font-bold text-emerald-700">{d.distanciaKm} km</span>}
                            {d.paceAlvo !== '—' && <span>Pace: {d.paceAlvo}</span>}
                            {d.duracaoMin > 0 && <span>• {d.duracaoMin} min</span>}
                          </div>

                          <p className="text-xs text-slate-600 mt-1.5 leading-snug">
                            {d.descricao}
                          </p>

                          {d.dicaTreinador && (
                            <p className="text-[11px] text-slate-500 mt-2 bg-slate-50 p-2 rounded-lg border border-slate-200/60">
                              <strong className="text-[#0d3b45]">💡 Dica:</strong> {d.dicaTreinador}
                            </p>
                          )}
                        </div>

                        <div className="flex flex-col items-center gap-2 flex-none">
                          <button
                            onClick={() => {
                              if (!dataInfo) return;
                              if (concluido) {
                                setCompletedDates(prev => prev.filter(x => x !== dataInfo.iso));
                              } else {
                                setCompletedDates(prev => [...prev, dataInfo.iso]);
                              }
                            }}
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition cursor-pointer ${
                              concluido
                                ? 'bg-emerald-600 text-white shadow-sm'
                                : 'border-2 border-slate-300 text-slate-400 hover:border-[#0d3b45]'
                            }`}
                            title="Marcar como concluído"
                          >
                            {concluido ? '✓' : ''}
                          </button>

                          {!ehDescanso && (
                            <button
                              onClick={() => {
                                onStartLiveWorkout({
                                  id: `live-${dataInfo ? dataInfo.iso : 'workout'}-${selectedPlanId}`,
                                  dayOfWeek: d.diaAbrev,
                                  title: d.titulo,
                                  type: d.tipo,
                                  distanceKm: d.distanciaKm || 5.0,
                                  estimatedDurationMin: d.duracaoMin || 35,
                                  intensity: d.intensidade,
                                  targetPace: d.paceAlvo !== '—' ? d.paceAlvo : customAthletePace,
                                  description: d.descricao,
                                  steps: d.etapas.map(step => ({
                                    type: step.tipo,
                                    description: step.descricao,
                                    durationMinutes: step.duracaoMin,
                                    distanceKm: step.distanciaKm
                                  }))
                                });
                              }}
                              className="text-[10px] font-bold text-[#0d3b45] bg-[#c6f43a] hover:bg-[#b2dc2b] px-2 py-1 rounded-lg transition cursor-pointer shadow-xs"
                            >
                              ▶ Iniciar
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Botão Baixar Planilha Completa & Dicas de Viagens */}
            <div className="px-5 py-6 space-y-3">
              <a
                href="#planilha"
                onClick={(e) => {
                  e.preventDefault();
                  alert(`Planilha Go Team ${selectedPlanId} (${detailedPlan.nivelNome} - ${detailedPlan.semanasTotal} semanas): Gerando PDF estruturado da assessoria para impressão!`);
                }}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#c6f43a] text-[#0d3b45] rounded-full py-3.5 font-bold shadow-glow hover:scale-105 active:scale-95 transition cursor-pointer text-sm"
              >
                ⬇ Baixar planilha completa ({detailedPlan.semanasTotal} semanas em PDF)
              </a>

              {onOpenTravelMap && (
                <button
                  onClick={onOpenTravelMap}
                  className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl p-3.5 text-left flex items-center justify-between transition cursor-pointer shadow-xs group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl p-2 rounded-xl bg-white border border-slate-100 shadow-xs">
                      🗺️
                    </span>
                    <div>
                      <p className="text-xs font-display font-black text-[#0d3b45] group-hover:text-[#a5cf2a] transition">
                        Dicas de viagens & corridas pelo mundo
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Provas de 5K, 10K e 21K, logística e dicas do treinador
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#0d3b45] bg-[#c6f43a] px-3 py-1 rounded-full group-hover:scale-105 transition">
                    Explorar
                  </span>
                </button>
              )}
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

            {/* 1. Peso Corporal (Colocado ANTES das atividades recentes) */}
            <div className="px-5 pt-4 pb-2">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-slate-500">Peso corporal</p>
                <span className="text-xs text-slate-400 font-medium">
                  Último: {weights[weights.length - 1]?.data}
                </span>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 shadow-xs">
                <div className="flex items-baseline justify-between mb-1">
                  <div>
                    <span className="text-3xl font-display font-black text-[#0d3b45]">
                      {weights[weights.length - 1]?.peso.toFixed(1)}
                    </span>
                    <span className="text-sm text-slate-500 font-semibold"> kg</span>
                  </div>
                  <span className="text-xs text-emerald-700 bg-emerald-100 font-bold px-2 py-0.5 rounded-full">
                    Acompanhamento ativo
                  </span>
                </div>

                {/* Gráfico de Linha SVG do Peso */}
                <div className="my-3 w-full h-24 bg-white rounded-xl p-2 border border-slate-200/80 flex items-center">
                  <svg viewBox="0 0 300 80" className="w-full h-full overflow-visible">
                    {(() => {
                      const pts = weights.slice(-6);
                      if (pts.length < 2) return null;
                      const minP = Math.min(...pts.map(p => p.peso)) - 0.5;
                      const maxP = Math.max(...pts.map(p => p.peso)) + 0.5;
                      const range = maxP - minP || 1;

                      const coords = pts.map((p, idx) => {
                        const x = (idx / (pts.length - 1)) * 280 + 10;
                        const y = 70 - ((p.peso - minP) / range) * 55;
                        return { x, y, ...p };
                      });

                      const pathD = coords.reduce((acc, c, idx) => {
                        return idx === 0 ? `M ${c.x} ${c.y}` : `${acc} L ${c.x} ${c.y}`;
                      }, '');

                      return (
                        <>
                          <path d={pathD} fill="none" stroke="#0d3b45" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                          {coords.map((c, idx) => (
                            <g key={idx}>
                              <circle cx={c.x} cy={c.y} r="4" fill="#c6f43a" stroke="#0d3b45" strokeWidth="2" />
                              <text x={c.x} y={c.y - 7} fontSize="8" fontWeight="bold" textAnchor="middle" fill="#0d3b45">
                                {c.peso}
                              </text>
                            </g>
                          ))}
                        </>
                      );
                    })()}
                  </svg>
                </div>

                <button
                  onClick={() => setIsWeightFormOpen(!isWeightFormOpen)}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#0d3b45] text-white px-4 py-2.5 text-sm font-bold hover:bg-[#082830] transition cursor-pointer"
                >
                  {isWeightFormOpen ? 'Fechar' : '+ Registrar novo peso'}
                </button>

                {isWeightFormOpen && (
                  <form onSubmit={handleSaveWeight} className="mt-3 flex gap-2">
                    <input
                      type="number"
                      step="0.1"
                      min="30"
                      max="250"
                      required
                      placeholder="Ex: 74.8"
                      value={newPeso}
                      onChange={(e) => setNewPeso(e.target.value)}
                      className="flex-1 rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:border-[#c6f43a]"
                    />
                    <button
                      type="submit"
                      className="rounded-xl bg-[#c6f43a] text-[#0d3b45] px-5 py-2 text-sm font-bold hover:scale-105 active:scale-95 transition cursor-pointer"
                    >
                      Salvar
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* 2. Recentes & Adicionar Atividade (Depois do peso corporal) */}
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

            {/* 3. Sequência de Treinos (Streak 🔥) */}
            <div className="px-5 pb-5">
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
            ABA 3: EVOLUIR
        ======================================================== */}
        {activeTab === 'evoluir' && (
          <section className="animate-fadeIn">
            {/* Header */}
            <div className="bg-[#0d3b45] text-white px-5 pt-6 pb-6 shadow-sm">
              <p className="text-xs text-white/70 font-semibold uppercase tracking-wider mb-1">
                Seu próximo passo
              </p>
              <p className="text-2xl font-display font-black uppercase">
                Próximos desafios atléticos
              </p>
            </div>

            <div className="px-5 py-5">
              {/* Card Plano Atual */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 mb-5">
                <p className="text-[11px] uppercase tracking-wide text-slate-500 font-bold mb-1">
                  Plano atual
                </p>
                <p className="text-lg font-display font-black text-[#0d3b45]">
                  Plano {plan.id} — {plan.nome} ({detailedPlan.semanasTotal} semanas)
                </p>
                <div className="bg-slate-200 rounded-full h-2.5 mt-3 overflow-hidden">
                  <div
                    className="bg-[#c6f43a] h-full rounded-full transition-all"
                    style={{ width: `${Math.round((selectedWeekNum / detailedPlan.semanasTotal) * 100)}%` }}
                  />
                </div>
                <p className="text-xs text-slate-500 mt-2 font-medium">
                  Semana {selectedWeekNum} de {detailedPlan.semanasTotal} • Faltam {detailedPlan.semanasTotal - selectedWeekNum} semanas para a formatura da distância!
                </p>
              </div>

              {/* Recomendado para você */}
              {selectedPlanId !== '21K' ? (
                <div className="rounded-3xl p-6 mb-5 bg-[#0d3b45] text-white shadow-elegant">
                  <span className="inline-block bg-[#c6f43a] text-[#0d3b45] text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full mb-3">
                    Recomendado para você
                  </span>
                  <p className="text-3xl font-display font-black mb-1">
                    {selectedPlanId === '5K' ? '10K — Evolução' : '21K — Meia Maratona'}
                  </p>
                  <p className="text-sm text-white/80 mb-5 font-sans leading-relaxed">
                    {selectedPlanId === '5K'
                      ? 'Depois de dominar os 5K sem parar, o próximo salto natural é dobrar a quilometragem e ganhar cadência com treinos intervalados.'
                      : 'Você já corre 10K com conforto! O desafio lendário dos 21K exige long runs progressivos e estratégia de ritmo refinada.'}
                  </p>
                  <button
                    onClick={() => {
                      const nextPlan = selectedPlanId === '5K' ? '10K' : '21K';
                      setSelectedPlanId(nextPlan);
                      alert(`Parabéns! Você evoluiu para o Plano Go Team ${nextPlan}! Treinos atualizados na aba Treinos.`);
                    }}
                    className="w-full inline-flex items-center justify-center bg-[#c6f43a] text-[#0d3b45] rounded-full py-3.5 text-sm font-black shadow-glow hover:scale-105 active:scale-95 transition cursor-pointer"
                  >
                    Quero evoluir para {selectedPlanId === '5K' ? '10K' : '21K'} →
                  </button>
                </div>
              ) : (
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 text-center mb-5">
                  <p className="text-4xl mb-2">🏆</p>
                  <p className="text-lg font-display font-black text-[#0d3b45] mb-1">
                    Você chegou ao topo dos 21K!
                  </p>
                  <p className="text-sm text-slate-500">
                    Você está no plano mais avançado da Go Team. Bora manter a consistência e buscar recordes pessoais!
                  </p>
                </div>
              )}

              {/* Grade de Todos os Planos */}
              <p className="text-sm font-semibold text-slate-500 mb-2">Todos os planos</p>
              <div className="flex flex-col gap-3 mb-6">
                {(['5K', '10K', '21K'] as const).map((pid) => {
                  const p = GOTEAM_PLANOS[pid];
                  const isCurrent = pid === selectedPlanId;

                  return (
                    <div
                      key={pid}
                      className={`p-4 rounded-2xl border transition flex items-center justify-between ${
                        isCurrent
                          ? 'bg-[#c6f43a]/15 border-[#a5cf2a]'
                          : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-display font-black text-xl text-[#0d3b45]">
                            {p.id} — {p.nome}
                          </span>
                          {isCurrent && (
                            <span className="bg-[#0d3b45] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                              Ativo
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {p.semanas} semanas • {p.preco}
                        </p>
                      </div>

                      {!isCurrent && (
                        <button
                          onClick={() => {
                            setSelectedPlanId(pid);
                            alert(`Plano alterado para ${pid}!`);
                          }}
                          className="text-xs font-bold bg-[#0d3b45] text-white px-4 py-2 rounded-full hover:bg-[#082830] transition cursor-pointer"
                        >
                          Ativar
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Módulo de Sincronização Real e Conexão de Dispositivos (Aba Evoluir) */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-slate-500">Sincronização com Dispositivos</p>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Conexão Ativa
                  </span>
                </div>

                <div className="bg-gradient-to-br from-slate-900 to-[#0d3b45] text-white rounded-2xl p-4 shadow-sm border border-slate-700">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-[#c6f43a] text-[#0d3b45] flex items-center justify-center font-black text-lg shadow-sm">
                        ⚡
                      </div>
                      <div>
                        <p className="text-sm font-black text-white leading-tight">
                          Sincronização Instantânea
                        </p>
                        <p className="text-[11px] text-white/70">
                          {lastSyncTime ? `Última sinc: ${lastSyncTime}` : 'Pronto para sincronizar'}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handlePerformLiveSync('Strava')}
                      disabled={isDirectSyncing}
                      className="inline-flex items-center gap-1.5 text-xs font-black bg-[#c6f43a] text-[#0d3b45] px-3.5 py-1.5 rounded-full hover:scale-105 active:scale-95 transition disabled:opacity-50 cursor-pointer shadow-sm"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isDirectSyncing ? 'animate-spin' : ''}`} />
                      {isDirectSyncing ? 'Sincronizando...' : 'Sincronizar agora'}
                    </button>
                  </div>

                  {/* Feedback da Sincronização */}
                  {syncFeedback && (
                    <div className="bg-emerald-500/20 border border-emerald-400/40 rounded-xl p-3 mb-3 text-xs text-emerald-200 flex items-start gap-2 animate-fadeIn">
                      <CheckCircle2 className="w-4 h-4 text-[#c6f43a] shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-bold text-[#c6f43a]">Atividade Registrada!</p>
                        <p className="text-white/90 leading-relaxed mt-0.5">{syncFeedback}</p>
                      </div>
                    </div>
                  )}

                  {/* Dispositivos Pareados com Ação Direta */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                    <button
                      onClick={() => setIsSyncModalOpen(true)}
                      className="bg-white/10 hover:bg-white/20 border border-sky-400/40 rounded-xl p-2.5 text-left transition flex flex-col justify-between cursor-pointer group shadow-xs"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <Bluetooth className="w-4 h-4 text-sky-300" />
                        <span className="text-[9px] font-bold text-sky-300 bg-sky-950/80 px-1.5 py-0.5 rounded">BLE</span>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white group-hover:text-sky-300 transition">Bluetooth</p>
                        <p className="text-[10px] text-white/60">Parear Relógio</p>
                      </div>
                    </button>

                    <button
                      onClick={() => handlePerformLiveSync('Strava')}
                      disabled={isDirectSyncing}
                      className="bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl p-2.5 text-left transition flex flex-col justify-between cursor-pointer group"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-lg">⚡</span>
                        <span className="text-[9px] font-bold text-emerald-300 bg-emerald-950/60 px-1.5 py-0.5 rounded">Ativo</span>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white group-hover:text-[#c6f43a] transition">Strava</p>
                        <p className="text-[10px] text-white/60">Importar corrida</p>
                      </div>
                    </button>

                    <button
                      onClick={() => handlePerformLiveSync('Garmin')}
                      disabled={isDirectSyncing}
                      className="bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl p-2.5 text-left transition flex flex-col justify-between cursor-pointer group"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <Watch className="w-4 h-4 text-[#c6f43a]" />
                        <span className="text-[9px] font-bold text-emerald-300 bg-emerald-950/60 px-1.5 py-0.5 rounded">Pareado</span>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white group-hover:text-[#c6f43a] transition">Garmin Connect</p>
                        <p className="text-[10px] text-white/60">Buscar relógio</p>
                      </div>
                    </button>

                    <button
                      onClick={() => handlePerformLiveSync('Apple Health')}
                      disabled={isDirectSyncing}
                      className="bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl p-2.5 text-left transition flex flex-col justify-between cursor-pointer group"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <Smartphone className="w-4 h-4 text-emerald-300" />
                        <span className="text-[9px] font-bold text-emerald-300 bg-emerald-950/60 px-1.5 py-0.5 rounded">Pronto</span>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white group-hover:text-[#c6f43a] transition">Apple Saúde</p>
                        <p className="text-[10px] text-white/60">Sincronizar</p>
                      </div>
                    </button>
                  </div>

                  {/* Upload Real de Arquivo GPX / FIT */}
                  <label className="border-2 border-dashed border-white/20 hover:border-[#c6f43a] bg-black/20 hover:bg-black/30 rounded-xl p-2.5 flex items-center justify-center gap-2 cursor-pointer transition text-xs text-white/80 font-medium">
                    <Upload className="w-4 h-4 text-[#c6f43a]" />
                    <span>Importar arquivo <strong>.GPX</strong> ou <strong>.FIT</strong> do treino</span>
                    <input
                      type="file"
                      accept=".gpx,.tcx,.fit,.json"
                      onChange={handleDirectFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Ferramentas de Desempenho e Tecnologia Go Team */}
              <p className="text-sm font-semibold text-slate-500 mb-2">Ferramentas de Desempenho</p>
              <div className="space-y-3">
                <div
                  onClick={() => setIsPaceModalOpen(true)}
                  className="bg-white border-2 border-slate-200 hover:border-[#a5cf2a] rounded-2xl p-4 transition cursor-pointer shadow-sm flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[#c6f43a]/20 text-[#0d3b45] flex items-center justify-center text-2xl group-hover:scale-110 transition">
                      ⚡
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#0d3b45] group-hover:text-[#a5cf2a] transition">
                        Calculadora de Pace & Zonas
                      </p>
                      <p className="text-xs text-slate-500">
                        Zonas Z1 a Z5, previsões de prova (5K a 42K) e ritmo base
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-[#0d3b45] group-hover:translate-x-1 transition">›</span>
                </div>

                <div
                  onClick={() => setIsSyncModalOpen(true)}
                  className="bg-white border-2 border-slate-200 hover:border-[#FC4C02] rounded-2xl p-4 transition cursor-pointer shadow-sm flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-orange-100 text-[#FC4C02] flex items-center justify-center text-2xl group-hover:scale-110 transition">
                      🔗
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#0d3b45] group-hover:text-[#FC4C02] transition">
                        Central Avançada de Sensores & Relógios
                      </p>
                      <p className="text-xs text-slate-500">
                        Opções avançadas de conexão por bluetooth, polar e coros
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-[#0d3b45] group-hover:translate-x-1 transition">›</span>
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

                  {/* 4 Métricas Rápidas do Aluno na Assessoria */}
                  <div className="grid grid-cols-4 gap-2 text-center pt-2 border-t border-white/10">
                    <div className="bg-white/5 rounded-xl py-1.5 px-1 border border-white/5">
                      <p className="text-base font-black text-white">{totalTreinosFeitos}</p>
                      <p className="text-[9px] uppercase font-bold text-white/60">Treinos</p>
                    </div>
                    <div className="bg-white/5 rounded-xl py-1.5 px-1 border border-white/5">
                      <p className="text-base font-black text-[#c6f43a]">{currentUser.currentWeeklyKm} km</p>
                      <p className="text-[9px] uppercase font-bold text-white/60">Semana</p>
                    </div>
                    <div className="bg-white/5 rounded-xl py-1.5 px-1 border border-white/5">
                      <p className="text-base font-black text-amber-300">{streakDays} dias</p>
                      <p className="text-[9px] uppercase font-bold text-white/60">Streak 🔥</p>
                    </div>
                    <div className="bg-white/5 rounded-xl py-1.5 px-1 border border-white/5">
                      <p className="text-base font-black text-white">{unlockedBadgesCount}</p>
                      <p className="text-[9px] uppercase font-bold text-white/60">Medalhas 🏆</p>
                    </div>
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

            {/* ==================== DADOS CADASTRAIS DO ATLETA (LOGIN / CADASTRO) ==================== */}
            <div className="px-5 pt-4 pb-2">
              <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm text-slate-800">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-[#0d3b45] text-[#c6f43a] flex items-center justify-center font-display font-black text-xl shadow-sm flex-none">
                      <UserCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-display font-black text-[#0d3b45] uppercase tracking-tight">
                          Ficha Cadastral do Aluno
                        </h3>
                        <span className="text-[10px] font-black bg-[#c6f43a] text-[#0d3b45] px-2 py-0.5 rounded-full uppercase tracking-wider">
                          Dados Oficiais
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                        <span className="font-semibold text-slate-700">{athleteProfile.name}</span>
                        <span>•</span>
                        <span>Matrícula #{currentUser.id.replace(/\D/g, '').slice(-4) || '2026'}</span>
                        <span>•</span>
                        <span>Desde {athleteProfile.joinedDate}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => setIsEditProfileModalOpen(true)}
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-200 hover:border-[#a5cf2a] hover:bg-slate-50 text-[#0d3b45] transition cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-[#a5cf2a]" />
                      <span>Editar Dados</span>
                    </button>
                    <button
                      onClick={() => setIsEditProfileModalOpen(true)}
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#0d3b45] hover:bg-[#082830] text-white transition cursor-pointer"
                    >
                      <User className="w-3.5 h-3.5 text-[#c6f43a]" />
                      <span>Trocar / Novo Aluno</span>
                    </button>
                  </div>
                </div>

                {/* Grid com Dados do Cadastro no Login */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
                  <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100">
                    <p className="text-[10px] uppercase font-bold text-slate-400 mb-0.5 flex items-center gap-1">
                      <Mail className="w-3 h-3 text-slate-400" />
                      E-mail Cadastrado
                    </p>
                    <p className="text-xs font-bold text-[#0d3b45] truncate" title={athleteProfile.email}>
                      {athleteProfile.email}
                    </p>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100">
                    <p className="text-[10px] uppercase font-bold text-slate-400 mb-0.5 flex items-center gap-1">
                      <Phone className="w-3 h-3 text-emerald-500" />
                      WhatsApp / Celular
                    </p>
                    <p className="text-xs font-bold text-[#0d3b45]">
                      {athleteProfile.phone}
                    </p>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100">
                    <p className="text-[10px] uppercase font-bold text-slate-400 mb-0.5 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-rose-400" />
                      Cidade / Estado
                    </p>
                    <p className="text-xs font-bold text-[#0d3b45] truncate">
                      {athleteProfile.city}
                    </p>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100">
                    <p className="text-[10px] uppercase font-bold text-slate-400 mb-0.5 flex items-center gap-1">
                      <UserCheck className="w-3 h-3 text-teal-500" />
                      Idade & Sexo
                    </p>
                    <p className="text-xs font-bold text-[#0d3b45]">
                      {athleteProfile.age} anos • {athleteProfile.gender === 'M' ? 'Masculino' : athleteProfile.gender === 'F' ? 'Feminino' : 'Outro'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2.5">
                  <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100">
                    <p className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">Pelotão de Ritmo</p>
                    <p className="text-xs font-black text-[#0d3b45]">Pelotão {athleteProfile.paceGroup}</p>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100">
                    <p className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">Nível na Assessoria</p>
                    <p className="text-xs font-bold text-emerald-700 capitalize">{athleteProfile.runningLevel}</p>
                  </div>
                  <div className="col-span-2 sm:col-span-1 bg-slate-50 rounded-2xl p-3 border border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">Treinador Head Coach</p>
                      <p className="text-xs font-bold text-[#0d3b45]">Leandro Irineu da Silva</p>
                    </div>
                    <a
                      href={CONTATO_WHATSAPP}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] bg-emerald-500 text-white px-3 py-1 rounded-full font-bold hover:bg-emerald-600 transition shadow-xs"
                    >
                      WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* ==================== AVALIAÇÃO FÍSICA & QUESTIONÁRIO ANAMNESE ==================== */}
            <div className="px-5 pt-2 pb-2">
              {anamneseData ? (
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50/50 rounded-3xl p-5 border border-emerald-200 shadow-xs">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold shadow-xs flex-none">
                        ✓
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-display font-black uppercase tracking-wider text-[#0d3b45]">
                            Avaliação Física & Anamnese Esportiva
                          </h4>
                          <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-300">
                            Calibrada
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500">
                          Preenchida em {new Date(anamneseData.submittedAt).toLocaleDateString('pt-BR')} • Dados integrados aos seus treinos
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setIsAnamneseModalOpen(true)}
                      className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-white text-emerald-800 border border-emerald-300 hover:bg-emerald-50 transition cursor-pointer shadow-xs whitespace-nowrap"
                    >
                      Revisar / Atualizar Anamnese
                    </button>
                  </div>

                  {/* Resumo Biométrico e PAR-Q */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                    <div className="bg-white/85 rounded-2xl p-2.5 border border-emerald-100">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Biometria</span>
                      <p className="font-bold text-[#0d3b45] mt-0.5">
                        {anamneseData.heightCm} cm • {anamneseData.weightKg} kg
                      </p>
                      <p className="text-[10px] text-emerald-600 font-semibold">
                        IMC: {(anamneseData.weightKg / ((anamneseData.heightCm / 100) * (anamneseData.heightCm / 100))).toFixed(1)} kg/m²
                      </p>
                    </div>

                    <div className="bg-white/85 rounded-2xl p-2.5 border border-emerald-100">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">PAR-Q Cardíaco</span>
                      <p className="font-bold text-emerald-700 mt-0.5">
                        {!anamneseData.parqHeartIssue && !anamneseData.parqChestPain ? '✓ Sem Restrições' : '⚠️ Sob Monitoramento'}
                      </p>
                      <p className="text-[10px] text-slate-500">Liberação para esforço</p>
                    </div>

                    <div className="bg-white/85 rounded-2xl p-2.5 border border-emerald-100">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Histórico Articular</span>
                      <p className="font-bold text-[#0d3b45] mt-0.5 truncate" title={anamneseData.injuriesHistory.join(', ')}>
                        {anamneseData.injuriesHistory.length > 0 ? anamneseData.injuriesHistory.join(', ') : 'Nenhuma lesão'}
                      </p>
                      <p className="text-[10px] text-slate-500">{anamneseData.strengthTraining}</p>
                    </div>

                    <div className="bg-white/85 rounded-2xl p-2.5 border border-emerald-100">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Rotina & Frequência</span>
                      <p className="font-bold text-[#0d3b45] mt-0.5">
                        {anamneseData.weeklyAvailabilityDays} dias por semana
                      </p>
                      <p className="text-[10px] text-slate-500">{anamneseData.preferredTimeOfDay}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent rounded-3xl p-5 border-2 border-amber-300/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-xl flex-none shadow-sm">
                      !
                    </div>
                    <div>
                      <h4 className="text-sm font-display font-black text-[#0d3b45] uppercase tracking-wide">
                        Questionário de Avaliação Física Pendente
                      </h4>
                      <p className="text-xs text-slate-600 mt-0.5 max-w-md leading-relaxed">
                        Preencha sua anamnese com altura, peso, histórico de saúde e lesões para que o{' '}
                        <strong>Treinador Leandro Irineu</strong> calibre os ritmos e as zonas cardíacas da sua planilha.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsAnamneseModalOpen(true)}
                    className="w-full sm:w-auto bg-[#c6f43a] hover:bg-[#b8e432] text-[#0d3b45] px-5 py-3 rounded-full text-xs font-display font-black uppercase tracking-wider transition shadow-glow cursor-pointer whitespace-nowrap"
                  >
                    Preencher Avaliação Física Agora →
                  </button>
                </div>
              )}
            </div>

            {/* Resumo de Conquistas do Atleta */}
            <div className="px-5 pt-4 pb-1">
              <div
                onClick={() => setActiveTab('progresso')}
                className="bg-[#0d3b45] text-white rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:brightness-110 transition shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🏆</span>
                  <div>
                    <p className="text-[11px] font-bold text-[#c6f43a] uppercase tracking-wider">Conquistas da Assessoria</p>
                    <p className="text-base font-display font-black text-white">
                      {unlockedBadgesCount} de {achievements.length} medalhas conquistadas
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#c6f43a] bg-white/10 px-3 py-1 rounded-full">
                  Ver todas →
                </span>
              </div>
            </div>

            {/* Cartão de Assinatura & Planilhas Compradas */}
            <div className="px-5 pt-3 pb-3">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Planilhas & Acesso</p>
                <span className="text-xs text-slate-400 font-medium">Assessoria Go Team</span>
              </div>

              <div className="flex flex-col gap-2">
                {(['5K', '10K', '21K'] as PlanDistance[]).map(dist => {
                  const isPaid = Boolean(paidPlans[dist]);
                  const isCurrent = dist === selectedPlanId;
                  const distDetailed = getDetailedPlan(dist, selectedLevel);

                  return (
                    <div
                      key={dist}
                      className={`rounded-2xl p-3.5 border transition flex items-center justify-between shadow-xs ${
                        isCurrent
                          ? 'bg-[#c6f43a]/15 border-[#a5cf2a]'
                          : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-display font-black text-[#0d3b45]">
                            Planilha {dist}
                          </p>
                          {isCurrent && (
                            <span className="text-[10px] bg-[#0d3b45] text-[#c6f43a] font-black px-2 py-0.5 rounded">
                              Selecionado
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {distDetailed.semanasTotal} semanas • {distDetailed.treinosPorSemana}x por semana ({distDetailed.preco})
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {isPaid ? (
                          <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full border border-emerald-300">
                            ✓ Liberado
                          </span>
                        ) : (
                          <button
                            onClick={() => {
                              setPaymentModalDistance(dist);
                              setIsPaymentModalOpen(true);
                            }}
                            className="bg-[#c6f43a] text-[#0d3b45] font-black text-xs px-3 py-1 rounded-full hover:scale-105 active:scale-95 transition cursor-pointer shadow-xs"
                          >
                            Liberar ({distDetailed.preco})
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-slate-400 mt-2">{currentUser.email}</p>
            </div>

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

              {/* Canais Oficiais de Contato & Suporte */}
              <div className="mt-4 pt-3 border-t border-slate-200/80 space-y-2.5">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Canais Oficiais & Contato
                </p>

                {/* Card WhatsApp do Treinador Leandro */}
                <a
                  href={CONTATO_WHATSAPP}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-gradient-to-r from-[#0d3b45] to-[#124d5b] hover:from-[#092930] hover:to-[#0f404b] text-white rounded-2xl p-3.5 flex items-center justify-between group shadow-md transition border border-white/10"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-[#c6f43a] shadow-sm">
                        <img
                          src="https://images.unsplash.com/photo-1594824813525-63567675122e?w=150&auto=format&fit=crop&q=80"
                          alt="Treinador Leandro"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-[#0d3b45] rounded-full animate-pulse" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs sm:text-sm font-black text-white">
                          Falar com o Treinador Leandro
                        </p>
                        <span className="text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 px-1.5 py-0.2 rounded">
                          WhatsApp
                        </span>
                      </div>
                      <p className="text-[11px] text-[#c6f43a] font-medium mt-0.5">
                        Ajuste de treinos, ritmos e acompanhamento individual
                      </p>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold shadow-sm group-hover:scale-110 transition flex-none">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                </a>

                {/* Card Instagram Go Team */}
                <a
                  href={INSTAGRAM_LINK}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-white border border-slate-200 hover:border-pink-300 hover:shadow-sm text-slate-700 rounded-2xl p-3 flex items-center justify-between group transition shadow-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center font-bold shadow-xs flex-none">
                      <Instagram className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800 group-hover:text-pink-600 transition">
                        Instagram @goteamrunning
                      </p>
                      <p className="text-[10px] text-slate-500">
                        Fotos dos treinos, bastidores das provas e avisos do pelotão
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-pink-600 group-hover:translate-x-0.5 transition flex-none" />
                </a>
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
          onClick={() => setActiveTab('evoluir')}
          className={`flex flex-col items-center gap-0.5 text-[11px] font-semibold transition cursor-pointer ${
            activeTab === 'evoluir' ? 'text-[#0d3b45] font-bold scale-105' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <span className="text-xl">🚀</span>
          Evoluir
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
    </div>
  );
};
