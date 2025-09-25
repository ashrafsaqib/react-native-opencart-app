import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const faqs = [
  {
    id: '1',
    question: 'How do I track my order?',
    answer: 'You can track your order in the "Order History" section of your profile. Click on the order you want to track to see its status.',
  },
  {
    id: '2',
    question: 'What is your return policy?',
    answer: 'We offer a 30-day return policy for most items. Please visit our returns page for more details.',
  },
  {
    id: '3',
    question: 'How do I cancel an order?',
    answer: 'You can cancel an order within 24 hours of placing it. Go to your order history and select the order you wish to cancel.',
  },
];

const HelpCenterScreen = () => {
  const renderFaq = ({ item }: { item: typeof faqs[0] }) => (
    <View style={styles.faqContainer}>
      <Text style={styles.question}>{item.question}</Text>
      <Text style={styles.answer}>{item.answer}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Help Center</Text>
      <FlatList
        data={faqs}
        renderItem={renderFaq}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />
      <TouchableOpacity style={styles.contactButton}>
        <Ionicons name="chatbubble-ellipses-outline" size={24} color="#fff" />
        <Text style={styles.contactButtonText}>Contact Us</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  faqContainer: {
    marginBottom: 24,
  },
  question: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  answer: {
    fontSize: 14,
    color: '#666',
  },
  contactButton: {
    backgroundColor: '#FF6B3E',
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  contactButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default HelpCenterScreen;