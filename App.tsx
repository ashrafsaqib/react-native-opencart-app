import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ProductScreen from './src/screens/product/ProductScreen';
import BottomTabs from './src/navigation/BottomTabs';
import WishlistScreen from './src/screens/wishlist/WishlistScreen';
import CheckoutWebViewScreen from './src/screens/cart/CheckoutWebViewScreen';
import { AuthProvider } from './src/context/AuthContext';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import OrderSuccessScreen from './src/screens/cart/OrderSuccessScreen';

export type RootStackParamList = {
  MainTabs: undefined;
  Product: { product_id: string };
  Wishlist: undefined;
  CheckoutWebView: { sessionId: string; url?: string };
  OrderSuccess: undefined;
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
        <Stack.Screen
          name="CheckoutWebView"
          component={CheckoutWebViewScreen}
        />
        <Stack.Screen
          name="OrderSuccess"
          component={OrderSuccessScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import { View, Text } from 'react-native';

const toastConfig = {
  simple: ({ text1, text2, ...rest }) => (
    <View style={{ paddingHorizontal: 20, paddingVertical: 10, backgroundColor: '#FFF', borderRadius: 20, marginHorizontal: 20, elevation: 2 }}>
      <Text style={{ color: 'black', fontWeight: 'bold' }}>{text1}</Text>
      {text2 && <Text style={{ color: 'black', fontSize: 12 }}>{text2}</Text>}
    </View>
  ),
};

/* App wrapper */
export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <AuthProvider>
          <RootStack />
          <Toast config={toastConfig} />
        </AuthProvider>
      </SafeAreaProvider>
    </Provider>
  );
}