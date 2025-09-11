# Student Management App

A comprehensive React web application designed to help students organize their academic life with powerful productivity tools.

## 🎯 Features

### Todo Management
- Create, edit, and delete tasks with priorities and categories
- Due date tracking with overdue notifications
- Advanced filtering by status, category, and search
- Progress statistics and completion tracking
- Clean, intuitive interface with smooth interactions

### Timetable Organizer
- Weekly schedule management with day-by-day view
- Color-coded events with customizable colors
- Time conflict detection
- Location and description support
- Easy event creation and editing

### Focus Timer (Pomodoro)
- Customizable focus sessions (default 25 minutes)
- Short breaks (default 5 minutes) and long breaks (default 15 minutes)
- Session history tracking with completion statistics
- Visual progress indicators with animated timer
- Focus mode with motivational interface

### Authentication & Backend
- Secure authentication with Supabase Auth
- Google Sign-In integration
- Email/password authentication
- Real-time data synchronization
- User-specific data security with Row Level Security

## 🎨 Design Features

- **Modern UI/UX** with clean, professional design
- **Responsive design** that works on all devices
- **Smooth animations** and micro-interactions
- **Intuitive navigation** with sidebar layout
- **Consistent color scheme** with indigo primary colors
- **Accessible design** with proper contrast and focus states

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Supabase account

### Setup Instructions

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd student-management-app
   npm install
   ```

2. **Set up Supabase**
   - Create a new Supabase project at [supabase.com](https://supabase.com)
   - Go to Settings > API to get your project URL and anon key
   - Copy `.env.example` to `.env` and fill in your Supabase credentials:
     ```
     VITE_SUPABASE_URL=your-supabase-project-url
     VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
     ```

3. **Set up Database**
   - In your Supabase dashboard, go to SQL Editor
   - Run the migration file `supabase/migrations/001_initial_schema.sql`
   - This will create all necessary tables and security policies

4. **Configure Authentication**
   - In Supabase dashboard, go to Authentication > Settings
   - Enable Google provider if you want Google Sign-In
   - Add your site URL to the allowed redirect URLs

5. **Run the Application**
   ```bash
   npm run dev
   ```

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── auth/            # Authentication components
│   ├── todos/           # Todo management components
│   ├── timetable/       # Timetable components
│   ├── timer/           # Timer components
│   └── profile/         # Profile components
├── contexts/            # React contexts
├── hooks/               # Custom React hooks
├── lib/                 # Utilities and configurations
└── App.tsx             # Main application component
```

## 🔧 Key Technologies

- **React 18** with TypeScript for type safety
- **Tailwind CSS** for styling and responsive design
- **Supabase** for backend services (database, auth, real-time)
- **React Router** for client-side routing
- **Lucide React** for beautiful icons
- **Date-fns** for date manipulation

## 🔒 Security Features

- **Row Level Security (RLS)** ensures users can only access their own data
- **JWT-based authentication** with secure token handling
- **Input validation** and sanitization
- **HTTPS-only** in production
- **Secure password requirements**

## 📱 Responsive Design

The app is fully responsive and works great on:
- Desktop computers (1024px+)
- Tablets (768px - 1023px)
- Mobile phones (320px - 767px)

## 🎯 Usage Tips

### Todo Management
- Use priorities to organize tasks by importance
- Set due dates to stay on track
- Use categories to group related tasks
- Use the search function to quickly find specific tasks

### Timetable
- Color-code different types of events (classes, meetings, etc.)
- Add locations to remember where events take place
- Use descriptions for additional notes

### Focus Timer
- Start with default 25-minute focus sessions
- Take short breaks between sessions
- Take a long break after every 4 focus sessions
- Adjust timer settings to match your preferences

## 🚀 Deployment

The app can be deployed to any static hosting service:

1. **Build the app**
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder** to your hosting service:
   - Vercel
   - Netlify
   - GitHub Pages
   - Any static hosting provider

3. **Configure environment variables** on your hosting platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues:
1. Check the browser console for error messages
2. Verify your Supabase configuration
3. Ensure all environment variables are set correctly
4. Check that the database migrations have been run


little issue with dark mode and data export 
will be fixed in further update 

---

**Happy Learning! 🎓**