/*
  # Initial Schema for Student Management App

  1. New Tables
    - `todos`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `completed` (boolean)
      - `priority` (text)
      - `category` (text)
      - `due_date` (timestamptz, nullable)
      - `created_at` (timestamptz)
      - `user_id` (uuid, foreign key)

    - `timetable_events`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `location` (text)
      - `day_of_week` (integer)
      - `start_time` (text)
      - `end_time` (text)
      - `color` (text)
      - `created_at` (timestamptz)
      - `user_id` (uuid, foreign key)

    - `timer_sessions`
      - `id` (uuid, primary key)
      - `type` (text)
      - `duration` (integer)
      - `completed` (boolean)
      - `start_time` (timestamptz)
      - `end_time` (timestamptz, nullable)
      - `created_at` (timestamptz)
      - `user_id` (uuid, foreign key)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create todos table
CREATE TABLE IF NOT EXISTS todos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  completed boolean DEFAULT false,
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  category text DEFAULT 'academic' CHECK (category IN ('academic', 'personal', 'work', 'health', 'other')),
  due_date timestamptz,
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL
);

-- Create timetable_events table
CREATE TABLE IF NOT EXISTS timetable_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  location text DEFAULT '',
  day_of_week integer NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time text NOT NULL,
  end_time text NOT NULL,
  color text DEFAULT '#3B82F6',
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL
);

-- Create timer_sessions table
CREATE TABLE IF NOT EXISTS timer_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('focus', 'short_break', 'long_break')),
  duration integer NOT NULL,
  completed boolean DEFAULT false,
  start_time timestamptz NOT NULL,
  end_time timestamptz,
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL
);

-- Enable Row Level Security
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;
ALTER TABLE timetable_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE timer_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies for todos
CREATE POLICY "Users can view own todos"
  ON todos FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own todos"
  ON todos FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own todos"
  ON todos FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own todos"
  ON todos FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for timetable_events
CREATE POLICY "Users can view own events"
  ON timetable_events FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own events"
  ON timetable_events FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own events"
  ON timetable_events FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own events"
  ON timetable_events FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for timer_sessions
CREATE POLICY "Users can view own sessions"
  ON timer_sessions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions"
  ON timer_sessions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions"
  ON timer_sessions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own sessions"
  ON timer_sessions FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS todos_user_id_idx ON todos(user_id);
CREATE INDEX IF NOT EXISTS todos_created_at_idx ON todos(created_at DESC);
CREATE INDEX IF NOT EXISTS todos_due_date_idx ON todos(due_date);

CREATE INDEX IF NOT EXISTS timetable_events_user_id_idx ON timetable_events(user_id);
CREATE INDEX IF NOT EXISTS timetable_events_day_idx ON timetable_events(day_of_week);

CREATE INDEX IF NOT EXISTS timer_sessions_user_id_idx ON timer_sessions(user_id);
CREATE INDEX IF NOT EXISTS timer_sessions_created_at_idx ON timer_sessions(created_at DESC);