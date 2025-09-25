import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { useNavigation } from '@react-navigation/native';

const SettingsScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <TouchableOpacity style={styles.settingContainer}>
        <Text style={styles.settingLabel}>Language</Text>
        <View style={styles.settingValueContainer}>
          <Text style={styles.settingValue}>English</Text>
          <Ionicons name="chevron-forward" size={24} color="#999" />
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.settingContainer}>
        <Text style={styles.settingLabel}>Country</Text>
        <View style={styles.settingValueContainer}>
          <Text style={styles.settingValue}>United States</Text>
          <Ionicons name="chevron-forward" size={24} color="#999" />
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.settingContainer}>
        <Text style={styles.settingLabel}>Currency</Text>
        <View style={styles.settingValueContainer}>
          <Text style={styles.settingValue}>USD</Text>
          <Ionicons name="chevron-forward" size={24} color="#999" />
        </View>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.settingContainer}
        onPress={() => navigation.navigate('ChangePassword')}
      >
        <Text style={styles.settingLabel}>Change Password</Text>
        <Ionicons name="chevron-forward" size={24} color="#999" />
      </TouchableOpacity>
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
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  settingLabel: {
    fontSize: 16,
  },
  settingValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValue: {
    fontSize: 16,
    color: '#999',
    marginRight: 8,
  },
});

export default SettingsScreen;