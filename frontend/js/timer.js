// Focus & Pomodoro Timer Module
const Timer = {
  duration: 25 * 60, // in seconds
  timeLeft: 25 * 60,
  intervalId: null,
  isRunning: false,
  endTime: null,
  currentMode: 'pomodoro', // 'pomodoro' | 'shortBreak' | 'longBreak'

  modes: {
    pomodoro: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60,
  },

  setMode(mode) {
    if (this.isRunning) return;

    this.pause();
    this.currentMode = mode;
    this.duration = this.modes[mode] || 25 * 60;
    this.timeLeft = this.duration;
    this.updateDisplay();

    // Update active button state
    document.querySelectorAll('.timer-mode-btn').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.mode === mode);
    });
  },

  start() {
    if (this.isRunning) return;

    this.isRunning = true;
    this.endTime = Date.now() + this.timeLeft * 1000;
    this.updateControls();

    this.intervalId = setInterval(() => {
      this.syncWithClock();
      if (this.timeLeft <= 0) {
        this.completeSession();
      }
      this.updateDisplay();
    }, 1000);
  },

  pause() {
    this.syncWithClock();
    this.isRunning = false;
    this.endTime = null;
    clearInterval(this.intervalId);
    this.intervalId = null;
    this.updateControls();
  },

  reset() {
    this.pause();
    this.timeLeft = this.duration;
    this.updateDisplay();
  },

  syncWithClock() {
    if (!this.isRunning || !this.endTime) return;
    this.timeLeft = Math.max(0, Math.ceil((this.endTime - Date.now()) / 1000));
  },

  updateDisplay() {
    const minutes = Math.floor(this.timeLeft / 60);
    const seconds = this.timeLeft % 60;
    const formatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    const timerDisplay = document.getElementById('timer-time-display');
    if (timerDisplay) {
      timerDisplay.textContent = formatted;
    }

    // Update browser title during active countdown
    if (this.isRunning) {
      document.title = `(${formatted}) Student Manager`;
    } else {
      document.title = 'Student Management App';
    }
  },

  updateControls() {
    const startBtn = document.getElementById('timer-start-btn');
    const pauseBtn = document.getElementById('timer-pause-btn');

    if (startBtn && pauseBtn) {
      if (this.isRunning) {
        startBtn.classList.add('hidden');
        pauseBtn.classList.remove('hidden');
      } else {
        startBtn.classList.remove('hidden');
        pauseBtn.classList.add('hidden');
      }
    }

    document.body.classList.toggle('focus-mode', this.isRunning);
  },

  playBeep() {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, audioCtx.currentTime); // 800 Hz tone
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 1.2);
    } catch {
      // AudioContext not allowed without gesture or blocked
    }
  },

  async completeSession() {
    this.pause();
    this.playBeep();

    const minutesDone = Math.round(this.duration / 60);
    App.showToast(`🎉 Time's up! Session completed: ${minutesDone} minutes.`, 'success');

    // Only record focus (pomodoro) sessions to student history
    if (this.currentMode === 'pomodoro') {
      try {
        await Auth.apiRequest('/timer/session', {
          method: 'POST',
          body: JSON.stringify({
            duration_minutes: minutesDone,
            session_type: 'pomodoro',
          }),
        });

        if (window.Profile) Profile.load();
      } catch (err) {
        console.error('Failed to log study session:', err);
      }
    }

    this.reset();
  },

  init() {
    // Mode buttons
    document.querySelectorAll('.timer-mode-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        this.setMode(e.target.dataset.mode);
      });
    });

    // Control buttons
    const startBtn = document.getElementById('timer-start-btn');
    const pauseBtn = document.getElementById('timer-pause-btn');
    const resetBtn = document.getElementById('timer-reset-btn');

    if (startBtn) startBtn.addEventListener('click', () => this.start());
    if (pauseBtn) pauseBtn.addEventListener('click', () => this.pause());
    if (resetBtn) resetBtn.addEventListener('click', () => this.reset());

    this.updateDisplay();
  },
};
