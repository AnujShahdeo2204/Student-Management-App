import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { AuthForm } from "./components/auth/AuthForm";
import { Layout } from "./components/Layout";
import { TodoList } from "./components/todos/TodoList";
import { TimetableView } from "./components/timetable/TimetableView";
import { TimerView } from "./components/timer/TimerView";
import { ProfileView } from "./components/profile/ProfileView";
import { AttendanceView } from "./components/attendance/AttendanceView";
import { ChatbotView } from "./components/chatbot/ChatbotView";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <ProtectedRoute>
          <Routes>
            {/* Layout wrapper */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Navigate to="/todos" replace />} />
              <Route path="todos" element={<TodoList />} />
              <Route path="timetable" element={<TimetableView />} />
              <Route path="timer" element={<TimerView />} />
              <Route path="attendance" element={<AttendanceView />} />
              <Route path="chatbot" element={<ChatbotView />} />
              <Route path="profile" element={<ProfileView />} />
            </Route>
          </Routes>
        </ProtectedRoute>
      </Router>
    </AuthProvider>
  );
}

export default App;
