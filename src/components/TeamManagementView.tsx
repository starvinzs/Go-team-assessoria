import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Flame,
  Award,
  Filter,
  CheckCircle2,
  Trash2,
  Mail,
  Calendar,
  Sparkles,
  Zap,
  TrendingUp
} from 'lucide-react';
import { TeamMember, TeamTask, UserProfile } from '../types';

interface TeamManagementViewProps {
  teamMembers: TeamMember[];
  tasks: TeamTask[];
  currentUser: UserProfile;
  onAddMember: (member: Partial<TeamMember>) => void;
  onRemoveMember: (id: string) => void;
  onAddTask: (task: Partial<TeamTask>) => void;
  onToggleTask: (taskId: string) => void;
  onGiveMemberKudo: (memberId: string) => void;
}

export const TeamManagementView: React.FC<TeamManagementViewProps> = ({
  teamMembers,
  tasks,
  currentUser,
  onAddMember,
  onRemoveMember,
  onAddTask,
  onToggleTask,
  onGiveMemberKudo
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('todos');
  const [paceFilter, setPaceFilter] = useState<string>('todos');
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);

  // New member form
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState<'atleta' | 'treinador' | 'pacer'>('atleta');
  const [newMemberPace, setNewMemberPace] = useState<'Sub-20' | 'Sub-25' | 'Sub-30' | 'Sub-35' | 'Livre'>('Sub-25');
  const [newMemberTargetKm, setNewMemberTargetKm] = useState(25);
  const [newMemberShoe, setNewMemberShoe] = useState('Asics Novablast 4');

  // New task form
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskTarget, setNewTaskTarget] = useState(150);
  const [newTaskUnit, setNewTaskUnit] = useState('km');
  const [newTaskDue, setNewTaskDue] = useState('Domingo');

  const filteredMembers = teamMembers.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'todos' || m.role === roleFilter;
    const matchesPace = paceFilter === 'todos' || m.paceGroup === paceFilter;
    return matchesSearch && matchesRole && matchesPace;
  });

  const handleCreateMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;

    onAddMember({
      name: newMemberName,
      email: newMemberEmail || `${newMemberName.toLowerCase().replace(/\s+/g, '.')}@goteam.com`,
      role: newMemberRole,
      paceGroup: newMemberPace,
      weeklyTargetKm: Number(newMemberTargetKm),
      currentWeeklyKm: 0,
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150`,
      runningShoeModel: newMemberShoe,
      runningShoeKm: 0,
      kudosCount: 0,
      lastActive: 'Adicionado agora',
      joinedDate: new Date().toISOString().split('T')[0]
    });

    setNewMemberName('');
    setNewMemberEmail('');
    setShowAddMemberModal(false);
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    onAddTask({
      title: newTaskTitle,
      description: newTaskDesc,
      category: 'quilometragem',
      targetValue: Number(newTaskTarget),
      currentValue: 0,
      unit: newTaskUnit,
      dueDate: newTaskDue,
      completed: false,
      assignedToAll: true
    });

    setNewTaskTitle('');
    setNewTaskDesc('');
    setShowAddTaskModal(false);
  };

  // Team totals
  const totalTeamKm = teamMembers.reduce((acc, m) => acc + (m.currentWeeklyKm || 0), 0);
  const totalGoalKm = teamMembers.reduce((acc, m) => acc + (m.weeklyTargetKm || 0), 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Users className="w-4 h-4" />
            <span>Gestão do Pelotão & Equipe</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            GoTeam Running Club
          </h1>
          <p className="text-slate-400 text-sm">
            Gerencie atletas, grupos de ritmo (pacers), metas coletivas e incentive com kudos em tempo real.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowAddTaskModal(true)}
            id="btn-new-team-task"
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-bold transition-all"
          >
            <Award className="w-4 h-4 text-amber-400" />
            <span>Novo Desafio Coletivo</span>
          </button>

          <button
            onClick={() => setShowAddMemberModal(true)}
            id="btn-add-team-member"
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 text-xs sm:text-sm font-black shadow-lg shadow-emerald-500/20 transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span>Adicionar Membro</span>
          </button>
        </div>
      </div>

      {/* Collective Metric Overview Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>TOTAL DE CORREDORES</span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-white mt-1">{teamMembers.length} atletas</p>
          <p className="text-xs text-slate-400 mt-1">Treinadores, pacers e atletas ativos.</p>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>QUILOMETRAGEM SEMANAL COLETIVA</span>
            <TrendingUp className="w-4 h-4 text-teal-400" />
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl sm:text-3xl font-black text-emerald-400">{totalTeamKm.toFixed(1)}</span>
            <span className="text-xs text-slate-400 font-bold">/ {totalGoalKm} km planejados</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-emerald-400 h-full rounded-full"
              style={{ width: `${Math.min(100, Math.round((totalTeamKm / (totalGoalKm || 1)) * 100))}%` }}
            />
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>KUDOS & INCENTIVOS TROCADOS</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-amber-400 mt-1">
            {teamMembers.reduce((acc, m) => acc + (m.kudosCount || 0), 0)} 🔥
          </p>
          <p className="text-xs text-slate-400 mt-1">Engajamento comunitário em alta.</p>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 bg-slate-900 border border-slate-800 rounded-3xl">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar membro por nome ou e-mail..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-2xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Role Filter */}
          <div className="flex items-center gap-1 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400 font-medium hidden sm:inline">Função:</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-semibold"
            >
              <option value="todos">Todas Funções</option>
              <option value="treinador">Treinador</option>
              <option value="pacer">Pacer</option>
              <option value="atleta">Atleta</option>
            </select>
          </div>

          {/* Pace Group Filter */}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-slate-400 font-medium hidden sm:inline">Pelotão:</span>
            <select
              value={paceFilter}
              onChange={(e) => setPaceFilter(e.target.value)}
              className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-semibold"
            >
              <option value="todos">Todos Pelotões</option>
              <option value="Sub-20">Sub-20 5k</option>
              <option value="Sub-25">Sub-25 5k</option>
              <option value="Sub-30">Sub-30 5k</option>
              <option value="Sub-35">Sub-35 5k</option>
            </select>
          </div>
        </div>
      </div>

      {/* Members Grid / Roster */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMembers.map((member) => {
          const progressPercent = Math.min(
            100,
            Math.round(((member.currentWeeklyKm || 0) / (member.weeklyTargetKm || 1)) * 100)
          );
          return (
            <div
              key={member.id}
              className="p-5 rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={member.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                      alt={member.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500/30"
                    />
                    <div>
                      <h3 className="text-sm font-black text-white">{member.name}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          member.role === 'treinador'
                            ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                            : member.role === 'pacer'
                            ? 'bg-teal-500/15 text-teal-300 border border-teal-500/30'
                            : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                        }`}>
                          {member.role}
                        </span>
                        <span className="text-[10px] text-slate-400 font-semibold">
                          {member.paceGroup}
                        </span>
                      </div>
                    </div>
                  </div>

                  {currentUser.role === 'treinador' && member.id !== currentUser.id && (
                    <button
                      onClick={() => onRemoveMember(member.id)}
                      title="Remover da equipe"
                      className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Personal Records & Recent Activity */}
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-1.5">
                  <div className="flex justify-between text-slate-400">
                    <span>Recorde 5K:</span>
                    <strong className="text-emerald-400">{member.best5kTime || '24:00'}</strong>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Recorde 10K:</span>
                    <strong className="text-teal-400">{member.best10kTime || '52:00'}</strong>
                  </div>
                  {member.recentActivity && (
                    <div className="pt-1.5 border-t border-slate-800/80 text-[11px] text-slate-300 truncate">
                      🏃 {member.recentActivity}
                    </div>
                  )}
                </div>

                {/* Weekly Mileage Progress */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-400">Progresso Semanal:</span>
                    <span className="text-white">
                      <strong>{member.currentWeeklyKm || 0}</strong> / {member.weeklyTargetKm} km ({progressPercent}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-400 h-full rounded-full transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Card Footer: Kudos Action */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Ativo: {member.lastActive}</span>
                <button
                  onClick={() => onGiveMemberKudo(member.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold transition-all active:scale-95"
                >
                  <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
                  <span>{member.kudosCount || 0} Kudos</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Member Modal */}
      {showAddMemberModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-white">Cadastrar Novo Membro</h3>
              <button
                onClick={() => setShowAddMemberModal(false)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateMember} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Nome Completo *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Gabriel Santos"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">E-mail</label>
                <input
                  type="email"
                  placeholder="gabriel@runner.com"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Função na Equipe</label>
                  <select
                    value={newMemberRole}
                    onChange={(e) => setNewMemberRole(e.target.value as 'atleta' | 'treinador' | 'pacer')}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-semibold"
                  >
                    <option value="atleta">Atleta</option>
                    <option value="pacer">Pacer</option>
                    <option value="treinador">Treinador</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Pelotão de Ritmo</label>
                  <select
                    value={newMemberPace}
                    onChange={(e) => setNewMemberPace(e.target.value as 'Sub-20' | 'Sub-25' | 'Sub-30' | 'Sub-35' | 'Livre')}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-semibold"
                  >
                    <option value="Sub-20">Sub-20 min</option>
                    <option value="Sub-25">Sub-25 min</option>
                    <option value="Sub-30">Sub-30 min</option>
                    <option value="Sub-35">Sub-35 min</option>
                    <option value="Livre">Livre / Iniciante</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Meta Semanal (km)</label>
                  <input
                    type="number"
                    min="5"
                    max="120"
                    value={newMemberTargetKm}
                    onChange={(e) => setNewMemberTargetKm(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Modelo do Tênis</label>
                  <input
                    type="text"
                    value={newMemberShoe}
                    onChange={(e) => setNewMemberShoe(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-semibold"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddMemberModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-750"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black"
                >
                  Salvar Membro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Task Modal */}
      {showAddTaskModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-white">Criar Desafio Coletivo</h3>
              <button
                onClick={() => setShowAddTaskModal(false)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Título do Desafio *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Bater 200km coletivos nesta semana"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Descrição</label>
                <textarea
                  rows={2}
                  placeholder="Instruções para os corredores da equipe..."
                  value={newTaskDesc}
                  onChange={(e) => setNewTaskDesc(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Meta Alvo</label>
                  <input
                    type="number"
                    min="1"
                    value={newTaskTarget}
                    onChange={(e) => setNewTaskTarget(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Unidade</label>
                  <input
                    type="text"
                    value={newTaskUnit}
                    onChange={(e) => setNewTaskUnit(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Prazo / Dia</label>
                <input
                  type="text"
                  value={newTaskDue}
                  onChange={(e) => setNewTaskDue(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-semibold"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddTaskModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-750"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black"
                >
                  Publicar Desafio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
