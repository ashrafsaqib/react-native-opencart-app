import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartItem {
  id: string;
  name: string;
  price: number;
  size: string;
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
    addToCart: (state, action: PayloadAction<Omit<CartItem, 'quantity'>>) => {
      const existingItem = state.items.find(item => item.id === action.payload.id && item.size === action.payload.size);
      if (existingItem) {
        existingItem.quantity++;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
    },
    removeFromCart: (state, action: PayloadAction<{ id: string; size: string }>) => {
      state.items = state.items.filter(item => !(item.id === action.payload.id && item.size === action.payload.size));
    },
    incrementQuantity: (state, action: PayloadAction<{ id: string; size: string }>) => {
      const item = state.items.find(item => item.id === action.payload.id && item.size === action.payload.size);
      if (item) {
        item.quantity++;
      }
    },
    decrementQuantity: (state, action: PayloadAction<{ id: string; size: string }>) => {
      const item = state.items.find(item => item.id === action.payload.id && item.size === action.payload.size);
      if (item && item.quantity > 1) {
        item.quantity--;
      } else {
        state.items = state.items.filter(item => !(item.id === action.payload.id && item.size === action.payload.size));
      }
    },
  },
});

export const { addToCart, removeFromCart, incrementQuantity, decrementQuantity } = cartSlice.actions;
export default cartSlice.reducer;
