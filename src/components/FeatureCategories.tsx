import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Products from './Products';

interface Props {
  categories?: Array<{
    category_id?: string;
    name?: string;
    image?: string;
    products?: Array<{ name?: string; image?: string; price?: string; special?: string | null }>; 
  }>;
}

const FeatureCategories = ({ categories }: Props) => {
  if (!categories || !categories.length) return null;

  const [selected, setSelected] = useState(0);

  const selectedCategory = categories[selected] || categories[0];

  return (
    <View style={styles.container}>
      <View style={styles.categoriesRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesScroll}>
          {categories.map((cat, idx) => (
            <TouchableOpacity
              key={cat.category_id ?? idx}
              style={[styles.categoryTab, selected === idx && styles.categoryTabActive]}
              onPress={() => setSelected(idx)}
            >
              <Text style={[styles.categoryTabText, selected === idx && styles.categoryTabTextActive]} numberOfLines={1}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.productsSection}>
        {/* Reuse the app's Products component so selected category products
            render with the same look & feel as the rest of the app */}
        <Products products={selectedCategory.products} title={selectedCategory.name} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { paddingVertical: 16 },
  categoriesRow: { marginBottom: 12 },
  categoriesScroll: { paddingHorizontal: 16 },
  categoryTab: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    marginRight: 8,
  },
  categoryTabActive: { backgroundColor: '#FF6B3E' },
  categoryTabText: { color: '#666', fontSize: 14 },
  categoryTabTextActive: { color: '#FFF' },
  productsSection: { paddingBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '600', paddingHorizontal: 16, marginBottom: 8 },
  productsContainer: { paddingLeft: 16 },
});

export default FeatureCategories;
