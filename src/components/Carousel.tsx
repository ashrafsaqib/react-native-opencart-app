import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Image, Dimensions } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

const carouselData = [
  { id: '1', image: 'https://picsum.photos/id/1015/1000/600' },
  { id: '2', image: 'https://picsum.photos/id/1016/1000/600' },
  { id: '3', image: 'https://picsum.photos/id/1018/1000/600' },
];

const Carousel = () => {
  const flatListRef = useRef<FlatList<any>>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (activeIndex + 1) % carouselData.length;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setActiveIndex(nextIndex);
    }, 3000);

    return () => clearInterval(interval);
  }, [activeIndex]);

  const onMomentumScrollEnd = (event: any) => {
    const newIndex = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
    setActiveIndex(newIndex);
  };

  const renderItem = ({ item }: { item: typeof carouselData[0] }) => (
    <View style={styles.slide}>
      <Image source={{ uri: item.image }} style={styles.image} />
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={carouselData}
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