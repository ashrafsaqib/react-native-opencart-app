import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Linking } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface SocialPost {
  id: string;
  image: string;
  likes: number;
  platform: 'instagram' | 'facebook';
  link: string;
}

const socialPosts: SocialPost[] = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=400&h=400',
    likes: 234,
    platform: 'instagram',
    link: 'https://instagram.com'
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=400&h=400',
    likes: 456,
    platform: 'instagram',
    link: 'https://instagram.com'
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1475180098004-ca77a66827be?auto=format&fit=crop&w=400&h=400',
    likes: 789,
    platform: 'instagram',
    link: 'https://instagram.com'
  }
];

const SocialFeed = () => {
  const openLink = (url: string) => {
    Linking.openURL(url);
  };

  const renderSocialPost = (post: SocialPost) => (
    <TouchableOpacity 
      key={post.id} 
      style={styles.postCard}
      onPress={() => openLink(post.link)}
    >
      <Image source={{ uri: post.image }} style={styles.postImage} />
      <View style={styles.postOverlay}>
        <View style={styles.likesContainer}>
          <Ionicons name="heart" size={16} color="#FFF" />
          <Text style={styles.likesText}>{post.likes}</Text>
        </View>
        <Ionicons 
          name={post.platform === 'instagram' ? 'logo-instagram' : 'logo-facebook'} 
          size={20} 
          color="#FFF" 
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Follow Us @YourBrand</Text>
        <View style={styles.socialLinks}>
          <TouchableOpacity 
            style={styles.socialButton}
            onPress={() => openLink('https://instagram.com')}
          >
            <Ionicons name="logo-instagram" size={24} color="#FF6B3E" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.socialButton}
            onPress={() => openLink('https://facebook.com')}
          >
            <Ionicons name="logo-facebook" size={24} color="#FF6B3E" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.socialButton}
            onPress={() => openLink('https://twitter.com')}
          >
            <Ionicons name="logo-twitter" size={24} color="#FF6B3E" />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.feedContainer}
      >
        {socialPosts.map(renderSocialPost)}
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
  socialLinks: {
    flexDirection: 'row',
    gap: 16,
  },
  socialButton: {
    padding: 4,
  },
  feedContainer: {
    paddingHorizontal: 12,
  },
  postCard: {
    width: 200,
    height: 200,
    borderRadius: 12,
    marginHorizontal: 4,
    overflow: 'hidden',
  },
  postImage: {
    width: '100%',
    height: '100%',
  },
  postOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  likesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  likesText: {
    color: '#FFF',
    fontWeight: '500',
  },
});

export default SocialFeed;