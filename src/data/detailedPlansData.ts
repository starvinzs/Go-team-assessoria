export type AthleticLevel = 'zero' | 'jacorro' | 'limites';
export type PlanDistance = '5K' | '10K' | '21K';

export interface PlanDayWorkout {
  dia: string; // 'Segunda' | 'Terça' | ...
  diaAbrev: 'Seg' | 'Ter' | 'Qua' | 'Qui' | 'Sex' | 'Sáb' | 'Dom';
  titulo: string;
  tipo: 'Rodagem Leve' | 'Intervalado' | 'Ritmo' | 'Longão' | 'Descanso' | 'Fortalecimento';
  distanciaKm: number;
  duracaoMin: number;
  intensidade: 'Leve' | 'Moderado' | 'Alto';
  paceAlvo: string;
  descricao: string;
  dicaTreinador: string;
  etapas: {
    tipo: 'aquecimento' | 'rodagem' | 'tiro' | 'ritmo' | 'desaquecimento';
    descricao: string;
    duracaoMin?: number;
    distanciaKm?: number;
  }[];
}

export interface PlanWeek {
  numero: number;
  foco: string;
  kmTotal: number;
  dias: PlanDayWorkout[];
}

export interface DetailedPlanInfo {
  distancia: PlanDistance;
  nivel: AthleticLevel;
  nivelNome: string;
  nivelBadge: string;
  titulo: string;
  subtitulo: string;
  publicoAlvo: string;
  semanasTotal: number;
  treinosPorSemana: number;
  paceReferencia: string;
  preco: string;
  semanas: PlanWeek[];
}

// Helper to generate days with rest on appropriate days
function createWeekDays(
  weekNum: number,
  dist: PlanDistance,
  level: AthleticLevel,
  daysConfig: {
    ter: { tit: string; tipo: PlanDayWorkout['tipo']; km: number; min: number; int: PlanDayWorkout['intensidade']; pace: string; desc: string; tip: string };
    qui: { tit: string; tipo: PlanDayWorkout['tipo']; km: number; min: number; int: PlanDayWorkout['intensidade']; pace: string; desc: string; tip: string };
    sab: { tit: string; tipo: PlanDayWorkout['tipo']; km: number; min: number; int: PlanDayWorkout['intensidade']; pace: string; desc: string; tip: string };
    quaOrSex?: { tit: string; tipo: PlanDayWorkout['tipo']; km: number; min: number; int: PlanDayWorkout['intensidade']; pace: string; desc: string; tip: string };
  }
): PlanDayWorkout[] {
  const result: PlanDayWorkout[] = [
    {
      dia: 'Segunda',
      diaAbrev: 'Seg',
      titulo: 'Descanso Total ou Mobilidade',
      tipo: 'Descanso',
      distanciaKm: 0,
      duracaoMin: 0,
      intensidade: 'Leve',
      paceAlvo: '—',
      descricao: 'Recuperação passiva essencial para absorção das cargas do fim de semana. Hidratação abundante.',
      dicaTreinador: 'O descanso é onde o músculo se regenera e fica mais forte. Não pule o repouso!',
      etapas: [{ tipo: 'aquecimento', descricao: 'Descanso regenerativo e boa alimentação' }]
    },
    {
      dia: 'Terça',
      diaAbrev: 'Ter',
      titulo: daysConfig.ter.tit,
      tipo: daysConfig.ter.tipo,
      distanciaKm: daysConfig.ter.km,
      duracaoMin: daysConfig.ter.min,
      intensidade: daysConfig.ter.int,
      paceAlvo: daysConfig.ter.pace,
      descricao: daysConfig.ter.desc,
      dicaTreinador: daysConfig.ter.tip,
      etapas: [
        { tipo: 'aquecimento', descricao: '5 min de caminhada e rotações articulares', duracaoMin: 5 },
        { tipo: 'rodagem', descricao: daysConfig.ter.desc, distanciaKm: daysConfig.ter.km, duracaoMin: daysConfig.ter.min - 10 },
        { tipo: 'desaquecimento', descricao: '5 min de caminhada suave e alongamento estático', duracaoMin: 5 }
      ]
    },
    {
      dia: 'Quarta',
      diaAbrev: 'Qua',
      titulo: daysConfig.quaOrSex ? daysConfig.quaOrSex.tit : 'Fortalecimento Funcional',
      tipo: daysConfig.quaOrSex ? daysConfig.quaOrSex.tipo : 'Fortalecimento',
      distanciaKm: daysConfig.quaOrSex ? daysConfig.quaOrSex.km : 0,
      duracaoMin: daysConfig.quaOrSex ? daysConfig.quaOrSex.min : 25,
      intensidade: 'Leve',
      paceAlvo: daysConfig.quaOrSex ? daysConfig.quaOrSex.pace : '—',
      descricao: daysConfig.quaOrSex ? daysConfig.quaOrSex.desc : 'Treino de core, panturrilhas, glúteos e estabilizadores de quadril sem impacto.',
      dicaTreinador: 'Glúteos e abdômen fortes protegem a lombar e os joelhos de sobrecargas da corrida.',
      etapas: [{ tipo: 'aquecimento', descricao: 'Exercícios posturais de prancha, agachamento e elevação de calcanhar' }]
    },
    {
      dia: 'Quinta',
      diaAbrev: 'Qui',
      titulo: daysConfig.qui.tit,
      tipo: daysConfig.qui.tipo,
      distanciaKm: daysConfig.qui.km,
      duracaoMin: daysConfig.qui.min,
      intensidade: daysConfig.qui.int,
      paceAlvo: daysConfig.qui.pace,
      descricao: daysConfig.qui.desc,
      dicaTreinador: daysConfig.qui.tip,
      etapas: [
        { tipo: 'aquecimento', descricao: '5 min de caminhada rápida ou educativos', duracaoMin: 5 },
        { tipo: 'tiro', descricao: daysConfig.qui.desc, distanciaKm: daysConfig.qui.km, duracaoMin: daysConfig.qui.min - 10 },
        { tipo: 'desaquecimento', descricao: '5 min de soltura das pernas', duracaoMin: 5 }
      ]
    },
    {
      dia: 'Sexta',
      diaAbrev: 'Sex',
      titulo: 'Descanso Pré-Longão',
      tipo: 'Descanso',
      distanciaKm: 0,
      duracaoMin: 0,
      intensidade: 'Leve',
      paceAlvo: '—',
      descricao: 'Dia livre para relaxar as pernas, dormir cedo e preparar a hidratação do fim de semana.',
      dicaTreinador: 'Beba pelo menos 2 litros de água e deixe o tênis e a roupa separados na véspera.',
      etapas: [{ tipo: 'aquecimento', descricao: 'Descanso restaurador' }]
    },
    {
      dia: 'Sábado',
      diaAbrev: 'Sáb',
      titulo: daysConfig.sab.tit,
      tipo: daysConfig.sab.tipo,
      distanciaKm: daysConfig.sab.km,
      duracaoMin: daysConfig.sab.min,
      intensidade: daysConfig.sab.int,
      paceAlvo: daysConfig.sab.pace,
      descricao: daysConfig.sab.desc,
      dicaTreinador: daysConfig.sab.tip,
      etapas: [
        { tipo: 'aquecimento', descricao: 'Aquecimento dinâmico de 5 min', duracaoMin: 5 },
        { tipo: 'rodagem', descricao: daysConfig.sab.desc, distanciaKm: daysConfig.sab.km, duracaoMin: daysConfig.sab.min - 10 },
        { tipo: 'desaquecimento', descricao: 'Caminhada suave e hidratação com eletrólitos', duracaoMin: 5 }
      ]
    },
    {
      dia: 'Domingo',
      diaAbrev: 'Dom',
      titulo: 'Descanso Total ou Caminhada Regenerativa',
      tipo: 'Descanso',
      distanciaKm: 0,
      duracaoMin: 0,
      intensidade: 'Leve',
      paceAlvo: '—',
      descricao: 'Recuperação ativa leve (passeio no parque ou descanso total com a família).',
      dicaTreinador: 'Avalie como suas pernas terminaram a semana. Sentiu algum desconforto? Fale com o treinador!',
      etapas: [{ tipo: 'aquecimento', descricao: 'Regeneração muscular e soltura' }]
    }
  ];

  return result;
}

