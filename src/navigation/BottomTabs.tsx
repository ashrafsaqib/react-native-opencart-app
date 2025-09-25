import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HomeScreen from '../screens/home/HomeScreen';
import CategoryScreen from '../screens/category/CategoryScreen';
import WishlistScreen from '../screens/wishlist/WishlistScreen';
import CartScreen from '../screens/cart/CartScreen';
import ProfileStack from './ProfileStack';

const Tab = createBottomTabNavigator();

const BottomTabs = () => {
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
          } else if (route.name === 'CartTab') {
            iconName = focused ? 'cart' : 'cart-outline';
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
        component={CategoryScreen}
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

export default BottomTabs;