/*
 * Penny's Patchwork Portfolio — background chiptune
 * A self-contained, looping 8-bit melody played live via the Web Audio API.
 * No audio files, no libraries, no network. Starts only on a user click
 * (respects browser autoplay rules) and can be toggled off again.
 *
 * Progression: C - G - Am - F (the most 90s four chords ever), bright and loopable.
 */
(function () {
  const BPM = 132;
  const EIGHTH = 60 / BPM / 2;       // seconds per eighth note
  const LOOKAHEAD = 0.1;             // how far ahead to schedule (s)
  const TICK = 25;                   // scheduler poll interval (ms)
  const MASTER_VOL = 0.16;           // keep it gentle

  // MIDI note numbers; 0 = rest. 32 eighth-notes = 4 bars.
  const LEAD = [
    76, 79, 84, 79, 76, 79, 74, 76, // C : E G C' G E G D E
    74, 79, 83, 79, 74, 83, 81, 79, // G : D G B G D B A G
    84, 81, 76, 81, 84, 83, 81, 79, // Am: C' A E A C' B A G
    81, 77, 84, 81, 77, 79, 81, 79, // F : A F C' A F G A G
  ];
  // Bass: one note per quarter (16 quarters across 4 bars).
  const BASS = [
    48, 55, 48, 55, // C  : C  G
    43, 50, 43, 50, // G  : G  D
    45, 52, 45, 52, // Am : A  E
    41, 48, 41, 48, // F  : F  C
  ];

  let ctx = null;
  let master = null;
  let playing = false;
  let timer = null;
  let nextTime = 0;
  let step = 0;

  const midiToFreq = (m) => 440 * Math.pow(2, (m - 69) / 12);

  function voice(freq, time, dur, type, vol) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.linearRampToValueAtTime(vol, time + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + dur);
    osc.connect(gain).connect(master);
    osc.start(time);
    osc.stop(time + dur + 0.03);
  }

  function scheduleStep(i, time) {
    const lead = LEAD[i];
    if (lead) voice(midiToFreq(lead), time, EIGHTH * 0.9, "square", 0.5);
    if (i % 2 === 0) {
      const bass = BASS[i / 2];
      if (bass) voice(midiToFreq(bass), time, EIGHTH * 2 * 0.9, "triangle", 0.7);
    }
  }

  function scheduler() {
    while (nextTime < ctx.currentTime + LOOKAHEAD) {
      scheduleStep(step, nextTime);
      nextTime += EIGHTH;
      step = (step + 1) % LEAD.length;
    }
  }

  function start() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = MASTER_VOL;
      master.connect(ctx.destination);
    }
    if (ctx.state === "suspended") ctx.resume();
    step = 0;
    nextTime = ctx.currentTime + 0.05;
    timer = setInterval(scheduler, TICK);
    playing = true;
  }

  function stop() {
    clearInterval(timer);
    timer = null;
    playing = false;
    if (ctx) ctx.suspend();
  }

  // Wire up the toggle button.
  const btn = document.getElementById("music-toggle");
  if (!btn) return;

  function render() {
    btn.setAttribute("aria-pressed", String(playing));
    btn.classList.toggle("is-on", playing);
    btn.querySelector(".music-label").textContent = playing ? "Music: ON" : "Music: OFF";
  }

  btn.addEventListener("click", () => {
    playing ? stop() : start();
    render();
  });

  // Be a polite guest: hush when the tab is hidden, resume when it returns.
  document.addEventListener("visibilitychange", () => {
    if (!ctx) return;
    if (document.hidden) {
      ctx.suspend();
    } else if (playing) {
      ctx.resume();
    }
  });

  render();
})();
