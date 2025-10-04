import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import WishlistButton from './WishlistButton';

type RootStackParamList = {
  MainTabs: undefined;
  Product: { product: Product };
};

type ProductsNavigationProp = NativeStackNavigationProp<RootStackParamList, 'MainTabs'>;

interface Product {
  id: string;
  name: string;
  price: string;
  sizes: string[];
  image: string;
}

interface PropsProducts {
  products?: Array<{
    name?: string;
    image?: string;
    price?: string;
    special?: string | null;
  }>;
  title?: string;
}

const Products = ({ products, title = 'Popular' }: PropsProducts) => {
  const productsData: Product[] = (products && products.length)
    ? products.map((p, idx) => ({
        id: `${idx}`,
        name: p.name ?? 'Product',
        price: p.special ?? p.price ?? '$0',
        sizes: [],
        image: p.image ?? 'https://via.placeholder.com/250',
      }))
    : [];
  const navigation = useNavigation<ProductsNavigationProp>();

  const renderProduct = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={styles.product}
      onPress={() => navigation.navigate('Product', { product: item })}
    >
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productDetails}>
        <Text style={styles.productName}>{item.name}</Text>
        <View style={styles.sizeContainer}>
          {item.sizes.map((size, index) => (
            <Text key={index} style={styles.size}>{size}</Text>
          ))}
        </View>
        <View style={styles.actionsContainer}>
          <Text style={styles.price}>{item.price}</Text>
          <View style={styles.buttonGroup}>
            <WishlistButton
              product={{
                id: item.id,
                name: item.name,
                price: parseFloat(item.price.replace('$', '')),
                image: item.image
              }}
              size={20}
              style={styles.wishlistButton}
            />
            <TouchableOpacity 
              style={styles.cartButton}
              onPress={(e) => {
                e.stopPropagation();
                // Add to cart logic here
              }}
            >
              <Ionicons name="cart-outline" size={20} color="#FF6B3E" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.sortContainer}>
          <Text style={styles.sortLabel}>Newest</Text>
          <View style={styles.divider} />
          <Text style={styles.sortLabel}>Highest</Text>
          <View style={styles.divider} />
          <Text style={styles.sortLabel}>Lowest</Text>
        </View>
      </View>
      <FlatList
        data={productsData}
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
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  wishlistButton: {
    marginRight: 8,
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