// =========================================================================
// 1. DISTÂNCIA 5K — 3 NÍVEIS COMPLETOS (8 SEMANAS CADA)
// =========================================================================

// 1A. 5K — Começando do Zero (8 semanas)
function generate5kZero(): DetailedPlanInfo {
  const semanas: PlanWeek[] = [
    {
      numero: 1,
      foco: 'Adaptação Muscular e Transição Caminhada/Trote',
      kmTotal: 7.5,
      dias: createWeekDays(1, '5K', 'zero', {
        ter: { tit: 'Intervalado C/T 1:2', tipo: 'Rodagem Leve', km: 2.5, min: 28, int: 'Leve', pace: '7:30 min/km', desc: '5 min caminhada + 6x (1 min trote suave + 2 min caminhada ativa) + 5 min desaquecimento.', tip: 'Não corra rápido no minuto de trote. A ideia é apenas tirar os dois pés do chão confortavelmente.' },
        qui: { tit: 'Caminhada Rápida & Estímulo', tipo: 'Rodagem Leve', km: 2.5, min: 26, int: 'Leve', pace: '7:40 min/km', desc: '4x (1 min trote leve + 3 min caminhada ritmada). Respiração livre e descontraída.', tip: 'Mantenha os ombros relaxados e olhe 10 metros à frente, não para os seus pés.' },
        sab: { tit: 'Longinho de Base Aeróbica', tipo: 'Longão', km: 2.5, min: 30, int: 'Leve', pace: '7:45 min/km', desc: '30 min totais alternando 1 min trote e 2 min caminhada. Complete com sensação de frescor.', tip: 'Comemore cada treino concluído! O hábito começa a se fixar agora.' }
      })
    },
    {
      numero: 2,
      foco: 'Aumento Gradual dos Intervalos de Trote',
      kmTotal: 8.5,
      dias: createWeekDays(2, '5K', 'zero', {
        ter: { tit: 'Intervalado 2:2', tipo: 'Rodagem Leve', km: 2.8, min: 30, int: 'Leve', pace: '7:20 min/km', desc: '5x (2 min trote contínuo + 2 min caminhada). Cadência curta e suave.', tip: 'Dê passadas curtas. Evite pisar com o calcanhar muito à frente do quadril.' },
        qui: { tit: 'Controle de Fôlego', tipo: 'Rodagem Leve', km: 2.7, min: 28, int: 'Leve', pace: '7:25 min/km', desc: '4x (2 min corrida leve + 2 min caminhada) + 5 min educativos de corrida.', tip: 'O teste da fala: você deve conseguir falar uma frase curta sem faltar o ar.' },
        sab: { tit: 'Longinho com 3km Totais', tipo: 'Longão', km: 3.0, min: 32, int: 'Leve', pace: '7:30 min/km', desc: '6x (2 min trote + 1 min caminhada). Você já está correndo o dobro do que caminha!', tip: 'Hidrate-se bem antes de sair de casa, mesmo em dias nublados.' }
      })
    },
    {
      numero: 3,
      foco: 'Consolidação de 3 a 4 Minutos Consecutivos',
      kmTotal: 10.0,
      dias: createWeekDays(3, '5K', 'zero', {
        ter: { tit: 'Blocos de 3 Minutos', tipo: 'Rodagem Leve', km: 3.2, min: 32, int: 'Moderado', pace: '7:15 min/km', desc: '4x (3 min corrida leve + 2 min caminhada). Mantenha o ritmo estável.', tip: 'Ajuste os braços em 90 graus balançando soltos perto das costelas.' },
        qui: { tit: 'Ritmo Confortável', tipo: 'Rodagem Leve', km: 3.3, min: 30, int: 'Leve', pace: '7:20 min/km', desc: '3x (4 min trote + 2 min caminhada). Sinta a postura ereta e abdômen firme.', tip: 'Corra com leveza. Tente não fazer barulho de pisada pesada no asfalto.' },
        sab: { tit: 'Longão de 3.5km', tipo: 'Longão', km: 3.5, min: 35, int: 'Moderado', pace: '7:20 min/km', desc: '2 blocos de 10 min de corrida contínua intercalados por 3 min de caminhada.', tip: 'O primeiro grande teste psicológico! Respire fundo pelo nariz e boca.' }
      })
    },
    {
      numero: 4,
      foco: 'A Barreira dos 10 Minutos Sem Parar',
      kmTotal: 11.5,
      dias: createWeekDays(4, '5K', 'zero', {
        ter: { tit: 'Trote Firme 2x 10min', tipo: 'Rodagem Leve', km: 3.6, min: 32, int: 'Moderado', pace: '7:10 min/km', desc: '10 min trote contínuo + 3 min caminhada + 10 min trote contínuo.', tip: 'Você agora é um corredor ativo! Mais da metade do treino é corrida pura.' },
        qui: { tit: 'Fartlek Suave de Adaptação', tipo: 'Intervalado', km: 3.8, min: 32, int: 'Moderado', pace: '7:05 min/km', desc: '15 min trote leve + 4 acelerações curtas de 40 metros + 5 min caminhada.', tip: 'As acelerações despertam as fibras rápidas sem gerar fadiga muscular.' },
        sab: { tit: 'Longão 4km — Quase nos 5K!', tipo: 'Longão', km: 4.0, min: 38, int: 'Moderado', pace: '7:15 min/km', desc: '20 min de trote ininterrupto + 2 min caminhada + 5 min trote final.', tip: 'Você está a apenas 1km da distância oficial! Confie na sua planilha.' }
      })
    },
    {
      numero: 5,
      foco: 'Desenvolvimento de Resistência Mental e Aeróbica',
      kmTotal: 12.5,
      dias: createWeekDays(5, '5K', 'zero', {
        ter: { tit: '20 Minutos Contínuos', tipo: 'Rodagem Leve', km: 4.0, min: 32, int: 'Moderado', pace: '7:00 min/km', desc: 'Aquecimento 5 min caminhando + 20 min sem parar de correr + soltura.', tip: 'Mantenha a mente no presente: cada km concluído é uma vitória épica.' },
        qui: { tit: 'Rodagem Leve Regenerativa', tipo: 'Rodagem Leve', km: 3.5, min: 28, int: 'Leve', pace: '7:15 min/km', desc: 'Trote solto de 25 min com foco em respiração ritmada 2 passadas por inspiração.', tip: 'Se o dia estiver quente, reduza o ritmo 15 segundos por km.' },
        sab: { tit: 'Longão de 4.5km', tipo: 'Longão', km: 4.5, min: 42, int: 'Moderado', pace: '7:10 min/km', desc: '28 min contínuos sem caminhar. Mantenha energia guardada para o final.', tip: 'Você nunca esteve tão condicionado! A linha de chegada dos 5k está próxima.' }
      })
    },
    {
      numero: 6,
      foco: 'Consolidação dos 25 a 30 Minutos de Corrida',
      kmTotal: 13.5,
      dias: createWeekDays(6, '5K', 'zero', {
        ter: { tit: 'Trote Firme 4km', tipo: 'Rodagem Leve', km: 4.2, min: 34, int: 'Moderado', pace: '6:55 min/km', desc: '4.2km ininterruptos com ritmo uniforme do início ao fim.', tip: 'Monitore seus batimentos: mantenha na zona aeróbica de queima de gordura.' },
        qui: { tit: 'Intervalado Suave 4x 500m', tipo: 'Intervalado', km: 4.0, min: 32, int: 'Moderado', pace: '6:50 min/km', desc: 'Aquecimento + 4 séries de 500m um pouco mais rápidas com 90s trote suave.', tip: 'Isso vai soltar suas pernas e deixar o pace confortável mais natural.' },
        sab: { tit: 'Simulado de 4.8km', tipo: 'Longão', km: 4.8, min: 44, int: 'Moderado', pace: '7:00 min/km', desc: 'Longão com 4.8km quase na distância oficial de prova.', tip: 'Pratique usar o mesmo tênis e meia que usará no dia da formatura.' }
      })
    },
    {
      numero: 7,
      foco: 'Polimento e Confiança para a Prova',
      kmTotal: 12.0,
      dias: createWeekDays(7, '5K', 'zero', {
        ter: { tit: 'Rodagem 3.5km Confortável', tipo: 'Rodagem Leve', km: 3.5, min: 26, int: 'Leve', pace: '6:50 min/km', desc: '3.5km leves para manter a musculatura ativa e descansada.', tip: 'Sem forçar. A preparação pesada já foi feita nas semanas anteriores.' },
        qui: { tit: 'Ativação com Retas Rápidas', tipo: 'Rodagem Leve', km: 3.0, min: 22, int: 'Leve', pace: '6:45 min/km', desc: '2.5km trote + 5 retas de 50m com passadas bonitas e soltas.', tip: 'Sinta a elasticidade dos seus tendões. Você está pronto e afiado!' },
        sab: { tit: 'Último Longinho Pré-Desafio (4km)', tipo: 'Longão', km: 4.0, min: 34, int: 'Leve', pace: '6:55 min/km', desc: '4km em ritmo bem calmo para estocar glicogênio muscular.', tip: 'Dormir bem na semana que antecede é mais importante do que qualquer treino.' }
      })
    },
    {
      numero: 8,
      foco: '🏆 SEMANA DA FORMATURA: SEUS PRIMEIROS 5K SEM PARAR!',
      kmTotal: 11.0,
      dias: createWeekDays(8, '5K', 'zero', {
        ter: { tit: 'Trote Soltinho de 3km', tipo: 'Rodagem Leve', km: 3.0, min: 22, int: 'Leve', pace: '7:00 min/km', desc: 'Apenas soltar a ansiedade pré-desafio. Respiração calma.', tip: 'Nada de inventar comida nova ou calçado novo esta semana.' },
        qui: { tit: 'Ativação Mental de 2km', tipo: 'Rodagem Leve', km: 2.0, min: 15, int: 'Leve', pace: '7:00 min/km', desc: '2km muito fáceis. Visualize você cruzando a linha dos 5km sorrindo.', tip: 'Foco total no objetivo: você vai completar os 5K sem parar!' },
        sab: { tit: '🏆 O GRANDE DIA: 5.0 KM CONTÍNUOS!', tipo: 'Ritmo', km: 5.0, min: 36, int: 'Alto', pace: '6:45 min/km', desc: 'Parabéns atleta! Hoje você corre seus 5km ininterruptos. Comece calmo nos primeiros 2km e termine forte!', tip: 'Comemore muito ao passar pelo 5º km! Você venceu o sedentarismo com honra.' }
      })
    }
  ];

  return {
    distancia: '5K',
    nivel: 'zero',
    nivelNome: 'Começando do Zero',
    nivelBadge: '🌱 Do Zero',
    titulo: '5K: Do Zero aos Primeiros 5K Ininterruptos',
    subtitulo: 'Para quem nunca correu ou está sedentário há meses',
    publicoAlvo: 'Iniciantes que querem aprender a correr sem dor, lesão ou falta de ar.',
    semanasTotal: 8,
    treinosPorSemana: 3,
    paceReferencia: '6:45 - 7:45 min/km',
    preco: 'R$ 79,90',
    semanas
  };
}

