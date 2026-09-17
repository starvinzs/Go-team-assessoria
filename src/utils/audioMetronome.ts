// Web Audio API metronome and sound alerts for runner cadence and workout intervals
class AudioCoach {
  private audioCtx: AudioContext | null = null;
  private metronomeTimer: number | null = null;
  private isMetronomePlaying: boolean = false;

  private initCtx() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioContextClass();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  // Beep sound for metronome tick
  public playTick(frequency: number = 880, duration: number = 0.04) {
    try {
      this.initCtx();
      if (!this.audioCtx) return;

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, this.audioCtx.currentTime);

      gain.gain.setValueAtTime(0.3, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + duration);
    } catch (e) {
      console.warn('Audio tick note:', e);
    }
  }

  // Start cadence metronome (e.g., 170 - 180 SPM)
  public startCadenceMetronome(spm: number = 175) {
    this.stopCadenceMetronome();
    this.isMetronomePlaying = true;
    const intervalMs = (60 / spm) * 1000;

    let count = 0;
    this.metronomeTimer = window.setInterval(() => {
      count++;
      // High pitch on beat 1 of 4, standard pitch on others
      const freq = count % 4 === 1 ? 1200 : 800;
      this.playTick(freq, 0.035);
    }, intervalMs);
  }

  public stopCadenceMetronome() {
    if (this.metronomeTimer !== null) {
      clearInterval(this.metronomeTimer);
      this.metronomeTimer = null;
    }
    this.isMetronomePlaying = false;
  }

  public toggleCadence(spm: number = 175): boolean {
    if (this.isMetronomePlaying) {
      this.stopCadenceMetronome();
      return false;
    } else {
      this.startCadenceMetronome(spm);
      return true;
    }
  }

  public isCadenceRunning(): boolean {
    return this.isMetronomePlaying;
  }

  // Interval whistle / chime for workout start / finish
  // Whistle / chime sound
  public playIntervalChime(type: 'start' | 'finish' | 'countdown' | 'sprint' | 'rest') {
    try {
      this.initCtx();
      if (!this.audioCtx) return;

      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      if (type === 'start') {
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.2);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.3);
      } else if (type === 'finish') {
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.4);
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.6);
      } else if (type === 'sprint') {
        // High energetic double beep
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.setValueAtTime(1320, now + 0.12);
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.3);
      } else if (type === 'rest') {
        // Calmer descending tone
        osc.frequency.setValueAtTime(660, now);
        osc.frequency.exponentialRampToValueAtTime(440, now + 0.3);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.35);
      } else {
        osc.frequency.setValueAtTime(750, now);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.1);
      }
    } catch (e) {
      console.warn('Interval chime note:', e);
    }
  }

  // Voice synthesis in Portuguese for real-time coach feedback
  public speak(phrase: string, onEnd?: () => void) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      console.log('[Áudio Coach]:', phrase);
      return;
    }

    try {
      window.speechSynthesis.cancel(); // Stop prior unfinished voice
      const utterance = new SpeechSynthesisUtterance(phrase);
      utterance.lang = 'pt-BR';
      utterance.rate = 1.05; // slightly energetic sports coach pace
      utterance.pitch = 1.0;

      // Find pt-BR voice if available
      const voices = window.speechSynthesis.getVoices();
      const ptVoice = voices.find(v => v.lang.startsWith('pt') || v.lang.includes('BR'));
      if (ptVoice) {
        utterance.voice = ptVoice;
      }

      if (onEnd) {
        utterance.onend = onEnd;
      }

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('Speech synthesis error:', err);
    }
  }

  // Preset coaching phrases in Portuguese for running workouts and interval training
  public coachCallout(type: 'start_warmup' | 'prep_sprint' | 'start_sprint' | 'active_recovery' | 'halfway' | 'final_push' | 'finish_workout', customNote?: string) {
    switch (type) {
      case 'start_warmup':
        this.playIntervalChime('start');
        this.speak('Iniciando treino Go Team! Comece com trote leve de aquecimento e postura alinhada.');
        break;
      case 'prep_sprint':
        this.playIntervalChime('countdown');
        this.speak('Atenção corredor: Prepare-se para o tiro em 3, 2, 1!');
        break;
      case 'start_sprint':
        this.playIntervalChime('sprint');
        this.speak(customNote || 'Acelere agora! Força na passada, respiração ritmada!');
        break;
      case 'active_recovery':
        this.playIntervalChime('rest');
        this.speak('Excelente tiro! Agora recuperação ativa. Solte os braços e recupere o fôlego.');
        break;
      case 'halfway':
        this.playIntervalChime('countdown');
        this.speak('Metade do treino concluída! Mantenha a cadência firme.');
        break;
      case 'final_push':
        this.playIntervalChime('sprint');
        this.speak('Reta final! Último esforço para fechar o treino com chave de ouro!');
        break;
      case 'finish_workout':
        this.playIntervalChime('finish');
        this.speak('Treino finalizado com sucesso! Parabéns pela dedicação, atleta Go Team!');
        break;
    }
  }
}

export const audioCoach = new AudioCoach();
