import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

export interface CartItemOption {
  optionId: string;
  optionName: string;
  optionValue: string;
  optionValueId?: string;
  price?: number; // Price modifier for this option
  pricePrefix?: string; // e.g., '+', '-'
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  special?: number;
  options: CartItemOption[];
  quantity: number;
  image: string;
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (
      state,
      action: PayloadAction<
        Omit<CartItem, 'quantity' | 'price' | 'special'> &
          { basePrice: number; specialPrice?: number; quantityToAdd?: number; }
      >
    ) => {
      const newOptionsString = JSON.stringify(action.payload.options);
      const quantityToAdd = action.payload.quantityToAdd ?? 1; // Get quantityToAdd

      const existingItem = state.items.find(
        (item) =>
          item.id === action.payload.id &&
          JSON.stringify(item.options) === newOptionsString
      );

      if (existingItem) {
        existingItem.quantity += quantityToAdd; // Increment by quantityToAdd
      } else {
        let itemPrice = action.payload.basePrice;
        if (action.payload.specialPrice !== undefined) {
          itemPrice = action.payload.specialPrice;
        }

        action.payload.options.forEach((option) => {
          if (option.price !== undefined && option.pricePrefix) {
            if (option.pricePrefix === '+') {
              itemPrice += option.price;
            } else if (option.pricePrefix === '-') {
              itemPrice -= option.price;
            }
          }
        });

        state.items.push({
          ...action.payload,
          price: itemPrice,
          special: action.payload.specialPrice,
          quantity: quantityToAdd, // Use quantityToAdd for new item
        });
      }
    },
    removeFromCart: (
      state,
      action: PayloadAction<{ id: string; options: CartItemOption[] }>
    ) => {
      const optionsString = JSON.stringify(action.payload.options);
      state.items = state.items.filter(
        (item) =>
          !(item.id === action.payload.id && JSON.stringify(item.options) === optionsString)
      );
    },
    incrementQuantity: (
      state,
      action: PayloadAction<{ id: string; options: CartItemOption[] }>
    ) => {
      const optionsString = JSON.stringify(action.payload.options);
      const item = state.items.find(
        (item) =>
          item.id === action.payload.id && JSON.stringify(item.options) === optionsString
      );
      if (item) {
        item.quantity++;
      }
    },
    decrementQuantity: (
      state,
      action: PayloadAction<{ id: string; options: CartItemOption[] }>
    ) => {
      const optionsString = JSON.stringify(action.payload.options);
      const item = state.items.find(
        (item) =>
          item.id === action.payload.id && JSON.stringify(item.options) === optionsString
      );
      if (item && item.quantity > 1) {
        item.quantity--;
      } else {
        state.items = state.items.filter(
          (item) =>
            !(item.id === action.payload.id && JSON.stringify(item.options) === optionsString)
        );
      }
    },
  },
});

export const { addToCart, removeFromCart, incrementQuantity, decrementQuantity } = cartSlice.actions;

export const selectIsInCart = (state: RootState, productId: string, options: CartItemOption[]) => {
  const optionsString = JSON.stringify(options);
  return state.cart.items.some(item => item.id === productId && JSON.stringify(item.options) === optionsString);
};

export default cartSlice.reducer;