// 1B. 5K — Já Corro (8 semanas)
function generate5kJaCorro(): DetailedPlanInfo {
  const semanas: PlanWeek[] = [
    {
      numero: 1,
      foco: 'Base de Cadência e Fartlek de Adaptação',
      kmTotal: 15.0,
      dias: createWeekDays(1, '5K', 'jacorro', {
        ter: { tit: 'Rodagem de Ritmo 4km', tipo: 'Rodagem Leve', km: 4.0, min: 25, int: 'Moderado', pace: '5:50 min/km', desc: '4km contínuos com cadência alvo de 165 a 170 passos por minuto.', tip: 'Trabalhe aterrissagem no médio-pé para poupar articulações.' },
        qui: { tit: 'Fartlek Pirâmide 1-2-3-2-1', tipo: 'Intervalado', km: 4.5, min: 30, int: 'Alto', pace: '5:15 min/km', desc: '10 min aquecimento + variações de ritmo (1 min forte, 2 min forte, 3 min forte com 90s trote) + soltura.', tip: 'Forte significa ritmo em que você respira pesado mas não quebra.' },
        sab: { tit: 'Longão de Consistência 6km', tipo: 'Longão', km: 6.0, min: 38, int: 'Moderado', pace: '6:00 min/km', desc: 'Longão com 1km além da distância de 5k para construir reserva de glicogênio.', tip: 'Ao passar dos 5km no sábado, observe como sua mente se sente fortalecida.' }
      })
    },
    {
      numero: 2,
      foco: 'Tiros de 400m na Pista ou Rua Plana',
      kmTotal: 16.5,
      dias: createWeekDays(2, '5K', 'jacorro', {
        ter: { tit: 'Rodagem Regenerativa 4.5km', tipo: 'Rodagem Leve', km: 4.5, min: 28, int: 'Leve', pace: '6:05 min/km', desc: 'Manter frequência cardíaca em Zona 2 para queima de lipídios.', tip: 'Não acelere na rodagem! O dia de acelerar é na quinta-feira.' },
        qui: { tit: 'Tiros 6x 400m c/ 60s trote', tipo: 'Intervalado', km: 5.0, min: 32, int: 'Alto', pace: '4:55 min/km', desc: '1.5km aquecimento + 6 tiros de 400m no ritmo alvo + 1km soltura.', tip: 'Tente manter o mesmo tempo em todos os 6 tiros, sem cair no final.' },
        sab: { tit: 'Longão Progressivo 6.5km', tipo: 'Longão', km: 6.5, min: 40, int: 'Moderado', pace: '5:45 min/km', desc: 'Primeiros 4km a 6:00/km e últimos 2.5km a 5:35/km com final firme.', tip: 'Split negativo é o segredo dos corredores inteligentes.' }
      })
    },
    {
      numero: 3,
      foco: 'Treino de Limiar de Lactato (Tempo Run)',
      kmTotal: 18.0,
      dias: createWeekDays(3, '5K', 'jacorro', {
        ter: { tit: 'Rodagem Firme 5km', tipo: 'Rodagem Leve', km: 5.0, min: 30, int: 'Moderado', pace: '5:45 min/km', desc: '5km contínuos com controle constante de respiração.', tip: 'Sinta a leveza da passada. Braços soltos e tronco ligeiramente projetado à frente.' },
        qui: { tit: 'Tempo Run: 3km cravados', tipo: 'Ritmo', km: 5.5, min: 32, int: 'Alto', pace: '5:10 min/km', desc: '1.5km aquecimento + 3km direto no ritmo oficial de prova + 1km desaquecimento.', tip: 'Este é o ritmo que você vai sustentar nos 5K. Memorize a sensação de esforço.' },
        sab: { tit: 'Longão de 7km com Variação', tipo: 'Longão', km: 7.0, min: 44, int: 'Moderado', pace: '5:55 min/km', desc: '7km confortáveis com 4 acelerações nos últimos 500 metros.', tip: 'Treinar acima de 5km faz os 5km parecerem muito mais curtos e fáceis.' }
      })
    },
    {
      numero: 4,
      foco: 'Tiros de 800m para Potência Aeróbia (VO2Max)',
      kmTotal: 19.0,
      dias: createWeekDays(4, '5K', 'jacorro', {
        ter: { tit: 'Rodagem Regenerativa 5km', tipo: 'Rodagem Leve', km: 5.0, min: 31, int: 'Leve', pace: '6:10 min/km', desc: 'Soltura das pernas e foco na recuperação ativa.', tip: 'Durma com as pernas elevadas alguns minutos antes de dormir.' },
        qui: { tit: 'Tiros 4x 800m c/ 90s trote', tipo: 'Intervalado', km: 6.0, min: 36, int: 'Alto', pace: '5:00 min/km', desc: '1.5km aquecimento + 4 repetições de 800m fortes + 1.5km soltura.', tip: 'O 3º tiro é o mais desafiador. Mantenha os olhos na meta!' },
        sab: { tit: 'Longão 7.5km Sustentado', tipo: 'Longão', km: 7.5, min: 46, int: 'Moderado', pace: '5:50 min/km', desc: 'Volume consistente para construir resistência inabalável.', tip: 'Beba 200ml de água durante o longão.' }
      })
    },
    {
      numero: 5,
      foco: 'Consolidação de Ritmo Sub-28min',
      kmTotal: 20.0,
      dias: createWeekDays(5, '5K', 'jacorro', {
        ter: { tit: 'Rodagem 5.5km', tipo: 'Rodagem Leve', km: 5.5, min: 33, int: 'Moderado', pace: '5:40 min/km', desc: '5.5km com passadas dinâmicas e ritmo solto.', tip: 'Treine a cadência rápida com passadas mais próximas do solo.' },
        qui: { tit: 'Tiros Mistos: 4x 400m + 2x 800m', tipo: 'Intervalado', km: 6.5, min: 38, int: 'Alto', pace: '4:50 min/km', desc: 'Combinação de velocidade e resistência de velocidade.', tip: 'Nos 400m finais dê o seu melhor, explorando a força dos braços.' },
        sab: { tit: 'Longão de 8km — Pico de Volume', tipo: 'Longão', km: 8.0, min: 48, int: 'Moderado', pace: '5:45 min/km', desc: 'Maior quilometragem da planilha de 5k. Conclua com autoridade.', tip: 'Você agora tem lastro aeróbico de sobra para destruir seu tempo nos 5k.' }
      })
    },
    {
      numero: 6,
      foco: 'Simulado de Ritmo de Prova',
      kmTotal: 18.0,
      dias: createWeekDays(6, '5K', 'jacorro', {
        ter: { tit: 'Rodagem 5km Leve', tipo: 'Rodagem Leve', km: 5.0, min: 30, int: 'Leve', pace: '5:55 min/km', desc: 'Manter a musculatura acordada sem fadigar.', tip: 'Aqueça bem a panturrilha e os tendões antes de começar.' },
        qui: { tit: 'Simulado 4km no Ritmo Alvo', tipo: 'Ritmo', km: 5.5, min: 32, int: 'Alto', pace: '5:15 min/km', desc: '1.5km aquecimento + 4km cravados no ritmo oficial de meta.', tip: 'Sinta a confiança: o corpo já assimilou a cadência exata.' },
        sab: { tit: 'Longinho Progressivo 7km', tipo: 'Longão', km: 7.0, min: 42, int: 'Moderado', pace: '5:40 min/km', desc: 'Longão tranquilo com aceleração nos últimos 2km.', tip: 'Inicie a fase de taper (redução estratégica de volume).' }
      })
    },
    {
      numero: 7,
      foco: 'Polimento e Supercompensação',
      kmTotal: 14.5,
      dias: createWeekDays(7, '5K', 'jacorro', {
        ter: { tit: 'Rodagem 4.5km Leve', tipo: 'Rodagem Leve', km: 4.5, min: 26, int: 'Leve', pace: '5:50 min/km', desc: 'Sensação de leveza extrema nas pernas.', tip: 'Reduzimos o volume para seu corpo acumular energia máxima.' },
        qui: { tit: 'Ativação 5x 200m Rápidos', tipo: 'Intervalado', km: 4.0, min: 25, int: 'Moderado', pace: '4:40 min/km', desc: '1.5km aquecimento + 5 retas de 200m com 90s caminhada + 1km soltura.', tip: 'Não canse! É apenas para lembrar o cérebro da velocidade das pernas.' },
        sab: { tit: 'Trote Solto 5km', tipo: 'Rodagem Leve', km: 5.0, min: 30, int: 'Leve', pace: '6:00 min/km', desc: 'Trote suave para deixar as pernas soltas para o dia da prova.', tip: 'Hidratação com água e isotônico durante a tarde.' }
      })
    },
    {
      numero: 8,
      foco: '🏆 SEMANA DA PROVA: RECORDE PESSOAL NOS 5K!',
      kmTotal: 12.0,
      dias: createWeekDays(8, '5K', 'jacorro', {
        ter: { tit: 'Soltura 3.5km', tipo: 'Rodagem Leve', km: 3.5, min: 20, int: 'Leve', pace: '5:50 min/km', desc: 'Corrida regenerativa com 3 retas de 50m.', tip: 'Alimente-se de carboidratos complexos (batata doce, arroz, aveia).' },
        qui: { tit: 'Ativação Final 2.5km', tipo: 'Rodagem Leve', km: 2.5, min: 14, int: 'Leve', pace: '5:40 min/km', desc: '2.5km soltos. Ajuste mental e foco total na linha de largada.', tip: 'Confie em todo o suor das últimas 7 semanas. A pista é sua!' },
        sab: { tit: '🏆 DIA DE RP: 5KM COM O MELHOR TEMPO DA VIDA!', tipo: 'Ritmo', km: 5.0, min: 26, int: 'Alto', pace: '5:10 min/km', desc: 'Prova Oficial! Passe o 1º km no ritmo certo, mantenha nos km 2 a 4 e esvazie o tanque nos últimos 500m!', tip: 'Parabéns atleta Go Team! Seu novo recorde pessoal foi conquistado com método e garra!' }
      })
    }
  ];

  return {
    distancia: '5K',
    nivel: 'jacorro',
    nivelNome: 'Já Corro (Evolução)',
    nivelBadge: '🏃 Já Corro',
    titulo: '5K: Evolução e Sub-28min / Sub-25min',
    subtitulo: 'Para quem já completa 5k e quer baixar o tempo com método',
    publicoAlvo: 'Corredores que querem treinar intervalados e ganhar consistência sem estagnar.',
    semanasTotal: 8,
    treinosPorSemana: 3,
    paceReferencia: '5:00 - 5:50 min/km',
    preco: 'R$ 79,90',
    semanas
  };
}

