import { Feather } from '@expo/vector-icons';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import ConfirmDialog from '@/components/ConfirmDialog';
import TaskEditor from '@/components/TaskEditor';
import TaskMediaPreview from '@/components/TaskMediaPreview';
import ThemedText from '@/components/ThemedText';
import ThemedView from '@/components/ThemedView';
import { Task } from '@/types';
import storage from '@/utils/storage';

export default function IndexScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [showEditor, setShowEditor] = useState(false);
  const [postponeTask, setPostponeTask] = useState<Task | undefined>();
  const insets = useSafeAreaInsets();

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const loadedTasks = await storage.getTasks(today);
      setTasks(loadedTasks);
      updateProgress(loadedTasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProgress = (currentTasks: Task[]) => {
    if (currentTasks.length === 0) {
      setProgress(0);
      return;
    }
    const completed = currentTasks.filter(task => task.isCompleted).length;
    const percentage = Math.round((completed / currentTasks.length) * 100);
    setProgress(percentage);

    storage.saveDailyProgress({
      date: today,
      completedTasks: completed,
      totalTasks: currentTasks.length,
      progressPercentage: percentage,
    });
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    await loadTasks();
    setIsRefreshing(false);
  };

  const handleSaveTask = async (taskData: Partial<Task>) => {
    if (editingTask) {
      // Edit existing task
      const updatedTask = { ...editingTask, ...taskData };
      await storage.updateTask(updatedTask);
      setTasks(prev => prev.map(t => t.id === editingTask.id ? updatedTask : t));
    } else {
      // Add new task
      const newTask: Task = {
        id: Date.now().toString(),
        title: taskData.title!,
        isCompleted: false,
        date: today,
        postponedCount: 0,
        media: taskData.media,
      };
      await storage.saveTask(newTask);
      setTasks(prev => [newTask, ...prev]);
    }
    setShowEditor(false);
    setEditingTask(undefined);
  };

  const toggleTask = async (task: Task) => {
    const updatedTask = { ...task, isCompleted: !task.isCompleted };
    setTasks(prev => prev.map(t => t.id === task.id ? updatedTask : t));
    updateProgress(tasks.map(t => t.id === task.id ? updatedTask : t));
    await storage.updateTask(updatedTask);
  };

  const handlePostponeConfirm = async () => {
    if (!postponeTask) return;

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    const updatedTask = {
      ...postponeTask,
      date: tomorrowStr,
      postponedCount: postponeTask.postponedCount + 1,
    };

    setTasks(prev => prev.filter(t => t.id !== postponeTask.id));
    updateProgress(tasks.filter(t => t.id !== postponeTask.id));
    await storage.updateTask(updatedTask);
    setPostponeTask(undefined);
  };

  const deleteTask = async (task: Task) => {
    setTasks(prev => prev.filter(t => t.id !== task.id));
    updateProgress(tasks.filter(t => t.id !== task.id));
    await storage.deleteTask(task.id);
  };

  const renderItem = useCallback(({ item }: { item: Task }) => (
    <View style={styles.taskItem}>
      <TouchableOpacity
        style={styles.checkbox}
        onPress={() => toggleTask(item)}
      >
        {item.isCompleted && (
          <Feather name="check" size={18} color="#0a7ea4" />
        )}
      </TouchableOpacity>

      <View style={styles.taskContent}>
        <ThemedText style={[styles.taskText, item.isCompleted && styles.completedText]}>
          {item.title}
        </ThemedText>
        {item.media && <TaskMediaPreview media={item.media} small />}
        {item.postponedCount > 0 && (
          <ThemedText style={styles.postponeCount}>
            Postponed {item.postponedCount} times
          </ThemedText>
        )}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity 
          onPress={() => {
            setEditingTask(item);
            setShowEditor(true);
          }}
          style={styles.actionButton}
        >
          <Feather name="edit-2" size={18} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => setPostponeTask(item)}
          style={styles.actionButton}
        >
          <Feather name="arrow-right" size={18} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => deleteTask(item)}
          style={styles.actionButton}
        >
          <Feather name="trash-2" size={18} color="#ff4444" />
        </TouchableOpacity>
      </View>
    </View>
  ), []);

  if (isLoading) {
    return (
      <ThemedView style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#0a7ea4" />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <ThemedText type="title">Daily Tasks</ThemedText>
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
          <ThemedText style={styles.progressText}>{progress}%</ThemedText>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => {
          setEditingTask(undefined);
          setShowEditor(true);
        }}
      >
        <Feather name="plus" size={24} color="#fff" />
        <ThemedText style={styles.addButtonText}>Add New Task</ThemedText>
      </TouchableOpacity>

      <FlatList
        data={tasks}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        style={styles.list}
        contentContainerStyle={[
          styles.listContent,
          tasks.length === 0 && styles.emptyList
        ]}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <ThemedText style={styles.emptyText}>No tasks for today</ThemedText>
            <ThemedText style={styles.emptySubText}>Add your first task above!</ThemedText>
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={['#0a7ea4']}
            tintColor="#0a7ea4"
          />
        }
      />

      <TaskEditor
        visible={showEditor}
        task={editingTask}
        onSave={handleSaveTask}
        onCancel={() => {
          setShowEditor(false);
          setEditingTask(undefined);
        }}
      />

      <ConfirmDialog
        visible={!!postponeTask}
        title="Postpone Task"
        message="Are you sure you want to postpone this task to tomorrow?"
        onConfirm={handlePostponeConfirm}
        onCancel={() => setPostponeTask(undefined)}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 20,
    gap: 12,
  },
  progressContainer: {
    height: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  progressBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: '100%',
    backgroundColor: '#0a7ea4',
    borderRadius: 10,
  },
  progressText: {
    position: 'absolute',
    width: '100%',
    textAlign: 'center',
    lineHeight: 20,
    color: '#000',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0a7ea4',
    margin: 20,
    padding: 12,
    borderRadius: 8,
    justifyContent: 'center',
    gap: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 20,
    paddingTop: 0,
  },
  emptyList: {
    flex: 1,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
  taskContent: {
    flex: 1,
    marginHorizontal: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#0a7ea4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  taskText: {
    fontSize: 16,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  postponeCount: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.5,
  },
  emptyText: {
    fontSize: 18,
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
  },
});
