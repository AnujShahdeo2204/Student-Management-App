// Student Profile & Statistics Module
const Profile = {
  async load() {
    const user = Auth.getUser();
    if (!user) return;

    // Display user metadata
    const nameEl = document.getElementById('profile-name');
    const emailEl = document.getElementById('profile-email');
    const avatarEl = document.getElementById('profile-avatar-initial');

    if (nameEl) nameEl.textContent = user.name || 'Student';
    if (emailEl) emailEl.textContent = user.email || '';
    if (avatarEl) {
      avatarEl.textContent = (user.name || user.email || 'S').charAt(0).toUpperCase();
    }

    // Populate current API backend URL in settings input
    const apiUrlInput = document.getElementById('api-url-input');
    if (apiUrlInput) {
      apiUrlInput.value = CONFIG.getApiBaseUrl();
    }

    // Fetch Timer Stats
    try {
      const timerData = await Auth.apiRequest('/timer/stats');
      const focusHoursEl = document.getElementById('stats-focus-hours');
      const focusSessionsEl = document.getElementById('stats-focus-sessions');

      if (focusHoursEl) focusHoursEl.textContent = `${timerData.totalHours || 0} hrs`;
      if (focusSessionsEl) focusSessionsEl.textContent = `${timerData.sessionCount || 0} sessions`;
    } catch (err) {
      console.warn('Could not load timer stats:', err);
    }

    // Task Stats
    if (window.Todos && Todos.items) {
      const completedTasks = Todos.items.filter((t) => t.completed).length;
      const totalTasks = Todos.items.length;
      const statsTasksEl = document.getElementById('stats-tasks-completed');
      if (statsTasksEl) {
        statsTasksEl.textContent = `${completedTasks} / ${totalTasks}`;
      }
    }

    // Attendance Stats
    if (window.Attendance && Attendance.subjects) {
      let attended = 0;
      let total = 0;
      Attendance.subjects.forEach((s) => {
        attended += Number(s.attended) || 0;
        total += Number(s.total) || 0;
      });
      const percent = total > 0 ? Math.round((attended / total) * 100) : 0;
      const statsAttEl = document.getElementById('stats-attendance-overall');
      if (statsAttEl) {
        statsAttEl.textContent = `${percent}%`;
      }
    }
  },

  // Export all user data as a JSON file
  async exportData() {
    try {
      App.showToast('Preparing data export...', 'info');
      const [todos, timetable, attendance, timer] = await Promise.all([
        Auth.apiRequest('/todos').catch(() => ({ todos: [] })),
        Auth.apiRequest('/timetable').catch(() => ({ timetable: [] })),
        Auth.apiRequest('/attendance').catch(() => ({ attendance: [] })),
        Auth.apiRequest('/timer/stats').catch(() => ({ sessions: [] })),
      ]);

      const backup = {
        exportedAt: new Date().toISOString(),
        user: Auth.getUser(),
        todos: todos.todos,
        timetable: timetable.timetable,
        attendance: attendance.attendance,
        timerSessions: timer.sessions,
      };

      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backup, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `student_management_backup_${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      App.showToast('Export downloaded successfully!', 'success');
    } catch (err) {
      App.showToast(`Export failed: ${err.message}`, 'error');
    }
  },

  init() {
    // Save custom backend API URL
    const saveApiBtn = document.getElementById('btn-save-api-url');
    if (saveApiBtn) {
      saveApiBtn.addEventListener('click', () => {
        const input = document.getElementById('api-url-input');
        if (input) {
          const newUrl = input.value.trim();
          CONFIG.setApiBaseUrl(newUrl);
          App.showToast('Backend API URL updated!', 'success');
          // Reload dashboard with new backend
          if (Auth.isAuthenticated()) {
            Todos.load();
            Timetable.load();
            Attendance.load();
            Profile.load();
          }
        }
      });
    }

    // Export button
    const exportBtn = document.getElementById('btn-export-data');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => this.exportData());
    }
  },
};
