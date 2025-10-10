import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SafeScreen from '../../components/SafeScreen';

const NotificationsScreen = () => {
  const [notifications, setNotifications] = useState({
    promotions: true,
    orders: true,
    reminders: false,
  });
  const navigation = useNavigation();

  const toggleSwitch = (key: keyof typeof notifications) => {
    setNotifications(prevState => ({ ...prevState, [key]: !prevState[key] }));
  };

  return (
    <SafeScreen>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={{ width: 24 }} />
      </View>
      <View style={styles.content}>
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
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  content: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
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