import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useWishlist } from '../context/WishlistContext';

interface WishlistButtonProps {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
  };
  size?: number;
  style?: any;
}

const WishlistButton: React.FC<WishlistButtonProps> = ({ product, size = 24, style }) => {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const isWishlisted = isInWishlist(product.id);

  const toggleWishlist = () => {
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
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