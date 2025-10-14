import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList, ActivityIndicator } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import SafeScreen from '../../components/SafeScreen';
import { BASE_URL } from '../../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsScreen = () => {
  const navigation: any = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [currencies, setCurrencies] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BASE_URL}.getCurrencies`);
        const data = await response.json();
        setCurrencies(data.currencies);
      } catch (error) {
        console.error('Failed to fetch currencies:', error);
      } finally {
        setLoading(false);
      }
    };

    const loadSelectedCurrency = async () => {
      try {
        const currency = await AsyncStorage.getItem('selectedCurrency');
        if (currency) {
          setSelectedCurrency(currency);
        }
      } catch (error) {
        console.error('Failed to load currency from storage:', error);
      }
    };

    fetchCurrencies();
    loadSelectedCurrency();
  }, []);

  const handleSelectCurrency = async (currency: string) => {
    setSelectedCurrency(currency);
    setModalVisible(false);
    try {
      await AsyncStorage.setItem('selectedCurrency', currency);
    } catch (error) {
      console.error('Failed to save currency to storage:', error);
    }
  };

  return (
    <SafeScreen>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.headerRight} />
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
        <TouchableOpacity style={styles.settingContainer} onPress={() => setModalVisible(true)}>
          <Text style={styles.settingLabel}>Currency</Text>
          <View style={styles.settingValueContainer}>
            <Text style={styles.settingValue}>{selectedCurrency}</Text>
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
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {loading ? (
              <ActivityIndicator size="large" color="#000" />
            ) : (
              <FlatList
                data={currencies}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.currencyItem}
                    onPress={() => handleSelectCurrency(item)}
                  >
                    <Text style={styles.currencyText}>{item}</Text>
                    {selectedCurrency === item && (
                      <Ionicons name="checkmark" size={24} color="green" />
                    )}
                  </TouchableOpacity>
                )}
              />
            )}
          </View>
        </View>
      </Modal>
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
  headerRight: {
    width: 24,
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    maxHeight: '60%',
  },
  currencyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  currencyText: {
    fontSize: 16,
  },
});

export default SettingsScreen;