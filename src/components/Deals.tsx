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
import { useNavigation } from '@react-navigation/native';
import ProductCard from './ProductCard';

interface TimeLeft {
  hours: number;
  minutes: number;
  seconds: number;
}

interface Props {
  deal?: {
    end_date?: string;
    products?: Array<{
      id?: string;
      name?: string;
      image?: string;
      price?: string;
      special?: string | null;
      discount?: number;
      options?: boolean
    }>;
  };
  onExpired?: () => void;
}

const Deals = ({ deal, onExpired }: Props) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    hours: 4,
    minutes: 0,
    seconds: 0,
  });
  const navigation: any = useNavigation();
  const [expired, setExpired] = useState(false);
  useEffect(() => {
    if (!deal?.end_date) return;

    const target = new Date(deal.end_date);
    if (isNaN(target.getTime())) return;

    const update = () => {
      const now = new Date();
      const diff = Math.max(0, Math.floor((target.getTime() - now.getTime()) / 1000));

      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        if (!expired) {
          setExpired(true);
          try {
            onExpired && onExpired();
          } catch (e) {
          }
        }
        return;
      }
      if (expired) setExpired(false);
      const hours = Math.floor(diff / 3600);
      const minutes = Math.floor((diff % 3600) / 60);
      const seconds = diff % 60;

      setTimeLeft({ hours, minutes, seconds });
    };

    update();

    const id: any = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [deal?.end_date]);

  const deals = (deal?.products && deal.products.length)
    ? deal.products.map((p, idx) => ({
      id: p.id ?? `${idx}`,
      title: p.name ?? 'Product',
      price: p.special ?? p.price ?? '$0',
      originalPrice: p.price ?? p.special ?? '$0',
      discount: (() => {
        if (p?.discount != null) return `${p.discount}%`;
        const parse = (v?: string | null) => {
          if (v == null) return NaN;
          return parseFloat(String(v).replace(/[^0-9.-]+/g, ''));
        };
        const orig = parse(p.price);
        const sale = parse(p.special ?? p.price);
        if (!isNaN(orig) && !isNaN(sale) && orig > sale) {
          const pct = Math.round((1 - sale / orig) * 100);
          return `${pct}%`;
        }
        return '0%';
      })(),
      image: p.image ?? 'https://via.placeholder.com/250',
      options: p.options,
    }))
    : [];

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
          <ProductCard
            key={deal.id}
            product={{
              id: deal.id,
              name: deal.title,
              price: deal.price,
              special: deal.originalPrice,
              image: deal.image,
              options: deal.options,
            }}
            onPress={() => navigation.navigate('Product', { product_id: deal.id })}
            badge={<View style={styles.discountBadge}><Text style={styles.discountText}>{deal.discount}</Text></View>}
            containerStyle={{ width: 200, marginRight: 12 }}
            imageStyle={{ height: 150 }}
          />
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
    paddingBottom: 8,
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
});

export default Deals;