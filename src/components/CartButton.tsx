import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import { addToCart, selectIsInCart } from '../redux/slices/cartSlice';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import Toast from 'react-native-toast-message';

interface CartButtonProps {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    special?: number;
    options?: boolean;
  };
  size?: number;
  style?: any;
}

const CartButton: React.FC<CartButtonProps> = ({ product, size = 24, style }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const isInCart = useSelector((state: RootState) => selectIsInCart(state, product.id, []));

  const handlePress = (e: any) => {
    e.stopPropagation();
    if (product.options) {
      navigation.navigate('Product', { product_id: product.id });
    } else {
      const cartPayload = {
        id: product.id,
        name: product.name,
        basePrice: product.price,
        specialPrice: product.special,
        image: product.image,
        options: [],
      };
      dispatch(addToCart(cartPayload));
      Toast.show({
        type: 'simple',
        position: 'bottom',
        text1: isInCart ? 'Quantity Increased' : 'Added to Cart',
        text2: `${product.name} has been ${isInCart ? 'updated in your cart' : 'added to your cart'}.`,
      });
    }
  };

  const isAdded = product.options ? false : isInCart;

  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={handlePress}
    >
      <Ionicons
        name={isAdded ? 'cart' : 'cart-outline'}
        size={size}
        color={'#FF6B3E'}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 8,
  },
});

export default CartButton;
