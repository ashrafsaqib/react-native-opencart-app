import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const tabs = [
  { id: 'home', icon: 'home-outline', label: 'Home', active: true },
  { id: 'search', icon: 'search-outline', label: 'Search' },
  { id: 'wishlist', icon: 'heart-outline', label: 'Wishlist' },
  { id: 'bag', icon: 'bag-outline', label: 'Bag' },
  { id: 'profile', icon: 'person-outline', label: 'Profile' },
];

const BottomNavigation = () => {
  return (
    <View style={styles.container}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.id}
          style={[styles.tab, tab.active && styles.activeTab]}
        >
          <Ionicons
            name={tab.icon}
            size={24}
            color={tab.active ? '#FF6B3E' : '#666'}
          />
          <Text style={[styles.label, tab.active && styles.activeLabel]}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
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