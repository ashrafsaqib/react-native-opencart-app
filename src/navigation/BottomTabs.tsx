import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HomeScreen from '../screens/home/HomeScreen';
import WishlistScreen from '../screens/wishlist/WishlistScreen';
import CartScreen from '../screens/cart/CartScreen';
import ProfileStack from './ProfileStack';
import CategoryStack from './CategoryStack';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

const Tab = createBottomTabNavigator();

const BottomTabs = () => {
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
  const wishlistCount = wishlistItems.length;
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string = 'home-outline';

          if (route.name === 'HomeTab') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'CategoryTab') {
            iconName = focused ? 'grid' : 'grid-outline';
          } else if (route.name === 'WishlistTab') {
            iconName = focused ? 'heart' : 'heart-outline';
            return (
              <View style={styles.iconContainer}>
                <Ionicons name={iconName} size={size} color={color} />
                {wishlistCount > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{wishlistCount}</Text>
                  </View>
                )}
              </View>
            );
          } else if (route.name === 'CartTab') {
            iconName = focused ? 'cart' : 'cart-outline';
            return (
              <View style={styles.iconContainer}>
                <Ionicons name={iconName} size={size} color={color} />
                {cartCount > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{cartCount}</Text>
                  </View>
                )}
              </View>
            );
          } else if (route.name === 'ProfileTab') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#FF6B3E',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{ title: 'Home' }}
      />
      <Tab.Screen
        name="CategoryTab"
        component={CategoryStack}
        options={{ title: 'Category' }}
      />
      <Tab.Screen
        name="WishlistTab"
        component={WishlistScreen}
        options={{ title: 'Wishlist' }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStack}
        options={{ title: 'Profile' }}
      />
      <Tab.Screen
        name="CartTab"
        component={CartScreen}
        options={{ title: 'Cart' }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    width: 24,
    height: 24,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    right: -10,
    top: -5,
    backgroundColor: '#FF6B3E',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default BottomTabs;