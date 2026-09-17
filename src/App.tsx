import React, { useState, useEffect } from 'react';
import {
  collection,
  doc,
  getDocs,
  setDoc,
  onSnapshot,
  query,
  orderBy
} from 'firebase/firestore';
import { db } from './lib/firebase';
import {
  UserProfile,
  Activity,
  TeamMember,
  TeamTask,
  TrainingPlan,
  WorkoutSession,
  RaceDestination,
  DashboardWidgetConfig
} from './types';
import { INITIAL_TEAM_MEMBERS, INITIAL_ACTIVITIES, INITIAL_TASKS, DEFAULT_DASHBOARD_WIDGETS } from './data/initialTeam';
import { INITIAL_TRAINING_PLANS } from './data/trainingPlans';
import { WORLD_RACES } from './data/worldRaces';
import {
  registerServiceWorker,
  requestNotificationPermission,
  showLocalNotification,
  saveOfflineItem,
  getOfflineQueue
} from './utils/notifications';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { TrainingPlansView } from './components/TrainingPlansView';
import { TeamManagementView } from './components/TeamManagementView';
import { RaceTravelMapView } from './components/RaceTravelMapView';
import { EvolutionReportsView } from './components/EvolutionReportsView';
import { WearablesSyncView } from './components/WearablesSyncView';
import { LogRunModal } from './components/LogRunModal';
import { WorkoutActiveModal } from './components/WorkoutActiveModal';
import { ShareAchievementModal } from './components/ShareAchievementModal';
import { LandingPageView } from './components/LandingPageView';
import { StudentAreaView } from './components/StudentAreaView';
import { LoginModal } from './components/LoginModal';

// Current active users list
const USERS: UserProfile[] = [
  {
    id: 'user-coach-leandro',
    name: 'Leandro Irineu da Silva',
    email: 'leandro.buzzmidia@gmail.com',
    role: 'treinador',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    paceGroup: 'Sub-20',
    currentWeeklyKm: 32.5,
    weeklyTargetKm: 40,
    best5kTime: '19:40',
    best10kTime: '41:20',
    joinedDate: '2023-01-10',
    runningShoeKm: 180,
    runningShoeModel: 'Nike Pegasus 40 & Vaporfly',
    connectedApps: { strava: true, garmin: true, appleHealth: false, coros: false, polar: false }
  },
  {
    id: 'user-athlete-carolina',
    name: 'Carolina Mendes',
    email: 'carolina.mendes@runner.com',
    role: 'atleta',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    paceGroup: 'Sub-25',
    currentWeeklyKm: 18.5,
    weeklyTargetKm: 25,
    best5kTime: '23:45',
    best10kTime: '51:10',
    joinedDate: '2024-01-15',
    runningShoeKm: 145,
    runningShoeModel: 'Asics Novablast 4',
    connectedApps: { strava: true, garmin: true, appleHealth: false, coros: true, polar: false }
  }
];

