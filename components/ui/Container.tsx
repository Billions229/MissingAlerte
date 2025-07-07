import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  SafeAreaView,
  ScrollView,
} from 'react-native';

interface ContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  safeArea?: boolean;
  scrollable?: boolean;
  padding?: number;
  backgroundColor?: string;
}

export const Container: React.FC<ContainerProps> = ({
  children,
  style,
  safeArea = true,
  scrollable = false,
  padding = 20,
  backgroundColor = '#FFFFFF',
}) => {
  const containerStyle = [
    styles.container,
    { padding, backgroundColor },
    style,
  ];

  const content = scrollable ? (
    <ScrollView
      style={containerStyle}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={containerStyle}>{children}</View>
  );

  if (safeArea) {
    return <SafeAreaView style={styles.safeArea}>{content}</SafeAreaView>;
  }

  return content;
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
});