// 1C. 5K — Superar Limites (8 semanas)
function generate5kLimites(): DetailedPlanInfo {
  const semanas: PlanWeek[] = [
    {
      numero: 1,
      foco: 'Tiros Curtos de Alta Intensidade & VO2Max',
      kmTotal: 22.0,
      dias: createWeekDays(1, '5K', 'limites', {
        ter: { tit: 'Rodagem de Base Rápida 6km', tipo: 'Rodagem Leve', km: 6.0, min: 30, int: 'Moderado', pace: '4:50 min/km', desc: '6km contínuos com cadência alta de 175-180 spm.', tip: 'Corra com economia máxima de movimento.' },
        qui: { tit: 'Intervalado 8x 400m a 4:00/km', tipo: 'Intervalado', km: 6.5, min: 35, int: 'Alto', pace: '4:05 min/km', desc: '2km aquecimento + 8 tiros de 400m c/ 60s trote + 1.5km desaquecimento.', tip: 'Ataque a curva e use o balanço vigoroso dos braços.' },
        sab: { tit: 'Longão de Ritmo 8.5km', tipo: 'Longão', km: 8.5, min: 42, int: 'Moderado', pace: '4:55 min/km', desc: 'Longão progressivo com os últimos 3km no ritmo de 4:40/km.', tip: 'Ensina o corpo a correr rápido com pernas pesadas.' }
      })
    },
    {
      numero: 2,
      foco: 'Tiros de 1.000m para Limiar Anaeróbio',
      kmTotal: 24.0,
      dias: createWeekDays(2, '5K', 'limites', {
        ter: { tit: 'Rodagem Regenerativa 6km', tipo: 'Rodagem Leve', km: 6.0, min: 30, int: 'Leve', pace: '5:00 min/km', desc: 'Recuperação aeróbica com foco em amplitude articular.', tip: 'Não deixe o ego acelerar a rodagem leve. O segredo da alta performance é respeitar a zona 2.' },
        qui: { tit: 'Intervalado 4x 1.000m c/ 90s trote', tipo: 'Intervalado', km: 7.5, min: 38, int: 'Alto', pace: '4:10 min/km', desc: '2km aquecimento + 4 séries de 1km no limiar + 1.5km soltura.', tip: 'Mantenha a mente inabalável quando as pernas arderem.' },
        sab: { tit: 'Longão de Potência 9km', tipo: 'Longão', km: 9.0, min: 45, int: 'Moderado', pace: '4:50 min/km', desc: '9km firmes com simulação de subidas no percurso.', tip: 'Força nos glúteos nas subidas para poupar os quadríceps.' }
      })
    },
    {
      numero: 3,
      foco: 'Tempo Run Contínuo Sub-22min Pace',
      kmTotal: 25.5,
      dias: createWeekDays(3, '5K', 'limites', {
        ter: { tit: 'Rodagem Rápida 6.5km', tipo: 'Rodagem Leve', km: 6.5, min: 32, int: 'Moderado', pace: '4:45 min/km', desc: 'Cadência cravada em 180 spm.', tip: 'Respire em ritmo 2x2 com diafragma expandido.' },
        qui: { tit: 'Tempo Run 4km cravados a 4:15/km', tipo: 'Ritmo', km: 7.0, min: 35, int: 'Alto', pace: '4:15 min/km', desc: '2km aquecimento + 4km contínuos no ritmo da sua nova meta de RP.', tip: 'Este é o treino divisor de águas da planilha.' },
        sab: { tit: 'Longão Progressivo 10km', tipo: 'Longão', km: 10.0, min: 48, int: 'Moderado', pace: '4:45 min/km', desc: 'O dobro da distância da prova! Primeiros 6km a 4:55 e últimos 4km a 4:30.', tip: 'Terminar 10km forte dá uma confiança sobrenatural para os 5k.' }
      })
    },
    {
      numero: 4,
      foco: 'Pirâmide de Pista: 200 - 400 - 800 - 1000 - 800 - 400 - 200',
      kmTotal: 26.5,
      dias: createWeekDays(4, '5K', 'limites', {
        ter: { tit: 'Rodagem Regenerativa 6km', tipo: 'Rodagem Leve', km: 6.0, min: 31, int: 'Leve', pace: '5:05 min/km', desc: 'Soltura ativa.', tip: 'Faça liberação miofascial com rolo de espuma nas pernas.' },
        qui: { tit: 'Pirâmide Clássica de Pista', tipo: 'Intervalado', km: 8.0, min: 42, int: 'Alto', pace: '3:55 min/km', desc: 'Aquecimento + Pirâmide completa com recuperação ativa em trote + desaquecimento.', tip: 'Nos tiros curtos acelere com agressividade atlética.' },
        sab: { tit: 'Longão de 10.5km', tipo: 'Longão', km: 10.5, min: 50, int: 'Moderado', pace: '4:40 min/km', desc: 'Volume aeróbico denso para oxigenação celular máxima.', tip: 'Hidratação isotônica após o treino.' }
      })
    },
    {
      numero: 5,
      foco: 'Pico de Intensidade: 10x 400m Sub-4:00/km',
      kmTotal: 27.0,
      dias: createWeekDays(5, '5K', 'limites', {
        ter: { tit: 'Rodagem Firme 7km', tipo: 'Rodagem Leve', km: 7.0, min: 34, int: 'Moderado', pace: '4:45 min/km', desc: '7km uniformes.', tip: 'Postura imponente e cabeça erguida.' },
        qui: { tit: 'O Treino Lendário: 10x 400m c/ 45s trote', tipo: 'Intervalado', km: 8.0, min: 40, int: 'Alto', pace: '3:55 min/km', desc: '2km aquecimento + 10x 400m no ritmo mais rápido da planilha + 2km soltura.', tip: 'Seja cirúrgico: não queime a largada nos primeiros tiros.' },
        sab: { tit: 'Longão de 10km com Fartlek', tipo: 'Longão', km: 10.0, min: 48, int: 'Moderado', pace: '4:40 min/km', desc: '10km incluindo 6 acelerações de 1 min na segunda metade.', tip: 'Simula ultrapassagens nos km finais da prova.' }
      })
    },
    {
      numero: 6,
      foco: 'Simulado Chave: 4km no Ritmo Sub-20/22',
      kmTotal: 23.0,
      dias: createWeekDays(6, '5K', 'limites', {
        ter: { tit: 'Rodagem Leve 6km', tipo: 'Rodagem Leve', km: 6.0, min: 30, int: 'Leve', pace: '5:00 min/km', desc: 'Recuperação e ritmo solto.', tip: 'Deixe o corpo regenerar.' },
        qui: { tit: 'Simulado de Ritmo de Prova 4.2km', tipo: 'Ritmo', km: 7.0, min: 35, int: 'Alto', pace: '4:08 min/km', desc: '2km aquecimento + 4.2km ininterruptos no ritmo exato do seu Recorde + soltura.', tip: 'Você está a apenas 800m do objetivo final.' },
        sab: { tit: 'Longinho Progressivo 8.5km', tipo: 'Longão', km: 8.5, min: 40, int: 'Moderado', pace: '4:35 min/km', desc: 'Longão reduzido iniciando a descida da curva de fadiga.', tip: 'Taper ativado: corpo descansado = corpo voador.' }
      })
    },
    {
      numero: 7,
      foco: 'Polimento Estratégico (Tapering)',
      kmTotal: 17.0,
      dias: createWeekDays(7, '5K', 'limites', {
        ter: { tit: 'Rodagem 5km Leve', tipo: 'Rodagem Leve', km: 5.0, min: 24, int: 'Leve', pace: '4:50 min/km', desc: '5km soltos.', tip: 'Sinta a sensação de explosão acumulada nos músculos.' },
        qui: { tit: 'Ativação 6x 200m a 3:45/km', tipo: 'Intervalado', km: 5.0, min: 25, int: 'Moderado', pace: '3:50 min/km', desc: '2km aquecimento + 6 tiros de 200m com recuperação total caminhando + soltura.', tip: 'Apenas ativar o sistema neuromuscular. Zero cansaço residual.' },
        sab: { tit: 'Trote Soltinho 5km', tipo: 'Rodagem Leve', km: 5.0, min: 25, int: 'Leve', pace: '5:00 min/km', desc: '5km regenerativo.', tip: 'Jantar rico em carboidratos e sono reparador.' }
      })
    },
    {
      numero: 8,
      foco: '🏆 DIA DE PROVA: QUEBRA DE RECORDE PESSOAL (RP SUB-22/SUB-20)!',
      kmTotal: 13.0,
      dias: createWeekDays(8, '5K', 'limites', {
        ter: { tit: 'Rodagem Solta 3.5km', tipo: 'Rodagem Leve', km: 3.5, min: 17, int: 'Leve', pace: '4:55 min/km', desc: 'Soltura muscular.', tip: 'Mente blindada e foco inabalável.' },
        qui: { tit: 'Ativação Final 2.5km', tipo: 'Rodagem Leve', km: 2.5, min: 12, int: 'Leve', pace: '4:45 min/km', desc: '2.5km com 3 acelerações leves.', tip: 'Separar o número de peito, chip e o melhor par de tênis.' },
        sab: { tit: '🏆 CORRIDA DOS SONHOS: 5.0 KM NO LIMITE MÁXIMO!', tipo: 'Ritmo', km: 5.0, min: 21, int: 'Alto', pace: '4:05 min/km', desc: 'Largada decidida. 1º km no ritmo, km 2 e 3 em controle absoluto, km 4 sofrendo mas firme e o 5º km com sprint heroico!', tip: 'Parabéns Atleta de Elite Go Team! Você quebrou seus próprios limites com excelência técnica!' }
      })
    }
  ];

  return {
    distancia: '5K',
    nivel: 'limites',
    nivelNome: 'Superar Limites (Alta Performance)',
    nivelBadge: '⚡ Superar Limites',
    titulo: '5K: Sub-22min / Sub-20min (Alta Performance)',
    subtitulo: 'Para corredores avançados buscando o menor tempo da vida',
    publicoAlvo: 'Atletas competitivos que querem afiar tiros, limiar de lactato e economia biomecânica.',
    semanasTotal: 8,
    treinosPorSemana: 3,
    paceReferencia: '4:00 - 4:45 min/km',
    preco: 'R$ 79,90',
    semanas
  };
}

