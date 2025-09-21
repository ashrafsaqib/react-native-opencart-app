// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from './src/screens/home/HomeScreen';

const Stack = createNativeStackNavigator();

/* Root stack (Tabs + overlay screens) */
function RootStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false // This will hide the header for all screens
        }}
      >
          <Stack.Screen 
            name="Home" 
            component={HomeScreen}
          />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

/* App wrapper */
export default function App() {
  return (
    <SafeAreaProvider>
        <RootStack />
    </SafeAreaProvider>
  );
}