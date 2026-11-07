// Weekly Timetable Module
const Timetable = {
  slots: [],
  selectedDay: 'Monday',
  days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],

  async load() {
    const container = document.getElementById('timetable-slots');
    if (!container) return;

    try {
      container.innerHTML = '<div class="loading-spinner">Loading timetable...</div>';
      const data = await Auth.apiRequest('/timetable');
      this.slots = data.timetable || [];
      this.render();
    } catch (err) {
      container.innerHTML = `<div class="error-state">Failed to load timetable: ${err.message}</div>`;
    }
  },

  async add(day, subject, timeStart, timeEnd, room, color) {
    try {
      const data = await Auth.apiRequest('/timetable', {
        method: 'POST',
        body: JSON.stringify({
          day,
          subject,
          time_start: timeStart,
          time_end: timeEnd,
          room,
          color,
        }),
      });

      this.slots.push(data.slot);
      this.render();
      App.showToast('Class added to timetable!', 'success');
    } catch (err) {
      App.showToast(`Error: ${err.message}`, 'error');
    }
  },

  async delete(id) {
    if (!confirm('Remove this class from timetable?')) return;

    try {
      await Auth.apiRequest(`/timetable/${id}`, {
        method: 'DELETE',
      });

      this.slots = this.slots.filter((s) => s.id !== id);
      this.render();
      App.showToast('Class removed.', 'info');
    } catch (err) {
      App.showToast(`Error: ${err.message}`, 'error');
    }
  },

  render() {
    const container = document.getElementById('timetable-slots');
    const dayHeading = document.getElementById('timetable-current-day');
    if (!container) return;

    if (dayHeading) {
      dayHeading.textContent = `${this.selectedDay}'s Classes`;
    }

    const filtered = this.slots
      .filter((s) => s.day === this.selectedDay)
      .sort((a, b) => a.time_start.localeCompare(b.time_start));

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <p class="empty-icon">🏖️</p>
          <p class="empty-text">No classes scheduled for ${this.selectedDay}. Enjoy your free time or add one below!</p>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered
      .map(
        (slot) => `
        <div class="timetable-card color-${slot.color || 'indigo'}">
          <div class="timetable-time">
            <span class="time-range">⏰ ${escapeHtml(slot.time_start)} - ${escapeHtml(slot.time_end)}</span>
            ${slot.room ? `<span class="room-pill">📍 ${escapeHtml(slot.room)}</span>` : ''}
          </div>
          <div class="timetable-info">
            <h4 class="subject-title">${escapeHtml(slot.subject)}</h4>
          </div>
          <button class="btn-icon delete-btn" onclick="Timetable.delete(${slot.id})" title="Remove">
            🗑️
          </button>
        </div>
      `
      )
      .join('');
  },

  init() {
    // Render Day selector buttons
    const daySelector = document.getElementById('timetable-day-selector');
    if (daySelector) {
      daySelector.innerHTML = this.days
        .map(
          (d) => `
          <button class="day-tab-btn ${d === this.selectedDay ? 'active' : ''}" data-day="${d}">
            ${d}
          </button>
        `
        )
        .join('');

      daySelector.querySelectorAll('.day-tab-btn').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          daySelector.querySelectorAll('.day-tab-btn').forEach((b) => b.classList.remove('active'));
          e.target.classList.add('active');
          this.selectedDay = e.target.dataset.day;
          this.render();
        });
      });
    }

    // Add slot form
    const form = document.getElementById('add-timetable-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const subject = document.getElementById('timetable-subject').value.trim();
        const day = document.getElementById('timetable-day-select').value;
        const timeStart = document.getElementById('timetable-start-time').value;
        const timeEnd = document.getElementById('timetable-end-time').value;
        const room = document.getElementById('timetable-room').value.trim();
        const color = document.getElementById('timetable-color').value;

        if (!subject || !timeStart || !timeEnd) {
          App.showToast('Please fill in subject and both times.', 'error');
          return;
        }

        this.add(day, subject, timeStart, timeEnd, room, color);

        document.getElementById('timetable-subject').value = '';
        document.getElementById('timetable-room').value = '';
      });
    }
  },
};
