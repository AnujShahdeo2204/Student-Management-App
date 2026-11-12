// Tasks & Todos Module
const Todos = {
  items: [],
  currentFilter: 'all',

  async load() {
    const listEl = document.getElementById('todo-list');
    if (!listEl) return;

    try {
      listEl.innerHTML = '<div class="loading-spinner">Loading tasks...</div>';
      const data = await Auth.apiRequest('/todos');
      this.items = data.todos || [];
      this.render();
    } catch (err) {
      listEl.innerHTML = `<div class="error-state">Failed to load tasks: ${err.message}</div>`;
    }

    this.renderHomePreview();
  },

  async add(title, category, priority, dueDate) {
    try {
      const data = await Auth.apiRequest('/todos', {
        method: 'POST',
        body: JSON.stringify({
          title,
          category,
          priority,
          due_date: dueDate,
        }),
      });

      this.items.unshift(data.todo);
      this.render();
      App.showToast('Task added!', 'success');
      if (window.Profile) Profile.load();
    } catch (err) {
      App.showToast(`Error: ${err.message}`, 'error');
    }
  },

  async toggle(id, completed) {
    try {
      const data = await Auth.apiRequest(`/todos/${id}/toggle`, {
        method: 'PATCH',
        body: JSON.stringify({ completed }),
      });

      const idx = this.items.findIndex((item) => item.id === id);
      if (idx !== -1) {
        this.items[idx] = data.todo;
        this.render();
        if (window.Profile) Profile.load();
      }
    } catch (err) {
      App.showToast(`Error: ${err.message}`, 'error');
    }
  },

  async delete(id) {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
      await Auth.apiRequest(`/todos/${id}`, {
        method: 'DELETE',
      });

      this.items = this.items.filter((item) => item.id !== id);
      this.render();
      App.showToast('Task deleted.', 'info');
      if (window.Profile) Profile.load();
    } catch (err) {
      App.showToast(`Error: ${err.message}`, 'error');
    }
  },

  render() {
    const listEl = document.getElementById('todo-list');
    const totalCountEl = document.getElementById('todos-total-count');
    const completedCountEl = document.getElementById('todos-completed-count');
    const progressFill = document.getElementById('todos-progress-fill');

    if (!listEl) return;

    // Filter items
    let filtered = this.items;
    if (this.currentFilter === 'active') {
      filtered = this.items.filter((item) => !item.completed);
    } else if (this.currentFilter === 'completed') {
      filtered = this.items.filter((item) => item.completed);
    }

    // Update metrics
    const total = this.items.length;
    const completed = this.items.filter((item) => item.completed).length;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

    if (totalCountEl) totalCountEl.textContent = `${total} tasks`;
    if (completedCountEl) completedCountEl.textContent = `${completed} done (${percent}%)`;
    if (progressFill) progressFill.style.width = `${percent}%`;
    this.renderHomePreview();

    if (filtered.length === 0) {
      listEl.innerHTML = `
        <div class="empty-state">
          <p class="empty-icon">📝</p>
          <p class="empty-text">No tasks found in this view.</p>
        </div>
      `;
      return;
    }

    listEl.innerHTML = filtered
      .map((item) => {
        const priorityColors = {
          high: 'badge-danger',
          medium: 'badge-warning',
          low: 'badge-info',
        };
        const badgeClass = priorityColors[item.priority] || 'badge-info';

        return `
          <div class="todo-card ${item.completed ? 'completed' : ''}" data-id="${item.id}">
            <div class="todo-main">
              <label class="custom-checkbox">
                <input type="checkbox" ${item.completed ? 'checked' : ''} onchange="Todos.toggle(${item.id}, this.checked)">
                <span class="checkmark"></span>
              </label>
              <div class="todo-details">
                <h4 class="todo-title">${escapeHtml(item.title)}</h4>
                <div class="todo-tags">
                  <span class="badge ${badgeClass}">${escapeHtml(item.priority || 'medium')}</span>
                  <span class="badge badge-category">${escapeHtml(item.category || 'General')}</span>
                  ${item.due_date ? `<span class="badge badge-date">📅 ${escapeHtml(item.due_date)}</span>` : ''}
                </div>
              </div>
            </div>
            <button class="btn-icon delete-btn" onclick="Todos.delete(${item.id})" title="Delete Task">
              🗑️
            </button>
          </div>
        `;
      })
      .join('');
  },

  renderHomePreview() {
    const preview = document.getElementById('home-task-preview');
    if (!preview) return;

    const priorityRank = { high: 3, medium: 2, low: 1 };
    const pending = this.items
      .filter((item) => !item.completed)
      .sort((a, b) => (priorityRank[b.priority] || 0) - (priorityRank[a.priority] || 0))
      .slice(0, 3);

    if (!pending.length) {
      preview.innerHTML = '<div class="home-task-item"><span class="priority-stars">✦</span><span>All caught up. Nice work!</span><span class="icon-disc">✓</span></div>';
      return;
    }

    preview.innerHTML = pending.map((item) => {
      const stars = '★'.repeat(priorityRank[item.priority] || 1);
      return `<div class="home-task-item">
        <span class="priority-stars">${stars}</span>
        <span>${escapeHtml(item.title)}</span>
        <span class="icon-disc">↗</span>
      </div>`;
    }).join('');
  },

  init() {
    const form = document.getElementById('add-todo-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const titleInput = document.getElementById('todo-title-input');
        const categoryInput = document.getElementById('todo-category-input');
        const priorityInput = document.getElementById('todo-priority-input');
        const dueDateInput = document.getElementById('todo-due-date-input');

        const title = titleInput.value.trim();
        if (!title) return;

        this.add(
          title,
          categoryInput ? categoryInput.value : 'General',
          priorityInput ? priorityInput.value : 'medium',
          dueDateInput ? dueDateInput.value : ''
        );

        titleInput.value = '';
        if (dueDateInput) dueDateInput.value = '';
      });
    }

    // Filter tab buttons
    document.querySelectorAll('.todo-filter-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.todo-filter-btn').forEach((b) => b.classList.remove('active'));
        e.target.classList.add('active');
        this.currentFilter = e.target.dataset.filter || 'all';
        this.render();
      });
    });
  },
};
