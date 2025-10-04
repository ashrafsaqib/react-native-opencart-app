import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Image, Dimensions, TouchableOpacity, Linking } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

const carouselData = [
  { id: '1', image: 'https://picsum.photos/id/1015/1000/600' },
  { id: '2', image: 'https://picsum.photos/id/1016/1000/600' },
  { id: '3', image: 'https://picsum.photos/id/1018/1000/600' },
];

interface Props {
  banners?: Array<{ title?: string; link?: string; image?: string }>;
}

const Carousel = ({ banners }: Props) => {
  const flatListRef = useRef<FlatList<any>>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const data = (banners && banners.length)
    ? banners.map((b, idx) => ({ id: `${idx}`, image: b.image ?? '', link: b.link ?? '' }))
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

  const openLink = async (rawLink?: string) => {
    if (!rawLink) return;
    const link = rawLink.replace(/&amp;/g, '&');
    try {
      const supported = await Linking.canOpenURL(link);
      if (supported) await Linking.openURL(link);
    } catch (err) {
      console.warn('Cannot open link', link, err);
    }
  };

  const renderItem = ({ item }: { item: { id: string; image: string; link?: string } }) => (
    <View style={styles.slide}>
      <TouchableOpacity onPress={() => openLink(item.link)} activeOpacity={0.8}>
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
});

export default Carousel;