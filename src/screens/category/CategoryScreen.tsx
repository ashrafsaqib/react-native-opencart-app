import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SafeScreen from '../../components/SafeScreen';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Home: undefined;
  Product: undefined;
  Category: undefined;
};

type CategoryScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Category'>;

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
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=500&h=500',
  },
  {
    id: '2',
    name: 'Training Dri-FIT 2.0 - t-shirt in black',
    price: '$39',
    sizes: ['S', 'M', 'L', 'XL'],
    image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=500&h=500',
  },
  {
    id: '3',
    name: 'Diesel S-KB ASTICO low lace sneakers',
    price: '$99',
    sizes: ['8.5 US', '9 US', '10 US'],
    image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=500&h=500',
  },
  {
    id: '4',
    name: 'Classic Oxford Shirt - White',
    price: '$59',
    sizes: ['S', 'M', 'L', 'XL'],
    image: 'https://images.unsplash.com/photo-1598032895397-b9472444bf93?auto=format&fit=crop&w=500&h=500',
  },
];

const CategoryScreen = () => {
  const navigation = useNavigation<CategoryScreenNavigationProp>();
  const [selectedSort, setSelectedSort] = useState('Newest');
  const sortOptions = ['Newest', 'Price High', 'Price Low'];

  const renderProduct = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => navigation.navigate('Product')}
    >
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {item.name}
        </Text>
        <View style={styles.sizeContainer}>
          {item.sizes.map((size, index) => (
            <Text key={index} style={styles.size}>
              {size}
            </Text>
          ))}
        </View>
        <View style={styles.priceRow}>
          <Text style={styles.price}>{item.price}</Text>
          <TouchableOpacity style={styles.addButton}>
            <Ionicons name="add" size={20} color="#FF6B3E" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeScreen>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Men's Clothes</Text>
        <TouchableOpacity>
          <Ionicons name="options-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Sort Bar */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.sortBar}
        contentContainerStyle={styles.sortBarContent}
      >
        {sortOptions.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.sortOption,
              selectedSort === option && styles.selectedSort,
            ]}
            onPress={() => setSelectedSort(option)}
          >
            <Text
              style={[
                styles.sortOptionText,
                selectedSort === option && styles.selectedSortText,
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Product Grid */}
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.productRow}
        contentContainerStyle={styles.productList}
        showsVerticalScrollIndicator={false}
      />
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  sortBar: {
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  sortBarContent: {
    padding: 16,
  },
  sortOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    marginRight: 8,
  },
  selectedSort: {
    backgroundColor: '#FF6B3E',
  },
  sortOptionText: {
    color: '#666',
    fontSize: 14,
  },
  selectedSortText: {
    color: '#FFF',
  },
  productList: {
    padding: 8,
  },
  productRow: {
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  productCard: {
    width: '48%',
    marginBottom: 16,
    backgroundColor: '#FFF',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  productImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    height: 40,
  },
  sizeContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  size: {
    fontSize: 12,
    color: '#666',
    marginRight: 8,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF6B3E',
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFF0EC',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CategoryScreen;