import React from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';

type OrderStackParamList = {
  OrderDetails: { orderId: string };
};

type OrderDetailsScreenRouteProp = RouteProp<OrderStackParamList, 'OrderDetails'>;

const orders = {
  '1': {
    id: '1',
    orderId: '#123456',
    date: '2023-10-26',
    total: 64.98,
    status: 'Delivered',
    shippingAddress: '123 Main St, Anytown, USA 12345',
    products: [
      { id: '1', name: 'Product 1', price: 29.99, quantity: 1 },
      { id: '2', name: 'Product 2', price: 29.99, quantity: 1 },
    ],
    subTotal: 59.98,
    shipping: 5.00,
    paymentMethod: 'Credit Card',
    shippingMethod: 'Standard Shipping',
  },
  '2': {
    id: '2',
    orderId: '#123457',
    date: '2023-10-25',
    total: 34.99,
    status: 'Shipped',
    shippingAddress: '456 Market St, San Francisco, CA 94103',
    products: [
      { id: '3', name: 'Product 3', price: 29.99, quantity: 1 },
    ],
    subTotal: 29.99,
    shipping: 5.00,
    paymentMethod: 'PayPal',
    shippingMethod: 'Express Shipping',
  },
  '3': {
    id: '3',
    orderId: '#123458',
    date: '2023-10-24',
    total: 24.99,
    status: 'Processing',
    shippingAddress: '789 Oak St, Somewhere, USA 54321',
    products: [
      { id: '4', name: 'Product 4', price: 19.99, quantity: 1 },
    ],
    subTotal: 19.99,
    shipping: 5.00,
    paymentMethod: 'Credit Card',
    shippingMethod: 'Standard Shipping',
  },
};

const OrderDetailsScreen = () => {
  const route = useRoute<OrderDetailsScreenRouteProp>();
  const { orderId } = route.params;
  const order = orders[orderId as keyof typeof orders];

  const renderProduct = ({ item }: { item: typeof order.products[0] }) => (
    <View style={styles.productContainer}>
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productQuantity}>x {item.quantity}</Text>
      <Text style={styles.productPrice}>$ {item.price.toFixed(2)}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Order Details</Text>
      <View style={styles.orderDetailsContainer}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Order ID</Text>
          <Text style={styles.detailValue}>{order.orderId}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Date</Text>
          <Text style={styles.detailValue}>{order.date}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Status</Text>
          <Text style={styles.detailValue}>{order.status}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Payment Method</Text>
          <Text style={styles.detailValue}>{order.paymentMethod}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Shipping Method</Text>
          <Text style={styles.detailValue}>{order.shippingMethod}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Shipping Address</Text>
          <Text style={[styles.detailValue, styles.addressValue]}>{order.shippingAddress}</Text>
        </View>
      </View>

      <Text style={styles.productsTitle}>Products</Text>
      <FlatList
        data={order.products}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
      />

      <View style={styles.totalsContainer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Sub-total</Text>
          <Text style={styles.totalValue}>$ {order.subTotal.toFixed(2)}</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Shipping</Text>
          <Text style={styles.totalValue}>$ {order.shipping.toFixed(2)}</Text>
        </View>
        <View style={[styles.totalRow, styles.finalTotalRow]}>
          <Text style={styles.finalTotalLabel}>Total</Text>
          <Text style={styles.finalTotalValue}>$ {order.total.toFixed(2)}</Text>
        </View>
      </View>
    </ScrollView>
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
  orderDetailsContainer: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 16,
    color: '#666',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    flexShrink: 1,
    textAlign: 'right',
  },
  addressValue: {
    flexBasis: '60%',
  },
  productsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  productContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  productName: {
    fontSize: 16,
  },
  productQuantity: {
    fontSize: 16,
    color: '#666',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '600',
  },
  totalsContainer: {
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 16,
    color: '#666',
  },
  totalValue: {
    fontSize: 16,
  },
  finalTotalRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  finalTotalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  finalTotalValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default OrderDetailsScreen;