export default function App() {
  const [viewMode, setViewMode] = useState<'landing' | 'student' | 'travel_map' | 'coach_dashboard'>('landing');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'treinos' | 'equipe' | 'mapa' | 'relatorios' | 'dispositivos'
  >('dashboard');

  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('goteam_athlete_profile');
      if (saved) {
        const p = JSON.parse(saved);
        return {
          id: p.id || 'user-athlete-registered',
          name: p.name || 'Carolina Mendes',
          email: p.email || 'carolina.mendes@runner.com',
          role: 'atleta',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
          phone: p.phone,
          city: p.city,
          age: p.age,
          gender: p.gender,
          runningLevel: p.runningLevel,
          paceGroup: p.paceGroup || 'Sub-25',
          currentWeeklyKm: 18.5,
          weeklyTargetKm: 25,
          best5kTime: '23:45',
          best10kTime: '51:10',
          joinedDate: p.joinedDate || '15/01/2024',
          runningShoeKm: 145,
          runningShoeModel: 'Asics Novablast 4',
          connectedApps: { strava: true, garmin: true, appleHealth: false, coros: true, polar: false }
        };
      }
    } catch (e) {
      console.warn('Error reading saved user', e);
    }
    return USERS[1]; // Carolina Mendes (atleta)
  });
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [notificationsGranted, setNotificationsGranted] = useState<boolean>(
    typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted'
  );

  // App Core Data State
  const [activities, setActivities] = useState<Activity[]>(() => {
    const cached = localStorage.getItem('goteam_activities');
    return cached ? JSON.parse(cached) : INITIAL_ACTIVITIES;
  });

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(() => {
    const cached = localStorage.getItem('goteam_members');
    return cached ? JSON.parse(cached) : INITIAL_TEAM_MEMBERS;
  });

  const [tasks, setTasks] = useState<TeamTask[]>(() => {
    const cached = localStorage.getItem('goteam_tasks');
    return cached ? JSON.parse(cached) : INITIAL_TASKS;
  });

  const [activePlan, setActivePlan] = useState<TrainingPlan>(INITIAL_TRAINING_PLANS[0]);
  const [savedTargetRace, setSavedTargetRace] = useState<RaceDestination | null>(WORLD_RACES[0]);

  // Dashboard Widget Configurations
  const [widgetConfigs, setWidgetConfigs] = useState<DashboardWidgetConfig[]>(() => {
    try {
      const cached = localStorage.getItem('goteam_widget_configs');
      return cached ? JSON.parse(cached) : DEFAULT_DASHBOARD_WIDGETS;
    } catch {
      return DEFAULT_DASHBOARD_WIDGETS;
    }
  });

  const [offlineQueueCount, setOfflineQueueCount] = useState<number>(() => {
    try {
      return getOfflineQueue().length;
    } catch {
      return 0;
    }
  });

  // Modal Triggers
  const [isLogRunModalOpen, setIsLogRunModalOpen] = useState(false);
  const [activeWorkoutToRun, setActiveWorkoutToRun] = useState<WorkoutSession | null>(null);
  const [shareAchievementActivity, setShareAchievementActivity] = useState<Activity | null>(null);

  // Initialize PWA and Connectivity
  useEffect(() => {
    registerServiceWorker();

    const handleOnline = () => {
      setIsOnline(true);
      showLocalNotification('Conexão restabelecida!', {
        body: 'GoTeam Running está sincronizado com o Firebase.'
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Sync to Local Storage for instant offline PWA load
  useEffect(() => {
    localStorage.setItem('goteam_activities', JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem('goteam_members', JSON.stringify(teamMembers));
  }, [teamMembers]);

  useEffect(() => {
    localStorage.setItem('goteam_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    try {
      localStorage.setItem('goteam_widget_configs', JSON.stringify(widgetConfigs));
    } catch (e) {
      console.warn('Failed to save widget configs', e);
    }
  }, [widgetConfigs]);

  // Request Notification Permission Handlers
  const handleRequestNotifications = async () => {
    const granted = await requestNotificationPermission();
    setNotificationsGranted(granted);
    if (granted) {
      showLocalNotification('Notificações Ativadas!', {
        body: 'Você receberá lembretes inteligentes de treino e kudos da equipe.'
      });
    }
  };

  // Switch User Profile
  const handleSwitchUser = () => {
    setCurrentUser((prev) => (prev.id === USERS[0].id ? USERS[1] : USERS[0]));
  };

  // Activity Handlers
  const handleSaveActivity = async (newActivity: Activity) => {
    setActivities((prev) => [newActivity, ...prev]);

    // Update current user weekly km and team member km
    setCurrentUser((prev) => ({
      ...prev,
      currentWeeklyKm: Number((prev.currentWeeklyKm + newActivity.distanceKm).toFixed(1))
    }));

    setTeamMembers((prev) =>
      prev.map((m) =>
        m.id === currentUser.id
          ? {
              ...m,
              currentWeeklyKm: Number((m.currentWeeklyKm + newActivity.distanceKm).toFixed(1)),
              runningShoeKm: m.runningShoeKm + newActivity.distanceKm,
              recentActivity: `${newActivity.distanceKm}km em ${newActivity.avgPace}`,
              lastActive: 'Hoje'
            }
          : m
      )
    );

    // Persist to Firebase Firestore if online
    if (isOnline) {
      try {
        await setDoc(doc(db, 'activities', newActivity.id), newActivity);
      } catch (err) {
        console.warn('Firestore offline sync fallback', err);
        saveOfflineItem('pending_activity', newActivity as unknown as Record<string, unknown>);
      }
    } else {
      saveOfflineItem('pending_activity', newActivity as unknown as Record<string, unknown>);
    }

    showLocalNotification('Treino Registrado!', {
      body: `Você completou ${newActivity.distanceKm}km no ritmo de ${newActivity.avgPace}. Parabéns!`
    });
  };

  // Kudos Handlers
  const handleGiveKudo = (activityId: string) => {
    setActivities((prev) =>
      prev.map((act) => {
        if (act.id === activityId) {
          const hasKudo = act.kudos.includes(currentUser.id);
          const updatedKudos = hasKudo
            ? act.kudos.filter((id) => id !== currentUser.id)
            : [...act.kudos, currentUser.id];
          return { ...act, kudos: updatedKudos };
        }
        return act;
      })
    );
  };

  const handleGiveMemberKudo = (memberId: string) => {
    setTeamMembers((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, kudosCount: (m.kudosCount || 0) + 1 } : m))
    );
  };

  // Team Task Handlers
  const handleToggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleAddTask = (newTask: Partial<TeamTask>) => {
    const task: TeamTask = {
      id: `task-${Date.now()}`,
      title: newTask.title || 'Nova Meta',
      description: newTask.description || '',
      category: newTask.category || 'quilometragem',
      targetValue: newTask.targetValue || 100,
      currentValue: 0,
      unit: newTask.unit || 'km',
      dueDate: newTask.dueDate || 'Domingo',
      completed: false,
      assignedToAll: true
    };
    setTasks((prev) => [task, ...prev]);
  };

  // Member Handlers
  const handleAddMember = (newMem: Partial<TeamMember>) => {
    const member: TeamMember = {
      id: `member-${Date.now()}`,
      name: newMem.name || 'Atleta GoTeam',
      email: newMem.email || 'atleta@goteam.com',
      role: newMem.role || 'atleta',
      paceGroup: newMem.paceGroup || 'Sub-25',
      weeklyTargetKm: newMem.weeklyTargetKm || 25,
      currentWeeklyKm: 0,
      avatar: newMem.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      runningShoeModel: newMem.runningShoeModel || 'Asics Novablast 4',
      runningShoeKm: 0,
      kudosCount: 0,
      lastActive: 'Adicionado agora',
      joinedDate: new Date().toISOString().split('T')[0],
      connectedApps: {
        strava: false,
        garmin: false,
        appleHealth: false,
        coros: false,
        polar: false
      }
    };
    setTeamMembers((prev) => [member, ...prev]);
  };

  const handleRemoveMember = (id: string) => {
    setTeamMembers((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <>
      {/* 1. Interface Oficial: Landing Page Go Team (starvinzs.github.io/goteam) */}
      {viewMode === 'landing' && (
        <LandingPageView
          onOpenStudentArea={() => setViewMode('student')}
          onSelectPlan={(planId) => {
            localStorage.setItem('goteam_active_plan', planId);
            setViewMode('student');
          }}
        />
      )}

      {/* 2. Interface Oficial: Área do Aluno Go Team (app.html) */}
      {viewMode === 'student' && (
        <StudentAreaView
          currentUser={currentUser as TeamMember}
          onBackToLanding={() => setViewMode('landing')}
          onStartLiveWorkout={(workout) => setActiveWorkoutToRun(workout)}
          onOpenTravelMap={() => setViewMode('travel_map')}
          onSwitchUser={handleSwitchUser}
          teamMembers={teamMembers}
        />
      )}

      {/* 3. Modo Dicas de Viagens e Corridas pelo Mundo */}
      {viewMode === 'travel_map' && (
        <div className="min-h-screen bg-[#f0f4f5] text-slate-800 font-sans">
          <div className="bg-[#082830] border-b border-white/10 px-4 py-3 sticky top-0 z-40 shadow-sm">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <button
                onClick={() => setViewMode('student')}
                className="inline-flex items-center gap-2 text-xs font-bold text-white/90 hover:text-[#c6f43a] transition cursor-pointer bg-white/10 px-3 py-1.5 rounded-full border border-white/10 hover:border-[#c6f43a]/40"
              >
                ← Voltar à Área do Aluno
              </button>
              <span className="text-xs font-black uppercase tracking-wider text-[#c6f43a] flex items-center gap-1.5">
                <span>🗺️</span>
                <span className="hidden sm:inline">Assessoria Go Team •</span>
                <span>Dicas de Viagens & Corridas pelo Mundo</span>
              </span>
              <button
                onClick={() => setViewMode('landing')}
                className="text-xs text-white/70 hover:text-white transition cursor-pointer font-medium"
              >
                Página Inicial
              </button>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
            <RaceTravelMapView
              onSelectTargetRace={(race) => setSavedTargetRace(race)}
              savedTargetRace={savedTargetRace}
            />
          </div>
        </div>
      )}

      {/* 4. Modo Painel do Treinador / Dashboard Completo */}
      {viewMode === 'coach_dashboard' && (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-slate-950 font-sans">
          <div className="bg-emerald-950/80 border-b border-emerald-800/40 px-4 py-2 flex items-center justify-between text-xs text-emerald-300">
            <span>Modo Painel do Treinador</span>
            <button
              onClick={() => setViewMode('student')}
              className="font-bold underline hover:text-white cursor-pointer"
            >
              ← Retornar à Interface do Aluno
            </button>
          </div>

          <Header
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            currentUser={currentUser}
            onSwitchUser={handleSwitchUser}
            isOnline={isOnline}
            offlineQueueCount={offlineQueueCount}
            teamMembers={teamMembers}
            onOpenLogRun={() => setIsLogRunModalOpen(true)}
          />

          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            {activeTab === 'dashboard' && (
              <DashboardView
                currentUser={currentUser}
                activePlan={activePlan}
                activities={activities}
                teamMembers={teamMembers}
                tasks={tasks}
                widgetConfigs={widgetConfigs}
                onUpdateWidgetConfigs={setWidgetConfigs}
                targetRace={savedTargetRace}
                onOpenLogRun={() => setIsLogRunModalOpen(true)}
                onStartLiveWorkout={(workout) => setActiveWorkoutToRun(workout)}
                onOpenShareModal={(activity) => setShareAchievementActivity(activity)}
                onOpenAdaptationModal={() => setActiveTab('treinos')}
                onGiveKudo={handleGiveKudo}
                onToggleTask={handleToggleTask}
                onNavigateTab={(tab) => setActiveTab(tab)}
              />
            )}

            {activeTab === 'treinos' && (
              <TrainingPlansView
                currentUser={currentUser}
                activePlan={activePlan}
                onSelectPlan={(plan) => setActivePlan(plan)}
                onStartLiveWorkout={(workout) => setActiveWorkoutToRun(workout)}
                onOpenLogRun={() => setIsLogRunModalOpen(true)}
              />
            )}

            {activeTab === 'equipe' && (
              <TeamManagementView
                teamMembers={teamMembers}
                tasks={tasks}
                currentUser={currentUser}
                onAddMember={handleAddMember}
                onRemoveMember={handleRemoveMember}
                onAddTask={handleAddTask}
                onToggleTask={handleToggleTask}
                onGiveMemberKudo={handleGiveMemberKudo}
              />
            )}

            {activeTab === 'mapa' && (
              <RaceTravelMapView
                onSelectTargetRace={(race) => setSavedTargetRace(race)}
                savedTargetRace={savedTargetRace}
              />
            )}

            {activeTab === 'relatorios' && (
              <EvolutionReportsView
                currentUser={currentUser}
                activities={activities}
              />
            )}

            {activeTab === 'dispositivos' && (
              <WearablesSyncView
                currentUser={currentUser}
                onSyncNewActivity={handleSaveActivity}
              />
            )}
          </main>

          <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500">
            <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
              <span>GoTeam Running Club • Plataforma Inteligente de Treinamento e Comunidade</span>
              <div className="flex items-center gap-4 text-slate-400">
                <span>Sincronização Firebase & PWA Offline</span>
                <span>•</span>
                <span>Strava & Wearables Ready</span>
              </div>
            </div>
          </footer>
        </div>
      )}

      {/* Modais Compartilhados */}
      <LogRunModal
        isOpen={isLogRunModalOpen}
        onClose={() => setIsLogRunModalOpen(false)}
        currentUser={currentUser}
        onSaveActivity={handleSaveActivity}
      />

      <WorkoutActiveModal
        isOpen={!!activeWorkoutToRun}
        workout={activeWorkoutToRun}
        currentUser={currentUser}
        onClose={() => setActiveWorkoutToRun(null)}
        onFinishWorkout={handleSaveActivity}
      />

      <ShareAchievementModal
        isOpen={!!shareAchievementActivity}
        activity={shareAchievementActivity}
        currentUser={currentUser}
        onClose={() => setShareAchievementActivity(null)}
      />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={(data) => {
          setIsLoginModalOpen(false);
          const newUser: UserProfile = {
            id: data.id || `user-athlete-${Date.now()}`,
            name: data.name,
            email: data.email,
            phone: data.phone,
            city: data.city,
            age: data.age,
            gender: data.gender,
            runningLevel: data.runningLevel,
            role: 'atleta',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
            paceGroup: data.paceGroup || 'Sub-25',
            currentWeeklyKm: 18.5,
            weeklyTargetKm: 25,
            best5kTime: '23:45',
            best10kTime: '51:10',
            joinedDate: new Date().toLocaleDateString('pt-BR'),
            runningShoeKm: 145,
            runningShoeModel: 'Asics Novablast 4',
            connectedApps: { strava: true, garmin: true, appleHealth: false, coros: true, polar: false }
          };
          setCurrentUser(newUser);
          setViewMode('student');
        }}
      />
    </>
  );
}
