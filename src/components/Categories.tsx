import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const categories = [
  { id: '1', name: 'Electronics', icon: 'phone-portrait' },
  { id: '2', name: 'Clothing', icon: 'shirt' },
  { id: '3', name: 'Books', icon: 'book' },
  { id: '4', name: 'Home', icon: 'home' },
  { id: '5', name: 'Sports', icon: 'basketball' },
];

const Categories = () => {
  const renderCategory = ({ item }) => (
    <TouchableOpacity style={styles.category}>
      <Ionicons name={item.icon} size={30} color="#000" />
      <Text style={styles.categoryName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Categories</Text>
      <FlatList
        data={categories}
        renderItem={renderCategory}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
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
  category: {
    alignItems: 'center',
    marginRight: 20,
  },
  categoryName: {
    marginTop: 5,
  },
});

export default Categories;
