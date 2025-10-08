import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CategoryScreen from '../screens/category/CategoryScreen';

export type CategoryStackParamList = {
  Category: { category_id?: string };
};

const Stack = createNativeStackNavigator<CategoryStackParamList>();

const CategoryStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Category" component={CategoryScreen} />
    </Stack.Navigator>
  );
};

export default CategoryStack;
