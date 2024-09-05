import { View, type ViewProps } from 'react-native';
import { useThemeColor } from '@/app/hooks/useThemeColor';
import React from 'react';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  fullWidth?: boolean; // Optional prop to enable full width
  fillScreen?: boolean; // Optional prop to enable filling the screen with flex: 1
};

export function ThemedView({
  style,
  lightColor,
  darkColor,
  fullWidth = false, // Defaults to false
  fillScreen = false, // Defaults to false
  ...otherProps
}: ThemedViewProps) {
  const backgroundColor = useThemeColor(
    { light: lightColor ?? '#000', dark: darkColor ?? '#000' }, // Fallback to black
    'background'
  );

  return (
    <View
      style={[
        { backgroundColor }, 
        fullWidth && { width: '100%' }, // Apply full width if requested
        fillScreen && { flex: 1 }, // Apply flex: 1 to fill the screen
        style,
      ]}
      {...otherProps}
    />
  );
}
