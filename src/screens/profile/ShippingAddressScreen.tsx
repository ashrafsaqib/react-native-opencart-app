import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../../navigation/ProfileStack';
import SafeScreen from '../../components/SafeScreen';
import { BASE_URL } from '../../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ShippingAddressScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAddresses = async () => {
    try {
      const customerId = await AsyncStorage.getItem('user_id');
      if (!customerId) {
        setError("User not logged in");
        setLoading(false);
        return;
      }

      const response = await fetch(`${BASE_URL}.getaddresses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "customer_id": JSON.parse(customerId)
        }),
      });
      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        const formattedAddresses = data.addresses.map((addr: any) => ({
          id: addr.address_id,
          name: addr.address.split('<br/>')[0],
          address: addr.address.replace(/<br\/>/g, '\n'),
        }));
        setAddresses(formattedAddresses);
      }
    } catch (e:any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleDeleteAddress = async (addressId: string) => {
    try {
      const customerId = await AsyncStorage.getItem('user_id');
      if (!customerId) {
        setError("User not logged in");
        return;
      }

      const response = await fetch(`${BASE_URL}.deleteaddress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "customer_id": JSON.parse(customerId),
          "address_id": addressId,
        }),
      });
      const data = await response.json();

      if (data.success) {
        Alert.alert('Success', data.success); 
        fetchAddresses(); // Re-fetch addresses to update the list
      } else {
        Alert.alert('Error', data.error || 'Failed to delete address.');
      }
    } catch (e:any) {
      setError(e.message);
    }
  };

  const renderAddress = ({ item }: { item: any }) => (
    <View style={styles.addressContainer}>
      <View style={styles.addressHeader}>
        <Text style={styles.addressName}>{item.name}</Text>
      </View>
      <Text style={styles.addressText}>{item.address}</Text>
      <View style={styles.addressActions}>
        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('AddressForm', { address_id: item.id })}>
          <Text style={styles.actionButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => handleDeleteAddress(item.id)}>
          <Text style={styles.actionButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeScreen>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Shipping Address</Text>
        <View style={{ width: 24 }} />
      </View>
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color="#FF6B3E" />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : addresses.length === 0 ? (
          <Text style={styles.noAddressText}>No address found.</Text>
        ) : (
          <FlatList
            data={addresses}
            renderItem={renderAddress}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.flatListContent}
          />
        )}
      </View>
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddressForm', { address_id: undefined })}>
        <Ionicons name="add" size={24} color="#fff" />
        <Text style={styles.addButtonText}>Add New Address</Text>
      </TouchableOpacity>
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
    paddingHorizontal: 24,
    backgroundColor: '#fff',
  },
  flatListContent: {
    paddingBottom: 80, // Height of the button + some margin
  },
  addressContainer: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  addressName: {
    fontSize: 16,
    fontWeight: '600',
  },
  addressText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  addressActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    marginLeft: 16,
  },
  actionButtonText: {
    color: '#FF6B3E',
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: '#FF6B3E',
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    position: 'absolute',
    bottom: 24,
    left: 24,
    right: 24,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
  noAddressText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 20,
  },
});

export default ShippingAddressScreen;