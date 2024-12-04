// This is a shim for web and Android where the tab bar is generally opaque.
import { View } from 'react-native';

function TabBarBackground() {
  return <View style={{ backgroundColor: 'transparent' }} />;
}

export function useBottomTabOverflow() {
  return 0;
}

export default TabBarBackground;
