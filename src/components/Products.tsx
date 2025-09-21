import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface Product {
  id: string;
  name: string;
  price: string;
  sizes: string[];
  image: string;
}

const products: Product[] = [
  {
    id: '1',
    name: 'Original Stripe Polo Ralph Lauren - Slim Fit',
    price: '$89',
    sizes: ['S', 'M', 'L', 'XL'],
    image: 'https://via.placeholder.com/150',
  },
  {
    id: '2',
    name: 'Training Dri-FIT 2.0 - t-shirt in black',
    price: '$39',
    sizes: ['S', 'M', 'L', 'XL'],
    image: 'https://via.placeholder.com/150',
  },
  {
    id: '3',
    name: 'Diesel S-KB ASTICO low lace sneakers',
    price: '$99',
    sizes: ['8.5 US', '9 US', '10 US'],
    image: 'https://via.placeholder.com/150',
  },
];

const Products = () => {
  const renderProduct = ({ item }: { item: Product }) => (
    <View style={styles.product}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productDetails}>
        <Text style={styles.productName}>{item.name}</Text>
        <View style={styles.sizeContainer}>
          {item.sizes.map((size, index) => (
            <Text key={index} style={styles.size}>{size}</Text>
          ))}
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>{item.price}</Text>
          <TouchableOpacity style={styles.cartButton}>
            <Ionicons name="cart-outline" size={20} color="#FF6B3E" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Popular</Text>
        <View style={styles.sortContainer}>
          <Text style={styles.sortLabel}>Newest</Text>
          <View style={styles.divider} />
          <Text style={styles.sortLabel}>Highest</Text>
          <View style={styles.divider} />
          <Text style={styles.sortLabel}>Lowest</Text>
        </View>
      </View>
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortLabel: {
    fontSize: 14,
    color: '#666',
  },
  divider: {
    width: 1,
    height: 12,
    backgroundColor: '#DDD',
    marginHorizontal: 8,
  },
  product: {
    marginBottom: 24,
  },
  productImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
  },
  productDetails: {
    paddingHorizontal: 4,
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  sizeContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  size: {
    fontSize: 14,
    color: '#666',
    marginRight: 12,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B3E',
  },
  cartButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFF0EC',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Products;
