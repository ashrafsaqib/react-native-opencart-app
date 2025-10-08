import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import { addToWishlist, removeFromWishlist, selectIsInWishlist } from '../redux/slices/wishlistSlice';
import { Toast } from 'react-native-toast-message/lib/src/Toast';

interface WishlistButtonProps {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    special?: number;
  };
  size?: number;
  style?: any;
}

const WishlistButton: React.FC<WishlistButtonProps> = ({ product, size = 24, style }) => {
  const dispatch = useDispatch<AppDispatch>();
  const isWishlisted = useSelector((state: RootState) => selectIsInWishlist(state, product.id));

  const toggleWishlist = () => {
    if (isWishlisted) {
      dispatch(removeFromWishlist(product.id));
      Toast.show({
        type: 'simple',
        position: 'bottom',
        text1: 'Removed from Wishlist',
        text2: `${product.name} has been removed from your wishlist.`,
      });
    } else {
      dispatch(addToWishlist(product));
      Toast.show({
        type: 'simple',
        position: 'bottom',
        text1: 'Added to Wishlist',
        text2: `${product.name} has been added to your wishlist.`,
      });
    }
  };

  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={toggleWishlist}
    >
      <Ionicons
        name={isWishlisted ? 'heart' : 'heart-outline'}
        size={size}
        color={isWishlisted ? '#FF6B3E' : '#000'}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 8,
  },
});

export default WishlistButton;