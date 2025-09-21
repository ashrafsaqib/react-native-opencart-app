import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Header from '../../components/Header';
import Banner from '../../components/Banner';
import Categories from '../../components/Categories';
import Products from '../../components/Products';
import BottomNavigation from '../../components/BottomNavigation';

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Header />
      <ScrollView style={styles.content}>
        <Banner />
        <Categories />
        <Products />
      </ScrollView>
      <BottomNavigation />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  content: {
    flex: 1,
  },
});

export default HomeScreen;
