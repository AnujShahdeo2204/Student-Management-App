/*
  # Add Attendance Calculator and Chatbot Features

  1. New Tables
    - `subjects`
      - `id` (uuid, primary key)
      - `name` (text)
      - `total_classes` (integer)
      - `attended_classes` (integer)
      - `required_percentage` (integer)
      - `created_at` (timestamptz)
      - `user_id` (uuid, foreign key)

    - `attendance_records`
      - `id` (uuid, primary key)
      - `subject` (uuid, foreign key to subjects)
      - `date` (date)
      - `status` (text: present, absent, late)
      - `created_at` (timestamptz)
      - `user_id` (uuid, foreign key)

    - `chat_messages`
      - `id` (uuid, primary key)
      - `message` (text)
      - `response` (text)
      - `timestamp` (timestamptz)
      - `user_id` (uuid, foreign key)

    - `faqs`
      - `id` (uuid, primary key)
      - `question` (text)
      - `answer` (text)
      - `category` (text)
      - `keywords` (text array)

  2. Security
    - Enable RLS on all new tables
    - Add policies for authenticated users
*/

-- Create subjects table
CREATE TABLE IF NOT EXISTS subjects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  total_classes integer DEFAULT 0,
  attended_classes integer DEFAULT 0,
  required_percentage integer DEFAULT 75 CHECK (required_percentage >= 0 AND required_percentage <= 100),
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL
);

-- Create attendance_records table
CREATE TABLE IF NOT EXISTS attendance_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject uuid REFERENCES subjects(id) ON DELETE CASCADE NOT NULL,
  date date NOT NULL,
  status text NOT NULL CHECK (status IN ('present', 'absent', 'late')),
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  UNIQUE(subject, date, user_id)
);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message text NOT NULL,
  response text NOT NULL,
  timestamp timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL
);

-- Create faqs table (public data, no user_id needed)
CREATE TABLE IF NOT EXISTS faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  category text NOT NULL,
  keywords text[] DEFAULT '{}'
);

-- Enable Row Level Security
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Create policies for subjects
CREATE POLICY "Users can view own subjects"
  ON subjects FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subjects"
  ON subjects FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own subjects"
  ON subjects FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own subjects"
  ON subjects FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for attendance_records
CREATE POLICY "Users can view own attendance records"
  ON attendance_records FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own attendance records"
  ON attendance_records FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own attendance records"
  ON attendance_records FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own attendance records"
  ON attendance_records FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for chat_messages
CREATE POLICY "Users can view own chat messages"
  ON chat_messages FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own chat messages"
  ON chat_messages FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own chat messages"
  ON chat_messages FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- FAQs are public, everyone can read
CREATE POLICY "Anyone can view FAQs"
  ON faqs FOR SELECT
  TO authenticated
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS subjects_user_id_idx ON subjects(user_id);
CREATE INDEX IF NOT EXISTS subjects_name_idx ON subjects(name);

CREATE INDEX IF NOT EXISTS attendance_records_user_id_idx ON attendance_records(user_id);
CREATE INDEX IF NOT EXISTS attendance_records_subject_idx ON attendance_records(subject);
CREATE INDEX IF NOT EXISTS attendance_records_date_idx ON attendance_records(date);

CREATE INDEX IF NOT EXISTS chat_messages_user_id_idx ON chat_messages(user_id);
CREATE INDEX IF NOT EXISTS chat_messages_timestamp_idx ON chat_messages(timestamp DESC);

CREATE INDEX IF NOT EXISTS faqs_category_idx ON faqs(category);

-- Insert sample FAQs
INSERT INTO faqs (question, answer, category, keywords) VALUES
('How do I add a new task?', 'Click the "Add Task" button in the Tasks section, fill in the details like title, description, priority, and due date, then click "Add Task" to save it.', 'tasks', ARRAY['add', 'task', 'create', 'new']),
('How can I track my attendance?', 'Go to the Attendance section, add your subjects first, then use the "Mark Attendance" tab to record your daily attendance for each subject.', 'attendance', ARRAY['attendance', 'track', 'mark', 'present', 'absent']),
('What is the Pomodoro technique?', 'The Pomodoro technique involves working in focused 25-minute sessions followed by 5-minute breaks. After 4 sessions, take a longer 15-minute break. Use our Focus Timer to try it!', 'focus', ARRAY['pomodoro', 'focus', 'timer', 'technique', 'productivity']),
('How do I calculate required attendance?', 'In the Attendance section, set your required percentage for each subject. The calculator will show how many classes you need to attend or can afford to miss.', 'attendance', ARRAY['calculate', 'attendance', 'percentage', 'required']),
('What are some good study tips?', 'Try the Pomodoro technique for focus, break large tasks into smaller ones, use active recall, take regular breaks, maintain a consistent study schedule, and track your progress.', 'study', ARRAY['study', 'tips', 'advice', 'learning', 'productivity']),
('How do I set task priorities?', 'When creating or editing a task, you can set the priority to High (urgent/important), Medium (important but not urgent), or Low (nice to have). High priority tasks appear first in your list.', 'tasks', ARRAY['priority', 'urgent', 'important', 'high', 'medium', 'low']),
('Can I edit my timetable events?', 'Yes! Click on any event in your timetable to view details, then use the edit button to modify the title, time, location, description, or color.', 'timetable', ARRAY['edit', 'timetable', 'event', 'schedule', 'modify']),
('How do I improve my focus?', 'Use the Focus Timer for structured work sessions, eliminate distractions, work in a quiet environment, stay hydrated, take regular breaks, and track your progress to stay motivated.', 'focus', ARRAY['focus', 'concentration', 'improve', 'distraction', 'productivity']),
('What if I miss classes?', 'Check your attendance percentage in the Attendance section. If you''re below the required percentage, the calculator will show exactly how many classes you need to attend to get back on track.', 'attendance', ARRAY['miss', 'classes', 'below', 'requirement', 'catch up']),
('How do I delete completed tasks?', 'In the Tasks section, click the delete button (trash icon) on any task you want to remove. You can also filter to show only completed tasks and delete them in bulk.', 'tasks', ARRAY['delete', 'remove', 'completed', 'clean up']);