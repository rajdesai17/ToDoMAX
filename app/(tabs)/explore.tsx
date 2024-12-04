import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

import ShareProgress from '@/components/ShareProgress';
import ThemedText from '@/components/ThemedText';
import ThemedView from '@/components/ThemedView';
import { DailyProgress, Task } from '@/types';
import storage from '@/utils/storage';

type MarkedDates = {
  [date: string]: {
    marked: boolean;
    dotColor: string;
    selected?: boolean;
  };
};

export default function ExploreScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [markedDates, setMarkedDates] = useState<MarkedDates>({});
  const [tasks, setTasks] = useState<Task[]>([]);
  const [progress, setProgress] = useState<DailyProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showShare, setShowShare] = useState(false);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadDateData(selectedDate);
  }, [selectedDate]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const allTasks = await storage.getAllTasks();
      const allProgress = await storage.getAllProgress();

      const marks: MarkedDates = {};
      allTasks.forEach(task => {
        if (!marks[task.date]) {
          marks[task.date] = {
            marked: true,
            dotColor: '#0a7ea4',
          };
        }
      });

      marks[selectedDate] = {
        ...marks[selectedDate],
        selected: true,
      };

      setMarkedDates(marks);
      await loadDateData(selectedDate);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadDateData = async (date: string) => {
    try {
      const [dateTasks, dateProgress] = await Promise.all([
        storage.getTasks(date),
        storage.getDailyProgress(date),
      ]);
      setTasks(dateTasks);
      setProgress(dateProgress);
    } catch (error) {
      console.error('Error loading date data:', error);
    }
  };

  const onDayPress = (day: { dateString: string }) => {
    setSelectedDate(day.dateString);
    setMarkedDates(prev => ({
      ...prev,
      [selectedDate]: { ...prev[selectedDate], selected: false },
      [day.dateString]: { ...prev[day.dateString], selected: true },
    }));
  };

  const StatBox = useCallback(({ title, value }: { title: string; value: number | string }) => (
    <View style={styles.statBox}>
      <ThemedText type="title" style={styles.statValue}>
        {value}
      </ThemedText>
      <ThemedText type="subtitle" style={styles.statTitle}>
        {title}
      </ThemedText>
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
        <ThemedText type="title">Task History</ThemedText>
        {progress && (
          <TouchableOpacity 
            style={styles.shareButton}
            onPress={() => setShowShare(true)}
          >
            <Feather name="share-2" size={24} color="#0a7ea4" />
          </TouchableOpacity>
        )}
      </View>

      <Calendar
        style={styles.calendar}
        theme={{
          todayTextColor: '#0a7ea4',
          selectedDayBackgroundColor: '#0a7ea4',
          selectedDayTextColor: '#ffffff',
        }}
        markedDates={markedDates}
        onDayPress={onDayPress}
      />

      <View style={styles.statsContainer}>
        <StatBox 
          title="Tasks" 
          value={tasks.length} 
        />
        <StatBox 
          title="Completed" 
          value={progress?.completedTasks || 0} 
        />
        <StatBox 
          title="Completion Rate" 
          value={`${progress?.progressPercentage || 0}%`} 
        />
      </View>

      <View style={styles.taskList}>
        <ThemedText type="subtitle" style={styles.dateTitle}>
          {new Date(selectedDate).toLocaleDateString(undefined, { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </ThemedText>
        {tasks.length === 0 ? (
          <ThemedText style={styles.emptyText}>No tasks for this date</ThemedText>
        ) : (
          tasks.map(task => (
            <View key={task.id} style={styles.taskItem}>
              <View style={[styles.taskStatus, task.isCompleted && styles.completed]} />
              <ThemedText style={[styles.taskText, task.isCompleted && styles.completedText]}>
                {task.title}
              </ThemedText>
            </View>
          ))
        )}
      </View>

      {progress && (
        <ShareProgress
          visible={showShare}
          onClose={() => setShowShare(false)}
          progress={progress}
          tasks={tasks}
        />
      )}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  shareButton: {
    padding: 8,
  },
  calendar: {
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
  },
  statsContainer: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    color: '#0a7ea4',
  },
  statTitle: {
    fontSize: 14,
    color: '#666',
  },
  taskList: {
    flex: 1,
    padding: 20,
  },
  dateTitle: {
    marginBottom: 16,
    fontSize: 16,
    fontWeight: '600',
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 12,
  },
  taskStatus: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#0a7ea4',
  },
  completed: {
    backgroundColor: '#0a7ea4',
  },
  taskText: {
    flex: 1,
    fontSize: 16,
  },
  completedText: {
    color: '#999',
    textDecorationLine: 'line-through',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
  },
});
