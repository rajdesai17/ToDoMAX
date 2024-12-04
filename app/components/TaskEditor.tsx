import { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import { Task, TaskMedia } from '@/types';
import ThemedText from './ThemedText';
import ThemedView from './ThemedView';
import TaskMediaPreview from './TaskMediaPreview';

interface TaskEditorProps {
  visible: boolean;
  task?: Task;
  onSave: (task: Partial<Task>) => void;
  onCancel: () => void;
}

export default function TaskEditor({
  visible,
  task,
  onSave,
  onCancel,
}: TaskEditorProps) {
  const [title, setTitle] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [media, setMedia] = useState<TaskMedia | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setMedia(task.media);
      setMediaUrl(task.media?.url || '');
    } else {
      setTitle('');
      setMedia(undefined);
      setMediaUrl('');
    }
  }, [task, visible]);

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({
      title: title.trim(),
      media,
    });
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      setMedia({
        type: 'image',
        url: result.assets[0].uri,
        thumbnail: result.assets[0].uri,
      });
      setMediaUrl(result.assets[0].uri);
    }
  };

  const handleUrlChange = async (url: string) => {
    setMediaUrl(url);
    if (!url) {
      setMedia(undefined);
      return;
    }

    // Simple YouTube URL detection
    const youtubeMatch = url.match(
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    );

    if (youtubeMatch) {
      const videoId = youtubeMatch[1];
      setMedia({
        type: 'link',
        url,
        thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
        title: 'YouTube Video',
      });
    } else if (url.match(/\.(jpg|jpeg|png|gif)$/i)) {
      setMedia({
        type: 'image',
        url,
        thumbnail: url,
      });
    } else {
      setMedia({
        type: 'link',
        url,
      });
    }
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <ThemedView style={styles.container}>
          <ThemedText type="title" style={styles.title}>
            {task ? 'Edit Task' : 'New Task'}
          </ThemedText>

          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Task title..."
            autoFocus
          />

          <View style={styles.mediaSection}>
            <ThemedText type="subtitle">Add Media (Optional)</ThemedText>
            <View style={styles.mediaInputs}>
              <TextInput
                style={[styles.input, styles.urlInput]}
                value={mediaUrl}
                onChangeText={handleUrlChange}
                placeholder="Paste image or video URL..."
              />
              <TouchableOpacity
                style={styles.imageButton}
                onPress={pickImage}
              >
                <ThemedText>📷</ThemedText>
              </TouchableOpacity>
            </View>

            {media && <TaskMediaPreview media={media} />}
          </View>

          <View style={styles.buttons}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onCancel}
            >
              <ThemedText>Cancel</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={handleSave}
              disabled={!title.trim() || isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <ThemedText style={styles.saveText}>Save</ThemedText>
              )}
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
    maxHeight: '80%',
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e1e1e1',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#ffffff',
    marginBottom: 16,
  },
  mediaSection: {
    marginBottom: 16,
  },
  mediaInputs: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  urlInput: {
    flex: 1,
    marginBottom: 0,
  },
  imageButton: {
    width: 48,
    height: 48,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
  },
  saveButton: {
    backgroundColor: '#0a7ea4',
  },
  saveText: {
    color: '#fff',
    fontWeight: '600',
  },
}); 