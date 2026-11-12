// Main Application Orchestrator
const App = {
  activeTab: 'todos',
  threeScene: null,

  initThreeBackground() {
    const canvas = document.getElementById('three-background');
    if (!canvas || !window.THREE) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 100);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.position.z = 8;

    const geometry = new THREE.IcosahedronGeometry(2.8, 1);
    const material = new THREE.MeshBasicMaterial({
      color: 0x7a8466,
      wireframe: true,
      transparent: true,
      opacity: 0.18,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(3.2, 0.6, -2);
    scene.add(mesh);

    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(180 * 3);
    for (let index = 0; index < positions.length; index += 3) {
      positions[index] = (Math.random() - 0.5) * 14;
      positions[index + 1] = (Math.random() - 0.5) * 10;
      positions[index + 2] = (Math.random() - 0.5) * 8;
    }
    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    scene.add(new THREE.Points(
      particles,
      new THREE.PointsMaterial({ color: 0xd7c5a6, size: 0.035, transparent: true, opacity: 0.75 }),
    ));

    const animate = () => {
      mesh.rotation.x += 0.0015;
      mesh.rotation.y += 0.0025;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    const resize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', resize);
    this.threeScene = { renderer, resize };
    animate();
  },

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

    const links = Array.from(document.querySelectorAll('.nav-link'));
    const currentIndex = links.findIndex((link) => link.classList.contains('active'));
    const nextIndex = links.findIndex((link) => link.dataset.tab === tabName);
    const direction = nextIndex >= currentIndex ? 1 : -1;

    // Update nav links
    document.querySelectorAll('.nav-link').forEach((link) => {
      link.classList.toggle('active', link.dataset.tab === tabName);
    });

    const currentPanel = document.querySelector('.view-panel.active');
    const nextPanel = document.getElementById(`view-${tabName}`);

    // Update view panels with a directional 3D card transition.
    document.querySelectorAll('.view-panel').forEach((panel) => {
      if (panel === currentPanel && panel !== nextPanel) {
        panel.style.setProperty('--tab-direction', direction);
        panel.classList.add('panel-exit');
        setTimeout(() => {
          panel.classList.remove('active', 'panel-exit');
          panel.style.removeProperty('--tab-direction');
        }, 420);
      }
    });
    if (nextPanel) {
      nextPanel.style.setProperty('--tab-direction', direction);
      nextPanel.classList.remove('panel-exit');
      nextPanel.classList.add('active', 'panel-enter');
      setTimeout(() => {
        nextPanel.classList.remove('panel-enter');
        nextPanel.style.removeProperty('--tab-direction');
      }, 520);
    }

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
    this.initThreeBackground();

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
