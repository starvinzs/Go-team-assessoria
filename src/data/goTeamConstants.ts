export interface GoTeamPlanSchedule {
  id: '5K' | '10K' | '21K';
  nome: string;
  subtitulo: string;
  nivel: string;
  preco: string;
  semanas: number;
  badge?: string;
  desc: string;
  destaque: boolean;
  beneficios: string[];
  pdfUrl: string;
  dias: { dia: string; desc: string; km?: number; tipo?: string }[];
}

export const GOTEAM_PLANOS: Record<'5K' | '10K' | '21K', GoTeamPlanSchedule> = {
  '5K': {
    id: '5K',
    nome: 'Primeiros Passos',
    subtitulo: 'Para quem nunca correu ou quer recomeçar',
    nivel: 'Iniciante',
    preco: 'R$ 79,90',
    semanas: 8,
    desc: 'Dê seu primeiro passo com segurança. Alterne caminhada e corrida de forma progressiva e cruze seus primeiros 5K sem parar.',
    destaque: false,
    beneficios: [
      '8 semanas de treino estruturado',
      'Progressão caminhada + corrida segura',
      'Suporte direto via WhatsApp',
      'Dicas de respiração, postura e cadência'
    ],
    pdfUrl: '#',
    dias: [
      { dia: 'Segunda', desc: 'Descanso total', tipo: 'Descanso' },
      { dia: 'Terça', desc: '10min caminhada leve + 5x (3min caminhada + 1min corrida leve) + 10min caminhada leve', km: 3.5, tipo: 'Intervalado Leve' },
      { dia: 'Quarta', desc: 'Descanso total', tipo: 'Descanso' },
      { dia: 'Quinta', desc: 'Corrida leve — 4km ritmo confortável', km: 4.0, tipo: 'Rodagem Leve' },
      { dia: 'Sexta', desc: 'Descanso total', tipo: 'Descanso' },
      { dia: 'Sábado', desc: 'Longão — 5km no ritmo alvo dos primeiros 5K', km: 5.0, tipo: 'Longão' },
      { dia: 'Domingo', desc: 'Descanso ou caminhada regenerativa', tipo: 'Descanso' }
    ]
  },
  '10K': {
    id: '10K',
    nome: 'Evolução',
    subtitulo: 'Para quem já corre um pouco',
    nivel: 'Intermediário',
    preco: 'R$ 89,90',
    semanas: 10,
    badge: 'Mais Popular',
    desc: 'Aumente sua resistência, ganhe ritmo e transforme os 10K no seu novo padrão de corrida e consistência.',
    destaque: true,
    beneficios: [
      '10 semanas de treino periodizado',
      'Treinos intervalados de ritmo e VO2Max',
      'Fortalecimento específico de membros inferiores',
      'Estratégia de ritmo de prova (splits)'
    ],
    pdfUrl: '#',
    dias: [
      { dia: 'Segunda', desc: 'Corrida leve — 4km regenerativo', km: 4.0, tipo: 'Rodagem Leve' },
      { dia: 'Terça', desc: 'Descanso ativo — mobilidade e core', tipo: 'Mobilidade' },
      { dia: 'Quarta', desc: 'Intervalado — 6x 400m forte com 90s trote', km: 5.5, tipo: 'Intervalado' },
      { dia: 'Quinta', desc: 'Descanso total', tipo: 'Descanso' },
      { dia: 'Sexta', desc: 'Corrida moderada — 7km ritmo de prova', km: 7.0, tipo: 'Ritmo' },
      { dia: 'Sábado', desc: 'Longão — 10km progressivo', km: 10.0, tipo: 'Longão' },
      { dia: 'Domingo', desc: 'Descanso total', tipo: 'Descanso' }
    ]
  },
  '21K': {
    id: '21K',
    nome: 'Meia Maratona',
    subtitulo: 'Para corredores experientes',
    nivel: 'Avançado',
    preco: 'R$ 99,90',
    semanas: 12,
    desc: 'Prepare-se para o desafio da meia maratona com uma planilha estruturada, periodizada e testada em provas reais.',
    destaque: false,
    beneficios: [
      '12 semanas de treino progressivo',
      'Long runs progressivos até 18km',
      'Estratégia nutricional e hidratação na prova',
      'Análise biomecânica e controle de pace'
    ],
    pdfUrl: '#',
    dias: [
      { dia: 'Segunda', desc: 'Corrida leve — 6km regenerativo', km: 6.0, tipo: 'Rodagem Leve' },
      { dia: 'Terça', desc: 'Fortalecimento + mobilidade articular', tipo: 'Fortalecimento' },
      { dia: 'Quarta', desc: 'Intervalado — 8x 400m forte com 90s trote', km: 7.0, tipo: 'Intervalado' },
      { dia: 'Quinta', desc: 'Corrida moderada — 8km contínuo', km: 8.0, tipo: 'Ritmo' },
      { dia: 'Sexta', desc: 'Descanso total', tipo: 'Descanso' },
      { dia: 'Sábado', desc: 'Longão progressivo — 16km', km: 16.0, tipo: 'Longão' },
      { dia: 'Domingo', desc: 'Descanso total', tipo: 'Descanso' }
    ]
  }
};

export const DEPOIMENTOS = [
  {
    nome: 'Marina S.',
    badge: 'Terminei meu primeiro 5K',
    texto: 'Nunca imaginei que conseguiria correr sem parar. A planilha respeitou meu ritmo e hoje já estou pensando nos 10K!'
  },
  {
    nome: 'Rafael T.',
    badge: 'Meia maratona conquistada',
    texto: 'Estrutura, dedicação e resultado. A Go Team me ajudou a bater meu recorde pessoal em 21K com segurança e sem lesões.'
  },
  {
    nome: 'Juliana P.',
    badge: '10K com novo pace',
    texto: 'Consegui quebrar minha barreira nos 10K. Os treinos intervalados fizeram toda a diferença no meu ritmo de corrida.'
  }
];

export const CONTATO_WHATSAPP = 'https://wa.me/5517982309000?text=Ol%C3%A1!%20Quero%20come%C3%A7ar%20meus%20treinos%20com%20a%20Go%20Team.';
export const INSTAGRAM_LINK = 'https://www.instagram.com/oleandroirineu';
