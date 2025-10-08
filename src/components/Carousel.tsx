import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Image, Dimensions, TouchableOpacity, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width: screenWidth } = Dimensions.get('window');

const carouselData = [
  { id: '1', image: 'https://picsum.photos/id/1015/1000/600' },
  { id: '2', image: 'https://picsum.photos/id/1016/1000/600' },
  { id: '3', image: 'https://picsum.photos/id/1018/1000/600' },
];

interface Banner {
  title?: string;
  link_type?: string;
  link?: string | number;
  image?: string;
}

interface Props {
  banners?: Array<Banner>;
}

const Carousel = ({ banners }: Props) => {
  const flatListRef = useRef<FlatList<any>>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const navigation: any = useNavigation();

  const data = (banners && banners.length)
    ? banners.map((b, idx) => ({ id: `${idx}`, image: b.image ?? '', link: b.link ?? '', link_type: b.link_type ?? 'external' }))
    : carouselData;

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (activeIndex + 1) % data.length;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setActiveIndex(nextIndex);
    }, 3000);

    return () => clearInterval(interval);
  }, [activeIndex, data.length]);

  const onMomentumScrollEnd = (event: any) => {
    const newIndex = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
    setActiveIndex(newIndex);
  };

  const openLink = async (rawLink?: string | number, type?: string) => {
    if (type === 'product') {
      const id = String(rawLink);
      navigation.navigate('Product', { product_id: id });
      return;
    }
    if (type === 'category') {
      const id = String(rawLink);
      navigation.navigate('CategoryTab', { screen: 'Category', params: { category_id: id } } as any);
      return;
    }

    if (!rawLink) return;
    let link = String(rawLink).replace(/&amp;/g, '&');
    if (!/^https?:\/\//i.test(link)) {
      link = `http://${link}`;
    }

    try {
      await Linking.openURL(link);
      return;
    } catch (err) {
      console.warn('openURL failed, trying encodeURI', link, err);
    }

    try {
      const encoded = encodeURI(link);
      await Linking.openURL(encoded);
    } catch (err) {
      console.warn('Cannot open link after encodeURI', link, err);
    }
  };

  const renderItem = ({ item }: { item: { id: string; image: string; link?: string | number; link_type?: string } }) => (
    <View style={styles.slide}>
      <TouchableOpacity onPress={() => openLink(item.link, item.link_type)} activeOpacity={0.8}>
        <Image source={{ uri: item.image }} style={styles.image} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onMomentumScrollEnd}
      />
      <View style={styles.dotsContainer}>
        {data.map((_, i) => (
          <TouchableOpacity
            key={i}
            style={[styles.dot, i === activeIndex && styles.activeDot]}
            onPress={() => {
              flatListRef.current?.scrollToIndex({ index: i, animated: true });
              setActiveIndex(i);
            }}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 200,
  },
  slide: {
    width: screenWidth,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: screenWidth - 32,
    height: 180,
    borderRadius: 16,
  },
  dotsContainer: {
    position: 'absolute',
    bottom: 8,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
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
});

export default Carousel;