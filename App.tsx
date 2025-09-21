// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ProductScreen from './src/screens/product/ProductScreen';
import BottomTabs from './src/navigation/BottomTabs';
import { WishlistProvider } from './src/context/WishlistContext';
import WishlistScreen from './src/screens/wishlist/WishlistScreen';

export type RootStackParamList = {
  MainTabs: undefined;
  Product: { product: any };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

/* Root stack (Tabs + overlay screens) */
function RootStack() {
  return (
    <WishlistProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false // This will hide the header for all screens
          }}
        >
            <Stack.Screen 
              name="MainTabs" 
              component={BottomTabs}
            />
            <Stack.Screen 
              name="Product" 
              component={ProductScreen}
            />
            <Stack.Screen 
              name="Wishlist"
              component={WishlistScreen}
            />
        </Stack.Navigator>
      </NavigationContainer>
    </WishlistProvider>
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