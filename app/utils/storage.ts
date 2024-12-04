import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task, DailyProgress } from '@/types';

const TASKS_KEY = '@tasks';
const PROGRESS_KEY = '@progress';

const storage = {
  /**
   * Get tasks for a specific date
   */
  getTasks: async (date: string): Promise<Task[]> => {
    try {
      const data = await AsyncStorage.getItem(TASKS_KEY);
      const allTasks: Task[] = data ? JSON.parse(data) : [];
      return allTasks.filter(task => task.date === date);
    } catch (error) {
      console.error('Error getting tasks:', error);
      return [];
    }
  },

  /**
   * Save a new task
   */
  saveTask: async (task: Task): Promise<void> => {
    try {
      const tasks = await storage.getAllTasks();
      tasks.unshift(task);
      await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving task:', error);
    }
  },

  /**
   * Get all tasks (for progress tracking)
   */
  getAllTasks: async (): Promise<Task[]> => {
    try {
      const data = await AsyncStorage.getItem(TASKS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting all tasks:', error);
      return [];
    }
  },

  /**
   * Update a task
   */
  updateTask: async (updatedTask: Task): Promise<void> => {
    try {
      const tasks = await storage.getAllTasks();
      const updatedTasks = tasks.map(task => 
        task.id === updatedTask.id ? updatedTask : task
      );
      await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(updatedTasks));
    } catch (error) {
      console.error('Error updating task:', error);
    }
  },

  /**
   * Delete a task
   */
  deleteTask: async (id: string): Promise<void> => {
    try {
      const tasks = await storage.getAllTasks();
      const filteredTasks = tasks.filter(task => task.id !== id);
      await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(filteredTasks));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  },

  /**
   * Save daily progress
   */
  saveDailyProgress: async (progress: DailyProgress): Promise<void> => {
    try {
      const data = await AsyncStorage.getItem(PROGRESS_KEY);
      const allProgress: DailyProgress[] = data ? JSON.parse(data) : [];
      const updatedProgress = allProgress.filter(p => p.date !== progress.date);
      updatedProgress.push(progress);
      await AsyncStorage.setItem(PROGRESS_KEY, JSON.stringify(updatedProgress));
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  },

  /**
   * Get progress for a specific date
   */
  getDailyProgress: async (date: string): Promise<DailyProgress | null> => {
    try {
      const data = await AsyncStorage.getItem(PROGRESS_KEY);
      const allProgress: DailyProgress[] = data ? JSON.parse(data) : [];
      return allProgress.find(p => p.date === date) || null;
    } catch (error) {
      console.error('Error getting progress:', error);
      return null;
    }
  },

  /**
   * Get all progress data
   */
  getAllProgress: async (): Promise<DailyProgress[]> => {
    try {
      const data = await AsyncStorage.getItem(PROGRESS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting all progress:', error);
      return [];
    }
  },
};

export default storage;