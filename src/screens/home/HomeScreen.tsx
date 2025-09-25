import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import Header from '../../components/Header';
import Carousel from '../../components/Carousel';
import Deals from '../../components/Deals';
import Categories from '../../components/Categories';
import Products from '../../components/Products';
import Reviews from '../../components/Reviews';
import SocialFeed from '../../components/SocialFeed';
import TrustBadges from '../../components/TrustBadges';
import SafeScreen from '../../components/SafeScreen';

const HomeScreen = () => {
  return (
    <SafeScreen>
      <Header />
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Carousel />
        <Deals />
        <Categories />
        <Products />
        <Reviews />
        <TrustBadges />
        <SocialFeed />
      </ScrollView>
    </SafeScreen>
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
