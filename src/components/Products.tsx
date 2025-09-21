import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';

const products = [
  {
    id: '1',
    name: 'iPhone 13',
    price: '$999',
    image: 'https://via.placeholder.com/150',
  },
  {
    id: '2',
    name: 'Samsung Galaxy S22',
    price: '$899',
    image: 'https://via.placeholder.com/150',
  },
  {
    id: '3',
    name: 'Google Pixel 6',
    price: '$799',
    image: 'https://via.placeholder.com/150',
  },
  {
    id: '4',
    name: 'OnePlus 10 Pro',
    price: '$899',
    image: 'https://via.placeholder.com/150',
  },
];

const Products = () => {
  const renderProduct = ({ item }) => (
    <View style={styles.product}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productPrice}>{item.price}</Text>
      <TouchableOpacity style={styles.addToCartButton}>
        <Text style={styles.addToCartButtonText}>Add to Cart</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Featured Products</Text>
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        numColumns={2}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  product: {
    flex: 1,
    margin: 5,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  productImage: {
    width: 150,
    height: 150,
    marginBottom: 10,
  },
  productName: {
    fontWeight: 'bold',
  },
  productPrice: {
    marginTop: 5,
    color: 'green',
  },
  addToCartButton: {
    marginTop: 10,
    backgroundColor: 'blue',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  addToCartButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Products;
