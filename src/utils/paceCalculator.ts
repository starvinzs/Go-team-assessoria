// Pace and Race Time Predictions based on sports physiology (VDOT & Pete Riegel Formula)

export interface TrainingPaceZones {
  easy: { minPace: string; maxPace: string; desc: string };
  longRun: { minPace: string; maxPace: string; desc: string };
  tempo: { minPace: string; maxPace: string; desc: string };
  interval: { minPace: string; maxPace: string; desc: string };
  repetition: { minPace: string; maxPace: string; desc: string };
}

export interface RacePrediction {
  distName: string;
  distanceKm: number;
  timeFormatted: string;
  paceFormatted: string;
}

export const formatSecToTime = (totalSeconds: number): string => {
  const rounded = Math.round(totalSeconds);
  const hours = Math.floor(rounded / 3600);
  const minutes = Math.floor((rounded % 3600) / 60);
  const seconds = rounded % 60;

  const secStr = seconds < 10 ? `0${seconds}` : `${seconds}`;
  const minStr = minutes < 10 && hours > 0 ? `0${minutes}` : `${minutes}`;

  if (hours > 0) {
    return `${hours}:${minStr}:${secStr}`;
  }
  return `${minStr}:${secStr}`;
};

export const formatPace = (secondsPerKm: number): string => {
  const rounded = Math.round(secondsPerKm);
  const min = Math.floor(rounded / 60);
  const sec = rounded % 60;
  return `${min}:${sec < 10 ? '0' : ''}${sec}`;
};

// Pete Riegel formula: T2 = T1 * (D2 / D1)^1.06
export const predictRaceTime = (t1Seconds: number, d1Km: number, d2Km: number): number => {
  return t1Seconds * Math.pow(d2Km / d1Km, 1.06);
};

export const calculatePacesAndPredictions = (
  baseDistanceKm: number,
  baseTimeSeconds: number
) => {
  const basePaceSec = baseTimeSeconds / baseDistanceKm;

  // Estimate 5k equivalent pace
  const equiv5kTimeSec = predictRaceTime(baseTimeSeconds, baseDistanceKm, 5);
  const pace5kSec = equiv5kTimeSec / 5;

  // Training Zones relative to 5K pace (Jack Daniels running formula principles)
  // Easy: +60s to +90s slower than 5k pace
  const easyMin = pace5kSec + 60;
  const easyMax = pace5kSec + 105;

  // Long Run: +45s to +75s
  const longMin = pace5kSec + 45;
  const longMax = pace5kSec + 80;

  // Tempo / Limiar: +15s to +25s
  const tempoMin = pace5kSec + 12;
  const tempoMax = pace5kSec + 24;

  // Interval / Tiros (400m - 1000m): -10s to 0s
  const intervalMin = pace5kSec - 12;
  const intervalMax = pace5kSec - 2;

  // Repetition / Velocidade (200m - 400m): -25s to -15s
  const repMin = pace5kSec - 28;
  const repMax = pace5kSec - 15;

  const zones: TrainingPaceZones = {
    easy: {
      minPace: formatPace(easyMin),
      maxPace: formatPace(easyMax),
      desc: 'Rodagem leve, regenerativa e aquecimento (70-75% FCmáx). Confortável para conversar.'
    },
    longRun: {
      minPace: formatPace(longMin),
      maxPace: formatPace(longMax),
      desc: 'Treinos longos de fim de semana. Constrói resistência aeróbica e queima de gordura.'
    },
    tempo: {
      minPace: formatPace(tempoMin),
      maxPace: formatPace(tempoMax),
      desc: 'Ritmo de limiar / fartlek sustentável (85-88% FCmáx). Confortavelmente duro por 20 a 40 min.'
    },
    interval: {
      minPace: formatPace(intervalMin),
      maxPace: formatPace(intervalMax),
      desc: 'Tiros de 400m a 1000m (95-100% VO2máx). Desenvolve capacidade cardiorrespiratória máxima.'
    },
    repetition: {
      minPace: formatPace(repMin),
      maxPace: formatPace(repMax),
      desc: 'Velocidade pura e passadas curtas (200m - 400m). Aprimora economia de corrida e potência muscular.'
    }
  };

  const targetDistances = [
    { name: '5K', km: 5 },
    { name: '10K', km: 10 },
    { name: '21K (Meia Maratona)', km: 21.0975 },
    { name: '42K (Maratona)', km: 42.195 }
  ];

  const predictions: RacePrediction[] = targetDistances.map(target => {
    const predictedSec = predictRaceTime(baseTimeSeconds, baseDistanceKm, target.km);
    return {
      distName: target.name,
      distanceKm: target.km,
      timeFormatted: formatSecToTime(predictedSec),
      paceFormatted: `${formatPace(predictedSec / target.km)} min/km`
    };
  });

  return {
    basePace: formatPace(basePaceSec),
    zones,
    predictions
  };
};
