export const localSeedUser = {
  id: '61c23165-73fe-443e-bef0-99366e2a2fab',
  email: 'tech2004world@gmail.com',
  created_at: '2025-09-13T02:35:18.346Z',
  user_metadata: {
    full_name: 'tech world',
    name: 'tech world',
    email: 'tech2004world@gmail.com',
    avatar_url:
      'https://lh3.googleusercontent.com/a/ACg8ocJyKuBNIiTpijsTJ0hex1d5idkgly-ZDM0VGGA9BJlCMqU3xA=s96-c',
  },
  app_metadata: {
    provider: 'google',
    providers: ['google'],
  },
}

export const localSeedData = {
  todos: [
    {
      id: '1f0e1d53-8570-4ef7-b558-63d9c7e47a29',
      title: 'sdasdasddasd',
      description: 'sasdas',
      completed: false,
      priority: 'medium',
      category: 'personal',
      due_date: '2025-09-17T00:00:00.000Z',
      created_at: '2025-09-17T09:16:50.424Z',
      user_id: '61c23165-73fe-443e-bef0-99366e2a2fab',
    },
  ],
  timetable_events: [
    {
      id: '508dd110-f524-4075-9a13-0996d8bbd41d',
      title: 'fasfasf',
      description: 'afdd',
      location: 'sdfsdf',
      day_of_week: 2,
      start_time: '09:00',
      end_time: '10:00',
      color: '#3B82F6',
      created_at: '2025-09-17T09:27:48.375Z',
      user_id: '61c23165-73fe-443e-bef0-99366e2a2fab',
    },
    {
      id: '36ca7532-320d-443f-9187-336e57716fe7',
      title: 'adcadscacs',
      description: 'asasd',
      location: 'sadasd',
      day_of_week: 1,
      start_time: '09:00',
      end_time: '10:00',
      color: '#3B82F6',
      created_at: '2025-09-17T09:29:10.806Z',
      user_id: '61c23165-73fe-443e-bef0-99366e2a2fab',
    },
  ],
  timer_sessions: [],
  subjects: [],
  attendance_records: [],
  chat_messages: [
    {
      id: '917ddb56-abd1-4ea4-afb9-bebcef250ff3',
      message: 'How many tasks do I have?',
      response:
        'You have 0 pending tasks and 0 completed tasks. Great job staying on top of your tasks! 🎉',
      timestamp: '2025-09-14T06:51:32.915Z',
      user_id: '61c23165-73fe-443e-bef0-99366e2a2fab',
    },
  ],
  faqs: [
    {
      id: '617f6068-37bb-4cc8-8e19-278180dd0e0d',
      question: 'How do I add a new task?',
      answer:
        'Click the "Add Task" button in the Tasks section, fill in the details like title, description, priority, and due date, then click "Add Task" to save it.',
      category: 'tasks',
      keywords: ['add', 'task', 'create', 'new'],
    },
    {
      id: 'f9ade02c-5b74-4cdb-975f-ed10ea794d3d',
      question: 'How can I track my attendance?',
      answer:
        'Go to the Attendance section, add your subjects first, then use the "Mark Attendance" tab to record your daily attendance for each subject.',
      category: 'attendance',
      keywords: ['attendance', 'track', 'mark', 'present', 'absent'],
    },
    {
      id: '8efb70a3-8d9a-4a36-9da8-d864c345ff12',
      question: 'What is the Pomodoro technique?',
      answer:
        'The Pomodoro technique involves working in focused 25-minute sessions followed by 5-minute breaks. After 4 sessions, take a longer 15-minute break. Use our Focus Timer to try it!',
      category: 'focus',
      keywords: ['pomodoro', 'focus', 'timer', 'technique', 'productivity'],
    },
    {
      id: '48943c2e-1fdf-41c9-898e-f4beb05f70a8',
      question: 'How do I calculate required attendance?',
      answer:
        'In the Attendance section, set your required percentage for each subject. The calculator will show how many classes you need to attend or can afford to miss.',
      category: 'attendance',
      keywords: ['calculate', 'attendance', 'percentage', 'required'],
    },
    {
      id: 'f2465da5-41dd-4374-bdc6-c631a4233938',
      question: 'What are some good study tips?',
      answer:
        'Try the Pomodoro technique for focus, break large tasks into smaller ones, use active recall, take regular breaks, maintain a consistent study schedule, and track your progress.',
      category: 'study',
      keywords: ['study', 'tips', 'advice', 'learning', 'productivity'],
    },
    {
      id: 'b0908072-8a69-45a0-a120-947b34e257ee',
      question: 'How do I set task priorities?',
      answer:
        'When creating or editing a task, you can set the priority to High (urgent/important), Medium (important but not urgent), or Low (nice to have). High priority tasks appear first in your list.',
      category: 'tasks',
      keywords: ['priority', 'urgent', 'important', 'high', 'medium', 'low'],
    },
    {
      id: '77ac1d1c-09dd-46a0-874d-415dab965f86',
      question: 'Can I edit my timetable events?',
      answer:
        'Yes! Click on any event in your timetable to view details, then use the edit button to modify the title, time, location, description, or color.',
      category: 'timetable',
      keywords: ['edit', 'timetable', 'event', 'schedule', 'modify'],
    },
    {
      id: '02e88e76-a10b-4e25-a876-69a8cc7b491c',
      question: 'How do I improve my focus?',
      answer:
        'Use the Focus Timer for structured work sessions, eliminate distractions, work in a quiet environment, stay hydrated, take regular breaks, and track your progress to stay motivated.',
      category: 'focus',
      keywords: ['focus', 'concentration', 'improve', 'distraction', 'productivity'],
    },
    {
      id: 'df6cd071-0529-4078-b21f-80d2b314915a',
      question: 'What if I miss classes?',
      answer:
        'Check your attendance percentage in the Attendance section. If you\'re below the required percentage, the calculator will show exactly how many classes you need to attend to get back on track.',
      category: 'attendance',
      keywords: ['miss', 'classes', 'below', 'requirement', 'catch up'],
    },
    {
      id: '0fe8d139-0b96-49e7-b323-660b58900135',
      question: 'How do I delete completed tasks?',
      answer:
        'In the Tasks section, click the delete button (trash icon) on any task you want to remove. You can also filter to show only completed tasks and delete them in bulk.',
      category: 'tasks',
      keywords: ['delete', 'remove', 'completed', 'clean up'],
    },
  ],
}