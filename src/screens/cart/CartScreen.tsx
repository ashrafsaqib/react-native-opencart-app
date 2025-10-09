import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SafeScreen from '../../components/SafeScreen';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';
import { incrementQuantity, decrementQuantity, CartItemOption } from '../../redux/slices/cartSlice';

type RootStackParamList = {
  Home: undefined;
  Cart: undefined;
};

type CartScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Cart'>;


const CartScreen = () => {
  const navigation = useNavigation<CartScreenNavigationProp>();
  const dispatch = useDispatch<AppDispatch>();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 10;
  const total = subtotal + shipping;

  const handleIncrement = (id: string, options: CartItemOption[]) => {
    dispatch(incrementQuantity({ id, options }));
  };

  const handleDecrement = (id: string, options: CartItemOption[]) => {
    dispatch(decrementQuantity({ id, options }));
  };

  return (
    <SafeScreen>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Shopping Cart</Text>
        <View style={{ width: 24 }} />
      </View>

      {cartItems.length === 0 ? (
        <View style={styles.emptyCartContainer}>
          <Text style={styles.emptyCartText}>Your cart is empty</Text>
        </View>
      ) : (
        <>
          <ScrollView style={styles.content}>
            {/* Cart Items */}
            <View style={styles.cartItems}>
              {cartItems.map((item) => {
                const optionsKey = item.options.map(o => `${o.optionId}_${o.optionValue}`).join('-') || '';
                const key = `${item.id}-${optionsKey}`;

                return (
                  <View key={key} style={styles.cartItem}>
                    <Image source={{ uri: item.image }} style={styles.itemImage} />
                    <View style={styles.itemInfo}>
                      <Text style={styles.itemName} numberOfLines={2}>
                        {item.name}
                      </Text>
                      {item.options.length > 0 && (
                        <View>
                          {item.options.map((option, optionIndex) => (
                            <Text key={`${option.optionId}-${option.optionValue}-${optionIndex}`} style={styles.itemOption}>{option.optionName}: {option.optionValue}</Text>
                          ))}
                        </View>
                      )}
                      <View style={styles.priceRow}>
                        {item.special ? (
                          <>
                            <Text style={styles.itemSpecialPrice}>${item.special.toFixed(2)}</Text>
                            <Text style={styles.itemOldPrice}>${item.price.toFixed(2)}</Text>
                          </>
                        ) : (
                          <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
                        )}
                      </View>
                    </View>
                    <View style={styles.quantityControls}>
                      <TouchableOpacity style={styles.quantityButton} onPress={() => handleDecrement(item.id, item.options)}>
                        <Ionicons name="remove" size={20} color="#666" />
                      </TouchableOpacity>
                      <Text style={styles.quantity}>{item.quantity}</Text>
                      <TouchableOpacity style={styles.quantityButton} onPress={() => handleIncrement(item.id, item.options)}>
                        <Ionicons name="add" size={20} color="#666" />
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
            </View>

            {/* Summary */}
            <View style={styles.summary}>
              <Text style={styles.summaryTitle}>Order Summary</Text>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Shipping</Text>
                <Text style={styles.summaryValue}>${shipping.toFixed(2)}</Text>
              </View>
              <View style={[styles.summaryRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
              </View>
            </View>
          </ScrollView>

          {/* Checkout Button */}
          <View style={styles.bottomBar}>
            <TouchableOpacity style={styles.checkoutButton}>
              <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  cartItems: {
    padding: 16,
  },
  cartItem: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  itemName: {
    fontSize: 14,
    fontWeight: '500',
  },
  itemSize: {
    fontSize: 14,
    color: '#666',
  },
  itemOption: {
    fontSize: 12,
    color: '#666',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  itemSpecialPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF6B3E',
    marginRight: 8,
  },
  itemOldPrice: {
    fontSize: 12,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF6B3E',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantity: {
    fontSize: 16,
    fontWeight: '500',
    marginHorizontal: 12,
  },
  summary: {
    padding: 16,
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    margin: 16,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FF6B3E',
  },
  bottomBar: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  checkoutButton: {
    backgroundColor: '#FF6B3E',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyCartText: {
    fontSize: 18,
    color: '#666',
  },
});

export default CartScreen;