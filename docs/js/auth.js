// Authentication Module (Self-Made Email/Password with JWT)
const Auth = {
  TOKEN_KEY: 'student_jwt_token',
  USER_KEY: 'student_user_data',

  getToken() {
    return localStorage.getItem(this.TOKEN_KEY);
  },

  getUser() {
    const raw = localStorage.getItem(this.USER_KEY);
    try {
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  setSession(token, user) {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  },

  clearSession() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  },

  isAuthenticated() {
    return Boolean(this.getToken());
  },

  // Helper fetch wrapper that automatically attaches the Bearer token
  async apiRequest(endpoint, options = {}) {
    const baseUrl = CONFIG.getApiBaseUrl();
    const url = `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json().catch(() => ({}));

      if (response.status === 401) {
        // Token expired or invalid
        this.clearSession();
        this.renderAuthScreen();
        throw new Error(data.error || 'Session expired. Please log in again.');
      }

      if (!response.ok) {
        throw new Error(data.error || `Request failed with status ${response.status}`);
      }

      return data;
    } catch (err) {
      console.error(`API Error [${endpoint}]:`, err.message);
      throw err;
    }
  },

  // Register new student account
  async register(name, email, password) {
    const baseUrl = CONFIG.getApiBaseUrl();
    const response = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to create account.');
    }

    this.setSession(data.token, data.user);
    return data;
  },

  // Log in student with email and password
  async login(email, password) {
    const baseUrl = CONFIG.getApiBaseUrl();
    const response = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Invalid email or password.');
    }

    this.setSession(data.token, data.user);
    return data;
  },

  // Logout
  logout() {
    this.clearSession();
    this.renderAuthScreen();
    App.showToast('You have been logged out.', 'info');
  },

  // Show/Hide appropriate view depending on authentication
  renderAuthScreen() {
    const authContainer = document.getElementById('auth-container');
    const mainApp = document.getElementById('main-app');
    const userDisplay = document.getElementById('user-display-name');

    if (this.isAuthenticated()) {
      if (authContainer) authContainer.classList.add('hidden');
      if (mainApp) mainApp.classList.remove('hidden');

      const user = this.getUser();
      if (userDisplay && user) {
        userDisplay.textContent = user.name || user.email.split('@')[0];
      }

      // Load initial dashboard data
      if (window.Todos) Todos.load();
      if (window.Timetable) Timetable.load();
      if (window.Attendance) Attendance.load();
      if (window.Profile) Profile.load();
    } else {
      if (authContainer) authContainer.classList.remove('hidden');
      if (mainApp) mainApp.classList.add('hidden');
    }
  },

  // Initialize Auth event listeners
  init() {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const logoutBtn = document.getElementById('btn-logout');
    const tabLogin = document.getElementById('tab-btn-login');
    const tabRegister = document.getElementById('tab-btn-register');
    const authErrorAlert = document.getElementById('auth-error-alert');

    // Switch between Sign In and Sign Up tabs
    if (tabLogin && tabRegister) {
      tabLogin.addEventListener('click', () => {
        tabLogin.classList.add('active');
        tabRegister.classList.remove('active');
        document.getElementById('login-section').classList.remove('hidden');
        document.getElementById('register-section').classList.add('hidden');
        if (authErrorAlert) authErrorAlert.classList.add('hidden');
      });

      tabRegister.addEventListener('click', () => {
        tabRegister.classList.add('active');
        tabLogin.classList.remove('active');
        document.getElementById('register-section').classList.remove('hidden');
        document.getElementById('login-section').classList.add('hidden');
        if (authErrorAlert) authErrorAlert.classList.add('hidden');
      });
    }

    // Handle Login submission
    if (loginForm) {
      loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value;
        const submitBtn = loginForm.querySelector('button[type="submit"]');

        try {
          submitBtn.disabled = true;
          submitBtn.textContent = 'Signing in...';
          if (authErrorAlert) authErrorAlert.classList.add('hidden');

          await this.login(email, password);
          App.showToast('Welcome back!', 'success');
          this.renderAuthScreen();
        } catch (err) {
          if (authErrorAlert) {
            authErrorAlert.textContent = err.message;
            authErrorAlert.classList.remove('hidden');
          }
        } finally {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Sign In';
        }
      });
    }

    // Handle Register submission
    if (registerForm) {
      registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('register-name').value.trim();
        const email = document.getElementById('register-email').value.trim();
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm-password').value;
        const submitBtn = registerForm.querySelector('button[type="submit"]');

        if (password !== confirmPassword) {
          if (authErrorAlert) {
            authErrorAlert.textContent = 'Passwords do not match.';
            authErrorAlert.classList.remove('hidden');
          }
          return;
        }

        try {
          submitBtn.disabled = true;
          submitBtn.textContent = 'Creating account...';
          if (authErrorAlert) authErrorAlert.classList.add('hidden');

          await this.register(name, email, password);
          App.showToast('Account created successfully!', 'success');
          this.renderAuthScreen();
        } catch (err) {
          if (authErrorAlert) {
            authErrorAlert.textContent = err.message;
            authErrorAlert.classList.remove('hidden');
          }
        } finally {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Create Account';
        }
      });
    }

    // Handle Logout button
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to sign out?')) {
          this.logout();
        }
      });
    }

    // Check initial authentication
    this.renderAuthScreen();
  },
};

