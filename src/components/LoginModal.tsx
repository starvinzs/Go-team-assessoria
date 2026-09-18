import React, { useState } from 'react';
import { CONTATO_WHATSAPP } from '../data/goTeamConstants';
import { User, Mail, Phone, MapPin, Calendar, Lock, UserPlus, LogIn, Sparkles } from 'lucide-react';

export interface LoginUserData {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  city?: string;
  age?: number;
  gender?: 'M' | 'F' | 'Outro';
  runningLevel?: 'zero' | 'iniciante' | 'intermediario' | 'avancado';
  paceGroup?: 'Sub-20' | 'Sub-25' | 'Sub-30' | 'Sub-35' | 'Livre';
}

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (data: LoginUserData) => void;
  initialMode?: 'login' | 'register';
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialMode = 'login'
}) => {
  const [tab, setTab] = useState<'login' | 'register'>(initialMode);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regCity, setRegCity] = useState('São Paulo, SP');
  const [regAge, setRegAge] = useState('28');
  const [regGender, setRegGender] = useState<'M' | 'F' | 'Outro'>('F');
  const [regLevel, setRegLevel] = useState<'zero' | 'iniciante' | 'intermediario' | 'avancado'>('iniciante');
  const [regPaceGroup, setRegPaceGroup] = useState<'Sub-20' | 'Sub-25' | 'Sub-30' | 'Sub-35' | 'Livre'>('Sub-30');
  const [regPassword, setRegPassword] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const email = loginEmail.trim() || 'atleta@goteam.com';

    // Check if we have saved profile matching this email or recent
    try {
      const saved = localStorage.getItem('goteam_athlete_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.email === email) {
          onSuccess(parsed);
          return;
        }
      }
    } catch (err) {
      console.warn('Error reading stored athlete', err);
    }

    // Default student
    const defaultData: LoginUserData = {
      name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      email,
      phone: '(11) 98765-4321',
      city: 'São Paulo, SP',
      age: 29,
      gender: 'M',
      runningLevel: 'iniciante',
      paceGroup: 'Sub-30'
    };

    localStorage.setItem('goteam_athlete_profile', JSON.stringify(defaultData));
    onSuccess(defaultData);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim()) {
      alert('Por favor, preencha nome e e-mail.');
      return;
    }

    const newAthlete: LoginUserData = {
      id: `athlete_${Date.now()}`,
      name: regName.trim(),
      email: regEmail.trim().toLowerCase(),
      phone: regPhone.trim() || '(11) 99999-9999',
      city: regCity.trim() || 'São Paulo, SP',
      age: parseInt(regAge, 10) || 28,
      gender: regGender,
      runningLevel: regLevel,
      paceGroup: regPaceGroup
    };

    localStorage.setItem('goteam_athlete_profile', JSON.stringify(newAthlete));
    onSuccess(newAthlete);
  };

  const handleDemoStudent = (name: string, email: string, city: string, paceGroup: any) => {
    const isCoach = email === 'starvinzs@gmail.com';
    const demo: LoginUserData = {
      name: isCoach ? 'Leandro Irineu da Silva' : name,
      email,
      phone: '(11) 98765-4321',
      city,
      age: isCoach ? 38 : 28,
      gender: isCoach ? 'M' : 'F',
      runningLevel: isCoach ? 'avancado' : 'intermediario',
      paceGroup: isCoach ? 'Sub-20' : paceGroup
    };
    localStorage.setItem('goteam_athlete_profile', JSON.stringify(demo));
    onSuccess(demo);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-200 text-[#0d3b45] my-auto max-h-[92vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-[#0d3b45] text-xl font-bold p-1 cursor-pointer w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center transition"
        >
          ✕
        </button>

        {/* Top Header */}
        <div className="text-center mb-5 flex-none">
          <img
            src="/assets/go-team-logo.png"
            alt="Go Team"
            className="h-10 w-auto mx-auto mb-2 object-contain"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <h3 className="text-2xl font-display font-black text-[#0d3b45] uppercase tracking-tight">
            Assessoria Go Team
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {tab === 'login'
              ? 'Acesse seus treinos e acompanhamento esportivo'
              : 'Cadastre-se para prescrever seus treinos com o Coach Leandro'}
          </p>
        </div>

        {/* Alternador de Abas: Login / Cadastro */}
        <div className="flex bg-slate-100 p-1 rounded-2xl mb-5 flex-none border border-slate-200">
          <button
            type="button"
            onClick={() => setTab('login')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
              tab === 'login'
                ? 'bg-white text-[#0d3b45] shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Já sou Aluno (Entrar)</span>
          </button>
          <button
            type="button"
            onClick={() => setTab('register')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
              tab === 'register'
                ? 'bg-[#c6f43a] text-[#0d3b45] font-black shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Novo Aluno (Cadastrar)</span>
          </button>
        </div>

        {/* ================= ABA DE LOGIN RÁPIDO ================= */}
        {tab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4 overflow-y-auto">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                E-mail do corredor
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  placeholder="seuemail@exemplo.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full rounded-xl border-2 border-slate-200 pl-10 pr-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#c6f43a]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Senha de acesso
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full rounded-xl border-2 border-slate-200 pl-10 pr-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#c6f43a]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#c6f43a] hover:bg-[#b8e432] text-[#0d3b45] rounded-full py-3.5 text-sm font-black shadow-glow transition cursor-pointer mt-1"
            >
              Entrar na Minha Área do Aluno →
            </button>

            {/* Acesso Rápido de Demonstração */}
            <div className="pt-2 border-t border-slate-100">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 text-center mb-2">
                Ou acesse com perfis rápidos:
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleDemoStudent('Carolina Mendes', 'carolina.mendes@runner.com', 'São Paulo, SP', 'Sub-25')}
                  className="p-2 rounded-xl border border-slate-200 hover:border-[#c6f43a] bg-slate-50 text-left text-xs transition cursor-pointer"
                >
                  <p className="font-bold text-[#0d3b45]">Carolina Mendes</p>
                  <p className="text-[10px] text-slate-500">São Paulo • Sub-25</p>
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoStudent('Lucas Rocha', 'lucas.rocha@runner.com', 'Rio de Janeiro, RJ', 'Sub-30')}
                  className="p-2 rounded-xl border border-slate-200 hover:border-[#c6f43a] bg-slate-50 text-left text-xs transition cursor-pointer"
                >
                  <p className="font-bold text-[#0d3b45]">Lucas Rocha</p>
                  <p className="text-[10px] text-slate-500">Rio de Janeiro • Sub-30</p>
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoStudent('Leandro Irineu', 'starvinzs@gmail.com', 'São Paulo, SP', 'Sub-20')}
                  className="col-span-2 p-2.5 rounded-xl border-2 border-[#c6f43a] hover:bg-emerald-50 bg-[#0d3b45] text-white text-left text-xs transition cursor-pointer flex items-center justify-between shadow-sm"
                >
                  <div>
                    <p className="font-bold text-[#c6f43a] flex items-center gap-1.5">
                      <span>👑</span>
                      <span>Treinador Leandro (starvinzs@gmail.com)</span>
                    </p>
                    <p className="text-[10px] text-white/80">Login Professor • Acesso Exclusivo à Anamnese dos Alunos</p>
                  </div>
                  <span className="text-[9px] font-black bg-[#c6f43a] text-[#0d3b45] px-2 py-0.5 rounded uppercase">
                    Coach
                  </span>
                </button>
              </div>
            </div>
          </form>
        )}

        {/* ================= ABA DE CADASTRO COMPLETO DO ATLETA ================= */}
        {tab === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-3.5 overflow-y-auto pr-1">
            {/* Nome Completo */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Nome Completo do Atleta *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  placeholder="Ex: Mariana Vasconcelos"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="w-full rounded-xl border-2 border-slate-200 pl-9 pr-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#c6f43a]"
                />
              </div>
            </div>

            {/* E-mail e WhatsApp */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  E-mail *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    placeholder="aluno@email.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full rounded-xl border-2 border-slate-200 pl-9 pr-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#c6f43a]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  WhatsApp (DDD + Número) *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="tel"
                    required
                    placeholder="(11) 98765-4321"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    className="w-full rounded-xl border-2 border-slate-200 pl-9 pr-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#c6f43a]"
                  />
                </div>
              </div>
            </div>

            {/* Cidade e Idade */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Cidade e Estado *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    placeholder="São Paulo, SP"
                    value={regCity}
                    onChange={(e) => setRegCity(e.target.value)}
                    className="w-full rounded-xl border-2 border-slate-200 pl-9 pr-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#c6f43a]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Idade (anos)
                  </label>
                  <input
                    type="number"
                    min="14"
                    max="90"
                    required
                    value={regAge}
                    onChange={(e) => setRegAge(e.target.value)}
                    className="w-full rounded-xl border-2 border-slate-200 px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#c6f43a]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Sexo
                  </label>
                  <select
                    value={regGender}
                    onChange={(e) => setRegGender(e.target.value as any)}
                    className="w-full rounded-xl border-2 border-slate-200 px-2 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#c6f43a] cursor-pointer"
                  >
                    <option value="F">Feminino</option>
                    <option value="M">Masculino</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Nível e Pelotão */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Nível Atual de Corrida
                </label>
                <select
                  value={regLevel}
                  onChange={(e) => setRegLevel(e.target.value as any)}
                  className="w-full rounded-xl border-2 border-slate-200 px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#c6f43a] cursor-pointer"
                >
                  <option value="zero">Iniciante do Zero (Caminhada + Corrida)</option>
                  <option value="iniciante">Já Corro 3k a 5k</option>
                  <option value="intermediario">Intermediário (5k a 10k)</option>
                  <option value="avancado">Avançado / Meia Maratona (21k)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Pelotão / Ritmo Alvo
                </label>
                <select
                  value={regPaceGroup}
                  onChange={(e) => setRegPaceGroup(e.target.value as any)}
                  className="w-full rounded-xl border-2 border-slate-200 px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#c6f43a] cursor-pointer"
                >
                  <option value="Livre">Livre / Ritmo de Iniciação</option>
                  <option value="Sub-35">Pelotão Sub-35 (Pace 6:30 - 7:00)</option>
                  <option value="Sub-30">Pelotão Sub-30 (Pace 5:30 - 6:00)</option>
                  <option value="Sub-25">Pelotão Sub-25 (Pace 4:40 - 5:00)</option>
                  <option value="Sub-20">Pelotão Sub-20 (Pace &lt; 4:00)</option>
                </select>
              </div>
            </div>

            {/* Senha */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Criar Senha de Acesso
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  placeholder="Crie uma senha de 6 dígitos"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="w-full rounded-xl border-2 border-slate-200 pl-9 pr-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#c6f43a]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#c6f43a] hover:bg-[#b8e432] text-[#0d3b45] rounded-full py-3.5 text-sm font-black shadow-glow transition cursor-pointer mt-2 flex items-center justify-center gap-1.5"
            >
              <span>Concluir Cadastro & Acessar Assessoria →</span>
            </button>
          </form>
        )}

        <div className="mt-4 pt-3 border-t border-slate-100 text-center flex-none">
          <p className="text-xs text-slate-500">
            Dúvidas no cadastro?{' '}
            <a
              href={CONTATO_WHATSAPP}
              target="_blank"
              rel="noreferrer"
              className="font-bold text-[#0d3b45] underline hover:text-[#a5cf2a]"
            >
              Falar com o Treinador Leandro
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
