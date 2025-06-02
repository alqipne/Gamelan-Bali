// JavaScript

// Define notes with keyboard key and frequency (in Hz)
const notes = [
  { key: "1", freq: 293.66 },
  { key: "2", freq: 329.63 },
  { key: "3", freq: 415.30 },
  { key: "4", freq: 440.00 },
  { key: "5", freq: 554.37 },
  { key: "6", freq: 587.33 },
  { key: "7", freq: 659.26 },
  { key: "8", freq: 830.61 },
  { key: "9", freq: 880.00 },
  { key: "0", freq: 1108.73 }
];

// Create Web Audio context
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// Ensure AudioContext resumes on interaction
function resumeAudio() {
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

// Function to play a note with selected waveform
function playNote(freq, waveform) {
  resumeAudio(); // Make sure context is active

  const osc = audioCtx.createOscillator(); // oscillator node
  const gain = audioCtx.createGain(); // gain node for fade-out effect

  osc.type = waveform;
  osc.frequency.value = freq;

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  // Volume envelope
  gain.gain.setValueAtTime(0.6, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.0);

  osc.start();
  osc.stop(audioCtx.currentTime + 1.0);
}

// Get waveform select and button container
const waveformSelect = document.getElementById("waveform");
const container = document.getElementById("buttons");

// Create a button for each note
notes.forEach(note => {
  const btn = document.createElement("button");
  btn.textContent = note.key;
  btn.dataset.key = note.key;

  // For desktop
  btn.addEventListener("click", () => {
    const waveform = waveformSelect.value;
    playNote(note.freq, waveform);
  });

  // For mobile (touch responsiveness)
  btn.addEventListener("touchstart", (e) => {
    e.preventDefault(); // Prevent long tap, etc.
    const waveform = waveformSelect.value;
    playNote(note.freq, waveform);
  });

  container.appendChild(btn);
});

// Play note on key press
document.addEventListener('keydown', (e) => {
  const key = e.key;
  const note = notes.find(n => n.key === key);
  if (note) {
    const waveform = waveformSelect.value;
    playNote(note.freq, waveform);

    // Visual feedback
    const btn = document.querySelector(`button[data-key="${key}"]`);
    if (btn) {
      btn.style.transform = "scale(0.96)";
      setTimeout(() => btn.style.transform = "scale(1)", 150);
    }
  }
});

// Prevent double-tap zoom on mobile
let lastTouchEnd = 0;
document.addEventListener('touchend', function (event) {
  const now = new Date().getTime();
  if (now - lastTouchEnd <= 300) {
    event.preventDefault();
  }
  lastTouchEnd = now;
}, false);
