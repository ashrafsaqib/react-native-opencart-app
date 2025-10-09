import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import WishlistButton from './WishlistButton';
import CartButton from './CartButton';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/slices/cartSlice';
import Toast from 'react-native-toast-message';
import { RootStackParamList } from '../../App';

type ProductsNavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface Product {
  id: string;
  name: string;
  price: string;
  special?: string;
  sizes: string[];
  image: string;
  date_added?: string;
  options?: boolean;
}

interface PropsProducts {
  products?: Array<{
    id?: string;
    name?: string;
    image?: string;
    price?: string;
    special?: string | null;
    date_added?: string;
    options?: boolean;
  }>;
  title?: string;
}

const Products = ({ products, title = 'Popular' }: PropsProducts) => {
  const [selectedSort, setSelectedSort] = useState('Newest');
  const sortOptions = ['Newest', 'Price High', 'Price Low'];

  const parseNumber = (v: any) => {
    if (v == null) return NaN;
    const n = Number(String(v).replace(/[^0-9.-]+/g, ''));
    return Number.isNaN(n) ? NaN : n;
  };

  const productsData: Product[] = (products && products.length)
    ? products.map((p, idx) => ({
      id: p.id ?? `${idx}`,
      name: p.name ?? 'Product',
      price: p.price ?? '$0',
      special: p.special ?? undefined,
      sizes: [],
      image: p.image ?? 'https://via.placeholder.com/250',
      date_added: p.date_added,
      options: p.options,
    }))
    : [];

  const sortedProducts = useMemo(() => {
    const productsToSort = [...productsData];
    switch (selectedSort) {
      case 'Price High':
        return productsToSort.sort((a, b) => {
          const priceA = a.special ? parseNumber(a.special) : parseNumber(a.price);
          const priceB = b.special ? parseNumber(b.special) : parseNumber(b.price);
          return priceB - priceA;
        });
      case 'Price Low':
        return productsToSort.sort((a, b) => {
          const priceA = a.special ? parseNumber(a.special) : parseNumber(a.price);
          const priceB = b.special ? parseNumber(b.special) : parseNumber(b.price);
          return priceA - priceB;
        });
      case 'Newest':
        return productsToSort.sort((a, b) => {
          const dateA = a.date_added ? new Date(a.date_added).getTime() : 0;
          const dateB = b.date_added ? new Date(b.date_added).getTime() : 0;
          return dateB - dateA;
        });
      default:
        return productsToSort;
    }
  }, [productsData, selectedSort]);

  const navigation = useNavigation<ProductsNavigationProp>();
  const dispatch = useDispatch();

  const renderProduct = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={styles.product}
      onPress={() => navigation.navigate('Product', { product_id: item.id })}
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
          <View style={styles.priceContainer}>
            <Text style={styles.price}>{item.special ?? item.price}</Text>
            {item.special && <Text style={styles.originalPrice}>{item.price}</Text>}
          </View>
          <View style={styles.buttonGroup}>
            <WishlistButton
              product={{
                id: item.id ?? '',
                name: item.name ?? '',
                price: item.price ? parseNumber(item.price) : 0,
                special: item.special ? parseNumber(item.special) : undefined,
                image: item.image ?? '',
              }}
              size={20}
              style={styles.wishlistButton}
            />
            <CartButton
              product={{
                id: item.id,
                name: item.name,
                price: parseNumber(item.price),
                image: item.image,
                special: item.special ? parseNumber(item.special) : undefined,
                options: item.options,
              }}
              size={20}
            />
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
          <TouchableOpacity onPress={() => setSelectedSort('Newest')}>
            <Text style={[styles.sortLabel, selectedSort === 'Newest' && styles.activeSortLabel]}>Newest</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity onPress={() => setSelectedSort('Price High')}>
            <Text style={[styles.sortLabel, selectedSort === 'Price High' && styles.activeSortLabel]}>Highest</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity onPress={() => setSelectedSort('Price Low')}>
            <Text style={[styles.sortLabel, selectedSort === 'Price Low' && styles.activeSortLabel]}>Lowest</Text>
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        data={sortedProducts}
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
  activeSortLabel: {
    color: '#FF6B3E',
    fontWeight: 'bold',
  },
  divider: {
    width: 1,
    height: 12,
    backgroundColor: '#DDD',
    marginHorizontal: 8,
  },
  product: {
    marginBottom: 16,
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  productImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 12,
    resizeMode: 'cover',
    backgroundColor: '#f6f6f6',
  },
  productDetails: {
    paddingHorizontal: 4,
    paddingBottom: 4,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
    marginBottom: 8,
  },
  sizeContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  size: {
    fontSize: 13,
    color: '#666',
    marginRight: 8,
    backgroundColor: '#FAFAFA',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
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
  originalPrice: {
    fontSize: 14,
    color: '#999',
    textDecorationLine: 'line-through',
    marginRight: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