// =========================================================================
// 2. DISTÂNCIA 10K — 3 NÍVEIS COMPLETOS (10 SEMANAS CADA)
// =========================================================================

// 2A. 10K — Começando do Zero (10 semanas)
function generate10kZero(): DetailedPlanInfo {
  const semanas: PlanWeek[] = [];
  const distanciasLongao = [6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0, 9.5, 7.5, 10.0];
  const focos = [
    'Transição Segura dos 5K para os 6K',
    'Construção de Volume Aeróbico de Base',
    'Conquista dos 7KM com Ritmo Confortável',
    'Adaptação Articular e Fortalecimento de Joelhos',
    'A Barreira dos 8KM Concluída sem Parar',
    'Consolidação de Cadência e Respiração Contínua',
    'Quase nos 10K: Simulado de 9KM',
    'Pico de Resistência: 9.5KM no Longão',
    'Tapering Inteligente: Redução de Carga',
    '🏆 O GRANDE DIA DOS PRIMEIROS 10K DA SUA VIDA!'
  ];

  for (let w = 1; w <= 10; w++) {
    const longKm = distanciasLongao[w - 1];
    const isRaceWeek = w === 10;
    const rodagemKm = isRaceWeek ? 4.0 : 4.5 + Math.floor(w / 3) * 0.5;
    const intervalKm = isRaceWeek ? 3.5 : 5.0 + Math.floor(w / 4) * 0.5;

    semanas.push({
      numero: w,
      foco: focos[w - 1],
      kmTotal: Number((rodagemKm + intervalKm + longKm).toFixed(1)),
      dias: createWeekDays(w, '10K', 'zero', {
        ter: {
          tit: isRaceWeek ? 'Trote Solto 4km' : `Rodagem Aeróbica ${rodagemKm}km`,
          tipo: 'Rodagem Leve',
          km: rodagemKm,
          min: Math.round(rodagemKm * 6.5),
          int: 'Leve',
          pace: '6:35 min/km',
          desc: `${rodagemKm}km contínuos em ritmo regenerativo sem forçar.`,
          tip: 'O ritmo deve permitir que você converse sem perder o fôlego.'
        },
        qui: {
          tit: isRaceWeek ? 'Ativação 3.5km c/ Retas' : `Intervalado Suave ${intervalKm}km`,
          tipo: 'Intervalado',
          km: intervalKm,
          min: Math.round(intervalKm * 6.4),
          int: isRaceWeek ? 'Leve' : 'Moderado',
          pace: '6:15 min/km',
          desc: isRaceWeek ? '2.5km trote leve + 4 retas de 50m soltas.' : `Aquecimento + tiros de 600m ou blocos de ritmo controlado + soltura.`,
          tip: 'Concentre-se em passos suaves e postura alinhada.'
        },
        sab: {
          tit: isRaceWeek ? '🏆 DIA HISTÓRICO: 10.0 KM CONTÍNUOS!' : `Longão Progressivo ${longKm}km`,
          tipo: isRaceWeek ? 'Ritmo' : 'Longão',
          km: longKm,
          min: Math.round(longKm * 6.6),
          int: isRaceWeek ? 'Alto' : 'Moderado',
          pace: isRaceWeek ? '6:20 min/km' : '6:40 min/km',
          desc: isRaceWeek ? 'Parabéns corredor! Complete seus primeiros 10K sem parar e cruze sua meta pessoal com honra!' : `Longão de ${longKm}km mantendo hidratação a cada 20 minutos.`,
          tip: isRaceWeek ? 'Divida a prova em duas partes de 5k: os primeiros 5k com a cabeça e os últimos 5k com o coração!' : 'Leve água ou planeje passar por bebedouros no percurso.'
        }
      })
    });
  }

  return {
    distancia: '10K',
    nivel: 'zero',
    nivelNome: 'Começando do Zero nos 10K',
    nivelBadge: '🌱 Primeiros 10K',
    titulo: '10K: Dos Primeiros 5K aos 10K Ininterruptos',
    subtitulo: 'Para quem já corre 5k e quer dobrar a distância com segurança',
    publicoAlvo: 'Corredores prontos para o salto para a distância mais popular do atletismo de rua.',
    semanasTotal: 10,
    treinosPorSemana: 3,
    paceReferencia: '6:15 - 7:00 min/km',
    preco: 'R$ 89,90',
    semanas
  };
}

