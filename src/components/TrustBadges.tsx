import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

interface Props {
  badges?: Array<{ image?: string; title?: string; short_description?: string }>;
}

const TrustBadges = ({ badges }: Props) => {
  const items = (badges && badges.length) ? badges : [];
  return (
    <View style={styles.container}>
      <View style={styles.badgesContainer}>
        {items.map((badge, index) => (
          <View key={index} style={styles.badge}>
            <View style={styles.iconContainer}>
              <Image
                source={{ uri: badge.image || 'https://via.placeholder.com/48' }}
                style={styles.badgeImage}
              />
            </View>
            <Text style={styles.title}>{badge.title}</Text>
            <Text style={styles.description}>{badge.short_description}</Text>
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
    backgroundColor: '#fbcfbeff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  badgeImage: {
    width: 36,
    height: 36,
    resizeMode: 'contain',
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