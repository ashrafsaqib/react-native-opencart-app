import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SafeScreen from '../../components/SafeScreen';
import { BASE_URL } from '../../../config';

type RootStackParamList = {
  Login: undefined;
  OrderDetails: { orderId: string };
};

type Props = StackScreenProps<RootStackParamList, 'OrderDetails'>;

interface OrderProduct {
  name: string;
  model: string;
  option: Array<{
    name: string;
    value: string;
  }>;
  quantity: string;
  price: string;
  total: string;
}

interface OrderAddress {
  firstname: string;
  lastname: string;
  company: string;
  address_1: string;
  address_2: string;
  city: string;
  postcode: string;
  zone: string;
  zone_code: string;
  country: string;
}

interface OrderHistory {
  date_added: string;
  status: string;
  comment: string;
}

interface OrderDetails {
  order: {
    order_id: string;
    invoice_no: string;
    payment_method: string;
    shipping_method: string;
  };
  addresses: {
    shipping: OrderAddress;
  };
  products: OrderProduct[];
  totals: Array<{
    title: string;
    text: string;
  }>;
  history: OrderHistory[];
}

const getStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'pending':
      return '#FFA500';
    case 'processing':
      return '#0000FF';
    case 'shipped':
      return '#008000';
    case 'completed':
      return '#006400';
    case 'cancelled':
      return '#FF0000';
    case 'failed':
      return '#8B0000';
    case 'refunded':
      return '#A0522D';
    default:
      return '#808080';
  }
};

const OrderDetailsScreen = ({ navigation, route }: Props) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);

  useEffect(() => {
    fetchOrderDetails();
  }, []);

  const fetchOrderDetails = async () => {
    try {
      const userId = await AsyncStorage.getItem('user_id');
      if (!userId) {
        navigation.navigate('Login' as never);
        return;
      }

      const response = await fetch(`${BASE_URL}.getOrder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer_id: userId,
          order_id: route.params.orderId
        })
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
        Alert.alert('Error', data.error);
        return;
      }

      setOrderDetails(data);
    } catch (error) {
      console.error('Error fetching order details:', error);
      setError('Failed to fetch order details');
      Alert.alert('Error', 'Failed to fetch order details');
    } finally {
      setLoading(false);
    }
  };

  const renderProductOptions = (options: OrderProduct['option']) => {
    if (!options.length) return null;
    
    return (
      <View style={styles.optionsContainer}>
        {options.map((option, index) => (
          <Text key={index} style={styles.optionText}>
            {option.name}: {option.value}
          </Text>
        ))}
      </View>
    );
  };

  const renderAddress = (address: OrderAddress) => (
    <View style={styles.addressContainer}>
      <Text style={styles.addressText}>{address.firstname} {address.lastname}</Text>
      {address.company ? <Text style={styles.addressText}>{address.company}</Text> : null}
      <Text style={styles.addressText}>{address.address_1}</Text>
      {address.address_2 ? <Text style={styles.addressText}>{address.address_2}</Text> : null}
      <Text style={styles.addressText}>
        {address.city}, {address.zone} {address.postcode}
      </Text>
      <Text style={styles.addressText}>{address.country}</Text>
    </View>
  );

  if (loading) {
    return (
      <SafeScreen>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      </SafeScreen>
    );
  }

  if (error || !orderDetails) {
    return (
      <SafeScreen>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error || 'Failed to load order details'}</Text>
        </View>
      </SafeScreen>
    );
  }

  return (
    <SafeScreen>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order #{orderDetails.order.order_id}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Order Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Invoice No:</Text>
            <Text style={styles.infoValue}>{orderDetails.order.invoice_no || 'Not Generated'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Payment Method:</Text>
            <Text style={styles.infoValue}>{orderDetails.order.payment_method}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Shipping Method:</Text>
            <Text style={styles.infoValue}>{orderDetails.order.shipping_method}</Text>
          </View>
        </View>

        {/* Shipping Address */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shipping Address</Text>
          {renderAddress(orderDetails.addresses.shipping)}
        </View>

        {/* Products */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Products</Text>
          {orderDetails.products.map((product, index) => (
            <View key={index} style={styles.productContainer}>
              <View style={styles.productHeader}>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productTotal}>{product.total}</Text>
              </View>
              <Text style={styles.productModel}>Model: {product.model}</Text>
              {renderProductOptions(product.option)}
              <View style={styles.productPriceInfo}>
                <Text style={styles.productQuantity}>{product.quantity}x</Text>
                <Text style={styles.productPrice}>{product.price}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Order Totals */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Totals</Text>
          {orderDetails.totals.map((total, index) => (
            <View key={index} style={styles.totalRow}>
              <Text style={styles.totalLabel}>{total.title}:</Text>
              <Text style={styles.totalValue}>{total.text}</Text>
            </View>
          ))}
        </View>

        {/* Order History */}
        <View style={[styles.section, styles.lastSection]}>
          <Text style={styles.sectionTitle}>Order History</Text>
          {orderDetails.history.map((history, index) => (
            <View key={index} style={styles.historyItem}>
              <View style={styles.historyHeader}>
                <Text style={styles.historyDate}>
                  {history.date_added 
                    ? new Date(history.date_added.replace(' ', 'T')).toLocaleDateString()
                    : 'N/A'}
                </Text>
                <Text style={[
                  styles.historyStatus,
                  { backgroundColor: getStatusColor(history.status) }
                ]}>
                  {history.status}
                </Text>
              </View>
              {history.comment ? (
                <Text style={styles.historyComment}>{history.comment}</Text>
              ) : null}
            </View>
          ))}
        </View>
      </ScrollView>
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    fontSize: 16,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  lastSection: {
    borderBottomWidth: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#000',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  infoLabel: {
    color: '#666',
    flex: 1,
  },
  infoValue: {
    color: '#000',
    flex: 2,
  },
  addressContainer: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
  },
  addressText: {
    color: '#333',
    marginBottom: 4,
    fontSize: 14,
  },
  productContainer: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    flex: 1,
  },
  productTotal: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  productModel: {
    color: '#666',
    fontSize: 14,
    marginBottom: 4,
  },
  optionsContainer: {
    marginTop: 4,
  },
  optionText: {
    color: '#666',
    fontSize: 14,
  },
  productPriceInfo: {
    flexDirection: 'row',
    marginTop: 8,
  },
  productQuantity: {
    color: '#666',
    marginRight: 8,
  },
  productPrice: {
    color: '#666',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  totalLabel: {
    color: '#666',
  },
  totalValue: {
    color: '#000',
    fontWeight: '500',
  },
  historyItem: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  historyDate: {
    color: '#666',
    fontSize: 14,
  },
  historyStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  historyComment: {
    color: '#333',
    fontSize: 14,
    marginTop: 4,
  },
});

export default OrderDetailsScreen;