// POST /api/chatbot
async function handleChat(req, res) {
  try {
    const { message } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message is required.' });
    }

    const cleanMsg = message.trim().toLowerCase();
    let reply = '';

    if (cleanMsg.includes('hi') || cleanMsg.includes('hello') || cleanMsg.includes('hey')) {
      reply = `Hello! I'm your Student Management Assistant. I can help with study tips, scheduling advice, or keeping track of your attendance and assignments!`;
    } else if (cleanMsg.includes('exam') || cleanMsg.includes('study') || cleanMsg.includes('focus')) {
      reply = `Great students break study sessions into 25-minute Pomodoro blocks with 5-minute pauses. Also make sure to review tough subjects early in the morning when your mind is fresh!`;
    } else if (cleanMsg.includes('attendance') || cleanMsg.includes('bunk') || cleanMsg.includes('miss')) {
      reply = `Keep your attendance above 75%! You can use our Attendance Tracker tab to calculate how many classes you can afford to miss or need to attend.`;
    } else if (cleanMsg.includes('todo') || cleanMsg.includes('task') || cleanMsg.includes('homework')) {
      reply = `Prioritize high-impact assignments first. Break large tasks into subtasks and set due dates in your Tasks tab.`;
    } else {
      reply = `I'm here to support your studies! Try asking about study habits, attendance strategies, exam planning, or how to organize your timetable.`;
    }

    return res.json({
      reply,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Chatbot error:', err);
    return res.status(500).json({ error: 'Failed to process chat message.' });
  }
}

module.exports = {
  handleChat,
};

