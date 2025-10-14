import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../../../config';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { clearCart } from '../../redux/slices/cartSlice';
import { removeFromWishlist } from '../../redux/slices/wishlistSlice';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../auth/LoginScreen';
import RegisterScreen from '../auth/RegisterScreen';
import ForgotPasswordScreen from '../auth/ForgotPasswordScreen';
import SafeScreen from '../../components/SafeScreen';

const Stack = createNativeStackNavigator();

const ProfileScreen = () => {
  const [user, setUser] = useState<{ id: string; firstname: string; lastname: string; email: string; } | null>(null);
  const navigation: any = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);

  useFocusEffect(
    useCallback(() => {
      loadUserData();
    }, [])
  );

  const loadUserData = async () => {
    try {
      const [id, email, firstname, lastname] = await Promise.all([
        AsyncStorage.getItem('user_id'),
        AsyncStorage.getItem('user_email'),
        AsyncStorage.getItem('user_firstname'),
        AsyncStorage.getItem('user_lastname'),
      ]);

      if (id && email && firstname && lastname) {
        setUser({ id, email, firstname, lastname });
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleLogout = async () => {
    try {
      // Call logout API
      const url = `${BASE_URL}.logout`;
      await fetch(url, {
        method: 'GET'
      });

      // Clear local storage
      await Promise.all([
        AsyncStorage.removeItem('user_id'),
        AsyncStorage.removeItem('user_email'),
        AsyncStorage.removeItem('user_firstname'),
        AsyncStorage.removeItem('user_lastname'),
        AsyncStorage.removeItem('user_password'),
      ]);
      
      // Clear cart and wishlist
      dispatch(clearCart());
      // Clear all items from wishlist
      wishlistItems.forEach(item => {
        dispatch(removeFromWishlist(item.id));
      });

      setUser(null);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const handleMenuPress = (screen: string) => {
    navigation.navigate(screen);
  };

  const menuItems = [
    { icon: 'person-outline', title: 'Edit Profile', action: () => handleMenuPress('EditProfile') },
    { icon: 'location-outline', title: 'Shipping Address', action: () => handleMenuPress('ShippingAddress') },
    // { icon: 'card-outline', title: 'Payment Methods', action: () => handleMenuPress('PaymentMethods') },
    { icon: 'time-outline', title: 'Order History', action: () => handleMenuPress('OrderHistory') },
    // { icon: 'notifications-outline', title: 'Notifications', action: () => handleMenuPress('Notifications') },
    { icon: 'settings-outline', title: 'Settings', action: () => handleMenuPress('Settings') },
    { icon: 'help-circle-outline', title: 'Help Center', action: () => handleMenuPress('HelpCenter') },
    { icon: 'log-out-outline', title: 'Logout', action: handleLogout },
  ];

  const renderMenuItem = (item: typeof menuItems[0], index: number) => (
    <TouchableOpacity 
      key={index}
      style={styles.menuItem}
      onPress={item.action}
    >
      <View style={styles.menuItemLeft}>
        <Ionicons name={item.icon} size={24} color="#333" />
        <Text style={styles.menuItemText}>{item.title}</Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#999" />
    </TouchableOpacity>
  );

  if (!user) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      </Stack.Navigator>
    );
  }

  return (
    <SafeScreen>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>
      <ScrollView style={styles.content}>
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person" size={40} color="#FF6B3E" />
          </View>
          <Text style={styles.name}>{user.firstname} {user.lastname}</Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>

        <View style={styles.menuContainer}>
          {menuItems.map(renderMenuItem)}
        </View>
      </ScrollView>
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  profileSection: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#FFF',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    marginBottom: 16,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFF1EC',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#666',
  },
  menuContainer: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
});

export default ProfileScreen;