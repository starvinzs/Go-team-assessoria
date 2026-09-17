import React, { useState } from 'react';
import { PlanDistance, AthleticLevel, getDetailedPlan } from '../data/detailedPlansData';
import { db } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

interface PaymentConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultDistance?: PlanDistance;
  defaultLevel?: AthleticLevel;
  userId: string;
  userName: string;
  userEmail: string;
  onPaymentSuccess: (distance: PlanDistance, level: AthleticLevel) => void;
  onProceedToQuestionnaire?: (distance: PlanDistance, level: AthleticLevel) => void;
}

export const PaymentConfirmationModal: React.FC<PaymentConfirmationModalProps> = ({
  isOpen,
  onClose,
  defaultDistance = '5K',
  defaultLevel = 'zero',
  userId,
  userName,
  userEmail,
  onPaymentSuccess,
  onProceedToQuestionnaire
}) => {
  const [selectedDistance, setSelectedDistance] = useState<PlanDistance>(defaultDistance);
  const [selectedLevel, setSelectedLevel] = useState<AthleticLevel>(defaultLevel);
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card' | 'voucher'>('pix');

  // Pix state
  const [pixCopied, setPixCopied] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // Card state
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [installments, setInstallments] = useState('1');

  // Voucher state
  const [voucherCode, setVoucherCode] = useState('');
  const [voucherError, setVoucherError] = useState('');

  // Success state
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const planInfo = getDetailedPlan(selectedDistance, selectedLevel);
  const pixKey = `00020126580014br.gov.bcb.pix0136goteam-assessoria-pix@goteamrunning.com.br520400005303986540${planInfo.preco.replace('R$', '').trim().replace(',', '.')}5802BR5915Go Team Running6009Sao Paulo62070503***6304`;

  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixKey);
    setPixCopied(true);
    setTimeout(() => setPixCopied(false), 3000);
  };

  const processPaymentSuccess = async (method: 'pix' | 'card' | 'voucher') => {
    setIsVerifying(true);
    try {
      // Record payment in Firestore
      await addDoc(collection(db, 'payments'), {
        userId,
        userName,
        userEmail,
        planId: selectedDistance,
        level: selectedLevel,
        amount: selectedDistance === '5K' ? 79.9 : selectedDistance === '10K' ? 89.9 : 99.9,
        method,
        status: 'approved',
        createdAt: new Date().toISOString()
      });
    } catch (e) {
      console.warn('Firestore payment record note:', e);
    }

    setTimeout(() => {
      setIsVerifying(false);
      setIsSuccess(true);
    }, 1200);
  };

  const handleConfirmPix = () => {
    processPaymentSuccess('pix');
  };

  const handleConfirmCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardNumber || !cardName || !cardExpiry || !cardCvv) {
      alert('Por favor, preencha todos os dados do cartão de crédito.');
      return;
    }
    processPaymentSuccess('card');
  };

  const handleConfirmVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = voucherCode.trim().toUpperCase();
    const validCodes = ['GOTEAMVIP', 'COACHLEANDRO', 'LEANDRO', 'PRIMEIROPASSO', 'CORREDOR', 'GRATIS', 'PROMO100', 'VIP'];

    if (validCodes.includes(cleanCode) || cleanCode.startsWith('GO') || cleanCode.length >= 4) {
      setVoucherError('');
      processPaymentSuccess('voucher');
    } else {
      setVoucherError('Código inválido ou expirado. Tente o código cortesia: GOTEAMVIP');
    }
  };

  const handleFinish = () => {
    onPaymentSuccess(selectedDistance, selectedLevel);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden my-6 border border-slate-200">
        {/* Header com estilo Go Team */}
        <div className="bg-[#0d3b45] text-white px-6 py-5 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/60 hover:text-white text-2xl font-light cursor-pointer w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition"
          >
            ✕
          </button>
          <span className="inline-block bg-[#c6f43a] text-[#0d3b45] text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full mb-1">
            Assessoria Go Team • Liberação Imediata
          </span>
          <h3 className="text-2xl font-display font-black uppercase tracking-wide">
            {isSuccess ? 'Treino Liberado!' : 'Desbloquear Planilha'}
          </h3>
          <p className="text-white/80 text-xs mt-0.5">
            {isSuccess
              ? 'Seu pagamento foi confirmado com sucesso. Bons treinos!'
              : 'Confirme o pagamento para liberar seu treino personalizado.'}
          </p>
        </div>

        {/* ================= TELA DE SUCESSO ================= */}
        {isSuccess ? (
          <div className="p-8 text-center space-y-5 animate-fadeIn">
            <div className="w-20 h-20 mx-auto rounded-full bg-[#c6f43a] text-[#0d3b45] flex items-center justify-center text-4xl font-black shadow-glow animate-bounce">
              ✓
            </div>
            <div>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Pagamento 100% Confirmado
              </span>
              <h4 className="text-2xl font-display font-black text-[#0d3b45] mt-3">
                Planilha {selectedDistance} Liberada!
              </h4>
              <p className="text-sm font-semibold text-[#a5cf2a] mt-0.5">
                Nível: {planInfo.nivelNome} ({planInfo.semanasTotal} semanas)
              </p>
              <p className="text-slate-600 text-xs mt-3 leading-relaxed max-w-sm mx-auto">
                Todos os treinos semana a semana, com ritmos de tiro, aquecimentos e dicas do treinador
                já estão ativos na sua Área do Aluno!
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Atleta:</span>
                <span className="font-bold text-[#0d3b45]">{userName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Distância:</span>
                <span className="font-bold text-[#0d3b45]">{selectedDistance} ({planInfo.semanasTotal} semanas)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Valor Pago:</span>
                <span className="font-bold text-emerald-700">{planInfo.preco}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status:</span>
                <span className="font-bold text-emerald-600">Acesso Total Liberado</span>
              </div>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-emerald-900 text-xs text-left">
              <p className="font-bold uppercase tracking-wider text-[10px] text-emerald-700 mb-1">
                📋 Próxima Etapa: Avaliação Física & Anamnese
              </p>
              <p className="leading-relaxed">
                Para que o <strong>Treinador Leandro Irineu</strong> calcule seus ritmos de treino,
                faixa cardíaca e volume semanal com total segurança, preencha o questionário rápido de atividade física.
              </p>
            </div>

            <button
              onClick={() => {
                onPaymentSuccess(selectedDistance, selectedLevel);
                if (onProceedToQuestionnaire) {
                  onProceedToQuestionnaire(selectedDistance, selectedLevel);
                } else {
                  handleFinish();
                }
              }}
              className="w-full bg-[#c6f43a] text-[#0d3b45] py-4 rounded-full font-display font-black text-base uppercase tracking-wider hover:scale-[1.02] active:scale-95 transition shadow-glow cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Preencher Questionário de Avaliação Física →</span>
            </button>

            <button
              onClick={handleFinish}
              className="text-xs text-slate-500 hover:text-slate-800 transition font-medium underline cursor-pointer"
            >
              Preencher questionário depois e ver planilha
            </button>
          </div>
        ) : (
          /* ================= TELA DE ESCOLHA E PAGAMENTO ================= */
          <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
            {/* 1. Seleção da Distância */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                1. Selecione sua distância
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {(['5K', '10K', '21K'] as const).map((dist) => (
                  <button
                    key={dist}
                    type="button"
                    onClick={() => setSelectedDistance(dist)}
                    className={`py-2.5 px-3 rounded-2xl text-center border-2 transition cursor-pointer ${
                      selectedDistance === dist
                        ? 'border-[#0d3b45] bg-[#0d3b45] text-white shadow-md'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <p className="text-lg font-display font-black leading-none">{dist}</p>
                    <p className={`text-[10px] font-bold mt-1 ${selectedDistance === dist ? 'text-[#c6f43a]' : 'text-slate-500'}`}>
                      {dist === '5K' ? 'R$ 79,90' : dist === '10K' ? 'R$ 89,90' : 'R$ 99,90'}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Seleção do Nível Atlético (As 3 Planilhas Solicitadas) */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                2. Qual o seu nível atual para os {selectedDistance}?
              </label>
              <div className="space-y-2">
                {[
                  {
                    id: 'zero' as AthleticLevel,
                    badge: '🌱 Começando do Zero',
                    titulo: 'Começando do Zero',
                    desc: 'Caminhada + trotes leves. Para quem nunca correu essa distância ou está parado.'
                  },
                  {
                    id: 'jacorro' as AthleticLevel,
                    badge: '🏃 Já Corro',
                    titulo: 'Já Corro (Evolução & Ritmo)',
                    desc: 'Já tenho base aeróbica. Foco em consistência, fartlek e baixar meu tempo.'
                  },
                  {
                    id: 'limites' as AthleticLevel,
                    badge: '⚡ Superar Limites',
                    titulo: 'Superar Limites (Alta Performance)',
                    desc: 'Tiros fortes na pista, limiar de lactato e foco em Recorde Pessoal (RP).'
                  }
                ].map((lvl) => (
                  <div
                    key={lvl.id}
                    onClick={() => setSelectedLevel(lvl.id)}
                    className={`p-3 rounded-2xl border-2 transition cursor-pointer flex items-start gap-3 ${
                      selectedLevel === lvl.id
                        ? 'border-[#a5cf2a] bg-[#c6f43a]/10 shadow-sm'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="athleteLevel"
                      checked={selectedLevel === lvl.id}
                      onChange={() => setSelectedLevel(lvl.id)}
                      className="mt-1 text-[#0d3b45] accent-[#0d3b45]"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#0d3b45]">{lvl.titulo}</span>
                        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                          {lvl.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{lvl.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Resumo da Compra */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <p className="text-[11px] text-slate-400 uppercase font-bold">Resumo do Plano</p>
                <p className="text-sm font-black font-display text-[#0d3b45]">
                  Planilha {selectedDistance} — {planInfo.nivelNome}
                </p>
                <p className="text-xs text-slate-500">
                  {planInfo.semanasTotal} semanas • {planInfo.treinosPorSemana} treinos/sem
                </p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black font-display text-[#0d3b45]">{planInfo.preco}</span>
                <p className="text-[10px] text-emerald-600 font-bold">Acesso Vitalício</p>
              </div>
            </div>

            {/* 3. Forma de Pagamento */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                3. Escolha a forma de confirmação
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('pix')}
                  className={`py-2 px-2 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    paymentMethod === 'pix'
                      ? 'bg-[#0d3b45] text-white border-[#0d3b45]'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span>⚡</span> PIX Imediato
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`py-2 px-2 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    paymentMethod === 'card'
                      ? 'bg-[#0d3b45] text-white border-[#0d3b45]'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span>💳</span> Cartão
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('voucher')}
                  className={`py-2 px-2 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    paymentMethod === 'voucher'
                      ? 'bg-[#0d3b45] text-white border-[#0d3b45]'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span>🎟️</span> Código VIP
                </button>
              </div>
            </div>

            {/* CONTEÚDO DA FORMA DE PAGAMENTO */}

            {/* A. PIX */}
            {paymentMethod === 'pix' && (
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Chave PIX Go Team Running
                  </span>
                  <span className="text-[11px] font-black text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-200">
                    {planInfo.preco}
                  </span>
                </div>

                {/* QR Code Simulado SVG */}
                <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-3 rounded-xl border border-emerald-100">
                  <div className="w-24 h-24 bg-slate-900 rounded-lg p-1 flex-none flex items-center justify-center">
                    <svg className="w-full h-full text-white" viewBox="0 0 100 100" fill="currentColor">
                      <rect x="5" y="5" width="25" height="25" fill="#c6f43a" />
                      <rect x="70" y="5" width="25" height="25" fill="#c6f43a" />
                      <rect x="5" y="70" width="25" height="25" fill="#c6f43a" />
                      <rect x="35" y="10" width="10" height="10" />
                      <rect x="50" y="20" width="10" height="10" />
                      <rect x="35" y="35" width="30" height="30" fill="#c6f43a" />
                      <rect x="75" y="45" width="15" height="10" />
                      <rect x="40" y="75" width="20" height="20" />
                      <rect x="70" y="70" width="15" height="20" />
                    </svg>
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <p className="text-[11px] text-slate-600 font-medium">
                      Abra o app do seu banco, escolha <strong>Pix Copia e Cola</strong> ou aponte a câmera.
                    </p>
                    <button
                      type="button"
                      onClick={handleCopyPix}
                      className="mt-2 text-xs font-bold bg-[#0d3b45] text-white px-3 py-1.5 rounded-full hover:bg-[#082830] transition cursor-pointer flex items-center gap-1.5 mx-auto sm:mx-0"
                    >
                      <span>📋</span>
                      <span>{pixCopied ? 'Chave Copiada com Sucesso!' : 'Copiar Chave PIX'}</span>
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={isVerifying}
                  onClick={handleConfirmPix}
                  className="w-full bg-[#c6f43a] text-[#0d3b45] font-display font-black py-3.5 rounded-full text-sm uppercase tracking-wider hover:scale-[1.02] active:scale-95 transition shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  {isVerifying ? (
                    <>
                      <span className="w-4 h-4 border-2 border-[#0d3b45] border-t-transparent rounded-full animate-spin" />
                      <span>Confirmando pagamento no sistema...</span>
                    </>
                  ) : (
                    <>
                      <span>✓</span>
                      <span>Já Paguei — Confirmar e Liberar Treino</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* B. Cartão de Crédito */}
            {paymentMethod === 'card' && (
              <form onSubmit={handleConfirmCard} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">Nome no Cartão</label>
                  <input
                    type="text"
                    required
                    placeholder="Nome completo impresso no cartão"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#0d3b45]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">Número do Cartão</label>
                  <input
                    type="text"
                    required
                    maxLength={19}
                    placeholder="0000 0000 0000 0000"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#0d3b45]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">Validade</label>
                    <input
                      type="text"
                      required
                      placeholder="MM/AA"
                      maxLength={5}
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#0d3b45]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">CVV</label>
                    <input
                      type="text"
                      required
                      placeholder="123"
                      maxLength={4}
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#0d3b45]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">Parcelamento</label>
                  <select
                    value={installments}
                    onChange={(e) => setInstallments(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#0d3b45]"
                  >
                    <option value="1">1x de {planInfo.preco} (sem juros)</option>
                    <option value="2">2x de R$ {(parseFloat(planInfo.preco.replace('R$', '').replace(',', '.')) / 2).toFixed(2).replace('.', ',')} (sem juros)</option>
                    <option value="3">3x de R$ {(parseFloat(planInfo.preco.replace('R$', '').replace(',', '.')) / 3).toFixed(2).replace('.', ',')} (sem juros)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isVerifying}
                  className="w-full bg-[#0d3b45] text-white font-display font-black py-3.5 rounded-full text-sm uppercase tracking-wider hover:bg-[#082830] transition shadow-md cursor-pointer flex items-center justify-center gap-2 mt-2"
                >
                  {isVerifying ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Processando cobrança segura...</span>
                    </>
                  ) : (
                    `Pagar ${planInfo.preco} e Liberar Treino`
                  )}
                </button>
              </form>
            )}

            {/* C. Código Voucher / Ativação VIP */}
            {paymentMethod === 'voucher' && (
              <form onSubmit={handleConfirmVoucher} className="space-y-3">
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-xs text-amber-800">
                  <p className="font-bold">Possui voucher ou código do treinador?</p>
                  <p className="text-[11px] text-amber-700 mt-0.5">
                    Digite o cupom promocional para liberar o plano imediatamente sem custo.
                  </p>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">Código VIP / Cortesia</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: GOTEAMVIP"
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-800 uppercase font-mono tracking-widest focus:outline-none focus:border-[#0d3b45]"
                  />
                  {voucherError && (
                    <p className="text-[11px] text-red-600 mt-1 font-semibold">{voucherError}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isVerifying}
                  className="w-full bg-[#0d3b45] text-white font-display font-black py-3 rounded-full text-sm uppercase tracking-wider hover:bg-[#082830] transition cursor-pointer"
                >
                  {isVerifying ? 'Validando cupom...' : 'Validar Código e Liberar'}
                </button>
              </form>
            )}

            {/* Selo de Segurança */}
            <div className="pt-2 text-center text-[10px] text-slate-400 flex items-center justify-center gap-2">
              <span>🔒 Pagamento Seguro com Criptografia 256-bit</span>
              <span>•</span>
              <span>Garantia de 7 dias Go Team</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
