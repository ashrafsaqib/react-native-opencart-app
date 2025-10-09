import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Platform,
  StatusBar,
  ActivityIndicator,
  FlatList,
  Dimensions,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ProductCard from '../../components/ProductCard';
import ProductOptions from '../../components/ProductOptions';
import WishlistButton from '../../components/WishlistButton';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { addToCart, CartItemOption } from '../../redux/slices/cartSlice';
import Toast from 'react-native-toast-message';
import { BASE_URL } from '../../../config';

type RootStackParamList = {
  Home: undefined;
  Product: { product_id: string };
};

type ProductScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Product'
>;

interface ProductScreenProps {
  navigation: ProductScreenNavigationProp;
}

const ProductScreen: React.FC<ProductScreenProps> = ({ navigation }) => {
  const route = useRoute();
  const dispatch = useDispatch();
  const { product_id } = route.params as { product_id: string };
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, any>>({});
  const [quantity, setQuantity] = useState(1);
  const [isOptionsValid, setIsOptionsValid] = useState(true);
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [descExpanded, setDescExpanded] = useState(false);
  const insets = useSafeAreaInsets();
  const flatListRef = useRef<FlatList<any> | null>(null);
  const productOptionsRef = useRef<any>(null);
  const { width: screenWidth } = Dimensions.get('window');

  const images = useMemo(() => {
    if (!product) return [] as string[];
    const main = product.image || product.thumb || null;
    const others = Array.isArray(product.images) ? product.images.filter(Boolean) : [];
    const list: string[] = [];
    if (main) list.push(main);
    list.push(...others);
    if (list.length === 0) list.push('https://via.placeholder.com/600');
    return list;
  }, [product]);

  // helpers: parse numeric values from API (strings like "$50.00")
  const parseNumber = (v: any) => {
    if (v == null) return NaN;
    const n = Number(String(v).replace(/[^0-9.-]+/g, ''));
    return Number.isNaN(n) ? NaN : n;
  };

  const rewardPointsValue = useMemo(() => {
    const v = product?.points ?? product?.reward_points ?? product?.reward;
    const n = parseNumber(v);
    return Number.isNaN(n) ? 0 : n;
  }, [product]);

  useEffect(() => {
    const hasDescription = Boolean(product?.description && String(product.description).replace(/<[^>]*>?/gm, '').trim());
    const hasSpec = Array.isArray(product?.attribute_groups) && product.attribute_groups.length > 0;
    const hasReviews = Number(product?.reviews) > 0;
    const tabs: string[] = [];
    if (hasDescription) tabs.push('description');
    if (hasSpec) tabs.push('spec');
    if (hasReviews) tabs.push('reviews');

    if (tabs.length === 0) {
      if (activeTab !== null) setActiveTab(null);
      return;
    }

    if (!activeTab || !tabs.includes(activeTab)) {
      setActiveTab(tabs[0]);
    }
  }, [product?.description, product?.attribute_groups?.length, product?.reviews]);

  const taxValue = useMemo(() => {
    const n = parseNumber(product?.tax);
    return Number.isNaN(n) ? 0 : n;
  }, [product]);

  const uniqueRelatedProducts = useMemo(() => {
    if (!Array.isArray(product?.related)) {
      return [];
    }
    const unique = product.related.reduce((acc: any[], current: any) => {
      if (current && current.id && !acc.find((item: any) => item.id === current.id)) {
        acc.push(current);
      }
      return acc;
    }, []);
    return unique;
  }, [product?.related]);

  const getFormattedOptions = (selected: Record<string, any>, productOptions: any[]): CartItemOption[] => {
    const formatted: CartItemOption[] = [];
    productOptions.forEach(opt => {
      const selectedValue = selected[opt.product_option_id];
      if (selectedValue) {
        if (['radio', 'select'].includes(opt.type)) {
          const optionValue = opt.product_option_value.find((val: any) => String(val.product_option_value_id) === String(selectedValue));
          if (optionValue) {
            formatted.push({
              optionId: String(opt.product_option_id),
              optionName: opt.name,
              optionValue: optionValue.name,
              optionValueId: String(optionValue.product_option_value_id),
              price: optionValue.price ? parseNumber(optionValue.price) : undefined,
              pricePrefix: optionValue.price_prefix,
            });
          }
        } else if (opt.type === 'checkbox') {
          const selectedValues = Array.isArray(selectedValue) ? selectedValue : [selectedValue];
          opt.product_option_value
            .filter((val: any) => selectedValues.includes(String(val.product_option_value_id)))
            .forEach((val: any) => {
              formatted.push({
                optionId: String(opt.product_option_id),
                optionName: opt.name,
                optionValue: val.name,
                optionValueId: String(val.product_option_value_id),
                price: val.price ? parseNumber(val.price) : undefined,
                pricePrefix: val.price_prefix,
              });
            });
        } else {
          formatted.push({
            optionId: String(opt.product_option_id),
            optionName: opt.name,
            optionValue: String(selectedValue),
          });
        }
      }
    });
    return formatted;
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const url = `${BASE_URL}.getProductDetail&product_id=${product_id}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const normalizedProduct = {
          ...data,
          id: data.product_id,
        };
        setProduct(normalizedProduct);
      } catch (err) {
        console.error('Failed to fetch product details:', err);
        setError('Failed to fetch product details.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [product_id]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#FF6B3E" />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.centered}>
          <Text>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      <View style={[styles.contentContainer]}>
        <ScrollView>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="chevron-back" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{product.name}</Text>
            <TouchableOpacity
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="share-outline" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          {/* Product Images */}
          <View style={styles.imageContainer}>
            <FlatList
              ref={flatListRef}
              data={images}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              keyExtractor={(_, idx) => String(idx)}
              renderItem={({ item }) => (
                <View style={{ width: screenWidth }}>
                  <Image source={{ uri: item }} style={[styles.image, { width: screenWidth }]} />
                </View>
              )}
              onMomentumScrollEnd={(e) => {
                const newIndex = Math.round(e.nativeEvent.contentOffset.x / screenWidth);
                setCurrentImageIndex(newIndex);
              }}
            />

            <View style={styles.imageDots}>
              {images.map((item, index) => (
                <TouchableOpacity
                  key={item + '-' + index}
                  onPress={() => {
                    flatListRef.current?.scrollToIndex({ index, animated: true });
                    setCurrentImageIndex(index);
                  }}
                  style={[styles.dot, currentImageIndex === index && styles.activeDot]}
                />
              ))}
            </View>
          </View>

          {/* Product Info */}
          <View style={styles.infoContainer}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{product?.name ?? 'Product'}</Text>
              <WishlistButton
                product={{
                  id: product_id,
                  name: product.name,
                  price: parseNumber(product.price),
                  special: product.special ? parseNumber(product.special) : undefined,
                  image: product.image || product.thumb,
                }}
              />
            </View>

            {/* Product meta: show only when data exists */}
            <View style={styles.metaContainer}>
              {product?.manufacturer ? (
                <View style={styles.metaRow}>
                  <Text style={styles.metaLabel}>Brand:</Text>
                  <Text style={styles.metaValue}>{product.manufacturer}</Text>
                </View>
              ) : null}

              {product?.model ? (
                <View style={styles.metaRow}>
                  <Text style={styles.metaLabel}>Product Code:</Text>
                  <Text style={styles.metaValue}>{product.model}</Text>
                </View>
              ) : null}

              {rewardPointsValue > 0 ? (
                <View style={styles.metaRow}>
                  <Text style={styles.metaLabel}>Reward Points:</Text>
                  <Text style={styles.metaValue}>{product?.points ?? product?.reward_points ?? product?.reward}</Text>
                </View>
              ) : null}

              {(product?.stock || product?.availability) ? (
                <View style={styles.metaRow}>
                  <Text style={styles.metaLabel}>Availability:</Text>
                  <Text style={styles.metaValue}>{product.stock ?? product.availability}</Text>
                </View>
              ) : null}
            </View>

            <View style={styles.ratingContainer}>
              <View style={styles.stars}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Ionicons
                    key={star}
                    name={star <= product.rating ? 'star' : 'star-outline'}
                    size={16}
                    color="#FFB800"
                  />
                ))}
              </View>
              <Text style={styles.reviews}>({product.reviews})</Text>
            </View>

            {/* Product Options (radio, checkbox, select, text, date, time, file, textarea) */}
            <ProductOptions
              options={product?.options ?? product?.product_options ?? []}
              ref={productOptionsRef}
              onChange={(selected, isValid) => {
                setSelectedOptions(selected);
                setIsOptionsValid(isValid);
              }}
              onQuantityChange={setQuantity}
              initialQuantity={quantity}
            />

            {/* Tabs: Description / Specification / Reviews (only show tabs with data) */}
            {(() => {
              const hasDescription = Boolean(product?.description && String(product.description).replace(/<[^>]*>?/gm, '').trim());
              const hasSpec = Array.isArray(product?.attribute_groups) && product.attribute_groups.length > 0;
              const hasReviews = Number(product?.reviews) > 0;

              const tabs: { key: string; label: string }[] = [];
              if (hasDescription) tabs.push({ key: 'description', label: 'Description' });
              if (hasSpec) tabs.push({ key: 'spec', label: 'Specification' });
              if (hasReviews) tabs.push({ key: 'reviews', label: `Reviews (${product.reviews})` });

              // if no tabs, show description fallback (if any)
              if (tabs.length === 0) {
                return hasDescription ? (
                  <View style={styles.descriptionContainer}>
                    <Text style={styles.sectionTitle}>Description</Text>
                    <Text style={styles.description} numberOfLines={descExpanded ? undefined : 5}>
                      {String(product.description).replace(/<[^>]*>?/gm, '')}
                    </Text>
                    <TouchableOpacity onPress={() => setDescExpanded((s) => !s)}>
                      <Text style={styles.readMore}>{descExpanded ? 'Show less' : 'Read more'}</Text>
                    </TouchableOpacity>
                  </View>
                ) : null;
              }

              return (
                <View>
                  <View style={styles.tabsRow}>
                    {tabs.map((t) => (
                      <TouchableOpacity
                        key={t.key}
                        onPress={() => setActiveTab(t.key)}
                        style={[styles.tabButton, activeTab === t.key && styles.activeTabButton]}
                      >
                        <Text style={[styles.tabLabel, activeTab === t.key && styles.activeTabLabel]}>{t.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <View style={styles.tabContent}>
                    {activeTab === 'description' && hasDescription && (
                      <View style={styles.descriptionContainer}>
                        <Text style={styles.description} numberOfLines={descExpanded ? undefined : 5}>
                          {String(product.description).replace(/<[^>]*>?/gm, '')}
                        </Text>
                        <TouchableOpacity onPress={() => setDescExpanded((s) => !s)}>
                          <Text style={styles.readMore}>{descExpanded ? 'Show less' : 'Read more'}</Text>
                        </TouchableOpacity>
                      </View>
                    )}

                    {activeTab === 'spec' && hasSpec && (
                      <View style={styles.specContainer}>
                        {product.attribute_groups.map((group: any, gi: number) => (
                          <View key={group.name + '-' + gi} style={styles.specGroup}>
                            <Text style={styles.specGroupTitle}>{group.name}</Text>
                            {Array.isArray(group.attribute) && group.attribute.map((attr: any, ai: number) => (
                              <View key={attr.name + '-' + ai} style={styles.specRow}>
                                <Text style={styles.specName}>{attr.name}</Text>
                                <Text style={styles.specValue}>{attr.text}</Text>
                              </View>
                            ))}
                          </View>
                        ))}
                      </View>
                    )}

                    {activeTab === 'reviews' && hasReviews && (
                      <View style={styles.reviewsContainer}>
                        <Text style={styles.sectionTitle}>Reviews ({product.reviews})</Text>
                        {/* Minimal reviews placeholder: if you have review objects, render them here */}
                        <Text style={styles.description}>No detailed reviews available.</Text>
                      </View>
                    )}
                  </View>
                </View>
              );
            })()}

            {/* Related products */}
            {uniqueRelatedProducts.length > 0 ? (
              <View style={styles.relatedContainer}>
                <Text style={styles.sectionTitle}>Related Products</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.relatedScroll}>
                  {uniqueRelatedProducts.map((r: any) => (
                    <ProductCard
                      key={r.id}
                      product={{
                        id: r.id,
                        name: r.name,
                        price: r.price,
                        special: r.special,
                        image: r.image,
                        options: r.options,
                      }}
                      containerStyle={{ width: 220, marginRight: 12 }}
                      imageStyle={{ height: 150 }}
                      onPress={() => navigation.navigate('Product', { product_id: r.id })}
                    />
                  ))}
                </ScrollView>
              </View>
            ) : null}
          </View>
        </ScrollView>

        {/* Bottom Bar */}
        <View style={[styles.bottomBar, { paddingBottom: insets.bottom }]}>
          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>Total price</Text>
            {(product?.special || product?.price) ? (
              <View style={styles.priceRow}>
                <Text style={styles.price}>{product?.special ?? product?.price}</Text>
                {product?.special && product?.price ? (
                  <Text style={styles.oldPrice}>{product.price}</Text>
                ) : null}
              </View>
            ) : null}

            {taxValue > 0 ? (
              <Text style={styles.tax}>Ex Tax: {product.tax}</Text>
            ) : null}

            {rewardPointsValue > 0 ? (
              <Text style={styles.tax}>Price in reward points: {product?.points ?? product?.reward_points ?? product?.reward}</Text>
            ) : null}
          </View>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              const optionsComponent = productOptionsRef.current;
              if (optionsComponent && optionsComponent.validateOptions()) {
                const formattedOptions = getFormattedOptions(selectedOptions, product?.options ?? product?.product_options ?? []);
                const cartPayload = {
                  id: product_id,
                  name: product.name,
                  basePrice: parseNumber(product.price),
                  specialPrice: product.special ? parseNumber(product.special) : undefined,
                  image: product.image || product.thumb,
                  options: formattedOptions,
                  quantityToAdd: quantity,
                };
                console.log('cartPayload',cartPayload);
                dispatch(addToCart(cartPayload));
                Toast.show({
                  type: 'simple',
                  text1: 'Added to cart',
                  text2: `${product.name} has been added to your cart.`,
                });
              } else {
                Alert.alert('Required Options', 'Please select all required options');
              }
            }}
          >
            <Ionicons name="bag-outline" size={20} color="#FFF" />
            <Text style={styles.addButtonText}>Add to bag</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 400,
    resizeMode: 'cover',
  },
  imageDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 20,
    width: '100%',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF6B3E',
    marginHorizontal: 4,
    opacity: 0.4,
  },
  activeDot: {
    opacity: 1,
    backgroundColor: '#FF6B3E',
  },
  infoContainer: {
    padding: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    flex: 1,
    marginRight: 16,
    color: '#0F172A',
    letterSpacing: 0.2,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  stars: {
    flexDirection: 'row',
    marginRight: 8,
  },
  reviews: {
    color: '#666',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  sizeContainer: {
    marginBottom: 24,
  },
  sizeOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  sizeButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  selectedSize: {
    backgroundColor: '#FF6B3E',
  },
  sizeText: {
    fontSize: 16,
    color: '#666',
  },
  selectedSizeText: {
    color: '#FFF',
  },
  descriptionContainer: {
    marginBottom: 24,
  },
  tabsRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    marginBottom: 12,
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginRight: 8,
    borderRadius: 8,
  },
  activeTabButton: {
    backgroundColor: '#FFF',
    borderBottomWidth: 2,
    borderBottomColor: '#000',
  },
  tabLabel: {
    fontSize: 15,
    color: '#6B7280',
  },
  activeTabLabel: {
    color: '#000',
    fontWeight: '600',
  },
  tabContent: {
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 8,
  },
  readMore: {
    color: '#FF6B3E',
    fontSize: 16,
  },
  relatedContainer: {
    marginTop: 16,
    paddingLeft: 8,
  },
  relatedScroll: {
    paddingVertical: 8,
    paddingRight: 16,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    backgroundColor: '#FFF',
  },
  priceContainer: {
    flex: 1,
    marginRight: 16,
  },
  priceLabel: {
    fontSize: 14,
    color: '#666',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  oldPrice: {
    fontSize: 14,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
    marginLeft: 8,
  },
  tax: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 6,
  },
  price: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B3E',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  metaContainer: {
    marginTop: 12,
    marginHorizontal: 4,
    backgroundColor: '#FAFAFB',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    // subtle border/shadow
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  metaLabel: {
    color: '#6B7280',
    fontSize: 13,
    width: 140,
    fontWeight: '500',
  },
  metaValue: {
    color: '#0F172A',
    fontSize: 15,
    fontWeight: '700',
    flex: 1,
  },
  thumbsContainer: {
    marginTop: 12,
  },
  specContainer: {
    paddingVertical: 6,
  },
  specGroup: {
    marginBottom: 12,
  },
  specGroupTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 6,
  },
  specRow: {
    flexDirection: 'row',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  specName: {
    width: 140,
    color: '#6B7280',
  },
  specValue: {
    flex: 1,
    color: '#0F172A',
  },
  reviewsContainer: {
    marginBottom: 16,
  },
  thumbsScroll: {
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  thumbButton: {
    marginRight: 8,
    borderRadius: 6,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  activeThumb: {
    borderColor: '#FF6B3E',
  },
  thumbImage: {
    width: 72,
    height: 72,
    resizeMode: 'cover',
  },
});

export default ProductScreen;