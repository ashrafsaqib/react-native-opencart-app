import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const badges = [
  {
    id: '1',
    icon: 'shield-checkmark',
    title: 'Secure Payment',
    description: '100% Protected',
  },
  {
    id: '2',
    icon: 'car',
    title: 'Free Shipping',
    description: 'Orders over $50',
  },
  {
    id: '3',
    icon: 'reload',
    title: 'Easy Returns',
    description: '30-Day Returns',
  },
  {
    id: '4',
    icon: 'headset',
    title: '24/7 Support',
    description: 'Ready to help',
  },
];

const TrustBadges = () => {
  return (
    <View style={styles.container}>
      <View style={styles.badgesContainer}>
        {badges.map((badge) => (
          <View key={badge.id} style={styles.badge}>
            <View style={styles.iconContainer}>
              <Ionicons name={badge.icon} size={24} color="#FF6B3E" />
            </View>
            <Text style={styles.title}>{badge.title}</Text>
            <Text style={styles.description}>{badge.description}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#EEE',
  },
  badgesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 16,
  },
  badge: {
    alignItems: 'center',
    flex: 1,
    minWidth: 150,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF1EC',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});

export default TrustBadges;