import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../../../config';
import SafeScreen from '../../components/SafeScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  MainTabs: undefined;
  Product: { product_id: string };
  Wishlist: undefined;
  CheckoutWebView: { sessionId: string; url?: string };
  OrderSuccess: undefined;
  LoginScreen: undefined;
};

const EditProfileScreen = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const [storedFirstName, storedLastName, storedEmail, storedPassword, storedUserId] = await Promise.all([
        AsyncStorage.getItem('user_firstname'),
        AsyncStorage.getItem('user_lastname'),
        AsyncStorage.getItem('user_email'),
        AsyncStorage.getItem('user_password'),
        AsyncStorage.getItem('user_id'),
      ]);

      if (storedFirstName) setFirstName(storedFirstName);
      if (storedLastName) setLastName(storedLastName);
      if (storedEmail) setEmail(storedEmail);
      if (storedUserId) setUserId(storedUserId);
      if (storedPassword) setPassword(storedPassword);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError('');

      const payload = {
        id: userId,
        firstname: firstName,
        lastname: lastName,
        email,
      };

      const url = `${BASE_URL}.updateProfile`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.user) {
        // Update AsyncStorage with new values from the response
        await Promise.all([
          AsyncStorage.setItem('user_firstname', data.user.firstname),
          AsyncStorage.setItem('user_lastname', data.user.lastname),
          AsyncStorage.setItem('user_email', data.user.email),
        ]);

        Alert.alert('Success', data.message || 'Profile updated successfully');
      } else {
        setError(data.error || 'Failed to update profile');
        Alert.alert('Error', data.error || 'Failed to update profile');

        // Clear user data from AsyncStorage
        await Promise.all([
          AsyncStorage.removeItem('user_id'),
          AsyncStorage.removeItem('user_email'),
          AsyncStorage.removeItem('user_firstname'),
          AsyncStorage.removeItem('user_lastname'),
          AsyncStorage.removeItem('user_password'),
        ]);

        // Navigate to LoginScreen
        navigation.navigate('LoginScreen');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeScreen>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView style={styles.content}>
        <View>
          <TextInput
            style={styles.input}
            placeholder="First Name"
            value={firstName}
            onChangeText={setFirstName}
          />
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            value={lastName}
            onChangeText={setLastName}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>
      </ScrollView>
      <View style={styles.bottomBar}>
        <TouchableOpacity 
          style={[styles.saveButton, loading && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.saveButtonText}>Save Changes</Text>
          )}
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
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
    fontSize: 16,
    marginBottom: 16,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
  bottomBar: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  saveButton: {
    backgroundColor: '#FF6B3E',
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#FFB7A5',
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default EditProfileScreen;