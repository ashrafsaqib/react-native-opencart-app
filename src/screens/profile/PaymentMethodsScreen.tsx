import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import SafeScreen from '../../components/SafeScreen';

const paymentMethods = [
  {
    id: '1',
    type: 'Mastercard',
    last4: '1234',
    isDefault: true,
  },
  {
    id: '2',
    type: 'Visa',
    last4: '5678',
    isDefault: false,
  },
];

const PaymentMethodsScreen = () => {
  const navigation = useNavigation();
  const renderPaymentMethod = ({ item }: { item: typeof paymentMethods[0] }) => (
    <View style={styles.paymentMethodContainer}>
      <View style={styles.paymentMethodHeader}>
        <Ionicons name="card" size={24} color="#333" />
        <Text style={styles.paymentMethodType}>{item.type}</Text>
        <Text style={styles.paymentMethodLast4}>**** {item.last4}</Text>
        {item.isDefault && <Text style={styles.defaultBadge}>Default</Text>}
      </View>
      <View style={styles.paymentMethodActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
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
        <Text style={styles.headerTitle}>Payment Methods</Text>
        <View style={{ width: 24 }} />
      </View>
      <View style={styles.content}>
        <FlatList
          data={paymentMethods}
          renderItem={renderPaymentMethod}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        />
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={24} color="#fff" />
          <Text style={styles.addButtonText}>Add New Payment Method</Text>
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
  paymentMethodContainer: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  paymentMethodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  paymentMethodType: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
  paymentMethodLast4: {
    fontSize: 16,
    color: '#666',
    marginLeft: 'auto',
  },
  defaultBadge: {
    backgroundColor: '#E0F2F1',
    color: '#00796B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    fontSize: 12,
    marginLeft: 16,
  },
  paymentMethodActions: {
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
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default PaymentMethodsScreen;