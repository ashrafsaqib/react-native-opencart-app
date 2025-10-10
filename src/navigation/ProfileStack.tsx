
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from '../screens/profile/ProfileScreen';
import EditProfileScreen from '../screens/profile/EditProfileScreen';
import ShippingAddressScreen from '../screens/profile/ShippingAddressScreen';
import PaymentMethodsScreen from '../screens/profile/PaymentMethodsScreen';
import OrderHistoryScreen from '../screens/orders/OrderHistoryScreen';
import OrderDetailsScreen from '../screens/orders/OrderDetailsScreen';
import NotificationsScreen from '../screens/profile/NotificationsScreen';
import SettingsScreen from '../screens/profile/SettingsScreen';
import HelpCenterScreen from '../screens/profile/HelpCenterScreen';

import ChangePasswordScreen from '../screens/profile/ChangePasswordScreen';
import AddressFormScreen from '../screens/profile/AddressFormScreen';

export type ProfileStackParamList = {
  Profile: undefined;
  EditProfile: undefined;
  ShippingAddress: undefined;
  PaymentMethods: undefined;
  OrderHistory: undefined;
  OrderDetails: undefined;
  Notifications: undefined;
  Settings: undefined;
  HelpCenter: undefined;
  ChangePassword: undefined;
  AddressForm: { address_id?: string };
};

const Stack = createNativeStackNavigator<ProfileStackParamList>();

const ProfileStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="ShippingAddress" component={ShippingAddressScreen} />
      <Stack.Screen name="PaymentMethods" component={PaymentMethodsScreen} />
      <Stack.Screen name="OrderHistory" component={OrderHistoryScreen} />
      <Stack.Screen name="OrderDetails" component={OrderDetailsScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="HelpCenter" component={HelpCenterScreen} />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
      <Stack.Screen name="AddressForm" component={AddressFormScreen} />
    </Stack.Navigator>
  );
};

export default ProfileStack;
