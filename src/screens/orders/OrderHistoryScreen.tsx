import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SafeScreen from '../../components/SafeScreen';
import { BASE_URL } from '../../../config';

interface Order {
  order_id: string;
  status: string;
  products: number;
  total: string;
  date_added: string;
}

const OrderHistoryScreen = () => {
  const navigation: any = useNavigation();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const userId = await AsyncStorage.getItem('user_id');
      if (!userId) {
        navigation.navigate('Login');
        return;
      }

      const response = await fetch(`${BASE_URL}.getOrders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer_id: userId
        })
      });
      const data = await response.json();

      if (data.orders) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderOrder = ({ item }: { item: Order }) => (
    <TouchableOpacity
      style={styles.orderContainer}
      onPress={() => navigation.navigate('OrderDetails', { orderId: item.order_id })}
    >
      <View style={styles.orderHeader}>
        <Text style={styles.orderId}>Order #{item.order_id}</Text>
        <Text style={styles.orderDate}>{item.date_added.split(' ')[0]}</Text>
      </View>
      <View style={styles.orderDetails}>
        <Text style={styles.orderTotal}>{item.total}</Text>
        <Text style={[styles.orderStatus, { backgroundColor: getStatusColor(item.status) }]}>
          {item.status}
        </Text>
      </View>
      <Text style={styles.productsCount}>{item.products} {item.products === 1 ? 'Product' : 'Products'}</Text>
    </TouchableOpacity>
  );

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'complete':
      case 'processed':
        return '#E0F2F1';

      case 'processing':
      case 'shipped':
        return '#E3F2FD';

      case 'pending':
        return '#FFF3E0';

      case 'canceled':
      case 'canceled reversal':
      case 'denied':
      case 'failed':
      case 'voided':
        return '#FFEBEE';

      case 'chargeback':
      case 'refunded':
      case 'reversed':
        return '#F3E5F5';

      case 'expired':
        return '#EEEEEE';

      default:
        return '#F5F5F5';
    }
  };

  return (
    <SafeScreen>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order History</Text>
        <View style={{ width: 24 }} />
      </View>
      <View style={styles.content}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#000" />
          </View>
        ) : orders.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No orders found</Text>
          </View>
        ) : (
          <FlatList
            data={orders}
            renderItem={renderOrder}
            keyExtractor={(item) => item.order_id}
            showsVerticalScrollIndicator={false}
          />
        )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  content: {
    flex: 1,
  },
  orderContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  orderDate: {
    fontSize: 14,
    color: '#666',
  },
  orderDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  orderStatus: {
    fontSize: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
    overflow: 'hidden',
  },
  productsCount: {
    fontSize: 14,
    color: '#666',
  },
});

export default OrderHistoryScreen;