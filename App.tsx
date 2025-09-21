// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from './src/screens/home/HomeScreen';
import ProductScreen from './src/screens/product/ProductScreen';
import CategoryScreen from './src/screens/category/CategoryScreen';
import CartScreen from './src/screens/cart/CartScreen';

export type RootStackParamList = {
  Home: undefined;
  Product: undefined;
  Category: undefined;
  Cart: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

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
          <Stack.Screen 
            name="Product" 
            component={ProductScreen}
          />
          <Stack.Screen 
            name="Category" 
            component={CategoryScreen}
          />
          <Stack.Screen 
            name="Cart" 
            component={CartScreen}
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