// 2B. 10K — Já Corro (10 semanas)
function generate10kJaCorro(): DetailedPlanInfo {
  const semanas: PlanWeek[] = [];
  const distanciasLongao = [8.0, 9.0, 10.0, 9.5, 11.0, 11.5, 12.0, 10.5, 8.0, 10.0];
  const focos = [
    'Construção de Lastro Aeróbico e Fartlek',
    'Tiros de 800m para VO2Max',
    'Longão de 10K com Ritmo Confortável',
    'Semana de Consolidação e Limiar de Lactato',
    'Longão de 11K com Sobrecarga Progressiva',
    'Tiros Clássicos de 1.000m na Pista',
    'Pico de Volume: Longão de 12KM',
    'Treino de Ritmo Específico de Prova',
    'Polimento Físico e Reserva Energética',
    '🏆 O GRANDE DIA: 10KM SUB-55MIN / SUB-50MIN!'
  ];

  for (let w = 1; w <= 10; w++) {
    const longKm = distanciasLongao[w - 1];
    const isRaceWeek = w === 10;

    semanas.push({
      numero: w,
      foco: focos[w - 1],
      kmTotal: Number((5.5 + 6.5 + longKm).toFixed(1)),
      dias: createWeekDays(w, '10K', 'jacorro', {
        ter: {
          tit: 'Rodagem de Base 5.5km',
          tipo: 'Rodagem Leve',
          km: 5.5,
          min: 30,
          int: 'Moderado',
          pace: '5:30 min/km',
          desc: '5.5km com ritmo controlado e cadência de 170 spm.',
          tip: 'Respiração profunda e ombros soltos.'
        },
        qui: {
          tit: isRaceWeek ? 'Ativação 4km' : 'Intervalado 6x 800m ou 5x 1000m',
          tipo: 'Intervalado',
          km: 6.5,
          min: 36,
          int: isRaceWeek ? 'Leve' : 'Alto',
          pace: '4:55 min/km',
          desc: isRaceWeek ? '4km soltinhos com passadas dinâmicas.' : 'Aquecimento + Tiros no ritmo alvo c/ intervalo em trote + soltura.',
          tip: 'Mantenha consistência no pace entre a 1ª e a última repetição.'
        },
        sab: {
          tit: isRaceWeek ? '🏆 PROVA 10KM: NOVO RECORDE PESSOAL!' : `Longão Progressivo ${longKm}km`,
          tipo: isRaceWeek ? 'Ritmo' : 'Longão',
          km: longKm,
          min: Math.round(longKm * 5.5),
          int: isRaceWeek ? 'Alto' : 'Moderado',
          pace: isRaceWeek ? '5:05 min/km' : '5:40 min/km',
          desc: isRaceWeek ? 'Prova Oficial dos 10K! Execute a estratégia de prova com paciência e feche os últimos 2km forte!' : `Longão de ${longKm}km com os últimos 2km no ritmo de prova.`,
          tip: isRaceWeek ? 'Nos km 6 a 8 o cansaço bate: foque na respiração e mantenha a cadência alta.' : 'Alimente-se com carboidratos antes do longão.'
        }
      })
    });
  }

  return {
    distancia: '10K',
    nivel: 'jacorro',
    nivelNome: 'Já Corro 10K (Evolução)',
    nivelBadge: '🏃 Já Corro 10K',
    titulo: '10K: Sub-55min e Sub-50min',
    subtitulo: 'Para quem já corre 10k e quer quebrar a barreira dos 50 minutos',
    publicoAlvo: 'Corredores regulares que querem periodização científica com tiros e tempo run.',
    semanasTotal: 10,
    treinosPorSemana: 3,
    paceReferencia: '4:50 - 5:35 min/km',
    preco: 'R$ 89,90',
    semanas
  };
}

