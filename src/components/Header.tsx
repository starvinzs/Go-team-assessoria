import React, { useState, useEffect } from 'react';
import {
  Zap,
  Bell,
  BellRing,
  Wifi,
  WifiOff,
  PlusCircle,
  Users,
  Compass,
  Award,
  Watch,
  LayoutDashboard,
  CalendarCheck,
  ChevronDown
} from 'lucide-react';
import { UserProfile } from '../types';
import { isNotificationSupported, getNotificationPermission, requestNotificationPermission } from '../utils/notifications';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: UserProfile;
  onOpenLogRun?: () => void;
  isOnline?: boolean;
  offlineQueueCount?: number;
  teamMembers?: UserProfile[];
  onSwitchUser: (user: UserProfile) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onOpenLogRun = () => {},
  isOnline = true,
  offlineQueueCount = 0,
  teamMembers = [],
  onSwitchUser
}) => {
  const [notifState, setNotifState] = useState<NotificationPermission>('default');
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    if (isNotificationSupported()) {
      setNotifState(getNotificationPermission());
    }
  }, []);

  const handleToggleNotifications = async () => {
    const perm = await requestNotificationPermission();
    setNotifState(perm);
  };

  const isTabActive = (tabId: string) => {
    if (activeTab === tabId) return true;
    if (tabId === 'evolucao' && activeTab === 'relatorios') return true;
    if (tabId === 'wearables' && activeTab === 'dispositivos') return true;
    if (tabId === 'viagens' && activeTab === 'mapa') return true;
    return false;
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'treinos', label: 'Treinos 5k & 10k', icon: CalendarCheck },
    { id: 'equipe', label: 'Equipe', icon: Users },
    { id: 'evolucao', label: 'Evolução & Relatórios', icon: Award },
    { id: 'wearables', label: 'Strava & Relógios', icon: Watch },
    { id: 'viagens', label: 'Dicas de Viagens & Provas', icon: Compass }
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 text-slate-100">
      {/* Offline Alert Strip */}
      {!isOnline && (
        <div className="bg-amber-500/90 text-slate-950 px-4 py-1.5 text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <WifiOff className="w-3.5 h-3.5 animate-pulse" />
            <span>Modo Offline Ativado: Suas atividades registradas serão sincronizadas automaticamente quando voltar a conexão.</span>
          </div>
          {offlineQueueCount > 0 && (
            <span className="bg-slate-950 text-amber-300 px-2 py-0.5 rounded-full text-[10px]">
              {offlineQueueCount} na fila de sync
            </span>
          )}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo Brand */}
          <div 
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
            id="app-logo"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 p-0.5 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Zap className="w-5 h-5 text-emerald-400 fill-emerald-400/20" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-black tracking-tight text-white">GoTeam</span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  RUNNING
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Equipe & Treinos Inteligentes</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = isTabActive(item.id);
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  id={`nav-${item.id}`}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                    isActive
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Actions & Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Log Run Button */}
            <button
              onClick={onOpenLogRun}
              id="btn-log-run-header"
              className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 text-xs sm:text-sm font-bold shadow-lg shadow-emerald-500/25 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Registrar Treino</span>
              <span className="sm:hidden">Treinar</span>
            </button>

            {/* Notification Bell */}
            <button
              onClick={handleToggleNotifications}
              id="btn-toggle-notifications"
              title={notifState === 'granted' ? 'Notificações push ativas' : 'Ativar notificações push'}
              className={`p-2 rounded-xl border transition-colors relative ${
                notifState === 'granted'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {notifState === 'granted' ? (
                <BellRing className="w-4 h-4" />
              ) : (
                <Bell className="w-4 h-4" />
              )}
              {notifState === 'granted' && (
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
              )}
            </button>

            {/* Connection Status Icon */}
            <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hidden sm:flex items-center">
              {isOnline ? (
                <Wifi className="w-4 h-4 text-emerald-400" title="Online: Firebase sincronizado" />
              ) : (
                <WifiOff className="w-4 h-4 text-amber-400" title="Offline: salvando localmente" />
              )}
            </div>

            {/* User Profile Selector */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                id="btn-user-profile-menu"
                className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors"
              >
                <img
                  src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-full object-cover border border-emerald-500/40"
                />
                <div className="hidden md:block text-left">
                  <p className="text-xs font-semibold text-white leading-tight">{currentUser.name}</p>
                  <p className="text-[10px] text-emerald-400 font-medium capitalize">{currentUser.role} • {currentUser.paceGroup}</p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
              </button>

              {/* User Switcher Dropdown */}
              {showUserMenu && (
                <div 
                  className="absolute right-0 mt-2 w-64 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2"
                  id="user-switcher-dropdown"
                >
                  <div className="px-3 py-2 border-b border-slate-800">
                    <p className="text-xs font-semibold text-slate-400">Alternar Atleta / Perfil</p>
                    <p className="text-[11px] text-slate-500">Alterne para ver planos e métricas individuais</p>
                  </div>
                  <div className="py-1 max-h-60 overflow-y-auto space-y-1">
                    {(teamMembers || []).map((member) => (
                      <button
                        key={member.id}
                        onClick={() => {
                          onSwitchUser(member);
                          setShowUserMenu(false);
                        }}
                        className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left text-xs transition-colors ${
                          member.id === currentUser.id
                            ? 'bg-emerald-500/20 text-emerald-300 font-bold'
                            : 'text-slate-300 hover:bg-slate-800/80'
                        }`}
                      >
                        <img
                          src={member.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                          alt={member.name}
                          className="w-7 h-7 rounded-full object-cover"
                        />
                        <div className="truncate flex-1">
                          <p className="font-semibold truncate">{member.name}</p>
                          <p className="text-[10px] text-slate-400 capitalize">{member.role} • Meta: {member.weeklyTargetKm}km</p>
                        </div>
                        {member.id === currentUser.id && (
                          <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Tabs (Bottom or sub-bar) */}
      <div className="lg:hidden border-t border-slate-800/80 bg-slate-950/95 px-2 py-1.5 overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-1 min-w-max">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = isTabActive(item.id);
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                id={`mobile-nav-${item.id}`}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
