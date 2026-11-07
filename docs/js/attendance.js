// Attendance Tracker Module
const Attendance = {
  subjects: [],

  async load() {
    const listEl = document.getElementById('attendance-list');
    if (!listEl) return;

    try {
      listEl.innerHTML = '<div class="loading-spinner">Loading attendance...</div>';
      const data = await Auth.apiRequest('/attendance');
      this.subjects = data.attendance || [];
      this.render();
    } catch (err) {
      listEl.innerHTML = `<div class="error-state">Failed to load attendance: ${err.message}</div>`;
    }
  },

  async addSubject(subject, attended, total, target) {
    try {
      const data = await Auth.apiRequest('/attendance', {
        method: 'POST',
        body: JSON.stringify({
          subject,
          attended,
          total,
          target_percentage: target,
        }),
      });

      this.subjects.push(data.item);
      this.render();
      App.showToast('Subject added!', 'success');
      if (window.Profile) Profile.load();
    } catch (err) {
      App.showToast(`Error: ${err.message}`, 'error');
    }
  },

  async record(id, action) {
    try {
      const data = await Auth.apiRequest(`/attendance/${id}/record`, {
        method: 'PATCH',
        body: JSON.stringify({ action }),
      });

      const idx = this.subjects.findIndex((s) => s.id === id);
      if (idx !== -1) {
        this.subjects[idx] = data.item;
        this.render();
        if (window.Profile) Profile.load();
      }
    } catch (err) {
      App.showToast(`Error: ${err.message}`, 'error');
    }
  },

  async delete(id) {
    if (!confirm('Are you sure you want to delete this subject?')) return;

    try {
      await Auth.apiRequest(`/attendance/${id}`, {
        method: 'DELETE',
      });

      this.subjects = this.subjects.filter((s) => s.id !== id);
      this.render();
      App.showToast('Subject removed.', 'info');
      if (window.Profile) Profile.load();
    } catch (err) {
      App.showToast(`Error: ${err.message}`, 'error');
    }
  },

  calculateAdvice(attended, total, targetPercent = 75) {
    if (total === 0) {
      return { status: 'neutral', message: 'No classes held yet.' };
    }

    const currentPercent = (attended / total) * 100;

    if (currentPercent >= targetPercent) {
      // Classes student can safely miss: Math.floor((attended - (targetPercent/100 * total)) / (targetPercent/100))
      const safeToMiss = Math.floor((100 * attended - targetPercent * total) / targetPercent);
      return {
        status: 'safe',
        message:
          safeToMiss > 0
            ? `🎉 Safe! You can miss the next ${safeToMiss} class${safeToMiss > 1 ? 'es' : ''} safely.`
            : `✅ On track! Do not miss the next class to stay above ${targetPercent}%.`,
      };
    } else {
      // Classes student must attend consecutively: Math.ceil(((targetPercent/100 * total) - attended) / (1 - targetPercent/100))
      const mustAttend = Math.ceil((targetPercent * total - 100 * attended) / (100 - targetPercent));
      return {
        status: 'danger',
        message: `⚠️ Below ${targetPercent}%! You must attend the next ${mustAttend} class${mustAttend > 1 ? 'es' : ''} in a row.`,
      };
    }
  },

  render() {
    const listEl = document.getElementById('attendance-list');
    const overallAvgEl = document.getElementById('overall-attendance-avg');
    const overallSummaryEl = document.getElementById('overall-attendance-summary');

    if (!listEl) return;

    if (this.subjects.length === 0) {
      if (overallAvgEl) overallAvgEl.textContent = '0%';
      if (overallSummaryEl) overallSummaryEl.textContent = '0 attended / 0 total';
      listEl.innerHTML = `
        <div class="empty-state">
          <p class="empty-icon">📊</p>
          <p class="empty-text">No subjects added yet. Add your subjects below to start tracking your attendance!</p>
        </div>
      `;
      return;
    }

    let grandAttended = 0;
    let grandTotal = 0;

    const cardsHtml = this.subjects
      .map((item) => {
        const attended = Number(item.attended) || 0;
        const total = Number(item.total) || 0;
        const target = Number(item.target_percentage) || 75;

        grandAttended += attended;
        grandTotal += total;

        const percent = total > 0 ? Math.round((attended / total) * 100) : 0;
        const advice = this.calculateAdvice(attended, total, target);

        let badgeClass = 'badge-success';
        if (total > 0 && percent < target) {
          badgeClass = 'badge-danger';
        } else if (total > 0 && percent === target) {
          badgeClass = 'badge-warning';
        }

        return `
          <div class="attendance-card">
            <div class="attendance-card-header">
              <div>
                <h4 class="subject-title">${escapeHtml(item.subject)}</h4>
                <span class="target-label">Target: ${target}%</span>
              </div>
              <div class="attendance-score">
                <span class="attendance-percent ${badgeClass}">${percent}%</span>
              </div>
            </div>

            <div class="attendance-counter">
              <span>Attended: <strong>${attended}</strong> / <strong>${total}</strong> classes</span>
            </div>

            <div class="attendance-progress-bar">
              <div class="attendance-progress-fill ${percent < target && total > 0 ? 'bg-danger' : 'bg-success'}" style="width: ${Math.min(percent, 100)}%"></div>
            </div>

            <div class="attendance-advice ${advice.status}">
              ${escapeHtml(advice.message)}
            </div>

            <div class="attendance-actions">
              <button class="btn btn-sm btn-success" onclick="Attendance.record(${item.id}, 'present')">
                + Present
              </button>
              <button class="btn btn-sm btn-danger" onclick="Attendance.record(${item.id}, 'absent')">
                + Absent
              </button>
              <button class="btn btn-sm btn-outline" onclick="Attendance.record(${item.id}, 'reset')" title="Reset Counts">
                ↺ Reset
              </button>
              <button class="btn-icon delete-btn" onclick="Attendance.delete(${item.id})" title="Delete Subject">
                🗑️
              </button>
            </div>
          </div>
        `;
      })
      .join('');

    listEl.innerHTML = cardsHtml;

    const overallPercent = grandTotal > 0 ? Math.round((grandAttended / grandTotal) * 100) : 0;
    if (overallAvgEl) overallAvgEl.textContent = `${overallPercent}%`;
    if (overallSummaryEl) overallSummaryEl.textContent = `${grandAttended} attended / ${grandTotal} total lectures`;
  },

  init() {
    const form = document.getElementById('add-subject-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const subjectInput = document.getElementById('attendance-subject-input');
        const attendedInput = document.getElementById('attendance-attended-input');
        const totalInput = document.getElementById('attendance-total-input');
        const targetInput = document.getElementById('attendance-target-input');

        const subject = subjectInput.value.trim();
        if (!subject) return;

        const attended = Number(attendedInput.value) || 0;
        const total = Number(totalInput.value) || 0;
        const target = Number(targetInput.value) || 75;

        if (attended > total) {
          App.showToast('Attended classes cannot be greater than total classes.', 'error');
          return;
        }

        this.addSubject(subject, attended, total, target);

        subjectInput.value = '';
        attendedInput.value = '0';
        totalInput.value = '0';
      });
    }
  },
};
