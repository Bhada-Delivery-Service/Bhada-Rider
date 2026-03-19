/**
 * soundService.js — Multiple ring tones, rider-selectable.
 * Pure Web Audio API — no external files or APIs needed.
 *
 * Available sounds:
 *   1. zomato    — Aggressive rapid beeps (Zomato/Swiggy style)
 *   2. chime     — Pleasant 3-note musical chime
 *   3. doorbell  — Classic ding-dong doorbell
 *   4. urgent    — Fast escalating alarm beeps
 *   5. classic   — Old-school phone ring pattern
 *
 * Rider preference saved in localStorage as 'riderRingTone'.
 */

const STORAGE_KEY = 'riderRingTone';
export const DEFAULT_TONE = 'zomato';

export const RING_TONES = [
  { id: 'zomato',   label: 'Zomato Style',    emoji: '🔴' },
  { id: 'chime',    label: 'Musical Chime',   emoji: '🎵' },
  { id: 'doorbell', label: 'Doorbell',        emoji: '🔔' },
  { id: 'urgent',   label: 'Urgent Alarm',    emoji: '🚨' },
  { id: 'classic',  label: 'Classic Ring',    emoji: '📞' },
];

let audioCtx = null;
let ringing = false;
let masterGain = null;
let loopTimer = null;

function getCtx() {
  if (!audioCtx || audioCtx.state === 'closed') {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

async function resumeCtx(ctx) {
  if (ctx.state === 'suspended') await ctx.resume();
}

// ── Tone schedulers ────────────────────────────────────────────────────────

function scheduleZomato(ctx, out, t) {
  const freqs = [1050, 950, 1100];
  for (let i = 0; i < 3; i++) {
    const osc = ctx.createOscillator(); const g = ctx.createGain();
    osc.connect(g); g.connect(out);
    osc.type = 'square';
    osc.frequency.setValueAtTime(freqs[i], t);
    osc.frequency.linearRampToValueAtTime(freqs[i] * 0.88, t + 0.08);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.55, t + 0.008);
    g.gain.setValueAtTime(0.55, t + 0.065);
    g.gain.linearRampToValueAtTime(0, t + 0.08);
    osc.start(t); osc.stop(t + 0.09);
    t += 0.08 + 0.06;
  }
  return t + 0.38;
}

function scheduleChime(ctx, out, t) {
  // 3-note ascending chime: C5 → E5 → G5
  const notes = [523.25, 659.25, 783.99];
  for (let i = 0; i < 3; i++) {
    const osc = ctx.createOscillator(); const g = ctx.createGain();
    osc.connect(g); g.connect(out);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(notes[i], t);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.6, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
    osc.start(t); osc.stop(t + 0.52);
    t += 0.22;
  }
  return t + 0.7;
}

function scheduleDoorbell(ctx, out, t) {
  // Ding (high) → Dong (low)
  const pairs = [[880, 0.25], [587.33, 0.4]];
  for (const [freq, dur] of pairs) {
    const osc = ctx.createOscillator(); const g = ctx.createGain();
    osc.connect(g); g.connect(out);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.65, t + 0.015);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    osc.start(t); osc.stop(t + dur + 0.01);
    t += dur + 0.05;
  }
  return t + 0.8;
}

function scheduleUrgent(ctx, out, t) {
  // Fast escalating beeps: freq goes up each burst
  for (let i = 0; i < 5; i++) {
    const freq = 700 + i * 120;
    const osc = ctx.createOscillator(); const g = ctx.createGain();
    osc.connect(g); g.connect(out);
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.5, t + 0.005);
    g.gain.setValueAtTime(0.5, t + 0.055);
    g.gain.linearRampToValueAtTime(0, t + 0.07);
    osc.start(t); osc.stop(t + 0.08);
    t += 0.09;
  }
  return t + 0.3;
}

function scheduleClassic(ctx, out, t) {
  // Old-school phone: brrrr brrrr (on-off pattern)
  const ringOn = 0.4; const ringOff = 0.2;
  for (let r = 0; r < 2; r++) {
    const osc = ctx.createOscillator(); const g = ctx.createGain();
    osc.connect(g); g.connect(out);
    osc.type = 'square';
    osc.frequency.setValueAtTime(480, t);
    // Tremolo effect — rapid volume oscillation
    for (let i = 0; i < 16; i++) {
      const vol = i % 2 === 0 ? 0.45 : 0.0;
      g.gain.setValueAtTime(vol, t + i * (ringOn / 16));
    }
    g.gain.setValueAtTime(0, t + ringOn);
    osc.start(t); osc.stop(t + ringOn + 0.01);
    t += ringOn + ringOff;
  }
  return t + 0.5;
}

const SCHEDULERS = {
  zomato:   scheduleZomato,
  chime:    scheduleChime,
  doorbell: scheduleDoorbell,
  urgent:   scheduleUrgent,
  classic:  scheduleClassic,
};

// ── Loop engine ────────────────────────────────────────────────────────────

function scheduleLoop(ctx, out, startTime, toneId) {
  if (!ringing) return;
  const scheduler = SCHEDULERS[toneId] || SCHEDULERS.zomato;

  let t = startTime;
  for (let i = 0; i < 3; i++) {
    t = scheduler(ctx, out, t);
  }

  const msUntilRefill = Math.max(100, (t - ctx.currentTime - 0.6) * 1000);
  loopTimer = setTimeout(() => {
    if (ringing) scheduleLoop(ctx, out, t, toneId);
  }, msUntilRefill);
}

// ── Public API ─────────────────────────────────────────────────────────────

export function getSelectedTone() {
  return localStorage.getItem(STORAGE_KEY) || DEFAULT_TONE;
}

export function setSelectedTone(toneId) {
  localStorage.setItem(STORAGE_KEY, toneId);
}

export async function startRing(toneId) {
  if (ringing) return;
  ringing = true;
  const tone = toneId || getSelectedTone();

  try {
    const ctx = getCtx();
    await resumeCtx(ctx);
    masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(1.0, ctx.currentTime);
    masterGain.connect(ctx.destination);
    scheduleLoop(ctx, masterGain, ctx.currentTime + 0.05, tone);
  } catch (err) {
    console.warn('[soundService] startRing failed:', err.message);
    ringing = false;
  }
}

export function stopRing() {
  ringing = false;
  if (loopTimer) { clearTimeout(loopTimer); loopTimer = null; }
  if (masterGain && audioCtx) {
    try {
      masterGain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.05);
    } catch (_) {}
    masterGain = null;
  }
}

/** Preview a specific tone once (for settings page) */
export async function previewTone(toneId) {
  try {
    const ctx = getCtx();
    await resumeCtx(ctx);
    const g = ctx.createGain();
    g.gain.setValueAtTime(1.0, ctx.currentTime);
    g.connect(ctx.destination);
    const scheduler = SCHEDULERS[toneId] || SCHEDULERS.zomato;
    scheduler(ctx, g, ctx.currentTime + 0.05);
  } catch (err) {
    console.warn('[soundService] previewTone failed:', err.message);
  }
}

export function isRinging() { return ringing; }
export function unlockAudio() {
  try { const ctx = getCtx(); if (ctx.state === 'suspended') ctx.resume(); } catch (_) {}
}