// 2C. 10K — Superar Limites (10 semanas)
function generate10kLimites(): DetailedPlanInfo {
  const semanas: PlanWeek[] = [];
  const distanciasLongao = [10.0, 11.0, 12.0, 11.5, 13.0, 14.0, 15.0, 12.0, 9.0, 10.0];
  const focos = [
    'Adaptação ao Ritmo Sub-45 (Pace 4:15 - 4:25/km)',
    'Tiros de 1.200m e 1.600m no Limiar Anaeróbio',
    'Longão de 12KM com Blocos de Ritmo de Prova',
    'Consolidação de VO2Max e Recuperação Ativa',
    'Longão de 13KM — Resistência Específica de Prova',
    'Intervalados de Pista: 6x 1.000m Sub-4:05/km',
    'Pico de Volume: 15KM com Fim Progressivo',
    'Simulado de 7KM Cravados no Ritmo de Meta',
    'Taper Físico e Psicológico',
    '🏆 O GRANDE DIA: RECORDE HISTÓRICO SUB-45MIN / SUB-40MIN!'
  ];

  for (let w = 1; w <= 10; w++) {
    const longKm = distanciasLongao[w - 1];
    const isRaceWeek = w === 10;

    semanas.push({
      numero: w,
      foco: focos[w - 1],
      kmTotal: Number((7.0 + 8.5 + longKm).toFixed(1)),
      dias: createWeekDays(w, '10K', 'limites', {
        ter: {
          tit: 'Rodagem Firme 7km',
          tipo: 'Rodagem Leve',
          km: 7.0,
          min: 32,
          int: 'Moderado',
          pace: '4:35 min/km',
          desc: '7km com cadência precisa e economia de esforço.',
          tip: 'Foco no alinhamento postural e passadas compactas.'
        },
        qui: {
          tit: isRaceWeek ? 'Ativação 5km' : 'Tiros Longos: 5x 1200m ou 6x 1000m',
          tipo: 'Intervalado',
          km: 8.5,
          min: 40,
          int: isRaceWeek ? 'Leve' : 'Alto',
          pace: '3:58 min/km',
          desc: isRaceWeek ? '5km com 4 retas de aceleração.' : 'Aquecimento 2km + Tiros no limiar de lactato + 2km desaquecimento.',
          tip: 'Mantenha o foco mental durante a queimação nos km finais do treino.'
        },
        sab: {
          tit: isRaceWeek ? '🏆 PROVA 10KM DE ALTA PERFORMANCE (RP!)' : `Longão de Elite ${longKm}km`,
          tipo: isRaceWeek ? 'Ritmo' : 'Longão',
          km: longKm,
          min: Math.round(longKm * 4.6),
          int: isRaceWeek ? 'Alto' : 'Moderado',
          pace: isRaceWeek ? '4:12 min/km' : '4:40 min/km',
          desc: isRaceWeek ? 'Hoje é o dia de colher todo o trabalho duro. Corra com frieza tática e coração de leão!' : `Longão de ${longKm}km com os últimos 4km no ritmo da prova.`,
          tip: isRaceWeek ? 'Nos primeiros 3km controle a empolgação. A prova de 10k de verdade começa no km 7.' : 'Hidratação e gel de carboidrato no km 7 do treino.'
        }
      })
    });
  }

  return {
    distancia: '10K',
    nivel: 'limites',
    nivelNome: 'Superar Limites (Alta Performance)',
    nivelBadge: '⚡ Superar Limites 10K',
    titulo: '10K: Sub-45min / Sub-40min (Performance de Elite)',
    subtitulo: 'Para atletas que buscam tempos expressivos e pódios de categoria',
    publicoAlvo: 'Corredores experientes que buscam máxima eficiência aeróbia e limiar de lactato.',
    semanasTotal: 10,
    treinosPorSemana: 3,
    paceReferencia: '4:00 - 4:35 min/km',
    preco: 'R$ 89,90',
    semanas
  };
}

// =========================================================================
// 3. DISTÂNCIA 21K (MEIA MARATONA) — 3 NÍVEIS COMPLETOS (12 SEMANAS CADA)
// =========================================================================

// 3A. 21K — Começando do Zero (12 semanas)
function generate21kZero(): DetailedPlanInfo {
  const distanciasLongao = [10.0, 11.0, 12.0, 11.0, 13.0, 14.0, 15.0, 14.0, 16.0, 18.0, 13.0, 21.1];
  const focos = [
    'Transição dos 10K para a Meia Maratona',
    'Adaptação ao Volume Semanal e Hidratação',
    'Longão de 12KM — Primeiro Grande Marco',
    'Semana de Recuperação e Consolidação',
    'Construção de Lastro: Longão de 13KM',
    'Adaptação Nutricional: Aprendendo a Usar Gel de Carboidrato',
    'Longão de 15KM — Superando a Maior Distância da Vida',
    'Semana Regenerativa com Fartlek Leve',
    'Longão de 16KM — Fortalecimento Mental',
    'O PICO DA PLANILHA: LONGÃO DE 18KM!',
    'Tapering de 2 Semanas: Descanso e Energia Total',
    '🏆 O DIA DOS SONHOS: SUA PRIMEIRA MEIA MARATONA (21.097M)!'
  ];

  const semanas: PlanWeek[] = [];
  for (let w = 1; w <= 12; w++) {
    const longKm = distanciasLongao[w - 1];
    const isRaceWeek = w === 12;
    const rodagemKm = isRaceWeek ? 5.0 : 6.0 + Math.floor(w / 4) * 0.5;
    const intervalKm = isRaceWeek ? 4.0 : 6.5 + Math.floor(w / 5) * 0.5;

    semanas.push({
      numero: w,
      foco: focos[w - 1],
      kmTotal: Number((rodagemKm + intervalKm + longKm).toFixed(1)),
      dias: createWeekDays(w, '21K', 'zero', {
        ter: {
          tit: isRaceWeek ? 'Trote Soltinho 5km' : `Rodagem de Base ${rodagemKm}km`,
          tipo: 'Rodagem Leve',
          km: rodagemKm,
          min: Math.round(rodagemKm * 6.5),
          int: 'Leve',
          pace: '6:35 min/km',
          desc: `${rodagemKm}km contínuos para manter as pernas ativas sem desgastar.`,
          tip: 'Não force o ritmo. O foco na meia maratona é volume com qualidade.'
        },
        qui: {
          tit: isRaceWeek ? 'Ativação 4km' : `Treino de Ritmo ${intervalKm}km`,
          tipo: 'Intervalado',
          km: intervalKm,
          min: Math.round(intervalKm * 6.2),
          int: isRaceWeek ? 'Leve' : 'Moderado',
          pace: '6:15 min/km',
          desc: isRaceWeek ? '4km de corrida leve com passadas descontraídas.' : `Aquecimento + treinos intervalados longos (tiros de 1.000m) + soltura.`,
          tip: 'Encontre o ritmo no qual você consegue correr horas a fio.'
        },
        sab: {
          tit: isRaceWeek ? '🏆 A GLÓRIA DOS 21.097M — MEIA MARATONA OFICIAL!' : `Longão de Fim de Semana ${longKm}km`,
          tipo: isRaceWeek ? 'Ritmo' : 'Longão',
          km: longKm,
          min: Math.round(longKm * 6.5),
          int: isRaceWeek ? 'Alto' : 'Moderado',
          pace: isRaceWeek ? '6:25 min/km' : '6:45 min/km',
          desc: isRaceWeek ? 'Chegou o momento! 21.1 km de pura superação. Tome seus géis a cada 45 min, beba água em todos os postos e corra para a eternidade!' : `Longão de ${longKm}km com gel no km 8 e km 14.`,
          tip: isRaceWeek ? 'A meia maratona é uma jornada. Aproveite cada quilômetro, a torcida e a emoção de cruzar o portal!' : 'Treine usar o mesmo gel e suplementos que usará na prova.'
        }
      })
    });
  }

  return {
    distancia: '21K',
    nivel: 'zero',
    nivelNome: 'Primeira Meia Maratona',
    nivelBadge: '🌱 Primeiros 21K',
    titulo: '21K: Da Base aos 21.097m da Meia Maratona',
    subtitulo: 'Para quem corre 10k e sonha com a consagração dos 21K',
    publicoAlvo: 'Corredores prontos para a distância mais querida e emocionante do esporte de rua.',
    semanasTotal: 12,
    treinosPorSemana: 3,
    paceReferencia: '6:15 - 7:00 min/km',
    preco: 'R$ 99,90',
    semanas
  };
}

