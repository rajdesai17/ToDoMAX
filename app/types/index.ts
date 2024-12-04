// Common types used across the app
export interface TaskMedia {
  type: 'image' | 'link';
  url: string;
  thumbnail?: string;
  title?: string;
}

export interface Task {
  id: string;
  title: string;
  isCompleted: boolean;
  date: string;
  postponedCount: number;
  media?: TaskMedia;
}

export interface DailyProgress {
  date: string;
  completedTasks: number;
  totalTasks: number;
  progressPercentage: number;
}

const types = {
  Task: 'Task' as const,
  DailyProgress: 'DailyProgress' as const,
};

export default types;