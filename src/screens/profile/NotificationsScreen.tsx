import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';

const NotificationsScreen = () => {
  const [notifications, setNotifications] = useState({
    promotions: true,
    orders: true,
    reminders: false,
  });

  const toggleSwitch = (key: keyof typeof notifications) => {
    setNotifications(prevState => ({ ...prevState, [key]: !prevState[key] }));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notifications</Text>
      <View style={styles.settingContainer}>
        <Text style={styles.settingLabel}>Promotions</Text>
        <Switch
          trackColor={{ false: '#767577', true: '#FFBBA6' }}
          thumbColor={notifications.promotions ? '#FF6B3E' : '#f4f3f4'}
          onValueChange={() => toggleSwitch('promotions')}
          value={notifications.promotions}
        />
      </View>
      <View style={styles.settingContainer}>
        <Text style={styles.settingLabel}>Order Updates</Text>
        <Switch
          trackColor={{ false: '#767577', true: '#FFBBA6' }}
          thumbColor={notifications.orders ? '#FF6B3E' : '#f4f3f4'}
          onValueChange={() => toggleSwitch('orders')}
          value={notifications.orders}
        />
      </View>
      <View style={styles.settingContainer}>
        <Text style={styles.settingLabel}>Reminders</Text>
        <Switch
          trackColor={{ false: '#767577', true: '#FFBBA6' }}
          thumbColor={notifications.reminders ? '#FF6B3E' : '#f4f3f4'}
          onValueChange={() => toggleSwitch('reminders')}
          value={notifications.reminders}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  settingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  settingLabel: {
    fontSize: 16,
  },
});

export default NotificationsScreen;