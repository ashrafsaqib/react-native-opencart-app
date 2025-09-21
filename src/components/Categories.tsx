import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

const categories = [
  { id: '1', name: 'Coats' },
  { id: '2', name: 'Popular' },
  { id: '3', name: 'New In' },
  { id: '4', name: 'Jackets' },
];

const Categories = () => {
  const [selectedCategory, setSelectedCategory] = useState('1');

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {categories.map((category) => (
        <TouchableOpacity
          key={category.id}
          style={[
            styles.category,
            selectedCategory === category.id && styles.selectedCategory,
          ]}
          onPress={() => setSelectedCategory(category.id)}
        >
          <Text
            style={[
              styles.categoryName,
              selectedCategory === category.id && styles.selectedCategoryName,
            ]}
          >
            {category.name}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  category: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
  },
  selectedCategory: {
    backgroundColor: '#FF6B3E',
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  selectedCategoryName: {
    color: '#FFF',
  },
});

export default Categories;
