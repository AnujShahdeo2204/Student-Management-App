// Main Application Orchestrator
const App = {
  activeTab: 'home',
  tabTransitionId: 0,

  // Escape HTML to prevent XSS in dynamic rendering
  escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  },

  // Toast notification system
  showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('fade-out');
      setTimeout(() => toast.remove(), 400);
    }, 3000);
  },

  // Tab navigation
  switchTab(tabName) {
    if (Timer.isRunning && tabName !== 'timer') {
      this.showToast('Focus mode is active. Pause the timer to switch tabs.', 'warning');
      return;
    }

    if (this.activeTab === tabName) return;

    this.activeTab = tabName;
    const transitionId = ++this.tabTransitionId;

    const links = Array.from(document.querySelectorAll('.nav-link'));
    const nextIndex = links.findIndex((link) => link.dataset.tab === tabName);

    // Update nav links
    document.querySelectorAll('.nav-link').forEach((link) => {
      link.classList.toggle('active', link.dataset.tab === tabName);
    });

    const nextPanel = document.getElementById(`view-${tabName}`);
    if (!nextPanel) return;

    // Keep exactly one panel visible. This avoids two animated panels
    // competing for layout space when users switch tabs quickly.
    document.querySelectorAll('.view-panel').forEach((panel) => {
      panel.classList.toggle('active', panel === nextPanel);
      panel.classList.remove('panel-enter', 'panel-exit');
    });
    void nextPanel.offsetWidth;
    nextPanel.classList.add('panel-enter');
    setTimeout(() => {
      if (transitionId === this.tabTransitionId) nextPanel.classList.remove('panel-enter');
    }, 360);

    // Trigger specific view updates if needed
    if (tabName === 'todos' && window.Todos) Todos.render();
    if (tabName === 'timetable' && window.Timetable) Timetable.render();
    if (tabName === 'attendance' && window.Attendance) Attendance.render();
    if (tabName === 'profile' && window.Profile) Profile.load();
    this.updateHomeSummary();
  },

  // Dark / Light Theme
  initTheme() {
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    let savedTheme = 'light';
    try {
      savedTheme = localStorage.getItem('student_theme') || 'light';
    } catch (error) {
      console.warn('Theme preference could not be loaded.', error);
    }

    document.documentElement.setAttribute('data-theme', savedTheme);
    this.updateThemeButtonIcon(savedTheme);

    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', nextTheme);
        try {
          localStorage.setItem('student_theme', nextTheme);
        } catch (error) {
          console.warn('Theme preference could not be saved.', error);
        }
        this.updateThemeButtonIcon(nextTheme);
      });
    }
  },

  updateThemeButtonIcon(theme) {
    const btn = document.getElementById('theme-toggle-btn');
    if (btn) {
      btn.innerHTML = theme === 'dark' ? '☀️' : '🌙';
      btn.title = `Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`;
    }
  },

  updateHomeSummary() {
    const completedText = document.getElementById('todos-completed-count')?.textContent || '0 done (0%)';
    const totalText = document.getElementById('todos-total-count')?.textContent || '0 tasks';
    const attendance = document.getElementById('overall-attendance-avg')?.textContent || '0%';
    const totalClasses = document.querySelectorAll('#timetable-slots .timetable-card').length;
    const pending = Math.max(0, Number.parseInt(totalText, 10) - Number.parseInt(completedText, 10));
    const percentMatch = completedText.match(/\((\d+)%\)/);
    const percent = percentMatch ? Number(percentMatch[1]) : 0;
    const setText = (id, value) => {
      const element = document.getElementById(id);
      if (element) element.textContent = value;
    };

    setText('home-pending-stat', Number.isNaN(pending) ? 0 : pending);
    setText('home-attendance-stat', attendance);
    setText('home-classes-stat', totalClasses);
    setText('home-progress-value', `${percent}%`);
    const ring = document.getElementById('home-progress-ring');
    if (ring) ring.style.strokeDashoffset = String(100 - percent);
  },

  init() {
    // Make escapeHtml available globally
    window.escapeHtml = this.escapeHtml;

    // Theme initialization
    this.initTheme();
    document.querySelectorAll('[data-tab-target]').forEach((button) => {
      button.addEventListener('click', () => this.switchTab(button.dataset.tabTarget));
    });

    document.querySelectorAll('.tilt-card').forEach((card) => {
      card.addEventListener('pointermove', (event) => {
        const bounds = card.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - 0.5;
        const y = (event.clientY - bounds.top) / bounds.height - 0.5;
        card.style.setProperty('--tilt-x', `${y * -4}deg`);
        card.style.setProperty('--tilt-y', `${x * 5}deg`);
      });
      card.addEventListener('pointerleave', () => {
        card.style.setProperty('--tilt-x', '0deg');
        card.style.setProperty('--tilt-y', '0deg');
      });
    });

    // Nav link click events
    document.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const tab = link.dataset.tab;
        if (tab) this.switchTab(tab);
      });

      document.addEventListener('visibilitychange', () => {
        if (Timer.isRunning) Timer.syncWithClock();
      });
    });

    // Initialize modules
    Auth.init();
    Todos.init();
    Timetable.init();
    Attendance.init();
    Timer.init();
    Chatbot.init();
    Profile.init();
    this.updateHomeSummary();
  },
};

// Start application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
