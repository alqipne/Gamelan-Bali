// Define notes with key and frequency
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

// Create AudioContext
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// Resume context on first user interaction
const resumeAudioContext = () => {
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
};
document.addEventListener("touchstart", resumeAudioContext, { once: true });
document.addEventListener("click", resumeAudioContext, { once: true });

// Function to play note
function playNote(freq, waveform) {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = waveform;
  osc.frequency.value = freq;

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  gain.gain.setValueAtTime(0.6, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1);

  osc.start();
  osc.stop(audioCtx.currentTime + 1);
}

// Get UI elements
const waveformSelect = document.getElementById("waveform");
const container = document.getElementById("buttons");

// Create buttons and attach events
notes.forEach(note => {
  const btn = document.createElement("button");
  btn.textContent = note.key;
  btn.dataset.key = note.key;

  // Click or tap
  const handlePlay = () => {
    const waveform = waveformSelect.value;
    playNote(note.freq, waveform);
    animateButton(btn);
  };

  btn.addEventListener("click", handlePlay);
  btn.addEventListener("touchstart", (e) => {
    e.preventDefault(); // prevent 300ms delay on iOS Safari
    handlePlay();
  });

  container.appendChild(btn);
});

// Handle keyboard input
document.addEventListener("keydown", (e) => {
  const key = e.key;
  const note = notes.find(n => n.key === key);
  if (note) {
    const waveform = waveformSelect.value;
    playNote(note.freq, waveform);
    const btn = document.querySelector(`button[data-key="${key}"]`);
    if (btn) animateButton(btn);
  }
});

// Animate button press
function animateButton(btn) {
  btn.style.transform = "scale(0.96)";
  setTimeout(() => btn.style.transform = "scale(1)", 150);
}

// Prevent double-tap zoom (iOS Safari)
let lastTouchEnd = 0;
document.addEventListener('touchend', function (event) {
  const now = new Date().getTime();
  if (now - lastTouchEnd <= 300) {
    event.preventDefault();
  }
  lastTouchEnd = now;
}, false);
