import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

interface TimeLeft {
  hours: number;
  minutes: number;
  seconds: number;
}

const Deals = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    hours: 4,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        const totalSeconds =
          prevTime.hours * 3600 + prevTime.minutes * 60 + prevTime.seconds - 1;

        if (totalSeconds <= 0) {
          clearInterval(timer);
          return { hours: 0, minutes: 0, seconds: 0 };
        }

        return {
          hours: Math.floor(totalSeconds / 3600),
          minutes: Math.floor((totalSeconds % 3600) / 60),
          seconds: totalSeconds % 60,
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const deals = [
    {
      id: '1',
      title: 'Summer Collection',
      price: '$29.99',
      originalPrice: '$59.99',
      discount: '50%',
      image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&h=800',
    },
    {
      id: '2',
      title: 'Casual Wear',
      price: '$19.99',
      originalPrice: '$39.99',
      discount: '50%',
      image: 'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&w=800&h=800',
    },
    {
      id: '3',
      title: 'Sports Collection',
      price: '$24.99',
      originalPrice: '$49.99',
      discount: '50%',
      image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&h=800',
    },
  ];

  const formatNumber = (num: number): string => {
    return num < 10 ? `0${num}` : num.toString();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Flash Deals</Text>
        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>Ends in: </Text>
          <View style={styles.timer}>
            <View style={styles.timeUnit}>
              <Text style={styles.timeNumber}>{formatNumber(timeLeft.hours)}</Text>
              <Text style={styles.timeLabel}>hrs</Text>
            </View>
            <Text style={styles.timeSeparator}>:</Text>
            <View style={styles.timeUnit}>
              <Text style={styles.timeNumber}>{formatNumber(timeLeft.minutes)}</Text>
              <Text style={styles.timeLabel}>min</Text>
            </View>
            <Text style={styles.timeSeparator}>:</Text>
            <View style={styles.timeUnit}>
              <Text style={styles.timeNumber}>{formatNumber(timeLeft.seconds)}</Text>
              <Text style={styles.timeLabel}>sec</Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.dealsScroll}
      >
        {deals.map((deal) => (
          <TouchableOpacity key={deal.id} style={styles.dealCard}>
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{deal.discount}</Text>
            </View>
            <Image source={{ uri: deal.image }} style={styles.dealImage} />
            <View style={styles.dealInfo}>
              <Text style={styles.dealTitle} numberOfLines={1}>
                {deal.title}
              </Text>
              <View style={styles.priceContainer}>
                <Text style={styles.price}>{deal.price}</Text>
                <Text style={styles.originalPrice}>{deal.originalPrice}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    backgroundColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timerText: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  timer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B3E',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  timeUnit: {
    alignItems: 'center',
  },
  timeNumber: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  timeLabel: {
    color: '#FFF',
    fontSize: 10,
    marginTop: 2,
  },
  timeSeparator: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 4,
  },
  dealsScroll: {
    paddingLeft: 16,
  },
  dealCard: {
    width: 160,
    marginRight: 16,
    backgroundColor: '#FFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#FF6B3E',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    zIndex: 1,
  },
  discountText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  dealImage: {
    width: '100%',
    height: 160,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  dealInfo: {
    padding: 12,
  },
  dealTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF6B3E',
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 14,
    color: '#666',
    textDecorationLine: 'line-through',
  },
});

export default Deals;