// 3B. 21K — Já Corro (12 semanas)
function generate21kJaCorro(): DetailedPlanInfo {
  const distanciasLongao = [12.0, 13.0, 14.0, 13.0, 15.0, 16.0, 17.0, 15.0, 18.0, 19.0, 14.0, 21.1];
  const focos = [
    'Adaptação ao Ritmo de Prova Sub-2h (Pace 5:35 - 5:40/km)',
    'Intervalados Longos de 1.500m na Pista',
    'Longão de 14KM com Segunda Metade Progressiva',
    'Semana de Consolidação e Mobilidade Articular',
    'Longão de 15KM com Foco em Economia de Corrida',
    'Tiros de 2.000m no Limiar de Lactato',
    'Longão de 17KM — Resistência Aeróbica Avançada',
    'Semana Regenerativa Controlada',
    'Longão de 18KM com 6KM no Ritmo Alvo de Meia',
    'O PICO DO TREINAMENTO: LONGÃO DE 19KM!',
    'Início do Taper: Supercompensação de Carboidratos',
    '🏆 O GRANDE DIA: MEIA MARATONA SUB-2H OU RECORDE PESSOAL!'
  ];

  const semanas: PlanWeek[] = [];
  for (let w = 1; w <= 12; w++) {
    const longKm = distanciasLongao[w - 1];
    const isRaceWeek = w === 12;

    semanas.push({
      numero: w,
      foco: focos[w - 1],
      kmTotal: Number((7.0 + 8.0 + longKm).toFixed(1)),
      dias: createWeekDays(w, '21K', 'jacorro', {
        ter: {
          tit: 'Rodagem de Base 7km',
          tipo: 'Rodagem Leve',
          km: 7.0,
          min: 39,
          int: 'Moderado',
          pace: '5:40 min/km',
          desc: '7km uniformes com cadência de 172 spm.',
          tip: 'Foco na postura ereta para permitir a expansão pulmonar plena.'
        },
        qui: {
          tit: isRaceWeek ? 'Ativação Leve 4.5km' : 'Tiros Longos: 4x 1500m ou 3x 2000m',
          tipo: 'Intervalado',
          km: 8.0,
          min: 44,
          int: isRaceWeek ? 'Leve' : 'Alto',
          pace: '5:10 min/km',
          desc: isRaceWeek ? '4.5km com retas para soltar.' : 'Aquecimento + Tiros no limiar com intervalo de 2 min trote + soltura.',
          tip: 'O treino de limiar é a garantia de que você não vai quebrar no km 16 da prova.'
        },
        sab: {
          tit: isRaceWeek ? '🏆 MEIA MARATONA OFICIAL: SUB-2H GARANTIDO!' : `Longão de Ritmo ${longKm}km`,
          tipo: isRaceWeek ? 'Ritmo' : 'Longão',
          km: longKm,
          min: Math.round(longKm * 5.7),
          int: isRaceWeek ? 'Alto' : 'Moderado',
          pace: isRaceWeek ? '5:35 min/km' : '5:50 min/km',
          desc: isRaceWeek ? 'Meia maratona cravada no ritmo! Mantenha a média de 5:35 a 5:40 min/km e celebre seu Sub-2h!' : `Longão de ${longKm}km simulando alimentação de prova com gel e isotônico.`,
          tip: isRaceWeek ? 'Divida os 21k em blocos de 7km: 1º bloco tranquilo, 2º bloco concentrado, 3º bloco com tudo o que tem!' : 'Hidratação a cada 3km durante o longão.'
        }
      })
    });
  }

  return {
    distancia: '21K',
    nivel: 'jacorro',
    nivelNome: 'Já Corro Meia Maratona (Sub-2h)',
    nivelBadge: '🏃 Meia Maratona Sub-2h',
    titulo: '21K: Meia Maratona Sub-2h e Consistência',
    subtitulo: 'Para quem quer correr 21k com ritmo forte e cruzar a meta abaixo de 2 horas',
    publicoAlvo: 'Corredores regulares que querem uma preparação sólida para baixar o tempo na meia.',
    semanasTotal: 12,
    treinosPorSemana: 3,
    paceReferencia: '5:15 - 5:45 min/km',
    preco: 'R$ 99,90',
    semanas
  };
}

// 3C. 21K — Superar Limites (12 semanas)
function generate21kLimites(): DetailedPlanInfo {
  const distanciasLongao = [14.0, 15.0, 16.0, 15.0, 17.0, 18.0, 19.0, 16.0, 20.0, 21.5, 15.0, 21.1];
  const focos = [
    'Adaptação ao Ritmo de Elite Sub-1h40 (Pace 4:35 - 4:45/km)',
    'Intervalados de 2.000m e 3.000m na Pista',
    'Longão de 16KM com Blocos de Ritmo em Limiar',
    'Semana de Consolidação Metabólica',
    'Longão de 17KM — Resistência Muscular Específica',
    'Tiros de 3.000m e Fartlek de Alta Velocidade',
    'Longão de 19KM com Splits Negativos',
    'Semana de Recuperação e Polimento de Cadência',
    'O Grande Teste: Longão de 20KM',
    'PICO SUPREMO: 21.5KM EM RITMO DE TREINO!',
    'Tapering de Alta Performance (Redução de Volume e Manutenção de Intensidade)',
    '🏆 O DIA DA CONSAGRAÇÃO: MEIA MARATONA SUB-1H40 / SUB-1H30!'
  ];

  const semanas: PlanWeek[] = [];
  for (let w = 1; w <= 12; w++) {
    const longKm = distanciasLongao[w - 1];
    const isRaceWeek = w === 12;

    semanas.push({
      numero: w,
      foco: focos[w - 1],
      kmTotal: Number((8.5 + 10.0 + longKm).toFixed(1)),
      dias: createWeekDays(w, '21K', 'limites', {
        ter: {
          tit: 'Rodagem Firme 8.5km',
          tipo: 'Rodagem Leve',
          km: 8.5,
          min: 40,
          int: 'Moderado',
          pace: '4:45 min/km',
          desc: '8.5km com cadência de 178 spm e economia de movimento.',
          tip: 'Controle a frequência cardíaca para otimizar os estoques de glicogênio.'
        },
        qui: {
          tit: isRaceWeek ? 'Ativação 5km' : 'Tiros Monstruosos: 3x 3000m ou 4x 2000m',
          tipo: 'Intervalado',
          km: 10.0,
          min: 48,
          int: isRaceWeek ? 'Leve' : 'Alto',
          pace: '4:15 min/km',
          desc: isRaceWeek ? '5km com retas dinâmicas para acordar o sistema neural.' : 'Aquecimento + repetições longas em ritmo de 10k + desaquecimento.',
          tip: 'Sustente o ritmo nas repetições finais sem quebrar a postura.'
        },
        sab: {
          tit: isRaceWeek ? '🏆 MEIA MARATONA DE ELITE (SUB-1H40 / SUB-1H30)!' : `Longão Especial ${longKm}km`,
          tipo: isRaceWeek ? 'Ritmo' : 'Longão',
          km: longKm,
          min: Math.round(longKm * 4.8),
          int: isRaceWeek ? 'Alto' : 'Moderado',
          pace: isRaceWeek ? '4:35 min/km' : '4:55 min/km',
          desc: isRaceWeek ? 'Hora do espetáculo! 21.1km no ritmo cravado. Corra com inteligência tática nos primeiros 10k e ataque a prova na segunda metade!' : `Longão de ${longKm}km com 8km finais no ritmo de prova.`,
          tip: isRaceWeek ? 'Confie na sua preparação impecável. A vitória é sua!' : 'Suplementação completa com géis de cafeína nos km finais.'
        }
      })
    });
  }

  return {
    distancia: '21K',
    nivel: 'limites',
    nivelNome: 'Superar Limites (Elite Amadora)',
    nivelBadge: '⚡ Sub-1h40 / Sub-1h30',
    titulo: '21K: Meia Maratona de Elite Amadora',
    subtitulo: 'Para atletas que querem romper limites extremos e buscar pódio',
    publicoAlvo: 'Atletas competitivos que buscam uma meia maratona sub-1h40 ou sub-1h30.',
    semanasTotal: 12,
    treinosPorSemana: 3,
    paceReferencia: '4:15 - 4:45 min/km',
    preco: 'R$ 99,90',
    semanas
  };
}

// =========================================================================
// MAPA GERAL DOS 9 PLANOS DETALHADOS
// =========================================================================

export const DETAILED_PLANS: Record<PlanDistance, Record<AthleticLevel, DetailedPlanInfo>> = {
  '5K': {
    zero: generate5kZero(),
    jacorro: generate5kJaCorro(),
    limites: generate5kLimites()
  },
  '10K': {
    zero: generate10kZero(),
    jacorro: generate10kJaCorro(),
    limites: generate10kLimites()
  },
  '21K': {
    zero: generate21kZero(),
    jacorro: generate21kJaCorro(),
    limites: generate21kLimites()
  }
};

export function getDetailedPlan(distance: PlanDistance, level: AthleticLevel): DetailedPlanInfo {
  return DETAILED_PLANS[distance][level] || DETAILED_PLANS['5K']['zero'];
}
