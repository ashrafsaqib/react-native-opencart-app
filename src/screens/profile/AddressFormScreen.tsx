import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../../navigation/ProfileStack';
import { BASE_URL } from '../../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';

type AddressFormScreenNavigationProp = NativeStackNavigationProp<ProfileStackParamList, 'AddressForm'>;

type AddressFormRouteParamList = {
  AddressForm: {
    address_id?: string;
  };
};

type AddressFormRouteProp = RouteProp<AddressFormRouteParamList, 'AddressForm'>;

const AddressFormScreen = () => {
  const navigation = useNavigation<AddressFormScreenNavigationProp>();
  const route = useRoute<AddressFormRouteProp>();
  const { address_id } = route.params || {};
  console.log('Editing address:', address_id);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [company, setCompany] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [city, setCity] = useState('');
  const [postcode, setPostcode] = useState('');
  const [country, setCountry] = useState('');
  const [zone, setZone] = useState('');
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [countries, setCountries] = useState<Array<{ country_id: string; name: string }>>([]);
  const [zones, setZones] = useState<Array<{ zone_id: string; name: string }>>([]);
  const [selectedCountryId, setSelectedCountryId] = useState('');
  const [selectedZoneId, setSelectedZoneId] = useState('');

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const fetchCountries = async () => {
    try {
      const response = await fetch(`${BASE_URL}.getCountries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const data = await response.json();
      if (data.countries) {
        setCountries(data.countries);
      }
    } catch (e) {
      console.error('Error fetching countries:', e);
    }
  };

  const fetchZones = async (countryId: string) => {
    try {
      const response = await fetch(`${BASE_URL}.getZones`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          country_id: countryId
        })
      });
      const data = await response.json();
      if (data.zones) {
        setZones(data.zones);
      }
    } catch (e) {
      console.error('Error fetching zones:', e);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  useEffect(() => {
    if (selectedCountryId) {
      fetchZones(selectedCountryId);
    } else {
      setZones([]);
    }
  }, [selectedCountryId]);

  useEffect(() => {
    const fetchAddress = async () => {
      if (address_id) {
        setLoading(true);
        try {
          const customerId = await AsyncStorage.getItem('user_id');
          if (!customerId) {
            Alert.alert('Error', 'User not logged in.');
            setLoading(false);
            return;
          }

          const response = await fetch(`${BASE_URL}.getaddress`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              address_id: address_id,
              customer_id: JSON.parse(customerId),
            }),
          });

          const data = await response.json();
          if (data.success && data.address) {
            const fetchedAddress = data.address;
            setFirstName(fetchedAddress.firstname || '');
            setLastName(fetchedAddress.lastname || '');
            setCompany(fetchedAddress.company || '');
            setAddress1(fetchedAddress.address_1 || '');
            setAddress2(fetchedAddress.address_2 || '');
            setCity(fetchedAddress.city || '');
            setPostcode(fetchedAddress.postcode || '');
            setCountry(fetchedAddress.country || '');
            setZone(fetchedAddress.zone || '');
            if (fetchedAddress.country_id) {
              setSelectedCountryId(fetchedAddress.country_id);
              if (fetchedAddress.zone_id) {
                setSelectedZoneId(fetchedAddress.zone_id);
              }
            }
          } else {
            Alert.alert('Error', data.error || 'Failed to fetch address.');
            navigation.goBack();
          }
        } catch (e) {
          Alert.alert('Error', 'Network error. Please try again.');
          navigation.goBack();
        } finally {
          setLoading(false);
        }
      }
    };

    fetchAddress();
  }, [address_id, navigation]);

  const handleSaveAddress = async () => {
    setFormError('');
    if (!firstName || !lastName || !address1 || !city || !postcode || !selectedCountryId || !selectedZoneId) {
      setFormError('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    try {
      const customerId = await AsyncStorage.getItem('user_id');
      if (!customerId) {
        Alert.alert('Error', 'User not logged in.');
        setLoading(false);
        return;
      }

      const payload = {
        customer_id: JSON.parse(customerId),
        firstname: firstName,
        lastname: lastName,
        company: company,
        address_1: address1,
        address_2: address2,
        city: city,
        postcode: postcode,
        country_id: selectedCountryId,
        zone_id: selectedZoneId,
        ...(address_id ? { address_id: address_id } : {}),
      };

      const url = `${BASE_URL}.editAddress`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        Alert.alert('Success', data.success);
        navigation.navigate('ShippingAddress');
      } else if (data.error) {
        // Handle object-type error messages
        if (typeof data.error === 'object') {
          const errorMessages = Object.values(data.error).join('\n');
          Alert.alert('Error', errorMessages);
          setFormError(errorMessages);
        } else {
          // Handle string error messages
          Alert.alert('Error', data.error);
          setFormError(data.error);
        }
      } else {
        Alert.alert('Error', 'Failed to save address.');
        setFormError('Failed to save address.');
      }
    } catch (e: any) {
      Alert.alert('Error', 'Network error. Please try again.');
      setFormError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{(address_id) ? 'Edit Address' : 'Add New Address'}</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>First Name <Text style={styles.required}>*</Text></Text>
          <TextInput style={styles.input} value={firstName} onChangeText={setFirstName} />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Last Name <Text style={styles.required}>*</Text></Text>
          <TextInput style={styles.input} value={lastName} onChangeText={setLastName} />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Company</Text>
          <TextInput style={styles.input} value={company} onChangeText={setCompany} />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Address 1 <Text style={styles.required}>*</Text></Text>
          <TextInput style={styles.input} value={address1} onChangeText={setAddress1} />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Address 2</Text>
          <TextInput style={styles.input} value={address2} onChangeText={setAddress2} />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>City <Text style={styles.required}>*</Text></Text>
          <TextInput style={styles.input} value={city} onChangeText={setCity} />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Postcode <Text style={styles.required}>*</Text></Text>
          <TextInput style={styles.input} value={postcode} onChangeText={setPostcode} keyboardType="numeric" />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Country <Text style={styles.required}>*</Text></Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedCountryId}
              style={styles.picker}
              onValueChange={(itemValue) => {
                setSelectedCountryId(itemValue);
                setSelectedZoneId('');
                const selectedCountry = countries.find(c => c.country_id === itemValue);
                if (selectedCountry) {
                  setCountry(selectedCountry.name);
                }
              }}>
              <Picker.Item label="Select a country" value="" />
              {countries.map((country) => (
                <Picker.Item key={country.country_id} label={country.name} value={country.country_id} />
              ))}
            </Picker>
          </View>
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Zone/Region <Text style={styles.required}>*</Text></Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedZoneId}
              style={styles.picker}
              enabled={!!selectedCountryId}
              onValueChange={(itemValue) => {
                setSelectedZoneId(itemValue);
                const selectedZone = zones.find(z => z.zone_id === itemValue);
                if (selectedZone) {
                  setZone(selectedZone.name);
                }
              }}>
              <Picker.Item label="Select a zone" value="" />
              {zones.map((zone) => (
                <Picker.Item key={zone.zone_id} label={zone.name} value={zone.zone_id} />
              ))}
            </Picker>
          </View>
        </View>

        {formError ? <Text style={styles.errorText}>{formError}</Text> : null}

        <TouchableOpacity
          style={[styles.saveButton, loading && styles.saveButtonDisabled]}
          onPress={handleSaveAddress}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.saveButtonText}>Save Address</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    backgroundColor: '#fff',
  },
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
  scrollContent: {
    padding: 24,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  required: {
    color: 'red',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 50,
    fontSize: 16,
    color: '#333',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 16,
  },
  saveButton: {
    backgroundColor: '#FF6B3E',
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
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

export default AddressFormScreen;
