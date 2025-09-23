import React from 'react';
import { StyleSheet, View, StatusBar, ViewStyle } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

interface SafeScreenProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

const SafeScreen: React.FC<SafeScreenProps> = ({ children, style }) => {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={[styles.container, style]} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      <View style={[styles.content, { paddingTop: insets.top }]}>
        {children}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  content: {
    flex: 1,
  },
});

export default SafeScreen;