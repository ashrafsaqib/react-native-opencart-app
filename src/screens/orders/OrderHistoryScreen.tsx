import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SafeScreen from '../../components/SafeScreen';

const orders = [
  {
    id: '1',
    orderId: '#123456',
    date: '2023-10-26',
    total: 59.99,
    status: 'Delivered',
  },
  {
    id: '2',
    orderId: '#123457',
    date: '2023-10-25',
    total: 29.99,
    status: 'Shipped',
  },
  {
    id: '3',
    orderId: '#123458',
    date: '2023-10-24',
    total: 19.99,
    status: 'Processing',
  },
];

const OrderHistoryScreen = () => {
  const navigation: any = useNavigation();

  const renderOrder = ({ item }: { item: typeof orders[0] }) => (
    <TouchableOpacity 
      style={styles.orderContainer}
      onPress={() => navigation.navigate('OrderDetails', { orderId: item.id })}
    >
      <View style={styles.orderHeader}>
        <Text style={styles.orderId}>{item.orderId}</Text>
        <Text style={styles.orderDate}>{item.date}</Text>
      </View>
      <View style={styles.orderDetails}>
        <Text style={styles.orderTotal}>$ {item.total.toFixed(2)}</Text>
        <Text style={[styles.orderStatus, { backgroundColor: getStatusColor(item.status) }]}>
          {item.status}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return '#E0F2F1';
      case 'Shipped':
        return '#FFF9C4';
      case 'Processing':
        return '#FFE0B2';
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
        <FlatList
          data={orders}
          renderItem={renderOrder}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        />
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
  orderContainer: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '600',
  },
  orderDate: {
    fontSize: 14,
    color: '#666',
  },
  orderDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  orderStatus: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    fontSize: 12,
    fontWeight: '600',
  },
});

export default OrderHistoryScreen;