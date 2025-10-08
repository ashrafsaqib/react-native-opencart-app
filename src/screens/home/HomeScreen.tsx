import React, { useCallback, useEffect, useState } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  ActivityIndicator,
  Text,
  RefreshControl,
} from 'react-native';
import Header from '../../components/Header';
import Carousel from '../../components/Carousel';
import Deals from '../../components/Deals';
import Categories from '../../components/Categories';
import Products from '../../components/Products';
import Reviews from '../../components/Reviews';
import SocialFeed from '../../components/SocialFeed';
import TrustBadges from '../../components/TrustBadges';
import SafeScreen from '../../components/SafeScreen';
import FeatureCategories from '../../components/FeatureCategories';
import { BASE_URL } from '../../../config';

const HomeScreen = () => {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchHomeData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}.getHomePageData`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setData(json);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch home data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomeData();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchHomeData();
    setRefreshing(false);
  }, []);

  return (
    <SafeScreen>
      <Header />
      {loading ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 24,
          }}>
          <ActivityIndicator size="large" color="#FF6B3E" />
        </View>
      ) : error ? (
        <View style={{ padding: 24 }}>
          <Text style={{ color: 'red' }}>{error}</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          <Carousel banners={data?.banner} />
          {data?.deal ? <Deals deal={data.deal} onExpired={fetchHomeData} /> : null}
          <FeatureCategories categories={data?.feature_category} />
          <Reviews reviews={data?.reviews} />
          <TrustBadges badges={data?.trust_badges} />
          <SocialFeed />
        </ScrollView>
      )}
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
