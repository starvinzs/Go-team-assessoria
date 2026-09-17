import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Heart,
  Activity,
  AlertTriangle,
  Calendar,
  Clock,
  Watch,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  User,
  Scale,
  Ruler
} from 'lucide-react';
import { AnamneseData } from '../types';

interface AnamneseQuestionnaireModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userName: string;
  userEmail: string;
  planDistance?: string;
  initialData?: AnamneseData | null;
  onSave: (data: AnamneseData) => void;
}

export const AnamneseQuestionnaireModal: React.FC<AnamneseQuestionnaireModalProps> = ({
  isOpen,
  onClose,
  userId,
  userName,
  userEmail,
  planDistance = '5K',
  initialData,
  onSave
}) => {
  const [heightCm, setHeightCm] = useState<number>(initialData?.heightCm || 172);
  const [weightKg, setWeightKg] = useState<number>(initialData?.weightKg || 72);
  const [birthDateOrAge, setBirthDateOrAge] = useState<string>(initialData?.birthDateOrAge || '30');
  const [gender, setGender] = useState<string>(initialData?.gender || 'Masculino');

  // PAR-Q
  const [parqHeartIssue, setParqHeartIssue] = useState<boolean>(initialData?.parqHeartIssue || false);
  const [parqChestPain, setParqChestPain] = useState<boolean>(initialData?.parqChestPain || false);
  const [parqMedication, setParqMedication] = useState<string>(initialData?.parqMedication || '');

  // Injuries
  const [selectedInjuries, setSelectedInjuries] = useState<string[]>(
    initialData?.injuriesHistory || ['Nenhuma lesão']
  );

  // Experience and availability
  const [strengthTraining, setStrengthTraining] = useState<string>(
    initialData?.strengthTraining || 'Sim, 2x por semana'
  );
  const [runningExperience, setRunningExperience] = useState<string>(
    initialData?.runningExperience || 'Começando do zero'
  );
  const [weeklyAvailabilityDays, setWeeklyAvailabilityDays] = useState<number>(
    initialData?.weeklyAvailabilityDays || 3
  );
  const [preferredTimeOfDay, setPreferredTimeOfDay] = useState<string>(
    initialData?.preferredTimeOfDay || 'Manhã cedo (06h - 08h)'
  );
  const [mainGoal, setMainGoal] = useState<string>(
    initialData?.mainGoal || `Completar os primeiros ${planDistance} sem parar`
  );
  const [deviceType, setDeviceType] = useState<string>(
    initialData?.deviceType || 'Garmin / Smartwatch com GPS'
  );
  const [runningShoe, setRunningShoe] = useState<string>(
    initialData?.runningShoe || 'Tênis de amortecimento padrão'
  );
  const [additionalNotes, setAdditionalNotes] = useState<string>(
    initialData?.additionalNotes || ''
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  // Calculate IMC
  const imc = (weightKg / ((heightCm / 100) * (heightCm / 100))).toFixed(1);
  let imcCategory = 'Peso normal';
  let imcColor = 'text-emerald-400';
  const imcNum = parseFloat(imc);
  if (imcNum < 18.5) {
    imcCategory = 'Abaixo do peso';
    imcColor = 'text-amber-400';
  } else if (imcNum >= 25 && imcNum < 29.9) {
    imcCategory = 'Sobrepeso leve';
    imcColor = 'text-amber-300';
  } else if (imcNum >= 30) {
    imcCategory = 'Obesidade (Cuidado com impacto)';
    imcColor = 'text-rose-400';
  }

  const toggleInjury = (injury: string) => {
    if (injury === 'Nenhuma lesão') {
      setSelectedInjuries(['Nenhuma lesão']);
      return;
    }
    const filtered = selectedInjuries.filter((i) => i !== 'Nenhuma lesão');
    if (filtered.includes(injury)) {
      const next = filtered.filter((i) => i !== injury);
      setSelectedInjuries(next.length === 0 ? ['Nenhuma lesão'] : next);
    } else {
      setSelectedInjuries([...filtered, injury]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const anamneseResult: AnamneseData = {
      heightCm,
      weightKg,
      birthDateOrAge,
      gender,
      parqHeartIssue,
      parqChestPain,
      parqMedication,
      injuriesHistory: selectedInjuries,
      strengthTraining,
      runningExperience,
      weeklyAvailabilityDays,
      preferredTimeOfDay,
      mainGoal,
      deviceType,
      runningShoe,
      additionalNotes,
      submittedAt: new Date().toISOString()
    };

    setTimeout(() => {
      localStorage.setItem(`goteam_anamnese_${userId}`, JSON.stringify(anamneseResult));
      onSave(anamneseResult);
      setIsSubmitting(false);
      setIsSuccess(true);

      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.5 }
        });
      } catch (err) {
        console.warn('Confetti error', err);
      }
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#082830] text-white rounded-3xl shadow-2xl border border-white/15 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header com identidade Go Team */}
        <div className="bg-gradient-to-r from-[#041a1f] to-[#0d3b45] p-5 border-b border-white/10 flex-none relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm font-bold transition cursor-pointer"
          >
            ✕
          </button>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#c6f43a] text-[#0d3b45] flex items-center justify-center font-black text-xl shadow-md">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-display font-black uppercase tracking-tight text-white leading-tight">
                  Avaliação Física & Anamnese
                </h2>
                <span className="text-[10px] font-black bg-[#c6f43a] text-[#0d3b45] px-2 py-0.5 rounded-full uppercase">
                  Obrigatório
                </span>
              </div>
              <p className="text-xs text-[#c6f43a] font-medium mt-0.5">
                Para o Treinador Leandro Irineu personalizar sua planilha de {planDistance}
              </p>
            </div>
          </div>
        </div>

        {/* ================= TELA DE SUCESSO ================= */}
        {isSuccess ? (
          <div className="p-6 sm:p-8 text-center space-y-5 overflow-y-auto">
            <div className="w-20 h-20 mx-auto rounded-full bg-[#c6f43a] text-[#0d3b45] flex items-center justify-center text-3xl font-black shadow-glow animate-bounce">
              ✓
            </div>
            <div>
              <span className="text-xs font-bold text-[#c6f43a] uppercase tracking-widest bg-[#c6f43a]/10 px-3 py-1 rounded-full border border-[#c6f43a]/30">
                Questionário Gravado com Sucesso
              </span>
              <h3 className="text-2xl font-display font-black text-white mt-3">
                Parabéns, {userName}!
              </h3>
              <p className="text-sm text-white/80 max-w-md mx-auto mt-2 leading-relaxed">
                Suas informações antropométricas, histórico de saúde e objetivos foram enviados
                diretamente para a equipe do <strong>Treinador Leandro Irineu da Silva</strong>.
              </p>
            </div>

            {/* Recado do Treinador */}
            <div className="bg-white/10 rounded-2xl p-4 border border-[#c6f43a]/30 text-left flex items-start gap-3.5 max-w-lg mx-auto">
              <img
                src="https://images.unsplash.com/photo-1594824813525-63567675122e?w=150&auto=format&fit=crop&q=80"
                alt="Treinador Leandro"
                className="w-12 h-12 rounded-full object-cover border-2 border-[#c6f43a] flex-none"
              />
              <div>
                <p className="text-xs font-black text-[#c6f43a] uppercase">Recado do Treinador Leandro Irineu:</p>
                <p className="text-xs text-white/90 leading-relaxed mt-1 italic">
                  “Excelente iniciativa! Conhecer seu peso, altura ({heightCm}cm / {weightKg}kg) e histórico
                  é o que nos garante prescrever ritmos seguros, sem risco de lesão. Sua planilha já está
                  calibrada!”
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full max-w-sm mx-auto bg-[#c6f43a] hover:bg-[#b8e432] text-[#0d3b45] font-display font-black text-sm uppercase tracking-wider py-3.5 rounded-full transition shadow-glow cursor-pointer block"
            >
              Acessar Meus Treinos na Planilha →
            </button>
          </div>
        ) : (
          /* ================= FORMULÁRIO COMPLETO DE ANAMNESE ================= */
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-6 overflow-y-auto flex-1 text-left">
            {/* Aviso Informativo */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 text-xs text-white/80 flex items-start gap-2.5">
              <ShieldCheck className="w-5 h-5 text-[#c6f43a] shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                Este questionário segue o padrão <strong>PAR-Q (Physical Activity Readiness Questionnaire)</strong> da
                assessoria esportiva, garantindo que sua progressão nos treinos seja 100% segura e adaptada ao seu corpo.
              </p>
            </div>

            {/* SEÇÃO 1: DADOS BIOMÉTRICOS & IMC */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#c6f43a]">
                <Scale className="w-4 h-4" />
                <span>1. Dados Corporais & Biometria</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {/* Altura */}
                <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                  <label className="block text-[10px] uppercase font-bold text-white/60 mb-1">
                    Altura (cm)
                  </label>
                  <input
                    type="number"
                    min="120"
                    max="230"
                    required
                    value={heightCm}
                    onChange={(e) => setHeightCm(Number(e.target.value))}
                    className="w-full bg-black/30 border border-white/20 rounded-lg px-2.5 py-1.5 text-sm font-bold text-white focus:outline-none focus:border-[#c6f43a]"
                  />
                  <span className="text-[10px] text-white/40 mt-0.5 block">Ex: 175</span>
                </div>

                {/* Peso */}
                <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                  <label className="block text-[10px] uppercase font-bold text-white/60 mb-1">
                    Peso Atual (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="35"
                    max="220"
                    required
                    value={weightKg}
                    onChange={(e) => setWeightKg(Number(e.target.value))}
                    className="w-full bg-black/30 border border-white/20 rounded-lg px-2.5 py-1.5 text-sm font-bold text-white focus:outline-none focus:border-[#c6f43a]"
                  />
                  <span className="text-[10px] text-white/40 mt-0.5 block">Ex: 72.5</span>
                </div>

                {/* Idade */}
                <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                  <label className="block text-[10px] uppercase font-bold text-white/60 mb-1">
                    Idade (anos)
                  </label>
                  <input
                    type="text"
                    required
                    value={birthDateOrAge}
                    onChange={(e) => setBirthDateOrAge(e.target.value)}
                    className="w-full bg-black/30 border border-white/20 rounded-lg px-2.5 py-1.5 text-sm font-bold text-white focus:outline-none focus:border-[#c6f43a]"
                  />
                  <span className="text-[10px] text-white/40 mt-0.5 block">Ex: 32</span>
                </div>

                {/* Sexo */}
                <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                  <label className="block text-[10px] uppercase font-bold text-white/60 mb-1">
                    Sexo Biológico
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full bg-black/30 border border-white/20 rounded-lg px-2.5 py-1.5 text-xs font-bold text-white focus:outline-none focus:border-[#c6f43a] cursor-pointer"
                  >
                    <option value="Masculino" className="bg-slate-900">Masculino</option>
                    <option value="Feminino" className="bg-slate-900">Feminino</option>
                    <option value="Outro" className="bg-slate-900">Outro</option>
                  </select>
                </div>
              </div>

              {/* Box de IMC em Tempo Real */}
              <div className="bg-black/30 rounded-xl p-3 border border-white/10 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-base">📊</span>
                  <div>
                    <p className="font-bold text-white">
                      Índice de Massa Corporal (IMC): <strong className="text-white text-sm">{imc} kg/m²</strong>
                    </p>
                    <p className={`text-[11px] font-semibold ${imcColor}`}>{imcCategory}</p>
                  </div>
                </div>
                <span className="text-[10px] text-white/50 text-right">
                  Usado para calibrar a sobrecarga articular
                </span>
              </div>
            </div>

            {/* SEÇÃO 2: SAÚDE CARDIORRESPIRATÓRIA & PAR-Q */}
            <div className="space-y-3 pt-3 border-t border-white/10">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#c6f43a]">
                <Heart className="w-4 h-4 text-rose-400" />
                <span>2. Questionário de Prontidão Cardiovascular (PAR-Q)</span>
              </div>

              <div className="space-y-2.5">
                {/* Pergunta 1: Pressão / Coração */}
                <div className="bg-white/5 rounded-xl p-3 border border-white/10 flex items-center justify-between gap-3">
                  <p className="text-xs text-white/90">
                    Algum médico já recomendou cuidados por <strong>pressão alta, sopro ou problema no coração</strong>?
                  </p>
                  <div className="flex gap-1.5 flex-none">
                    <button
                      type="button"
                      onClick={() => setParqHeartIssue(false)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                        !parqHeartIssue
                          ? 'bg-emerald-500 text-slate-950 font-black'
                          : 'bg-white/10 text-white/60 hover:bg-white/20'
                      }`}
                    >
                      Não
                    </button>
                    <button
                      type="button"
                      onClick={() => setParqHeartIssue(true)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                        parqHeartIssue
                          ? 'bg-rose-500 text-white font-black'
                          : 'bg-white/10 text-white/60 hover:bg-white/20'
                      }`}
                    >
                      Sim
                    </button>
                  </div>
                </div>

                {/* Pergunta 2: Dor no peito / Tontura */}
                <div className="bg-white/5 rounded-xl p-3 border border-white/10 flex items-center justify-between gap-3">
                  <p className="text-xs text-white/90">
                    Você sente <strong>dor no peito, falta de ar anormal ou tontura</strong> ao praticar esforço físico?
                  </p>
                  <div className="flex gap-1.5 flex-none">
                    <button
                      type="button"
                      onClick={() => setParqChestPain(false)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                        !parqChestPain
                          ? 'bg-emerald-500 text-slate-950 font-black'
                          : 'bg-white/10 text-white/60 hover:bg-white/20'
                      }`}
                    >
                      Não
                    </button>
                    <button
                      type="button"
                      onClick={() => setParqChestPain(true)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                        parqChestPain
                          ? 'bg-rose-500 text-white font-black'
                          : 'bg-white/10 text-white/60 hover:bg-white/20'
                      }`}
                    >
                      Sim
                    </button>
                  </div>
                </div>

                {/* Medicações */}
                <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                  <label className="block text-[11px] font-bold text-white/80 mb-1">
                    Faz uso de algum medicamento contínuo? (Opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Nenhum, ou remédio de pressão/tireoide..."
                    value={parqMedication}
                    onChange={(e) => setParqMedication(e.target.value)}
                    className="w-full bg-black/30 border border-white/20 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#c6f43a]"
                  />
                </div>
              </div>
            </div>

            {/* SEÇÃO 3: HISTÓRICO ORTOPÉDICO E ARTICULAÇÕES */}
            <div className="space-y-3 pt-3 border-t border-white/10">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#c6f43a]">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>3. Histórico de Lesões & Articulações</span>
              </div>
              <p className="text-[11px] text-white/70">
                Selecione se já teve algum incômodo para adaptarmos os educativos e aquecimentos:
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  'Nenhuma lesão',
                  'Joelho (Condromalácia/Tendinite)',
                  'Fascite Plantar / Esporão',
                  'Canelite (Estresse Tibial)',
                  'Tendão de Aquiles',
                  'Coluna / Lombar'
                ].map((injury) => {
                  const isSelected = selectedInjuries.includes(injury);
                  return (
                    <button
                      key={injury}
                      type="button"
                      onClick={() => toggleInjury(injury)}
                      className={`p-2.5 rounded-xl text-left text-xs font-semibold border transition cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-[#c6f43a]/20 border-[#c6f43a] text-[#c6f43a]'
                          : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                      }`}
                    >
                      <span className="leading-tight">{injury}</span>
                      {isSelected && <span className="text-xs font-black">✓</span>}
                    </button>
                  );
                })}
              </div>

              {/* Fortalecimento */}
              <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                <label className="block text-[11px] font-bold text-white/80 mb-1.5">
                  Pratica fortalecimento muscular (musculação / funcional / pilates)?
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['Sim, 2x ou mais/sem', 'Ocasionalmente', 'Não pratico'].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setStrengthTraining(opt)}
                      className={`py-1.5 px-2 rounded-lg text-xs font-semibold border text-center transition cursor-pointer ${
                        strengthTraining === opt
                          ? 'bg-[#0d3b45] border-[#c6f43a] text-[#c6f43a] font-bold'
                          : 'bg-black/20 border-white/10 text-white/60 hover:text-white'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* SEÇÃO 4: EXPERIÊNCIA & DISPONIBILIDADE NA SEMANA */}
            <div className="space-y-3 pt-3 border-t border-white/10">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#c6f43a]">
                <Calendar className="w-4 h-4 text-cyan-300" />
                <span>4. Rotina & Disponibilidade de Treinos</span>
              </div>

              {/* Dias disponíveis */}
              <div>
                <label className="block text-[11px] font-bold text-white/80 mb-1.5">
                  Quantos dias por semana você tem disponibilidade para correr?
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[2, 3, 4, 5].map((days) => (
                    <button
                      key={days}
                      type="button"
                      onClick={() => setWeeklyAvailabilityDays(days)}
                      className={`py-2 rounded-xl text-center font-display font-black text-sm border transition cursor-pointer ${
                        weeklyAvailabilityDays === days
                          ? 'bg-[#c6f43a] text-[#0d3b45] border-[#c6f43a] shadow-sm'
                          : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                      }`}
                    >
                      {days} dias / sem
                    </button>
                  ))}
                </div>
              </div>

              {/* Horário preferido */}
              <div>
                <label className="block text-[11px] font-bold text-white/80 mb-1.5">
                  Qual o seu melhor horário para realizar os treinos?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    'Manhã cedo (05h-07h)',
                    'Manhã (08h-10h)',
                    'Horário Almoço',
                    'Noite (após 18h)'
                  ].map((turn) => (
                    <button
                      key={turn}
                      type="button"
                      onClick={() => setPreferredTimeOfDay(turn)}
                      className={`py-2 px-2 text-center text-[11px] font-semibold rounded-xl border transition cursor-pointer ${
                        preferredTimeOfDay === turn
                          ? 'bg-[#0d3b45] border-[#c6f43a] text-[#c6f43a] font-bold'
                          : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
                      }`}
                    >
                      {turn}
                    </button>
                  ))}
                </div>
              </div>

              {/* Equipamentos */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                  <label className="block text-[10px] uppercase font-bold text-white/60 mb-1">
                    Relógio ou GPS que utiliza
                  </label>
                  <select
                    value={deviceType}
                    onChange={(e) => setDeviceType(e.target.value)}
                    className="w-full bg-black/30 border border-white/20 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-white focus:outline-none focus:border-[#c6f43a] cursor-pointer"
                  >
                    <option value="Garmin" className="bg-slate-900">Garmin (Forerunner/Fenix)</option>
                    <option value="Apple Watch" className="bg-slate-900">Apple Watch</option>
                    <option value="Polar" className="bg-slate-900">Polar</option>
                    <option value="Coros" className="bg-slate-900">Coros</option>
                    <option value="Celular / Strava" className="bg-slate-900">Celular / Strava no Bolso</option>
                    <option value="Nenhum ainda" className="bg-slate-900">Nenhum ainda</option>
                  </select>
                </div>

                <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                  <label className="block text-[10px] uppercase font-bold text-white/60 mb-1">
                    Tênis principal de corrida
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Asics Novablast, Nike Pegasus..."
                    value={runningShoe}
                    onChange={(e) => setRunningShoe(e.target.value)}
                    className="w-full bg-black/30 border border-white/20 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#c6f43a]"
                  />
                </div>
              </div>

              {/* Observação para o treinador */}
              <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                <label className="block text-[11px] font-bold text-white/80 mb-1">
                  Alguma informação adicional para o Treinador Leandro? (Opcional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Ex: Já fiz 5k em 28 min ano passado; tenho plantão médico nas quartas..."
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  className="w-full bg-black/30 border border-white/20 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-[#c6f43a] resize-none"
                />
              </div>
            </div>

            {/* Botão de Envio */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-full bg-[#c6f43a] hover:bg-[#b8e432] text-[#0d3b45] font-display font-black text-base uppercase tracking-wider transition shadow-glow cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin text-lg">⏳</span>
                    <span>Gravando Avaliação com o Treinador Leandro...</span>
                  </>
                ) : (
                  <>
                    <span>Enviar Avaliação & Liberar Meus Treinos →</span>
                  </>
                )}
              </button>
              <p className="text-center text-[10px] text-white/50 mt-2">
                Seus dados são confidenciais e protegidos sob acompanhamento da Assessoria Go Team.
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
