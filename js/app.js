// Main Application Orchestrator
const App = {
  activeTab: 'todos',

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

    this.activeTab = tabName;

    // Update nav links
    document.querySelectorAll('.nav-link').forEach((link) => {
      link.classList.toggle('active', link.dataset.tab === tabName);
    });

    // Update view panels
    document.querySelectorAll('.view-panel').forEach((panel) => {
      panel.classList.toggle('active', panel.id === `view-${tabName}`);
    });

    // Trigger specific view updates if needed
    if (tabName === 'todos' && window.Todos) Todos.render();
    if (tabName === 'timetable' && window.Timetable) Timetable.render();
    if (tabName === 'attendance' && window.Attendance) Attendance.render();
    if (tabName === 'profile' && window.Profile) Profile.load();
  },

  // Dark / Light Theme
  initTheme() {
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const savedTheme = localStorage.getItem('student_theme') || 'dark';

    document.documentElement.setAttribute('data-theme', savedTheme);
    this.updateThemeButtonIcon(savedTheme);

    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', nextTheme);
        localStorage.setItem('student_theme', nextTheme);
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

  init() {
    // Make escapeHtml available globally
    window.escapeHtml = this.escapeHtml;

    // Theme initialization
    this.initTheme();

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
  },
};

// Start application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
