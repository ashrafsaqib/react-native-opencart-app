import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SafeScreen from '../../components/SafeScreen';
import { AppDispatch, RootState } from '../../redux/store';
import { 
  setWishlistTotal, 
  setWishlistProducts, 
  setWishlistLoading,
  clearWishlist 
} from '../../redux/slices/wishlistSlice';
import CartButton from '../../components/CartButton';
import { BASE_URL } from '../../../config';
import { fetchWithCurrency } from '../../utils/api';
import Toast from 'react-native-toast-message';

interface WishlistProduct {
  id: string;
  name: string;
  image: string;
  price: string;
  special: string | null;
  options: boolean;
  date_added: string;
}

const WishlistScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation: any = useNavigation();
  const { items: wishlistProducts, isLoading } = useSelector((state: RootState) => state.wishlist);

  const removeFromWishlist = async (product: WishlistProduct) => {
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
        // Update Redux state with new data
        if (data.products) {
          dispatch(setWishlistProducts(data.products));
        } else {
          // If no products array in response, remove just this product
          dispatch(setWishlistProducts(wishlistProducts.filter(item => item.id !== product.id)));
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
      console.error('Error removing from wishlist:', error);
      Toast.show({
        type: 'simple',
        position: 'bottom',
        text1: 'Error',
        text2: 'Something went wrong',
      });
    }
  };

  const fetchWishlist = async () => {
    dispatch(setWishlistLoading(true));
    try {
      const userId = await AsyncStorage.getItem('user_id');
      if (!userId) {
        dispatch(setWishlistLoading(false));
        return;
      }

      const response = await fetchWithCurrency(`${BASE_URL}.getWishlist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer_id: userId,
        }),
      });

      const data = await response.json();
      if (data.products) {
        dispatch(clearWishlist()); // Clear existing items
        dispatch(setWishlistProducts(data.products));
        dispatch(setWishlistTotal(data.total));
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      dispatch(setWishlistLoading(false));
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchWishlist();
    });

    // Initial fetch
    fetchWishlist();

    // Cleanup subscription on unmount
    return unsubscribe;
  }, [navigation]);

  const renderItem = ({ item }: { item: WishlistProduct }) => (
    <View style={styles.productCard}>
      <TouchableOpacity onPress={() => navigation.navigate('Product', { product_id: item.id })}>
        <Image source={{ uri: item.image }} style={styles.productImage} />
      </TouchableOpacity>
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {item.name}
        </Text>
        <View style={styles.priceContainer}>
          {item.special && <Text style={styles.originalPrice}>{item.price}</Text>}
          <Text style={styles.productPrice}>{item.special ?? item.price}</Text>
        </View>
      </View>
      <View style={styles.actionButtons}>
        <CartButton
          product={{
            id: item.id,
            name: item.name,
            price: parseFloat(item.price.replace('$', '')),
            special: item.special ? parseFloat(item.special.replace('$', '')) : undefined,
            image: item.image,
            options: item.options,
          }}
          style={styles.cartButton}
        />
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => removeFromWishlist(item)}
        >
          <Ionicons name="heart" size={24} color="#FF6B3E" />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <SafeScreen>
        <View style={[styles.container, styles.loadingContainer]}>
          <ActivityIndicator size="large" color="#FF6B3E" />
        </View>
      </SafeScreen>
    );
  }

  return (
    <SafeScreen>
      <View style={styles.header}>
        <Text style={styles.title}>My Wishlist</Text>
      </View>
      {wishlistProducts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="heart-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>Your wishlist is empty</Text>
          <TouchableOpacity
            style={styles.shopButton}
            onPress={() => navigation.navigate('HomeTab')}
          >
            <Text style={styles.shopButtonText}>Start Shopping</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={wishlistProducts}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  listContainer: {
    padding: 16,
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  productInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  originalPrice: {
    fontSize: 14,
    color: '#999',
    textDecorationLine: 'line-through',
    marginRight: 8,
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B3E',
  },
  actionButtons: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  removeButton: {
    padding: 8,
  },
  cartButton: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 16,
    marginBottom: 24,
  },
  shopButton: {
    backgroundColor: '#FF6B3E',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  shopButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default WishlistScreen;