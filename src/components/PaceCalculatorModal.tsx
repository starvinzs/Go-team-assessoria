import React, { useState, useMemo } from 'react';
import { calculatePacesAndPredictions, formatSecToTime } from '../utils/paceCalculator';

interface PaceCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyPace?: (paceStr: string) => void;
}

export const PaceCalculatorModal: React.FC<PaceCalculatorModalProps> = ({
  isOpen,
  onClose,
  onApplyPace
}) => {
  if (!isOpen) return null;

  // Selected distance mode: 5 | 10 | 21.0975 | 42.195 | 'custom'
  const [selectedDistKey, setSelectedDistKey] = useState<string>('5');
  const [customKm, setCustomKm] = useState<string>('5.0');

  // Time in Hours, Minutes, Seconds
  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(27);
  const [seconds, setSeconds] = useState<number>(30);

  // Active view tab: 'zonas' | 'previsoes'
  const [activeTab, setActiveTab] = useState<'zonas' | 'previsoes'>('zonas');
  const [copiedText, setCopiedText] = useState(false);

  // Distance in KM
  const effectiveKm = useMemo(() => {
    if (selectedDistKey === 'custom') {
      const parsed = parseFloat(customKm);
      return isNaN(parsed) || parsed <= 0 ? 5 : parsed;
    }
    return parseFloat(selectedDistKey);
  }, [selectedDistKey, customKm]);

  // Total seconds
  const totalSeconds = useMemo(() => {
    return (hours * 3600) + (minutes * 60) + seconds;
  }, [hours, minutes, seconds]);

  // Calculations
  const results = useMemo(() => {
    if (totalSeconds <= 0 || effectiveKm <= 0) return null;
    return calculatePacesAndPredictions(effectiveKm, totalSeconds);
  }, [effectiveKm, totalSeconds]);

  // Presets
  const setPreset = (dist: string, h: number, m: number, s: number) => {
    setSelectedDistKey(dist);
    setHours(h);
    setMinutes(m);
    setSeconds(s);
  };

  const handleCopyZones = () => {
    if (!results) return;
    const text = `🎯 ZONAS DE TREINO GO TEAM (Base: ${results.basePace} min/km):
• Rodagem Leve: ${results.zones.easy.minPace} - ${results.zones.easy.maxPace} min/km
• Treino Longo: ${results.zones.longRun.minPace} - ${results.zones.longRun.maxPace} min/km
• Tempo / Limiar: ${results.zones.tempo.minPace} - ${results.zones.tempo.maxPace} min/km
• Tiros / Intervalados: ${results.zones.interval.minPace} - ${results.zones.interval.maxPace} min/km
• Velocidade: ${results.zones.repetition.minPace} - ${results.zones.repetition.maxPace} min/km
🏁 Previsão 10K: ${results.predictions[1].timeFormatted} (${results.predictions[1].paceFormatted})
🏁 Previsão 21K: ${results.predictions[2].timeFormatted} (${results.predictions[2].paceFormatted})`;

    navigator.clipboard?.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn">
      <div className="w-full max-w-xl rounded-3xl bg-[#082830] text-white border border-white/15 p-5 sm:p-6 shadow-2xl space-y-5 my-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#c6f43a] text-[#0d3b45] flex items-center justify-center font-display font-black text-xl shadow-glow">
              ⚡
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-display font-black uppercase text-white leading-none">
                Calculadora de Pace
              </h2>
              <p className="text-xs text-[#c6f43a] font-medium mt-0.5">
                Ritmos de prova e zonas de treino personalizadas
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm font-bold transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Seleção de Distância */}
        <div>
          <label className="block text-[11px] uppercase tracking-wider font-bold text-white/60 mb-2">
            1. Distância de Referência (Tempo Conhecido ou Meta)
          </label>
          <div className="grid grid-cols-4 sm:grid-cols-5 gap-1.5">
            {[
              { id: '5', label: '5K' },
              { id: '10', label: '10K' },
              { id: '21.0975', label: '21K Meia' },
              { id: '42.195', label: '42K Mara' },
              { id: 'custom', label: 'Outro km' }
            ].map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => setSelectedDistKey(d.id)}
                className={`py-2 px-1 text-xs font-bold rounded-xl border transition cursor-pointer ${
                  selectedDistKey === d.id
                    ? 'bg-[#c6f43a] text-[#0d3b45] border-[#c6f43a] shadow-sm'
                    : 'bg-white/5 text-white/80 border-white/10 hover:bg-white/10'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>

          {selectedDistKey === 'custom' && (
            <div className="mt-2.5 flex items-center gap-2">
              <span className="text-xs text-white/70">Distância exata:</span>
              <input
                type="number"
                step="0.1"
                min="0.5"
                max="100"
                value={customKm}
                onChange={(e) => setCustomKm(e.target.value)}
                className="w-24 bg-white/10 border border-white/20 rounded-lg px-2.5 py-1 text-sm font-bold text-white focus:outline-none focus:border-[#c6f43a]"
              />
              <span className="text-xs text-white/70">km</span>
            </div>
          )}
        </div>

        {/* Input de Tempo */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-[11px] uppercase tracking-wider font-bold text-white/60">
              2. Tempo Realizado ou Alvo
            </label>
            <span className="text-[11px] text-[#c6f43a] font-semibold">
              Total: {formatSecToTime(totalSeconds)}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            <div>
              <span className="block text-[10px] text-white/50 mb-1">Horas</span>
              <input
                type="number"
                min="0"
                max="24"
                value={hours}
                onChange={(e) => setHours(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full bg-[#0d3b45] border border-white/20 rounded-xl px-3 py-2 text-center text-lg font-black text-white focus:outline-none focus:border-[#c6f43a]"
              />
            </div>
            <div>
              <span className="block text-[10px] text-white/50 mb-1">Minutos</span>
              <input
                type="number"
                min="0"
                max="59"
                value={minutes}
                onChange={(e) => setMinutes(Math.min(59, Math.max(0, parseInt(e.target.value) || 0)))}
                className="w-full bg-[#0d3b45] border border-white/20 rounded-xl px-3 py-2 text-center text-lg font-black text-white focus:outline-none focus:border-[#c6f43a]"
              />
            </div>
            <div>
              <span className="block text-[10px] text-white/50 mb-1">Segundos</span>
              <input
                type="number"
                min="0"
                max="59"
                value={seconds}
                onChange={(e) => setSeconds(Math.min(59, Math.max(0, parseInt(e.target.value) || 0)))}
                className="w-full bg-[#0d3b45] border border-white/20 rounded-xl px-3 py-2 text-center text-lg font-black text-white focus:outline-none focus:border-[#c6f43a]"
              />
            </div>
          </div>

          {/* Atalhos Rápidos */}
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            <span className="text-[10px] text-white/50 self-center mr-1">Atalhos:</span>
            <button
              type="button"
              onClick={() => setPreset('5', 0, 24, 0)}
              className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/10 hover:bg-[#c6f43a] hover:text-[#0d3b45] transition cursor-pointer"
            >
              5K em 24min
            </button>
            <button
              type="button"
              onClick={() => setPreset('5', 0, 27, 30)}
              className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/10 hover:bg-[#c6f43a] hover:text-[#0d3b45] transition cursor-pointer"
            >
              5K em 27m30s
            </button>
            <button
              type="button"
              onClick={() => setPreset('10', 0, 52, 0)}
              className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/10 hover:bg-[#c6f43a] hover:text-[#0d3b45] transition cursor-pointer"
            >
              10K em 52min
            </button>
            <button
              type="button"
              onClick={() => setPreset('21.0975', 1, 55, 0)}
              className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/10 hover:bg-[#c6f43a] hover:text-[#0d3b45] transition cursor-pointer"
            >
              21K em 1h55m
            </button>
          </div>
        </div>

        {/* Display do Pace Médio Base */}
        {results && (
          <div className="rounded-2xl bg-[#0d3b45] border border-[#c6f43a]/30 p-4 flex items-center justify-between shadow-sm">
            <div>
              <span className="text-[11px] text-white/70 uppercase font-bold tracking-wider">
                Ritmo Médio Calculado (Pace)
              </span>
              <p className="text-3xl font-display font-black text-[#c6f43a] leading-none mt-1">
                {results.basePace} <span className="text-base text-white/80 font-normal">min/km</span>
              </p>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-white/60 font-medium">Velocidade Média</span>
              <p className="text-lg font-bold text-white">
                {((effectiveKm / (totalSeconds / 3600))).toFixed(1)} km/h
              </p>
            </div>
          </div>
        )}

        {/* Tabs de Resultados */}
        <div className="flex border-b border-white/15">
          <button
            type="button"
            onClick={() => setActiveTab('zonas')}
            className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition cursor-pointer ${
              activeTab === 'zonas'
                ? 'border-[#c6f43a] text-[#c6f43a]'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            🎯 Zonas de Treino Go Team
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('previsoes')}
            className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition cursor-pointer ${
              activeTab === 'previsoes'
                ? 'border-[#c6f43a] text-[#c6f43a]'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            🏁 Previsão de Provas
          </button>
        </div>

        {/* Conteúdo Zonas de Treino */}
        {results && activeTab === 'zonas' && (
          <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
            {/* 1. Rodagem Leve */}
            <div className="rounded-xl bg-white/5 p-3 border border-white/10 hover:border-emerald-400/40 transition">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <span className="text-xs font-bold text-white uppercase">Rodagem Leve / Regenerativo</span>
                </div>
                <span className="text-sm font-black text-emerald-300 font-mono">
                  {results.zones.easy.minPace} - {results.zones.easy.maxPace} min/km
                </span>
              </div>
              <p className="text-[11px] text-white/70 mt-1 leading-snug">
                {results.zones.easy.desc}
              </p>
            </div>

            {/* 2. Longão */}
            <div className="rounded-xl bg-white/5 p-3 border border-white/10 hover:border-cyan-400/40 transition">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                  <span className="text-xs font-bold text-white uppercase">Treino Longo (Long Run)</span>
                </div>
                <span className="text-sm font-black text-cyan-300 font-mono">
                  {results.zones.longRun.minPace} - {results.zones.longRun.maxPace} min/km
                </span>
              </div>
              <p className="text-[11px] text-white/70 mt-1 leading-snug">
                {results.zones.longRun.desc}
              </p>
            </div>

            {/* 3. Tempo Run */}
            <div className="rounded-xl bg-white/5 p-3 border border-white/10 hover:border-amber-400/40 transition">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span className="text-xs font-bold text-white uppercase">Tempo Run / Ritmo de Limiar</span>
                </div>
                <span className="text-sm font-black text-amber-300 font-mono">
                  {results.zones.tempo.minPace} - {results.zones.tempo.maxPace} min/km
                </span>
              </div>
              <p className="text-[11px] text-white/70 mt-1 leading-snug">
                {results.zones.tempo.desc}
              </p>
            </div>

            {/* 4. Tiros Intervalados */}
            <div className="rounded-xl bg-white/5 p-3 border border-white/10 hover:border-orange-400/40 transition">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-400" />
                  <span className="text-xs font-bold text-white uppercase">Tiros / Intervalados (400m-1km)</span>
                </div>
                <span className="text-sm font-black text-orange-300 font-mono">
                  {results.zones.interval.minPace} - {results.zones.interval.maxPace} min/km
                </span>
              </div>
              <p className="text-[11px] text-white/70 mt-1 leading-snug">
                {results.zones.interval.desc}
              </p>
            </div>

            {/* 5. Velocidade / Repetições */}
            <div className="rounded-xl bg-white/5 p-3 border border-white/10 hover:border-red-400/40 transition">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <span className="text-xs font-bold text-white uppercase">Velocidade Pura (200m-400m)</span>
                </div>
                <span className="text-sm font-black text-red-300 font-mono">
                  {results.zones.repetition.minPace} - {results.zones.repetition.maxPace} min/km
                </span>
              </div>
              <p className="text-[11px] text-white/70 mt-1 leading-snug">
                {results.zones.repetition.desc}
              </p>
            </div>
          </div>
        )}

        {/* Conteúdo Previsões de Prova */}
        {results && activeTab === 'previsoes' && (
          <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
            <p className="text-xs text-white/70 italic">
              Previsões baseadas na fórmula fisiológica de Pete Riegel (mantendo condicionamento equivalente para cada distância):
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {results.predictions.map((pred) => (
                <div
                  key={pred.distName}
                  className="rounded-2xl bg-white/5 border border-white/10 p-3.5 flex flex-col justify-between"
                >
                  <span className="text-xs font-bold text-[#c6f43a] uppercase">
                    {pred.distName}
                  </span>
                  <div className="mt-2">
                    <p className="text-2xl font-display font-black text-white leading-none">
                      {pred.timeFormatted}
                    </p>
                    <p className="text-xs text-white/60 font-mono mt-1">
                      Pace: <strong className="text-white font-semibold">{pred.paceFormatted}</strong>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Botões de Ação */}
        <div className="pt-2 flex items-center gap-3">
          <button
            type="button"
            onClick={handleCopyZones}
            className="flex-1 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            {copiedText ? '✓ Zonas Copiadas!' : '📋 Copiar Resumo de Zonas'}
          </button>

          {onApplyPace && results && (
            <button
              type="button"
              onClick={() => {
                onApplyPace(results.basePace);
                onClose();
              }}
              className="flex-1 py-3 rounded-full bg-[#c6f43a] text-[#0d3b45] font-black text-xs shadow-glow hover:scale-105 active:scale-95 transition cursor-pointer"
            >
              ⚡ Aplicar Pace aos Treinos
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
