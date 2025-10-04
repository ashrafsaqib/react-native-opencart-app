import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface Review {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  rating: number;
  comment: string;
  date: string;
  productName: string;
}

interface Props {
  reviews?: Array<{ author?: string; text?: string; rating?: string; date_added?: string }>;
}

const Reviews = ({ reviews }: Props) => {
  const reviewsData: Review[] = (reviews && reviews.length)
    ? reviews.map((r, idx) => ({
        id: `${idx}`,
        user: { name: r.author ?? 'Anonymous', avatar: 'https://via.placeholder.com/100' },
        rating: Number(r.rating) || 0,
        comment: r.text ?? '',
        date: r.date_added ?? '',
        productName: '',
      }))
    : [];
  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, index) => (
      <Ionicons
        key={index}
        name={index < rating ? 'star' : 'star-outline'}
        size={16}
        color="#FFB800"
        style={styles.star}
      />
    ));
  };

  const renderReview = (review: Review) => (
    <View key={review.id} style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <Image source={{ uri: review.user.avatar }} style={styles.avatar} />
        <View style={styles.reviewHeaderText}>
          <Text style={styles.userName}>{review.user.name}</Text>
          <View style={styles.ratingContainer}>
            {renderStars(review.rating)}
          </View>
        </View>
        <Text style={styles.date}>{review.date}</Text>
      </View>
      <Text style={styles.productName}>{review.productName}</Text>
      <Text style={styles.comment}>{review.comment}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Customer Reviews</Text>
        <TouchableOpacity style={styles.viewAllButton}>
          <Text style={styles.viewAllText}>View all</Text>
          <Ionicons name="chevron-forward" size={16} color="#FF6B3E" />
        </TouchableOpacity>
      </View>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.reviewsContainer}
      >
        {reviewsData.map(renderReview)}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
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
    color: '#333',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    color: '#FF6B3E',
    marginRight: 4,
  },
  reviewsContainer: {
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  reviewCard: {
    width: 300,
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  reviewHeaderText: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
  },
  star: {
    marginRight: 2,
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
  productName: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  comment: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
});

export default Reviews;