import React from 'react';
import { GOTEAM_PLANOS, DEPOIMENTOS, CONTATO_WHATSAPP, INSTAGRAM_LINK } from '../data/goTeamConstants';

interface LandingPageViewProps {
  onOpenStudentArea: () => void;
  onSelectPlan: (planId: '5K' | '10K' | '21K') => void;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({
  onOpenStudentArea,
  onSelectPlan
}) => {
  return (
    <div className="min-h-screen bg-white text-[#0d3b45] font-sans selection:bg-[#c6f43a] selection:text-[#0d3b45]">
      {/* ==================== HEADER FIXO ==================== */}
      <header className="fixed top-0 z-50 w-full backdrop-blur-lg bg-white/90 border-b border-slate-200 transition-all">
        <div className="mx-auto max-w-7xl px-4 md:px-8 h-16 flex items-center justify-between">
          <a href="#top" className="flex items-center gap-2">
            <img
              src="/assets/go-team-logo.png"
              alt="Go Team"
              className="h-10 w-auto object-contain rounded-lg"
              onError={(e) => {
                // Fallback graceful visual branding
                const target = e.currentTarget;
                target.style.display = 'none';
              }}
            />
            <span className="font-display font-black text-2xl tracking-tighter text-[#0d3b45]">
              GO<span className="text-[#a5cf2a]">TEAM</span>
            </span>
          </a>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-[#0d3b45]">
            <a href="#sobre" className="hover:text-[#a5cf2a] transition">Sobre</a>
            <a href="#processo" className="hover:text-[#a5cf2a] transition">Como funciona</a>
            <a href="#planilhas" className="hover:text-[#a5cf2a] transition">Planilhas</a>
            <a href="#depoimentos" className="hover:text-[#a5cf2a] transition">Depoimentos</a>
            <a href="#contato" className="hover:text-[#a5cf2a] transition">Contato</a>
          </nav>

          <button
            onClick={onOpenStudentArea}
            className="inline-flex items-center gap-2 rounded-full btn-lima px-5 py-2.5 text-sm font-bold shadow-glow hover:scale-105 active:scale-95 transition cursor-pointer"
          >
            Área do aluno
          </button>
        </div>
      </header>

      {/* ==================== HERO SECTION ==================== */}
      <section id="top" className="relative min-h-screen flex items-center pt-16 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/hero-runners.jpg"
            alt="Corredores Go Team treinando"
            className="w-full h-full object-cover object-center"
          />
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(120deg, rgba(8,40,48,0.92) 0%, rgba(13,59,69,0.78) 60%, rgba(13,59,69,0.5) 100%)'
            }}
          />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-8 py-24 w-full">
          <div className="text-white max-w-4xl">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2.5 rounded-full bg-white/10 border border-white/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest mb-6">
              <span className="w-2.5 h-2.5 rounded-full bg-[#c6f43a] animate-pulse"></span>
              Assessoria de Corrida
            </div>

            {/* H1 Principal */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-black leading-[0.9] mb-6 text-white uppercase tracking-tight">
              Todo corredor começa com o <span className="text-[#c6f43a]">primeiro passo</span>.
            </h1>

            {/* Subtítulo */}
            <p className="text-lg md:text-2xl text-white/90 max-w-2xl mb-10 font-sans font-normal leading-relaxed">
              Planilhas de treino personalizadas para 5K, 10K e 21K. Do primeiro tênis à linha de chegada da meia maratona — a Go Team corre com você.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 mb-14">
              <a
                href="#planilhas"
                className="inline-flex items-center gap-2 rounded-full btn-lima px-8 py-4 text-base font-bold shadow-glow hover:scale-105 transition cursor-pointer"
              >
                Ver planilhas →
              </a>
              <a
                href={CONTATO_WHATSAPP}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border-2 border-white/40 px-8 py-4 text-base font-bold text-white hover:bg-white/10 hover:border-white transition"
              >
                Falar no WhatsApp
              </a>
            </div>

            {/* Estatísticas de Impacto */}
            <div className="flex gap-10 md:gap-16 pt-2 border-t border-white/15">
              <div>
                <div className="text-3xl md:text-5xl font-black font-display text-[#c6f43a]">500+</div>
                <div className="text-xs uppercase tracking-wider text-white/75 font-semibold mt-0.5">Corredores</div>
              </div>
              <div>
                <div className="text-3xl md:text-5xl font-black font-display text-[#c6f43a]">3</div>
                <div className="text-xs uppercase tracking-wider text-white/75 font-semibold mt-0.5">Distâncias</div>
              </div>
              <div>
                <div className="text-3xl md:text-5xl font-black font-display text-[#c6f43a]">100%</div>
                <div className="text-xs uppercase tracking-wider text-white/75 font-semibold mt-0.5">Personalizado</div>
              </div>
            </div>
          </div>
        </div>

        {/* Linha de Pista no Rodapé da Hero */}
        <div className="absolute bottom-0 left-0 right-0 h-2 track-lines z-10" />
      </section>

      {/* ==================== SEÇÃO: SOBRE A GO TEAM ==================== */}
      <section id="sobre" className="py-24 md:py-32 bg-white">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="max-w-3xl mb-14">
            <div className="text-sm uppercase tracking-widest text-[#a5cf2a] font-bold mb-4">
              Sobre a Go Team
            </div>
            <h2 className="text-4xl md:text-6xl font-display font-black text-[#0d3b45] leading-tight mb-6">
              Corrida não é sobre ser o mais rápido. É sobre <span className="underline decoration-[#c6f43a] decoration-wavy decoration-2">não desistir</span>.
            </h2>
            <p className="text-lg text-slate-600 mb-4 font-sans leading-relaxed">
              A Go Team nasceu para transformar a vida de quem quer começar, evoluir ou conquistar novos desafios na corrida. Nossas planilhas são pensadas para cada nível, respeitando seu ritmo e seus objetivos.
            </p>
            <p className="text-lg text-slate-600 font-sans leading-relaxed">
              Do primeiro 5K à sua primeira meia maratona: estamos com você em cada passo do caminho.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="border-l-4 border-[#c6f43a] pl-4 py-2 bg-slate-50/50 rounded-r-xl">
              <div className="font-bold text-lg text-[#0d3b45] mb-1 font-display uppercase tracking-wide">Personalizado</div>
              <div className="text-sm text-slate-600">Planilha adaptada ao seu ritmo atual e à sua rotina real</div>
            </div>
            <div className="border-l-4 border-[#c6f43a] pl-4 py-2 bg-slate-50/50 rounded-r-xl">
              <div className="font-bold text-lg text-[#0d3b45] mb-1 font-display uppercase tracking-wide">Progressivo</div>
              <div className="text-sm text-slate-600">Evolução planejada e segura para evitar lesões musculares</div>
            </div>
            <div className="border-l-4 border-[#c6f43a] pl-4 py-2 bg-slate-50/50 rounded-r-xl">
              <div className="font-bold text-lg text-[#0d3b45] mb-1 font-display uppercase tracking-wide">Suporte real</div>
              <div className="text-sm text-slate-600">Tire dúvidas e ajuste cargas direto no WhatsApp com o treinador</div>
            </div>
            <div className="border-l-4 border-[#c6f43a] pl-4 py-2 bg-slate-50/50 rounded-r-xl">
              <div className="font-bold text-lg text-[#0d3b45] mb-1 font-display uppercase tracking-wide">Resultado</div>
              <div className="text-sm text-slate-600">Prepare-se para cruzar a linha de chegada com orgulho</div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== SEÇÃO: COMO FUNCIONA ==================== */}
      <section id="processo" className="py-24 md:py-32 bg-slate-50 border-y border-slate-200/80">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="text-center mb-16">
            <div className="text-sm uppercase tracking-widest text-[#a5cf2a] font-bold mb-4">
              Como funciona
            </div>
            <h2 className="text-4xl md:text-6xl font-display font-black text-[#0d3b45]">
              3 passos para começar
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="relative p-8 rounded-3xl bg-white border border-slate-200 hover:border-[#c6f43a] transition-all shadow-sm hover:shadow-elegant group">
              <div className="text-7xl font-black text-[#c6f43a]/70 group-hover:text-[#a5cf2a] transition mb-4 font-display">
                01
              </div>
              <div className="text-2xl font-bold font-display text-[#0d3b45] mb-2 uppercase tracking-wide">
                Escolha sua distância
              </div>
              <p className="text-slate-600 font-sans text-sm leading-relaxed">
                5K, 10K ou 21K. Selecione a planilha que combina exatamente com seu nível atlético atual e objetivo de corrida.
              </p>
            </div>

            <div className="relative p-8 rounded-3xl bg-white border border-slate-200 hover:border-[#c6f43a] transition-all shadow-sm hover:shadow-elegant group">
              <div className="text-7xl font-black text-[#c6f43a]/70 group-hover:text-[#a5cf2a] transition mb-4 font-display">
                02
              </div>
              <div className="text-2xl font-bold font-display text-[#0d3b45] mb-2 uppercase tracking-wide">
                Receba sua planilha
              </div>
              <p className="text-slate-600 font-sans text-sm leading-relaxed">
                Acesse imediatamente o painel digital do aluno, com os treinos divididos semana a semana, ritmos e dias de descanso.
              </p>
            </div>

            <div className="relative p-8 rounded-3xl bg-white border border-slate-200 hover:border-[#c6f43a] transition-all shadow-sm hover:shadow-elegant group">
              <div className="text-7xl font-black text-[#c6f43a]/70 group-hover:text-[#a5cf2a] transition mb-4 font-display">
                03
              </div>
              <div className="text-2xl font-bold font-display text-[#0d3b45] mb-2 uppercase tracking-wide">
                Comece a correr
              </div>
              <p className="text-slate-600 font-sans text-sm leading-relaxed">
                Calce os tênis e siga o cronograma no seu próprio tempo, marcando os treinos concluídos e acompanhando sua evolução diária.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== SEÇÃO: PLANILHAS ==================== */}
      <section id="planilhas" className="py-24 md:py-32 bg-[#082830] text-white">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="text-center mb-16">
            <div className="text-sm uppercase tracking-widest text-[#c6f43a] font-bold mb-4">
              Planilhas de Treino
            </div>
            <h2 className="text-4xl md:text-6xl font-display font-black text-white">
              Escolha seu objetivo
            </h2>
            <p className="text-white/70 max-w-md mx-auto mt-3 text-sm">
              Treinos estruturados para você correr com segurança, evolução e acompanhamento.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 items-stretch">
            {/* Card 5K */}
            <div className="relative group rounded-3xl p-8 flex flex-col bg-white text-[#0d3b45] hover:shadow-elegant hover:-translate-y-2 transition-all duration-300">
              <div className="text-6xl font-black mb-2 font-display text-[#0d3b45]">5K</div>
              <div className="text-xl font-bold mb-1 font-display uppercase tracking-wide">Primeiros Passos</div>
              <div className="text-sm font-semibold mb-2 text-[#a5cf2a]">Para quem nunca correu ou quer recomeçar</div>
              <div className="text-2xl font-black text-[#0d3b45] mb-4 font-display">R$ 79,90</div>
              <p className="text-sm mb-6 text-slate-600 font-sans leading-relaxed">
                Dê seu primeiro passo com segurança. Alterne caminhada e corrida e cruze seus primeiros 5K sem parar.
              </p>
              <ul className="space-y-2.5 mb-8 flex-1 font-sans text-sm text-slate-700">
                <li className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex-none w-4 h-4 rounded-full bg-[#c6f43a] text-[#0d3b45] flex items-center justify-center text-[10px] font-black">✓</span>
                  8 semanas de treino
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex-none w-4 h-4 rounded-full bg-[#c6f43a] text-[#0d3b45] flex items-center justify-center text-[10px] font-black">✓</span>
                  Progressão caminhada + corrida
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex-none w-4 h-4 rounded-full bg-[#c6f43a] text-[#0d3b45] flex items-center justify-center text-[10px] font-black">✓</span>
                  Suporte via WhatsApp
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex-none w-4 h-4 rounded-full bg-[#c6f43a] text-[#0d3b45] flex items-center justify-center text-[10px] font-black">✓</span>
                  Dicas de respiração e postura
                </li>
              </ul>
              <button
                onClick={() => onSelectPlan('5K')}
                className="w-full inline-flex items-center justify-center rounded-full bg-[#0d3b45] text-white px-6 py-3.5 text-sm font-bold hover:bg-[#c6f43a] hover:text-[#0d3b45] transition hover:scale-105 active:scale-95 cursor-pointer shadow-md"
              >
                Quero essa planilha
              </button>
            </div>

            {/* Card 10K (Mais Popular) */}
            <div className="relative group rounded-3xl p-8 flex flex-col bg-[#c6f43a] text-[#0d3b45] shadow-glow hover:-translate-y-2 transition-all duration-300 ring-4 ring-[#c6f43a]/50">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-[#0d3b45] text-white px-4 py-1 text-xs font-bold uppercase tracking-wider shadow-md">
                Mais Popular
              </div>
              <div className="text-6xl font-black mb-2 font-display text-[#0d3b45]">10K</div>
              <div className="text-xl font-bold mb-1 font-display uppercase tracking-wide">Evolução</div>
              <div className="text-sm font-semibold mb-2 text-[#0d3b45]/80">Para quem já corre um pouco</div>
              <div className="text-2xl font-black text-[#0d3b45] mb-4 font-display">R$ 89,90</div>
              <p className="text-sm mb-6 text-[#0d3b45]/90 font-sans leading-relaxed">
                Aumente sua resistência, ganhe ritmo e transforme os 10K no seu novo padrão de corrida e consistência.
              </p>
              <ul className="space-y-2.5 mb-8 flex-1 font-sans text-sm text-[#0d3b45]">
                <li className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex-none w-4 h-4 rounded-full bg-[#0d3b45] text-[#c6f43a] flex items-center justify-center text-[10px] font-black">✓</span>
                  10 semanas de treino
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex-none w-4 h-4 rounded-full bg-[#0d3b45] text-[#c6f43a] flex items-center justify-center text-[10px] font-black">✓</span>
                  Treinos intervalados de tiro
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex-none w-4 h-4 rounded-full bg-[#0d3b45] text-[#c6f43a] flex items-center justify-center text-[10px] font-black">✓</span>
                  Fortalecimento específico
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex-none w-4 h-4 rounded-full bg-[#0d3b45] text-[#c6f43a] flex items-center justify-center text-[10px] font-black">✓</span>
                  Estratégia de prova
                </li>
              </ul>
              <button
                onClick={() => onSelectPlan('10K')}
                className="w-full inline-flex items-center justify-center rounded-full bg-[#0d3b45] text-white px-6 py-3.5 text-sm font-bold transition hover:scale-105 active:scale-95 cursor-pointer shadow-lg"
              >
                Quero essa planilha
              </button>
            </div>

            {/* Card 21K */}
            <div className="relative group rounded-3xl p-8 flex flex-col bg-white text-[#0d3b45] hover:shadow-elegant hover:-translate-y-2 transition-all duration-300">
              <div className="text-6xl font-black mb-2 font-display text-[#0d3b45]">21K</div>
              <div className="text-xl font-bold mb-1 font-display uppercase tracking-wide">Meia Maratona</div>
              <div className="text-sm font-semibold mb-2 text-[#a5cf2a]">Para corredores experientes</div>
              <div className="text-2xl font-black text-[#0d3b45] mb-4 font-display">R$ 99,90</div>
              <p className="text-sm mb-6 text-slate-600 font-sans leading-relaxed">
                Prepare-se para o desafio da meia maratona com uma planilha estruturada, progressiva e periodizada.
              </p>
              <ul className="space-y-2.5 mb-8 flex-1 font-sans text-sm text-slate-700">
                <li className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex-none w-4 h-4 rounded-full bg-[#c6f43a] text-[#0d3b45] flex items-center justify-center text-[10px] font-black">✓</span>
                  12 semanas de treino
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex-none w-4 h-4 rounded-full bg-[#c6f43a] text-[#0d3b45] flex items-center justify-center text-[10px] font-black">✓</span>
                  Long runs progressivos
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex-none w-4 h-4 rounded-full bg-[#c6f43a] text-[#0d3b45] flex items-center justify-center text-[10px] font-black">✓</span>
                  Estratégia nutricional
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex-none w-4 h-4 rounded-full bg-[#c6f43a] text-[#0d3b45] flex items-center justify-center text-[10px] font-black">✓</span>
                  Análise biomecânica e pace
                </li>
              </ul>
              <button
                onClick={() => onSelectPlan('21K')}
                className="w-full inline-flex items-center justify-center rounded-full bg-[#0d3b45] text-white px-6 py-3.5 text-sm font-bold hover:bg-[#c6f43a] hover:text-[#0d3b45] transition hover:scale-105 active:scale-95 cursor-pointer shadow-md"
              >
                Quero essa planilha
              </button>
            </div>
          </div>

          <div className="mt-14 text-center">
            <p className="text-white/80 font-sans mb-3 text-base">Já é aluno da Go Team?</p>
            <button
              onClick={onOpenStudentArea}
              className="inline-flex items-center gap-2 rounded-full border-2 border-[#c6f43a] text-[#c6f43a] px-8 py-3.5 text-sm font-bold hover:bg-[#c6f43a] hover:text-[#0d3b45] transition hover:scale-105 active:scale-95 cursor-pointer"
            >
              Acessar área do aluno →
            </button>
          </div>
        </div>
      </section>

      {/* ==================== SEÇÃO: DEPOIMENTOS ==================== */}
      <section id="depoimentos" className="py-24 md:py-32 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="text-center mb-16">
            <div className="text-sm uppercase tracking-widest text-[#a5cf2a] font-bold mb-4">
              Quem já correu com a gente
            </div>
            <h2 className="text-4xl md:text-6xl font-display font-black text-[#0d3b45]">
              Histórias que inspiram
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {DEPOIMENTOS.map((dep, idx) => (
              <div
                key={idx}
                className="p-8 rounded-3xl bg-white shadow-sm hover:shadow-elegant transition duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="text-[#c6f43a] text-6xl leading-none mb-3 font-serif font-black">“</div>
                  <p className="text-[#0d3b45] mb-6 italic font-sans text-base leading-relaxed">
                    {dep.texto}
                  </p>
                </div>
                <div>
                  <div className="font-bold text-lg text-[#0d3b45] font-display uppercase tracking-wide">
                    {dep.nome}
                  </div>
                  <div className="text-xs text-slate-500 font-medium">
                    {dep.badge}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== SEÇÃO: CONTATO ==================== */}
      <section id="contato" className="py-24 md:py-32 relative overflow-hidden gradient-hero">
        <div className="absolute inset-0 opacity-25 track-lines pointer-events-none" />
        <div className="relative z-10 mx-auto max-w-4xl px-4 md:px-8 text-center text-white">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-black mb-6 uppercase tracking-tight">
            Pronto para dar o <span className="text-[#c6f43a]">primeiro passo</span>?
          </h2>
          <p className="text-lg md:text-xl text-white/85 mb-10 max-w-2xl mx-auto font-sans leading-relaxed">
            Fale com a Go Team agora mesmo e comece sua jornada na corrida. A gente responde rapidinho.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href={CONTATO_WHATSAPP}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full btn-lima px-8 py-4 text-base font-bold shadow-glow hover:scale-105 transition"
            >
              💬 Falar no WhatsApp
            </a>
            <a
              href={INSTAGRAM_LINK}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border-2 border-white/40 px-8 py-4 text-base font-bold text-white hover:bg-white/10 hover:border-white transition"
            >
              📸 Instagram
            </a>
          </div>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="bg-[#0d3b45] text-white py-12 border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src="/assets/go-team-logo.png"
              alt="Go Team"
              className="h-12 w-auto bg-white rounded-xl p-1.5"
            />
            <div>
              <div className="font-display font-black text-xl tracking-tight">Go Team</div>
              <div className="text-sm text-white/70">Todo corredor começa com o primeiro passo</div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm font-medium">
            <button
              onClick={onOpenStudentArea}
              className="hover:text-[#c6f43a] transition cursor-pointer"
            >
              Área do aluno
            </button>
            <span className="text-white/30">·</span>
            <a href={CONTATO_WHATSAPP} target="_blank" rel="noreferrer" className="hover:text-[#c6f43a] transition">
              WhatsApp
            </a>
            <span className="text-white/30">·</span>
            <a href={INSTAGRAM_LINK} target="_blank" rel="noreferrer" className="hover:text-[#c6f43a] transition">
              Instagram
            </a>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 md:px-8 mt-8 pt-6 border-t border-white/10 text-xs text-white/50 text-center">
          © 2026 Go Team — Assessoria de Corrida. Todos os direitos reservados.
        </div>
      </footer>

      {/* ==================== BOTÃO FLUTUANTE WHATSAPP ==================== */}
      <a
        href={CONTATO_WHATSAPP}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-50 inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-glow hover:scale-110 active:scale-95 transition text-2xl"
        aria-label="Falar no WhatsApp"
      >
        💬
      </a>
    </div>
  );
};
