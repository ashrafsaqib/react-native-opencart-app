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

const reviews: Review[] = [
  {
    id: '1',
    user: {
      name: 'John D.',
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=100&h=100'
    },
    rating: 5,
    comment: 'Perfect fit and great quality. Exactly what I was looking for!',
    date: '2 days ago',
    productName: 'Original Stripe Polo'
  },
  {
    id: '2',
    user: {
      name: 'Sarah M.',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100'
    },
    rating: 4,
    comment: 'Beautiful design and comfortable material. Quick delivery too.',
    date: '1 week ago',
    productName: 'Training Dri-FIT 2.0'
  },
  {
    id: '3',
    user: {
      name: 'Mike R.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100'
    },
    rating: 5,
    comment: 'Exceeded my expectations! Will definitely buy again.',
    date: '2 weeks ago',
    productName: 'Diesel S-KB Sneakers'
  }
];

const Reviews = () => {
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
        {reviews.map(renderReview)}
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