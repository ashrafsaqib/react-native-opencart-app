import React, { useState, useEffect } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { BASE_URL } from '../../config';
import { useDispatch, useSelector } from 'react-redux';
import { setWishlistTotal, setWishlistProducts, clearWishlist, selectIsInWishlist } from '../redux/slices/wishlistSlice';
import { RootState } from '../redux/store';
import { fetchWithCurrency } from '../utils/api';

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
  const isWishlisted = useSelector((state: RootState) => selectIsInWishlist(state, product.id));
  const dispatch = useDispatch();

  const addToWishlist = async () => {
    try {
      const userId = await AsyncStorage.getItem('user_id');
      if (!userId) {
        Toast.show({
          type: 'simple',
          position: 'bottom',
          text1: 'Error',
          text2: 'Please login first',
        });
        return;
      }

      const response = await fetchWithCurrency(`${BASE_URL}.addToWishlist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer_id: userId,
          product_id: product.id,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        if (data.products) {
          dispatch(setWishlistProducts(data.products));
        }
        dispatch(setWishlistTotal(data.total));
        Toast.show({
          type: 'simple',
          position: 'bottom',
          text1: 'Success',
          text2: `${product.name} has been added to your wishlist.`,
        });
      } else {
        Toast.show({
          type: 'simple',
          position: 'bottom',
          text1: 'Error',
          text2: data.error || 'Failed to add to wishlist',
        });
      }
    } catch (error) {
      Toast.show({
        type: 'simple',
        position: 'bottom',
        text1: 'Error',
        text2: 'Something went wrong',
      });
    }
  };

  const removeFromWishlist = async () => {
    try {
      const userId = await AsyncStorage.getItem('user_id');
      if (!userId) {
        Toast.show({
          type: 'simple',
          position: 'bottom',
          text1: 'Error',
          text2: 'Please login first',
        });
        return;
      }

      const response = await fetchWithCurrency(`${BASE_URL}.removeFromWishlist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer_id: userId,
          product_id: product.id,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        if (data.products) {
          dispatch(setWishlistProducts(data.products));
        }
        dispatch(setWishlistTotal(data.total));
        Toast.show({
          type: 'simple',
          position: 'bottom',
          text1: 'Success',
          text2: `${product.name} has been removed from your wishlist.`,
        });
      } else {
        Toast.show({
          type: 'simple',
          position: 'bottom',
          text1: 'Error',
          text2: data.error || 'Failed to remove from wishlist',
        });
      }
    } catch (error) {
      Toast.show({
        type: 'simple',
        position: 'bottom',
        text1: 'Error',
        text2: 'Something went wrong',
      });
    }
  };

  const toggleWishlist = () => {
    if (isWishlisted) {
      removeFromWishlist();
    } else {
      addToWishlist();
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