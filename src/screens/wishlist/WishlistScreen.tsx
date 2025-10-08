import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SafeScreen from '../../components/SafeScreen';
import { RootState, AppDispatch } from '../../redux/store';
import { addToCart } from '../../redux/slices/cartSlice';
import { removeFromWishlist } from '../../redux/slices/wishlistSlice';

const WishlistScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const wishlist = useSelector((state: RootState) => state.wishlist.items);
  const navigation: any = useNavigation();

  const handleRemoveFromWishlist = (id: string) => {
    dispatch(removeFromWishlist(id));
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.productCard}>
      <TouchableOpacity onPress={() => navigation.navigate('Product', { product_id: item.id })}>
        <Image source={{ uri: item.image }} style={styles.productImage} />
      </TouchableOpacity>
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {item.name}
        </Text>
        <View style={styles.priceContainer}>
          {item.special && <Text style={styles.originalPrice}>${item.price}</Text>}
          <Text style={styles.productPrice}>${item.special ?? item.price}</Text>
        </View>
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => dispatch(addToCart({
            id: item.id,
            name: item.name,
            price: item.special ?? item.price,
            image: item.image,
            size: 'M', // Assuming default size
          }))}
        >
          <Ionicons name="cart-outline" size={24} color="#FF6B3E" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => handleRemoveFromWishlist(item.id)}
        >
          <Ionicons name="heart" size={24} color="#FF6B3E" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeScreen>
      <View style={styles.header}>
        <Text style={styles.title}>My Wishlist</Text>
      </View>
      {wishlist.length === 0 ? (
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
          data={wishlist}
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