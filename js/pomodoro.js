// ===== POMODORO — Focus Timer JS =====
// Concepts: setInterval, clearInterval, localStorage, event listeners, DOM manipulation

let timer;
let isRunning = false;

let modes = {
  focus25: 25 * 60,
  focus30: 30 * 60,
  focus45: 45 * 60,
  focus50: 50 * 60,
  short: 5 * 60,
  long: 15 * 60
};

let currentMode = "focus25";
let timeLeft = modes[currentMode];

const timerDisplay = document.getElementById("timer");
const musicPlayer = document.getElementById("focusMusic");

function updateDisplay() {
  let minutes = Math.floor(timeLeft / 60);
  let seconds = timeLeft % 60;
  timerDisplay.textContent =
    `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function startTimer() {
  if (isRunning) return;
  isRunning = true;

  // Auto-play selected audio
  var sel = document.querySelector('select[onchange="changeMusic(this.value)"]');
  if (sel && sel.value) changeMusic(sel.value);

  timer = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
      updateDisplay();
    } else {
      clearInterval(timer);
      isRunning = false;
      stopAudio(); // Stop audio when time is up

      // Save completed session to localStorage
      saveSession();

      if (currentMode === "short" || currentMode === "long") {
        alert("🎉 Break complete! Time to focus.");
      } else {
        alert("🎉 Focus session complete! Take a break.");
      }
    }
  }, 1000);
}

function pauseTimer() {
  clearInterval(timer);
  isRunning = false;
  stopAudio();
}

function resetTimer() {
  clearInterval(timer);
  isRunning = false;
  timeLeft = modes[currentMode];
  stopAudio();
  updateDisplay();
}

function setMode(mode) {
  currentMode = mode;
  resetTimer();

  document.querySelectorAll(".mode-switch button")
    .forEach(btn => btn.classList.remove("active"));

  var activeBtn = document.querySelector(`.mode-switch button[onclick="setMode('${mode}')"]`);
  if (activeBtn) activeBtn.classList.add("active");

  // Show games link only during breaks
  var gamesLink = document.getElementById("gamesLink");
  if (gamesLink) {
    if (mode === "short" || mode === "long") {
      gamesLink.style.display = "inline-block";
    } else {
      gamesLink.style.display = "none";
    }
  }
}

// === WEB AUDIO API AMBIENT SOUNDS ===
var audioCtx = null;
var activeNodes = [];

function initAudio() {
  if (!audioCtx) {
    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      console.error("Web Audio API not supported");
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

function stopAudio() {
  activeNodes.forEach(node => {
    try { node.stop(); } catch (e) { }
    try { node.disconnect(); } catch (e) { }
  });
  activeNodes = [];
}

function changeMusic(type) {
  stopAudio();
  if (!type) return;

  initAudio();
  if (!audioCtx) return;

  if (type === "rain") {
    // Brown noise for rain
    var bufferSize = 4096;
    var rawNode = audioCtx.createScriptProcessor(bufferSize, 1, 1);
    var lastOut = 0;
    rawNode.onaudioprocess = function (e) {
      var output = e.outputBuffer.getChannelData(0);
      for (var i = 0; i < bufferSize; i++) {
        var white = Math.random() * 2 - 1;
        output[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5;
      }
    };

    var filter = audioCtx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 800; // Rain sounds muffled

    var gain = audioCtx.createGain();
    gain.gain.value = 0.2; // Volume

    rawNode.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);

    activeNodes.push(rawNode, filter, gain);
  }
  else if (type === "lofi") {
    // Soft deep sine wave pulse
    var osc = audioCtx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = 120; // Deep tone

    var lfo = audioCtx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.value = 0.2; // Slow pulse

    var gain = audioCtx.createGain();
    gain.gain.value = 0.1;

    var lfoGain = audioCtx.createGain();
    lfoGain.gain.value = 0.05;

    lfo.connect(lfoGain);
    lfoGain.connect(gain.gain);

    var filter = audioCtx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 400;

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    lfo.start();
    activeNodes.push(osc, lfo, filter, gain, lfoGain);
  }
  else if (type === "piano") {
    // Generative soft piano chords using triangles
    var interval = setInterval(() => {
      // Don't play if paused
      if (!isRunning) return;

      var notes = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00]; // Pentatonic C
      var freq = notes[Math.floor(Math.random() * notes.length)] * 0.5; // Low octave

      var osc = audioCtx.createOscillator();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      var gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0, audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0.2, audioCtx.currentTime + 0.1); // Attack
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 3); // Decay

      var filter = audioCtx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 600;

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 3.1);

      // Cleanup after play
      setTimeout(() => {
        try { osc.disconnect(); gain.disconnect(); filter.disconnect(); } catch (e) { }
      }, 3200);

    }, 2000); // Play a note every 2 seconds

    // Add a dummy node to clear the interval when stopAudio() is called
    activeNodes.push({
      stop: function () { clearInterval(interval); },
      disconnect: function () { }
    });
  }
}

// --- Save session to localStorage ---
function saveSession() {
  var minutesCompleted = modes[currentMode] / 60;

  var session = {
    date: new Date().toLocaleDateString("en-IN"),
    mode: currentMode,
    minutes: minutesCompleted,
    timestamp: new Date().toISOString()
  };

  var sessions = [];
  var data = localStorage.getItem("pomodoroSessions");
  if (data) {
    sessions = JSON.parse(data);
  }

  sessions.push(session);
  localStorage.setItem("pomodoroSessions", JSON.stringify(sessions));

  updateSessionStats();
}

// --- Update session stats display ---
function updateSessionStats() {
  var data = localStorage.getItem("pomodoroSessions");
  if (!data) return;

  var sessions = JSON.parse(data);
  var today = new Date().toLocaleDateString("en-IN");
  var todayCount = 0;
  var totalMinutes = 0;

  for (var i = 0; i < sessions.length; i++) {
    totalMinutes += sessions[i].minutes;
    if (sessions[i].date === today) {
      todayCount++;
    }
  }

  var countEl = document.getElementById("sessionCount");
  var timeEl = document.getElementById("totalFocusTime");

  if (countEl) countEl.innerText = todayCount;
  if (timeEl) timeEl.innerText = totalMinutes + " min";
}

// Initialize
updateDisplay();
updateSessionStats();
