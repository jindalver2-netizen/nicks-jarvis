export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

export type MemoryCategory = 
  | 'Personal' 
  | 'Business' 
  | 'People' 
  | 'Important Dates' 
  | 'Preferences' 
  | 'Ideas' 
  | 'Notes' 
  | 'Documents' 
  | 'Financial Commitments' 
  | 'Other';

export interface Task {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  due_date?: string;
  due_time?: string;
  timezone: string;
  priority: Priority;
  category: string;
  status: TaskStatus;
  completed_at?: string;
  created_at: string;
  updated_at: string;
  subtasks?: Subtask[];
}

export interface Subtask {
  id: string;
  task_id: string;
  user_id: string;
  title: string;
  completed: boolean;
  position: number;
  created_at: string;
}

export interface Reminder {
  id: string;
  user_id: string;
  task_id?: string;
  title: string;
  description?: string;
  remind_at: string;
  timezone: string;
  priority: Priority;
  status: 'pending' | 'delivered' | 'snoozed' | 'postponed' | 'dismissed' | 'failed';
  notification_channel: 'in_app' | 'push' | 'all';
  snooze_until?: string;
  delivered_at?: string;
  created_at: string;
}

export interface Memory {
  id: string;
  user_id: string;
  category: MemoryCategory;
  title: string;
  content: string;
  tags: string[];
  importance: 'low' | 'normal' | 'high' | 'critical';
  source: string;
  created_at: string;
  updated_at: string;
}

export interface UserList {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  icon: string;
  color: string;
  created_at: string;
  items?: ListItem[];
}

export interface ListItem {
  id: string;
  list_id: string;
  user_id: string;
  text: string;
  completed: boolean;
  position: number;
  created_at: string;
}

export interface AppNotification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'reminder' | 'task' | 'system' | 'briefing';
  link?: string;
  is_read: boolean;
  created_at: string;
}

export interface UserProfile {
  id: string;
  full_name: string;
  avatar_url?: string;
  timezone: string;
  language: string;
  assistant_name: string;
  briefing_time: string;
}
