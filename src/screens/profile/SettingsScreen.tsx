import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import SafeScreen from '../../components/SafeScreen';

const SettingsScreen = () => {
  const navigation: any = useNavigation();

  return (
    <SafeScreen>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 24 }} />
      </View>
      <View style={styles.content}>
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