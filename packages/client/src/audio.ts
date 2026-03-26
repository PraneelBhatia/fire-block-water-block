/**
 * Synthesized game audio using Web Audio API.
 * All sounds are procedurally generated — no external files needed.
 */

let ctx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!ctx) {
    ctx = new AudioContext();
  }
  // Resume if suspended (autoplay policy)
  if (ctx.state === 'suspended') {
    ctx.resume();
  }
  return ctx;
}

/** Ensure AudioContext is ready after first user interaction */
export function initAudio(): void {
  getCtx();
}

// ---- Sound Effects ----

/** Short percussive "tick" when a block lands after rolling */
export function playMoveSound(): void {
  const ac = getCtx();
  const now = ac.currentTime;

  // Low thud
  const osc = ac.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(120, now);
  osc.frequency.exponentialRampToValueAtTime(60, now + 0.08);

  const gain = ac.createGain();
  gain.gain.setValueAtTime(0.15, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

  osc.connect(gain);
  gain.connect(ac.destination);
  osc.start(now);
  osc.stop(now + 0.12);

  // Click transient
  const click = ac.createOscillator();
  click.type = 'square';
  click.frequency.setValueAtTime(800, now);
  click.frequency.exponentialRampToValueAtTime(200, now + 0.03);

  const clickGain = ac.createGain();
  clickGain.gain.setValueAtTime(0.06, now);
  clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

  click.connect(clickGain);
  clickGain.connect(ac.destination);
  click.start(now);
  click.stop(now + 0.04);
}

/** Ascending chime sequence for level completion */
export function playLevelComplete(): void {
  const ac = getCtx();
  const now = ac.currentTime;

  const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6
  notes.forEach((freq, i) => {
    const delay = i * 0.12;

    const osc = ac.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now + delay);

    // Add slight detune for sparkle
    const osc2 = ac.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 1.005, now + delay);

    const gain = ac.createGain();
    gain.gain.setValueAtTime(0, now + delay);
    gain.gain.linearRampToValueAtTime(0.12, now + delay + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.5);

    osc.connect(gain);
    osc2.connect(gain);
    gain.connect(ac.destination);

    osc.start(now + delay);
    osc.stop(now + delay + 0.5);
    osc2.start(now + delay);
    osc2.stop(now + delay + 0.5);
  });
}

/** Harsh descending buzz for block death */
export function playDeathSound(): void {
  const ac = getCtx();
  const now = ac.currentTime;

  // Descending buzz
  const osc = ac.createOscillator();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(400, now);
  osc.frequency.exponentialRampToValueAtTime(80, now + 0.3);

  const gain = ac.createGain();
  gain.gain.setValueAtTime(0.12, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

  // Low-pass filter for warmth
  const filter = ac.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(1200, now);
  filter.frequency.exponentialRampToValueAtTime(200, now + 0.3);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ac.destination);

  osc.start(now);
  osc.stop(now + 0.35);
}

/** Soft UI click for buttons */
export function playClickSound(): void {
  const ac = getCtx();
  const now = ac.currentTime;

  const osc = ac.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(1200, now);
  osc.frequency.exponentialRampToValueAtTime(600, now + 0.04);

  const gain = ac.createGain();
  gain.gain.setValueAtTime(0.06, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

  osc.connect(gain);
  gain.connect(ac.destination);
  osc.start(now);
  osc.stop(now + 0.06);
}

/** Switch activation — quick rising blip */
export function playSwitchSound(): void {
  const ac = getCtx();
  const now = ac.currentTime;

  const osc = ac.createOscillator();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(440, now);
  osc.frequency.exponentialRampToValueAtTime(880, now + 0.1);

  const gain = ac.createGain();
  gain.gain.setValueAtTime(0.1, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

  osc.connect(gain);
  gain.connect(ac.destination);
  osc.start(now);
  osc.stop(now + 0.15);
}
