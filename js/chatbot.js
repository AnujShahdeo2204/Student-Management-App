// Student AI Assistant Chatbot Module
const Chatbot = {
  messages: [
    {
      sender: 'bot',
      text: 'Hello! I am your Student Assistant. How can I assist you with your tasks, study schedule, or classes today?',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ],

  render() {
    const chatStream = document.getElementById('chatbot-stream');
    if (!chatStream) return;

    chatStream.innerHTML = this.messages
      .map(
        (m) => `
        <div class="chat-message ${m.sender === 'user' ? 'chat-user' : 'chat-bot'}">
          <div class="message-bubble">
            <p class="message-text">${escapeHtml(m.text)}</p>
            <span class="message-time">${m.time}</span>
          </div>
        </div>
      `
      )
      .join('');

    chatStream.scrollTop = chatStream.scrollHeight;
  },

  async sendMessage(text) {
    if (!text || !text.trim()) return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    this.messages.push({ sender: 'user', text: text.trim(), time });
    this.render();

    const input = document.getElementById('chat-input');
    const sendBtn = document.getElementById('chat-send-btn');
    if (input) input.value = '';

    // Show typing state
    this.messages.push({
      sender: 'bot',
      text: 'Thinking...',
      time,
      isTyping: true,
    });
    this.render();

    try {
      if (sendBtn) sendBtn.disabled = true;

      const baseUrl = CONFIG.getApiBaseUrl();
      const res = await fetch(`${baseUrl}/chatbot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text.trim() }),
      });

      const data = await res.json();
      // Remove typing bubble
      this.messages = this.messages.filter((m) => !m.isTyping);

      this.messages.push({
        sender: 'bot',
        text: data.reply || 'Sorry, I could not process that request.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
      this.render();
    } catch (err) {
      this.messages = this.messages.filter((m) => !m.isTyping);
      this.messages.push({
        sender: 'bot',
        text: `Error connecting to backend: ${err.message}. Make sure your backend API is running.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
      this.render();
    } finally {
      if (sendBtn) sendBtn.disabled = false;
    }
  },

  init() {
    const form = document.getElementById('chat-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = document.getElementById('chat-input');
        if (input) {
          this.sendMessage(input.value);
        }
      });
    }

    // Quick prompt suggestion pills
    document.querySelectorAll('.chat-suggestion-pill').forEach((pill) => {
      pill.addEventListener('click', (e) => {
        const prompt = e.target.textContent.replace(/^"|"$/g, '').trim();
        this.sendMessage(prompt);
      });
    });

    this.render();
  },
};

