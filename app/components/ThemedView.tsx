import { View, type ViewProps } from 'react-native';

type ThemedViewProps = ViewProps;

function ThemedView({ style, ...otherProps }: ThemedViewProps) {
  return <View style={[{ backgroundColor: '#ffffff' }, style]} {...otherProps} />;
}

export default ThemedView;
