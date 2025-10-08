import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ProductCard from '../../components/ProductCard';
import SafeScreen from '../../components/SafeScreen';
import { useNavigation, useRoute, RouteProp, CompositeNavigationProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../App';
import { BASE_URL } from '../../../config';
import { CategoryStackParamList } from '../../navigation/CategoryStack';

type CategoryScreenNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<CategoryStackParamList, 'Category'>,
  NativeStackNavigationProp<RootStackParamList>
>;
type CategoryScreenRouteProp = RouteProp<CategoryStackParamList, 'Category'>;

interface Product {
  id: string;
  name: string;
  price: string;
  special?: string;
  image: string;
  options?: boolean;
}

interface Category {
  id: string;
  name: string;
  image: string;
}

const CategoryScreen = () => {
  const navigation = useNavigation<CategoryScreenNavigationProp>();
  const route = useRoute<CategoryScreenRouteProp>();
  const { category_id } = route.params || {};

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [descExpanded, setDescExpanded] = useState(false);
  const [showDescToggle, setShowDescToggle] = useState(false);
  const [descMeasured, setDescMeasured] = useState(false);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedSort, setSelectedSort] = useState('Newest');
  const sortOptions = ['Newest', 'Price High', 'Price Low'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        let url = '';
        if (category_id) {
          url = `${BASE_URL}.getCategoryView&category_id=${category_id}`;
        } else {
          url = `${BASE_URL}.getCategories`;
        }

        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();

        if (category_id) {
          setDescription(json.description || '');
          setCategories(json.subcategories || []);
          setProducts(json.products || []);
        } else {
          setCategories(json.categories || []);
          setProducts([]);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [category_id]);

  const renderProduct = ({ item }: { item: Product }) => (
    <ProductCard
      product={item}
      onPress={() => navigation.navigate('Product', { product_id: item.id })}
      onAdd={() => {
      }}
    />
  );

  const renderCategory = ({ item }: { item: Category }) => {
    if (!item.name) {
      return <View style={styles.categoryCard} />;
    }
    return (
      <TouchableOpacity
        style={styles.categoryCard}
        onPress={() => navigation.push('Category', { category_id: item.id })}>
        {item.image && !failedImages[item.id] ? (
          <Image
            source={{ uri: item.image }}
            style={styles.categoryImage}
            onError={() => setFailedImages((s) => ({ ...s, [item.id]: true }))}
          />
        ) : (
          <View style={[styles.categoryImage, styles.fallbackCategory]}>
            <Ionicons name="play" size={28} color="#FF6B3E" />
          </View>
        )}
        <Text style={styles.categoryName}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  const ListHeader = () => {
    if (!category_id) return null;

    const numColumns = 3;
    const formattedCategories = [...categories];
    const itemsToPad =
      (numColumns - (formattedCategories.length % numColumns)) % numColumns;
    for (let i = 0; i < itemsToPad; i++) {
      formattedCategories.push({ id: `blank-${i}`, name: '', image: '' });
    }

    return (
      <>
        {categories.length > 0 && (
          <View style={styles.categoryContainer}>
            <Text style={styles.categoryTitle}>Subcategories</Text>
            <FlatList
              data={formattedCategories}
              renderItem={renderCategory}
              keyExtractor={(item) => item.id}
              numColumns={numColumns}
              columnWrapperStyle={{ justifyContent: 'space-between' }}
              contentContainerStyle={styles.categoryList}
            />
          </View>
        )}

        {description && (
          <View style={styles.descriptionContainer}>
            <Text
              style={styles.descriptionText}
              numberOfLines={descExpanded ? undefined : descMeasured ? 2 : undefined}
              onTextLayout={(e) => {
                const lines = e.nativeEvent.lines || [];
                if (!descMeasured) {
                  if (lines.length > 2) setShowDescToggle(true);
                  setDescMeasured(true);
                }
              }}
            >
              {description}
            </Text>
            {showDescToggle && (
              <TouchableOpacity onPress={() => setDescExpanded((s) => !s)}>
                <Text style={styles.descriptionToggleText}>
                  {descExpanded ? 'Show less' : 'Add more...'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.sortBar}
          contentContainerStyle={styles.sortBarContent}>
          {sortOptions.map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.sortOption,
                selectedSort === option && styles.selectedSort,
              ]}
              onPress={() => setSelectedSort(option)}>
              <Text
                style={[
                  styles.sortOptionText,
                  selectedSort === option && styles.selectedSortText,
                ]}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </>
    );
  };

  if (loading) {
    return (
      <SafeScreen>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#FF6B3E" />
        </View>
      </SafeScreen>
    );
  }

  if (error) {
    return (
      <SafeScreen>
        <View style={styles.centered}>
          <Text style={{ color: 'red' }}>{error}</Text>
        </View>
      </SafeScreen>
    );
  }

  return (
    <SafeScreen>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {category_id ? 'Category' : 'All Categories'}
        </Text>
        <TouchableOpacity>
          <Ionicons name="options-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {products.length > 0 ? (
        <FlatList
          data={products}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id}
          numColumns={2}
          ListHeaderComponent={ListHeader}
          columnWrapperStyle={styles.productRow}
          contentContainerStyle={styles.productList}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <>
          {description ? (
            <View style={styles.descriptionContainer}>
              <Text
                style={styles.descriptionText}
                numberOfLines={descExpanded ? undefined : descMeasured ? 2 : undefined}
                onTextLayout={(e) => {
                  const lines = e.nativeEvent.lines || [];
                  if (!descMeasured) {
                    if (lines.length > 2) setShowDescToggle(true);
                    setDescMeasured(true);
                  }
                }}
              >
                {description}
              </Text>
              {showDescToggle && (
                <TouchableOpacity onPress={() => setDescExpanded((s) => !s)}>
                  <Text style={styles.descriptionToggleText}>
                    {descExpanded ? 'Show less' : 'Add more...'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          ) : null}

          <FlatList
            data={categories}
            renderItem={renderCategory}
            keyExtractor={(item) => item.id}
            numColumns={3}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
            contentContainerStyle={styles.categoryList}
          />
        </>
      )}
      {products.length === 0 && category_id ? (
        <View style={[styles.centered, styles.emptyOverlay]} pointerEvents="none">
          <Text style={styles.emptyText}>No products in category</Text>
        </View>
      ) : null}
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
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
  categoryContainer: {
    paddingVertical: 16,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  categoryList: {
    paddingHorizontal: 16,
  },
  categoryCard: {
    width: 100,
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
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
  descriptionContainer: {
    padding: 16,
  },
  descriptionText: {
    fontSize: 14,
    color: '#666',
  },
  descriptionToggleText: {
    marginTop: 8,
    color: '#FF6B3E',
    fontWeight: '600',
  },
  fallbackImage: {
    backgroundColor: '#FFF5F2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fallbackCategory: {
    backgroundColor: '#FFF5F2',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 40,
  },
  emptyOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    zIndex: 10,
  },
  emptyText: {
    color: 'red',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CategoryScreen;