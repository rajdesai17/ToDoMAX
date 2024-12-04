import { Image, Linking, StyleSheet, TouchableOpacity, View } from 'react-native';
import { TaskMedia } from '@/types';
import ThemedText from './ThemedText';

interface TaskMediaPreviewProps {
  media: TaskMedia;
  small?: boolean;
}

export default function TaskMediaPreview({ media, small }: TaskMediaPreviewProps) {
  const handlePress = () => {
    Linking.openURL(media.url);
  };

  return (
    <TouchableOpacity 
      style={[styles.container, small && styles.smallContainer]} 
      onPress={handlePress}
    >
      {media.thumbnail && (
        <Image 
          source={{ uri: media.thumbnail }} 
          style={[styles.thumbnail, small && styles.smallThumbnail]}
          resizeMode="cover"
        />
      )}
      {media.title && (
        <View style={styles.titleContainer}>
          <ThemedText 
            numberOfLines={1} 
            style={[styles.title, small && styles.smallTitle]}
          >
            {media.title}
          </ThemedText>
          <ThemedText style={styles.type}>
            {media.type === 'image' ? '🖼️ Image' : '🔗 Link'}
          </ThemedText>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    overflow: 'hidden',
    marginTop: 8,
  },
  smallContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  thumbnail: {
    width: '100%',
    height: 150,
    backgroundColor: '#e1e1e1',
  },
  smallThumbnail: {
    width: 40,
    height: 40,
  },
  titleContainer: {
    padding: 8,
  },
  title: {
    fontSize: 14,
    marginBottom: 4,
  },
  smallTitle: {
    fontSize: 12,
    marginBottom: 0,
  },
  type: {
    fontSize: 12,
    color: '#666',
  },
}); 