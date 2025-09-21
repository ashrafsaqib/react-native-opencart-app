import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const tabs = [
  { id: 'Home', icon: 'home-outline', label: 'Home' },
  { id: 'Category', icon: 'grid-outline', label: 'Categories' },
  { id: 'Wishlist', icon: 'heart-outline', label: 'Wishlist' },
  { id: 'Cart', icon: 'bag-outline', label: 'Cart' },
  { id: 'Profile', icon: 'person-outline', label: 'Profile' },
];

const BottomNavigation = () => {
  const navigation = useNavigation();
  const route = useRoute();
  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = route.name === tab.id;
        return (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, isActive && styles.activeTab]}
            onPress={() => {
              if (tab.id !== route.name) {
                navigation.navigate(tab.id as never);
              }
            }}
          >
            <Ionicons
              name={tab.icon}
              size={24}
              color={isActive ? '#FF6B3E' : '#666'}
            />
            <Text style={[styles.label, isActive && styles.activeLabel]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
  },
  activeTab: {
    position: 'relative',
  },
  label: {
    marginTop: 4,
    fontSize: 12,
    color: '#666',
  },
  activeLabel: {
    color: '#FF6B3E',
  },
});

export default BottomNavigation;