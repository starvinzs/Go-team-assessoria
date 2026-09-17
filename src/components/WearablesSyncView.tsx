import React, { useState } from 'react';
import {
  Watch,
  CheckCircle2,
  RefreshCw,
  Upload,
  Zap,
  ArrowUpRight,
  ShieldCheck,
  Activity as ActivityIcon,
  Wifi,
  FileCode2,
  Sliders
} from 'lucide-react';
import { UserProfile, Activity } from '../types';

interface WearablesSyncViewProps {
  currentUser: UserProfile;
  onSyncNewActivity: (activity: Activity) => void;
}

export const WearablesSyncView: React.FC<WearablesSyncViewProps> = ({
  currentUser,
  onSyncNewActivity
}) => {
  const [appsStatus, setAppsStatus] = useState({
    strava: currentUser.connectedApps.strava ?? true,
    garmin: currentUser.connectedApps.garmin ?? true,
    appleHealth: currentUser.connectedApps.appleHealth ?? false,
    coros: currentUser.connectedApps.coros ?? false,
    polar: currentUser.connectedApps.polar ?? false
  });

  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const toggleAppConnection = (key: keyof typeof appsStatus) => {
    setAppsStatus((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Simulate Strava / Garmin Activity Import
  const handleTriggerManualSync = () => {
    setIsSyncing(true);
    setSyncMessage('Conectando aos servidores do Strava & Garmin...');

    setTimeout(() => {
      const now = new Date();
      const mockSyncedRun: Activity = {
        id: `act-synced-${Date.now()}`,
        userId: currentUser.id,
        userName: currentUser.name,
        userAvatar: currentUser.avatar,
        title: 'Corrida Matinal Sincronizada (Strava)',
        distanceKm: 8.4,
        durationSeconds: 2436, // 40m 36s
        avgPace: '4:50 min/km',
        avgHeartRate: 159,
        elevationGainMeters: 42,
        calories: 560,
        date: `Hoje, ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`,
        source: 'Strava',
        splits: [
          { km: 1, pace: '5:05', heartRate: 142 },
          { km: 2, pace: '4:52', heartRate: 154 },
          { km: 3, pace: '4:48', heartRate: 158 },
          { km: 4, pace: '4:50', heartRate: 161 },
          { km: 5, pace: '4:46', heartRate: 163 },
          { km: 6, pace: '4:49', heartRate: 162 },
          { km: 7, pace: '4:44', heartRate: 165 },
          { km: 8, pace: '4:42', heartRate: 166 }
        ],
        notes: 'Sincronizado automaticamente via API Strava v3 com dados de cadência e sensor de frequência cardíaca.',
        kudos: ['user-coach-leandro']
      };

      onSyncNewActivity(mockSyncedRun);
      setIsSyncing(false);
      setSyncMessage('Sincronização concluída: Nova corrida de 8.4km adicionada ao seu mural e relatório!');
    }, 1800);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsSyncing(true);
    setSyncMessage(`Processando arquivo esportivo ${file.name}...`);

    setTimeout(() => {
      const importedRun: Activity = {
        id: `act-file-${Date.now()}`,
        userId: currentUser.id,
        userName: currentUser.name,
        userAvatar: currentUser.avatar,
        title: `Treino Importado (${file.name.replace(/\.[^/.]+$/, '')})`,
        distanceKm: 7.2,
        durationSeconds: 2190,
        avgPace: '5:04 min/km',
        avgHeartRate: 154,
        elevationGainMeters: 35,
        calories: 490,
        date: 'Hoje, arquivo importado',
        source: 'GoTeam Manual',
        notes: `Importado via arquivo ${file.name}`,
        kudos: []
      };

      onSyncNewActivity(importedRun);
      setIsSyncing(false);
      setSyncMessage(`Arquivo ${file.name} importado com sucesso!`);
    }, 1200);
  };

  const services = [
    {
      id: 'strava' as const,
      name: 'Strava',
      desc: 'Sincronização automática de treinos, splits por km, mapas e kudos da comunidade.',
      color: '#FC4C02',
      badge: 'Principal',
      connected: appsStatus.strava
    },
    {
      id: 'garmin' as const,
      name: 'Garmin Connect',
      desc: 'Métricas avançadas: cadência, oscilação vertical, tempo de contato com o solo e VO2Max.',
      color: '#007CC3',
      badge: 'Relógios Forerunner / Fenix',
      connected: appsStatus.garmin
    },
    {
      id: 'appleHealth' as const,
      name: 'Apple Health / Watch',
      desc: 'Atividades ao ar livre gravadas pelo app Exercício do Apple Watch e zonas cardíacas.',
      color: '#FA2D48',
      badge: 'iOS & WatchOS',
      connected: appsStatus.appleHealth
    },
    {
      id: 'coros' as const,
      name: 'Coros Pace / Apex',
      desc: 'Sincronização de carga de treinamento para corredores de rua e pista.',
      color: '#FF6B00',
      badge: 'Alta Performance',
      connected: appsStatus.coros
    },
    {
      id: 'polar' as const,
      name: 'Polar Flow',
      desc: 'Cardio Load Pro e monitoramento de recuperação muscular pós-tiros.',
      color: '#0097D7',
      badge: 'Sensores H10 & Vantage',
      connected: appsStatus.polar
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Watch className="w-4 h-4" />
            <span>Ecossistema Esportivo Conectado</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Strava & Dispositivos Vestíveis
          </h1>
          <p className="text-slate-400 text-sm">
            Conecte seus relógios e apps de corrida para sincronizar treinos automaticamente com a equipe.
          </p>
        </div>

        <button
          onClick={handleTriggerManualSync}
          disabled={isSyncing}
          id="btn-sync-wearables-now"
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-emerald-500/25 disabled:opacity-50 transition-all"
        >
          <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
          <span>{isSyncing ? 'Sincronizando...' : 'Sincronizar Agora'}</span>
        </button>
      </div>

      {/* Sync Status Banner */}
      {syncMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center justify-between text-xs animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{syncMessage}</span>
          </div>
          <button
            onClick={() => setSyncMessage(null)}
            className="text-slate-400 hover:text-white font-bold"
          >
            Fechar
          </button>
        </div>
      )}

      {/* Connected Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service) => (
          <div
            key={service.id}
            className={`p-5 rounded-3xl border transition-all flex flex-col justify-between space-y-4 ${
              service.connected
                ? 'bg-slate-900 border-emerald-500/30 shadow-lg shadow-emerald-500/5'
                : 'bg-slate-900/60 border-slate-800'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center font-black text-white text-base shadow-md"
                    style={{ backgroundColor: service.color }}
                  >
                    {service.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white">{service.name}</h3>
                    <span className="text-[10px] text-slate-400 font-semibold">{service.badge}</span>
                  </div>
                </div>

                {service.connected ? (
                  <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3" />
                    Ativo
                  </span>
                ) : (
                  <span className="text-[11px] font-semibold text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">
                    Desconectado
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{service.desc}</p>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                {service.connected ? 'Auto-sync em segundo plano' : 'Requer autorização'}
              </span>
              <button
                onClick={() => toggleAppConnection(service.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  service.connected
                    ? 'bg-slate-800 hover:bg-rose-500/20 hover:text-rose-300 text-slate-300'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                }`}
              >
                {service.connected ? 'Desconectar' : 'Conectar'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Manual File Import (.GPX / .TCX / .FIT) */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCode2 className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">Importação Manual de Arquivo de Corrida</h3>
          </div>
          <span className="text-xs text-slate-400 font-medium">Suporta .GPX, .TCX, .FIT e JSON</span>
        </div>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragActive(false);
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
              const file = e.dataTransfer.files[0];
              setIsSyncing(true);
              setSyncMessage(`Importando arquivo arrastado ${file.name}...`);
              setTimeout(() => {
                setIsSyncing(false);
                setSyncMessage(`Treino de ${file.name} sincronizado com sucesso!`);
              }, 1200);
            }
          }}
          className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
            dragActive
              ? 'border-emerald-400 bg-emerald-500/10'
              : 'border-slate-800 hover:border-slate-700 bg-slate-950/60'
          }`}
        >
          <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-sm font-bold text-white">Arraste seu arquivo .GPX ou .FIT aqui</p>
          <p className="text-xs text-slate-400 mt-1">Ou clique no botão abaixo para selecionar do seu dispositivo</p>
          <label className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold cursor-pointer transition-colors">
            <span>Selecionar Arquivo Esportivo</span>
            <input
              type="file"
              accept=".gpx,.tcx,.fit,.json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>
    </div>
  );
};
