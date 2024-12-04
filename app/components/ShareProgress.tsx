import React, { useRef } from 'react';
import { Modal, StyleSheet, TouchableOpacity, View, Share } from 'react-native';
import ViewShot from 'react-native-view-shot';
import { Feather } from '@expo/vector-icons';

import { DailyProgress, Task } from '@/types';
import ThemedText from './ThemedText';
import ThemedView from './ThemedView';

interface ShareProgressProps {
  visible: boolean;
  onClose: () => void;
  progress: DailyProgress;
  tasks?: Task[];
}

export default function ShareProgress({
  visible,
  onClose,
  progress,
  tasks,
}: ShareProgressProps) {
  const viewShotRef = useRef<ViewShot>(null);

  const shareAsImage = async () => {
    try {
      if (viewShotRef.current) {
        const uri = await viewShotRef.current.capture();
        await Share.share({
          url: uri,
        });
      }
    } catch (error) {
      console.error('Error sharing image:', error);
    }
  };

  const shareAsText = async () => {
    try {
      const date = new Date(progress.date).toLocaleDateString(undefined, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      let message = `📅 Daily Progress - ${date}\n\n`;
      message += `✨ Completed: ${progress.completedTasks}/${progress.totalTasks} tasks\n`;
      message += `📊 Progress: ${progress.progressPercentage}%\n`;

      if (tasks) {
        message += '\n📝 Tasks:\n';
        tasks.forEach(task => {
          message += `${task.isCompleted ? '✅' : '⭕'} ${task.title}\n`;
        });
      }

      message += '\n📱 Shared from Daily Todo Tracker';

      await Share.share({
        message,
      });
    } catch (error) {
      console.error('Error sharing text:', error);
    }
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <ThemedView style={styles.container}>
          <View style={styles.header}>
            <ThemedText type="title">Share Progress</ThemedText>
            <TouchableOpacity onPress={onClose}>
              <Feather name="x" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ViewShot
            ref={viewShotRef}
            options={{ format: 'jpg', quality: 0.9 }}
            style={styles.shareCard}
          >
            <View style={styles.cardHeader}>
              <ThemedText style={styles.date}>
                {new Date(progress.date).toLocaleDateString(undefined, {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </ThemedText>
            </View>

            <View style={styles.progressCircle}>
              <ThemedText style={styles.progressText}>
                {progress.progressPercentage}%
              </ThemedText>
              <ThemedText style={styles.completedText}>
                {progress.completedTasks}/{progress.totalTasks}
              </ThemedText>
            </View>

            {tasks && (
              <View style={styles.taskList}>
                {tasks.map(task => (
                  <View key={task.id} style={styles.taskItem}>
                    <ThemedText style={styles.taskText}>
                      {task.isCompleted ? '✅' : '⭕'} {task.title}
                    </ThemedText>
                  </View>
                ))}
              </View>
            )}

            <View style={styles.watermark}>
              <ThemedText style={styles.watermarkText}>
                Daily Todo Tracker
              </ThemedText>
            </View>
          </ViewShot>

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.button, styles.imageButton]}
              onPress={shareAsImage}
            >
              <Feather name="image" size={20} color="#fff" />
              <ThemedText style={styles.buttonText}>Share as Image</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.textButton]}
              onPress={shareAsText}
            >
              <Feather name="file-text" size={20} color="#fff" />
              <ThemedText style={styles.buttonText}>Share as Text</ThemedText>
            </TouchableOpacity>
          </View>
        </ThemedView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  shareCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  cardHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  date: {
    fontSize: 16,
    color: '#666',
  },
  progressCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#0a7ea4',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  progressText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
  },
  completedText: {
    fontSize: 16,
    color: '#fff',
  },
  taskList: {
    marginTop: 20,
  },
  taskItem: {
    marginBottom: 8,
  },
  taskText: {
    fontSize: 14,
  },
  watermark: {
    marginTop: 20,
    alignItems: 'center',
  },
  watermarkText: {
    fontSize: 12,
    color: '#666',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  imageButton: {
    backgroundColor: '#0a7ea4',
  },
  textButton: {
    backgroundColor: '#28a745',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
}); 